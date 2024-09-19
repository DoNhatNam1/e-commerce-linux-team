# Install dependencies only when needed
FROM docker.io/node:lts-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

ARG DATABASE_URL $DATABASE_URL
ARG APPID $APPID
ARG KEY1 $KEY1
ARG KEY2 $KEY2
ARG UPLOADTHING_APP_ID $UPLOADTHING_APP_ID
ARG UPLOADTHING_SECRET $UPLOADTHING_SECRET
ARG KINDE_CLIENT_ID $KINDE_CLIENT_ID
ARG KINDE_CLIENT_SECRET $KINDE_CLIENT_SECRET
ARG KINDE_ISSUER_URL $KINDE_ISSUER_URL
ARG KINDE_SITE_URL $KINDE_SITE_URL
ARG KINDE_POST_LOGOUT_REDIRECT_URL $KINDE_POST_LOGOUT_REDIRECT_URL
ARG KINDE_POST_LOGIN_REDIRECT_URL $KINDE_POST_LOGIN_REDIRECT_URL
ARG RESEND_API_KEY $RESEND_API_KEY
ARG ZLP_MERCHANT_CALLBACK_URL $ZLP_MERCHANT_CALLBACK_URL
ARG NEXT_PUBLIC_PAYMENT_SERVER $NEXT_PUBLIC_PAYMENT_SERVER
ARG NEXT_PUBLIC_SERVER_URL $NEXT_PUBLIC_SERVER_URL

WORKDIR /usr/src/app
COPY .npmrc package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build:auth-buy-step-product

FROM docker.io/node:lts-alpine AS runner
RUN apk add --no-cache dumb-init
WORKDIR /usr/src/app

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

# Run the application under "node" user by default
RUN addgroup nodejs
RUN adduser -SDH nextjs
RUN mkdir apps
RUN cd apps
RUN mkdir auth-buy-step-product
RUN chown nextjs:nodejs auth-buy-step-product
RUN cd ..
RUN chown nextjs:nodejs apps
RUN mkdir libs
RUN chown nextjs:nodejs libs

# Copy installed dependencies from deps stage
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/dist/apps/auth-buy-step-product ./apps/auth-buy-step-product
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/dist/libs ./libs

USER nextjs

EXPOSE 8080
ENV PORT 8080
ENV HOST 0.0.0.0

RUN cd apps
RUN cd auth-buy-step-product

# If you are using the custom server implementation:
CMD ["dumb-init", "node", "server/main.js"]

# If you are using the NextJS built-int server:
# CMD ["dumb-init", "npm", "start"]