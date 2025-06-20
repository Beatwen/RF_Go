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
exports.getActiveAxes = exports.testIsOverAxes = exports.ChartModifierBase2D = void 0;
var XyDirection_1 = require("../../types/XyDirection");
var pointUtil_1 = require("../../utils/pointUtil");
var AxisCore_1 = require("../Visuals/Axis/AxisCore");
var ChartModifierBase_1 = require("./ChartModifierBase");
var constants_1 = require("./constants");
/**
 * Defines a base class to a ChartModifier2D - a class which provides Zoom, Pan, Tooltip or interaction behavior
 * to SciChart - High Performance Realtime {@link https://www.scichart.com/javascript-chart-features | 2D JavaScript Charts}
 */
var ChartModifierBase2D = /** @class */ (function (_super) {
    __extends(ChartModifierBase2D, _super);
    /**
     * Creates an instance of the {@link ChartModifierBase2D}
     * @param options optional parameters via {@link IChartModifierBaseOptions} which can be passed to configure the modifier
     */
    function ChartModifierBase2D(options) {
        var _this = this;
        var _a, _b, _c, _d;
        _this = _super.call(this, options) || this;
        _this.xyDirection = XyDirection_1.EXyDirection.XyDirection;
        _this.changedPropertiesList = [];
        _this.xAxisIdProperty = AxisCore_1.AxisCore.DEFAULT_AXIS_ID;
        _this.yAxisIdProperty = AxisCore_1.AxisCore.DEFAULT_AXIS_ID;
        // used to track if registered types were used for function properties, so they can be serialized
        _this.typeMap = new Map();
        _this.xyDirection = (_a = options === null || options === void 0 ? void 0 : options.xyDirection) !== null && _a !== void 0 ? _a : _this.xyDirection;
        _this.modifierGroup = (_b = options === null || options === void 0 ? void 0 : options.modifierGroup) !== null && _b !== void 0 ? _b : _this.modifierGroup;
        _this.xAxisIdProperty = (_c = options === null || options === void 0 ? void 0 : options.xAxisId) !== null && _c !== void 0 ? _c : _this.xAxisIdProperty;
        _this.yAxisIdProperty = (_d = options === null || options === void 0 ? void 0 : options.yAxisId) !== null && _d !== void 0 ? _d : _this.yAxisIdProperty;
        return _this;
    }
    Object.defineProperty(ChartModifierBase2D.prototype, "modifierType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return ChartModifierBase_1.EModifierType.Chart2DModifier;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartModifierBase2D.prototype, "xAxisId", {
        /** @inheritDoc */
        get: function () {
            return this.xAxisIdProperty;
        },
        /** @inheritDoc */
        set: function (xAxisId) {
            this.xAxisIdProperty = xAxisId;
            this.notifyPropertyChanged(constants_1.PROPERTY.X_AXIS_ID);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartModifierBase2D.prototype, "yAxisId", {
        /** @inheritDoc */
        get: function () {
            return this.yAxisIdProperty;
        },
        /** @inheritDoc */
        set: function (yAxisId) {
            this.yAxisIdProperty = yAxisId;
            this.notifyPropertyChanged(constants_1.PROPERTY.Y_AXIS_ID);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets all series on the parent surface.
     * @protected
     * @remarks This function allows mocking in tests
     */
    ChartModifierBase2D.prototype.getAllSeries = function () {
        return this.parentSurface.renderableSeries.asArray();
    };
    /**
     * @inheritDoc
     */
    ChartModifierBase2D.prototype.toJSON = function () {
        var options = {
            id: this.id,
            modifierGroup: this.modifierGroup,
            executeOn: this.executeOn,
            xyDirection: this.xyDirection,
            xAxisId: this.xAxisId,
            yAxisId: this.yAxisId
        };
        return { type: this.type, options: options };
    };
    ChartModifierBase2D.prototype.testPropertyChanged = function (propertyName) {
        return this.changedPropertiesList.includes(propertyName);
    };
    ChartModifierBase2D.prototype.notifyPropertyChanged = function (propertyName) {
        if (!this.changedPropertiesList.includes(propertyName)) {
            this.changedPropertiesList.push(propertyName);
        }
        _super.prototype.notifyPropertyChanged.call(this, propertyName);
    };
    /**
     * Grows the Axis by a fraction around the mouse point
     * @param mousePoint the X,Y location of the mouse at the time of the operation
     * @param axis the Axis to grow or shrink
     * @param fraction the fraction, e.g. 0.1 grows the axis by 10%
     */
    ChartModifierBase2D.prototype.growBy = function (mousePoint, axis, fraction) {
        var isHorizontalAxis = axis.isHorizontalAxis, isAxisFlipped = axis.isAxisFlipped, viewRect = axis.viewRect, flippedCoordinates = axis.flippedCoordinates;
        var seriesViewRect = this.parentSurface.seriesViewRect;
        var size = isHorizontalAxis ? viewRect.width : viewRect.height;
        if (axis.isStackedAxis && this.parentSurface) {
            size = isHorizontalAxis ? seriesViewRect.width : seriesViewRect.height;
        }
        var coord = isHorizontalAxis ? mousePoint.x : mousePoint.y;
        // Compute relative fractions to expand or contract the axis VisibleRange by
        var lowFraction = (coord / size) * fraction;
        var highFraction = (1 - coord / size) * fraction;
        // We flip zoom for vertical chart or flippedCoordinates
        var flipZoom = (isAxisFlipped && !flippedCoordinates) || (!isAxisFlipped && flippedCoordinates);
        if (flipZoom) {
            axis.zoomBy(highFraction, lowFraction);
        }
        else {
            axis.zoomBy(lowFraction, highFraction);
        }
    };
    return ChartModifierBase2D;
}(ChartModifierBase_1.ChartModifierBase));
exports.ChartModifierBase2D = ChartModifierBase2D;
var testIsOverAxes = function (xAxisArr, mousePoint) {
    var result = false;
    xAxisArr.forEach(function (x) {
        if (x.viewRect) {
            var _a = x.viewRect, left = _a.left, right = _a.right, top_1 = _a.top, bottom = _a.bottom;
            if ((0, pointUtil_1.testIsInBounds)(mousePoint.x, mousePoint.y, left, bottom, right, top_1)) {
                result = true;
            }
        }
    });
    return result;
};
exports.testIsOverAxes = testIsOverAxes;
var getActiveAxes = function (xAxisArr, mousePoint) {
    var result = [];
    xAxisArr.forEach(function (x) {
        if (x.viewRect) {
            var _a = x.viewRect, left = _a.left, right = _a.right, top_2 = _a.top, bottom = _a.bottom;
            if ((0, pointUtil_1.testIsInBounds)(mousePoint.x, mousePoint.y, left, bottom, right, top_2)) {
                result.push(x);
            }
        }
    });
    return result;
};
exports.getActiveAxes = getActiveAxes;
