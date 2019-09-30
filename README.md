# Sails CubeJS Glue

[![npm version](https://badge.fury.io/js/sails-cubejs-glue.svg)](https://badge.fury.io/js/sails-cubejs-glue)  [![Coverage Status](https://coveralls.io/repos/github/ryanhs/sails-cubejs-glue/badge.svg?branch=master)](https://coveralls.io/github/ryanhs/sails-cubejs-glue?branch=master)  ![node](https://img.shields.io/node/v/sails-cubejs-glue)  ![npm bundle size](https://img.shields.io/bundlephobia/min/sails-cubejs-glue)

this package is intended to make a glue for `cubejs` and `sails` framework.

With this method, you can still use sails's functionalities like policy as it is.

### Installation

to install is just straight forward:

- with npm: `npm i sails-cubejs-glue`
- with yarn: `yarn add sails-cubejs-glue`



### Example Action

this is lazy method, that do everything one the action. (bootstrap and proxying).

**Althought its better idea to use sails's hook for bootstrapping and action only proxying, this example is enough:**

ON *api/controllers/cube.js*:

```javascript
/* api/controllers/cube.js */

var glue = require('./sails-cubejs-glue');

var cubeApp = null;
const schemas = [
  {
    fileName: 'Orders.js',
    content: `
      cube('Orders', {
        sql: 'SELECT * FROM orders',
        measures: {
          countAll: {
            type: 'count'
          },
        }
      });
    `
  }
]


module.exports = async (req, res) => {
  if (cubeApp === null) cubeApp = await glue.bootstrap(schemas, {basePath: '/cube'});

  glue.createProxy(cubeApp)(req, res);
}

```

ON *config/routes.js* add the graphql route:

```javascript
module.exports.routes = {
  ...
  '/cube/*': { action: 'cube' },
};

```

### Func: async bootstrap()

this function is to bootstrap cubejs

###### + parameters

- schemas `array of cubejs schema` (example bellow)
- options `(optional, to overrides cubejs-backend/server-core options)`

###### + example

```javascript
sails.cubeApp = await glue.bootstrap(schemas, {
  basePath: '/cube',
  logger: (msg, params) => {
    console.log(`${msg}: ${JSON.stringify(params)}`);
  },
});
```

###### Reference

cubejs-backend-server-core docs: [https://cube.dev/docs/@cubejs-backend-server-core#options-reference](https://cube.dev/docs/@cubejs-backend-server-core#options-reference)


### Func: createProxy(cubeApp)(req, res)

This function to proxying cubejs app into normal handler `(req, res) => ...`



###### + parameters

- cubeApp `return of this module bootstrap`

###### + examples in action

1.
```javascript
module.exports = glue.createProxy(sails.cubeApp);
```

2.
```javascript
module.exports = (req, res) => {
  var proxy = glue.createProxy(sails.cubeApp);
      proxy(req, res);
};
```


### Connecting to Database

As cubejs's documentation: [https://cube.dev/docs/connecting-to-the-database](https://cube.dev/docs/connecting-to-the-database).

Example in environment variables:
```
CUBEJS_DB_TYPE=mongobi
CUBEJS_API_SECRET=123123
CUBEJS_DB_HOST=localhost
CUBEJS_DB_PORT=3307
CUBEJS_DB_USER=
CUBEJS_DB_PASS=
CUBEJS_DB_NAME=app
```

#### Drivers Dependencies

quoted from `@cubejs-backend/server-core/core/index.js`

```javascript
const DriverDependencies = {
  postgres: '@cubejs-backend/postgres-driver',
  mysql: '@cubejs-backend/mysql-driver',
  mssql: '@cubejs-backend/mssql-driver',
  athena: '@cubejs-backend/athena-driver',
  jdbc: '@cubejs-backend/jdbc-driver',
  mongobi: '@cubejs-backend/mongobi-driver',
  bigquery: '@cubejs-backend/bigquery-driver',
  redshift: '@cubejs-backend/postgres-driver',
  clickhouse: '@cubejs-backend/clickhouse-driver',
  hive: '@cubejs-backend/hive-driver',
  snowflake: '@cubejs-backend/snowflake-driver',
  prestodb: '@cubejs-backend/prestodb-driver',
  oracle: '@cubejs-backend/oracle-driver',
};
```


### License

MIT
