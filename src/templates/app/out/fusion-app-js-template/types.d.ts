export interface App {
    key: string;
    name: string;
    version: string;
    shortName: string;
    description: string;
    publishedDate: string;
    tags: string[];
    hide: boolean | null;
    order: number;
    type: Type;
    accentColor: string;
    icon: null | string;
    categoryId: string;
    category: Category;
}
export interface Category {
    id: string;
    name: string;
    color: string;
    defaultIcon: string;
}
export declare enum Type {
    Report = "Report",
    Standalone = "Standalone"
}
