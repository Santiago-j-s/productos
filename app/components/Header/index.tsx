import logo from "./logo.png";
import shoppingCart from "./cart.png";
import { totalsAtom } from "~/atoms";
import { useAtom } from "jotai";

export default function Header() {
  const [totals] = useAtom(totalsAtom);

  return (
    <header className="header">
      <div className="header__brand">
        <img
          className="header__logo"
          width="30"
          height="30"
          src={logo}
          alt="logo"
        />
        <b>Ez</b>shop
      </div>
      <div className="header__totals">
        <strong>${totals.price.toFixed(2)}</strong>
        <div className="header__cart">
          <img
            className="header__cart-icon"
            src={shoppingCart}
            alt="shopping cart"
            width="22px"
            height="22px"
          />
          <span className="header__cart_icon">{totals.totals}</span>
        </div>
      </div>
    </header>
  );
}
