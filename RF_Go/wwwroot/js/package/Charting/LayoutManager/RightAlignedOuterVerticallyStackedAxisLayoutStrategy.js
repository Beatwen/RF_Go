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
exports.RightAlignedOuterVerticallyStackedAxisLayoutStrategy = void 0;
var Rect_1 = require("../../Core/Rect");
var LayoutStrategyType_1 = require("../../types/LayoutStrategyType");
var AxisLayoutHelpers_1 = require("./AxisLayoutHelpers");
var BaseAxisLayoutStrategy_1 = require("./BaseAxisLayoutStrategy");
/**
 * The Vertically Stacked Layout Strategy for Right Axes
 */
var RightAlignedOuterVerticallyStackedAxisLayoutStrategy = /** @class */ (function (_super) {
    __extends(RightAlignedOuterVerticallyStackedAxisLayoutStrategy, _super);
    function RightAlignedOuterVerticallyStackedAxisLayoutStrategy() {
        var _this = _super.call(this) || this;
        _this.type = LayoutStrategyType_1.ELayoutStrategyType.RightStacked;
        _this.isStacked = true;
        _this.layoutAxisPartsStrategy = AxisLayoutHelpers_1.layoutAxisPartsRightStrategy;
        return _this;
    }
    RightAlignedOuterVerticallyStackedAxisLayoutStrategy.prototype.measureAxes = function (sciChartSurface, chartLayoutState, axes) {
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
        var rightViewportBorder = sciChartSurface.rightViewportBorder, rightCanvasBorder = sciChartSurface.rightCanvasBorder, adjustedPadding = sciChartSurface.adjustedPadding;
        requiredSize += rightViewportBorder + rightCanvasBorder + ((_a = adjustedPadding === null || adjustedPadding === void 0 ? void 0 : adjustedPadding.right) !== null && _a !== void 0 ? _a : 0);
        chartLayoutState.rightOuterAreaSize = Math.max(chartLayoutState.rightOuterAreaSize, requiredSize);
    };
    RightAlignedOuterVerticallyStackedAxisLayoutStrategy.prototype.layoutAxes = function (left, top, right, bottom, axes) {
        var _this = this;
        var totalAxisAreaHeight = bottom - top;
        var firstAxis = axes[0];
        var lastAxis = axes[axes.length - 1];
        var axesWithDefinedLength = axes.filter(function (axis) { return axis.stackedAxisLength; });
        var spaceWithoutBorders = axes.reduce(function (acc, axis) { return acc - axis.axisLayoutState.additionalBottomSize - axis.axisLayoutState.additionalTopSize; }, totalAxisAreaHeight +
            (firstAxis === null || firstAxis === void 0 ? void 0 : firstAxis.axisLayoutState.additionalTopSize) +
            (lastAxis === null || lastAxis === void 0 ? void 0 : lastAxis.axisLayoutState.additionalBottomSize));
        var totalDefinedAxesLength = axesWithDefinedLength.reduce(function (acc, axis) { return acc + _this.calculateTotalAxisHeight(axis, spaceWithoutBorders); }, 0);
        var availableSpaceForAxes = totalAxisAreaHeight +
            (firstAxis === null || firstAxis === void 0 ? void 0 : firstAxis.axisLayoutState.additionalTopSize) +
            (lastAxis === null || lastAxis === void 0 ? void 0 : lastAxis.axisLayoutState.additionalBottomSize) -
            totalDefinedAxesLength;
        if (availableSpaceForAxes < 0) {
            throw new Error("Right stacked axes with defined size total ".concat(totalDefinedAxesLength, " pixels which is ").concat(-availableSpaceForAxes, " more than the space available"));
        }
        var defaultAxisReservedHeight = availableSpaceForAxes / (axes.length - axesWithDefinedLength.length);
        var topOffset = top - (firstAxis === null || firstAxis === void 0 ? void 0 : firstAxis.axisLayoutState.additionalTopSize);
        axes.forEach(function (axis) {
            var _a = axis.axisLayoutState, axisSize = _a.axisSize, additionalLeftSize = _a.additionalLeftSize, additionalBottomSize = _a.additionalBottomSize, additionalTopSize = _a.additionalTopSize;
            var leftOffset = left + additionalLeftSize;
            var rightOffset = leftOffset + axisSize;
            var axisReservedHeight = axis.stackedAxisLength
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
    return RightAlignedOuterVerticallyStackedAxisLayoutStrategy;
}(BaseAxisLayoutStrategy_1.BaseAxisLayoutStrategy));
exports.RightAlignedOuterVerticallyStackedAxisLayoutStrategy = RightAlignedOuterVerticallyStackedAxisLayoutStrategy;
