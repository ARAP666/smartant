FROM node:24-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/mobile/package.json apps/mobile/package.json
COPY packages/finance/package.json packages/finance/package.json

RUN npm ci --omit=dev

COPY tsconfig.json ./
COPY apps/api apps/api
COPY packages/finance packages/finance

RUN npm run prisma:generate --workspace @smart-ant/api

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace", "@smart-ant/api"]
