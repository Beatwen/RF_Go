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
exports.BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy = void 0;
var Rect_1 = require("../../Core/Rect");
var LayoutStrategyType_1 = require("../../types/LayoutStrategyType");
var AxisLayoutHelpers_1 = require("./AxisLayoutHelpers");
var BaseAxisLayoutStrategy_1 = require("./BaseAxisLayoutStrategy");
/**
 * The Horizontally Stacked Layout Strategy for Bottom Axes
 */
var BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy = /** @class */ (function (_super) {
    __extends(BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy, _super);
    function BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy() {
        var _this = _super.call(this) || this;
        _this.type = LayoutStrategyType_1.ELayoutStrategyType.BottomStacked;
        _this.isStacked = true;
        _this.layoutAxisPartsStrategy = AxisLayoutHelpers_1.layoutAxisPartsBottomStrategy;
        return _this;
    }
    BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy.prototype.measureAxes = function (sciChartSurface, chartLayoutState, axes) {
        var _this = this;
        var _a;
        var requiredSize = 0;
        axes.forEach(function (axis) {
            axis.measure();
            _this.updateAxisLayoutState(axis);
            var currentAxisRequiredSize = (0, AxisLayoutHelpers_1.getHorizontalAxisRequiredSize)(axis.axisLayoutState);
            requiredSize = currentAxisRequiredSize > requiredSize ? currentAxisRequiredSize : requiredSize;
        });
        var firstStackedAxis = axes[0];
        var lastStackedAxis = axes[axes.length - 1];
        this.updateLeftAndRightChartLayoutState(chartLayoutState, firstStackedAxis === null || firstStackedAxis === void 0 ? void 0 : firstStackedAxis.axisLayoutState.additionalLeftSize, lastStackedAxis === null || lastStackedAxis === void 0 ? void 0 : lastStackedAxis.axisLayoutState.additionalRightSize);
        var bottomViewportBorder = sciChartSurface.bottomViewportBorder, bottomCanvasBorder = sciChartSurface.bottomCanvasBorder, adjustedPadding = sciChartSurface.adjustedPadding;
        requiredSize += bottomViewportBorder + bottomCanvasBorder + ((_a = adjustedPadding === null || adjustedPadding === void 0 ? void 0 : adjustedPadding.bottom) !== null && _a !== void 0 ? _a : 0);
        chartLayoutState.bottomOuterAreaSize = Math.max(chartLayoutState.bottomOuterAreaSize, requiredSize);
    };
    BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy.prototype.layoutAxes = function (left, top, right, bottom, axes) {
        var _this = this;
        var totalAxisAreaWidth = right - left;
        var firstAxis = axes[0];
        var lastAxis = axes[axes.length - 1];
        var axesWithDefinedLength = axes.filter(function (axis) { return axis.stackedAxisLength; });
        var spaceWithoutBorders = axes.reduce(function (acc, axis) { return acc - axis.axisLayoutState.additionalBottomSize - axis.axisLayoutState.additionalTopSize; }, totalAxisAreaWidth +
            (firstAxis === null || firstAxis === void 0 ? void 0 : firstAxis.axisLayoutState.additionalLeftSize) +
            (lastAxis === null || lastAxis === void 0 ? void 0 : lastAxis.axisLayoutState.additionalRightSize));
        var totalDefinedAxesLength = axesWithDefinedLength.reduce(function (acc, axis) { return acc + _this.calculateTotalAxisWidth(axis, spaceWithoutBorders); }, 0);
        var availableSpaceForAxes = totalAxisAreaWidth +
            (firstAxis === null || firstAxis === void 0 ? void 0 : firstAxis.axisLayoutState.additionalLeftSize) +
            (lastAxis === null || lastAxis === void 0 ? void 0 : lastAxis.axisLayoutState.additionalRightSize) -
            totalDefinedAxesLength;
        if (availableSpaceForAxes < 0) {
            throw new Error("Bottom stacked axes with defined size total ".concat(totalDefinedAxesLength, " pixels which is ").concat(-availableSpaceForAxes, " more than the space available"));
        }
        var defaultAxisReservedHeight = availableSpaceForAxes / (axes.length - axesWithDefinedLength.length);
        var leftOffset = left - (firstAxis === null || firstAxis === void 0 ? void 0 : firstAxis.axisLayoutState.additionalLeftSize);
        axes.forEach(function (axis) {
            var _a = axis.axisLayoutState, axisSize = _a.axisSize, additionalLeftSize = _a.additionalLeftSize, additionalRightSize = _a.additionalRightSize, additionalTopSize = _a.additionalTopSize;
            var topOffset = top + additionalTopSize;
            var bottomOffset = topOffset + axisSize;
            var axisReservedHeight = axis.stackedAxisLength
                ? _this.calculateTotalAxisWidth(axis, spaceWithoutBorders)
                : defaultAxisReservedHeight;
            var rightOffset = leftOffset + axisReservedHeight - additionalRightSize;
            leftOffset += additionalLeftSize;
            axis.offset = leftOffset - left;
            axis.axisLength = rightOffset - leftOffset;
            axis.isPrimaryAxis = true;
            axis.viewRect = Rect_1.Rect.createWithCoords(leftOffset, topOffset, rightOffset, bottomOffset);
            leftOffset = rightOffset + additionalRightSize;
            (0, AxisLayoutHelpers_1.layoutAxisParts)(axis, _this.layoutAxisPartsStrategy);
        });
    };
    return BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy;
}(BaseAxisLayoutStrategy_1.BaseAxisLayoutStrategy));
exports.BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy = BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy;
