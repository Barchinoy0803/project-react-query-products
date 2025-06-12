export interface UserTableType {
  id: string;
  key: string;
  name: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

export interface CreateEditDialogType {
  isOpen: boolean;
  type: 'create' | 'edit';
  user?: UserForm;
}

export interface UserForm {
  id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}