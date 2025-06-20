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
exports.SplineRenderDataTransform = void 0;
var NumberRange_1 = require("../../../../Core/NumberRange");
var XyPointSeriesResampled_1 = require("../../../Model/PointSeries/XyPointSeriesResampled");
var BaseRenderDataTransform_1 = require("./BaseRenderDataTransform");
var SplineRenderDataTransform = /** @class */ (function (_super) {
    __extends(SplineRenderDataTransform, _super);
    function SplineRenderDataTransform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.interpolationPoints = 10;
        _this.warnOnSplineFailure = true;
        _this.useForYRange = true;
        return _this;
    }
    SplineRenderDataTransform.prototype.createPointSeries = function () {
        return new XyPointSeriesResampled_1.XyPointSeriesResampled(this.wasmContext, new NumberRange_1.NumberRange(0, 0));
    };
    SplineRenderDataTransform.prototype.runTransformInternal = function (renderPassData) {
        var xValues = this.parentSeries.xAxis.isCategoryAxis
            ? renderPassData.pointSeries.indexes
            : renderPassData.pointSeries.xValues;
        var initialSize = xValues.size();
        if (initialSize == 0 || initialSize === 1) {
            // Nothing to do
            return renderPassData.pointSeries;
        }
        var yValues = renderPassData.pointSeries.yValues;
        var containsNaN = this.parentSeries.dataSeries.dataDistributionCalculator.containsNaN;
        this.wasmContext.SCRTSplineHelperCubicSpline(xValues, yValues, this.pointSeries.xValues, this.pointSeries.yValues, initialSize, this.interpolationPoints, this.parentSeries.dataSeries.dataDistributionCalculator.containsNaN);
        if (!containsNaN && isNaN(this.pointSeries.yValues.get(0))) {
            if (this.warnOnSplineFailure) {
                console.error("Could not calculate spline values.  X data may contain duplicates.  Falling back to original values.\n    To disable this warning set warnOnSplineFailure = false.");
            }
            return renderPassData.pointSeries;
        }
        else {
            return this.pointSeries;
        }
    };
    return SplineRenderDataTransform;
}(BaseRenderDataTransform_1.BaseRenderDataTransform));
exports.SplineRenderDataTransform = SplineRenderDataTransform;
