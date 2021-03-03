const qs = require('qs');

function qsMiddleware(options) {
  Object.assign(options || {}, { ignoreQueryPrefix: true, comma: true });
  return function (request, response, next) {
    request.query = qs.parse(request.query, options);
    next();
  };
}

module.exports = qsMiddleware;
