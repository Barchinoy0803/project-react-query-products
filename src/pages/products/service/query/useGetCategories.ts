import { request } from "../../../../config/request";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => request.get<any>("/category").then((res) => res.data),
  });
};
