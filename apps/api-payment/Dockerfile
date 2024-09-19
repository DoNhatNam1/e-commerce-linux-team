FROM node:20-alpine as development

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG DATABASE_URL $DATABASE_URL
ARG PAYMENT_PORT $PAYMENT_PORT
ARG PAYMENT_HOST $PAYMENT_HOST
ARG APPID $APPID
ARG KEY1 $KEY1
ARG KEY2 $KEY2
ARG ZLP_MERCHANT_CALLBACK_URL $ZLP_MERCHANT_CALLBACK_URL

COPY . .
RUN npx prisma generate
RUN npm run build:api-payment

FROM node:20-alpine as production
ENV NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=development /app/dist/apps/api-payment ./
COPY --from=development /app/prisma ./prisma
RUN npm install --only=production
RUN npx prisma generate

CMD ["node", "main"]