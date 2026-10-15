var _excluded = ["sourceX", "sourceY", "sourceControlX", "targetX", "targetY", "targetControlX", "linkWidth"],
  _excluded2 = ["className", "style", "children", "id"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import maxBy from 'es-toolkit/compat/maxBy';
import sumBy from 'es-toolkit/compat/sumBy';
import get from 'es-toolkit/compat/get';
import { Surface } from '../container/Surface';
import { Layer } from '../container/Layer';
import { Rectangle } from '../shape/Rectangle';
import { getValueByDataKey } from '../util/ChartUtils';
import { ReportChartMargin, ReportChartSize, useChartHeight, useChartWidth } from '../context/chartLayoutContext';
import { TooltipPortalContext } from '../context/tooltipPortalContext';
import { RechartsWrapper } from './RechartsWrapper';
import { RechartsStoreProvider } from '../state/RechartsStoreProvider';
import { useAppDispatch } from '../state/hooks';
import { mouseLeaveItem, setActiveClickItemIndex, setActiveMouseOverItemIndex } from '../state/tooltipSlice';
import { SetTooltipEntrySettings } from '../state/SetTooltipEntrySettings';
import { ReportEventSettings } from '../state/ReportEventSettings';
import { SetComputedData } from '../context/chartDataContext';
import { svgPropertiesNoEvents, svgPropertiesNoEventsFromUnknown } from '../util/svgPropertiesNoEvents';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { isPositiveNumber } from '../util/isWellBehavedNumber';
import { isNotNil, noop } from '../util/DataUtils';
import { RegisterGraphicalItemId } from '../context/RegisterGraphicalItemId';
import { initialEventSettingsState } from '../state/eventSettingsSlice';
var interpolationGenerator = (a, b) => {
  var ka = +a;
  var kb = b - ka;
  return animationElapsedTime => ka + kb * animationElapsedTime;
};
var centerY = node => node.y + node.dy / 2;
var cubicValue = (start, control1, control2, end, t) => {
  var inverseT = 1 - t;
  return inverseT ** 3 * start + 3 * inverseT ** 2 * t * control1 + 3 * inverseT * t ** 2 * control2 + t ** 3 * end;
};

// TODO why is this not reading dataKey?
var getValue = entry => entry && entry.value || 0;
var getSumOfIds = (links, ids) => ids.reduce((result, id) => result + getValue(links[id]), 0);
var getSumWithWeightedSource = (tree, links, ids) => ids.reduce((result, id) => {
  var link = links[id];
  if (link == null) {
    return result;
  }
  var sourceNode = tree[link.source];
  if (sourceNode == null) {
    return result;
  }
  return result + centerY(sourceNode) * getValue(links[id]);
}, 0);
var getSumWithWeightedTarget = (tree, links, ids) => ids.reduce((result, id) => {
  var link = links[id];
  if (link == null) {
    return result;
  }
  var targetNode = tree[link.target];
  if (targetNode == null) {
    return result;
  }
  return result + centerY(targetNode) * getValue(links[id]);
}, 0);
var ascendingY = (a, b) => a.y - b.y;
var searchTargetsAndSources = (links, id) => {
  var sourceNodes = [];
  var sourceLinks = [];
  var targetNodes = [];
  var targetLinks = [];
  for (var i = 0, len = links.length; i < len; i++) {
    var link = links[i];
    if ((link === null || link === void 0 ? void 0 : link.source) === id) {
      targetNodes.push(link.target);
      targetLinks.push(i);
    }
    if ((link === null || link === void 0 ? void 0 : link.target) === id) {
      sourceNodes.push(link.source);
      sourceLinks.push(i);
    }
  }
  return {
    sourceNodes,
    sourceLinks,
    targetLinks,
    targetNodes
  };
};
var updateDepthOfTargets = (tree, curNode) => {
  var targetNodes = curNode.targetNodes;
  for (var i = 0, len = targetNodes.length; i < len; i++) {
    var targetNode = targetNodes[i];
    if (targetNode == null) {
      continue;
    }
    var target = tree[targetNode];
    if (target) {
      var newDepth = curNode.depth + 1;
      /*
       * Only recurse when the depth grows. Depth is the longest path to a node, so once it stops increasing
       * the subtree is already up to date; without this guard every path through the graph is walked
       * separately, which explodes combinatorially on dense graphs.
       */
      if (newDepth > target.depth) {
        target.depth = newDepth;
        updateDepthOfTargets(tree, target);
      }
    }
  }
};
var getNodesTree = (_ref, width, nodeWidth, align) => {
  var _maxBy$depth, _maxBy;
  var nodes = _ref.nodes,
    links = _ref.links;
  var tree = nodes.map((entry, index) => {
    var result = searchTargetsAndSources(links, index);
    return _objectSpread(_objectSpread(_objectSpread({}, entry), result), {}, {
      value: Math.max(getSumOfIds(links, result.sourceLinks), getSumOfIds(links, result.targetLinks)),
      depth: 0
    });
  });
  for (var i = 0, len = tree.length; i < len; i++) {
    var node = tree[i];
    if (node != null && !node.sourceNodes.length) {
      updateDepthOfTargets(tree, node);
    }
  }
  var maxDepth = (_maxBy$depth = (_maxBy = maxBy(tree, entry => entry.depth)) === null || _maxBy === void 0 ? void 0 : _maxBy.depth) !== null && _maxBy$depth !== void 0 ? _maxBy$depth : 0;
  if (maxDepth >= 1) {
    var childWidth = (width - nodeWidth) / maxDepth;
    for (var _i = 0, _len = tree.length; _i < _len; _i++) {
      var _node = tree[_i];
      if (_node == null) {
        continue;
      }
      if (!_node.targetNodes.length) {
        if (align === 'justify') {
          _node.depth = maxDepth;
        }
      }
      _node.x = _node.depth * childWidth;
      _node.dx = nodeWidth;
    }
  }
  return {
    tree,
    maxDepth
  };
};
var getDepthTree = tree => {
  var result = [];
  for (var i = 0, len = tree.length; i < len; i++) {
    var _result$node$depth;
    var node = tree[i];
    if (node == null) {
      continue;
    }
    if (!result[node.depth]) {
      result[node.depth] = [];
    }
    (_result$node$depth = result[node.depth]) === null || _result$node$depth === void 0 || _result$node$depth.push(node);
  }
  return result;
};
var updateYOfTree = (depthTree, height, nodePadding, links, verticalAlign) => {
  var yRatio = Math.min(...depthTree.map(nodes => {
    var value = sumBy(nodes, getValue);
    return value === 0 ? Infinity : (height - (nodes.length - 1) * nodePadding) / value;
  }));
  if (yRatio === Infinity) {
    yRatio = 0;
  }
  for (var d = 0, maxDepth = depthTree.length; d < maxDepth; d++) {
    var nodes = depthTree[d];
    if (nodes == null) {
      continue;
    }
    if (verticalAlign === 'top') {
      var currentY = 0;
      for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i];
        if (node == null) {
          continue;
        }
        node.dy = node.value * yRatio;
        node.y = currentY;
        currentY += node.dy + nodePadding;
      }
    } else {
      for (var _i2 = 0, _len2 = nodes.length; _i2 < _len2; _i2++) {
        var _node2 = nodes[_i2];
        if (_node2 == null) {
          continue;
        }
        _node2.y = _i2;
        _node2.dy = _node2.value * yRatio;
      }
    }
  }
  return links.map(link => _objectSpread(_objectSpread({}, link), {}, {
    dy: getValue(link) * yRatio
  }));
};
var resolveCollisions = function resolveCollisions(depthTree, height, nodePadding) {
  var sort = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  for (var i = 0, len = depthTree.length; i < len; i++) {
    var nodes = depthTree[i];
    if (nodes == null) {
      continue;
    }
    var n = nodes.length;

    // Sort by the value of y
    if (sort) {
      nodes.sort(ascendingY);
    }
    var y0 = 0;
    for (var j = 0; j < n; j++) {
      var node = nodes[j];
      if (node == null) {
        continue;
      }
      var dy = y0 - node.y;
      if (dy > 0) {
        node.y += dy;
      }
      y0 = node.y + node.dy + nodePadding;
    }
    y0 = height + nodePadding;
    for (var _j = n - 1; _j >= 0; _j--) {
      var _node3 = nodes[_j];
      if (_node3 == null) {
        continue;
      }
      var _dy = _node3.y + _node3.dy + nodePadding - y0;
      if (_dy > 0) {
        _node3.y -= _dy;
        y0 = _node3.y;
      } else {
        break;
      }
    }
  }
};
var relaxLeftToRight = (tree, depthTree, links, alpha) => {
  for (var i = 0, maxDepth = depthTree.length; i < maxDepth; i++) {
    var nodes = depthTree[i];
    if (nodes == null) {
      continue;
    }
    for (var j = 0, len = nodes.length; j < len; j++) {
      var node = nodes[j];
      if (node == null) {
        continue;
      }
      if (node.sourceLinks.length) {
        var sourceSum = getSumOfIds(links, node.sourceLinks);
        var weightedSum = getSumWithWeightedSource(tree, links, node.sourceLinks);
        var y = sourceSum === 0 ? centerY(node) : weightedSum / sourceSum;
        node.y += (y - centerY(node)) * alpha;
      }
    }
  }
};
var relaxRightToLeft = (tree, depthTree, links, alpha) => {
  for (var i = depthTree.length - 1; i >= 0; i--) {
    var nodes = depthTree[i];
    if (nodes == null) {
      continue;
    }
    for (var j = 0, len = nodes.length; j < len; j++) {
      var node = nodes[j];
      if (node == null) {
        continue;
      }
      if (node.targetLinks.length) {
        var targetSum = getSumOfIds(links, node.targetLinks);
        var weightedSum = getSumWithWeightedTarget(tree, links, node.targetLinks);
        var y = targetSum === 0 ? centerY(node) : weightedSum / targetSum;
        node.y += (y - centerY(node)) * alpha;
      }
    }
  }
};
var updateYOfLinks = (tree, links) => {
  for (var i = 0, len = tree.length; i < len; i++) {
    var node = tree[i];
    if (node == null) {
      continue;
    }
    var sy = 0;
    var ty = 0;
    node.targetLinks.sort((a, b) => {
      var _links$a, _links$b, _tree$targetA, _tree$targetB;
      var targetA = (_links$a = links[a]) === null || _links$a === void 0 ? void 0 : _links$a.target;
      var targetB = (_links$b = links[b]) === null || _links$b === void 0 ? void 0 : _links$b.target;
      if (targetA == null || targetB == null) {
        return 0;
      }
      var yA = (_tree$targetA = tree[targetA]) === null || _tree$targetA === void 0 ? void 0 : _tree$targetA.y;
      var yB = (_tree$targetB = tree[targetB]) === null || _tree$targetB === void 0 ? void 0 : _tree$targetB.y;
      if (yA == null || yB == null) {
        return 0;
      }
      return yA - yB;
    });
    node.sourceLinks.sort((a, b) => {
      var _links$a2, _links$b2, _tree$sourceA, _tree$sourceB;
      var sourceA = (_links$a2 = links[a]) === null || _links$a2 === void 0 ? void 0 : _links$a2.source;
      var sourceB = (_links$b2 = links[b]) === null || _links$b2 === void 0 ? void 0 : _links$b2.source;
      if (sourceA == null || sourceB == null) {
        return 0;
      }
      var yA = (_tree$sourceA = tree[sourceA]) === null || _tree$sourceA === void 0 ? void 0 : _tree$sourceA.y;
      var yB = (_tree$sourceB = tree[sourceB]) === null || _tree$sourceB === void 0 ? void 0 : _tree$sourceB.y;
      if (yA == null || yB == null) {
        return 0;
      }
      return yA - yB;
    });
    for (var j = 0, tLen = node.targetLinks.length; j < tLen; j++) {
      var targetLink = node.targetLinks[j];
      if (targetLink == null) {
        continue;
      }
      var link = links[targetLink];
      if (link) {
        link.sy = sy;
        sy += link.dy;
      }
    }
    for (var _j2 = 0, sLen = node.sourceLinks.length; _j2 < sLen; _j2++) {
      var sourceLink = node.sourceLinks[_j2];
      if (sourceLink == null) {
        continue;
      }
      var _link = links[sourceLink];
      if (_link) {
        _link.ty = ty;
        ty += _link.dy;
      }
    }
  }
};
var getLinkYAtX = (sourceNode, targetNode, link, x) => {
  var _link$sy, _link$ty;
  var sourceX = sourceNode.x + sourceNode.dx;
  var targetX = targetNode.x;
  var progress = targetX === sourceX ? 0 : (x - sourceX) / (targetX - sourceX);
  var boundedProgress = Math.min(Math.max(progress, 0), 1);
  var sourceY = sourceNode.y + ((_link$sy = link.sy) !== null && _link$sy !== void 0 ? _link$sy : 0) + link.dy / 2;
  var targetY = targetNode.y + ((_link$ty = link.ty) !== null && _link$ty !== void 0 ? _link$ty : 0) + link.dy / 2;
  return cubicValue(sourceY, sourceY, targetY, targetY, boundedProgress);
};
var resolveNodeLinkCollisions = (tree, depthTree, links, height, nodePadding) => {
  var depthByNode = new Map();
  for (var depth = 0; depth < depthTree.length; depth++) {
    var nodes = depthTree[depth];
    if (nodes == null) {
      continue;
    }
    for (var node of nodes) {
      depthByNode.set(node, depth);
    }
  }
  var _loop = function _loop(_depth) {
      var nodes = depthTree[_depth];
      if (nodes == null || nodes.length === 0) {
        return 0; // continue
      }
      var depthX = nodes[0] == null ? undefined : nodes[0].x + nodes[0].dx / 2;
      if (depthX == null) {
        return 0; // continue
      }
      var fixedObstacles = links.flatMap(link => {
        var sourceNode = tree[link.source];
        var targetNode = tree[link.target];
        if (sourceNode == null || targetNode == null) {
          return [];
        }
        var sourceDepth = depthByNode.get(sourceNode);
        var targetDepth = depthByNode.get(targetNode);
        if (sourceDepth == null || targetDepth == null) {
          return [];
        }
        if (_depth <= Math.min(sourceDepth, targetDepth) || _depth >= Math.max(sourceDepth, targetDepth)) {
          return [];
        }
        var y = getLinkYAtX(sourceNode, targetNode, link, depthX) - link.dy / 2;
        return [{
          y,
          dy: link.dy,
          fixed: true
        }];
      });
      var containedNodeObstacles = fixedObstacles.filter(obstacle => nodes.some(node => node.y >= obstacle.y && node.y + node.dy <= obstacle.y + obstacle.dy));
      if (containedNodeObstacles.length === 0) {
        return 0; // continue
      }
      var getItemY = item => item.fixed ? item.y : item.node.y;
      var getItemHeight = item => item.fixed ? item.dy : item.node.dy;
      var items = [...nodes.map(node => ({
        node,
        fixed: false
      })), ...containedNodeObstacles].sort((a, b) => getItemY(a) - getItemY(b));
      var nextY = 0;
      for (var item of items) {
        if (item.fixed) {
          nextY = Math.max(nextY, item.y + item.dy + nodePadding);
          continue;
        }
        if (item.node.y < nextY) {
          item.node.y = nextY;
        }
        nextY = item.node.y + item.node.dy + nodePadding;
      }
      items = items.sort((a, b) => getItemY(a) - getItemY(b));
      var previousY = height + nodePadding;
      for (var i = items.length - 1; i >= 0; i--) {
        var _item = items[i];
        if (_item == null) {
          continue;
        }
        if (_item.fixed) {
          previousY = Math.min(previousY, _item.y - nodePadding);
          continue;
        }

        // This backward pass only keeps moved nodes within the chart bounds.
        // It intentionally does not iterate again against fixed obstacles above,
        // because this fix is scoped to the fully-contained skipped-depth case.
        var dy = _item.node.y + getItemHeight(_item) + nodePadding - previousY;
        if (dy > 0) {
          _item.node.y -= dy;
        }
        previousY = _item.node.y;
      }
    },
    _ret;
  for (var _depth = 0; _depth < depthTree.length; _depth++) {
    _ret = _loop(_depth);
    if (_ret === 0) continue;
  }
};
export var computeData = _ref2 => {
  var data = _ref2.data,
    width = _ref2.width,
    height = _ref2.height,
    iterations = _ref2.iterations,
    nodeWidth = _ref2.nodeWidth,
    nodePadding = _ref2.nodePadding,
    sort = _ref2.sort,
    verticalAlign = _ref2.verticalAlign,
    align = _ref2.align;
  var links = data.links;
  var _getNodesTree = getNodesTree(data, width, nodeWidth, align),
    tree = _getNodesTree.tree;
  var depthTree = getDepthTree(tree);
  var linksWithDy = updateYOfTree(depthTree, height, nodePadding, links, verticalAlign);
  resolveCollisions(depthTree, height, nodePadding, sort);
  if (verticalAlign === 'justify') {
    var alpha = 1;
    for (var i = 1; i <= iterations; i++) {
      relaxRightToLeft(tree, depthTree, linksWithDy, alpha *= 0.99);
      resolveCollisions(depthTree, height, nodePadding, sort);
      relaxLeftToRight(tree, depthTree, linksWithDy, alpha);
      resolveCollisions(depthTree, height, nodePadding, sort);
    }
  }
  updateYOfLinks(tree, linksWithDy);
  resolveNodeLinkCollisions(tree, depthTree, linksWithDy, height, nodePadding);
  updateYOfLinks(tree, linksWithDy);

  // @ts-expect-error updateYOfLinks modifies the links array to add sy and ty in place
  var newLinks = linksWithDy;
  return {
    nodes: tree,
    links: newLinks
  };
};
var getNodeCoordinateOfTooltip = item => {
  return {
    x: +item.x + +item.width / 2,
    y: +item.y + +item.height / 2
  };
};
var getLinkCoordinateOfTooltip = item => {
  return 'sourceX' in item ? {
    x: (item.sourceX + item.targetX) / 2,
    y: (item.sourceY + item.targetY) / 2
  } : undefined;
};
var getPayloadOfTooltip = (item, type, nameKey) => {
  var payload = item.payload;
  if (type === 'node') {
    return {
      payload,
      name: getValueByDataKey(payload, nameKey, ''),
      value: getValueByDataKey(payload, 'value')
    };
  }
  if ('source' in payload && payload.source && payload.target) {
    // @ts-expect-error we're sending number indexes as source and target, but getValueByDataKey expects objects
    var sourceName = getValueByDataKey(payload.source, nameKey, '');
    // @ts-expect-error we're sending number indexes as source and target, but getValueByDataKey expects objects
    var targetName = getValueByDataKey(payload.target, nameKey, '');
    return {
      payload,
      name: "".concat(sourceName, " - ").concat(targetName),
      value: getValueByDataKey(payload, 'value')
    };
  }
  return undefined;
};
export var sankeyPayloadSearcher = (_, activeIndex, computedData, nameKey) => {
  if (activeIndex == null || typeof activeIndex !== 'string') {
    return undefined;
  }
  if (computedData == null || typeof computedData !== 'object') {
    return undefined;
  }
  var splitIndex = activeIndex.split('-');
  var _splitIndex = _slicedToArray(splitIndex, 2),
    targetType = _splitIndex[0],
    index = _splitIndex[1];
  var item = get(computedData, "".concat(targetType, "s[").concat(index, "]"));
  if (item) {
    // @ts-expect-error nameKey type does not match SankeyElementType
    var payload = getPayloadOfTooltip(item, targetType, nameKey);
    return payload;
  }
  return undefined;
};
var options = {
  chartName: 'Sankey',
  defaultTooltipEventType: 'item',
  validateTooltipEventTypes: ['item'],
  tooltipPayloadSearcher: sankeyPayloadSearcher,
  eventEmitter: undefined
};
var SetSankeyTooltipEntrySettings = /*#__PURE__*/React.memo(_ref3 => {
  var dataKey = _ref3.dataKey,
    nameKey = _ref3.nameKey,
    stroke = _ref3.stroke,
    strokeWidth = _ref3.strokeWidth,
    fill = _ref3.fill,
    name = _ref3.name,
    data = _ref3.data,
    id = _ref3.id;
  var tooltipEntrySettings = {
    dataDefinedOnItem: data,
    getPosition: noop,
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      name,
      nameKey,
      hide: false,
      type: undefined,
      color: fill,
      unit: '',
      graphicalItemId: id
    }
  };
  return /*#__PURE__*/React.createElement(SetTooltipEntrySettings, {
    tooltipEntrySettings: tooltipEntrySettings
  });
});

// TODO: improve types - NodeOptions uses SankeyNode, LinkOptions uses LinkProps. Standardize.

function renderLinkItem(option, props) {
  if (/*#__PURE__*/React.isValidElement(option)) {
    return /*#__PURE__*/React.cloneElement(option, props);
  }
  if (typeof option === 'function') {
    return option(props);
  }
  var sourceX = props.sourceX,
    sourceY = props.sourceY,
    sourceControlX = props.sourceControlX,
    targetX = props.targetX,
    targetY = props.targetY,
    targetControlX = props.targetControlX,
    linkWidth = props.linkWidth,
    others = _objectWithoutProperties(props, _excluded);
  return /*#__PURE__*/React.createElement("path", _extends({
    className: "recharts-sankey-link",
    d: "\n          M".concat(sourceX, ",").concat(sourceY, "\n          C").concat(sourceControlX, ",").concat(sourceY, " ").concat(targetControlX, ",").concat(targetY, " ").concat(targetX, ",").concat(targetY, "\n        "),
    fill: "none",
    stroke: "#333",
    strokeWidth: linkWidth,
    strokeOpacity: "0.2"
  }, svgPropertiesNoEvents(others)));
}
var buildLinkProps = _ref4 => {
  var link = _ref4.link,
    nodes = _ref4.nodes,
    left = _ref4.left,
    top = _ref4.top,
    i = _ref4.i,
    linkContent = _ref4.linkContent,
    linkCurvature = _ref4.linkCurvature;
  var sourceRelativeY = link.sy,
    targetRelativeY = link.ty,
    linkWidth = link.dy;
  var sourceNode = nodes[link.source];
  var targetNode = nodes[link.target];
  if (sourceNode == null || targetNode == null) {
    return undefined;
  }
  var sourceX = sourceNode.x + sourceNode.dx + left;
  var targetX = targetNode.x + left;
  var interpolationFunc = interpolationGenerator(sourceX, targetX);
  var sourceControlX = interpolationFunc(linkCurvature);
  var targetControlX = interpolationFunc(1 - linkCurvature);
  var sourceY = sourceNode.y + sourceRelativeY + linkWidth / 2 + top;
  var targetY = targetNode.y + targetRelativeY + linkWidth / 2 + top;
  var linkProps = _objectSpread({
    sourceX,
    // @ts-expect-error the linkContent from below is contributing unknown props
    targetX,
    sourceY,
    // @ts-expect-error the linkContent from below is contributing unknown props
    targetY,
    sourceControlX,
    targetControlX,
    sourceRelativeY,
    targetRelativeY,
    linkWidth,
    index: i,
    payload: _objectSpread(_objectSpread({}, link), {}, {
      source: sourceNode,
      target: targetNode
    })
  }, svgPropertiesNoEventsFromUnknown(linkContent));
  return linkProps;
};
function SankeyLinkElement(_ref5) {
  var graphicalItemId = _ref5.graphicalItemId,
    props = _ref5.props,
    i = _ref5.i,
    linkContent = _ref5.linkContent,
    _onMouseEnter = _ref5.onMouseEnter,
    _onMouseLeave = _ref5.onMouseLeave,
    _onClick = _ref5.onClick,
    dataKey = _ref5.dataKey;
  var activeCoordinate = getLinkCoordinateOfTooltip(props);
  var activeIndex = "link-".concat(i);
  var dispatch = useAppDispatch();
  var events = {
    onMouseEnter: e => {
      dispatch(setActiveMouseOverItemIndex({
        activeIndex,
        activeDataKey: dataKey,
        activeCoordinate,
        activeGraphicalItemId: graphicalItemId
      }));
      _onMouseEnter(props, e);
    },
    onMouseLeave: e => {
      dispatch(mouseLeaveItem());
      _onMouseLeave(props, e);
    },
    onClick: e => {
      dispatch(setActiveClickItemIndex({
        activeIndex,
        activeDataKey: dataKey,
        activeCoordinate,
        activeGraphicalItemId: graphicalItemId
      }));
      _onClick(props, e);
    }
  };
  return /*#__PURE__*/React.createElement(Layer, events, renderLinkItem(linkContent, props));
}
function AllSankeyLinkElements(_ref6) {
  var graphicalItemId = _ref6.graphicalItemId,
    modifiedLinks = _ref6.modifiedLinks,
    links = _ref6.links,
    linkContent = _ref6.linkContent,
    onMouseEnter = _ref6.onMouseEnter,
    onMouseLeave = _ref6.onMouseLeave,
    onClick = _ref6.onClick,
    dataKey = _ref6.dataKey;
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-sankey-links",
    key: "recharts-sankey-links"
  }, links.map((link, i) => {
    var linkProps = modifiedLinks[i];
    if (linkProps == null) {
      return null;
    }
    return /*#__PURE__*/React.createElement(SankeyLinkElement, {
      graphicalItemId: graphicalItemId,
      key: "link-".concat(link.source, "-").concat(link.target, "-").concat(link.value),
      props: linkProps,
      linkContent: linkContent,
      i: i,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      onClick: onClick,
      dataKey: dataKey
    });
  }));
}
function renderNodeItem(option, props) {
  if (/*#__PURE__*/React.isValidElement(option)) {
    return /*#__PURE__*/React.cloneElement(option, props);
  }
  if (typeof option === 'function') {
    return option(props);
  }
  return (
    /*#__PURE__*/
    // @ts-expect-error recharts radius is not compatible with SVG radius
    React.createElement(Rectangle, _extends({
      className: "recharts-sankey-node",
      fill: "#0088fe",
      fillOpacity: "0.8"
    }, svgPropertiesNoEvents(props)))
  );
}
var buildNodeProps = _ref7 => {
  var node = _ref7.node,
    nodeContent = _ref7.nodeContent,
    top = _ref7.top,
    left = _ref7.left,
    i = _ref7.i;
  var x = node.x,
    y = node.y,
    dx = node.dx,
    dy = node.dy;
  // @ts-expect-error nodeContent is passing in unknown props
  var nodeProps = _objectSpread(_objectSpread({}, svgPropertiesNoEventsFromUnknown(nodeContent)), {}, {
    x: x + left,
    y: y + top,
    width: dx,
    height: dy,
    index: i,
    payload: node
  });
  return nodeProps;
};
function NodeElement(_ref8) {
  var graphicalItemId = _ref8.graphicalItemId,
    props = _ref8.props,
    nodeContent = _ref8.nodeContent,
    i = _ref8.i,
    _onMouseEnter2 = _ref8.onMouseEnter,
    _onMouseLeave2 = _ref8.onMouseLeave,
    _onClick2 = _ref8.onClick,
    dataKey = _ref8.dataKey;
  var dispatch = useAppDispatch();
  var activeCoordinate = getNodeCoordinateOfTooltip(props);
  var activeIndex = "node-".concat(i);
  var events = {
    onMouseEnter: e => {
      dispatch(setActiveMouseOverItemIndex({
        activeIndex,
        activeDataKey: dataKey,
        activeCoordinate,
        activeGraphicalItemId: graphicalItemId
      }));
      _onMouseEnter2(props, e);
    },
    onMouseLeave: e => {
      dispatch(mouseLeaveItem());
      _onMouseLeave2(props, e);
    },
    onClick: e => {
      dispatch(setActiveClickItemIndex({
        activeIndex,
        activeDataKey: dataKey,
        activeCoordinate,
        activeGraphicalItemId: graphicalItemId
      }));
      _onClick2(props, e);
    }
  };
  return /*#__PURE__*/React.createElement(Layer, events, renderNodeItem(nodeContent, props));
}
function AllNodeElements(_ref9) {
  var graphicalItemId = _ref9.graphicalItemId,
    modifiedNodes = _ref9.modifiedNodes,
    nodeContent = _ref9.nodeContent,
    onMouseEnter = _ref9.onMouseEnter,
    onMouseLeave = _ref9.onMouseLeave,
    onClick = _ref9.onClick,
    dataKey = _ref9.dataKey;
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-sankey-nodes",
    key: "recharts-sankey-nodes"
  }, modifiedNodes.map((modifiedNode, i) => {
    return /*#__PURE__*/React.createElement(NodeElement, {
      graphicalItemId: graphicalItemId,
      key: "node-".concat(modifiedNode.index, "-").concat(modifiedNode.x, "-").concat(modifiedNode.y),
      props: modifiedNode,
      nodeContent: nodeContent,
      i: i,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      onClick: onClick,
      dataKey: dataKey
    });
  }));
}
export var sankeyDefaultProps = _objectSpread({
  accessibilityLayer: true,
  align: 'justify',
  dataKey: 'value',
  iterations: 32,
  linkCurvature: 0.5,
  margin: {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5
  },
  nameKey: 'name',
  nodePadding: 10,
  nodeWidth: 10,
  sort: true,
  verticalAlign: 'justify'
}, initialEventSettingsState);
function SankeyImpl(props) {
  var className = props.className,
    style = props.style,
    children = props.children,
    id = props.id,
    others = _objectWithoutProperties(props, _excluded2);
  var link = props.link,
    dataKey = props.dataKey,
    node = props.node,
    onMouseEnter = props.onMouseEnter,
    onMouseLeave = props.onMouseLeave,
    onClick = props.onClick,
    data = props.data,
    iterations = props.iterations,
    nodeWidth = props.nodeWidth,
    nodePadding = props.nodePadding,
    sort = props.sort,
    linkCurvature = props.linkCurvature,
    margin = props.margin,
    verticalAlign = props.verticalAlign,
    align = props.align,
    accessibilityLayer = props.accessibilityLayer,
    title = props.title,
    desc = props.desc;
  var attrs = svgPropertiesNoEvents(others);
  var tabIndex, role;
  if (typeof attrs.tabIndex === 'number') {
    tabIndex = attrs.tabIndex;
  } else {
    tabIndex = accessibilityLayer ? 0 : undefined;
  }
  if (typeof attrs.role === 'string') {
    role = attrs.role;
  } else {
    role = accessibilityLayer ? 'application' : undefined;
  }
  var width = useChartWidth();
  var height = useChartHeight();
  var _useMemo = useMemo(() => {
      var _margin$left, _margin$right, _margin$top, _margin$bottom;
      if (!data || !width || !height || width <= 0 || height <= 0) {
        return {
          nodes: [],
          links: [],
          modifiedLinks: [],
          modifiedNodes: []
        };
      }
      var contentWidth = width - ((_margin$left = margin.left) !== null && _margin$left !== void 0 ? _margin$left : 0) - ((_margin$right = margin.right) !== null && _margin$right !== void 0 ? _margin$right : 0);
      var contentHeight = height - ((_margin$top = margin.top) !== null && _margin$top !== void 0 ? _margin$top : 0) - ((_margin$bottom = margin.bottom) !== null && _margin$bottom !== void 0 ? _margin$bottom : 0);
      var computed = computeData({
        data,
        width: contentWidth,
        height: contentHeight,
        iterations,
        nodeWidth,
        nodePadding,
        sort,
        verticalAlign,
        align
      });
      var top = margin.top || 0;
      var left = margin.left || 0;
      var newModifiedLinks = computed.links.map((l, i) => {
        return buildLinkProps({
          link: l,
          nodes: computed.nodes,
          i,
          top,
          left,
          linkContent: link,
          linkCurvature
        });
      }).filter(isNotNil);
      var newModifiedNodes = computed.nodes.map((n, i) => {
        return buildNodeProps({
          node: n,
          nodeContent: node,
          i,
          top,
          left
        });
      });
      return {
        nodes: computed.nodes,
        links: computed.links,
        modifiedLinks: newModifiedLinks,
        modifiedNodes: newModifiedNodes
      };
    }, [data, width, height, margin, iterations, nodeWidth, nodePadding, sort, link, node, linkCurvature, align, verticalAlign]),
    links = _useMemo.links,
    modifiedLinks = _useMemo.modifiedLinks,
    modifiedNodes = _useMemo.modifiedNodes;
  var handleMouseEnter = useCallback((item, type, e) => {
    if (onMouseEnter) {
      onMouseEnter(item, type, e);
    }
  }, [onMouseEnter]);
  var handleMouseLeave = useCallback((item, type, e) => {
    if (onMouseLeave) {
      onMouseLeave(item, type, e);
    }
  }, [onMouseLeave]);
  var handleClick = useCallback((item, type, e) => {
    if (onClick) {
      onClick(item, type, e);
    }
  }, [onClick]);
  if (!isPositiveNumber(width) || !isPositiveNumber(height) || !data || !data.links || !data.nodes) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetComputedData, {
    computedData: {
      links: modifiedLinks,
      nodes: modifiedNodes
    }
  }), /*#__PURE__*/React.createElement(Surface, _extends({}, attrs, {
    title: title,
    desc: desc,
    role: role,
    tabIndex: tabIndex,
    width: width,
    height: height
  }), children, /*#__PURE__*/React.createElement(AllSankeyLinkElements, {
    graphicalItemId: id,
    links: links,
    modifiedLinks: modifiedLinks,
    linkContent: link,
    dataKey: dataKey,
    onMouseEnter: (linkProps, e) => handleMouseEnter(linkProps, 'link', e),
    onMouseLeave: (linkProps, e) => handleMouseLeave(linkProps, 'link', e),
    onClick: (linkProps, e) => handleClick(linkProps, 'link', e)
  }), /*#__PURE__*/React.createElement(AllNodeElements, {
    graphicalItemId: id,
    modifiedNodes: modifiedNodes,
    nodeContent: node,
    dataKey: dataKey,
    onMouseEnter: (nodeProps, e) => handleMouseEnter(nodeProps, 'node', e),
    onMouseLeave: (nodeProps, e) => handleMouseLeave(nodeProps, 'node', e),
    onClick: (nodeProps, e) => handleClick(nodeProps, 'node', e)
  })));
}

/**
 * Flow diagram in which the width of the arrows is proportional to the flow rate.
 * It is typically used to visualize energy or material or cost transfers between processes.
 *
 * @consumes ResponsiveContainerContext
 * @provides TooltipEntrySettings
 */
export function Sankey(outsideProps) {
  var props = resolveDefaultProps(outsideProps, sankeyDefaultProps);
  var width = props.width,
    height = props.height,
    style = props.style,
    className = props.className,
    externalId = props.id,
    throttleDelay = props.throttleDelay,
    throttledEvents = props.throttledEvents;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    tooltipPortal = _useState2[0],
    setTooltipPortal = _useState2[1];
  return /*#__PURE__*/React.createElement(RechartsStoreProvider, {
    preloadedState: {
      options
    },
    reduxStoreName: className !== null && className !== void 0 ? className : 'Sankey'
  }, /*#__PURE__*/React.createElement(ReportChartSize, {
    width: width,
    height: height
  }), /*#__PURE__*/React.createElement(ReportChartMargin, {
    margin: props.margin
  }), /*#__PURE__*/React.createElement(ReportEventSettings, {
    throttleDelay: throttleDelay,
    throttledEvents: throttledEvents
  }), /*#__PURE__*/React.createElement(RechartsWrapper, {
    className: className,
    style: style,
    width: width,
    height: height
    /*
     * Sankey, same as Treemap, suffers from overfilling the container
     * and causing infinite render loops where the chart keeps growing.
     */,
    responsive: false,
    ref: node => {
      if (node && !tooltipPortal) {
        setTooltipPortal(node);
      }
    },
    onMouseEnter: undefined,
    onMouseLeave: undefined,
    onClick: undefined,
    onMouseMove: undefined,
    onMouseDown: undefined,
    onMouseUp: undefined,
    onContextMenu: undefined,
    onDoubleClick: undefined,
    onTouchStart: undefined,
    onTouchMove: undefined,
    onTouchEnd: undefined
  }, /*#__PURE__*/React.createElement(TooltipPortalContext.Provider, {
    value: tooltipPortal
  }, /*#__PURE__*/React.createElement(RegisterGraphicalItemId, {
    id: externalId,
    type: "sankey"
  }, id => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetSankeyTooltipEntrySettings, {
    dataKey: props.dataKey,
    nameKey: props.nameKey,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    name: props.name,
    data: props.data,
    id: id
  }), /*#__PURE__*/React.createElement(SankeyImpl, _extends({}, props, {
    id: id
  })))))));
}
Sankey.displayName = 'Sankey';