import { request } from "../../../../config/request";
import { useMutation } from "@tanstack/react-query";
import type { UserForm } from "../../types";

interface UpdateUserPayload {
  id: string;
  data: UserForm;
}

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, data }: UpdateUserPayload) =>
      request.patch(`/user/${id}`, data).then((res) => res.data),
  });
};
