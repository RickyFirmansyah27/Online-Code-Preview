import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
};

// const baseURL = "https://storage-bucket-express.vercel.app";
const baseURL = "http://localhost:8000";
const basePath = "api/v1/s3";

export const useUploadFiles = (user?: { firstName?: string }) => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      });
      formData.append('firstName', user?.firstName || "Other");
      return axios.post(`${baseURL}/${basePath}/supabase`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
};

export const useGetFiles = (query: Record<string, unknown> = {}, user?: { firstName?: string }) => {
  const mergedQuery = { ...query, firstName: user?.firstName || "Other" };
  return useQuery({
    ...DEFAULT_QUERY_OPTIONS,
    queryKey: ["get all files", mergedQuery],
    queryFn: async () => {
      const params = new URLSearchParams(mergedQuery as Record<string, string>).toString();
      const response = await axios.get(`${baseURL}/${basePath}/supabase?${params}`);
      return response.data;
    },
  });
};


export const useDownloadFiles = (user?: { firstName?: string }) => {
  return useMutation<string, Error, string>({
    mutationFn: async (filename) => {
      try {
        const params: Record<string, string> = { filename, firstName: user?.firstName || "Other" };
        const response = await axios.get(`${baseURL}/${basePath}/supabase/download`, {
          params,
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

export const useDeleteFile = (user?: { firstName?: string }) => {
  return useMutation<string, Error, string>({
    mutationFn: async (filename) => {
      try {
        const params: Record<string, string> = { filename, firstName: user?.firstName ?? "Other" };
        const response = await axios.get(`${baseURL}/${basePath}/supabase/delete`, {
          params
        });
        
        return response.data;
      } catch (error) {
        console.error('Gagal menghapus file:', error);
        throw error;
      }
    },
  });
};