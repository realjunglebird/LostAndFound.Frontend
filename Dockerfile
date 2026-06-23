# Получение образа Node.js для сборки React
FROM node:20-alpine AS build-stage
WORKDIR /app

# Копирование файлов зависимостей и их установка
COPY package*.json ./
RUN npm install

# Копирование остального кода проекта и его сборка
COPY . .
RUN npm run build

# Получение образа Nginx и его настройка
FROM nginx:stable-alpine AS production-stage
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копирование собранного проекта в папку Nginx для раздачи статики
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Открытие порта 80
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
