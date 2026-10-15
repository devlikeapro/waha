"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderTranslation = void 0;
var _react = _interopRequireDefault(require("react"));
var _TranslationParserError = require("./TranslationParserError.js");
var _tokenizer = require("./tokenizer.js");
var _htmlEntityDecoder = require("./htmlEntityDecoder.js");
const renderDeclarationNode = (declaration, children, childDeclarations) => {
  const {
    type,
    props = {}
  } = declaration;
  if (props.children && Array.isArray(props.children) && childDeclarations) {
    const {
      children: _childrenToRemove,
      ...propsWithoutChildren
    } = props;
    return _react.default.createElement(type, propsWithoutChildren, ...children);
  }
  if (children.length === 0) {
    return _react.default.createElement(type, props);
  }
  if (children.length === 1) {
    return _react.default.createElement(type, props, children[0]);
  }
  return _react.default.createElement(type, props, ...children);
};
const renderTranslation = (translation, declarations = []) => {
  if (!translation) {
    return [];
  }
  const tokens = (0, _tokenizer.tokenize)(translation);
  const result = [];
  const stack = [];
  const literalTagNumbers = new Set();
  const getCurrentDeclarations = () => {
    if (stack.length === 0) {
      return declarations;
    }
    const parentFrame = stack[stack.length - 1];
    if (parentFrame.declaration.props?.children && Array.isArray(parentFrame.declaration.props.children)) {
      return parentFrame.declaration.props.children;
    }
    return parentFrame.declarations;
  };
  tokens.forEach(token => {
    switch (token.type) {
      case 'Text':
        {
          const decoded = (0, _htmlEntityDecoder.decodeHtmlEntities)(token.value);
          const targetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
          targetArray.push(decoded);
        }
        break;
      case 'TagOpen':
        {
          const {
            tagNumber
          } = token;
          const currentDeclarations = getCurrentDeclarations();
          const declaration = currentDeclarations[tagNumber];
          if (!declaration) {
            literalTagNumbers.add(tagNumber);
            const literalText = `<${tagNumber}>`;
            const targetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
            targetArray.push(literalText);
            break;
          }
          stack.push({
            tagNumber,
            children: [],
            position: token.position,
            declaration,
            declarations: currentDeclarations
          });
        }
        break;
      case 'TagClose':
        {
          const {
            tagNumber
          } = token;
          if (literalTagNumbers.has(tagNumber)) {
            const literalText = `</${tagNumber}>`;
            const literalTargetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
            literalTargetArray.push(literalText);
            literalTagNumbers.delete(tagNumber);
            break;
          }
          if (stack.length === 0) {
            throw new _TranslationParserError.TranslationParserError(`Unexpected closing tag </${tagNumber}> at position ${token.position}`, token.position, translation);
          }
          const frame = stack.pop();
          if (frame.tagNumber !== tagNumber) {
            throw new _TranslationParserError.TranslationParserError(`Mismatched tags: expected </${frame.tagNumber}> but got </${tagNumber}> at position ${token.position}`, token.position, translation);
          }
          const element = renderDeclarationNode(frame.declaration, frame.children, frame.declarations);
          const elementTargetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
          elementTargetArray.push(element);
        }
        break;
    }
  });
  if (stack.length > 0) {
    const unclosed = stack[stack.length - 1];
    throw new _TranslationParserError.TranslationParserError(`Unclosed tag <${unclosed.tagNumber}> at position ${unclosed.position}`, unclosed.position, translation);
  }
  return result;
};
exports.renderTranslation = renderTranslation;