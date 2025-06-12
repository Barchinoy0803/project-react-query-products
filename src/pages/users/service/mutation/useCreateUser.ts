import { request } from "../../../../config/request";
import { useMutation } from "@tanstack/react-query";
import type { UserForm } from "../../types";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: UserForm) =>
      request.post("/user", data).then((res) => res.data),
  });
};
