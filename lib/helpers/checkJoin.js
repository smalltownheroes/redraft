'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Joins the input if the joinOutput option is enabled
 */
var checkJoin = function checkJoin(input, options) {
  if (Array.isArray(input) && options.joinOutput) {
    return input.join('');
  }
  return input;
};

exports.default = checkJoin;