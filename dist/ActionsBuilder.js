'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* ==========================================================================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ActionsBuilder
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ========================================================================== */

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _Action = require('./Action');

var _Action2 = _interopRequireDefault(_Action);

var _Interceptors = require('./Interceptors');

var _Interceptors2 = _interopRequireDefault(_Interceptors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ActionsBuilder = function () {
  function ActionsBuilder(Model, url) {
    var _this = this;

    var mappings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var customActions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, ActionsBuilder);

    // `ReactResource` config
    this.resource = {
      url: url,
      mappings: mappings,
      customActions: customActions
    };

    // `Model` actions configs
    this.actions = (0, _reduce2.default)((0, _merge2.default)(customActions, ActionsBuilder.defaults), function (accumulator, cfg, name) {
      accumulator[name] = _this.configure(name, cfg);

      return accumulator;
    }, {});

    // `Model` interceptors
    this.interceptors = new _Interceptors2.default(Model);
  }

  /**
   * Merge default action config with `ReactResource` customActions config
   *
   * @param {String} name - Name of action
   * @param {Object} config - Default action config
   *
   * @return {Object} - Merged config
   */

  _createClass(ActionsBuilder, [{
    key: 'configure',
    value: function configure(name, config) {
      var _resource = this.resource,
          url = _resource.url,
          customActions = _resource.customActions;


      return (0, _merge2.default)({ url: url }, config, customActions[name]);
    }

    /**
     * Build class actions
     *
     * @param {Class} Model - `Model` class for creating class methods
     *
     * @return {Class} Model - `Model` class with class methods
     */

  }, {
    key: 'classMethods',
    value: function classMethods(Model) {
      var _this2 = this;

      var mappings = this.resource.mappings;


      (0, _each2.default)(this.actions, function (cfg, name) {
        // First argument can be `data` or successfull request `callback function`
        Model[name] = function () {
          for (var _len = arguments.length, kwargs = Array(_len), _key = 0; _key < _len; _key++) {
            kwargs[_key] = arguments[_key];
          }

          // Extract `data` from arguments and pass it as param to `Action` constructor
          var data = (0, _isFunction2.default)(kwargs[0]) ? {} : kwargs.shift();
          var action = new _Action2.default(Model, name, cfg, data, mappings, _this2.interceptors);

          return action.promise.apply(action, kwargs);
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

  }, {
    key: 'instanceMethods',
    value: function instanceMethods(data, Model) {
      var mappings = this.resource.mappings;

      var interceptors = this.interceptors;
      var updatedData = data;

      // Merge the updated params from the instance method with the data object, where this is the instance
      (0, _each2.default)(this.actions, function (cfg, name) {
        Model.prototype['$' + name] = function () {

          if (['update', 'create'].includes(name)) {
            updatedData = (0, _merge2.default)({}, data, this);
          }

          var action = new _Action2.default(Model, name, cfg, updatedData, mappings, interceptors);
          return action.promise.apply(action, arguments);
        };
      });

      return Model;
    }
  }]);

  return ActionsBuilder;
}();

ActionsBuilder.defaults = {
  'query': { url: undefined, params: {}, method: 'get' },
  'get': { url: undefined, params: {}, method: 'get' },
  'create': { url: undefined, params: {}, method: 'post' },
  'update': { url: undefined, params: {}, method: 'put' },
  'delete': { url: undefined, params: {}, method: 'delete' }
};
exports.default = ActionsBuilder;