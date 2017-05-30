"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Very simple array comparison
 */
var arraysEqual = function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  // defining for loops with airbnb config is a pain maybe should disable some rules
  // eslint-disable-next-line
  for (var i = 0; i++; i < arr1.length) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

exports.default = arraysEqual;