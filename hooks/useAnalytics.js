import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useAnalytics = (filter, handle) => {
  return useQuery({
    queryKey: ['analytics', handle, filter],
    queryFn: async () => {
      const response = await axios.get(
        `/api/analytics/views?handle=${handle}&filter=${filter}`
      );
      return response.data;
    },
    enabled: !!handle,
    onError: (error) => {
      console.error('Analytics error:', error);
      toast.error('Failed to fetch analytics data');
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};

export default useAnalytics;
