FROM node:lts-alpine
WORKDIR /repo
CMD yarn install && \
    rm -rf node_modules/@endb && \
    yarn bootstrap && \
    yarn build && \
    yarn test