import { json, LoaderFunction, useLoaderData } from "remix";

import getProducts from "~/services/getProducts";
import type { Products as ProductsType } from "~/services/getProducts";

import Products from "~/components/Products";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? 1);
  const products = await getProducts(page);
  return json(products);
};

export default function Index() {
  const { products, page, isLastPage } = useLoaderData<ProductsType>();

  return (
    <main className="main">
      <h1>Almacén</h1>
      <Products products={products} page={page} isLastPage={isLastPage} />
    </main>
  );
}
