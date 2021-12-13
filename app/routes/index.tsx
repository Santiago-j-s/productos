import { json, LoaderFunction, useLoaderData } from "remix";
import type { Products } from "~/services/getProducts";
import getProducts from "~/services/getProducts";
import Product from "~/components/Product";

export const loader: LoaderFunction = async () => {
  const products = await getProducts();
  return json(products);
};

export default function Index() {
  const { products } = useLoaderData<Products>();

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
    </main>
  );
}
