import { LoaderFunction, useLoaderData } from "remix";
import { json } from "remix";

interface Producto {
  id: string;
  name: string;
  price: number;
  presentation: string;
  brand: string;
  photo: string;
  originalPrice: number;
  updateAt: string;
}

interface ResponseProductos {
  products: Producto[];
  page: number;
  per_page: number;
  page_count: number;
}

const baseUrl = "https://challenge-api.aerolab.co";
const productosUrl = `${baseUrl}/products`;

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export const loader: LoaderFunction = async () => {
  const response = await fetch(productosUrl, {
    method: "GET",
  });

  const data: ResponseProductos = await response.json();
  const products = data.products.map(
    ({ id, name, price, originalPrice, photo }) => ({
      id,
      name,
      price: price.toFixed(2),
      originalPrice: originalPrice.toFixed(2),
      showOriginalPrice: originalPrice > price,
      photo,
    })
  );

  // https://remix.run/api/remix#json
  return json({
    page: data.page,
    per_page: data.per_page,
    page_count: data.page_count,
    products,
  });
};

interface IndexProps {
  page: number;
  per_page: number;
  page_count: number;
  products: Array<{
    id: string;
    name: string;
    price: string;
    originalPrice: string;
    showOriginalPrice: boolean;
    photo: string;
  }>;
}

export default function Index() {
  const { products } = useLoaderData<IndexProps>();

  return (
    <main className="main">
      <h1>Almacén</h1>
      <div className="products-container">
        {products.map((product) => (
          <div key={product.id} className="product">
            <img className="product__img" src={product.photo} alt="" />
            <p className="product__name">{product.name}</p>
            <p className="product__price">
              {product.showOriginalPrice ? (
                <span className="product__original-price">
                  ${product.originalPrice}
                </span>
              ) : null}
              <span className="product__new-price">${product.price}</span>
            </p>
            <button className="product__button">Agregar al carrito</button>
          </div>
        ))}
      </div>
    </main>
  );
}
