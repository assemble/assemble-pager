'use strict';

var relative = require('relative');
var helpers = module.exports;

function relativePath(from, to) {
  return relative(from.data.path, to.data.path);
}

/**
 * Stringify attributes on the options `hash`.
 *
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

helpers.attr = function(options) {
  return ' ' + Object.keys(options.hash).map(function(key) {
    return key + '="' + options.hash[key] + '"';
  }).join(' ');
};

helpers.relative = function(from, to) {
  return relativePath(from, to);
};

helpers.ifFirst = function(pager, str) {
  if (!pager.isPager) {
    return this.context.pager.isFirst ? pager : '';
  }
  return pager.isFirst ? str : '';
};

helpers.ifLast = function(pager, str) {
  if (!pager.isPager) {
    return this.context.pager.isLast ? pager : '';
  }
  return pager.isLast ? str : '';
};

helpers.next = function(pager) {
  // if defined as `{{next}}` inside a `{{#pager}}` block
  if (!pager.isPager) pager = this.context.pager;
  // or, if defined as `{{next pager}}`
  return pager.next ? relativePath(pager.current, pager.next) : '#';
};

helpers.prev = function(pager) {
  // if defined as `{{prev}}` inside a `{{#pager}}` block
  if (!pager.isPager) pager = this.context.pager;
  // or, if defined as `{{prev pager}}`
  return pager.prev ? relativePath(pager.current, pager.prev) : '#';
};

