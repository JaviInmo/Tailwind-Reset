export type OrderQuery = "asc" | "desc";

export const DEFAULT_ORDER: OrderQuery = "asc";

export const TABLE_QUERY = {
	SEARCH: "search",
	HIDDEN: "hidden",
	PAGE: "page",
	SORT: "sort",
	ORDER: "order",
} as const;
