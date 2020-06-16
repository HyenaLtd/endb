FROM node:lts-alpine
WORKDIR /repo
CMD yarn build && \
    yarn install && \
    yarn test