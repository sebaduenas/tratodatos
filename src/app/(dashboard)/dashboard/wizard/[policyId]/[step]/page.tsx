import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WizardContainer } from "@/components/wizard/wizard-container";
import { toPolicyType } from "@/types/policy";

interface WizardPageProps {
  params: Promise<{
    policyId: string;
    step: string;
  }>;
}

export default async function WizardPage({ params }: WizardPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const { policyId, step } = await params;
  const stepNumber = parseInt(step, 10);

  if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 12) {
    notFound();
  }

  const policy = await prisma.policy.findFirst({
    where: {
      id: policyId,
      userId: session.user.id,
    },
  });

  if (!policy) {
    notFound();
  }

  return (
    <WizardContainer
      policy={toPolicyType(policy)}
      currentStep={stepNumber}
      user={session.user}
    />
  );
}
