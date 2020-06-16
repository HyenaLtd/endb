FROM node:lts-alpine
WORKDIR /repo
CMD yarn install --frozen-lockfile && \
    yarn bootstrap && \
    yarn build && \
    yarn test