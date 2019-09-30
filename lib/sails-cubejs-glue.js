var CubejsServerCore = require("@cubejs-backend/server-core");
var Express = require('express');
var runMiddleware = require('run-middleware');
var _ = require('lodash');

const schemasExample = [
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

var logger = (msg, params) => sails.log.info(msg, params);

const bootstrap = async (schemas, options = {}) => {
  // express app
  var cubeApp = Express();

  // make it all
  if (typeof options['logger'] == 'function') logger = options['logger'];

  const defaultOptions = {
    devServer: false,
    logger: logger,
    repositoryFactory: () => ({
      dataSchemaFiles: async () => schemas
    })
  };

  await CubejsServerCore.create({...defaultOptions, ...options}).initApp(cubeApp);
  runMiddleware(cubeApp);

  // show some info if development mode
  if (sails.config.environment == 'development') {
     _.forEach(cubeApp._router.stack, v => console.log('+ cubejs route: ', v))
  }
  return cubeApp;
}

const createProxy = (cubeApp) => (original_req, res) => {
  cubeApp.runMiddleware(original_req.url, {
    original_req
  }, (code, data, headers) => {
    res.type('json').status(code).send(data);
  });
}

module.exports = { bootstrap, createProxy }
