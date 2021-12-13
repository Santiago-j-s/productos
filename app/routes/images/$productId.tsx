import type { LoaderFunction } from "remix";
import { API_URL } from "~/constants";

export const loader: LoaderFunction = async ({ params }) => {
  const response = await fetch(
    `${API_URL}/static/products/${params.productId}`
  );

  return new Response(response.body, {
    ...response,
    headers: { "cache-control": "public, max-age=600" },
  });
};
