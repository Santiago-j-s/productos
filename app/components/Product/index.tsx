import type { ReactElement } from "react";
import type { Product } from "~/services/getProducts";

function withExtension(photo: string, ext: string) {
  return photo.replace(/\.jpg/, `.${ext}`);
}

export default function Index({
  id,
  photo,
  name,
  showOriginalPrice,
  originalPrice,
  price,
}: Omit<Product, "priceInDollars">): ReactElement {
  return (
    <div key={id} className="product">
      <picture>
        <source srcSet={withExtension(photo, "webp")} type="image/webp" />
        <img
          className="product__img"
          width="148"
          height="148"
          src={photo}
          alt=""
        />
      </picture>
      <p className="product__name">{name}</p>
      <p className="product__price">
        {showOriginalPrice ? (
          <span className="product__original-price">${originalPrice}</span>
        ) : null}
        <span className="product__new-price">${price}</span>
      </p>
      <button className="product__button">Agregar al carrito</button>
    </div>
  );
}
