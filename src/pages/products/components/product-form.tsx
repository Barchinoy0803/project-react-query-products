import { Select } from "antd";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useCreateProduct } from "../service/mutation/useCreateProduct";
import { useUpdateProduct } from "../service/mutation/useUpdateProduct";
import { useGetCategories } from "../service/query/useGetCategories";
import { useGetColors } from "../service/query/useGetColors";

type FieldType = {
  name: string;
  categoryId: string;
  price: number;
  colorIds: string;
  count: number;
  img: string;
};

interface dataSource {
  name?: string;
  dataIndex?: string;
  category?: string;
  color?: string;
  price?: string;
  key?: string;
  count?: number;
  img?: string
}

interface Props {
  closeModal: () => void;
  defaultValue?: dataSource;
}

export const ProductForm = ({ closeModal, defaultValue }: Props) => {
  const { data } = useGetCategories();
  const { data: color } = useGetColors();
  const [form] = Form.useForm();

  const { mutate, isPending } = useCreateProduct();
  const { mutate: editProduct, isPending: isPending2 } = useUpdateProduct();

  const clinet = useQueryClient();

  const onFinish: FormProps<FieldType>["onFinish"] = (data) => {
    if (defaultValue) {
      return editProduct(
        { name: data.name, id: defaultValue.key, price: +data.price, count: +data.count, img: "asjdgjgjagfgfja", colorIds: data.colorIds, categoryId: data.categoryId },
        {
          onSuccess: () => {
            clinet.invalidateQueries({ queryKey: ["products"] });
            closeModal();
          },
        }
      );
    }
    mutate(
      { name: data.name, categoryId: data.categoryId, price: +data.price, colorIds: data.colorIds, count: +data.count, img: "asjdgjgjagfgfja" },
      {
        onSuccess: () => {
          clinet.invalidateQueries({ queryKey: ["products"] });
          closeModal();
          form.resetFields();
        },
        onError: (error) => {
          form.setFields([{ name: "name", errors: [error.message] }]);
        },
      }
    );
  };

  useEffect(() => {
    if (defaultValue) {
      form.setFields([
        {
          name: "name",
          value: defaultValue.name,
        },
        {
          name: "categoryId",
          value: defaultValue.category,
        },
        {
          name: "colorIds",
          value: defaultValue.color,
        },
        {
          name: "price",
          value: defaultValue.price,
        },
        {
          name: "count",
          value: defaultValue.count,
        },
      ]);
    }
  }, [defaultValue]);

  const categoryList = useMemo(() => {
    if (data) {
      return data?.data?.map((item: any) => ({
        value: item.id,
        label: <span>{item.name}</span>,
      }));
    }
    return []
  }, [data])

  const colorList = useMemo(() => {
    if (data) {
      return color?.data?.map((item: any) => ({
        value: item.id,
        label: <span>{item.name}</span>,
      }));
    }
    return []
  }, [data])

  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ width: 600, margin: "0 auto" }}
      onFinish={onFinish}
    >
      <Form.Item<FieldType>
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input product name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Price"
        name="price"
        rules={[{ required: true, message: "Please input product name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Count"
        name="count"
        rules={[{ required: true, message: "Please input product count!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Category"
        name="categoryId"
        rules={[{ required: defaultValue ? false : true, message: "Please input category!" }]}
      >
        <Select
          disabled={defaultValue ? true : false}
          placeholder="Category"
          options={categoryList}
        />
      </Form.Item>

      <Form.Item<FieldType>
        label="Color"
        name="colorIds"
        rules={[{ required: defaultValue ? false : true, message: "Please input product color!" }]}
      >
        <Select
          mode="multiple"
          disabled={defaultValue ? true : false}
          placeholder="Color"
          options={colorList}
        />
      </Form.Item>

      <Button
        loading={isPending || isPending2}
        type="primary"
        htmlType="submit"
      >
        Submit
      </Button>
    </Form>
  );
};
