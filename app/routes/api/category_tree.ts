import { json, LoaderFunction } from "remix";
import getCategories from "~/services/getCategories";
import type { Category } from "~/services/getCategories";

interface ExtendedCategory extends Category {
  subcategories: Category[];
}

export const loader: LoaderFunction = async () => {
  const categoryTree: Record<number, ExtendedCategory> = {};
  const visited = new Map<number, ExtendedCategory>();

  const categories = await getCategories();

  categories.forEach(({ id, name, parent_id }) => {
    const obj = { id, name, parent_id, subcategories: [] };
    visited.set(obj.id, obj);

    if (parent_id === null) {
      categoryTree[id] = obj;
    } else {
      visited.get(parent_id)?.subcategories.push(obj);
    }
  });

  return json(categoryTree);
};
