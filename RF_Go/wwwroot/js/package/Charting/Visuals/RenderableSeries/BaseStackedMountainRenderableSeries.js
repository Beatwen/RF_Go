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
exports.BaseStackedMountainRenderableSeries = void 0;
var perfomance_1 = require("../../../utils/perfomance");
var XyPointSeriesWrapped_1 = require("../../Model/PointSeries/XyPointSeriesWrapped");
var IThemeProvider_1 = require("../../Themes/IThemeProvider");
var SciChartSurfaceBase_1 = require("../SciChartSurfaceBase");
var BaseStackedRenderableSeries_1 = require("./BaseStackedRenderableSeries");
var constants_1 = require("./constants");
var BandSeriesDrawingProvider_1 = require("./DrawingProviders/BandSeriesDrawingProvider");
var PointMarkerDrawingProvider_1 = require("./DrawingProviders/PointMarkerDrawingProvider");
var StackedMountainSeriesHitTestProvider_1 = require("./HitTest/StackedMountainSeriesHitTestProvider");
var BaseStackedMountainRenderableSeries = /** @class */ (function (_super) {
    __extends(BaseStackedMountainRenderableSeries, _super);
    /**
     * Creates an instance of the {@link StackedMountainRenderableSeries}
     * @param webAssemblyContext The {@link TSciChart | SciChart WebAssembly Context} containing
     * native methods and access to our WebGL2 WebAssembly Drawing Engine
     * @param options Optional parameters of type {@link IStackedMountainRenderableSeriesOptions} to configure the series
     */
    function BaseStackedMountainRenderableSeries(webAssemblyContext, options) {
        var _this = this;
        var _a, _b, _c;
        _this = _super.call(this, webAssemblyContext, options) || this;
        _this.fillProperty = "#7e8486";
        _this.strokeY1Property = "transparent";
        _this.strokeDashArrayProperty = [];
        _this.strokeY1DashArrayProperty = [];
        _this.fillProperty = (_a = options === null || options === void 0 ? void 0 : options.fill) !== null && _a !== void 0 ? _a : _this.fillProperty;
        _this.stroke = (_b = options === null || options === void 0 ? void 0 : options.stroke) !== null && _b !== void 0 ? _b : SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME.mountainLineColor;
        _this.strokeDashArrayProperty = (_c = options === null || options === void 0 ? void 0 : options.strokeDashArray) !== null && _c !== void 0 ? _c : _this.strokeDashArrayProperty;
        _this.drawingProviders.push(new BandSeriesDrawingProvider_1.BandSeriesDrawingProvider(webAssemblyContext, 
        // TODO find more elegant way to pass this. In scope of https://abtsoftware.myjetbrains.com/youtrack/issue/SCJS-1109
        _this, 
        // StackedMountainRenderableSeries have reverse order of yValues and y1Values compared to FastBandRenderableSeries
        function (ps) { return ps.y1Values; }, function (ps) { return ps.yValues; }), new PointMarkerDrawingProvider_1.PointMarkerDrawingProvider(webAssemblyContext, _this, function (ps) { return ps.y1Values; }));
        return _this;
    }
    // PUBLIC
    /**
     * Called internally when the {@link StackedMountainRenderableSeries} is attached to a parent {@link StackedMountainCollection}
     * @param parentCollection the parent {@link BaseStackedCollection}
     * @param getParentSurfaceFn function to get the parent {@link SciChartSurface}
     * @param notifyPropertyChangedFn function to notify property has changed
     */
    BaseStackedMountainRenderableSeries.prototype.onAttachToParentCollection = function (parentCollection, getParentSurfaceFn, notifyPropertyChangedFn) {
        if (this.parentCollection) {
            throw new Error("Invalid operation in StackedMountainRenderableSeries.onAttachToParentCollection, this series has been already attached to collection. Please detach it from the collection before attaching to another");
        }
        this.parentCollection = parentCollection;
        this.getParentSurfaceFn = getParentSurfaceFn;
        this.notifyParentPropertyChangedFn = notifyPropertyChangedFn;
    };
    /** @inheritDoc */
    BaseStackedMountainRenderableSeries.prototype.onAttach = function (scs) {
        if (this.invalidateParentCallback) {
            throw new Error("Invalid operation in sciChartSurface.attachSeries, this series has already been attached to a SciChartSurface. Please detach it from a SciChartSurface before attaching to another");
        }
        this.invalidateParentCallback = scs.invalidateElement;
        this.drawingProviders.forEach(function (dp) { return dp.onAttachSeries(); });
        this.rolloverModifierProps.setInvalidateParentCallback(scs.invalidateElement);
    };
    /** @inheritDoc */
    BaseStackedMountainRenderableSeries.prototype.onDetach = function () {
        this.invalidateParentCallback = undefined;
        this.drawingProviders.forEach(function (dp) { return dp.onDetachSeries(); });
        this.rolloverModifierProps.setInvalidateParentCallback(undefined);
    };
    /** @inheritDoc */
    BaseStackedMountainRenderableSeries.prototype.draw = function (renderContext, renderPassData) {
        var _this = this;
        var _a, _b, _c, _d;
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawSingleSeriesStart, {
            contextId: this.id,
            parentContextId: (_a = this.parentSurface) === null || _a === void 0 ? void 0 : _a.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        this.currentRenderPassData = renderPassData;
        (_b = this.hitTestProvider) === null || _b === void 0 ? void 0 : _b.update(renderPassData);
        try {
            renderContext.pushShaderEffect(this.effect);
            this.drawingProviders.forEach(function (dp) {
                if (_this.renderDataTransform && _this.renderDataTransform.drawingProviders.includes(dp)) {
                    var transformedRPD = _this.renderDataTransform.runTransform(renderPassData);
                    dp.draw(renderContext, transformedRPD);
                }
                else {
                    dp.draw(renderContext, renderPassData);
                }
            });
        }
        finally {
            renderContext.popShaderEffect();
        }
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawSingleSeriesEnd, {
            contextId: this.id,
            parentContextId: (_c = this.parentSurface) === null || _c === void 0 ? void 0 : _c.id,
            relatedId: (_d = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _d === void 0 ? void 0 : _d.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
    };
    /**
     * @inheritDoc
     */
    BaseStackedMountainRenderableSeries.prototype.onDpiChanged = function (args) {
        _super.prototype.onDpiChanged.call(this, args);
        this.notifyPropertyChanged(constants_1.PROPERTY.STROKE);
    };
    Object.defineProperty(BaseStackedMountainRenderableSeries.prototype, "fill", {
        // PROPERTIES
        /**
         * Gets or sets the fill brush of the mountain as an HTML color code
         */
        get: function () {
            return (0, IThemeProvider_1.stripAutoColor)(this.fillProperty);
        },
        /**
         * Gets or sets the fill brush of the mountain as an HTML color code
         */
        set: function (fill) {
            if (this.fillProperty !== fill) {
                this.fillProperty = fill;
                this.drawingProviders.forEach(function (dp) { return dp.onSeriesPropertyChange(constants_1.PROPERTY.FILL); });
                // If fill changes, we need to redo both brushes on the drawing provider
                this.drawingProviders.forEach(function (dp) { return dp.onSeriesPropertyChange(constants_1.PROPERTY.FILL_Y1); });
                this.notifyPropertyChanged(constants_1.PROPERTY.FILL);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseStackedMountainRenderableSeries.prototype, "strokeY1", {
        /**
         * Gets or sets the stroke color the Y1 values in the data-series.
         * See associated {@link XyyDataSeries} for further information
         *  @remarks This property is set internally to the value of a previous StackedMountainSeries.
         */
        get: function () {
            return this.strokeY1Property;
        },
        /**
         * Gets or sets the stroke color the Y1 values in the data-series.
         * See associated {@link XyyDataSeries} for further information
         *  @remarks This property is set internally to the value of a previous StackedMountainSeries.
         */
        set: function (strokeY1) {
            if (this.strokeY1Property !== strokeY1) {
                this.strokeY1Property = strokeY1;
                // no need to call notifyPropertyChange here since this will cause an unwanted redraw loop, so just updating a pen
                this.drawingProviders.forEach(function (dp) { return dp.onSeriesPropertyChange(constants_1.PROPERTY.STROKE_Y1); });
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseStackedMountainRenderableSeries.prototype, "fillY1", {
        /**
         * Gets or sets the fill color for when Y1 is less than Y as an HTML Color code
         */
        get: function () {
            return (0, IThemeProvider_1.stripAutoColor)(this.fillProperty);
        },
        /**
         * Gets or sets the fill color for when Y1 is less than Y as an HTML Color code
         */
        set: function (fillY1) {
            throw new Error("Setting fillY1 property is not supported on StackedMountainRenderableSeries");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseStackedMountainRenderableSeries.prototype, "strokeDashArray", {
        /**
         * The StrokeDashArray defines the stroke or dash pattern for the Y0 line.
         * Accepts an array of values, e.g. [2,2] will have a line of length 2 and a gap of length 2.
         */
        get: function () {
            return this.strokeDashArrayProperty;
        },
        /**
         * The StrokeDashArray defines the stroke or dash pattern for the Y0 line.
         * Accepts an array of values, e.g. [2,2] will have a line of length 2 and a gap of length 2.
         */
        set: function (strokeDashArray) {
            this.strokeDashArrayProperty = strokeDashArray;
            this.notifyPropertyChanged(constants_1.PROPERTY.STROKE_DASH_ARRAY);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseStackedMountainRenderableSeries.prototype, "strokeY1DashArray", {
        /**
         * The strokeY1DashArray defines the stroke or dash pattern for the Y1 line.
         * Accepts an array of values, e.g. [2,2] will have a line of length 2 and a gap of length 2.
         * @remarks This property is set internally to the value of a previous StackedMountainSeries.
         */
        get: function () {
            return this.strokeY1DashArrayProperty;
        },
        /**
         * The strokeY1DashArray defines the stroke or dash pattern for the Y1 line.
         * Accepts an array of values, e.g. [2,2] will have a line of length 2 and a gap of length 2.
         * @remarks This property is set internally to the value of a previous StackedMountainSeries.
         */
        set: function (strokeY1DashArray) {
            this.strokeY1DashArrayProperty = strokeY1DashArray;
            // no need to call notifyPropertyChange here since this will cause an unwanted redraw loop, so just updating a pen
            this.drawingProviders.forEach(function (dp) { return dp.onSeriesPropertyChange(constants_1.PROPERTY.STROKE_Y1_DASH_ARRAY); });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the RenderPassData instance used for this render pass
     */
    BaseStackedMountainRenderableSeries.prototype.getCurrentRenderPassData = function () {
        return this.currentRenderPassData;
    };
    // PROPERTIES END
    BaseStackedMountainRenderableSeries.prototype.toJSON = function (excludeData) {
        if (excludeData === void 0) { excludeData = false; }
        var json = _super.prototype.toJSON.call(this, excludeData);
        var options = {
            fill: this.fill,
            stroke: this.stroke,
            strokeThickness: this.strokeThickness,
            strokeDashArray: this.strokeDashArray,
            paletteProvider: this.paletteProvider
        };
        Object.assign(json.options, options);
        return json;
    };
    /** @inheritDoc */
    BaseStackedMountainRenderableSeries.prototype.toPointSeries = function (resamplingParams) {
        return new XyPointSeriesWrapped_1.XyPointSeriesWrapped(this.dataSeries);
    };
    /** @inheritDoc */
    BaseStackedMountainRenderableSeries.prototype.hasStrokePaletteProvider = function () {
        var strokePalette = this.paletteProvider;
        return (strokePalette === null || strokePalette === void 0 ? void 0 : strokePalette.overrideStrokeArgb) !== undefined;
    };
    /** @inheritDoc */
    BaseStackedMountainRenderableSeries.prototype.hasFillPaletteProvider = function () {
        var fillPalette = this.paletteProvider;
        return (fillPalette === null || fillPalette === void 0 ? void 0 : fillPalette.overrideFillArgb) !== undefined;
    };
    /** @inheritDoc */
    BaseStackedMountainRenderableSeries.prototype.hasPointMarkerPaletteProvider = function () {
        var pointMarkerPalette = this.paletteProvider;
        return (pointMarkerPalette === null || pointMarkerPalette === void 0 ? void 0 : pointMarkerPalette.overridePointMarkerArgb) !== undefined;
    };
    /** @inheritDoc */
    BaseStackedMountainRenderableSeries.prototype.resolveAutoColors = function (index, maxSeries, theme) {
        _super.prototype.resolveAutoColors.call(this, index, maxSeries, theme);
        if (this.fillProperty.startsWith(IThemeProvider_1.AUTO_COLOR)) {
            var color = theme.getFillColor(index, maxSeries, this.webAssemblyContext);
            this.fill = IThemeProvider_1.AUTO_COLOR + this.adjustAutoColor("fill", color);
        }
        // No need to resolve strokeY1 as the collection sets it based on previous series
    };
    // PROTECTED
    /** @inheritDoc */
    BaseStackedMountainRenderableSeries.prototype.newHitTestProvider = function () {
        return new StackedMountainSeriesHitTestProvider_1.StackedMountainSeriesHitTestProvider(this, this.webAssemblyContext);
    };
    return BaseStackedMountainRenderableSeries;
}(BaseStackedRenderableSeries_1.BaseStackedRenderableSeries));
exports.BaseStackedMountainRenderableSeries = BaseStackedMountainRenderableSeries;
