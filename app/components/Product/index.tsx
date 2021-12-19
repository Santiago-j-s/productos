import { useAtom } from "jotai";
import { ReactElement } from "react";
import type { Product } from "~/services/getProducts";
import { addOneAtom, substractOneAtom, productAtom } from "~/atoms";

function withExtension(photo: string, ext: string) {
  return photo.replace(/\.jpg/, `.${ext}`);
}

function useCart(id: string, price: string): [number, () => void, () => void] {
  const [quantity, setQuantity] = useAtom(productAtom(id));
  const [, addOne] = useAtom(addOneAtom);
  const [, substractOne] = useAtom(substractOneAtom);

  const addToCart = () => {
    setQuantity((q) => q + 1);
    addOne(Number(price));
  };
  const removeFromCart = () => {
    setQuantity((q) => q - 1);
    substractOne(Number(price));
  };

  return [quantity, addToCart, removeFromCart];
}

function Buttons({ id, price }: { id: string; price: string }): ReactElement {
  const [quantity, addToCart, removeFromCart] = useCart(id, price);

  if (quantity === 0) {
    return (
      <button onClick={addToCart} className="product__add_to_cart_button">
        Agregar al carrito
      </button>
    );
  }

  return (
    <div className="product__buttons">
      <button
        className="product__update_quantity_button"
        onClick={removeFromCart}
      >
        −
      </button>{" "}
      <span className="product__quantity">{quantity} </span>
      <button className="product__update_quantity_button" onClick={addToCart}>
        +
      </button>
    </div>
  );
}

export default function Index({
  id,
  photo,
  name,
  showOriginalPrice,
  originalPrice,
  price,
}: Omit<Product, "priceInDollars" | "isRecent">): ReactElement {
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
      <Buttons id={id} price={price} />
    </div>
  );
}
