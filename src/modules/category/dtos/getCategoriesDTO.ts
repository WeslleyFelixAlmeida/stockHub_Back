export interface PaginationInformations {
  nextId?: number;
  hasNext?: boolean;
}

export interface GetCategoriesDTO {
  categoriesData: {
    id?: number;
    name: string;
  }[];
  paginationData: PaginationInformations;
}

export interface GetCategoryDTO {
  id: number;
  name: string;
}
