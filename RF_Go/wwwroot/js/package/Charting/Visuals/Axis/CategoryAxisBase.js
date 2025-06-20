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
exports.CategoryAxisBase = void 0;
var Deleter_1 = require("../../../Core/Deleter");
var NumberRange_1 = require("../../../Core/NumberRange");
var SeriesType_1 = require("../../../types/SeriesType");
var appendDoubleVectorFromJsArray_1 = require("../../../utils/ccall/appendDoubleVectorFromJsArray");
var CategoryCoordinateCalculator_1 = require("../../Numerics/CoordinateCalculators/CategoryCoordinateCalculator");
var FlippedCategoryCoordinateCalculator_1 = require("../../Numerics/CoordinateCalculators/FlippedCategoryCoordinateCalculator");
var NumericTickProvider_1 = require("../../Numerics/TickProviders/NumericTickProvider");
var AxisBase2D_1 = require("./AxisBase2D");
var CategoryDeltaCalculator_1 = require("./DeltaCalculator/CategoryDeltaCalculator");
/**
 * @summary A 2D Chart Category Axis Base type
 */
var CategoryAxisBase = /** @class */ (function (_super) {
    __extends(CategoryAxisBase, _super);
    /**
     * Creates an instance of a {@link CategoryAxisBase}
     * @param webAssemblyContext The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param options Optional parameters of type {@link ICategoryAxisBaseOptions} used to configure the axis at instantiation time
     */
    function CategoryAxisBase(webAssemblyContext, options) {
        var _this = this;
        var _a, _b, _c;
        _this = _super.call(this, webAssemblyContext, options) || this;
        _this.defaultXValuesProperty = [];
        _this.defaultXStartProperty = 0;
        _this.defaultXStepProperty = 1;
        _this.defaultXValuesProperty = (_a = options === null || options === void 0 ? void 0 : options.defaultXValues) !== null && _a !== void 0 ? _a : _this.defaultXValuesProperty;
        _this.defaultXStartProperty = (_b = options === null || options === void 0 ? void 0 : options.defaultXStart) !== null && _b !== void 0 ? _b : _this.defaultXStartProperty;
        _this.defaultXStepProperty = (_c = options === null || options === void 0 ? void 0 : options.defaultXStep) !== null && _c !== void 0 ? _c : _this.defaultXStepProperty;
        _this.tickProvider = new NumericTickProvider_1.NumericTickProvider(_this.webAssemblyContext2D);
        _this.deltaCalculator = new CategoryDeltaCalculator_1.CategoryDeltaCalculator(_this.webAssemblyContext2D);
        _this.defaultBaseXValues = new _this.webAssemblyContext2D.SCRTDoubleVector();
        return _this;
    }
    Object.defineProperty(CategoryAxisBase.prototype, "isCategoryAxis", {
        /**
         * @inheritDoc
         */
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBase.prototype, "defaultXValues", {
        /**
         * The default x values to use if no series or data is added to the chart.
         * The tick values shown will depend on the visible range, which for category axis is by index, not by value.
         * eg if you want default values [10, 20, 30, 40] you would need to set visibleRange: new NumberRange(0,3)
         * By default it will start at 0 and increment by 1, up to the size of the visible range.
         * To change the start and step set defaultXStart and defaultXStep
         */
        get: function () {
            return this.defaultXValuesProperty;
        },
        /**
         * The default x values to use if no series or data is added to the chart.
         * The tick values shown will depend on the visible range, which for category axis is by index, not by value.
         * eg if you want default values [10, 20, 30, 40] you would need to set visibleRange: new NumberRange(0,3)
         * By default it will start at 0 and increment by 1, up to the size of the visible range.
         * To change the start and step set defaultXStart and defaultXStep
         */
        set: function (values) {
            this.defaultXValuesProperty = values;
            if (this.invalidateParentCallback)
                this.invalidateParentCallback();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBase.prototype, "defaultXStart", {
        /**
         * The starting value for default x values.  See defaultXValues
         */
        get: function () {
            return this.defaultXStartProperty;
        },
        /**
         * The starting value for default x values.  See defaultXValues
         */
        set: function (value) {
            this.defaultXStartProperty = value;
            if (this.invalidateParentCallback)
                this.invalidateParentCallback();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBase.prototype, "defaultXStep", {
        /**
         * The step size for default x values.  See defaultXValues
         */
        get: function () {
            return this.defaultXStepProperty;
        },
        /**
         * The step size for default x values.  See defaultXValues
         */
        set: function (value) {
            this.defaultXStepProperty = value;
            if (this.invalidateParentCallback)
                this.invalidateParentCallback();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    CategoryAxisBase.prototype.prepareRenderData = function () {
        var _this = this;
        (0, Deleter_1.deleteSafe)(this.coordCalcCache);
        var coordCalc = this.getCurrentCoordinateCalculatorInternal();
        var scs = this.parentSurface;
        var renderableSeries = scs.renderableSeries.asArray().find(function (rs) { return rs.xAxisId === _this.id; });
        this.setBaseXValues(coordCalc, renderableSeries);
        this.coordCalcCache = coordCalc;
    };
    /**
     * @inheritDoc
     */
    CategoryAxisBase.prototype.delete = function () {
        this.defaultBaseXValues = (0, Deleter_1.deleteSafe)(this.defaultBaseXValues);
        _super.prototype.delete.call(this);
    };
    /**
     * @inheritDoc
     */
    CategoryAxisBase.prototype.getCurrentCoordinateCalculatorInternal = function () {
        var _this = this;
        var min = this.visibleRange.min;
        var max = this.visibleRange.max;
        var size = this.axisLength;
        var scs = this.parentSurface;
        var renderableSeries = scs.renderableSeries.asArray().find(function (rs) { return rs.xAxisId === _this.id; });
        // For reasons passing understanding, the native Category Coord Calculators operate in reverse to the linear ones
        // The order is switched so they match the values of shouldFlipCC
        var coordCalc = this.isXAxis !== this.flippedCoordinates
            ? new CategoryCoordinateCalculator_1.CategoryCoordinateCalculator(this.webAssemblyContext2D, size, min, max, this.offset)
            : new FlippedCategoryCoordinateCalculator_1.FlippedCategoryCoordinateCalculator(this.webAssemblyContext2D, size, min, max, this.offset);
        this.setBaseXValues(coordCalc, renderableSeries);
        return coordCalc;
    };
    /**
     * @inheritDoc
     */
    CategoryAxisBase.prototype.getXDataRange = function () {
        var _this = this;
        var maxRange;
        if (this.parentSurface) {
            var visibleSeries = this.parentSurface.renderableSeries
                .asArray()
                .filter(function (s) { return s.xAxisId === _this.id && s.isVisible && s.hasDataSeriesValues(); });
            visibleSeries.forEach(function (rSeries) {
                // using indices instead of xValues
                var indicesCount = rSeries.getDataSeriesValuesCount();
                var additionalValue = 1 / 2;
                var xRange = new NumberRange_1.NumberRange(0 - additionalValue, indicesCount - 1 + additionalValue);
                if (xRange) {
                    maxRange = !maxRange ? xRange : maxRange.union(xRange);
                }
            });
        }
        return maxRange;
    };
    CategoryAxisBase.prototype.getMaxAutoTicks = function () {
        // For category axis, there's no point in having more ticks than there are data values.  Doing so causes duplicate tick values.
        var coordCalc = this.getCurrentCoordinateCalculator();
        return Math.min(Math.max(1, this.maxAutoTicks), coordCalc.baseXValues.size());
    };
    CategoryAxisBase.prototype.generateDefaultXValuesForCategoryAxis = function (defaultXStart, defaultXStep) {
        this.defaultBaseXValues.clear();
        if (this.defaultXValues && this.defaultXValues.length > 0) {
            (0, appendDoubleVectorFromJsArray_1.appendDoubleVectorFromJsArray)(this.webAssemblyContext2D, this.defaultBaseXValues, this.defaultXValues);
        }
        else {
            var xValues = [];
            var length_1 = 10;
            for (var i = 0; i < length_1; i++) {
                xValues.push(defaultXStart + i * defaultXStep);
            }
            (0, appendDoubleVectorFromJsArray_1.appendDoubleVectorFromJsArray)(this.webAssemblyContext2D, this.defaultBaseXValues, xValues);
        }
        return this.defaultBaseXValues;
    };
    CategoryAxisBase.prototype.setBaseXValues = function (coordCalc, renderableSeries) {
        if ((renderableSeries === null || renderableSeries === void 0 ? void 0 : renderableSeries.type) === SeriesType_1.ESeriesType.UniformHeatmapSeries) {
            throw Error("Category Axis is not supported for UniformHeatmapRenderableSeries");
        }
        if (renderableSeries === null || renderableSeries === void 0 ? void 0 : renderableSeries.isStacked) {
            var stackedCollection = renderableSeries;
            if (stackedCollection.size() === 0) {
                throw Error("BaseStackedCollection should have at least one BaseStackedRenderableSeries");
            }
            var firstStackedRS = stackedCollection.get(0);
            if (!(firstStackedRS === null || firstStackedRS === void 0 ? void 0 : firstStackedRS.dataSeries)) {
                if (!coordCalc.baseXValues)
                    coordCalc.baseXValues = this.generateDefaultXValuesForCategoryAxis(this.defaultXStart, this.defaultXStep);
                return;
            }
            coordCalc.baseXValues = firstStackedRS.dataSeries.getNativeXValues();
        }
        else {
            // Not stacked renderable series
            if (!(renderableSeries === null || renderableSeries === void 0 ? void 0 : renderableSeries.dataSeries) || renderableSeries.dataSeries.count() < 10) {
                var defaultXStart = this.defaultXStart;
                var defaultXStep = this.defaultXStep;
                if ((renderableSeries === null || renderableSeries === void 0 ? void 0 : renderableSeries.dataSeries) && (renderableSeries === null || renderableSeries === void 0 ? void 0 : renderableSeries.dataSeries.count()) > 0) {
                    var data = renderableSeries.dataSeries.getNativeXValues();
                    defaultXStart = data.get(0);
                    if (renderableSeries.dataSeries.count() > 0) {
                        defaultXStep = data.get(1) - data.get(0);
                    }
                }
                if (!coordCalc.baseXValues)
                    coordCalc.baseXValues = this.generateDefaultXValuesForCategoryAxis(defaultXStart, defaultXStep);
                return;
            }
            coordCalc.baseXValues = renderableSeries.dataSeries.getNativeXValues();
        }
    };
    return CategoryAxisBase;
}(AxisBase2D_1.AxisBase2D));
exports.CategoryAxisBase = CategoryAxisBase;
