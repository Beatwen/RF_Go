"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeftAlignedOuterVerticallyStackedAxisLayoutStrategy = void 0;
var Rect_1 = require("../../Core/Rect");
var LayoutStrategyType_1 = require("../../types/LayoutStrategyType");
var AxisLayoutHelpers_1 = require("./AxisLayoutHelpers");
var BaseAxisLayoutStrategy_1 = require("./BaseAxisLayoutStrategy");
/**
 * The Vertically Stacked Layout Strategy for Left Axes
 */
var LeftAlignedOuterVerticallyStackedAxisLayoutStrategy = /** @class */ (function (_super) {
    __extends(LeftAlignedOuterVerticallyStackedAxisLayoutStrategy, _super);
    function LeftAlignedOuterVerticallyStackedAxisLayoutStrategy() {
        var _this = _super.call(this) || this;
        _this.type = LayoutStrategyType_1.ELayoutStrategyType.LeftStacked;
        _this.isStacked = true;
        _this.layoutAxisPartsStrategy = AxisLayoutHelpers_1.layoutAxisPartsLeftStrategy;
        return _this;
    }
    LeftAlignedOuterVerticallyStackedAxisLayoutStrategy.prototype.measureAxes = function (sciChartSurface, chartLayoutState, axes) {
        var _this = this;
        var _a;
        var requiredSize = 0;
        axes.forEach(function (axis) {
            axis.measure();
            _this.updateAxisLayoutState(axis);
            var currentAxisRequiredSize = (0, AxisLayoutHelpers_1.getVerticalAxisRequiredSize)(axis.axisLayoutState);
            requiredSize = currentAxisRequiredSize > requiredSize ? currentAxisRequiredSize : requiredSize;
        });
        var firstStackedAxis = axes[0];
        var lastStackedAxis = axes[axes.length - 1];
        this.updateTopAndBottomChartLayoutState(chartLayoutState, firstStackedAxis === null || firstStackedAxis === void 0 ? void 0 : firstStackedAxis.axisLayoutState.additionalTopSize, lastStackedAxis === null || lastStackedAxis === void 0 ? void 0 : lastStackedAxis.axisLayoutState.additionalBottomSize);
        var leftViewportBorder = sciChartSurface.leftViewportBorder, leftCanvasBorder = sciChartSurface.leftCanvasBorder, adjustedPadding = sciChartSurface.adjustedPadding;
        requiredSize += leftViewportBorder + leftCanvasBorder + ((_a = adjustedPadding === null || adjustedPadding === void 0 ? void 0 : adjustedPadding.left) !== null && _a !== void 0 ? _a : 0);
        chartLayoutState.leftOuterAreaSize = Math.max(chartLayoutState.leftOuterAreaSize, requiredSize);
    };
    LeftAlignedOuterVerticallyStackedAxisLayoutStrategy.prototype.layoutAxes = function (left, top, right, bottom, axes) {
        var _this = this;
        // doesn't include top border of the first and bottom border of the last axis
        var totalAxisAreaHeight = bottom - top;
        var firstAxis = axes[0];
        var lastAxis = axes[axes.length - 1];
        var axesWithDefinedLength = axes.filter(function (axis) { return axis.stackedAxisLength !== undefined; });
        var spaceWithoutBorders = axes.reduce(function (acc, axis) { return acc - axis.axisLayoutState.additionalBottomSize - axis.axisLayoutState.additionalTopSize; }, totalAxisAreaHeight +
            (firstAxis === null || firstAxis === void 0 ? void 0 : firstAxis.axisLayoutState.additionalTopSize) +
            (lastAxis === null || lastAxis === void 0 ? void 0 : lastAxis.axisLayoutState.additionalBottomSize));
        var totalDefinedAxesLength = axesWithDefinedLength.reduce(function (acc, axis) { return acc + _this.calculateTotalAxisHeight(axis, spaceWithoutBorders); }, 0);
        var availableSpaceForAxes = totalAxisAreaHeight +
            (firstAxis === null || firstAxis === void 0 ? void 0 : firstAxis.axisLayoutState.additionalTopSize) +
            (lastAxis === null || lastAxis === void 0 ? void 0 : lastAxis.axisLayoutState.additionalBottomSize) -
            totalDefinedAxesLength;
        if (availableSpaceForAxes < 0) {
            throw new Error("Left stacked axes with defined size total ".concat(totalDefinedAxesLength, " pixels which is ").concat(-availableSpaceForAxes, " more than the space available"));
        }
        var defaultAxisReservedHeight = availableSpaceForAxes / (axes.length - axesWithDefinedLength.length);
        var topOffset = top - (firstAxis === null || firstAxis === void 0 ? void 0 : firstAxis.axisLayoutState.additionalTopSize);
        axes.forEach(function (axis) {
            var _a = axis.axisLayoutState, axisSize = _a.axisSize, additionalRightSize = _a.additionalRightSize, additionalBottomSize = _a.additionalBottomSize, additionalTopSize = _a.additionalTopSize;
            var rightOffset = right - additionalRightSize;
            var leftOffset = rightOffset - axisSize;
            var axisReservedHeight = axis.stackedAxisLength !== undefined
                ? _this.calculateTotalAxisHeight(axis, spaceWithoutBorders)
                : defaultAxisReservedHeight;
            var bottomOffset = topOffset + axisReservedHeight - additionalBottomSize;
            topOffset += additionalTopSize;
            axis.offset = topOffset - top;
            axis.axisLength = bottomOffset - topOffset;
            axis.isPrimaryAxis = true;
            axis.viewRect = Rect_1.Rect.createWithCoords(leftOffset, topOffset, rightOffset, bottomOffset);
            topOffset = bottomOffset + additionalBottomSize;
            (0, AxisLayoutHelpers_1.layoutAxisParts)(axis, _this.layoutAxisPartsStrategy);
        });
    };
    return LeftAlignedOuterVerticallyStackedAxisLayoutStrategy;
}(BaseAxisLayoutStrategy_1.BaseAxisLayoutStrategy));
exports.LeftAlignedOuterVerticallyStackedAxisLayoutStrategy = LeftAlignedOuterVerticallyStackedAxisLayoutStrategy;
