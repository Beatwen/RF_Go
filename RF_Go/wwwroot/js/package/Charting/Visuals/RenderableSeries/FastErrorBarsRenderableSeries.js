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
exports.adjustRangeByStrokeThickness = exports.FastErrorBarsRenderableSeries = void 0;
var Deleter_1 = require("../../../Core/Deleter");
var NumberRange_1 = require("../../../Core/NumberRange");
var AxisType_1 = require("../../../types/AxisType");
var DataPointWidthMode_1 = require("../../../types/DataPointWidthMode");
var ErrorDirection_1 = require("../../../types/ErrorDirection");
var ErrorMode_1 = require("../../../types/ErrorMode");
var SeriesType_1 = require("../../../types/SeriesType");
var IDataSeries_1 = require("../../Model/IDataSeries");
var HlcPointSeriesWrapped_1 = require("../../Model/PointSeries/HlcPointSeriesWrapped");
var BaseRenderableSeries_1 = require("./BaseRenderableSeries");
var constants_1 = require("./constants");
var ErrorSeriesDrawingProvider_1 = require("./DrawingProviders/ErrorSeriesDrawingProvider");
var PointMarkerDrawingProvider_1 = require("./DrawingProviders/PointMarkerDrawingProvider");
var ErrorSeriesHitTestProvider_1 = require("./HitTest/ErrorSeriesHitTestProvider");
/**
 * Defines an Error Bars Series or Error Bars chart type in the SciChart's High Performance Real-time
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}
 * @remarks
 * To add a line series to a {@link SciChartSurface} you need to declare both the {@link FastErrorBarsRenderableSeries | RenderableSeries}
 * and a {@link HlcDataSeries | DataSeries}. Simplified code sample below:
 *
 * ```ts
 * const sciChartSurface: SciChartSurface;
 * const wasmContext: TSciChart;
 * // Create and fill the dataseries
 * const dataSeries = new HlcDataSeries(wasmContext);
 * dataSeries.append(1, 2, 0,4, 0.5);
 * dataSeries.append(2, 3, 0,2, 0.3);
 * // Create the renderableSeries
 * const errorSeries = new FastErrorBarsRenderableSeries(wasmContext);
 * errorSeries.dataSeries = dataSeries;
 * // append to the SciChartSurface
 * sciChartSurface.renderableSeries.add(errorSeries);
 * ```
 */
var FastErrorBarsRenderableSeries = /** @class */ (function (_super) {
    __extends(FastErrorBarsRenderableSeries, _super);
    /**
     * Creates an instance of the {@link FastErrorBarsRenderableSeries}
     * @param webAssemblyContext The {@link TSciChart | SciChart WebAssembly Context} containing
     * native methods and access to our WebGL2 WebAssembly Drawing Engine
     * @param options optional parameters of type {@link IFastErrorBarsRenderableSeriesOptions} applied when constructing the series type
     */
    function FastErrorBarsRenderableSeries(webAssemblyContext, options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        _this = _super.call(this, webAssemblyContext, options) || this;
        _this.type = SeriesType_1.ESeriesType.ErrorBarsSeries;
        _this.dataPointWidthProperty = 0.5;
        _this.dataPointWidthModeProperty = DataPointWidthMode_1.EDataPointWidthMode.Relative;
        _this.errorModeProperty = ErrorMode_1.EErrorMode.Both;
        _this.errorDirectionProperty = ErrorDirection_1.EErrorDirection.Vertical;
        _this.strokeDashArrayProperty = [];
        _this.drawWhiskersProperty = true;
        _this.drawConnectorProperty = true;
        _this.dataPointWidth = (_a = options === null || options === void 0 ? void 0 : options.dataPointWidth) !== null && _a !== void 0 ? _a : _this.dataPointWidthProperty;
        _this.errorModeProperty = (_b = options === null || options === void 0 ? void 0 : options.errorMode) !== null && _b !== void 0 ? _b : _this.errorModeProperty;
        _this.errorDirectionProperty = (_c = options === null || options === void 0 ? void 0 : options.errorDirection) !== null && _c !== void 0 ? _c : _this.errorDirectionProperty;
        _this.dataPointWidthMode = (_d = options === null || options === void 0 ? void 0 : options.dataPointWidthMode) !== null && _d !== void 0 ? _d : _this.dataPointWidthModeProperty;
        _this.strokeDashArray = (_e = options === null || options === void 0 ? void 0 : options.strokeDashArray) !== null && _e !== void 0 ? _e : _this.strokeDashArrayProperty;
        _this.drawWhiskers = (_f = options === null || options === void 0 ? void 0 : options.drawWhiskers) !== null && _f !== void 0 ? _f : _this.drawWhiskersProperty;
        _this.drawConnector = (_g = options === null || options === void 0 ? void 0 : options.drawConnector) !== null && _g !== void 0 ? _g : _this.drawConnectorProperty;
        // delete inherited drawing providers
        _this.drawingProviders = [
            new ErrorSeriesDrawingProvider_1.ErrorSeriesDrawingProvider(webAssemblyContext, _this),
            new PointMarkerDrawingProvider_1.PointMarkerDrawingProvider(webAssemblyContext, _this)
        ];
        // Must be called here for the series type to be available
        if ((_h = _this.paletteProvider) === null || _h === void 0 ? void 0 : _h.onAttached) {
            (_j = _this.paletteProvider) === null || _j === void 0 ? void 0 : _j.onAttached(_this);
        }
        if (options === null || options === void 0 ? void 0 : options.animation) {
            _this.animationQueue.push(options.animation);
        }
        return _this;
    }
    /** @inheritDoc */
    FastErrorBarsRenderableSeries.prototype.applyTheme = function (themeProvider) {
        _super.prototype.applyTheme.call(this, themeProvider);
        var previousThemeProvider = this.parentSurface.previousThemeProvider;
        if (this.stroke === previousThemeProvider.lineSeriesColor) {
            this.stroke = themeProvider.lineSeriesColor;
        }
    };
    Object.defineProperty(FastErrorBarsRenderableSeries.prototype, "strokeDashArray", {
        /**
         * The StrokeDashArray defines the stroke or dash pattern for the line.
         * Accepts an array of values, e.g. [2,2] will have a line of length 2 and a gap of length 2.
         */
        get: function () {
            return this.strokeDashArrayProperty;
        },
        /**
         * The StrokeDashArray defines the stroke or dash pattern for the line.
         * Accepts an array of values, e.g. [2,2] will have a line of length 2 and a gap of length 2.
         */
        set: function (strokeDashArray) {
            this.strokeDashArrayProperty = strokeDashArray;
            this.notifyPropertyChanged(constants_1.PROPERTY.STROKE_DASH_ARRAY);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FastErrorBarsRenderableSeries.prototype, "drawWhiskers", {
        /**
         * Gets or sets whether Error Bars should be drawn with whiskers
         * @remarks enabled by default
         */
        get: function () {
            return this.drawWhiskersProperty;
        },
        /**
         * Gets or sets whether Error Bars should be drawn with whiskers
         * @remarks enabled by default
         */
        set: function (value) {
            this.drawWhiskersProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.DRAW_WHISKERS);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FastErrorBarsRenderableSeries.prototype, "drawConnector", {
        /**
         * Gets or sets whether Error Bars should be drawn with a connector
         * @remarks enabled by default
         */
        get: function () {
            return this.drawConnectorProperty;
        },
        /**
         * Gets or sets whether Error Bars should be drawn with a connector
         * @remarks enabled by default
         */
        set: function (value) {
            this.drawConnectorProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.DRAW_CONNECTOR);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FastErrorBarsRenderableSeries.prototype, "paletteProvider", {
        /**
         * Gets or sets the paletteProvider of Renderable Series
         * @remarks paletteProvider is not supported by {@link FastErrorBarsRenderableSeries}
         */
        get: function () {
            // TODO implement paletting for FastErrorBarsRenderableSeries
            return undefined;
        },
        set: function (paletteProvider) {
            throw new Error("paletteProvider is not supported by FastErrorBarsRenderableSeries!");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FastErrorBarsRenderableSeries.prototype, "dataPointWidth", {
        /**
         * Gets or sets the width of error bar caps.
         * By default the value is treated as relative, valid values range from 0.0 - 1.0.
         * @remarks
         * To specify if the value should be treated as relative or absolute use {@link errorType}
         */
        get: function () {
            return this.dataPointWidthProperty;
        },
        /**
         * Gets or sets the width of error bar caps.
         * By default the value is treated as relative, valid values range from 0.0 - 1.0.
         * @remarks
         * To specify if the value should be treated as relative or absolute use {@link dataPointWidthMode}
         */
        set: function (value) {
            this.dataPointWidthProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.DATA_POINT_WIDTH);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FastErrorBarsRenderableSeries.prototype, "errorMode", {
        /**
         * Gets or sets the errorMode of Error Bars. Available values are {@link EErrorMode}
         */
        get: function () {
            return this.errorModeProperty;
        },
        /**
         * Gets or sets the errorMode of Error Bars. Available values are {@link EErrorMode}
         */
        set: function (value) {
            this.errorModeProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.ERROR_MODE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FastErrorBarsRenderableSeries.prototype, "errorDirection", {
        /**
         * Gets or sets the errorDirection of Error Bars. Available values are {@link EErrorDirection}
         */
        get: function () {
            return this.errorDirectionProperty;
        },
        /**
         * Gets or sets the errorDirection of Error Bars. Available values are {@link EErrorDirection}
         */
        set: function (value) {
            this.errorDirectionProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.ERROR_DIRECTION);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FastErrorBarsRenderableSeries.prototype, "dataPointWidthMode", {
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
    FastErrorBarsRenderableSeries.prototype.delete = function () {
        _super.prototype.delete.call(this);
        this.pointSeries = (0, Deleter_1.deleteSafe)(this.pointSeries);
    };
    /**
     *  @inheritDoc
     */
    FastErrorBarsRenderableSeries.prototype.getDataPointWidth = function (coordCalc, widthFraction, widthMode) {
        var isVerticalDirection = this.errorDirection === ErrorDirection_1.EErrorDirection.Vertical;
        var values = isVerticalDirection ? this.dataSeries.getNativeXValues() : this.dataSeries.getNativeYValues();
        var seriesViewRectWidth = coordCalc.viewportDimension;
        var isCategoryAxis = coordCalc.isCategoryCoordinateCalculator;
        if (widthMode === DataPointWidthMode_1.EDataPointWidthMode.Range) {
            var range = coordCalc.visibleMax - coordCalc.visibleMin;
            // This treats dataPointWidth as "xRange per column"
            return (coordCalc.viewportDimension / range) * widthFraction;
        }
        else if (widthMode === DataPointWidthMode_1.EDataPointWidthMode.Absolute) {
            return widthFraction;
        }
        else {
            // Relative
            return (0, BaseRenderableSeries_1.getDataPointWidth)(values, coordCalc, seriesViewRectWidth, widthFraction, isCategoryAxis, this.webAssemblyContext);
        }
    };
    /**
     * @inheritDoc
     */
    FastErrorBarsRenderableSeries.prototype.getXRange = function () {
        var _a;
        var isVerticalDirection = this.errorDirection === ErrorDirection_1.EErrorDirection.Vertical;
        var hasHighCap = this.errorMode !== ErrorMode_1.EErrorMode.Low;
        var hasLowCap = this.errorMode !== ErrorMode_1.EErrorMode.High;
        var range = this.dataSeries.getXRange(IDataSeries_1.EDataSeriesValueType.Default, !isVerticalDirection, hasHighCap, hasLowCap);
        // correct range by dataPointWidthMode
        if (this.xAxis.type === AxisType_1.EAxisType.LogarithmicAxis)
            return range;
        else
            return isVerticalDirection
                ? this.adjustRangeByDataPointWidth(range, this.xAxis)
                : (0, exports.adjustRangeByStrokeThickness)(range, this.strokeThickness, (_a = this.parentSurface.seriesViewRect) === null || _a === void 0 ? void 0 : _a.width);
    };
    /** @inheritDoc */
    FastErrorBarsRenderableSeries.prototype.getYRange = function (xVisibleRange, isXCategoryAxis) {
        var _a;
        if (isXCategoryAxis === void 0) { isXCategoryAxis = false; }
        var isHorizontalDirection = this.errorDirection === ErrorDirection_1.EErrorDirection.Horizontal;
        var hasHighCap = this.errorMode !== ErrorMode_1.EErrorMode.Low;
        var hasLowCap = this.errorMode !== ErrorMode_1.EErrorMode.High;
        var dataSeriesValueType = this.isRunningDataAnimation
            ? IDataSeries_1.EDataSeriesValueType.FinalAnimationValues
            : IDataSeries_1.EDataSeriesValueType.Default;
        var range = this.dataSeries.getWindowedYRange(xVisibleRange, true, isXCategoryAxis, dataSeriesValueType, this.yRangeMode, isHorizontalDirection, hasHighCap, hasLowCap);
        if (range === undefined)
            return undefined;
        // Not sure how to adjust this sensibly without having the dataPointWidth in pixels.  Not sure if we can reliably get a valid coordCacluator
        if (this.yAxis.type === AxisType_1.EAxisType.LogarithmicAxis)
            return range;
        else
            return isHorizontalDirection
                ? this.adjustRangeByDataPointWidth(range, this.yAxis)
                : (0, exports.adjustRangeByStrokeThickness)(range, this.strokeThickness, (_a = this.parentSurface.seriesViewRect) === null || _a === void 0 ? void 0 : _a.height);
    };
    /** @inheritDoc */
    FastErrorBarsRenderableSeries.prototype.toJSON = function (excludeData) {
        if (excludeData === void 0) { excludeData = false; }
        var json = _super.prototype.toJSON.call(this, excludeData);
        var options = {
            dataPointWidth: this.dataPointWidth,
            dataPointWidthMode: this.dataPointWidthMode,
            errorDirection: this.errorDirection,
            errorMode: this.errorMode,
            drawWhiskers: this.drawWhiskers,
            drawConnector: this.drawConnector,
            strokeDashArray: this.strokeDashArray
        };
        Object.assign(json.options, options);
        return json;
    };
    /** @inheritDoc */
    FastErrorBarsRenderableSeries.prototype.toPointSeries = function (rp) {
        if (rp) {
            throw new Error("Error Bars Series don't support resampling!");
        }
        else {
            return new HlcPointSeriesWrapped_1.HlcPointSeriesWrapped(this.dataSeries);
        }
    };
    /**
     * @inheritDoc
     */
    FastErrorBarsRenderableSeries.prototype.newHitTestProvider = function () {
        return new ErrorSeriesHitTestProvider_1.ErrorSeriesHitTestProvider(this, this.webAssemblyContext);
    };
    FastErrorBarsRenderableSeries.prototype.adjustRangeByDataPointWidth = function (range, axis) {
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
            var cc = axis.getCurrentCoordinateCalculator();
            var dataWidth = cc.getDataValue(this.dataPointWidth) - cc.getDataValue(0);
            halfWidth = dataWidth / 2;
        }
        var correctedRange = new NumberRange_1.NumberRange(range.min - halfWidth, range.max + halfWidth);
        // TODO: figure out what to do if we have only one point
        return correctedRange;
    };
    return FastErrorBarsRenderableSeries;
}(BaseRenderableSeries_1.BaseRenderableSeries));
exports.FastErrorBarsRenderableSeries = FastErrorBarsRenderableSeries;
/** @ignore */
var adjustRangeByStrokeThickness = function (range, strokeThickness, areaSize) {
    if (areaSize === void 0) { areaSize = 0; }
    var delta = areaSize && (0, BaseRenderableSeries_1.getDelta)({ pointSize: strokeThickness, areaSize: areaSize, range: range });
    return new NumberRange_1.NumberRange(range.min - delta, range.max + delta);
};
exports.adjustRangeByStrokeThickness = adjustRangeByStrokeThickness;
