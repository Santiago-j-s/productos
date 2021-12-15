import { json, LoaderFunction, HeadersFunction, useLoaderData } from "remix";

import getProducts from "~/services/getProducts";
import type { Products as ProductsType } from "~/services/getProducts";

import Products from "~/components/Products";

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
async function digest(message: string, algorithm = "SHA-1") {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? 1);
  const products = await getProducts(page);

  return json(products, {
    headers: {
      "Cache-Control": `public, max-age=60, stale-while-revalidate=${
        3600 - 60
      }, must-revalidate`,
      Etag: await digest(JSON.stringify(products)),
    },
  });
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const loaderCacheControl = loaderHeaders.get("Cache-Control");

  if (!loaderCacheControl) {
    throw new Error("There must be a Cache-Control header in the loader");
  }

  return { "Cache-Control": loaderCacheControl };
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
