'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stubContentBlock = require('./helpers/stubContentBlock');

var _stubContentBlock2 = _interopRequireDefault(_stubContentBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var populateDecoratorRanges = function populateDecoratorRanges(array, component) {
  return function (start, end) {
    return array.push({ offset: start, length: end - start, component: component });
  };
};

/**
 * Calls strategy for each decorator with ContentBlock or its stub
 */
var decorateBlock = function decorateBlock(block, decorators, _ref) {
  var createContentBlock = _ref.createContentBlock;

  var decoratorRanges = [];
  // create ContentBlock or a stub
  var contentBlock = createContentBlock ? createContentBlock(block) : (0, _stubContentBlock2.default)(block);
  decorators.map(function (_ref2) {
    var strategy = _ref2.strategy,
        component = _ref2.component;
    return strategy(contentBlock, populateDecoratorRanges(decoratorRanges, component));
  });
  return Object.assign({}, block, { decoratorRanges: decoratorRanges });
};

var withDecorators = function withDecorators(blocks, decorators, options) {
  return blocks.map(function (block) {
    return decorateBlock(block, decorators, options || {});
  });
};

exports.default = withDecorators;