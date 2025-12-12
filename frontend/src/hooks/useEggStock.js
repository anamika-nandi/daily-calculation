import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eggsApi } from '../api/eggs';

export const eggQueryKeys = {
  all: ['eggs'],
  today: () => ['eggs', 'today'],
  byDate: (date) => ['eggs', 'date', date],
  allLocations: (date) => ['eggs', 'all', date],
  opening: (date, location) => ['eggs', 'opening', date, location],
};

export function useEggStockToday() {
  return useQuery({
    queryKey: eggQueryKeys.today(),
    queryFn: eggsApi.getToday,
    staleTime: 1000 * 60 * 5,
  });
}

export function useEggStockByDate(date) {
  return useQuery({
    queryKey: eggQueryKeys.byDate(date),
    queryFn: () => eggsApi.getByDate(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAllLocationsEggStock(date) {
  return useQuery({
    queryKey: eggQueryKeys.allLocations(date),
    queryFn: () => eggsApi.getAllLocations(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  });
}

export function useEggOpening(date, location) {
  return useQuery({
    queryKey: eggQueryKeys.opening(date, location),
    queryFn: () => eggsApi.getOpening(date, location),
    enabled: !!date && !!location,
  });
}

export function useCreateOrUpdateEggStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eggsApi.createOrUpdate,
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: eggQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: eggQueryKeys.allLocations(variables.date) });
    },
  });
}

export function useUpdateEggStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => eggsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eggQueryKeys.all });
    },
  });
}

export function useDeleteEggStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eggsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eggQueryKeys.all });
    },
  });
}
