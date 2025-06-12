import { useGetUsers } from "./service/query/useGetUsers"
import { Button, message, Table } from 'antd';
import type { CreateEditDialogType, UserForm, UserTableType } from "./types";
import { getUserTableColumns } from "./constants";
import { useDeleteUser } from "./service/mutation/useDeleteUser";
import { useQueryClient } from "@tanstack/react-query";
import { CreateEditDialog } from "./components/CreateEditDialog";
import { useState } from "react";

export const Users = () => {
  const [createEditDialog, setCreateEditDialog] = useState<CreateEditDialogType>({isOpen: false, type: "create"})
  const client = useQueryClient();

  const {data} = useGetUsers();
  const { mutate } = useDeleteUser();

  const handleCreate = () => {
    setCreateEditDialog({
      isOpen: true,
      type: 'create'
    })
  }

  const handleEdit = (user: UserForm) => {
    setCreateEditDialog({
      isOpen: true,
      type: 'edit',
      user
    })
  };

  const handleDelete = (user: UserTableType) => {
    mutate(user.id, {
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["users"] });
        message.success("success");
      },
    });
  };

  const columns = getUserTableColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <>
      <Button type="primary" onClick={handleCreate} style={{marginBottom: '20px'}}>Create</Button>
      <Table<UserTableType> columns={columns} dataSource={data?.users} pagination={{ pageSize: 10 }}/>
      <CreateEditDialog state={createEditDialog} setState={setCreateEditDialog}/>
    </>
  )
}
