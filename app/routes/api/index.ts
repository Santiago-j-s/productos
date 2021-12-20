import { json, LoaderFunction } from "remix";

import getProducts from "~/services/getProducts";
import type { Error } from "~/services/getProducts";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? 1);
  const products = await getProducts(page);

  if ((products as Error).status === 404) {
    return json(
      { status: 404, message: "Products not found" },
      { status: 404 }
    );
  }

  return json(products, {
    headers: {
      "Cache-Control": `public, max-age=60, stale-while-revalidate=${
        3600 - 60
      }`,
    },
  });
};
