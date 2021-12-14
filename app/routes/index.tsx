import { useEffect, useRef, useState } from "react";
import { json, LoaderFunction, useFetcher, useLoaderData } from "remix";

import type { Products } from "~/services/getProducts";
import getProducts from "~/services/getProducts";
import Product from "~/components/Product";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? 1);
  const products = await getProducts(page);
  return json(products);
};

interface CurrentData {
  page: number;
  products: Products["products"];
  finishedLoading: boolean;
}

export default function Index() {
  const { products, page, isLastPage } = useLoaderData<Products>();

  const [currentData, setCurrentData] = useState<CurrentData>({
    page: page,
    products: products,
    finishedLoading: isLastPage,
  });

  const productsContainerElement = useRef<HTMLDivElement>(null);
  const fetcher = useFetcher<Products>();

  useEffect(() => {
    if (fetcher.type === "done") {
      setCurrentData({
        page: fetcher.data.page,
        finishedLoading: fetcher.data.isLastPage,
        products: [...currentData.products, ...fetcher.data.products],
      });
    }
  }, [fetcher.type]);

  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        console.log(entry.boundingClientRect);
        if (entry.isIntersecting && !currentData.finishedLoading) {
          console.log("intersecting");
          fetcher.load(`?page=${currentData.page + 1}`);
          setCurrentData({ ...currentData, page: currentData.page + 1 });
        }
      }
    };

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0.7,
    };

    const observer = new IntersectionObserver(callback, options);

    observer.observe(productsContainerElement.current as HTMLElement);

    return () => {
      observer.disconnect();
    };
  }, [productsContainerElement]);

  return (
    <main className="main">
      <h1>Almacén</h1>
      <div ref={productsContainerElement} className="products-container">
        {currentData.products.map(
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
