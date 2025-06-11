import { request } from "../../../../config/request";
import { useMutation } from "@tanstack/react-query";

interface ProductsEditT {
  name: string;
  id?: string;
  categoryId: string;
  colorIds: string[];
  count: number;
  price: number;
  img: string;
}

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: (data: ProductsEditT) =>
      request
        .patch(`/products/${data.id}`, {
          name: data.name, 
          categoryId: data.categoryId,
          colorIds: data.colorIds,
          count: data.count,
          price: data.price,
          img: data.img
        })
        .then((res) => res.data),
  });
};
