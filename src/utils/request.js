/* ==========================================================================
   Request
   ========================================================================== */

import axios from 'axios';
import merge from 'lodash/merge';

/**
 * Expose default settings
 */

export const defaults = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} options   The options we want to pass to "fetch"
 *
 * @return {object}           An object containing either "data" or "error"
 */

export default function request(url, options = {}) {
  // set body to data for axios. This can be donw in arguments-parser, but it is best here for now incase a separate AJAX like library is used
  let updatedOptions = convertBetweenObjectParams(options, 'body', 'data');
  return axios(url, merge(updatedOptions, defaults))
    .then(({ data }) => data);
}

function convertBetweenObjectParams(object, fromKey, toKey) {
  let updatedObject = merge({}, object);

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
