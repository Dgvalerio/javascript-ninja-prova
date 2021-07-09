/* eslint-disable no-param-reassign, prefer-rest-params, strict */
(function moduleDOM(doc, win) {
  'use strict';

  function DOM(elements) {
    if (!(this instanceof DOM)) return new DOM(elements);
    this.element = doc.querySelectorAll(elements);
  }

  DOM.prototype.forEach = function forEach() {
    return Array.prototype.forEach.apply(this.element, arguments);
  };
  DOM.prototype.map = function map() {
    return Array.prototype.map.apply(this.element, arguments);
  };
  DOM.prototype.filter = function filter() {
    return Array.prototype.filter.apply(this.element, arguments);
  };
  DOM.prototype.reduce = function reduce() {
    return Array.prototype.reduce.apply(this.element, arguments);
  };
  DOM.prototype.reduceRight = function reduceRight() {
    return Array.prototype.reduceRight.apply(this.element, arguments);
  };
  DOM.prototype.every = function every() {
    return Array.prototype.every.apply(this.element, arguments);
  };
  DOM.prototype.some = function some() {
    return Array.prototype.some.apply(this.element, arguments);
  };

  DOM.prototype.on = function on(event, callback) {
    return this.map((e) => e.addEventListener(event, callback, false));
  };

  DOM.prototype.off = function off(event, callback) {
    return this.map((e) => e.removeEventListener(event, callback, false));
  };

  DOM.prototype.get = function get(index) {
    if (!index) return this.element[0];
    return this.element[index];
  };

  DOM.type = (value) => Object.prototype.toString.call(value);

  DOM.isArray = (value) => DOM.type(value) === '[object Array]';
  DOM.isObject = (value) => DOM.type(value) === '[object Object]';
  DOM.isFunction = (value) => DOM.type(value) === '[object Function]';
  DOM.isNumber = (value) => DOM.type(value) === '[object Number]';
  DOM.isString = (value) => DOM.type(value) === '[object String]';
  DOM.isBoolean = (value) => DOM.type(value) === '[object Boolean]';
  DOM.isNull = (value) =>
    DOM.type(value) === '[object Undefined]' ||
    DOM.type(value) === '[object Null]';

  win.DOM = DOM;
})(document, window);
