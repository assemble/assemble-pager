'use strict';

var isValid = require('is-valid-app');
var extend = require('extend-shallow');
var PluginError = require('plugin-error');
var through = require('through2');

/**
 * Add `prev`/`next` paging information to the context for files
 * in the current stream.
 *
 * @name plugin
 * @param {Object} [options]
 * @param {String|Array} [options.sortBy]
 * @return {Stream} Returns a [vinyl][] stream
 * @api public
 */

module.exports = function(config) {
  return function(app) {
    if (!isValid(app, 'assemble-pager')) return;

    /**
     * Add `prev`/`next` paging information to the context for files
     * in the current stream.
     *
     * @name .pager
     * @param {Object} [options]
     * @param {String|Array} [options.sortBy]
     * @return {Stream} Returns a [vinyl][] stream
     * @api public
     */

    app.define('pager', function(options) {
      var opts = extend({}, config, options);
      var list = new app.List({pager: true});

      return through.obj(function(file, enc, next) {
        if (file.isNull()) {
          next(null, file);
          return;
        }

        if (!file.isView) {
          next(new PluginError('assemble-pager', 'expected an assemble view', {showStack: true}));
          return;
        }

        if (file.data.pager === false) {
          next(null, file);
          return;
        }

        if (opts.collection && file.options.collection !== opts.collection) {
          next(null, file);
          return;
        }

        list.addItem(file);
        next();
      }, function(cb) {
        if (opts.sortBy) {
          list = list.sortBy(opts.sortBy);
        }

        for (var i = 0; i < list.items.length; i++) {
          this.push(list.items[i]);
        }
        cb();
      });
    });
  };
};

/**
 * Expose helpers
 */

module.exports.helpers = require('./lib/helpers');
