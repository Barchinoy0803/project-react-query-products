import { request } from "../../../../config/request";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => request.get<any>(`/user?limit=1000`).then((res) => res.data),
  });
};
