import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
};

const baseURL = "https://storage-bucket-express.vercel.app";
const basePath = "api/v1/s3";

export const useUploadFiles = () => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      });
      return axios.post(`${baseURL}/${basePath}/supabase`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
};

export const useGetFiles = (query = {}) => {
  return useQuery({
    ...DEFAULT_QUERY_OPTIONS,
    queryKey: ["get all files", query],
    queryFn: async () => {
      const params = new URLSearchParams(query).toString();
      return await axios.get(`${baseURL}/${basePath}/supabase?${params}`);
    },
  });
};


export const useDownloadFiles = () => {
  return useMutation<string, Error, string>({
    mutationFn: async (filename) => {
      try {
        const response = await axios.get(`${baseURL}/${basePath}/supabase/download?filename=${filename}`, {
          responseType: 'blob',
        });

        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();

        return filename;
      } catch (error) {
        console.error('Download Error:', error);
        throw error;
      }
    },
  });
};

export const useDeleteFile = () => {
  return useMutation<string, Error, string>({
    mutationFn: async (filename) => {
      try {
        const response = await axios.delete(`${baseURL}/${basePath}/supabase/delete`, {
          params: { filename }
        });
        
        return response.data;
      } catch (error) {
        console.error('Gagal menghapus file:', error);
        throw error;
      }
    },
  });
};