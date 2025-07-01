import type { Category } from "./category";

export interface Board {
    id: string;
    name: string;
    categories: Category[];
    settings: {
        dailyDouble: boolean,
        finalJep: {
            enable: boolean,
            question?: string,
            answer?: string
        },
        round1Cat: string[],
        round2Cat: string[]
    };
}