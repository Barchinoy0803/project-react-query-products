import { Button, Form, Input, Modal, message } from "antd";
import type { CreateEditDialogType, UserForm } from "../types";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { useUpdateUser } from "../service/mutation/useUpdateUser";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateUser } from "../service/mutation/useCreateUser";

interface CreateEditDialogProps {
  state: CreateEditDialogType;
  setState: React.Dispatch<React.SetStateAction<CreateEditDialogType>>;
}

export const CreateEditDialog = ({ state: { isOpen, type, user }, setState }: CreateEditDialogProps) => {
  const [form] = useForm<UserForm>();
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();

  const handleClose = () => {
    setState({ isOpen: false, type: "create" });
    form.resetFields();
  };

  const onFinish = (values: UserForm) => {
    if (type === "edit" && user?.id) {
      updateUser(
        { id: user.id, data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success("User updated");
            handleClose();
          },
          onError: () => message.error("Update failed"),
        }
      );
    } else {
      createUser(values, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          message.success("User created");
          handleClose();
        },
        onError: () => message.error("Creation failed"),
      });
    }
  };

  useEffect(() => {
    if (user && type === "edit") {
      const { firstname, lastname, email } = user;
      form.setFields([
        { name: "firstname", value: firstname ?? '-' },
        { name: "lastname", value: lastname ?? '-' },
        { name: "email", value: email ?? '-' },
        { name: "password", value: "" },
      ]);
    }
  }, [user, type]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      title={type === "edit" ? "Edit User" : "Create User"}
    >
      <Form
        form={form}
        name="userForm"
        layout="vertical"
        style={{ width: 600, margin: "0 auto" }}
        onFinish={onFinish}
      >
        <Form.Item<UserForm>
          label="First name"
          name="firstname"
          rules={[{ required: true, message: "Please input first name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<UserForm>
          label="Last name"
          name="lastname"
          rules={[{ required: true, message: "Please input last name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<UserForm>
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<UserForm>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input password!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isCreating || isUpdating}>
            {type === "edit" ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
