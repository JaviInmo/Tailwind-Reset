# Etapa build
FROM node:20 AS builder

WORKDIR /app

# Copiamos package.json y lockfile
COPY package.json pnpm-lock.yaml ./

# Instalamos dependencias
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código
COPY . .

# Generamos cliente Prisma
RUN  pnpm dlx prisma generate

# Build Next.js
RUN pnpm run build

# Etapa runtime
FROM node:20 AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./

CMD ["pnpm", "start"]
