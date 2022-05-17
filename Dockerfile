FROM ghcr.io/flaresolverr/flaresolverr:v2.2.4
# This Dockerfile is relatively fragile since it depends on
# a lot in the base Dockerfile. Consult the upstream image
# before making any changes or upgrades.

USER node
RUN mkdir -p /home/node/cubari-proxy-services
WORKDIR /home/node/cubari-proxy-services

COPY --chown=node:node package.json package-lock.json ./

RUN npm install --quiet

COPY --chown=node:node . .

CMD ["npm", "run", "start"]
