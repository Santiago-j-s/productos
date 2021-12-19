import { ReactElement, useState } from "react";
import type { Product } from "~/services/getProducts";

function withExtension(photo: string, ext: string) {
  return photo.replace(/\.jpg/, `.${ext}`);
}

function useCart(): [number, () => void, () => void] {
  const [quantity, setQuantity] = useState(() => 0);

  const addToCart = () => setQuantity((q) => q + 1);
  const removeFromCart = () => setQuantity((q) => q - 1);

  return [quantity, addToCart, removeFromCart];
}

interface ButtonsProps {
  quantity: number;
  addToCart: () => void;
  removeFromCart: () => void;
}

function Buttons({
  quantity,
  addToCart,
  removeFromCart,
}: ButtonsProps): ReactElement {
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
  const [quantity, addToCart, removeFromCart] = useCart();

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
      <Buttons
        quantity={quantity}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
    </div>
  );
}
