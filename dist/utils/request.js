'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = undefined;
exports.default = request;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

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

  // set body to data for axios. This can be donw in arguments-parser, but it is best here for now incase a separate AJAX like library is used
  var updatedOptions = convertBetweenObjectParams(options, 'body', 'data');
  return (0, _axios2.default)(url, (0, _merge2.default)(updatedOptions, defaults)).then(function (_ref) {
    var data = _ref.data;
    return data;
  });
}

function convertBetweenObjectParams(object, fromKey, toKey) {
  var updatedObject = (0, _merge2.default)({}, object);

  updatedObject[toKey] = updatedObject[fromKey];
  delete updatedObject[fromKey];

  return updatedObject;
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */

//export function parseJSON(response) {
//  return response.json();
//}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

//function checkStatus(response) {
//  // return response;
//  if (response.status >= 200 && response.status < 300) {
//    return response;
//  }
//
//  const error = new Error(response.statusText);
//  error.response = response;
//
//  throw error;
//}