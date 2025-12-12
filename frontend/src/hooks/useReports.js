import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary, getSummaryByDate, getLocationSummary } from '../api/reports';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useSummaryByDate = (date) => {
  return useQuery({
    queryKey: ['summary', date],
    queryFn: () => getSummaryByDate(date),
    enabled: !!date,
  });
};

export const useLocationSummary = (date) => {
  return useQuery({
    queryKey: ['location-summary', date],
    queryFn: () => getLocationSummary(date),
    enabled: !!date,
  });
};
