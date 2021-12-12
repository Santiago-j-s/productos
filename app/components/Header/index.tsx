import logo from "./logo.png";
import shoppingCart from "./cart.png";

export default function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <img className="header__logo" src={logo} alt="logo" />
        <b>Ez</b>shop
      </div>
      <div className="header__cart">
        <strong>$2.525,30</strong>
        <img
          className="header__cart-icon"
          src={shoppingCart}
          alt="shopping cart"
        />
      </div>
    </header>
  );
}
