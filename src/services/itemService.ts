import type { Item } from "../types/item";
import type { PaginatedResponse } from "../types/paginatedResponse";
import { fetchWithAuth } from "./api";

export const itemService = {

  // Получение всех находок
  getAllItems: async ( params: {
    campusIds?: number[];
    categoryIds?: number[];
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    ownerId?: number;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Item>> => {

    // Сборка URL-параметров
    const queryParams = new URLSearchParams();

    if (params.campusIds) params.campusIds.forEach(id => queryParams.append('campusId', id.toString()));
    if (params.categoryIds) params.categoryIds.forEach(id => queryParams.append('categoryId', id.toString()));

    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    if (params.ownerId) queryParams.append('ownerId', params.ownerId.toString());

    queryParams.append('page', (params.page || 1).toString());
    queryParams.append('pageSize', (params.pageSize || 12).toString());

    const response = await fetch(`/api/items?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Ошибка при загрузке объявлений с сервера.');
    return response.json();
  },

  // Получение конкретной находки
  getItemById: async (id: number | string): Promise<Item> => {
    const response = await fetchWithAuth(`/api/items/${id}`);
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
    const response = await fetchWithAuth('/api/items', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Ошибка при создании объявления!');
    return response.json();
  },

  // Удаление
  deleteItem: async (id: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/items/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Ошибка удаления!');
  },

  // Переключение статуса "Возвращено"
  toggleReturned: async (id: number): Promise<{ isReturned: boolean }> => {
    const response = await fetchWithAuth(`/api/items/${id}/toggle-returned`, { method: 'PATCH' });
    if (!response.ok) throw new Error('Ошибка при изменении статуса');
    return response.json();
  },

  // Обновление объявления
  updateItem: async (id: number, formData: FormData): Promise<void> => {
    const response = await fetchWithAuth(`/api/items/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) throw new Error('Ошибка при обновлении объявления');
  },

  // Получение контактов владельца
  getOwnerProfile: async (ownerId: number): Promise<{ email: string }> => {
    const response = await fetch(`/api/users/${ownerId}`);
    if (!response.ok) throw new Error('Владелец не найден');
    return response.json();
  },
};
