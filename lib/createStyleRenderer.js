"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Returns a single style object provided styleArray and stylesMap
 */
var reduceStyles = function reduceStyles(styleArray, stylesMap) {
  return styleArray.map(function (style) {
    return stylesMap[style];
  }).reduce(function (prev, next) {
    return Object.assign({}, prev, next);
  }, {});
};

/**
 * Returns a styleRenderer from a customStyleMap and a wrapper callback (Component)
 */
var createStyleRenderer = function createStyleRenderer(wrapper, stylesMap) {
  return function (children, styleArray, params) {
    var style = reduceStyles(styleArray, stylesMap);
    return wrapper(Object.assign({}, { children: children }, params, { style: style }));
  };
};

exports.default = createStyleRenderer;