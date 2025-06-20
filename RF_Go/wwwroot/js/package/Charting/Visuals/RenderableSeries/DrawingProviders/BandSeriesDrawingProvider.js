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
exports.BandSeriesDrawingProvider = void 0;
var Deleter_1 = require("../../../../Core/Deleter");
var BrushCache_1 = require("../../../Drawing/BrushCache");
var Pen2DCache_1 = require("../../../Drawing/Pen2DCache");
var WebGlRenderContext2D_1 = require("../../../Drawing/WebGlRenderContext2D");
var SciChartSurfaceBase_1 = require("../../SciChartSurfaceBase");
var constants_1 = require("../constants");
var BaseSeriesDrawingProvider_1 = require("./BaseSeriesDrawingProvider");
/**
 * Used internally - a drawing provider performs drawing for a {@link BaseBandRenderableSeries} using
 * our WebAssembly WebGL rendering engine
 */
var BandSeriesDrawingProvider = /** @class */ (function (_super) {
    __extends(BandSeriesDrawingProvider, _super);
    /**
     * Creates an instance of the {@link BandSeriesDrawingProvider}
     * @param webAssemblyContext The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param parentSeries the parent {@link BaseBandRenderableSeries} which this drawing provider is attached to
     */
    function BandSeriesDrawingProvider(webAssemblyContext, parentSeries, ySelector, y1Selector) {
        var _this = _super.call(this, webAssemblyContext, parentSeries, ySelector) || this;
        _this.args = new _this.webAssemblyContext.SCRTBandDrawingParams();
        _this.y1Selector = y1Selector !== null && y1Selector !== void 0 ? y1Selector : (function (ps) { return ps.y1Values; });
        _this.linesPenCache = new Pen2DCache_1.Pen2DCache(webAssemblyContext);
        _this.strokePenY1Cache = new Pen2DCache_1.Pen2DCache(webAssemblyContext);
        _this.fillBrushCache = new BrushCache_1.BrushCache(webAssemblyContext);
        _this.fillBrushY1Cache = new BrushCache_1.BrushCache(webAssemblyContext);
        return _this;
    }
    /**
     * @inheritDoc
     */
    BandSeriesDrawingProvider.prototype.onAttachSeries = function () {
        _super.prototype.onAttachSeries.call(this);
        this.nativeDrawingProvider = new this.webAssemblyContext.SCRTBandSeriesDrawingProvider();
        var _a = this.parentSeries, parentSurface = _a.parentSurface, stroke = _a.stroke, strokeThickness = _a.strokeThickness, fill = _a.fill, strokeY1 = _a.strokeY1, fillY1 = _a.fillY1, opacity = _a.opacity, strokeDashArray = _a.strokeDashArray, strokeY1DashArray = _a.strokeY1DashArray, fillLinearGradient = _a.fillLinearGradient, fillLinearGradientY1 = _a.fillLinearGradientY1;
        var textureHeightRatio = (parentSurface === null || parentSurface === void 0 ? void 0 : parentSurface.isCopyCanvasSurface)
            ? parentSurface.domCanvas2D.height / SciChartSurfaceBase_1.SciChartSurfaceBase.domMasterCanvas.height
            : 1;
        var textureWidthRatio = (parentSurface === null || parentSurface === void 0 ? void 0 : parentSurface.isCopyCanvasSurface)
            ? parentSurface.domCanvas2D.width / SciChartSurfaceBase_1.SciChartSurfaceBase.domMasterCanvas.width
            : 1;
        (0, Pen2DCache_1.createPenInCache)(this.linesPenCache, stroke, strokeThickness, opacity, strokeDashArray);
        (0, Pen2DCache_1.createPenInCache)(this.strokePenY1Cache, strokeY1, strokeThickness, opacity, strokeY1DashArray);
        (0, BrushCache_1.createBrushInCache)(this.fillBrushCache, fill, opacity, textureHeightRatio, textureWidthRatio, fillLinearGradient);
        (0, BrushCache_1.createBrushInCache)(this.fillBrushY1Cache, fillY1, opacity, textureHeightRatio, textureWidthRatio, fillLinearGradientY1);
    };
    /**
     * @inheritDoc
     */
    BandSeriesDrawingProvider.prototype.onDetachSeries = function () {
        _super.prototype.onDetachSeries.call(this);
        this.nativeDrawingProvider = (0, Deleter_1.deleteSafe)(this.nativeDrawingProvider);
    };
    /**
     * @inheritDoc
     */
    BandSeriesDrawingProvider.prototype.delete = function () {
        this.nativeDrawingProvider = (0, Deleter_1.deleteSafe)(this.nativeDrawingProvider);
        this.args = (0, Deleter_1.deleteSafe)(this.args);
        this.linesPenCache = (0, Deleter_1.deleteSafe)(this.linesPenCache);
        this.fillBrushCache = (0, Deleter_1.deleteSafe)(this.fillBrushCache);
        this.strokePenY1Cache = (0, Deleter_1.deleteSafe)(this.strokePenY1Cache);
        this.fillBrushY1Cache = (0, Deleter_1.deleteSafe)(this.fillBrushY1Cache);
        _super.prototype.delete.call(this);
    };
    /**
     * @inheritDoc
     */
    BandSeriesDrawingProvider.prototype.draw = function (renderContext, renderPassData) {
        var _a;
        var pointSeries = renderPassData.pointSeries;
        var containsNaN = this.parentSeries.dataSeries.dataDistributionCalculator.containsNaN;
        this.args.Reset();
        this.args.forceShaderMethod = true;
        this.args.verticalChart = renderPassData.isVerticalChart;
        this.args.lineGaps = containsNaN
            ? this.parentSeries.drawNaNAs === WebGlRenderContext2D_1.ELineDrawMode.DiscontinuousLine
                ? this.webAssemblyContext.SCRTLineGapMode.DrawGaps
                : this.webAssemblyContext.SCRTLineGapMode.CloseGaps
            : this.webAssemblyContext.SCRTLineGapMode.Default;
        this.args.isDigitalLine = this.parentSeries.isDigitalLine;
        var fillBrush = (0, BrushCache_1.getScrtBrushFromCache)(this.fillBrushCache);
        if (fillBrush) {
            this.args.SetFillBrush(fillBrush);
        }
        var linesPen = (0, Pen2DCache_1.getScrtPenFromCache)(this.linesPenCache);
        if (linesPen) {
            this.args.SetLinesPen(linesPen);
        }
        var fillBrushY1 = (0, BrushCache_1.getScrtBrushFromCache)(this.fillBrushY1Cache);
        if (fillBrushY1) {
            this.args.SetFillBrush1(fillBrushY1);
        }
        var strokePenY1 = (0, Pen2DCache_1.getScrtPenFromCache)(this.strokePenY1Cache);
        if (strokePenY1) {
            this.args.SetLinesPen1(strokePenY1);
        }
        var isCategoryAxis = renderPassData.xCoordinateCalculator.isCategoryCoordinateCalculator;
        var xValues = pointSeries.xValues;
        var _b = this.parentSeries.dataSeries, fifoCapacity = _b.fifoCapacity, fifoSweeping = _b.fifoSweeping, fifoSweepingGap = _b.fifoSweepingGap;
        var fifoStartIndex = pointSeries.fifoStartIndex;
        var xDrawValues = isCategoryAxis ? pointSeries.indexes : xValues;
        var yDrawValues = this.ySelector(pointSeries);
        var y1DrawValues = this.y1Selector(pointSeries);
        // const isSplineBandSeries = this.parentSeries.type === ESeriesType.SplineBandSeries && xValues.size() > 1;
        // if (isSplineBandSeries) {
        //     const splineBandSeries = this.parentSeries as SplineBandRenderableSeries;
        //     if (!this.parentSeries.isRunningAnimation) {
        //         splineBandSeries.updateSplineValues();
        //     }
        //     xDrawValues = splineBandSeries.xSplineValues;
        //     yDrawValues = splineBandSeries.ySplineValues;
        //     y1DrawValues = splineBandSeries.y1SplineValues;
        // }
        var _c = this.getStartAndCount(
        //isSplineBandSeries ? undefined : renderPassData,
        renderPassData, xDrawValues), startIndex = _c.startIndex, count = _c.count;
        this.args.count = count;
        this.args.startIndex = startIndex;
        if (fifoCapacity > 0 && fifoSweeping && fifoCapacity === this.parentSeries.dataSeries.count()) {
            this.args.count = fifoStartIndex;
        }
        // Paletting per point
        _super.prototype.applyStrokeFillPaletting.call(this, undefined, undefined, undefined, undefined, this.parentSeries.opacity, true, true, renderPassData);
        var paletteTexture = (_a = this.palettingState.paletteTextureCache) === null || _a === void 0 ? void 0 : _a.value;
        if (paletteTexture) {
            this.args.SetPalette(paletteTexture);
        }
        this.args.isSmoothColors = this.palettingState.gradientPaletting;
        var nativeContext = renderContext.getNativeContext();
        this.nativeDrawingProvider.DrawPointsVec(nativeContext, xDrawValues, yDrawValues, y1DrawValues, renderPassData.xCoordinateCalculator.nativeCalculator, renderPassData.yCoordinateCalculator.nativeCalculator, this.args);
        if (fifoCapacity > 0 && fifoSweeping && fifoCapacity === this.parentSeries.dataSeries.count()) {
            this.args.startIndex = Math.min(yDrawValues.size(), fifoStartIndex + fifoSweepingGap);
            this.args.count = Math.max(0, yDrawValues.size() - fifoStartIndex - fifoSweepingGap);
            if (this.args.count > 0) {
                this.nativeDrawingProvider.DrawPointsVec(nativeContext, xDrawValues, yDrawValues, y1DrawValues, renderPassData.xCoordinateCalculator.nativeCalculator, renderPassData.yCoordinateCalculator.nativeCalculator, this.args);
            }
        }
    };
    /**
     * @inheritDoc
     */
    BandSeriesDrawingProvider.prototype.onDpiChanged = function (args) {
        _super.prototype.onDpiChanged.call(this, args);
        this.onSeriesPropertyChange(constants_1.PROPERTY.STROKE);
        this.onSeriesPropertyChange(constants_1.PROPERTY.STROKE_Y1);
    };
    /**
     * @inheritDoc
     */
    BandSeriesDrawingProvider.prototype.onSeriesPropertyChange = function (propertyName) {
        _super.prototype.onSeriesPropertyChange.call(this, propertyName);
        var _a = this.parentSeries, parentSurface = _a.parentSurface, stroke = _a.stroke, strokeY1 = _a.strokeY1, strokeThickness = _a.strokeThickness, fill = _a.fill, fillY1 = _a.fillY1, opacity = _a.opacity, strokeDashArray = _a.strokeDashArray, strokeY1DashArray = _a.strokeY1DashArray, fillLinearGradient = _a.fillLinearGradient, fillLinearGradientY1 = _a.fillLinearGradientY1;
        if (propertyName === constants_1.PROPERTY.STROKE ||
            propertyName === constants_1.PROPERTY.STROKE_THICKNESS ||
            propertyName === constants_1.PROPERTY.OPACITY ||
            propertyName === constants_1.PROPERTY.STROKE_DASH_ARRAY) {
            this.palettingState.requiresUpdate = true;
            (0, Pen2DCache_1.createPenInCache)(this.linesPenCache, stroke, strokeThickness, opacity, strokeDashArray);
            return;
        }
        if (propertyName === constants_1.PROPERTY.STROKE_Y1 ||
            propertyName === constants_1.PROPERTY.STROKE_THICKNESS ||
            propertyName === constants_1.PROPERTY.OPACITY ||
            propertyName === constants_1.PROPERTY.STROKE_Y1_DASH_ARRAY) {
            this.palettingState.requiresUpdate = true;
            (0, Pen2DCache_1.createPenInCache)(this.strokePenY1Cache, strokeY1, strokeThickness, opacity, strokeY1DashArray);
            return;
        }
        var textureHeightRatio = (parentSurface === null || parentSurface === void 0 ? void 0 : parentSurface.isCopyCanvasSurface)
            ? parentSurface.domCanvas2D.height / SciChartSurfaceBase_1.SciChartSurfaceBase.domMasterCanvas.height
            : 1;
        var textureWidthRatio = (parentSurface === null || parentSurface === void 0 ? void 0 : parentSurface.isCopyCanvasSurface)
            ? parentSurface.domCanvas2D.width / SciChartSurfaceBase_1.SciChartSurfaceBase.domMasterCanvas.width
            : 1;
        if (propertyName === constants_1.PROPERTY.FILL ||
            propertyName === constants_1.PROPERTY.OPACITY ||
            propertyName === constants_1.PROPERTY.FILL_LINEAR_GRADIENT) {
            this.palettingState.requiresUpdate = true;
            (0, BrushCache_1.createBrushInCache)(this.fillBrushCache, fill, opacity, textureHeightRatio, textureWidthRatio, fillLinearGradient);
        }
        if (propertyName === constants_1.PROPERTY.FILL_Y1 ||
            propertyName === constants_1.PROPERTY.OPACITY ||
            propertyName === constants_1.PROPERTY.FILL_LINEAR_GRADIENT_Y1) {
            this.palettingState.requiresUpdate = true;
            (0, BrushCache_1.createBrushInCache)(this.fillBrushY1Cache, fillY1, opacity, textureHeightRatio, textureWidthRatio, fillLinearGradientY1);
        }
    };
    return BandSeriesDrawingProvider;
}(BaseSeriesDrawingProvider_1.BaseSeriesDrawingProvider));
exports.BandSeriesDrawingProvider = BandSeriesDrawingProvider;
