export const authService = {
  login: async (email: string, password: string): Promise<{ token: string }> => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || errorData.title || 'Ошибка авторизации');
      } catch {
        throw new Error(errorText || 'Ошибка авторизации');
      }
    }
    return response.json();
  },

  register: async (email: string, password: string): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Ошибка регистрации');
    }
    return response.json();
  }
};
