import { Button, message, Modal, Table, type TableProps } from "antd";
import { useToggle } from "../../hooks/useToggle";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProducts } from "./service/query/useGetProduct";
import { useDeleteProduct } from "./service/mutation/useDeleteProduct";
import { ProductForm } from "./components/product-form";
import type { ColorList } from "./types";

interface dataSource {
  title?: string;
  dataIndex?: string;
  type?: string;
  key?: string;
}

export const Products = () => {
  const { data } = useGetProducts();
  const { isOpen, open, close } = useToggle();
  const { isOpen: isOpen2, open: open2, close: close2 } = useToggle();

  const [initialData, setInitialData] = React.useState<
    dataSource | undefined
  >();
  console.log(data);

  const dataSource = data?.map((item: any) => ({
    createdAt: item.createdAt.slice(0, 10),
    name: item.name,
    price: item.price,
    key: item.id,
    category: item.category.name,
    colors: item?.colors?.map((color: ColorList) => color.name).join(",")
  }));

  const editContent = (el: dataSource) => {
    setInitialData(el);
    open2();
  };
  const { mutate } = useDeleteProduct();
  const client = useQueryClient();

  const deleteItems = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["products"] });
        message.success("success");
      },
    });
  };

  const columns: TableProps<dataSource>["columns"] = [
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Colors",
      dataIndex: "colors",
      key: "colors",
    },
    {
      title: "Action",
      render: (data: dataSource) => {
        return (
          <div>
            <Button onClick={() => deleteItems(data.key as string)}>
              Delete
            </Button>
            <Button onClick={() => editContent(data)}>Edit</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Button onClick={open} type="primary">
        Create
      </Button>
      <Modal footer={false} onCancel={close} open={isOpen}>
        <ProductForm closeModal={close} />
      </Modal>
      <Modal footer={false} onCancel={close2} open={isOpen2}>
        <ProductForm defaultValue={initialData} closeModal={close2} />
      </Modal>
      <Table<dataSource> dataSource={dataSource} columns={columns} />
    </div>
  );
};
