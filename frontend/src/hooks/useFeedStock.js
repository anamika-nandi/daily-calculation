import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedApi } from '../api/feed';

export const feedQueryKeys = {
  all: ['feed'],
  today: () => ['feed', 'today'],
  byDate: (date) => ['feed', 'date', date],
  allLocations: (date) => ['feed', 'all', date],
  opening: (date, location) => ['feed', 'opening', date, location],
};

export function useFeedStockToday() {
  return useQuery({
    queryKey: feedQueryKeys.today(),
    queryFn: feedApi.getToday,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeedStockByDate(date) {
  return useQuery({
    queryKey: feedQueryKeys.byDate(date),
    queryFn: () => feedApi.getByDate(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAllLocationsFeedStock(date) {
  return useQuery({
    queryKey: feedQueryKeys.allLocations(date),
    queryFn: () => feedApi.getAllLocations(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeedOpening(date, location) {
  return useQuery({
    queryKey: feedQueryKeys.opening(date, location),
    queryFn: () => feedApi.getOpening(date, location),
    enabled: !!date && !!location,
  });
}

export function useCreateOrUpdateFeedStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: feedApi.createOrUpdate,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.allLocations(variables.date) });
    },
  });
}

export function useUpdateFeedStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => feedApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all });
    },
  });
}

export function useDeleteFeedStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: feedApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all });
    },
  });
}
