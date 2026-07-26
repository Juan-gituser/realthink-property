"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLeads, updateLeadStage, createLead } from "@/services/leadService";
import { Lead, LeadStage } from "@/types/lead";
import { LeadFormValues } from "@/schemas/leadSchema";

export function useLeads() {
  const queryClient = useQueryClient();

  const {
    data: leads = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });

  // Mutasi untuk mengubah status lead dengan Optimistic Update
  const updateStageMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStage }) => updateLeadStage(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["leads"] });
      const previousLeads = queryClient.getQueryData<Lead[]>(["leads"]);

      queryClient.setQueryData<Lead[]>(["leads"], (old = []) =>
        old.map((lead) => (lead.id === id ? { ...lead, status } : lead))
      );

      return { previousLeads };
    },
    onError: (err, variables, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(["leads"], context.previousLeads);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  // Mutasi tambah lead baru
  const createLeadMutation = useMutation({
    mutationFn: (values: LeadFormValues) => createLead(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  return {
    leads,
    isLoading,
    error,
    updateStage: updateStageMutation.mutate,
    createLead: createLeadMutation.mutate,
    isCreating: createLeadMutation.isPending,
  };
}
