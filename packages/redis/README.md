# `@endb/redis`

> Redis adapter for [Endb](https://github.com/chroventer/endb)

## Installation

```shell
npm install @endb/redis
```

## Usage

```javascript
const Endb = require('endb');
const endb = new Endb('redis://user:pass@localhost:6379');
```

```javascript
const EndbRedis = require('@endb/redis');

const store = new EndbRedis({
  uri: 'redis://user:pass@localhost:6379',
  retry_unfulfilled_commands: true,
});
const endb = new Endb({ store });
```
