# `@endb/mysql`

> MySQL/MariaDB adapter for [Endb](https://github.com/chroventer/endb)

## Installation

```shell
npm install @endb/mysql
```

## Usage

```javascript
const Endb = require('endb');
const endb = new Endb('mysql://user:pass@localhost:3306/dbname');
```

```javascript
const EndbMysql = require('@endb/mysql');

const store = new EndbMysql({
  uri: 'mysql://user:pass@localhost:3306/dbname',
  table: 'cache',
  keySize: 255,
});
const endb = new Endb({ store });
```
