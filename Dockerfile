FROM node:21-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost || exit 1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
