/* ==========================================================================
   ActionsBuilder
   ========================================================================== */

import reduce from 'lodash/reduce';
import each from 'lodash/each';
import merge from 'lodash/merge';
import isFunction from 'lodash/isFunction';
import Action from './Action';
import Interceptors from './Interceptors';

export default class ActionsBuilder {
  static defaults = {
    'query': { url: undefined, params: {}, method: 'get' },
    'get': { url: undefined, params: {}, method: 'get' },
    'create': { url: undefined, params: {}, method: 'post' },
    'update': { url: undefined, params: {}, method: 'put' },
    'delete': { url: undefined, params: {}, method: 'delete' },
  };

  constructor(Model, url, mappings = {}, customActions = {}) {
    // `ReactResource` config
    this.resource = {
      url,
      mappings,
      customActions,
    };

    // `Model` actions configs
    this.actions = reduce(
      merge(customActions, ActionsBuilder.defaults),
      (accumulator, cfg, name) => {
        accumulator[name] = this.configure(name, cfg);

        return accumulator;
      },
      {}
    );

    // `Model` interceptors
    this.interceptors = new Interceptors(Model);
  }

  /**
   * Merge default action config with `ReactResource` customActions config
   *
   * @param {String} name - Name of action
   * @param {Object} config - Default action config
   *
   * @return {Object} - Merged config
   */

  configure(name, config) {
    const { url, customActions } = this.resource;

    return merge({ url }, config, customActions[name]);
  }

  /**
   * Build class actions
   *
   * @param {Class} Model - `Model` class for creating class methods
   *
   * @return {Class} Model - `Model` class with class methods
   */

  classMethods(Model) {
    const { mappings } = this.resource;

    each(this.actions, (cfg, name) => {
      // First argument can be `data` or successfull request `callback function`
      Model[name] = (...kwargs) => {
        // Extract `data` from arguments and pass it as param to `Action` constructor
        const data = isFunction(kwargs[0]) ? {} : kwargs.shift();
        const action = new Action(Model, name, cfg, data, mappings, this.interceptors);

        return action.promise(...kwargs);
      };
    });

    return Model;
  }

  /**
   * Build instance actions
   *
   * @param {Object} data - `Model` instance data for request
   * @param {Class} Model - `Model` class for creating instance/prototype methods
   *
   * @return {Class} Model - `Model` class with instance/prototype methods
   */

  instanceMethods(data, Model) {
    const { mappings } = this.resource;
    const interceptors = this.interceptors;
    let updatedData;

    each(this.actions, (cfg, name) => {
      Model.prototype[`$${name}`] = function(...kwargs) {
        // Merge the updated params from the instance method with the data object, where this is the instance
        updatedData = Object.assign({}, data, this);
        const action = new Action(Model, name, cfg, updatedData, mappings, interceptors);

        return action.promise(...kwargs);
      };
    });

    return Model;
  }
}
