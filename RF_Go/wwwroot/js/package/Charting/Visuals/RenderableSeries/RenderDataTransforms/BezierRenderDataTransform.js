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
exports.SmoothStackedRenderDataTransform = exports.XyyBezierRenderDataTransform = exports.BezierRenderDataTransform = exports.bezierTransform = void 0;
var EasingFunctions_1 = require("../../../../Core/Animations/EasingFunctions");
var NumberRange_1 = require("../../../../Core/NumberRange");
var XyPointSeriesResampled_1 = require("../../../Model/PointSeries/XyPointSeriesResampled");
var XyyPointSeriesResampled_1 = require("../../../Model/PointSeries/XyyPointSeriesResampled");
var BaseRenderDataTransform_1 = require("./BaseRenderDataTransform");
var bezierTransform = function (xValues, yValues, indexes, oldX, oldY, iStart, iEnd, interpolationPoints, curvature, y1Values) {
    var _a, _b;
    xValues.clear();
    yValues.clear();
    indexes.clear();
    var getControlPoint = function (x, y, xp, yp, xn, yn, f) {
        if (yp !== yp)
            return { xc: x, yc: y };
        if (x === xp && y === yp) {
            return { xc: x, yc: y };
        }
        var m = Number.MAX_VALUE;
        if (x !== xp) {
            m = (y - yp) / (x - xp);
        }
        var xc;
        var yc;
        var d = (xn - x) * f;
        xc = x + d;
        yc = y + m * d;
        yc = Math.max(Math.min(yc, Math.max(y, yn)), Math.min(y, yn));
        return { xc: xc, yc: yc };
    };
    var bezier = function (p1, p2, p3, p4, t) {
        var f = 1 - t;
        return Math.pow(f, 3) * p1 + 3 * f * f * t * p2 + 3 * f * t * t * p3 + Math.pow(t, 3) * p4;
    };
    var getPoint = function (i) { return ({ x: oldX.get(i), y: oldY.get(i) }); };
    var getY1 = function (i) {
        var y1 = y1Values === null || y1Values === void 0 ? void 0 : y1Values.get(index);
        if (y1 === undefined || y1 !== y1) {
            return Infinity;
        }
        return y1;
    };
    var pPrev = getPoint(Math.max(iStart - 1, 0));
    var pCur = getPoint(iStart);
    var pNext = getPoint(iStart + 1);
    var pAfter = getPoint(Math.min(iStart + 2, oldX.size() - 1));
    var p3;
    var index = 0;
    for (var i = iStart; i < iEnd; i++) {
        xValues.push_back(pCur.x);
        indexes.push_back(index);
        yValues.push_back(Math.min(pCur.y, getY1(index)));
        index++;
        var p2 = getControlPoint(pCur.x, pCur.y, (_a = p3 === null || p3 === void 0 ? void 0 : p3.xc) !== null && _a !== void 0 ? _a : pPrev.x, (_b = p3 === null || p3 === void 0 ? void 0 : p3.yc) !== null && _b !== void 0 ? _b : pPrev.y, pNext.x, pNext.y, curvature);
        p3 = getControlPoint(pNext.x, pNext.y, pAfter.x, pAfter.y, pCur.x, pCur.y, curvature);
        for (var j = 1; j < interpolationPoints; j++) {
            var t = EasingFunctions_1.easing.inOutCubic(j / interpolationPoints);
            var x = bezier(pCur.x, p2.xc, p3.xc, pNext.x, t);
            var y = bezier(pCur.y, p2.yc, p3.yc, pNext.y, t);
            xValues.push_back(x);
            yValues.push_back(Math.min(y, getY1(index)));
            indexes.push_back(index);
            index++;
        }
        if (i > iStart)
            pPrev = pCur;
        pCur = pNext;
        pNext = pAfter;
        if (i < oldX.size() - 3)
            pAfter = getPoint(i + 3);
    }
    xValues.push_back(pNext.x);
    yValues.push_back(Math.min(pNext.y, getY1(index)));
    indexes.push_back(index);
};
exports.bezierTransform = bezierTransform;
/**
 * A RenderDataTransform that calculates a Cubic Bezier curve over an XyDataSeries, while respecting the bounds of the data.
 */
var BezierRenderDataTransform = /** @class */ (function (_super) {
    __extends(BezierRenderDataTransform, _super);
    function BezierRenderDataTransform(parentSeries, wasmContext, drawingProviders, options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, parentSeries, wasmContext, drawingProviders) || this;
        _this.interpolationPointsProperty = 20;
        _this.curvatureProperty = 0.5;
        _this.interpolationPointsProperty = (_a = options === null || options === void 0 ? void 0 : options.interpolationPoints) !== null && _a !== void 0 ? _a : _this.interpolationPoints;
        _this.curvatureProperty = (_b = options === null || options === void 0 ? void 0 : options.curvature) !== null && _b !== void 0 ? _b : _this.curvature;
        return _this;
    }
    Object.defineProperty(BezierRenderDataTransform.prototype, "interpolationPoints", {
        /** The number of points to add between each data point.  Default 20
         * These are Not uniformly distributed, but clutered around the data points to give smoother curves
         */
        get: function () {
            return this.interpolationPointsProperty;
        },
        set: function (value) {
            var _a, _b;
            if (this.interpolationPointsProperty !== value) {
                this.interpolationPointsProperty = value;
                this.requiresTransform = true;
                if ((_a = this.parentSeries) === null || _a === void 0 ? void 0 : _a.invalidateParentCallback) {
                    (_b = this.parentSeries) === null || _b === void 0 ? void 0 : _b.invalidateParentCallback();
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BezierRenderDataTransform.prototype, "curvature", {
        /** A scale factor for the tightness of the curves. Valid values 0 to 1.  Lower = tighter curves  */
        get: function () {
            return this.curvatureProperty;
        },
        set: function (value) {
            var _a, _b;
            if (this.curvatureProperty !== value) {
                this.curvatureProperty = value;
                this.requiresTransform = true;
                if ((_a = this.parentSeries) === null || _a === void 0 ? void 0 : _a.invalidateParentCallback) {
                    (_b = this.parentSeries) === null || _b === void 0 ? void 0 : _b.invalidateParentCallback();
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    BezierRenderDataTransform.prototype.createPointSeries = function () {
        return new XyPointSeriesResampled_1.XyPointSeriesResampled(this.wasmContext, new NumberRange_1.NumberRange(0, 0));
    };
    BezierRenderDataTransform.prototype.runTransformInternal = function (renderPassData) {
        var _a;
        var _b = renderPassData.pointSeries, oldX = _b.xValues, oldY = _b.yValues, oldI = _b.indexes, resampled = _b.resampled;
        var _c = this.pointSeries, xValues = _c.xValues, yValues = _c.yValues, indexes = _c.indexes;
        var iStart = resampled ? 0 : renderPassData.indexRange.min;
        var iEnd = resampled ? oldX.size() - 1 : (_a = renderPassData.indexRange) === null || _a === void 0 ? void 0 : _a.max;
        if (oldX.size() == 0) {
            // Nothing to do
            return renderPassData.pointSeries;
        }
        (0, exports.bezierTransform)(xValues, yValues, indexes, oldX, oldY, iStart, iEnd, this.interpolationPoints, this.curvature);
        return this.pointSeries;
    };
    return BezierRenderDataTransform;
}(BaseRenderDataTransform_1.BaseRenderDataTransform));
exports.BezierRenderDataTransform = BezierRenderDataTransform;
/**
 * A RenderDataTransform that calculates a Cubic Bezier curve over the an Xyy dataSeries, while respecting the bounds of the data.
 */
var XyyBezierRenderDataTransform = /** @class */ (function (_super) {
    __extends(XyyBezierRenderDataTransform, _super);
    function XyyBezierRenderDataTransform(parentSeries, wasmContext, drawingProviders, options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, parentSeries, wasmContext, drawingProviders) || this;
        _this.interpolationPointsProperty = 20;
        _this.curvatureProperty = 0.5;
        _this.forceYGreaterThanY1 = false;
        _this.interpolationPointsProperty = (_a = options === null || options === void 0 ? void 0 : options.interpolationPoints) !== null && _a !== void 0 ? _a : _this.interpolationPoints;
        _this.curvatureProperty = (_b = options === null || options === void 0 ? void 0 : options.curvature) !== null && _b !== void 0 ? _b : _this.curvature;
        return _this;
    }
    Object.defineProperty(XyyBezierRenderDataTransform.prototype, "interpolationPoints", {
        /** The number of points to add between each data point.  Default 20
         * These are Not uniformly distributed, but clutered around the data points to give smoother curves
         */
        get: function () {
            return this.interpolationPointsProperty;
        },
        set: function (value) {
            var _a, _b;
            if (this.interpolationPointsProperty !== value) {
                this.interpolationPointsProperty = value;
                this.requiresTransform = true;
                if ((_a = this.parentSeries) === null || _a === void 0 ? void 0 : _a.invalidateParentCallback) {
                    (_b = this.parentSeries) === null || _b === void 0 ? void 0 : _b.invalidateParentCallback();
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(XyyBezierRenderDataTransform.prototype, "curvature", {
        /** A scale factor for the tightness of the curves. Valid values 0 to 1.  Lower = tighter curves  */
        get: function () {
            return this.curvatureProperty;
        },
        set: function (value) {
            var _a, _b;
            if (this.curvatureProperty !== value) {
                this.curvatureProperty = value;
                this.requiresTransform = true;
                if ((_a = this.parentSeries) === null || _a === void 0 ? void 0 : _a.invalidateParentCallback) {
                    (_b = this.parentSeries) === null || _b === void 0 ? void 0 : _b.invalidateParentCallback();
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    XyyBezierRenderDataTransform.prototype.createPointSeries = function () {
        return new XyyPointSeriesResampled_1.XyyPointSeriesResampled(this.wasmContext, new NumberRange_1.NumberRange(0, 0));
    };
    XyyBezierRenderDataTransform.prototype.runTransformInternal = function (renderPassData) {
        var _a;
        var _b = renderPassData.pointSeries, oldX = _b.xValues, oldY = _b.yValues, oldY1 = _b.y1Values, oldI = _b.indexes, resampled = _b.resampled;
        var _c = this.pointSeries, xValues = _c.xValues, yValues = _c.yValues, y1Values = _c.y1Values, indexes = _c.indexes;
        var iStart = resampled ? 0 : renderPassData.indexRange.min;
        var iEnd = resampled ? oldX.size() - 1 : (_a = renderPassData.indexRange) === null || _a === void 0 ? void 0 : _a.max;
        if (oldX.size() == 0) {
            // Nothing to do
            return renderPassData.pointSeries;
        }
        (0, exports.bezierTransform)(xValues, y1Values, indexes, oldX, oldY1, iStart, iEnd, this.interpolationPoints, this.curvature);
        (0, exports.bezierTransform)(xValues, yValues, indexes, oldX, oldY, iStart, iEnd, this.interpolationPoints, this.curvature, this.forceYGreaterThanY1 ? y1Values : undefined);
        return this.pointSeries;
    };
    return XyyBezierRenderDataTransform;
}(BaseRenderDataTransform_1.BaseRenderDataTransform));
exports.XyyBezierRenderDataTransform = XyyBezierRenderDataTransform;
/**
 * A RenderDataTransform that calculates a Cubic Bezier curve over the an Xyy dataSeries, while respecting the bounds of the data.
 * This also restricts the Y1 values to be less than the Y values, allowing this to be used for stacked series.
 */
var SmoothStackedRenderDataTransform = /** @class */ (function (_super) {
    __extends(SmoothStackedRenderDataTransform, _super);
    function SmoothStackedRenderDataTransform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.forceYGreaterThanY1 = true;
        return _this;
    }
    return SmoothStackedRenderDataTransform;
}(XyyBezierRenderDataTransform));
exports.SmoothStackedRenderDataTransform = SmoothStackedRenderDataTransform;
