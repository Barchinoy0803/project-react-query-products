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
  colorIds: string[];
  count: number;
  img: string;
};

interface dataSource {
  name?: string;
  dataIndex?: string;
  category?: string;
  colors?: string;
  price?: number;
  key?: string;
  count?: number;
  img?: string;
}

interface Props {
  closeModal: () => void;
  defaultValue?: dataSource;
}

export const ProductForm = ({ closeModal, defaultValue }: Props) => {
  const { data: categoryData } = useGetCategories();
  const { data: colorData } = useGetColors();
  const [form] = Form.useForm();

  const { mutate, isPending } = useCreateProduct();
  const { mutate: editProduct, isPending: isPending2 } = useUpdateProduct();

  const client = useQueryClient();

  const onFinish: FormProps<FieldType>["onFinish"] = (formData) => {
    const payload = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: +formData.price,
      colorIds: formData.colorIds,
      count: +formData.count,
      img: "asjdgjgjagfgfja",
    };

    if (defaultValue) {
      editProduct(
        { ...payload, id: defaultValue.key },
        {
          onSuccess: () => {
            client.invalidateQueries({ queryKey: ["products"] });
            closeModal();
          },
        }
      );
    } else {
      mutate(payload, {
        onSuccess: () => {
          client.invalidateQueries({ queryKey: ["products"] });
          closeModal();
          form.resetFields();
        },
        onError: (error) => {
          form.setFields([{ name: "name", errors: [error.message] }]);
        },
      });
    }
  };

  useEffect(() => {
    if (defaultValue && categoryData?.data && colorData?.data) {
      const categoryId = categoryData.data.find((cat: any) => cat.name === defaultValue.category)?.id;
      const colorIds = colorData.data
        .filter((col: any) => defaultValue.colors?.split(',').includes(col.name))
        .map((col: any) => col.id);

        console.log(colorIds)

        form.setFields([
        { name: "name", value: defaultValue.name },
        { name: "categoryId", value: categoryId },
        { name: "colorIds", value: colorIds },
        { name: "price", value: defaultValue.price },
        { name: "count", value: defaultValue.count },
      ]);
    }
  }, [defaultValue, categoryData, colorData]);

  const categoryList = useMemo(() => {
    return categoryData?.data?.map((item: any) => ({
      value: item.id,
      label: <span>{item.name}</span>,
    })) || [];
  }, [categoryData]);

  const colorList = useMemo(() => {
    return colorData?.data?.map((item: any) => ({
      value: item.id,
      label: <span>{item.name}</span>,
    })) || [];
  }, [colorData]);

  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 18 }}
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
        rules={[{ required: true, message: "Please input product price!" }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Count"
        name="count"
        rules={[{ required: true, message: "Please input product count!" }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Category"
        name="categoryId"
        rules={[{ required: !defaultValue, message: "Please select a category!" }]}
      >
        <Select placeholder="Select Category" options={categoryList} />
      </Form.Item>

      <Form.Item<FieldType>
        label="Color"
        name="colorIds"
        rules={[{ required: !defaultValue, message: "Please select colors!" }]}
      >
        <Select mode="multiple" placeholder="Select Colors" options={colorList} />
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
