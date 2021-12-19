import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

/**
 * - totals is the number of items in the cart
 * - price is the total price of the items in the cart
 */
export const totalsAtom = atom({
  totals: 0,
  price: 0,
});

/**
 * writable atom to add one item to the cart
 */
export const addOneAtom = atom<null, number>(null, (get, set, priceToAdd) => {
  const { totals, price } = get(totalsAtom);
  set(totalsAtom, { totals: totals + 1, price: price + priceToAdd });
});

/**
 * writable atom to substract one item from the cart
 */
export const substractOneAtom = atom<null, number>(
  null,
  (get, set, priceToSubstract) => {
    const { totals, price } = get(totalsAtom);
    set(totalsAtom, { totals: totals - 1, price: price - priceToSubstract });
  }
);

/**
 * An atom family with atoms for the quantity of
 * each product in the page.
 *
 * The atoms are discriminated by id.
 */
export const productAtom = atomFamily(() => atom(0));
