import type { Category } from "./category";

export interface Board {
    id: string;
    name: string;
    categories: Category[];
    settings: {};
}