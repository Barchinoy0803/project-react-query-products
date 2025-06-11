import { request } from "../../../../config/request";
import { useQuery } from "@tanstack/react-query";

export const useGetColors = () => {
  return useQuery({
    queryKey: ["colors"],
    queryFn: () => request.get<any>("/color").then((res) => res.data),
  });
};
