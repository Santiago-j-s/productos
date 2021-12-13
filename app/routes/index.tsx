import { json, Link, LoaderFunction, useLoaderData } from "remix";
import type { Products } from "~/services/getProducts";
import getProducts from "~/services/getProducts";
import Product from "~/components/Product";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? 1);
  const products = await getProducts(page);
  return json(products);
};

export default function Index() {
  const { products, page } = useLoaderData<Products>();

  return (
    <main className="main">
      <h1>Almacén</h1>
      <div className="products-container">
        {products.map(
          ({ id, photo, name, showOriginalPrice, price, originalPrice }) => (
            <Product
              key={id}
              id={id}
              photo={photo}
              name={name}
              showOriginalPrice={showOriginalPrice}
              price={price}
              originalPrice={originalPrice}
            />
          )
        )}
      </div>
      <Link className="products-container__button" to={`?page=${page + 1}`}>
        Cargar más productos
      </Link>
    </main>
  );
}
