'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Logs a warning message if not in production
 */
var warn = function warn(msg) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('Redraft: ' + msg); // eslint-disable-line no-console
  }
};

exports.default = warn;