import type { Announcement } from "../types/announcement";

export const itemService = {
  getAllItems: async (): Promise<Announcement[]> => {
    const response = await fetch('/api/items');
    if (!response.ok) {
      throw new Error('Ошибка при получении данных с сервера!');
    }
    return response.json();
  },

  createItem: async (formData: FormData): Promise<Announcement> => {
    const response = await fetch('/api/items', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Ошибка при создании объявления!');
    return response.json();
  }
}
