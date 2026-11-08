FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Copiar explícitamente lo necesario evita incluir .env.local y claves de servicio en la imagen.
COPY src ./src
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tailwind.config.js postcss.config.js ./

RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración mínima para servir la SPA y soportar rutas de React Router.
RUN rm -f /etc/nginx/conf.d/default.conf \
    && printf '%s\n' \
       'server {' \
       '    listen 80;' \
       '    server_name _;' \
       '    root /usr/share/nginx/html;' \
       '    index index.html;' \
       '    location / {' \
       '        try_files $uri $uri/ /index.html;' \
       '    }' \
       '    location /assets/ {' \
       '        try_files $uri =404;' \
       '        expires 1y;' \
       '        add_header Cache-Control "public, immutable";' \
       '    }' \
       '    add_header X-Content-Type-Options nosniff always;' \
       '    add_header X-Frame-Options DENY always;' \
       '}' > /etc/nginx/conf.d/default.conf \
    && mkdir -p /var/cache/nginx /var/run \
    && chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run

USER nginx
EXPOSE 80

# Omite el entrypoint de la imagen base: la configuración ya está preparada para el usuario nginx.
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
