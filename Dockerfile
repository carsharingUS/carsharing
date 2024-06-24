# Dockerfile
FROM python:3.9-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libmariadb-dev \
    pkg-config \
    libgdal-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY carsharing/ /app/

RUN find /usr -name "libgdal.so" -print > /tmp/libgdal_path.txt

# Lee la ubicación de libgdal.so desde el archivo temporal
RUN GDAL_PATH=$(cat /tmp/libgdal_path.txt) && \
    export GDAL_LIBRARY_PATH="$GDAL_PATH"

EXPOSE 8000