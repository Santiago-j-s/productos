import { useCallback, useEffect, useRef, useState } from "react";
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
    if (fetcher.data) {
      setCurrentData({
        page: fetcher.data.page,
        finishedLoading: fetcher.data.isLastPage,
        products: [...currentData.products, ...fetcher.data.products],
      });
    }
  }, [fetcher.data]);

  const callback = useCallback<IntersectionObserverCallback>(
    (entries) => {
      for (const entry of entries) {
        if (
          entry.isIntersecting &&
          !currentData.finishedLoading &&
          fetcher.state !== "submitting"
        ) {
          const params = new URLSearchParams(`page=${currentData.page + 1}`);
          fetcher.submit(params);
          setCurrentData({ ...currentData, page: currentData.page + 1 });
        }
      }
    },
    [currentData]
  );

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(callback, options);

    observer.observe(productsContainerElement.current as HTMLElement);

    return () => {
      observer.disconnect();
    };
  }, [productsContainerElement, callback]);

  const totalProducts = currentData.products.length;

  return (
    <main className="main">
      <h1>Almacén</h1>
      <div className="products-container">
        {currentData.products.map(
          (
            { id, photo, name, showOriginalPrice, price, originalPrice },
            index
          ) => (
            <div
              key={id}
              ref={
                index === Math.floor(totalProducts * 0.6)
                  ? productsContainerElement
                  : undefined
              }
            >
              <Product
                id={id}
                photo={photo}
                name={name}
                showOriginalPrice={showOriginalPrice}
                price={price}
                originalPrice={originalPrice}
              />
            </div>
          )
        )}
      </div>
    </main>
  );
}
