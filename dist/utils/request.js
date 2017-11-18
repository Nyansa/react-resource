'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = undefined;
exports.default = request;
exports.parseJSON = parseJSON;

require('axios');

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

  return axios(url, (0, _merge2.default)(optsion, defaults)).then(parseJSON).then(function (data) {
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
  return response.json();
}

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