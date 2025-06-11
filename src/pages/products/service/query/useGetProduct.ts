import { request } from "../../../../config/request";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../../types";

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => request.get<Product[]>("/products").then((res) => res.data),
  });
};
