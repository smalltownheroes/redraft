'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Check if block has any text, respects trim setting
 */
var hasText = function hasText(text, _ref) {
  var trim = _ref.trim;
  return !!(trim ? text.trim() : text);
};

/**
 * Check if block has any data like text, metadata or entities
 */
var hasData = function hasData(block, options) {
  if (hasText(block.text, options)) {
    return true;
  }
  if (block.data && Object.keys(block.data).length) {
    return true;
  }
  if (block.entityRanges && block.entityRanges.length) {
    return true;
  }
  return false;
};

/**
 * Checks if current block is empty and if it should be ommited according to passed settings
 */
var checkCleanup = function checkCleanup(block, prevType, _ref2) {
  var cleanup = _ref2.cleanup;

  if (!cleanup || hasData(block, cleanup)) {
    return false;
  }
  // Check if cleanup is enabled after prev type
  if (cleanup.after && cleanup.after !== 'all' && !(cleanup.after.indexOf(prevType) !== -1)) {
    return false;
  }
  // Handle the except array if passed
  if (cleanup.except && !(cleanup.except.indexOf(block.type) !== -1)) {
    return true;
  }
  // Finaly if cleanup is enabled for current type
  if (cleanup.types && (cleanup.types === 'all' || cleanup.types.indexOf(block.type) !== -1)) {
    return true;
  }
  return false;
};

exports.default = checkCleanup;