FROM node:lts

WORKDIR /app
COPY . /app

RUN npm install -g yarn
RUN yarn

EXPOSE 3000
CMD [ "yarn", "start" ]