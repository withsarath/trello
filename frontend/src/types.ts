import type { LabelId } from './constants';

export type BoardType = {
  _id: string;
  name: string;
  owner: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CardType = {
  _id: string;
  title: string;
  description: string;
  dueDate?: string | null;
  labels?: LabelId[];
  order: number;
};

export type ListType = {
  _id: string;
  name: string;
  order: number;
  cards: CardType[];
};