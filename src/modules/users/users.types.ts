export type User = {
  id: number;
  name: string;
  role: string;
};

export type CreateUserInput = {
  name: string;
  role: string;
};
