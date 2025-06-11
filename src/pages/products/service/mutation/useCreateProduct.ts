import { request } from "../../../../config/request";
import { useMutation } from "@tanstack/react-query";

type FieldType = {
  name: string;
  categoryId: string;
  price: number;
  colorIds: string[];
  count: number;
  img: string;
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: (data: FieldType) =>
      request
        .post("/products", data)
        .then((res) => res.data)
  });
};
