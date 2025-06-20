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
exports.StackedMountainCollection = void 0;
var NumberRange_1 = require("../../../Core/NumberRange");
var SeriesType_1 = require("../../../types/SeriesType");
var copyVector_1 = require("../../../utils/copyVector");
var perfomance_1 = require("../../../utils/perfomance");
var XyyPointSeriesWrapped_1 = require("../../Model/PointSeries/XyyPointSeriesWrapped");
var RenderPassData_1 = require("../../Services/RenderPassData");
var BaseStackedCollection_1 = require("./BaseStackedCollection");
var constants_1 = require("./constants");
/**
 * @summary A {@link StackedMountainCollection} allows grouping multiple {@link StackedMountainRenderableSeries}
 * to create a JavaScript Stacked Mountain chart, or 100% Stacked Mountain chart
 * @description
 * Multiple {@link StackedMountainRenderableSeries} are required to create a stacked mountain chart type in SciChart.
 * These are grouped with a {@link StackedMountainCollection}, which implements {@link IRenderableSeries} and may be added
 * directly to a {@link SciChartSurface.renderableSeries} collection.
 *
 * Code sample below:
 * ```ts
 * const stackedMountain0 = new StackedMountainRenderableSeries(wasmContext);
 * // .. configure mountain 1, including set dataSeries
 * const stackedMountain1 = new StackedMountainRenderableSeries(wasmContext);
 * // .. configure mountain 2, including set dataSeries
 * const stackedMountain2 = new StackedMountainRenderableSeries(wasmContext);
 * // .. configure mountain 3, including set dataSeries
 * const stackedMountainCollection = new StackedMountainCollection(wasmContext);
 * stackedMountainCollection.add(stackedMountain0, stackedMountain1, stackedMountain2);
 *
 * sciChartSurface.renderableSeries.add(stackedMountainCollection);
 * ````
 * @remarks This type implements {@link IRenderableSeries} but it is not a renderable series, instead it wraps multiple
 * {@link StackedMountainRenderableSeries} to create a stacked mountain chart
 */
var StackedMountainCollection = /** @class */ (function (_super) {
    __extends(StackedMountainCollection, _super);
    /**
     * Creates an instance of the {@link StackedMountainCollection}
     * @param webAssemblyContext The {@link TSciChart | SciChart WebAssembly Context} containing
     * native methods and access to our WebGL2 WebAssembly Drawing Engine
     * @param options Optional parameters of type {@link IBaseStackedCollectionOptions} to configure the series
     */
    function StackedMountainCollection(webAssemblyContext, options) {
        var _this = _super.call(this, webAssemblyContext, options) || this;
        _this.type = SeriesType_1.ESeriesType.StackedMountainCollection;
        _this.detachChildSeries = _this.detachChildSeries.bind(_this);
        _this.attachChildSeries = _this.attachChildSeries.bind(_this);
        _this.collectionChanged.subscribe(function (arg) {
            var _a, _b;
            (_a = arg.getOldItems()) === null || _a === void 0 ? void 0 : _a.forEach(_this.detachChildSeries);
            (_b = arg.getNewItems()) === null || _b === void 0 ? void 0 : _b.forEach(_this.attachChildSeries);
        });
        return _this;
    }
    /** @inheritDoc */
    StackedMountainCollection.prototype.updateAccumulatedVectors = function () {
        var _this = this;
        var dataValuesCount = this.getDataSeriesValuesCount();
        if (!this.isAccumulatedVectorDirty || !dataValuesCount) {
            return;
        }
        this.checkXValuesCorrect();
        this.isAccumulatedVectorDirty = false;
        this.clearAccumulatedVectors(dataValuesCount);
        var _loop_1 = function (i) {
            this_1.accumulatedValues0.push_back(0);
            var previous = 0;
            var totalSum;
            if (this_1.isOneHundredPercent) {
                totalSum = this_1.getVisibleSeries().reduce(function (prev, cur) { return prev + cur.dataSeries.getNativeYValues().get(i); }, 0);
            }
            this_1.getVisibleSeries().forEach(function (rs) {
                var currentY = rs.dataSeries.getNativeYValues().get(i);
                if (_this.isOneHundredPercent) {
                    currentY = (currentY * 100) / totalSum;
                }
                var current = previous + currentY;
                rs.accumulatedValues.push_back(current);
                previous = current;
                if (rs.renderDataTransform) {
                    rs.renderDataTransform.requiresTransform = true;
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < dataValuesCount; i++) {
            _loop_1(i);
        }
    };
    /** @inheritDoc */
    StackedMountainCollection.prototype.draw = function (renderContext, renderPassData) {
        var _this = this;
        var _a, _b, _c, _d;
        if (this.canDraw) {
            this.updateHitTestProviders(renderPassData);
            if (!this.isEnoughDataToDraw()) {
                return;
            }
            if ((_a = this.getFirstSeries().dataSeries) === null || _a === void 0 ? void 0 : _a.fifoCapacity) {
                throw new Error("Sorry, fifo is not currently supported for stacked series");
            }
            var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawCollectionSeriesStart, {
                contextId: this.id,
                parentContextId: (_b = this.parentSurface) === null || _b === void 0 ? void 0 : _b.id,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
            this.updateAccumulatedVectors();
            var xAxis_1 = this.parentSurface.getXAxisById(this.xAxisId);
            var visibleSeries_1 = this.getVisibleSeries();
            // draw Stacked Series in reverse order to prevent overlapping with Point Markers
            visibleSeries_1.reduceRight(function (nextSeries, series, index, collection) {
                var currAccumVec = series.accumulatedValues;
                var accumulatedValues = index === 0 ? _this.accumulatedValues0 : collection[index - 1].accumulatedValues;
                // wrap XyDataSeries as XyyDataSeries
                var xyyPointSeries = new XyyPointSeriesWrapped_1.XyyPointSeriesWrapped(series.dataSeries, accumulatedValues, // base
                currAccumVec // top
                );
                var renderData = new RenderPassData_1.RenderPassData(series.getIndicesRange(xAxis_1.visibleRange), renderPassData.getxCoordinateCalculator, renderPassData.getyCoordinateCalculator, xAxis_1.isVerticalChart, xyyPointSeries);
                if (series.renderDataTransform) {
                    var transRenderData = new RenderPassData_1.RenderPassData(series.getIndicesRange(xAxis_1.visibleRange), renderPassData.getxCoordinateCalculator, renderPassData.getyCoordinateCalculator, xAxis_1.isVerticalChart, xyyPointSeries);
                    transRenderData = series.renderDataTransform.runTransform(transRenderData);
                    if (index < visibleSeries_1.length - 1) {
                        (0, copyVector_1.copyDoubleVector)(collection[index + 1].renderDataTransform.pointSeries.yValues, transRenderData.pointSeries.y1Values, _this.webAssemblyContext);
                    }
                    series.strokeY1 = index === 0 ? "transparent" : collection[index - 1].stroke;
                    series.strokeY1DashArray = index === 0 ? [] : collection[index - 1].strokeDashArray;
                    series.drawingProviders[0].draw(renderContext, transRenderData);
                    return series;
                }
                series.strokeY1 = index === 0 ? "transparent" : collection[index - 1].stroke;
                series.strokeY1DashArray = index === 0 ? [] : collection[index - 1].strokeDashArray;
                series.draw(renderContext, renderData);
                return series;
            }, undefined);
            perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawCollectionSeriesEnd, {
                contextId: this.id,
                parentContextId: (_c = this.parentSurface) === null || _c === void 0 ? void 0 : _c.id,
                relatedId: (_d = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _d === void 0 ? void 0 : _d.relatedId,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
        }
    };
    /** @inheritDoc */
    StackedMountainCollection.prototype.getXRange = function () {
        if (!this.isEnoughDataToDraw()) {
            return new NumberRange_1.NumberRange();
        }
        return this.getFirstSeries().dataSeries.xRange;
    };
    /** @inheritDoc */
    StackedMountainCollection.prototype.onAttach = function (scs) {
        _super.prototype.onAttach.call(this, scs);
        this.getVisibleSeries().forEach(function (series) {
            series.onAttach(scs);
        });
    };
    /** @inheritDoc */
    StackedMountainCollection.prototype.onDetach = function () {
        this.getVisibleSeries().forEach(function (series) {
            series.onDetach();
        });
        _super.prototype.onDetach.call(this);
    };
    /** @inheritDoc */
    StackedMountainCollection.prototype.notifyPropertyChanged = function (propertyName) {
        _super.prototype.notifyPropertyChanged.call(this, propertyName);
        if (propertyName === constants_1.PROPERTY.DATA_SERIES ||
            propertyName === constants_1.PROPERTY.IS_VISIBLE ||
            propertyName === constants_1.PROPERTY.IS_ONE_HUNDRED_PERCENT) {
            this.isAccumulatedVectorDirty = true;
        }
    };
    /** @inheritDoc */
    StackedMountainCollection.prototype.hasDataSeriesValues = function () {
        return this.isEnoughDataToDraw();
    };
    // PROTECTED
    // PRIVATE
    StackedMountainCollection.prototype.detachChildSeries = function (series) {
        series.onDetachFromParentCollection();
        this.isAccumulatedVectorDirty = true;
        this.invalidateParent();
    };
    StackedMountainCollection.prototype.attachChildSeries = function (series) {
        series.onAttachToParentCollection(this, this.getParentSurface, this.notifyPropertyChanged);
        if (this.parentSurface) {
            series.onAttach(this.parentSurface);
        }
        this.isAccumulatedVectorDirty = true;
        this.invalidateParent();
    };
    StackedMountainCollection.prototype.checkXValuesCorrect = function () {
        var length = this.getDataSeriesValuesCount();
        this.getVisibleSeries().forEach(function (el) {
            if (!(el.dataSeries.count() === length)) {
                throw Error("All stacked series in on collection should have the same amount of X Values");
            }
        });
    };
    /**
     * @param numberOfElements - number of element expected is used for performance to reserve memory
     */
    StackedMountainCollection.prototype.clearAccumulatedVectors = function (numberOfElements) {
        this.accumulatedValues0.clear();
        this.accumulatedValues0.reserve(numberOfElements);
        this.asArray().forEach(function (el) {
            el.accumulatedValues.clear();
            el.accumulatedValues.reserve(numberOfElements);
        });
    };
    StackedMountainCollection.prototype.getLastVisibleSeries = function () {
        var lastItem = this.getVisibleSeries().slice(-1)[0];
        return lastItem;
    };
    return StackedMountainCollection;
}(BaseStackedCollection_1.BaseStackedCollection));
exports.StackedMountainCollection = StackedMountainCollection;
