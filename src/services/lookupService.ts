import type { Campus } from "../types/campus";
import type { Category } from "../types/category";

export const lookupService = {
  // Получение всех кампусов
  getCampuses: async (): Promise<Campus[]> => {
    const res = await fetch('/api/campuses');
    return res.json();
  },

  // Получение всех категорий
  getCategories: async (): Promise<Category[]> => {
    const res = await fetch('/api/categories');
    return res.json();
  }
}
