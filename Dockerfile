# build
FROM node:20-alpine as builder

# A small line inside the image to show who made it
LABEL Developers="Cristian B Gonzalez"

WORKDIR /app

# install dependencies
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Clean install all node modules
RUN npm ci

# Copy all local files into the image
COPY . .

# Get prisma ready
RUN npx prisma generate
#RUN npx prisma migrate dev

# Copy the entrypoint script into the container
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Build SvelteKit app
RUN npm run build

# execute
FROM node:20-alpine

WORKDIR /app

## copy from build
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
COPY --from=builder /app/prisma ./prisma

## Svelte port
EXPOSE 5173

#CMD ["npm", "run", "dev", "--", "--host"]
CMD ["node", "./build"]
#ENTRYPOINT [ "./entrypoint.sh" ]