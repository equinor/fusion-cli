FROM node:14

COPY .devcontainer.json ./

WORKDIR /app

COPY package*.json ./
RUN npm install --no-progress --no-optional

COPY . .

EXPOSE 3000

CMD npm run dev
