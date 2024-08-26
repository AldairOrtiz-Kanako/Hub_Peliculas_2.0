# Usa una imagen base de Node.js para la construcción
FROM node:18.19.0 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración y las dependencias
COPY package*.json ./
RUN npm ci

# Copia el código fuente de la aplicación
COPY . .

# Imprime información de depuración
RUN node --version
RUN npm --version
RUN npm list

# Intenta construir con más verbosidad
RUN npm run build -- --configuration production --verbose

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copia los archivos de construcción al directorio de Nginx
COPY --from=build /app/dist/Hub_Peliculas_2.0 /usr/share/nginx/html

# Exponer el puerto en el que Nginx está escuchando
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]