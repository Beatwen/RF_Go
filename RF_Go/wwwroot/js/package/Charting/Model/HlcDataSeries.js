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
exports.HlcDataSeries = void 0;
var Deleter_1 = require("../../Core/Deleter");
var Guard_1 = require("../../Core/Guard");
var NumberRange_1 = require("../../Core/NumberRange");
var NumberArray_1 = require("../../types/NumberArray");
var SearchMode_1 = require("../../types/SearchMode");
var YRangeMode_1 = require("../../types/YRangeMode");
var appendDoubleVectorFromJsArray_1 = require("../../utils/ccall/appendDoubleVectorFromJsArray");
var copyVector_1 = require("../../utils/copyVector");
var isRealNumber_1 = require("../../utils/isRealNumber");
var BaseDataSeries_1 = require("./BaseDataSeries");
var IDataSeries_1 = require("./IDataSeries");
/**
 * HlcDataSeries is a DataSeries for holding X, Y, H, L data in SciChart's 2D
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}
 * @remarks
 * The HlcDataSeries is primarily used with our {@link FastErrorBarsRenderableSeries | JavaScript Error Bars Chart},
 * which draws a High-Low Bars around points
 *
 * A DataSeries stores the data to render. This is independent from the {@link IRenderableSeries | RenderableSeries}
 * which defines how that data should be rendered.
 *
 * See derived types of {@link BaseDataSeries} to find out what data-series are available.
 * See derived types of {@link IRenderableSeries} to find out what 2D JavaScript Chart types are available.
 */
var HlcDataSeries = /** @class */ (function (_super) {
    __extends(HlcDataSeries, _super);
    /**
     * Creates an instance of {@link HlcDataSeries}
     * @param webAssemblyContext the {@link TSciChart | SciChart WebAssembly Context} containing native methods
     * and access to our underlying WebGL2 rendering engine
     * @param options the {@link IHlcDataSeriesOptions} which can be passed to configure the DataSeries at construct time
     */
    function HlcDataSeries(webAssemblyContext, options) {
        var _this = _super.call(this, webAssemblyContext, options) || this;
        /** @inheritDoc */
        _this.type = IDataSeries_1.EDataSeriesType.Hlc;
        _this.highValues = _this.doubleVectorProvider.getDoubleVector(webAssemblyContext);
        _this.lowValues = _this.doubleVectorProvider.getDoubleVector(webAssemblyContext);
        if (options === null || options === void 0 ? void 0 : options.xValues) {
            Guard_1.Guard.notNull(options.yValues, "options.yValues");
            Guard_1.Guard.notNull(options.highValues, "options.highValues");
            Guard_1.Guard.notNull(options.lowValues, "options.lowValues");
            _this.appendRange(options.xValues, options.yValues, options.highValues, options.lowValues, options.metadata);
            if ((options === null || options === void 0 ? void 0 : options.fifoCapacity) && (options === null || options === void 0 ? void 0 : options.fifoStartIndex)) {
                _this.xValues.notifyAppend(options === null || options === void 0 ? void 0 : options.fifoStartIndex);
                _this.yValues.notifyAppend(options === null || options === void 0 ? void 0 : options.fifoStartIndex);
                _this.highValues.notifyAppend(options === null || options === void 0 ? void 0 : options.fifoStartIndex);
                _this.lowValues.notifyAppend(options === null || options === void 0 ? void 0 : options.fifoStartIndex);
            }
        }
        return _this;
    }
    /**
     * Gets a native / WebAssembly vector of H-values in the DataSeries
     */
    HlcDataSeries.prototype.getNativeHighValues = function () {
        return this.highValues;
    };
    /**
     * Gets a native / WebAssembly vector of L-values in the DataSeries
     */
    HlcDataSeries.prototype.getNativeLowValues = function () {
        return this.lowValues;
    };
    /**
     * Appends a single X, Y, Y1 point to the DataSeries
     * @remarks
     * For best performance on drawing large datasets, use the {@link appendRange} method
     *
     * Any changes of the DataSeries will trigger a redraw on the parent {@link SciChartSurface}
     * @param x The X-value
     * @param y The Y1-value
     * @param h The H-value
     * @param l The L-value
     * @param metadata The point metadata
     */
    HlcDataSeries.prototype.append = function (x, y, h, l, metadata) {
        if (!this.getIsDeleted()) {
            var nativeX = this.getNativeXValues();
            this.dataDistributionCalculator.onAppend(this.isSorted, this.containsNaN, nativeX, [x], [y]);
            // Push metadata should be done before push x values
            this.appendMetadata(metadata);
            nativeX.push_back(x);
            this.getNativeYValues().push_back(y);
            this.getNativeHighValues().push_back(h);
            this.getNativeLowValues().push_back(l);
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Append, null, 1);
        }
    };
    /**
     * Appends a range of X, Y, Y1 points to the DataSeries
     * @remarks
     * This method is considerably higher performance than {@link append} which appends a single point
     *
     * Any changes of the DataSeries will trigger a redraw on the parent {@link SciChartSurface}
     * @param xValues The X-values
     * @param yValues The Y-values
     * @param y1Values The Y1-values
     * @param metadata The array of point metadata
     */
    HlcDataSeries.prototype.appendRange = function (xValues, yValues, hValues, lValues, metadata) {
        if (!this.getIsDeleted()) {
            Guard_1.Guard.isTrue((0, NumberArray_1.isNumberArray)(xValues) || (0, NumberArray_1.isTypedArray)(xValues), "xValues must be an array of numbers");
            Guard_1.Guard.isTrue((0, NumberArray_1.isNumberArray)(yValues) || (0, NumberArray_1.isTypedArray)(yValues), "yValues must be an array of numbers");
            Guard_1.Guard.isTrue((0, NumberArray_1.isNumberArray)(hValues) || (0, NumberArray_1.isTypedArray)(hValues), "hValues must be an array of numbers");
            Guard_1.Guard.isTrue((0, NumberArray_1.isNumberArray)(lValues) || (0, NumberArray_1.isTypedArray)(lValues), "lValues must be an array of numbers");
            Guard_1.Guard.arraysSameLengthArr([
                { arg: xValues, name: "xValues" },
                { arg: yValues, name: "yValues" },
                { arg: hValues, name: "hValues" },
                { arg: lValues, name: "lValues" }
            ]);
            if (metadata) {
                Guard_1.Guard.isTrue(Array.isArray(metadata), "metadata must be an array of IPointMetadata");
                Guard_1.Guard.arraysSameLength(xValues, "xValues", metadata, "metadata");
            }
            var nativeX = this.getNativeXValues();
            var nativeY = this.getNativeYValues();
            var nativeH = this.getNativeHighValues();
            var nativeL = this.getNativeLowValues();
            this.dataDistributionCalculator.onAppend(this.isSorted, this.containsNaN, nativeX, xValues, yValues);
            // Push metadata should be done before push x values
            this.appendMetadataRange(metadata, xValues.length);
            // New implementation passing array from JS
            this.doubleVectorProvider.appendArray(this.webAssemblyContext, nativeX, xValues);
            this.doubleVectorProvider.appendArray(this.webAssemblyContext, nativeY, yValues);
            this.doubleVectorProvider.appendArray(this.webAssemblyContext, nativeH, hValues);
            this.doubleVectorProvider.appendArray(this.webAssemblyContext, nativeL, lValues);
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Append, null, xValues.length);
        }
    };
    /**
     * Updates a single Y, H, L-value by X-index
     * @remarks Any changes of the DataSeries will trigger a redraw on the parent {@link SciChartSurface}
     * @param index the index to update
     * @param y The new Y value
     * @param h The new H value
     * @param l The new L value
     * @param metadata The point metadata
     */
    HlcDataSeries.prototype.update = function (index, y, h, l, metadata) {
        if (!this.getIsDeleted()) {
            this.validateIndex(index);
            this.dataDistributionCalculator.onUpdate(this.isSorted, this.containsNaN, undefined, undefined, [y], index);
            this.getNativeYValues().set(index, y);
            this.getNativeHighValues().set(index, h);
            this.getNativeLowValues().set(index, l);
            this.setMetadataAt(index, metadata);
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Update, index, 1);
        }
    };
    /**
     * Updates a single X, Y, H, L-value by X-index. Might also need to set isSorted = false
     * @remarks Any changes of the DataSeries will trigger a redraw on the parent {@link SciChartSurface}
     * @param index the index to update
     * @param x The new X value
     * @param y The new Y value
     * @param h The new H value
     * @param l The new L value
     * @param metadata The point metadata
     */
    HlcDataSeries.prototype.updateXyhl = function (index, x, y, h, l, metadata) {
        // TODO probably update method signature
        if (!this.getIsDeleted()) {
            this.validateIndex(index);
            var nativeX = this.getNativeXValues();
            this.dataDistributionCalculator.onUpdate(this.isSorted, this.containsNaN, nativeX, [x], [y], index);
            nativeX.set(index, x);
            this.getNativeYValues().set(index, y);
            this.getNativeHighValues().set(index, h);
            this.getNativeLowValues().set(index, l);
            this.setMetadataAt(index, metadata);
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Update, index, 1);
        }
    };
    /**
     * Inserts a single X,Y, H, L value at the start index
     * @remarks
     * For best performance on drawing large datasets, use the {@link insertRange} method
     *
     * Any changes of the DataSeries will trigger a redraw on the parent {@link SciChartSurface}
     * @param startIndex the index to insert at
     * @param x the XValue
     * @param y the YValue
     * @param h the HighValue
     * @param l the LowValue
     * @param metadata The point metadata
     */
    HlcDataSeries.prototype.insert = function (startIndex, x, y, h, l, metadata) {
        if (!this.getIsDeleted()) {
            this.validateIndex(startIndex, "Start index is out of range");
            this.throwIfFifo("insert");
            var nativeX = this.getNativeXValues();
            var nativeY = this.getNativeYValues();
            var nativeH = this.getNativeHighValues();
            var nativeL = this.getNativeLowValues();
            this.dataDistributionCalculator.onInsert(this.isSorted, this.containsNaN, nativeX, [x], [y], startIndex);
            nativeX.insertAt(startIndex, x);
            nativeY.insertAt(startIndex, y);
            nativeH.insertAt(startIndex, h);
            nativeL.insertAt(startIndex, l);
            this.insertMetadata(startIndex, metadata);
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Insert, startIndex, 1);
        }
    };
    /**
     * Inserts a range of X,Y, H, L values at the startIndex
     * @remarks
     * Any changes of the DataSeries will trigger a redraw on the parent {@link SciChartSurface}
     * @param startIndex the index to insert at
     * @param xValues the XValues
     * @param yValues the YValues
     * @param hValues the HValues
     * @param lValues the LValues
     * @param metadata The array of point metadata
     */
    HlcDataSeries.prototype.insertRange = function (startIndex, xValues, yValues, hValues, lValues, metadata) {
        if (!this.getIsDeleted()) {
            Guard_1.Guard.isTrue((0, NumberArray_1.isNumberArray)(xValues) || (0, NumberArray_1.isTypedArray)(xValues), "xValues must be an array of numbers");
            Guard_1.Guard.isTrue((0, NumberArray_1.isNumberArray)(yValues) || (0, NumberArray_1.isTypedArray)(yValues), "yValues must be an array of numbers");
            Guard_1.Guard.isTrue((0, NumberArray_1.isNumberArray)(hValues) || (0, NumberArray_1.isTypedArray)(hValues), "hValues must be an array of numbers");
            Guard_1.Guard.isTrue((0, NumberArray_1.isNumberArray)(lValues) || (0, NumberArray_1.isTypedArray)(lValues), "lValues must be an array of numbers");
            this.validateIndex(startIndex, "Start index is out of range");
            this.throwIfFifo("insertRange");
            Guard_1.Guard.arraysSameLengthArr([
                { arg: xValues, name: "xValues" },
                { arg: yValues, name: "yValues" },
                { arg: hValues, name: "hValues" },
                { arg: lValues, name: "lValues" }
            ]);
            if (metadata) {
                Guard_1.Guard.isTrue(Array.isArray(metadata), "metadata must be an array of IPointMetadata");
                Guard_1.Guard.arraysSameLength(xValues, "xValues", metadata, "metadata");
            }
            var nativeX = this.getNativeXValues();
            this.dataDistributionCalculator.onInsert(this.isSorted, this.containsNaN, nativeX, xValues, yValues, startIndex);
            (0, appendDoubleVectorFromJsArray_1.insertDoubleVectorFromJsArray)(this.webAssemblyContext, xValues, nativeX, startIndex);
            (0, appendDoubleVectorFromJsArray_1.insertDoubleVectorFromJsArray)(this.webAssemblyContext, yValues, this.getNativeYValues(), startIndex);
            (0, appendDoubleVectorFromJsArray_1.insertDoubleVectorFromJsArray)(this.webAssemblyContext, hValues, this.getNativeHighValues(), startIndex);
            (0, appendDoubleVectorFromJsArray_1.insertDoubleVectorFromJsArray)(this.webAssemblyContext, lValues, this.getNativeLowValues(), startIndex);
            this.insertMetadataRange(startIndex, metadata);
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Insert, startIndex, xValues.length);
        }
    };
    /**
     * Removes a single X,Y, H, L value at the specified index
     * @remarks Any changes of the DataSeries will trigger a redraw on the parent {@link SciChartSurface}
     * @param index the index to remove at
     */
    HlcDataSeries.prototype.removeAt = function (index) {
        if (!this.getIsDeleted()) {
            this.validateIndex(index);
            this.throwIfFifo("removeAt");
            this.getNativeXValues().removeAt(index);
            this.getNativeYValues().removeAt(index);
            this.getNativeHighValues().removeAt(index);
            this.getNativeLowValues().removeAt(index);
            this.removeMetadataAt(index);
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Remove, index, 1);
        }
    };
    /**
     * Removes a range of X, Y, H, L values at the specified index
     * @remarks Any changes of the DataSeries will trigger a redraw on the parent {@link SciChartSurface}
     * @param startIndex the start index to remove at
     * @param count the number of points to remove
     */
    HlcDataSeries.prototype.removeRange = function (startIndex, count) {
        if (!this.getIsDeleted()) {
            this.validateIndex(startIndex, "Start index is out of range");
            this.throwIfFifo("removeRange");
            this.getNativeXValues().removeRange(startIndex, count);
            this.getNativeYValues().removeRange(startIndex, count);
            this.getNativeHighValues().removeRange(startIndex, count);
            this.getNativeLowValues().removeRange(startIndex, count);
            this.removeMetadataRange(startIndex, count);
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Remove, startIndex, count);
        }
    };
    /**
     * Clears the entire DataSeries.
     * @remarks
     * Note this does not free memory, WebAssembly/Native memory is released by calling {@link delete}, after which the
     * DataSeries is no longer usable.
     *
     * Any changes of the DataSeries will trigger a redraw on the parent {@link SciChartSurface}
     */
    HlcDataSeries.prototype.clear = function () {
        if (!this.getIsDeleted()) {
            _super.prototype.clear.call(this);
            this.getNativeXValues().clear();
            this.getNativeYValues().clear();
            this.getNativeHighValues().clear();
            this.getNativeLowValues().clear();
            this.setMetadata(undefined);
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Clear, null, null);
        }
    };
    /** @inheritDoc */
    HlcDataSeries.prototype.getXRange = function (dataSeriesValueType, isHorizontalDirection, hasHighCap, hasLowCap) {
        var xValues = this.getXValues(dataSeriesValueType);
        var _a = this.getHlcValues(dataSeriesValueType), hValues = _a.hValues, lValues = _a.lValues;
        var temp;
        if (isHorizontalDirection) {
            if (this.count() === 1) {
                // TODO check if logic is valid here
                var minValues = hasLowCap ? lValues : xValues;
                var maxValues = hasHighCap ? hValues : xValues;
                var min = minValues.get(0) - 1;
                var max = maxValues.get(0) + 1;
                return new NumberRange_1.NumberRange(min, max);
            }
            else if (this.count() > 1) {
                var min = void 0;
                var max = void 0;
                var minMax = void 0;
                try {
                    // TODO probably can be optimized, make sure there are no memory leaks here
                    minMax = this.webAssemblyContext.NumberUtil.MinMax(hasLowCap ? this.getNativeLowValues() : this.getNativeXValues());
                    min = minMax.minD;
                    minMax = this.webAssemblyContext.NumberUtil.MinMax(hasHighCap ? this.getNativeHighValues() : this.getNativeXValues());
                    max = minMax.maxD;
                    if (!(0, isRealNumber_1.isRealNumber)(min) || !(0, isRealNumber_1.isRealNumber)(max)) {
                        return new NumberRange_1.NumberRange(0, 0);
                    }
                }
                finally {
                    (0, Deleter_1.deleteSafe)(minMax);
                }
                if (min === max) {
                    return new NumberRange_1.NumberRange(min - 1, max + 1);
                }
                else if (min > max) {
                    temp = min;
                    min = max;
                    max = temp;
                }
                return new NumberRange_1.NumberRange(min, max);
            }
        }
        else {
            if (this.count() === 1) {
                var min = xValues.get(0) - 1;
                var max = xValues.get(0) + 1;
                return new NumberRange_1.NumberRange(min, max);
            }
            else if (this.count() > 1) {
                var min = xValues.get(0);
                var max = xValues.get(this.count() - 1);
                if (!this.dataDistributionCalculator.isSortedAscending) {
                    var minMax = void 0;
                    try {
                        minMax = this.webAssemblyContext.NumberUtil.MinMax(this.getNativeXValues());
                        if (!(0, isRealNumber_1.isRealNumber)(minMax.minD) || !(0, isRealNumber_1.isRealNumber)(minMax.maxD)) {
                            return new NumberRange_1.NumberRange(0, 0);
                        }
                        min = minMax.minD;
                        max = minMax.maxD;
                    }
                    finally {
                        (0, Deleter_1.deleteSafe)(minMax);
                    }
                }
                if (min === max) {
                    return new NumberRange_1.NumberRange(min - 1, max + 1);
                }
                else if (min > max) {
                    temp = min;
                    min = max;
                    max = temp;
                }
                return new NumberRange_1.NumberRange(min, max);
            }
        }
        return new NumberRange_1.NumberRange(0, 0);
    };
    /** @inheritDoc */
    HlcDataSeries.prototype.getWindowedYRange = function (xRange, getPositiveRange, isXCategoryAxis, dataSeriesValueType, yRangeMode, isHorizontalDirection, hasHighCap, hasLowCap) {
        if (isXCategoryAxis === void 0) { isXCategoryAxis = false; }
        if (dataSeriesValueType === void 0) { dataSeriesValueType = IDataSeries_1.EDataSeriesValueType.Default; }
        if (yRangeMode === void 0) { yRangeMode = YRangeMode_1.EYRangeMode.Visible; }
        if (isHorizontalDirection === void 0) { isHorizontalDirection = false; }
        var _a = this.getHlcValues(dataSeriesValueType), hValues = _a.hValues, lValues = _a.lValues, yValues = _a.yValues;
        // TODO: getPositiveRange
        // if one point
        if (this.count() === 1 && !isHorizontalDirection) {
            if (isHorizontalDirection) {
                var y = yValues.get(0);
                return new NumberRange_1.NumberRange(y, y);
            }
            else {
                var min = Math.min(hValues.get(0), lValues.get(0));
                var max = Math.max(hValues.get(0), lValues.get(0));
                return new NumberRange_1.NumberRange(min, max);
            }
        }
        var indicesRange = isXCategoryAxis
            ? xRange
            : this.getIndicesRange(xRange, false, yRangeMode === YRangeMode_1.EYRangeMode.Visible ? SearchMode_1.ESearchMode.RoundUp : SearchMode_1.ESearchMode.RoundDown, yRangeMode === YRangeMode_1.EYRangeMode.Visible ? SearchMode_1.ESearchMode.RoundDown : SearchMode_1.ESearchMode.RoundUp);
        var yMin = Number.MAX_VALUE;
        var yMax = Number.MIN_VALUE;
        var iMin = Math.max(Math.floor(indicesRange.min), 0);
        var iMax = Math.min(Math.ceil(indicesRange.max), this.count() - 1);
        if (iMax < iMin) {
            return undefined;
        }
        // TODO handle log axis
        // TODO check for memory leaks
        if (isHorizontalDirection) {
            var minMax = void 0;
            try {
                minMax = this.webAssemblyContext.NumberUtil.MinMaxWithIndex(yValues, iMin, iMax - iMin + 1);
                if (!(0, isRealNumber_1.isRealNumber)(minMax.minD) || !(0, isRealNumber_1.isRealNumber)(minMax.maxD)) {
                    return undefined;
                }
                yMin = minMax.minD;
                yMax = minMax.maxD;
            }
            finally {
                (0, Deleter_1.deleteSafe)(minMax);
            }
        }
        else {
            var maxValues = hasHighCap ? hValues : yValues;
            var minValues = hasLowCap ? lValues : yValues;
            var minMax = void 0;
            try {
                minMax = this.webAssemblyContext.NumberUtil.MinMaxWithIndex(maxValues, iMin, iMax - iMin + 1);
                if (!(0, isRealNumber_1.isRealNumber)(minMax.minD) || !(0, isRealNumber_1.isRealNumber)(minMax.maxD)) {
                    return undefined;
                }
                yMax = minMax.maxD;
                minMax = this.webAssemblyContext.NumberUtil.MinMaxWithIndex(minValues, iMin, iMax - iMin + 1);
                if (!(0, isRealNumber_1.isRealNumber)(minMax.minD) || !(0, isRealNumber_1.isRealNumber)(minMax.maxD)) {
                    return undefined;
                }
                yMin = minMax.minD;
            }
            finally {
                (0, Deleter_1.deleteSafe)(minMax);
            }
        }
        return new NumberRange_1.NumberRange(yMin, yMax);
    };
    /** @inheritDoc */
    HlcDataSeries.prototype.delete = function () {
        this.highValues = (0, Deleter_1.deleteSafe)(this.highValues);
        this.lowValues = (0, Deleter_1.deleteSafe)(this.lowValues);
        this.hInitialAnimationValues = (0, Deleter_1.deleteSafe)(this.hInitialAnimationValues);
        this.hFinalAnimationValues = (0, Deleter_1.deleteSafe)(this.hFinalAnimationValues);
        this.lInitialAnimationValues = (0, Deleter_1.deleteSafe)(this.lInitialAnimationValues);
        this.lFinalAnimationValues = (0, Deleter_1.deleteSafe)(this.lFinalAnimationValues);
        _super.prototype.delete.call(this);
    };
    /** @inheritDoc */
    HlcDataSeries.prototype.createAnimationVectors = function () {
        _super.prototype.createAnimationVectors.call(this);
        this.lInitialAnimationValues = this.doubleVectorProvider.getDoubleVector(this.webAssemblyContext);
        this.lFinalAnimationValues = this.doubleVectorProvider.getDoubleVector(this.webAssemblyContext);
        this.hInitialAnimationValues = this.doubleVectorProvider.getDoubleVector(this.webAssemblyContext);
        this.hFinalAnimationValues = this.doubleVectorProvider.getDoubleVector(this.webAssemblyContext);
    };
    /** @inheritDoc */
    HlcDataSeries.prototype.setInitialAnimationVectors = function (dataSeries) {
        _super.prototype.setInitialAnimationVectors.call(this, dataSeries);
        if (!dataSeries) {
            this.hInitialAnimationValues.resize(0, 0);
            this.lInitialAnimationValues.resize(0, 0);
            return;
        }
        (0, copyVector_1.copyDoubleVector)(dataSeries.getNativeHighValues(), this.hInitialAnimationValues, this.webAssemblyContext);
        (0, copyVector_1.copyDoubleVector)(dataSeries.getNativeLowValues(), this.lInitialAnimationValues, this.webAssemblyContext);
    };
    /** @inheritDoc */
    HlcDataSeries.prototype.setFinalAnimationVectors = function (dataSeries) {
        _super.prototype.setFinalAnimationVectors.call(this, dataSeries);
        if (!dataSeries) {
            this.hFinalAnimationValues.resize(0, 0);
            this.lFinalAnimationValues.resize(0, 0);
            return;
        }
        (0, copyVector_1.copyDoubleVector)(dataSeries.getNativeHighValues(), this.hFinalAnimationValues, this.webAssemblyContext);
        (0, copyVector_1.copyDoubleVector)(dataSeries.getNativeLowValues(), this.lFinalAnimationValues, this.webAssemblyContext);
    };
    /** @inheritDoc */
    HlcDataSeries.prototype.validateAnimationVectors = function () {
        _super.prototype.validateAnimationVectors.call(this);
        var size = this.xInitialAnimationValues.size();
        if (size !== this.hInitialAnimationValues.size() ||
            size !== this.hFinalAnimationValues.size() ||
            size !== this.lInitialAnimationValues.size() ||
            size !== this.lFinalAnimationValues.size()) {
            throw Error("initialAnimationValues and finalAnimationValues must have the same length");
        }
    };
    /** @inheritDoc */
    HlcDataSeries.prototype.updateAnimationProperties = function (progress, animation) {
        _super.prototype.updateAnimationProperties.call(this, progress, animation);
        if (animation.isOnStartAnimation) {
            animation.calculateAnimationValues(this.webAssemblyContext, this.hFinalAnimationValues, this.getNativeHighValues(), progress);
            animation.calculateAnimationValues(this.webAssemblyContext, this.lFinalAnimationValues, this.getNativeLowValues(), progress);
        }
        else if (animation.isDataSeriesAnimation) {
            animation.calculateDataSeriesAnimationValues(this.webAssemblyContext, this.hInitialAnimationValues, this.hFinalAnimationValues, this.getNativeHighValues(), progress);
            animation.calculateDataSeriesAnimationValues(this.webAssemblyContext, this.lInitialAnimationValues, this.lFinalAnimationValues, this.getNativeLowValues(), progress);
        }
    };
    /** @inheritDoc */
    HlcDataSeries.prototype.getOptions = function (excludeData) {
        if (excludeData === void 0) { excludeData = false; }
        var json = _super.prototype.getOptions.call(this, excludeData);
        if (!excludeData) {
            var dataSize = this.count();
            var xValues = new Array(dataSize);
            var yValues = new Array(dataSize);
            var highValues = new Array(dataSize);
            var lowValues = new Array(dataSize);
            if (this.fifoCapacity && this.fifoSweeping) {
                for (var i = 0; i < dataSize; i++) {
                    xValues[i] = this.xValues.getRaw(i);
                    yValues[i] = this.yValues.getRaw(i);
                    highValues[i] = this.highValues.getRaw(i);
                    lowValues[i] = this.lowValues.getRaw(i);
                }
            }
            else {
                for (var i = 0; i < dataSize; i++) {
                    xValues[i] = this.xValues.get(i);
                    yValues[i] = this.yValues.get(i);
                    highValues[i] = this.highValues.get(i);
                    lowValues[i] = this.lowValues.get(i);
                }
            }
            var options = {
                xValues: xValues,
                yValues: yValues,
                highValues: highValues,
                lowValues: lowValues
            };
            Object.assign(json, options);
        }
        return json;
    };
    HlcDataSeries.prototype.reserve = function (size) {
        _super.prototype.reserve.call(this, size);
        this.highValues.reserve(size);
        this.lowValues.reserve(size);
    };
    HlcDataSeries.prototype.getHlcValues = function (dataSeriesValueType) {
        var hValues;
        var lValues;
        var yValues;
        switch (dataSeriesValueType) {
            case IDataSeries_1.EDataSeriesValueType.FinalAnimationValues:
                hValues = this.hFinalAnimationValues;
                lValues = this.lFinalAnimationValues;
                yValues = this.yFinalAnimationValues;
                break;
            case IDataSeries_1.EDataSeriesValueType.InitialAnimationValues:
                hValues = this.hInitialAnimationValues;
                lValues = this.lInitialAnimationValues;
                yValues = this.yInitialAnimationValues;
                break;
            default:
                hValues = this.highValues;
                lValues = this.lowValues;
                yValues = this.yValues;
        }
        return { hValues: hValues, lValues: lValues, yValues: yValues };
    };
    return HlcDataSeries;
}(BaseDataSeries_1.BaseDataSeries));
exports.HlcDataSeries = HlcDataSeries;
