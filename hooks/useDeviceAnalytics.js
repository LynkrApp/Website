import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const useDeviceAnalytics = (handle) => {
  return useQuery({
    queryKey: ['device-analytics', handle],
    queryFn: async () => {
      const response = await axios.get(
        `/api/analytics/views/device?handle=${handle}`
      );
      return response.data;
    },
    enabled: !!handle,
    onError: (error) => {
      console.error('Device analytics error:', error);
      toast.error('Failed to fetch device analytics');
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};

export default useDeviceAnalytics;
