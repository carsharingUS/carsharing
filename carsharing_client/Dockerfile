# Dockerfile for frontend

# Etapa 1: Construcción del frontend
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /frontend

# Copia los archivos de configuración de npm
COPY carsharing_client/package.json ./

COPY carsharing_client/package-lock.json ./

# Instala las dependencias de npm
RUN npm install

# Copia el resto del código fuente del frontend
COPY carsharing_client/ /frontend/

# Construye la aplicación de React
RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "preview" ]
