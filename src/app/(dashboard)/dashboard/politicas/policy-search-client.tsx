"use client";

import { PolicySearch } from "@/components/policies/policy-search";
import { PolicyActions } from "./policy-actions";

interface Policy {
  id: string;
  name: string;
  status: string;
  currentStep: number;
  completionPct: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface PolicySearchClientProps {
  policies: Policy[];
}

export function PolicySearchClient({ policies }: PolicySearchClientProps) {
  return (
    <PolicySearch
      policies={policies}
      renderActions={(policy) => (
        <PolicyActions
          policyId={policy.id}
          policyName={policy.name}
          isComplete={policy.completionPct === 100}
        />
      )}
    />
  );
}
