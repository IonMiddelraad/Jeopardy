import type { Card } from "./card";

export interface Category {
    id: string;
    name: string;
    cards: Card[];
}