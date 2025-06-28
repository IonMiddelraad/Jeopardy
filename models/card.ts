export interface Card {
    id?: string;
    question: string;
    answer: string;
    points: number;
    available?: boolean;
}