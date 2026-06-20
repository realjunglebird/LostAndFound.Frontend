import type { User } from "../types/user";
import { fetchWithAuth } from "./api";

export const userService = {

  // Получение конкретного пользователя
  getUserById: async (id: number | string): Promise<User> => {
    const response = await fetchWithAuth(`/api/users/${id}`);
    if (!response.ok) {
      if (response.status == 404) {
        throw new Error('Пользователь не найден.');
      }
      throw new Error('Ошибка при получении данных с сервера.');
    }
    return response.json();
  },

  // Обновление данных пользователя
  updateUser: async (id: number | string, data: Partial<User>): Promise<User> => {
    const response = await fetchWithAuth(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Не удалось обновить профиль');
    return response.json();
  },

  // Переключение статуса блокировки пользователя
  toggleBan: async (id: number | string): Promise<{ message: string, isBanned: boolean }> => {
    const response = await fetchWithAuth(`/api/users/${id}/toggle-ban`, {
      method: 'POST',
    });

    if (!response.ok) throw new Error('Возникла ошибка');

    return response.json();
  },
}
