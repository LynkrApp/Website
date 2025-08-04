import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const useDataExport = () => {
  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.get('/api/user/data-export', {
        responseType: 'blob', // Important for file download
      });
      return response;
    },
    onSuccess: (response) => {
      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      // Extract filename from response headers or create default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'lynkr-data-export.json';

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Your data has been exported successfully!');
    },
    onError: (error) => {
      console.error('Export failed:', error);
      toast.error(error.response?.data?.message || 'Failed to export data');
    },
  });

  const exportData = () => {
    exportMutation.mutate();
  };

  return {
    exportData,
    isExporting: exportMutation.isLoading,
    exportError: exportMutation.error,
  };
};

export default useDataExport;
