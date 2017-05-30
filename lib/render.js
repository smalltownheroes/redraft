'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.renderNode = undefined;

var _RawParser = require('./RawParser');

var _RawParser2 = _interopRequireDefault(_RawParser);

var _warn = require('./helpers/warn');

var _warn2 = _interopRequireDefault(_warn);

var _checkCleanup = require('./helpers/checkCleanup');

var _checkCleanup2 = _interopRequireDefault(_checkCleanup);

var _getKeyGenerator = require('./helpers/getKeyGenerator');

var _getKeyGenerator2 = _interopRequireDefault(_getKeyGenerator);

var _checkJoin = require('./helpers/checkJoin');

var _checkJoin2 = _interopRequireDefault(_checkJoin);

var _pushString = require('./helpers/pushString');

var _pushString2 = _interopRequireDefault(_pushString);

var _defaultOptions = require('./defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _withDecorators = require('./withDecorators');

var _withDecorators2 = _interopRequireDefault(_withDecorators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Recursively renders a node with nested nodes with given callbacks
 */
var renderNode = exports.renderNode = function renderNode(node, inlineRenderers, entityRenderers, styleRenderers, entityMap, options, keyGenerator) {
  if (node.styles && styleRenderers) {
    return styleRenderers((0, _checkJoin2.default)(node.content, options), node.styles, { key: keyGenerator() });
  }
  var children = [];
  var index = 0;
  node.content.forEach(function (part) {
    if (typeof part === 'string') {
      children = (0, _pushString2.default)(part, children, index);
    } else {
      index += 1;
      children[index] = renderNode(part, inlineRenderers, entityRenderers, styleRenderers, entityMap, options, keyGenerator);
      index += 1;
    }
  });
  if (node.style && inlineRenderers[node.style]) {
    return inlineRenderers[node.style]((0, _checkJoin2.default)(children, options), { key: keyGenerator() });
  }
  if (node.entity !== null) {
    var entity = entityMap[node.entity];
    if (entity && entityRenderers[entity.type]) {
      return entityRenderers[entity.type]((0, _checkJoin2.default)(children, options), entity.data, { key: node.entity });
    }
  }
  if (node.decorator !== null) {
    return node.decorator({
      children: (0, _checkJoin2.default)(children, options),
      decoratedText: node.decoratedText
    });
  }
  return children;
};

/**
 * Nests blocks by depth as children
 */
var byDepth = function byDepth(blocks) {
  var group = [];
  var depthStack = [];
  var prevDepth = 0;
  var unwind = function unwind(targetDepth) {
    var i = prevDepth - targetDepth;
    // in case depthStack is too short for target depth
    if (depthStack.length < i) {
      i = depthStack.length;
    }
    for (i; i > 0; i -= 1) {
      var tmp = group;
      group = depthStack.pop();
      group[group.length - 1].children = tmp;
    }
  };

  blocks.forEach(function (block) {
    // if type of the block has changed render the block and clear group
    if (prevDepth < block.depth) {
      depthStack.push(group);
      group = [];
    } else if (prevDepth > block.depth) {
      unwind(block.depth);
    }
    prevDepth = block.depth;
    group.push(block);
  });
  if (prevDepth !== 0) {
    unwind(0);
  }
  return group;
};

/**
 * Conditionaly render a group if its not empty,
 * pass all the params to the renderers
 */
var renderGroup = function renderGroup(group, blockRenderers, rendered, params) {
  var type = params.prevType,
      depth = params.prevDepth,
      keys = params.prevKeys,
      data = params.prevData;
  // in case current group is empty it should not be rendered

  if (group.length === 0) {
    return;
  }
  if (blockRenderers[type]) {
    rendered.push(blockRenderers[type](group, {
      depth: depth,
      keys: keys,
      data: data
    }));
    return;
  }
  rendered.push(group);
};

/**
 * Renders blocks grouped by type using provided blockStyleRenderers
 */
var renderBlocks = function renderBlocks(blocks) {
  var inlineRenderers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var blockRenderers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var entityRenderers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var stylesRenderer = arguments[4];
  var entityMap = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var userOptions = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  // initialize
  var options = Object.assign({}, _defaultOptions2.default, userOptions);
  var rendered = [];
  var group = [];
  var prevType = null;
  var prevDepth = 0;
  var prevKeys = [];
  var prevData = [];
  var splitGroup = false;
  var Parser = new _RawParser2.default({ flat: !!stylesRenderer });
  blocks.forEach(function (block) {
    if ((0, _checkCleanup2.default)(block, prevType, options)) {
      // Set the split flag if enabled
      if (options.cleanup.split === true) {
        splitGroup = true;
      }
      return;
    }
    var node = Parser.parse(block);
    var renderedNode = renderNode(node, inlineRenderers, entityRenderers, stylesRenderer, entityMap, options, (0, _getKeyGenerator2.default)());
    // if type of the block has changed or the split flag is set
    // render and clear group
    if (prevType && prevType !== block.type || splitGroup) {
      renderGroup(group, blockRenderers, rendered, { prevType: prevType, prevDepth: prevDepth, prevKeys: prevKeys, prevData: prevData });
      // reset group vars
      // IDEA: might be worth to group those into an instance and just newup a new one
      prevData = [];
      prevKeys = [];
      group = [];
      splitGroup = false;
    }
    // handle children
    if (block.children) {
      var children = renderBlocks(block.children, inlineRenderers, blockRenderers, entityRenderers, stylesRenderer, entityMap, options);
      renderedNode.push(children);
    }
    // push current node to group
    group.push(renderedNode);

    // lastly save current type for refference
    prevType = block.type;
    prevDepth = block.depth;
    prevKeys.push(block.key);
    prevData.push(block.data);
  });
  // render last group
  renderGroup(group, blockRenderers, rendered, { prevType: prevType, prevDepth: prevDepth, prevKeys: prevKeys, prevData: prevData });
  return (0, _checkJoin2.default)(rendered, options);
};

/**
 * Converts and renders each block of Draft.js rawState
 */
var render = exports.render = function render(raw) {
  var renderers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!raw || !Array.isArray(raw.blocks)) {
    (0, _warn2.default)('invalid raw object');
    return null;
  }
  // If the lenght of the blocks array is 0 its should not log a warning but still return a null
  if (!raw.blocks.length) {
    return null;
  }
  var inlineRenderers = renderers.inline,
      blockRenderers = renderers.blocks,
      entityRenderers = renderers.entities,
      stylesRenderer = renderers.styles,
      decorators = renderers.decorators;
  // If decorators are present, they are maped with the blocks array

  var blocksWithDecorators = decorators ? (0, _withDecorators2.default)(raw.blocks, decorators, options) : raw.blocks;
  // Nest blocks by depth
  var blocks = byDepth(blocksWithDecorators);
  return renderBlocks(blocks, inlineRenderers, blockRenderers, entityRenderers, stylesRenderer, raw.entityMap, options);
};