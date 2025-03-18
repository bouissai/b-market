import { orderDTO } from "./order";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: Date;
  orders?: orderDTO[];
}

export interface UserPut {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface UserPost {
  name: string;
  email: string;
  phone?: string | null;
}

export interface UserDelete {
  id: string;
  name: string;
}
