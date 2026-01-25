import { prisma } from "./prisma";

export interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  link?: string;
  createdAt: Date;
  read: boolean;
}

// Generate notifications based on user activity
export async function generateNotifications(userId: string): Promise<Notification[]> {
  const notifications: Notification[] = [];

  // Get user with policies
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      policies: {
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!user) return notifications;

  // Check for incomplete policies
  const incompletePolicies = user.policies.filter(
    (p) => p.completionPct < 100 && p.status !== "COMPLETED"
  );

  incompletePolicies.forEach((policy) => {
    const daysSinceUpdate = Math.floor(
      (Date.now() - policy.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceUpdate > 7) {
      notifications.push({
        id: `incomplete-${policy.id}`,
        type: "warning",
        title: "Política incompleta",
        message: `Tu política "${policy.name}" lleva ${daysSinceUpdate} días sin actualizar. ¡Complétala para cumplir con la ley!`,
        link: `/dashboard/wizard/${policy.id}/${policy.currentStep}`,
        createdAt: policy.updatedAt,
        read: false,
      });
    } else if (daysSinceUpdate > 3) {
      notifications.push({
        id: `reminder-${policy.id}`,
        type: "info",
        title: "Recordatorio",
        message: `No olvides completar tu política "${policy.name}". Vas en el paso ${policy.currentStep} de 12.`,
        link: `/dashboard/wizard/${policy.id}/${policy.currentStep}`,
        createdAt: policy.updatedAt,
        read: false,
      });
    }
  });

  // Check for completed policies that haven't been downloaded
  const completedPolicies = user.policies.filter(
    (p) => p.completionPct === 100
  );

  for (const policy of completedPolicies) {
    const downloads = await prisma.policyDownload.count({
      where: { policyId: policy.id },
    });

    if (downloads === 0) {
      const daysSinceComplete = Math.floor(
        (Date.now() - policy.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceComplete > 1) {
        notifications.push({
          id: `download-${policy.id}`,
          type: "success",
          title: "Política lista para descargar",
          message: `Tu política "${policy.name}" está completa. ¡Descárgala y publícala en tu sitio web!`,
          link: `/dashboard/wizard/${policy.id}/preview`,
          createdAt: policy.updatedAt,
          read: false,
        });
      }
    }
  }

  // Welcome notification for new users
  const accountAge = Math.floor(
    (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (accountAge < 1 && user.policies.length === 0) {
    notifications.push({
      id: "welcome",
      type: "info",
      title: "¡Bienvenido a TratoDatos!",
      message: "Crea tu primera política de datos y cumple con la Ley 21.719 en minutos.",
      link: "/dashboard/politicas/nueva",
      createdAt: user.createdAt,
      read: false,
    });
  }

  // Plan upgrade suggestion
  if (user.subscriptionTier === "FREE" && user.policies.length >= 1) {
    notifications.push({
      id: "upgrade-plan",
      type: "info",
      title: "Actualiza tu plan",
      message: "Con el plan Profesional puedes crear hasta 5 políticas y exportar sin marca de agua.",
      link: "/dashboard/facturacion",
      createdAt: new Date(),
      read: false,
    });
  }

  // Sort by date, newest first
  notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return notifications.slice(0, 10); // Max 10 notifications
}
