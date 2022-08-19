FROM node:18

USER node
RUN mkdir -p /home/node/cubari-proxy-services
WORKDIR /home/node/cubari-proxy-services

COPY --chown=node:node package.json package-lock.json ./

RUN npm install --quiet

COPY --chown=node:node . .

CMD ["npm", "run", "start"]
