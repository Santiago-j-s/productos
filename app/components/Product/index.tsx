import type { ReactElement } from "react";
import type { Product } from "~/services/getProducts";

export default function Index({
  id,
  photo,
  name,
  showOriginalPrice,
  originalPrice,
  price,
}: Product): ReactElement {
  return (
    <div key={id} className="product">
      <img
        className="product__img"
        width="148"
        height="148"
        src={photo}
        alt=""
      />
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
