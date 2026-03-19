export type Category =
    | "l1_category"
    | "l2_category"
    | "l3_category"
    | "l4_category";

export interface FilterCategoriesRow {
    l1_category?: string;
    l2_category?: string;
    l3_category?: string;
    l4_category?: string;
}

export interface FilterCategoriesResult {
    l1_category?: string[];
    l2_category?: string[];
    l3_category?: string[];
    l4_category?: string[];
}
