import categoriesData from "@/data/categories.json";
import type { Category } from "@/lib/types";

export const categories: Category[] = categoriesData as Category[];

export function getCategories(): Category[] {
  return categories;
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

/** Categorie del quiz base (tutte tranne le specializzazioni come la vela). */
export function getBaseCategories(): Category[] {
  return categories.filter((c) => !c.specialization);
}

/** Categorie di specializzazione (es. vela). */
export function getSpecializationCategories(): Category[] {
  return categories.filter((c) => c.specialization);
}
