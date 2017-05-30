'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arrayEqual = require('./helpers/arrayEqual');

var _arrayEqual2 = _interopRequireDefault(_arrayEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContentNode = function () {
  function ContentNode(props) {
    _classCallCheck(this, ContentNode);

    this.content = props.content || [];
    this.start = typeof props.start !== 'undefined' ? props.start : null;
    this.end = typeof props.end !== 'undefined' ? props.end : null;
    this.entity = typeof props.entity !== 'undefined' ? props.entity : null;
    this.decorator = typeof props.decorator !== 'undefined' ? props.decorator : null;
    this.decoratedText = typeof props.decoratedText !== 'undefined' ? props.decoratedText : null;
    this.style = props.style || null;
    this.styles = props.styles || null;
  }

  _createClass(ContentNode, [{
    key: 'getCurrentContent',
    value: function getCurrentContent() {
      return this.content[this.content.length - 1];
    }
  }, {
    key: 'addToCurrentContent',
    value: function addToCurrentContent(string) {
      this.content[this.content.length - 1] = this.content[this.content.length - 1] + string;
    }
  }, {
    key: 'handleFlatPush',
    value: function handleFlatPush(string, stack) {
      var current = this.getCurrentContent();
      // if the stacks are equal just add the string to the current node
      if (current instanceof ContentNode && (0, _arrayEqual2.default)(stack, current.styles)) {
        current.addToCurrentContent(string);
        return;
      }
      // create a node with whole styles stack
      var newNode = new ContentNode({ styles: [].concat(_toConsumableArray(stack)), content: [string] });
      this.content.push(newNode);
    }
  }, {
    key: 'pushContent',
    value: function pushContent(string) {
      var stack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var flat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      // we can just concat strings in case when both the pushed item
      // and the last element of the content array is a string
      if (!stack || stack.length < 1) {
        if (typeof string === 'string' && typeof this.getCurrentContent() === 'string') {
          this.addToCurrentContent(string);
        } else {
          this.content.push(string);
        }
        return this;
      }
      // hnadle flat structure
      if (flat) {
        this.handleFlatPush(string, stack);
        return this;
      }

      var _stack = _toArray(stack),
          head = _stack[0],
          rest = _stack.slice(1);

      var current = this.getCurrentContent();
      if (current instanceof ContentNode && current.style === head) {
        current.pushContent(string, rest, flat);
      } else {
        var newNode = new ContentNode({ style: head });
        newNode.pushContent(string, rest, flat);
        this.content.push(newNode);
      }
      return this;
    }
  }]);

  return ContentNode;
}();

exports.default = ContentNode;