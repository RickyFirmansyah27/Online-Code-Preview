import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
};

const baseURL = "https://storage-bucket-hono.vercel.app";
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
