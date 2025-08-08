import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const useCurrentUser = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get('/api/current');
      return response.data;
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data || err.message);
      } else {
        console.error(String(err));
      }
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
  });
};

export default useCurrentUser;
