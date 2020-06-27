# `@endb/postgres`

> PostgreSQL adapter for [Endb](https://github.com/chroventer/endb)

## Installation

```shell
npm install @endb/postgres
```

## Usage

```javascript
const Endb = require('endb');
const endb = new Endb('postgresql://user:pass@localhost:5432/dbname');
```

```javascript
const EndbPostgres = require('@endb/postgres');

const store = new EndbPostgres({
  uri: 'postgresql://user:pass@localhost:5432/dbname',
  table: 'cache',
});
const endb = new Endb({ store });
```
