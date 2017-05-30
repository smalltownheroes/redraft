"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// return a new generator wich produces sequential keys for nodes
var getKeyGenerator = function getKeyGenerator() {
  var key = 0;
  var keyGenerator = function keyGenerator() {
    var current = key;
    key += 1;
    return current; // eslint-disable-line no-plusplus
  };
  return keyGenerator;
};

exports.default = getKeyGenerator;