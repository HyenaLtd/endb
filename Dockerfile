FROM node:lts-alpine
WORKDIR /repo
CMD yarn bootstrap && \
    yarn build && \
    yarn test