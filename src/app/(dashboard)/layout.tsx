import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard/nav";
import { OnboardingWrapper } from "@/components/onboarding";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <OnboardingWrapper>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <DashboardNav user={session.user} />
        <main className="pt-16">{children}</main>
      </div>
    </OnboardingWrapper>
  );
}
