import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const useSections = (userId) => {
  const fetchSections = async () => {
    const response = await axios.get(`/api/sections?userId=${userId}`);
    return response.data;
  };

  return useQuery({
    queryKey: ['sections', userId],
    queryFn: fetchSections,
    enabled: !!userId,
    onError: () => {
      toast.error('An error occurred');
    },
    select: (data) => {
      // Sort sections by their order property
      return data?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
    },
  });
};

export default useSections;
