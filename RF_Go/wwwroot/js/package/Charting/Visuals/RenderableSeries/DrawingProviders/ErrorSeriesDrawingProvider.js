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
exports.ErrorSeriesDrawingProvider = void 0;
var Deleter_1 = require("../../../../Core/Deleter");
var AxisType_1 = require("../../../../types/AxisType");
var ErrorDirection_1 = require("../../../../types/ErrorDirection");
var ErrorMode_1 = require("../../../../types/ErrorMode");
var Pen2DCache_1 = require("../../../Drawing/Pen2DCache");
var WebGlRenderContext2D_1 = require("../../../Drawing/WebGlRenderContext2D");
var LogarithmicAxis_1 = require("../../Axis/LogarithmicAxis");
var NativeObject_1 = require("../../Helpers/NativeObject");
var constants_1 = require("../constants");
var BaseSeriesDrawingProvider_1 = require("./BaseSeriesDrawingProvider");
/**
 * Used internally - a drawing provider performs drawing for a {@link BaseBandRenderableSeries} using
 * our WebAssembly WebGL rendering engine
 */
var ErrorSeriesDrawingProvider = /** @class */ (function (_super) {
    __extends(ErrorSeriesDrawingProvider, _super);
    // private args: SCRTLineDrawingParams;
    // private xLineCoordinates: SCRTDoubleVector;
    // private yLineCoordinates: SCRTDoubleVector;
    /**
     * Creates an instance of the {@link BandSeriesDrawingProvider}
     * @param webAssemblyContext The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param parentSeries the parent {@link BaseBandRenderableSeries} which this drawing provider is attached to
     */
    function ErrorSeriesDrawingProvider(webAssemblyContext, parentSeries) {
        var _this = _super.call(this, webAssemblyContext, parentSeries) || this;
        _this.linesPenCache = new Pen2DCache_1.Pen2DCache(webAssemblyContext);
        return _this;
        // this.args = new webAssemblyContext.SCRTLineDrawingParams();
        // this.xLineCoordinates = new this.webAssemblyContext.SCRTDoubleVector();
        // this.yLineCoordinates = new this.webAssemblyContext.SCRTDoubleVector();
    }
    /**
     * @inheritDoc
     */
    ErrorSeriesDrawingProvider.prototype.onAttachSeries = function () {
        _super.prototype.onAttachSeries.call(this);
        // this.nativeDrawingProvider = new this.webAssemblyContext.SCRTLineSeriesDrawingProvider();
        var _a = this.parentSeries, stroke = _a.stroke, strokeThickness = _a.strokeThickness, opacity = _a.opacity, strokeDashArray = _a.strokeDashArray;
        (0, Pen2DCache_1.createPenInCache)(this.linesPenCache, stroke, strokeThickness, opacity, strokeDashArray);
    };
    /**
     * @inheritDoc
     */
    ErrorSeriesDrawingProvider.prototype.onDetachSeries = function () {
        _super.prototype.onDetachSeries.call(this);
    };
    /**
     * @inheritDoc
     */
    ErrorSeriesDrawingProvider.prototype.delete = function () {
        // this.nativeDrawingProvider = deleteSafe(this.nativeDrawingProvider);
        this.linesPenCache = (0, Deleter_1.deleteSafe)(this.linesPenCache);
        // this.args = deleteSafe(this.args);
        _super.prototype.delete.call(this);
    };
    /**
     * @inheritDoc
     */
    ErrorSeriesDrawingProvider.prototype.draw = function (renderContext, renderPassData) {
        var linesPen = (0, Pen2DCache_1.getScrtPenFromCache)(this.linesPenCache);
        if (!linesPen) {
            return;
        }
        var pointSeries = renderPassData.pointSeries;
        var vertices = (0, NativeObject_1.getVectorColorVertex)(this.webAssemblyContext);
        // this.xLineCoordinates.clear();
        // this.yLineCoordinates.clear();
        // this.args.Reset();
        // this.args.SetLinesPen(linesPen);
        // this.args.isDigitalLine = this.parentSeries.isDigitalLine;
        // this.args.forceShaderMethod = true;
        // this.args.containsNaN = true;
        // this.args.lineGaps = this.webAssemblyContext.SCRTLineGapMode.DrawGaps;
        // this.args.verticalChart = renderPassData.isVerticalChart;
        // // Stroke paletting per point
        // this.applyStrokePaletting(linesPen);
        // if (this.palettingState.palettedColors) {
        //     this.args.SetPalettedColors(this.palettingState.palettedColors);
        // }
        // const nativeContext = renderContext.getNativeContext();
        var isCategoryAxis = renderPassData.xCoordinateCalculator.isCategoryCoordinateCalculator;
        var xValues = pointSeries.xValues;
        var xDrawValues = isCategoryAxis ? pointSeries.indexes : xValues;
        var yDrawValues = pointSeries.yValues;
        var hDrawValues = pointSeries.highValues;
        var lDrawValues = pointSeries.lowValues;
        var isVerticalDirection = this.parentSeries.errorDirection === ErrorDirection_1.EErrorDirection.Vertical;
        var dataPointWidthCalc = isVerticalDirection
            ? renderPassData.xCoordinateCalculator
            : renderPassData.yCoordinateCalculator;
        var dataPointWidthPx = this.parentSeries.getDataPointWidth(dataPointWidthCalc, this.parentSeries.dataPointWidth, this.parentSeries.dataPointWidthMode);
        // const halfRange = Math.abs(
        //     dataPointWidthCalc.getDataValue(dataPointWidthPx * 0.5) - dataPointWidthCalc.getDataValue(0)
        // );
        var halfRange = dataPointWidthPx * 0.5;
        var hasLogarithmicXAxis = this.parentSeries.xAxis.type === AxisType_1.EAxisType.LogarithmicAxis;
        var hasLogarithmicYAxis = this.parentSeries.yAxis.type === AxisType_1.EAxisType.LogarithmicAxis;
        var hasNegativeLogXAxis = this.parentSeries.xAxis.isNegative;
        var hasNegativeLogYAxis = this.parentSeries.yAxis.isNegative;
        var hasHighCap = this.parentSeries.errorMode !== ErrorMode_1.EErrorMode.Low;
        var hasLowCap = this.parentSeries.errorMode !== ErrorMode_1.EErrorMode.High;
        var dataPointsCount = xDrawValues.size();
        if (isVerticalDirection) {
            for (var i = 0; i < dataPointsCount; ++i) {
                var xValue = xDrawValues.get(i);
                var yValue = yDrawValues.get(i);
                var highValue = hasHighCap ? hDrawValues.get(i) : yValue;
                var lowValue = hasLowCap ? lDrawValues.get(i) : yValue;
                var shouldDrawLowErrorToLimit = hasLogarithmicYAxis && !hasNegativeLogYAxis && lowValue <= 0;
                if (shouldDrawLowErrorToLimit) {
                    lowValue = this.parentSeries.yAxis.visibleRange.min;
                }
                var shouldDrawHighErrorToLimit = hasLogarithmicYAxis && hasNegativeLogYAxis && highValue >= 0;
                if (shouldDrawHighErrorToLimit) {
                    highValue = this.parentSeries.yAxis.visibleRange.max;
                }
                // const xCoord = xValue;
                // const yCoord = yValue;
                // const highCoord = highValue;
                // const lowCoord = lowValue;
                var xCoord = renderPassData.xCoordinateCalculator.getCoordinate(xValue);
                var yCoord = renderPassData.yCoordinateCalculator.getCoordinate(yValue);
                var highCoord = renderPassData.yCoordinateCalculator.getCoordinate(highValue);
                var lowCoord = renderPassData.yCoordinateCalculator.getCoordinate(lowValue);
                var capStart = xCoord - halfRange;
                var capEnd = xCoord + halfRange;
                // main line
                if (this.parentSeries.drawConnector) {
                    this.addLineVertices(vertices, xCoord, isNaN(highValue) ? yCoord : highCoord, xCoord, isNaN(lowValue) ? yCoord : lowCoord);
                }
                if (hasHighCap && !shouldDrawHighErrorToLimit && this.parentSeries.drawWhiskers) {
                    // top whiskers
                    this.addLineVertices(vertices, capStart, highCoord, capEnd, highCoord);
                }
                if (hasLowCap && !shouldDrawLowErrorToLimit && this.parentSeries.drawWhiskers) {
                    // bottom whiskers
                    this.addLineVertices(vertices, capStart, lowCoord, capEnd, lowCoord);
                }
            }
        }
        else {
            for (var i = 0; i < dataPointsCount; ++i) {
                var xValue = xDrawValues.get(i);
                var yValue = yDrawValues.get(i);
                var lowValue = hasLowCap ? lDrawValues.get(i) : xValue;
                var highValue = hasHighCap ? hDrawValues.get(i) : xValue;
                var shouldDrawLowErrorToLimit = hasLogarithmicXAxis && !hasNegativeLogXAxis && lowValue <= 0;
                if (shouldDrawLowErrorToLimit) {
                    lowValue = LogarithmicAxis_1.MIN_LOG_AXIS_VALUE;
                }
                var shouldDrawHighErrorToLimit = hasLogarithmicXAxis && hasNegativeLogXAxis && highValue >= 0;
                if (shouldDrawHighErrorToLimit) {
                    highValue = -LogarithmicAxis_1.MIN_LOG_AXIS_VALUE;
                }
                // const xCoord = xValue;
                // const yCoord = yValue;
                // const highCoord = highValue;
                // const lowCoord = lowValue;
                var xCoord = renderPassData.xCoordinateCalculator.getCoordinate(xValue);
                var yCoord = renderPassData.yCoordinateCalculator.getCoordinate(yValue);
                var highCoord = renderPassData.xCoordinateCalculator.getCoordinate(highValue);
                var lowCoord = renderPassData.xCoordinateCalculator.getCoordinate(lowValue);
                var capStart = yCoord - halfRange;
                var capEnd = yCoord + halfRange;
                // main line
                if (this.parentSeries.drawConnector) {
                    this.addLineVertices(vertices, isNaN(lowValue) ? xCoord : lowCoord, yCoord, isNaN(highValue) ? xCoord : highCoord, yCoord);
                }
                if (hasHighCap && !shouldDrawHighErrorToLimit && this.parentSeries.drawWhiskers) {
                    // top whiskers
                    this.addLineVertices(vertices, highCoord, capStart, highCoord, capEnd);
                }
                if (hasLowCap && !shouldDrawLowErrorToLimit && this.parentSeries.drawWhiskers) {
                    // bottom whiskers
                    this.addLineVertices(vertices, lowCoord, capStart, lowCoord, capEnd);
                }
            }
        }
        // this.nativeDrawingProvider.DrawLinesVec(nativeContext, xValues, yValues, xCoordCalc, yCoordCalc, args);
        renderContext.drawLinesNative(vertices, linesPen, WebGlRenderContext2D_1.ELineDrawMode.DiscontinuousLine);
    };
    /**
     * @inheritDoc
     */
    ErrorSeriesDrawingProvider.prototype.onDpiChanged = function (args) {
        _super.prototype.onDpiChanged.call(this, args);
        this.onSeriesPropertyChange(constants_1.PROPERTY.STROKE);
    };
    /**
     * @inheritDoc
     */
    ErrorSeriesDrawingProvider.prototype.onSeriesPropertyChange = function (propertyName) {
        _super.prototype.onSeriesPropertyChange.call(this, propertyName);
        var _a = this.parentSeries, stroke = _a.stroke, strokeThickness = _a.strokeThickness, opacity = _a.opacity, strokeDashArray = _a.strokeDashArray;
        if (propertyName === constants_1.PROPERTY.STROKE ||
            propertyName === constants_1.PROPERTY.STROKE_THICKNESS ||
            propertyName === constants_1.PROPERTY.OPACITY ||
            propertyName === constants_1.PROPERTY.STROKE_DASH_ARRAY) {
            (0, Pen2DCache_1.createPenInCache)(this.linesPenCache, stroke, strokeThickness, opacity, strokeDashArray);
        }
    };
    ErrorSeriesDrawingProvider.prototype.addLineVertices = function (vertices, x1, y1, x2, y2) {
        var isVerticalChart = this.parentSeries.xAxis.isVerticalChart;
        if (isVerticalChart) {
            vertices.push_back((0, NativeObject_1.getVertex)(this.webAssemblyContext, y1, x1));
            vertices.push_back((0, NativeObject_1.getVertex)(this.webAssemblyContext, y2, x2));
        }
        else {
            vertices.push_back((0, NativeObject_1.getVertex)(this.webAssemblyContext, x1, y1));
            vertices.push_back((0, NativeObject_1.getVertex)(this.webAssemblyContext, x2, y2));
        }
    };
    return ErrorSeriesDrawingProvider;
}(BaseSeriesDrawingProvider_1.BaseSeriesDrawingProvider));
exports.ErrorSeriesDrawingProvider = ErrorSeriesDrawingProvider;
