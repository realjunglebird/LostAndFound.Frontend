import type { Item } from "../types/item";

export const itemService = {

  // Получение всех находок
  getAllItems: async (): Promise<Item[]> => {
    const response = await fetch('/api/items');
    if (!response.ok) {
      throw new Error('Ошибка при получении данных с сервера!');
    }
    return response.json();
  },

  // Получение конкретной находки
  getItemById: async (id: number | string): Promise<Item> => {
    const response = await fetch(`/api/items/${id}`);
    if (!response.ok) {
      if (response.status == 404) {
        throw new Error('Объявление не найдено!');
      }
      throw new Error('Ошибка при получении данных с сервера!');
    }
    return response.json();
  },

  // Добавление находки
  createItem: async (formData: FormData): Promise<Item> => {
    const response = await fetch('/api/items', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Ошибка при создании объявления!');
    return response.json();
  }
}
