import { API_URL } from "~/constants";

interface ApiResponse {
  rate: number;
  currency: string;
  updatedAt: string;
}

export default async function getCotization(): Promise<number> {
  const response = await fetch(`${API_URL}/dollar`, {
    method: "GET",
  });

  const data: ApiResponse = await response.json();
  return data.rate;
}
