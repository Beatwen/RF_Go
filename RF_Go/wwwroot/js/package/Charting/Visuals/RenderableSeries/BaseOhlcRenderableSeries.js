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
exports.BaseOhlcRenderableSeries = void 0;
var Deleter_1 = require("../../../Core/Deleter");
var NumberRange_1 = require("../../../Core/NumberRange");
var DataPointWidthMode_1 = require("../../../types/DataPointWidthMode");
var BaseDataSeries_1 = require("../../Model/BaseDataSeries");
var IDataSeries_1 = require("../../Model/IDataSeries");
var OhlcDataSeries_1 = require("../../Model/OhlcDataSeries");
var OhlcPointSeriesResampled_1 = require("../../Model/PointSeries/OhlcPointSeriesResampled");
var OhlcPointSeriesWrapped_1 = require("../../Model/PointSeries/OhlcPointSeriesWrapped");
var XyyPointSeriesResampled_1 = require("../../Model/PointSeries/XyyPointSeriesResampled");
var ResamplingMode_1 = require("../../Numerics/Resamplers/ResamplingMode");
var IThemeProvider_1 = require("../../Themes/IThemeProvider");
var SciChartSurfaceBase_1 = require("../SciChartSurfaceBase");
var BaseRenderableSeries_1 = require("./BaseRenderableSeries");
var constants_1 = require("./constants");
var OhlcSeriesHitTestProvider_1 = require("./HitTest/OhlcSeriesHitTestProvider");
var BaseOhlcRenderableSeries = /** @class */ (function (_super) {
    __extends(BaseOhlcRenderableSeries, _super);
    function BaseOhlcRenderableSeries(webAssemblyContext, options) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        _this = _super.call(this, webAssemblyContext, options) || this;
        _this.dataPointWidthModeProperty = DataPointWidthMode_1.EDataPointWidthMode.Relative;
        _this.strokeUp = (_a = options === null || options === void 0 ? void 0 : options.strokeUp) !== null && _a !== void 0 ? _a : SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME.upWickColor;
        _this.strokeDown = (_b = options === null || options === void 0 ? void 0 : options.strokeDown) !== null && _b !== void 0 ? _b : SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME.downWickColor;
        _this.dataPointWidth = (_c = options === null || options === void 0 ? void 0 : options.dataPointWidth) !== null && _c !== void 0 ? _c : 0.5;
        _this.dataPointWidthMode = (_d = options === null || options === void 0 ? void 0 : options.dataPointWidthMode) !== null && _d !== void 0 ? _d : _this.dataPointWidthModeProperty;
        _this.strokeThickness = (_e = options === null || options === void 0 ? void 0 : options.strokeThickness) !== null && _e !== void 0 ? _e : 1;
        if (options === null || options === void 0 ? void 0 : options.animation) {
            _this.animationQueue.push(options.animation);
        }
        return _this;
    }
    /** @inheritDoc */
    BaseOhlcRenderableSeries.prototype.applyTheme = function (themeProvider) {
        _super.prototype.applyTheme.call(this, themeProvider);
        var previousThemeProvider = this.parentSurface.previousThemeProvider;
        if (this.stroke === previousThemeProvider.lineSeriesColor) {
            this.stroke = themeProvider.lineSeriesColor;
        }
        if (this.strokeUp === previousThemeProvider.upWickColor) {
            this.strokeUp = themeProvider.upWickColor;
        }
        if (this.strokeDown === previousThemeProvider.downWickColor) {
            this.strokeDown = themeProvider.downWickColor;
        }
    };
    Object.defineProperty(BaseOhlcRenderableSeries.prototype, "strokeUp", {
        /**
         * Gets or sets the stoke when candlestick close is greater than open, as an HTML color code
         */
        get: function () {
            return (0, IThemeProvider_1.stripAutoColor)(this.strokeUpProperty);
        },
        /**
         * Gets or sets the stoke when candlestick close is greater than open, as an HTML color code
         */
        set: function (htmlColorCode) {
            this.strokeUpProperty = htmlColorCode;
            this.notifyPropertyChanged(constants_1.PROPERTY.STROKE_UP);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseOhlcRenderableSeries.prototype, "strokeDown", {
        /**
         * Gets or sets the stoke when candlestick close is less than open, as an HTML color code
         */
        get: function () {
            return (0, IThemeProvider_1.stripAutoColor)(this.strokeDownProperty);
        },
        /**
         * Gets or sets the stoke when candlestick close is less than open, as an HTML color code
         */
        set: function (htmlColorCode) {
            this.strokeDownProperty = htmlColorCode;
            this.notifyPropertyChanged(constants_1.PROPERTY.STROKE_DOWN);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseOhlcRenderableSeries.prototype, "dataPointWidth", {
        /**
         * Gets or sets the width of candles as a fraction of available space. Valid values range from 0.0 - 1.0
         */
        get: function () {
            return this.dataPointWidthProperty;
        },
        /**
         * Gets or sets the width of candles as a fraction of available space. Valid values range from 0.0 - 1.0
         */
        set: function (value) {
            this.dataPointWidthProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.DATA_POINT_WIDTH);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseOhlcRenderableSeries.prototype, "dataPointWidthMode", {
        /**
         * Gets or sets the mode which determines how dataPointWidth is interpreted. Available values are {@link EDataPointWidthMode}.  Default Relative.
         */
        get: function () {
            return this.dataPointWidthModeProperty;
        },
        /**
         * Gets or sets the mode which determines how dataPointWidth is interpreted. Available values are {@link EDataPointWidthMode}.  Default Relative.
         */
        set: function (value) {
            this.dataPointWidthModeProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.DATA_POINT_WIDTH_MODE);
        },
        enumerable: false,
        configurable: true
    });
    /** @inheritDoc */
    BaseOhlcRenderableSeries.prototype.notifyPropertyChanged = function (propertyName) {
        _super.prototype.notifyPropertyChanged.call(this, propertyName);
        if (propertyName === constants_1.PROPERTY.DATA_SERIES) {
            if (this.dataSeries !== undefined && this.dataSeries.type !== IDataSeries_1.EDataSeriesType.Ohlc) {
                throw new Error("DataSeries for Candlestick or Ohlc series must be type OhlcDataSeries");
            }
        }
    };
    /** @inheritDoc */
    BaseOhlcRenderableSeries.prototype.getXRange = function () {
        var range = _super.prototype.getXRange.call(this);
        var count = this.dataSeries.count();
        var halfWidth = this.dataPointWidth / 2;
        if (this.dataPointWidthMode === DataPointWidthMode_1.EDataPointWidthMode.Relative) {
            if (count > 1) {
                halfWidth = (range.diff / (count - 1)) * halfWidth;
            }
            else {
                halfWidth = 0;
            }
        }
        if (this.dataPointWidthMode === DataPointWidthMode_1.EDataPointWidthMode.Absolute) {
            var cc = this.xAxis.getCurrentCoordinateCalculator();
            var dataWidth = cc.getDataValue(this.dataPointWidth) - cc.getDataValue(0);
            halfWidth = dataWidth / 2;
        }
        return new NumberRange_1.NumberRange(range.min - halfWidth, range.max + halfWidth);
    };
    /** @inheritDoc */
    BaseOhlcRenderableSeries.prototype.delete = function () {
        this.resamplerHelper = (0, Deleter_1.deleteSafe)(this.resamplerHelper);
        this.xyyTempPointSeries = (0, Deleter_1.deleteSafe)(this.xyyTempPointSeries);
        this.pointSeries = (0, Deleter_1.deleteSafe)(this.pointSeries);
        _super.prototype.delete.call(this);
    };
    /**
     * Returns the {@link IDataSeries.getNativeOpenValues} for the associated {@link dataSeries}
     */
    BaseOhlcRenderableSeries.prototype.getNativeOpenValues = function () {
        return this.dataSeries.getNativeOpenValues();
    };
    /**
     * Returns the {@link IDataSeries.getNativeHighValues} for the associated {@link dataSeries}
     */
    BaseOhlcRenderableSeries.prototype.getNativeHighValues = function () {
        return this.dataSeries.getNativeHighValues();
    };
    /**
     * Returns the {@link IDataSeries.getNativeLowValues} for the associated {@link dataSeries}
     */
    BaseOhlcRenderableSeries.prototype.getNativeLowValues = function () {
        return this.dataSeries.getNativeLowValues();
    };
    /**
     * Returns the {@link IDataSeries.getNativeCloseValues} for the associated {@link dataSeries}
     */
    BaseOhlcRenderableSeries.prototype.getNativeCloseValues = function () {
        return this.dataSeries.getNativeYValues();
    };
    /** @inheritDoc */
    BaseOhlcRenderableSeries.prototype.resolveAutoColors = function (index, maxSeries, theme) {
        if (this.strokeUpProperty.startsWith(IThemeProvider_1.AUTO_COLOR)) {
            var color = theme.getStrokeColor(index, maxSeries, this.webAssemblyContext);
            this.strokeUp = IThemeProvider_1.AUTO_COLOR + this.adjustAutoColor("strokeUp", color);
        }
        var y1Index = (index + Math.floor(maxSeries / 2)) % maxSeries;
        if (this.strokeDownProperty.startsWith(IThemeProvider_1.AUTO_COLOR)) {
            var color = theme.getStrokeColor(y1Index, maxSeries, this.webAssemblyContext);
            this.strokeDown = IThemeProvider_1.AUTO_COLOR + this.adjustAutoColor("strokeDown", color);
        }
    };
    BaseOhlcRenderableSeries.prototype.toJSON = function (excludeData) {
        if (excludeData === void 0) { excludeData = false; }
        var json = _super.prototype.toJSON.call(this, excludeData);
        var options = {
            dataPointWidth: this.dataPointWidth,
            dataPointWidthMode: this.dataPointWidthMode,
            strokeDown: this.strokeDown,
            strokeUp: this.strokeUp
        };
        Object.assign(json.options, options);
        return json;
    };
    BaseOhlcRenderableSeries.prototype.getYRange = function (xVisibleRange, isXCategoryAxis) {
        if (isXCategoryAxis === void 0) { isXCategoryAxis = false; }
        var dataSeriesValueType = this.isRunningDataAnimation
            ? IDataSeries_1.EDataSeriesValueType.FinalAnimationValues
            : IDataSeries_1.EDataSeriesValueType.Default;
        // We can't just check and use this.pointSeries because it may be filled, but out of date.
        var pointSeries = this.getResampledPointSeries(isXCategoryAxis);
        // if there is a transform as well, it will run off this.pointSeries
        if (this.renderDataTransform && this.renderDataTransform.useForYRange) {
            this.updateTransformedValues(dataSeriesValueType);
            return (0, BaseDataSeries_1.getWindowedYRange)(this.webAssemblyContext, this.transformedRenderPassData.pointSeries.xValues, this.transformedRenderPassData.pointSeries.yValues, pointSeries ? new NumberRange_1.NumberRange(0, pointSeries.count - 1) : xVisibleRange, true, isXCategoryAxis, this.dataSeries.dataDistributionCalculator.isSortedAscending);
        }
        // Use resampled data for autoRange if possible
        if (pointSeries) {
            var _a = pointSeries, openValues = _a.openValues, closeValues = _a.closeValues, highValues = _a.highValues, lowValues = _a.lowValues;
            var indicesRange = new NumberRange_1.NumberRange(0, pointSeries.count - 1);
            return (0, OhlcDataSeries_1.getOHLCYRange)(indicesRange, openValues, highValues, lowValues, closeValues);
        }
        return this.dataSeries.getWindowedYRange(xVisibleRange, true, isXCategoryAxis, dataSeriesValueType, this.yRangeMode);
    };
    /** @inheritDoc */
    BaseOhlcRenderableSeries.prototype.toPointSeries = function (rp) {
        if (rp) {
            if (!this.xyyTempPointSeries) {
                this.xyyTempPointSeries = new XyyPointSeriesResampled_1.XyyPointSeriesResampled(this.webAssemblyContext, rp.xVisibleRange);
            }
            else {
                this.xyyTempPointSeries.xRange = rp.xVisibleRange;
            }
            if (!this.pointSeries) {
                this.pointSeries = new OhlcPointSeriesResampled_1.OhlcPointSeriesResampled(this.webAssemblyContext, rp.xVisibleRange);
            }
            else {
                this.pointSeries.xRange = rp.xVisibleRange;
            }
            var ps = this.pointSeries;
            var ds = this.dataSeries;
            var xValues = ds.getNativeXValues();
            var openValues = ds.getNativeOpenValues();
            var highValues = ds.getNativeHighValues();
            var lowValues = ds.getNativeLowValues();
            var closeValues = ds.getNativeCloseValues();
            var originalIndexes = ds.getNativeIndexes();
            // 1) calc ps.highValues
            var rpHigh = rp.clone({
                resamplingMode: rp.resamplingMode === ResamplingMode_1.EResamplingMode.None ? ResamplingMode_1.EResamplingMode.None : ResamplingMode_1.EResamplingMode.Max
            });
            var result = this.resamplerHelper.resampleIntoPointSeries(this.webAssemblyContext, rpHigh, xValues, highValues, this.xyyTempPointSeries.intIndexes, // don't care
            undefined, this.xyyTempPointSeries.xValues, // don't care
            ps.highValues);
            this.pointSeries.fifoStartIndex = result.OutputSplitIndex;
            // console.log("high count ", ps.highValues.size());
            this.xyyTempPointSeries.clearIntIndexes();
            // 2) calc ps.lowValues
            var rpLow = rp.clone({
                resamplingMode: rp.resamplingMode === ResamplingMode_1.EResamplingMode.None ? ResamplingMode_1.EResamplingMode.None : ResamplingMode_1.EResamplingMode.Min
            });
            this.resamplerHelper.resampleIntoPointSeries(this.webAssemblyContext, rpLow, xValues, lowValues, this.xyyTempPointSeries.intIndexes, // don't care
            undefined, this.xyyTempPointSeries.xValues, ps.lowValues);
            // console.log("low count ", ps.lowValues.size());
            // We don't want the indexes for high/low
            this.xyyTempPointSeries.clearIntIndexes();
            this.xyyTempPointSeries.y1Values.clear();
            // 3) Get batch indexes
            // Resample indexes to get start and end of batch
            var rpOpenClose = rp.clone({
                resamplingMode: rp.resamplingMode === ResamplingMode_1.EResamplingMode.None ? ResamplingMode_1.EResamplingMode.None : ResamplingMode_1.EResamplingMode.Min
            });
            this.resamplerHelper.resampleIntoPointSeries(this.webAssemblyContext, rpOpenClose, xValues, originalIndexes, ps.intIndexes, undefined, this.xyyTempPointSeries.xValues, // don't care
            this.xyyTempPointSeries.y1Values // don't care
            );
            var openCloseSize = ps.intIndexes.size();
            this.xyyTempPointSeries.y1Values.clear();
            // 4) calc ps.openValues, ps.closeValues
            // console.log("open/close count ", openCloseSize);
            // indexes 0, 1, 2, 3, 4, 5, 6, 7
            // opens   3, 4, 7, 8, 3, 5, 9, 6
            // closes  8, 3, 5, 9, 6, 3
            // batch 0, 3, 6
            // batch 0 - open 3 (index 0), close 8 (index 2)
            var lastIndexOfFirstBatch = ps.intIndexes.get(3) - ps.intIndexes.get(2) - 1;
            // console.log(
            //     "indexes ",
            //     ps.intIndexes.get(0),
            //     ps.intIndexes.get(1),
            //     ps.intIndexes.get(2),
            //     ps.intIndexes.get(3),
            //     ps.intIndexes.get(4),
            //     ps.intIndexes.get(5),
            //     ps.intIndexes.get(6)
            // );
            // console.log(
            //     "x values ",
            //     xValues.get(0),
            //     xValues.get(1),
            //     xValues.get(2),
            //     xValues.get(3),
            //     xValues.get(4),
            //     xValues.get(5),
            //     xValues.get(6)
            // );
            // console.log("Max index", rp.indexesRange.max);
            // const batchWidth = rp.xVisibleRange.diff / rp.viewportRect.width;
            // console.log(
            //     "Batch width ",
            //     batchWidth,
            //     Math.floor(Math.log2(batchWidth)),
            //     Math.pow(2, Math.floor(Math.log2(batchWidth)))
            // );
            // console.log("X Spacing ", rp.xVisibleRange.diff / rp.indexesRange.max);
            // console.log("original points / resampled points ", xValues.size() / openCloseSize);
            // console.log("lastIndexOfFirstBatch ", lastIndexOfFirstBatch);
            ps.indexes.resizeFast(openCloseSize + 1);
            // Get values by indexes for Open values
            this.resamplerHelper.copyValuesByIndexes(ps.intIndexes, xValues, openValues, closeValues, openCloseSize, rp.isCategoryAxis, this.dataSeries.fifoSweeping, ps.indexes, ps.xValues, ps.openValues, ps.closeValues, lastIndexOfFirstBatch);
            // Last close value is handled in c++;
            // This is now done in the copy step above
            //ps.updateIndexes();
            ps.clearIntIndexes();
            // ps.debugOutputForUnitTests();
            return ps;
        }
        else {
            return new OhlcPointSeriesWrapped_1.OhlcPointSeriesWrapped(this.dataSeries);
        }
    };
    /** @inheritDoc */
    BaseOhlcRenderableSeries.prototype.newHitTestProvider = function () {
        return new OhlcSeriesHitTestProvider_1.OhlcSeriesHitTestProvider(this, this.webAssemblyContext);
    };
    return BaseOhlcRenderableSeries;
}(BaseRenderableSeries_1.BaseRenderableSeries));
exports.BaseOhlcRenderableSeries = BaseOhlcRenderableSeries;
