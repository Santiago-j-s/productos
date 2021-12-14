import React, { useCallback, useEffect, useReducer, useRef } from "react";
import { useFetcher } from "remix";

import type { ReactElement } from "react";

import Product from "~/components/Product";
import { Products } from "~/services/getProducts";

export interface ProductsData {
  page: number;
  products: Products["products"];
  isLastPage: boolean;
}

function useIntersect(
  callback: IntersectionObserverCallback,
  ref: React.RefObject<HTMLElement>
) {
  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(callback, options);

    observer.observe(ref.current as HTMLElement);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback]);
}

type ActionAddPage = { type: "ADD_PAGE"; payload: ProductsData };

type Action = ActionAddPage;

function reducer(state: ProductsData, action: Action): ProductsData {
  switch (action.type) {
    case "ADD_PAGE":
      return {
        page: action.payload.page,
        isLastPage: action.payload.isLastPage,
        products: [...state.products, ...action.payload.products],
      };
  }
}

export default function Index({
  page,
  products,
  isLastPage,
}: ProductsData): ReactElement {
  const [data, dispatch] = useReducer(reducer, {
    page,
    products,
    isLastPage,
  });

  const intersectProductElement = useRef<HTMLDivElement>(null);
  const fetcher = useFetcher<Products>();

  useEffect(() => {
    if (fetcher.data) {
      const payload = fetcher.data;
      dispatch({ type: "ADD_PAGE", payload });
    }
  }, [fetcher.data]);

  const callback = useCallback<IntersectionObserverCallback>(
    (entries) => {
      for (const entry of entries) {
        if (
          entry.isIntersecting &&
          !data.isLastPage &&
          fetcher.state !== "submitting"
        ) {
          const params = new URLSearchParams(`page=${data.page + 1}`);
          fetcher.submit(params);
        }
      }
    },
    [data]
  );

  useIntersect(callback, intersectProductElement);

  const totalProducts = data.products.length;

  // if 60% of elements are past the viewport, load more
  const intersectProductIndex = Math.floor(totalProducts * 0.6);

  return (
    <div className="products-container">
      {data.products.map(
        (
          { id, photo, name, showOriginalPrice, price, originalPrice },
          index
        ) => (
          <div
            key={id}
            ref={
              index === intersectProductIndex
                ? intersectProductElement
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
  );
}
