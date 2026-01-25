// Analytics utility for tracking wizard events
"use server";

import { prisma } from "./prisma";

interface WizardAnalyticsEvent {
  sessionId: string;
  policyId?: string;
  step: number;
  action: "started" | "completed" | "abandoned" | "error";
  timeSpentSec?: number;
  errorMessage?: string;
}

export async function trackWizardEvent(event: WizardAnalyticsEvent) {
  try {
    await prisma.wizardAnalytics.create({
      data: {
        sessionId: event.sessionId,
        policyId: event.policyId,
        step: event.step,
        action: event.action,
        timeSpentSec: event.timeSpentSec,
        errorMessage: event.errorMessage,
      },
    });
  } catch (error) {
    // Don't throw - analytics should not break the app
    console.error("Error tracking wizard event:", error);
  }
}

export async function trackStepStarted(sessionId: string, policyId: string, step: number) {
  return trackWizardEvent({
    sessionId,
    policyId,
    step,
    action: "started",
  });
}

export async function trackStepCompleted(
  sessionId: string,
  policyId: string,
  step: number,
  timeSpentSec?: number
) {
  return trackWizardEvent({
    sessionId,
    policyId,
    step,
    action: "completed",
    timeSpentSec,
  });
}

export async function trackStepError(
  sessionId: string,
  policyId: string,
  step: number,
  errorMessage: string
) {
  return trackWizardEvent({
    sessionId,
    policyId,
    step,
    action: "error",
    errorMessage,
  });
}

export async function trackWizardAbandoned(
  sessionId: string,
  policyId: string,
  step: number
) {
  return trackWizardEvent({
    sessionId,
    policyId,
    step,
    action: "abandoned",
  });
}

// Get analytics summary for admin
export async function getWizardAnalyticsSummary(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    // Step completion rates
    const stepStats = await prisma.wizardAnalytics.groupBy({
      by: ["step", "action"],
      where: {
        createdAt: { gte: startDate },
      },
      _count: { id: true },
    });

    // Average time per step
    const timeStats = await prisma.wizardAnalytics.groupBy({
      by: ["step"],
      where: {
        action: "completed",
        timeSpentSec: { not: null },
        createdAt: { gte: startDate },
      },
      _avg: { timeSpentSec: true },
    });

    // Abandonment by step
    const abandonmentByStep = stepStats
      .filter((s) => s.action === "abandoned")
      .reduce((acc, curr) => {
        acc[curr.step] = curr._count.id;
        return acc;
      }, {} as Record<number, number>);

    // Completion by step
    const completionByStep = stepStats
      .filter((s) => s.action === "completed")
      .reduce((acc, curr) => {
        acc[curr.step] = curr._count.id;
        return acc;
      }, {} as Record<number, number>);

    // Calculate completion rate per step
    const completionRates: Record<number, number> = {};
    for (let step = 1; step <= 12; step++) {
      const started = stepStats
        .filter((s) => s.step === step && s.action === "started")
        .reduce((acc, curr) => acc + curr._count.id, 0);
      const completed = completionByStep[step] || 0;
      completionRates[step] = started > 0 ? Math.round((completed / started) * 100) : 0;
    }

    return {
      completionRates,
      abandonmentByStep,
      averageTimeByStep: timeStats.reduce((acc, curr) => {
        acc[curr.step] = Math.round(curr._avg.timeSpentSec || 0);
        return acc;
      }, {} as Record<number, number>),
      totalSessions: await prisma.wizardAnalytics.findMany({
        where: { createdAt: { gte: startDate } },
        distinct: ["sessionId"],
      }).then((r) => r.length),
    };
  } catch (error) {
    console.error("Error getting wizard analytics:", error);
    return null;
  }
}
