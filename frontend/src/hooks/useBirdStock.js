import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { birdsApi } from '../api/birds';

export const birdQueryKeys = {
  all: ['birds'],
  today: () => ['birds', 'today'],
  byDate: (date) => ['birds', 'date', date],
  allLocations: (date) => ['birds', 'all', date],
  previous: (date, location) => ['birds', 'previous', date, location],
};

export function useBirdStockToday() {
  return useQuery({
    queryKey: birdQueryKeys.today(),
    queryFn: birdsApi.getToday,
    staleTime: 1000 * 60 * 5,
  });
}

export function useBirdStockByDate(date) {
  return useQuery({
    queryKey: birdQueryKeys.byDate(date),
    queryFn: () => birdsApi.getByDate(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAllLocationsBirdStock(date) {
  return useQuery({
    queryKey: birdQueryKeys.allLocations(date),
    queryFn: () => birdsApi.getAllLocations(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  });
}

export function useBirdPrevious(date, location) {
  return useQuery({
    queryKey: birdQueryKeys.previous(date, location),
    queryFn: () => birdsApi.getPrevious(date, location),
    enabled: !!date && !!location,
  });
}

export function useCreateOrUpdateBirdStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: birdsApi.createOrUpdate,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: birdQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: birdQueryKeys.allLocations(variables.date) });
    },
  });
}

export function useUpdateBirdStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => birdsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: birdQueryKeys.all });
    },
  });
}

export function useDeleteBirdStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: birdsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: birdQueryKeys.all });
    },
  });
}
