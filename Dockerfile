FROM node:12

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4000
# 開発環境と本番環境で起動コマンド分けたい
CMD ["npm", "run", "start"]