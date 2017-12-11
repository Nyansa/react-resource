'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = undefined;
exports.default = request;
exports.parseJSON = parseJSON;

require('whatwg-fetch');

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Expose default settings
 */

/* ==========================================================================
   Request
   ========================================================================== */

var defaults = exports.defaults = {
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} options   The options we want to pass to "fetch"
 *
 * @return {object}           An object containing either "data" or "error"
 */

function request(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return fetch(url, (0, _merge2.default)(options, defaults)).then(checkStatus).then(parseJSON).then(function (data) {
    return data;
  });
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */

function parseJSON(response) {
  // Reponse could be blank, so we convert to text and then json
  return response.text().then(function (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  });
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

function checkStatus(response) {
  // return response;
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  var error = new Error(response.statusText);
  error.response = response;

  throw error;
}