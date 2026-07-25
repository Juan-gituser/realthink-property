"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSurveys, updateSurvey } from "@/services/surveyService";
import { UpdateSurveyValues } from "@/schemas/surveySchema";

export function useSurveys() {
  const queryClient = useQueryClient();

  const { data: surveys = [], isLoading, error } = useQuery({
    queryKey: ["surveys"],
    queryFn: fetchSurveys,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: UpdateSurveyValues }) =>
      updateSurvey(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });

  return {
    surveys,
    isLoading,
    error,
    updateSurvey: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}