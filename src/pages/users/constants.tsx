import { Button, Space } from 'antd';
import type { TableProps } from 'antd';
import type { UserTableType } from './types';

interface ColumnActions {
  onEdit: (record: UserTableType) => void;
  onDelete: (record: UserTableType) => void;
}

export const getUserTableColumns = ({ onEdit, onDelete }: ColumnActions): NonNullable<TableProps<UserTableType>['columns']> => [
  {
    title: 'Name',
    dataIndex: 'firstname',
    key: 'firstname',
    render: (text: any) => <a>{text ?? '-'}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button onClick={() => onEdit(record)}>Edit</Button>
        <Button danger onClick={() => onDelete(record)}>Delete</Button>
      </Space>
    ),
  },
];
