# syntax = docker/dockerfile:1.2

ARG NODE_VERSION=20
ARG PORT=3000
ARG FLAVOR=alpine

FROM --platform=linux/arm64 node:${NODE_VERSION}-${FLAVOR} as base

ARG UID=1005
ARG GID=1005
ARG USER=app

ENV PORT=$PORT
EXPOSE $PORT

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini

RUN addgroup -S -g ${GID} ${USER} && adduser -S --uid ${UID} ${USER} -G ${USER}
RUN mkdir /app && chown -R $USER:$USER /app
RUN npm i -g @nestjs/cli
USER $USER
WORKDIR /app


# prd deps
FROM node:${NODE_VERSION}-${FLAVOR} as vendors
ENV NODE_ENV=production
WORKDIR /app
COPY --chown=$USER:$USER package*.json ./
RUN --mount=type=cache,target=/tmp/cache,id=npm_cache npm ci --only=production && npm cache clean --force


# dev deps
FROM base as builder
ENV NODE_ENV=development
WORKDIR /app
COPY --chown=app:app --from=vendors /app/node_modules /app/node_modules
COPY --chown=$USER:$USER package*.json ./
COPY --chown=app:app . ./
RUN npm install
RUN npm install --dev
# Installa Prisma CLI e genera il client
RUN npx prisma generate
RUN npm run build

FROM base as dev
ENV NODE_ENV=development
COPY --chown=app:app --from=builder /app/node_modules /app/node_modules
COPY --chown=$USER:$USER package*.json ./
COPY --chown=app:app . ./
USER $USER
CMD ["npm", "run", "start:dev"]