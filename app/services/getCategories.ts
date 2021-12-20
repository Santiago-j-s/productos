import { API_URL } from "~/constants";

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

interface ApiResponse {
  categories: Category[];
}

export default async function getCategories(): Promise<
  ApiResponse["categories"]
> {
  const response = await fetch(`${API_URL}/categories`, {
    method: "GET",
  });

  const data: ApiResponse = await response.json();

  return data.categories;
}
