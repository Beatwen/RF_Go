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
exports.getDelta = exports.getDataPointWidth = exports.BaseRenderableSeries = void 0;
var classFactory_1 = require("../../../Builder/classFactory");
var AnimationFiniteStateMachine_1 = require("../../../Core/Animations/AnimationFiniteStateMachine");
var DeletableEntity_1 = require("../../../Core/DeletableEntity");
var Deleter_1 = require("../../../Core/Deleter");
var EventHandler_1 = require("../../../Core/EventHandler");
var NumberRange_1 = require("../../../Core/NumberRange");
var Rect_1 = require("../../../Core/Rect");
var AnimationType_1 = require("../../../types/AnimationType");
var BaseType_1 = require("../../../types/BaseType");
var DataLabelProviderType_1 = require("../../../types/DataLabelProviderType");
var PaletteProviderType_1 = require("../../../types/PaletteProviderType");
var PointMarkerType_1 = require("../../../types/PointMarkerType");
var SeriesType_1 = require("../../../types/SeriesType");
var guid_1 = require("../../../utils/guid");
var WebGlRenderContext2D_1 = require("../../Drawing/WebGlRenderContext2D");
var BaseDataSeries_1 = require("../../Model/BaseDataSeries");
var HeatmapSeriesInfo_1 = require("../../Model/ChartData/HeatmapSeriesInfo");
var HlcSeriesInfo_1 = require("../../Model/ChartData/HlcSeriesInfo");
var OhlcSeriesInfo_1 = require("../../Model/ChartData/OhlcSeriesInfo");
var XySeriesInfo_1 = require("../../Model/ChartData/XySeriesInfo");
var XyySeriesInfo_1 = require("../../Model/ChartData/XyySeriesInfo");
var XyzSeriesInfo_1 = require("../../Model/ChartData/XyzSeriesInfo");
var IDataSeries_1 = require("../../Model/IDataSeries");
var IPaletteProvider_1 = require("../../Model/IPaletteProvider");
var XyPointSeriesResampled_1 = require("../../Model/PointSeries/XyPointSeriesResampled");
var XyPointSeriesWrapped_1 = require("../../Model/PointSeries/XyPointSeriesWrapped");
var ExtremeResamplerHelper_1 = require("../../Numerics/Resamplers/ExtremeResamplerHelper");
var ResamplingMode_1 = require("../../Numerics/Resamplers/ResamplingMode");
var ResamplingParams_1 = require("../../Numerics/Resamplers/ResamplingParams");
var RenderPassData_1 = require("../../Services/RenderPassData");
var IThemeProvider_1 = require("../../Themes/IThemeProvider");
var AxisCore_1 = require("../Axis/AxisCore");
var SciChartDefaults_1 = require("../SciChartDefaults");
var SciChartSurfaceBase_1 = require("../SciChartSurfaceBase");
var DpiHelper_1 = require("../TextureManager/DpiHelper");
var animationHelpers_1 = require("./Animations/animationHelpers");
var constants_1 = require("./constants");
var RolloverModifierRenderableSeriesProps_1 = require("./RolloverModifier/RolloverModifierRenderableSeriesProps");
var SeriesHoveredArgs_1 = require("./SeriesHoveredArgs");
var SeriesSelectedArgs_1 = require("./SeriesSelectedArgs");
var SeriesVisibleChangedArgs_1 = require("./SeriesVisibleChangedArgs");
var YRangeMode_1 = require("../../../types/YRangeMode");
var DataPointWidthMode_1 = require("../../../types/DataPointWidthMode");
var perfomance_1 = require("../../../utils/perfomance");
/**
 * @summary Defines the base class to a Render Series (or Chart Type) in SciChart's High Performance Real-time
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}
 * @remarks
 * A RenderableSeries defines how data should be rendered. e.g. as a Line Chart, Mountain Chart, Candlestick Chart etc...
 * This is independent from the {@link BaseDataSeries | DataSeries} which stores the data to render
 *
 * See derived types of {@link BaseDataSeries} to find out what data-series are available.
 * See derived types of {@link IRenderableSeries} to find out what 2D JavaScript Chart types are available.
 */
var BaseRenderableSeries = /** @class */ (function (_super) {
    __extends(BaseRenderableSeries, _super);
    /**
     * Creates an instance of the {@link BaseRenderableSeries}
     * @param webAssemblyContext The {@link TSciChart | SciChart WebAssembly Context} containing
     * native methods and access to our WebGL2 WebAssembly Drawing Engine
     * @param options optional parameters of type {@link IBaseRenderableSeriesOptions} applied when constructing the series type
     */
    function BaseRenderableSeries(webAssemblyContext, options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        _this = _super.call(this) || this;
        /** @inheritDoc */
        _this.rolloverModifierProps = new RolloverModifierRenderableSeriesProps_1.RolloverModifierRenderableSeriesProps(_this);
        /** @inheritDoc */
        _this.rolloverModifierProps1 = new RolloverModifierRenderableSeriesProps_1.RolloverModifierRenderableSeriesProps(_this, true);
        /** @inheritDoc */
        _this.selected = new EventHandler_1.EventHandler();
        /** @inheritDoc */
        _this.hovered = new EventHandler_1.EventHandler();
        /** @inheritDoc */
        _this.isVisibleChanged = new EventHandler_1.EventHandler();
        _this.animationQueue = [];
        _this.paletteProviderProperty = IPaletteProvider_1.DefaultPaletteProvider.createEmpty();
        // used to track if registered types were used for function properties, so they can be serialized
        _this.typeMap = new Map();
        _this.opacityProperty = 1;
        _this.drawingProvidersProperty = [];
        _this.xAxisIdProperty = AxisCore_1.AxisCore.DEFAULT_AXIS_ID;
        _this.yAxisIdProperty = AxisCore_1.AxisCore.DEFAULT_AXIS_ID;
        _this.strokeThicknessProperty = 2;
        _this.strokeProperty = SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME.lineSeriesColor;
        _this.drawNaNAsProperty = WebGlRenderContext2D_1.ELineDrawMode.DiscontinuousLine;
        _this.isVisibleProperty = true;
        _this.isDigitalLineProperty = false;
        _this.resamplingModeProperty = ResamplingMode_1.EResamplingMode.Auto;
        _this.resamplingPrecisionProperty = 0;
        _this.clipToYRangeProperty = false;
        _this.yRangeModeProperty = YRangeMode_1.EYRangeMode.Drawn;
        _this.isStacked = false;
        _this.webAssemblyContext = webAssemblyContext;
        _this.id = (_a = options === null || options === void 0 ? void 0 : options.id) !== null && _a !== void 0 ? _a : (0, guid_1.generateGuid)();
        // It is very important to add bind(this) first line in constructor,
        // otherwise dataSeries passed through the options does not work!
        _this.dataSeriesDataChanged = _this.dataSeriesDataChanged.bind(_this);
        _this.effectPropertyChanged = _this.effectPropertyChanged.bind(_this);
        _this.invalidateParent = _this.invalidateParent.bind(_this);
        _this.getDataPointWidth = _this.getDataPointWidth.bind(_this);
        _this.updateAnimationProperties = _this.updateAnimationProperties.bind(_this);
        _this.beforeAnimationStart = _this.beforeAnimationStart.bind(_this);
        _this.afterAnimationComplete = _this.afterAnimationComplete.bind(_this);
        // Need to set dataSeries (not just dataSeriesProperty) because of dataChanged.subscribe
        _this.dataSeries = (_b = options === null || options === void 0 ? void 0 : options.dataSeries) !== null && _b !== void 0 ? _b : _this.dataSeriesProperty;
        if (options === null || options === void 0 ? void 0 : options.pointMarker) {
            if (!("drawSprite" in options.pointMarker)) {
                if (options.pointMarker.type === PointMarkerType_1.EPointMarkerType.Custom) {
                    options.pointMarker = (0, classFactory_1.createType)(BaseType_1.EBaseType.PointMarker, options.pointMarker.customType, webAssemblyContext, options.pointMarker.options);
                }
                else {
                    options.pointMarker = (0, classFactory_1.createType)(BaseType_1.EBaseType.PointMarker, options.pointMarker.type, webAssemblyContext, options.pointMarker.options);
                }
            }
        }
        _this.pointMarkerProperty = (_c = options === null || options === void 0 ? void 0 : options.pointMarker) !== null && _c !== void 0 ? _c : _this.pointMarkerProperty;
        _this.strokeProperty = (_d = options === null || options === void 0 ? void 0 : options.stroke) !== null && _d !== void 0 ? _d : _this.strokeProperty;
        _this.strokeThicknessProperty = (_e = options === null || options === void 0 ? void 0 : options.strokeThickness) !== null && _e !== void 0 ? _e : _this.strokeThicknessProperty;
        _this.opacityProperty = (_f = options === null || options === void 0 ? void 0 : options.opacity) !== null && _f !== void 0 ? _f : _this.opacityProperty;
        _this.xAxisIdProperty = (_g = options === null || options === void 0 ? void 0 : options.xAxisId) !== null && _g !== void 0 ? _g : _this.xAxisIdProperty;
        _this.yAxisIdProperty = (_h = options === null || options === void 0 ? void 0 : options.yAxisId) !== null && _h !== void 0 ? _h : _this.yAxisIdProperty;
        _this.isVisibleProperty = (_j = options === null || options === void 0 ? void 0 : options.isVisible) !== null && _j !== void 0 ? _j : _this.isVisibleProperty;
        _this.isDigitalLineProperty = (_k = options === null || options === void 0 ? void 0 : options.isDigitalLine) !== null && _k !== void 0 ? _k : _this.isDigitalLineProperty;
        _this.resamplingModeProperty = (_l = options === null || options === void 0 ? void 0 : options.resamplingMode) !== null && _l !== void 0 ? _l : _this.resamplingModeProperty;
        _this.resamplingPrecisionProperty = (_m = options === null || options === void 0 ? void 0 : options.resamplingPrecision) !== null && _m !== void 0 ? _m : _this.resamplingPrecisionProperty;
        if (options === null || options === void 0 ? void 0 : options.effect) {
            if (!("getNativeEffect" in options.effect)) {
                options.effect = (0, classFactory_1.createType)(BaseType_1.EBaseType.ShaderEffect, options.effect.type, webAssemblyContext, options.effect.options);
            }
        }
        _this.effectProperty = options === null || options === void 0 ? void 0 : options.effect;
        if (options === null || options === void 0 ? void 0 : options.paletteProvider) {
            if (!("onAttached" in options.paletteProvider)) {
                if (options.paletteProvider.type === PaletteProviderType_1.EPaletteProviderType.Custom) {
                    options.paletteProvider = (0, classFactory_1.createType)(BaseType_1.EBaseType.PaletteProvider, options.paletteProvider.customType, webAssemblyContext, options.paletteProvider.options);
                }
                else {
                    options.paletteProvider = (0, classFactory_1.createType)(BaseType_1.EBaseType.PaletteProvider, options.paletteProvider.type, webAssemblyContext, options.paletteProvider.options);
                }
            }
        }
        _this.paletteProviderProperty = (_o = options === null || options === void 0 ? void 0 : options.paletteProvider) !== null && _o !== void 0 ? _o : _this.paletteProviderProperty;
        // PaletteProvider.onAttached must be called by the top level series, as the series type is not available here
        _this.drawNaNAsProperty = (_p = options === null || options === void 0 ? void 0 : options.drawNaNAs) !== null && _p !== void 0 ? _p : _this.drawNaNAsProperty;
        _this.hitTestProvider = _this.newHitTestProvider();
        _this.isSelected = (_q = options === null || options === void 0 ? void 0 : options.isSelected) !== null && _q !== void 0 ? _q : false;
        _this.isHovered = (_r = options === null || options === void 0 ? void 0 : options.isHovered) !== null && _r !== void 0 ? _r : false;
        _this.clipToYRangeProperty = (_s = options === null || options === void 0 ? void 0 : options.clipToYRange) !== null && _s !== void 0 ? _s : _this.clipToYRangeProperty;
        _this.yRangeModeProperty = (_t = options === null || options === void 0 ? void 0 : options.yRangeMode) !== null && _t !== void 0 ? _t : _this.yRangeModeProperty;
        if (options === null || options === void 0 ? void 0 : options.onIsVisibleChanged) {
            if (typeof options.onIsVisibleChanged === "string") {
                _this.typeMap.set("onIsVisibleChanged", options.onIsVisibleChanged);
                var visibleChanged_1 = (0, classFactory_1.getFunction)(BaseType_1.EBaseType.OptionFunction, options.onIsVisibleChanged);
                _this.isVisibleChanged.subscribe(function (args) {
                    return visibleChanged_1(args.sourceSeries, args.isVisible);
                });
            }
            else {
                var onIsVisibleChangedCallback_1 = options === null || options === void 0 ? void 0 : options.onIsVisibleChanged;
                _this.isVisibleChanged.subscribe(function (args) {
                    return onIsVisibleChangedCallback_1(args.sourceSeries, args.isVisible);
                });
            }
        }
        if (options === null || options === void 0 ? void 0 : options.onSelectedChanged) {
            if (typeof options.onSelectedChanged === "string") {
                _this.typeMap.set("onSelectedChanged", options.onSelectedChanged);
                var selectionChanged_1 = (0, classFactory_1.getFunction)(BaseType_1.EBaseType.OptionFunction, options.onSelectedChanged);
                _this.selected.subscribe(function (args) {
                    return selectionChanged_1(args.sourceSeries, args.isSelected);
                });
            }
            else {
                var onSelectedChangedCallback_1 = options === null || options === void 0 ? void 0 : options.onSelectedChanged;
                _this.selected.subscribe(function (args) {
                    return onSelectedChangedCallback_1(args.sourceSeries, args.isSelected);
                });
            }
        }
        if (options === null || options === void 0 ? void 0 : options.onHoveredChanged) {
            if (typeof options.onHoveredChanged === "string") {
                _this.typeMap.set("onHoveredChanged", options.onHoveredChanged);
                var hoveredChanged_1 = (0, classFactory_1.getFunction)(BaseType_1.EBaseType.OptionFunction, options.onHoveredChanged);
                _this.hovered.subscribe(function (args) { return hoveredChanged_1(args.sourceSeries, args.hovered); });
            }
            else {
                var hoveredChanged_2 = options === null || options === void 0 ? void 0 : options.onHoveredChanged;
                _this.hovered.subscribe(function (args) { return hoveredChanged_2(args.sourceSeries, args.hovered); });
            }
        }
        if (options === null || options === void 0 ? void 0 : options.animation) {
            if (!("toJSON" in options.animation)) {
                if (options.animation.type === AnimationType_1.EAnimationType.Custom) {
                    options.animation = (0, classFactory_1.createType)(BaseType_1.EBaseType.Animation, options.animation.customType, webAssemblyContext, options.animation.options);
                }
                else {
                    options.animation = (0, classFactory_1.createType)(BaseType_1.EBaseType.Animation, options.animation.type, webAssemblyContext, options.animation.options);
                }
            }
        }
        _this.onDpiChanged = _this.onDpiChanged.bind(_this);
        _this.resamplerHelper = new ExtremeResamplerHelper_1.ExtremeResamplerHelper(webAssemblyContext);
        if (options === null || options === void 0 ? void 0 : options.dataLabelProvider) {
            if (!("draw" in options.dataLabelProvider)) {
                if (options.dataLabelProvider.type === DataLabelProviderType_1.EDataLabelProviderType.Custom) {
                    options.dataLabelProvider = (0, classFactory_1.createType)(BaseType_1.EBaseType.DataLabelProvider, options.dataLabelProvider.customType, webAssemblyContext, options.dataLabelProvider.options);
                }
                else {
                    options.dataLabelProvider = (0, classFactory_1.createType)(BaseType_1.EBaseType.DataLabelProvider, options.dataLabelProvider.type, webAssemblyContext, options.dataLabelProvider.options);
                }
            }
        }
        _this.dataLabelProviderProperty = options === null || options === void 0 ? void 0 : options.dataLabelProvider;
        if (_this.dataLabelProviderProperty) {
            _this.dataLabelProviderProperty.onAttach(webAssemblyContext, _this);
        }
        return _this;
    }
    /** @inheritDoc */
    BaseRenderableSeries.prototype.applyTheme = function (themeProvider) {
        var previousThemeProvider = this.parentSurface.previousThemeProvider;
        if (this.rolloverModifierProps.tooltipTextColor === previousThemeProvider.textAnnotationForeground) {
            this.rolloverModifierProps.tooltipTextColor = themeProvider.textAnnotationForeground;
        }
        if (this.rolloverModifierProps.tooltipColor === previousThemeProvider.textAnnotationBackground) {
            this.rolloverModifierProps.tooltipColor = themeProvider.textAnnotationBackground;
        }
        if (this.rolloverModifierProps.markerColor === previousThemeProvider.textAnnotationBackground) {
            this.rolloverModifierProps.markerColor = themeProvider.textAnnotationBackground;
        }
    };
    Object.defineProperty(BaseRenderableSeries.prototype, "parentSurface", {
        /** @inheritDoc */
        get: function () {
            return this.parentSurfaceProperty;
        },
        /** @inheritDoc */
        set: function (value) {
            this.parentSurfaceProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.PARENT_SURFACE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "drawingProviders", {
        /** @inheritDoc */
        get: function () {
            return this.drawingProvidersProperty;
        },
        /** @inheritDoc */
        set: function (value) {
            this.drawingProvidersProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.DRAWING_PROVIDERS);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "isSelected", {
        /** @inheritDoc */
        get: function () {
            return this.isSelectedProperty;
        },
        /** @inheritDoc */
        set: function (isSelected) {
            var _a;
            if (this.valueChanged(this.isSelectedProperty, isSelected)) {
                this.isSelectedProperty = isSelected;
                (_a = this.selected) === null || _a === void 0 ? void 0 : _a.raiseEvent(new SeriesSelectedArgs_1.SeriesSelectedArgs(this, isSelected));
                this.notifyPropertyChanged(constants_1.PROPERTY.IS_SELECTED);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "isHovered", {
        /** @inheritDoc */
        get: function () {
            return this.isHoveredProperty;
        },
        /** @inheritDoc */
        set: function (isHovered) {
            var _a;
            if (this.valueChanged(this.isHoveredProperty, isHovered)) {
                this.isHoveredProperty = isHovered;
                (_a = this.hovered) === null || _a === void 0 ? void 0 : _a.raiseEvent(new SeriesHoveredArgs_1.SeriesHoveredArgs(this, isHovered));
                this.notifyPropertyChanged(constants_1.PROPERTY.HOVERED);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "paletteProvider", {
        /** @inheritDoc */
        get: function () {
            return this.paletteProviderProperty;
        },
        /** @inheritDoc */
        set: function (paletteProvider) {
            this.setPaletteProvider(paletteProvider);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "isDigitalLine", {
        /** @inheritDoc */
        get: function () {
            return this.isDigitalLineProperty;
        },
        /** @inheritDoc */
        set: function (isDigitalLine) {
            this.isDigitalLineProperty = isDigitalLine;
            this.notifyPropertyChanged(constants_1.PROPERTY.IS_DIGITAL_LINE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "isVisible", {
        /** @inheritDoc */
        get: function () {
            return this.isVisibleProperty;
        },
        /** @inheritDoc */
        set: function (isVisible) {
            var _a;
            if (this.valueChanged(this.isVisibleProperty, isVisible)) {
                this.isVisibleProperty = isVisible;
                if (!isVisible) {
                    if (this.rolloverModifierProps.marker && this.rolloverModifierProps.tooltip) {
                        this.rolloverModifierProps.marker.suspendInvalidate();
                        this.rolloverModifierProps.tooltip.suspendInvalidate();
                        this.rolloverModifierProps.marker.isHidden = true;
                        this.rolloverModifierProps.tooltip.isHidden = true;
                        this.rolloverModifierProps.tooltip.x1 = undefined;
                        this.rolloverModifierProps.tooltip.y1 = undefined;
                    }
                    // TODO should be more general than looking at series type
                    if (this.type === SeriesType_1.ESeriesType.BandSeries &&
                        this.rolloverModifierProps1.marker &&
                        this.rolloverModifierProps1.tooltip) {
                        this.rolloverModifierProps1.marker.suspendInvalidate();
                        this.rolloverModifierProps1.tooltip.suspendInvalidate();
                        this.rolloverModifierProps1.marker.isHidden = true;
                        this.rolloverModifierProps1.tooltip.isHidden = true;
                        this.rolloverModifierProps1.tooltip.x1 = undefined;
                        this.rolloverModifierProps1.tooltip.y1 = undefined;
                    }
                }
                else {
                    // Force rebuild of resample params and indexRange
                    this.resamplingParams = undefined;
                }
                (_a = this.isVisibleChanged) === null || _a === void 0 ? void 0 : _a.raiseEvent(new SeriesVisibleChangedArgs_1.SeriesVisibleChangedArgs(this, isVisible));
                this.notifyPropertyChanged(constants_1.PROPERTY.IS_VISIBLE);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "pointMarker", {
        /** @inheritDoc */
        get: function () {
            return this.pointMarkerProperty;
        },
        /** @inheritDoc */
        set: function (pointMarker) {
            if (this.pointMarkerProperty) {
                this.pointMarkerProperty.invalidateParentCallback = undefined;
            }
            this.pointMarkerProperty = pointMarker;
            this.notifyPropertyChanged(constants_1.PROPERTY.POINT_MARKER);
            if (this.pointMarkerProperty) {
                this.pointMarkerProperty.invalidateParentCallback = this.invalidateParent;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "drawNaNAs", {
        /** @inheritDoc */
        get: function () {
            return this.drawNaNAsProperty;
        },
        /** @inheritDoc */
        set: function (drawNaNAs) {
            this.drawNaNAsProperty = drawNaNAs;
            this.notifyPropertyChanged(constants_1.PROPERTY.DRAW_NAN_AS);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "stroke", {
        /** @inheritDoc */
        get: function () {
            return (0, IThemeProvider_1.stripAutoColor)(this.strokeProperty);
        },
        /** @inheritDoc */
        set: function (htmlColorCode) {
            if (this.strokeProperty !== htmlColorCode) {
                this.strokeProperty = htmlColorCode;
                this.notifyPropertyChanged(constants_1.PROPERTY.STROKE);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "strokeThickness", {
        /** @inheritDoc */
        get: function () {
            return this.strokeThicknessProperty;
        },
        /** @inheritDoc */
        set: function (value) {
            if (this.strokeThicknessProperty !== value) {
                this.strokeThicknessProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.STROKE_THICKNESS);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "opacity", {
        /** @inheritDoc */
        get: function () {
            return this.opacityProperty;
        },
        /** @inheritDoc */
        set: function (value) {
            if (this.opacityProperty !== value) {
                this.opacityProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.OPACITY);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "xAxisId", {
        /** @inheritDoc */
        get: function () {
            return this.xAxisIdProperty;
        },
        /** @inheritDoc */
        set: function (id) {
            this.xAxisIdProperty = id;
            this.notifyPropertyChanged(constants_1.PROPERTY.XAXIS_ID);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "xAxis", {
        /** @inheritDoc */
        get: function () {
            var _this = this;
            var _a;
            return (_a = this.parentSurface) === null || _a === void 0 ? void 0 : _a.xAxes.asArray().find(function (el) { return el.id === _this.xAxisId; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "yAxis", {
        /** @inheritDoc */
        get: function () {
            var _this = this;
            var _a;
            return (_a = this.parentSurface) === null || _a === void 0 ? void 0 : _a.yAxes.asArray().find(function (el) { return el.id === _this.yAxisId; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "yAxisId", {
        /** @inheritDoc */
        get: function () {
            return this.yAxisIdProperty;
        },
        /** @inheritDoc */
        set: function (id) {
            this.yAxisIdProperty = id;
            this.notifyPropertyChanged(constants_1.PROPERTY.YAXIS_ID);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "dataSeries", {
        /** @inheritDoc */
        get: function () {
            return this.dataSeriesProperty;
        },
        /** @inheritDoc */
        set: function (dataSeries) {
            var _a, _b, _c;
            if (this.dataSeriesProperty) {
                var xAxis = (_a = this.parentSurface) === null || _a === void 0 ? void 0 : _a.getXAxisById(this.xAxisId);
                if (xAxis && xAxis.isCategoryAxis) {
                    xAxis.clearCoordCalcCache();
                }
            }
            (_b = this.dataSeriesProperty) === null || _b === void 0 ? void 0 : _b.dataChanged.unsubscribe(this.dataSeriesDataChanged);
            this.dataSeriesProperty = dataSeries;
            (_c = this.dataSeriesProperty) === null || _c === void 0 ? void 0 : _c.dataChanged.subscribe(this.dataSeriesDataChanged);
            this.notifyPropertyChanged(constants_1.PROPERTY.DATA_SERIES);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "enableDrawingOptimisations", {
        /** @inheritDoc */
        get: function () {
            return this.resamplingModeProperty !== ResamplingMode_1.EResamplingMode.None;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "effect", {
        /**
         * Gets an optional {@link ShaderEffect} for modifying the render output of this {@link IRenderableSeries}
         * @remarks Options include {@link GlowEffect} and {@link ShadowEffect}. Apply an effect to see how it modifies rendering!
         */
        get: function () {
            return this.effectProperty;
        },
        /**
         * Sets an optional {@link ShaderEffect} for modifying the render output of this {@link IRenderableSeries}
         * @remarks Options include {@link GlowEffect} and {@link ShadowEffect}. Apply an effect to see how it modifies rendering!
         */
        set: function (effect) {
            var _a, _b;
            (_a = this.effectProperty) === null || _a === void 0 ? void 0 : _a.propertyChanged.unsubscribe(this.effectPropertyChanged);
            this.effectProperty = effect;
            (_b = this.effectProperty) === null || _b === void 0 ? void 0 : _b.propertyChanged.subscribe(this.effectPropertyChanged);
            this.notifyPropertyChanged(constants_1.PROPERTY.EFFECT);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "resamplingMode", {
        /** @inheritDoc */
        get: function () {
            return this.resamplingModeProperty;
        },
        /** @inheritDoc */
        set: function (value) {
            this.resamplingModeProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.RESAMPLING_MODE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "resamplingPrecision", {
        /** @inheritDoc */
        get: function () {
            return this.resamplingPrecisionProperty;
        },
        /** @inheritDoc */
        set: function (value) {
            this.resamplingPrecisionProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.RESAMPLING_PRECISION);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "clipToYRange", {
        /**
         * If true, the drawing will be clipped to the visibleRange of the associated Y Axis.
         * This is only really relevant if you are using Stacked Y Axes and do not want the series to be drawn outside that axis range
         */
        get: function () {
            return this.clipToYRangeProperty;
        },
        set: function (value) {
            if (this.clipToYRangeProperty !== value) {
                this.clipToYRangeProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.CLIPTOYRANGE);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "yRangeMode", {
        /** @inheritDoc */
        get: function () {
            return this.yRangeModeProperty;
        },
        set: function (value) {
            if (this.yRangeModeProperty !== value) {
                this.yRangeModeProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.YRANGEMODE);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "isSpline", {
        /** @inheritDoc */
        get: function () {
            return [SeriesType_1.ESeriesType.SplineBandSeries, SeriesType_1.ESeriesType.SplineLineSeries, SeriesType_1.ESeriesType.SplineMountainSeries].includes(this.type);
        },
        enumerable: false,
        configurable: true
    });
    BaseRenderableSeries.prototype.getResamplingParams = function () {
        return this.resamplingParams;
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.draw = function (renderContext, renderPassData) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawSingleSeriesStart, {
            contextId: this.id,
            parentContextId: (_a = this.parentSurface) === null || _a === void 0 ? void 0 : _a.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        this.currentRenderPassData = renderPassData;
        (_b = this.hitTestProvider) === null || _b === void 0 ? void 0 : _b.update(renderPassData);
        if (this.canDraw) {
            var nativeContext = renderContext.getNativeContext();
            var viewRect = (_c = this.parentSurface) === null || _c === void 0 ? void 0 : _c.seriesViewRect;
            try {
                renderContext.pushShaderEffect(this.effect);
                if (this.clipToYRange) {
                    var _f = renderPassData.xCoordinateCalculator, x = _f.offset, width = _f.viewportDimension;
                    var _g = renderPassData.yCoordinateCalculator, y = _g.offset, height = _g.viewportDimension;
                    if (renderPassData.isVerticalChart) {
                        var clipRect = new Rect_1.Rect(viewRect.x + y, viewRect.y + x, height, width);
                        nativeContext.SetClipRect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
                    }
                    else {
                        var clipRect = new Rect_1.Rect(viewRect.x + x, viewRect.y + y, width, height);
                        nativeContext.SetClipRect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
                    }
                }
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
                if (this.clipToYRange) {
                    // Reset clip rect
                    nativeContext.SetClipRect(viewRect.x, viewRect.y, viewRect.width, viewRect.height);
                }
                renderContext.popShaderEffect();
            }
            if (this.dataLabelProvider) {
                this.dataLabelProvider.generateDataLabels(renderContext, renderPassData);
                // Don't draw Text here. Renderer will call draw once all text has been created to allow for global layout adjustments
            }
        }
        this.resamplingParams = undefined;
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawSingleSeriesEnd, {
            contextId: this.id,
            parentContextId: (_d = this.parentSurface) === null || _d === void 0 ? void 0 : _d.id,
            relatedId: (_e = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _e === void 0 ? void 0 : _e.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.delete = function () {
        this.drawingProviders.forEach(function (dp) { return dp.delete(); });
        this.drawingProviders = [];
        this.dataSeries = (0, Deleter_1.deleteSafe)(this.dataSeries);
        this.effect = (0, Deleter_1.deleteSafe)(this.effect);
        this.pointMarker = (0, Deleter_1.deleteSafe)(this.pointMarker);
        this.resamplerHelper = (0, Deleter_1.deleteSafe)(this.resamplerHelper);
        this.pointSeries = (0, Deleter_1.deleteSafe)(this.pointSeries);
        this.dataLabelProviderProperty = (0, Deleter_1.deleteSafe)(this.dataLabelProvider);
        this.renderDataTransformProperty = (0, Deleter_1.deleteSafe)(this.renderDataTransform);
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.getXRange = function () {
        return this.dataSeries.getXRange(IDataSeries_1.EDataSeriesValueType.Default);
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.getYRange = function (xVisibleRange, isXCategoryAxis) {
        if (isXCategoryAxis === void 0) { isXCategoryAxis = false; }
        var dataSeriesValueType = this.isRunningDataAnimation
            ? IDataSeries_1.EDataSeriesValueType.FinalAnimationValues
            : IDataSeries_1.EDataSeriesValueType.Default;
        // We can't just check and use this.pointSeries because it may be filled, but out of date.
        var pointSeries = this.getResampledPointSeries(isXCategoryAxis);
        // if there is a transform as well, it will run off this.pointSeries
        if (this.renderDataTransform && this.renderDataTransform.useForYRange) {
            this.updateTransformedValues(dataSeriesValueType);
            // TODO transforms probably need a way to provide their own YRange method, as you don't know what shape the data is here.
            return (0, BaseDataSeries_1.getWindowedYRange)(this.webAssemblyContext, this.transformedRenderPassData.pointSeries.xValues, this.transformedRenderPassData.pointSeries.yValues, pointSeries && isXCategoryAxis ? new NumberRange_1.NumberRange(0, pointSeries.count - 1) : xVisibleRange, true, isXCategoryAxis, this.dataSeries.dataDistributionCalculator.isSortedAscending);
        }
        // Use resampled data for autoRange if possible
        if (pointSeries) {
            return (0, BaseDataSeries_1.getWindowedYRange)(this.webAssemblyContext, pointSeries.xValues, pointSeries.yValues, isXCategoryAxis ? new NumberRange_1.NumberRange(0, pointSeries.count - 1) : xVisibleRange, true, isXCategoryAxis, this.dataSeries.dataDistributionCalculator.isSortedAscending);
        }
        return this.dataSeries.getWindowedYRange(xVisibleRange, true, isXCategoryAxis, dataSeriesValueType, this.yRangeMode);
    };
    BaseRenderableSeries.prototype.getResampledPointSeries = function (isXCategoryAxis) {
        var _a, _b;
        if (isXCategoryAxis === void 0) { isXCategoryAxis = false; }
        var pointSeries;
        if (((_a = this.parentSurface) === null || _a === void 0 ? void 0 : _a.renderSurface) && this.supportsResampling) {
            var prevRPD = this.getCurrentRenderPassData();
            if (!this.resamplingParams) {
                var _c = this.parentSurface.renderSurface.viewportSize, width = _c.width, height = _c.height;
                var viewRect = (_b = this.parentSurface.seriesViewRect) !== null && _b !== void 0 ? _b : Rect_1.Rect.create(0, 0, width, height);
                var xAxis = this.xAxis;
                var rp = new ResamplingParams_1.ResamplingParams(viewRect, this, xAxis);
                if (this.needsResampling(rp)) {
                    var resamplingHash = ExtremeResamplerHelper_1.ExtremeResamplerHelper.calculateResamplingHash(this, rp);
                    var useFromCache = Boolean(prevRPD && prevRPD.resamplingHash === resamplingHash);
                    // Resample if necessary.  This also sets this.pointSeries
                    pointSeries = useFromCache ? prevRPD.pointSeries : this.toPointSeries(rp);
                    this.currentRenderPassData = new RenderPassData_1.RenderPassData(this.getIndicesRange(this.xAxis.visibleRange, isXCategoryAxis), this.xAxis.getCurrentCoordinateCalculator, this.yAxis.getCurrentCoordinateCalculator, this.xAxis.isVerticalChart, pointSeries, resamplingHash);
                }
            }
            else if (this.resamplingParams.resampleRequired) {
                // toPointSeries has been run this render and currentRenderPassData has been set.
                pointSeries = this.currentRenderPassData.pointSeries;
            }
        }
        return pointSeries;
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.notifyPropertyChanged = function (propertyName) {
        this.drawingProviders.forEach(function (dp) { return dp.onSeriesPropertyChange(propertyName); });
        this.invalidateParent();
    };
    /**
     * @description Calculates data point width in pixels
     * @param xCoordCalc
     * @param widthFraction
     */
    BaseRenderableSeries.prototype.getDataPointWidth = function (xCoordCalc, widthFraction, widthMode) {
        var xValues = this.dataSeries.getNativeXValues();
        var seriesViewRectWidth = xCoordCalc.viewportDimension;
        var isCategoryAxis = xCoordCalc.isCategoryCoordinateCalculator;
        if (widthMode === DataPointWidthMode_1.EDataPointWidthMode.Range) {
            var range = xCoordCalc.visibleMax - xCoordCalc.visibleMin;
            // This treats dataPointWidth as "xRange per column"
            return (xCoordCalc.viewportDimension / range) * widthFraction;
        }
        else if (widthMode === DataPointWidthMode_1.EDataPointWidthMode.Absolute) {
            return widthFraction;
        }
        else {
            // Relative
            return (0, exports.getDataPointWidth)(xValues, xCoordCalc, seriesViewRectWidth, widthFraction, isCategoryAxis, this.webAssemblyContext);
        }
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.onDetach = function () {
        this.invalidateParentCallback = undefined;
        this.parentSurface = undefined;
        this.drawingProviders.forEach(function (dp) { return dp.onDetachSeries(); });
        this.rolloverModifierProps.setInvalidateParentCallback(undefined);
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.onAttach = function (scs) {
        this.parentSurface = scs;
        if (this.invalidateParentCallback) {
            throw new Error("Invalid operation in sciChartSurface.attachSeries, this series has already been attached to a SciChartSurface. Please detach it from a SciChartSurface before attaching to another");
        }
        this.invalidateParentCallback = scs.invalidateElement;
        this.drawingProviders.forEach(function (dp) { return dp.onAttachSeries(); });
        this.rolloverModifierProps.setInvalidateParentCallback(scs.invalidateElement);
        this.resamplingParams = undefined;
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.hasStrokePaletteProvider = function () {
        var strokePalette = this.paletteProvider;
        return (strokePalette === null || strokePalette === void 0 ? void 0 : strokePalette.overrideStrokeArgb) !== undefined;
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.hasFillPaletteProvider = function () {
        var fillPalette = this.paletteProvider;
        return (fillPalette === null || fillPalette === void 0 ? void 0 : fillPalette.overrideFillArgb) !== undefined;
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.hasPointMarkerPaletteProvider = function () {
        var pointMarkerPalette = this.paletteProvider;
        return (pointMarkerPalette === null || pointMarkerPalette === void 0 ? void 0 : pointMarkerPalette.overridePointMarkerArgb) !== undefined;
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.hasDataSeriesValues = function () {
        var _a;
        return (_a = this.dataSeries) === null || _a === void 0 ? void 0 : _a.hasValues;
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.hasDataSeries = function () {
        return !!this.dataSeries;
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.getDataSeriesValuesCount = function () {
        return this.dataSeries.count();
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.getDataSeriesName = function () {
        var _a;
        return (_a = this.dataSeries) === null || _a === void 0 ? void 0 : _a.dataSeriesName;
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.getNativeXValues = function () {
        return this.dataSeries.getNativeXValues();
    };
    /**
     * Returns the {@link IDataSeries.getNativeYValues} for the associated {@link dataSeries}
     */
    BaseRenderableSeries.prototype.getNativeYValues = function () {
        return this.dataSeries.getNativeYValues();
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.checkIsOutOfDataRange = function (xValue, yValue) {
        var length = this.getDataSeriesValuesCount();
        var isCategoryAxis = this.xAxis.getCurrentCoordinateCalculator().isCategoryCoordinateCalculator;
        var min = isCategoryAxis ? 0 : this.getNativeXValues().get(0);
        var max = isCategoryAxis ? length - 1 : this.getNativeXValues().get(length - 1);
        return xValue < min || xValue > max;
    };
    /**
     * adds palette colors
     */
    BaseRenderableSeries.prototype.pushPalettedColors = function (color, palettingState) {
        palettingState.palettedColors.push_back(color);
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.getSeriesInfo = function (hitTestInfo) {
        switch (hitTestInfo.dataSeriesType) {
            case IDataSeries_1.EDataSeriesType.Ohlc:
                return new OhlcSeriesInfo_1.OhlcSeriesInfo(this, hitTestInfo);
            case IDataSeries_1.EDataSeriesType.Xyy:
                return new XyySeriesInfo_1.XyySeriesInfo(this, hitTestInfo);
            case IDataSeries_1.EDataSeriesType.Xyz:
                return new XyzSeriesInfo_1.XyzSeriesInfo(this, hitTestInfo);
            case IDataSeries_1.EDataSeriesType.HeatmapUniform:
                return new HeatmapSeriesInfo_1.HeatmapSeriesInfo(this, hitTestInfo);
            case IDataSeries_1.EDataSeriesType.HeatmapNonUniform:
                return new HeatmapSeriesInfo_1.HeatmapSeriesInfo(this, hitTestInfo);
            case IDataSeries_1.EDataSeriesType.Hlc:
                return new HlcSeriesInfo_1.HlcSeriesInfo(this, hitTestInfo);
            default:
                return new XySeriesInfo_1.XySeriesInfo(this, hitTestInfo);
        }
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.onDpiChanged = function (args) {
        var _a, _b;
        (_a = this.drawingProviders) === null || _a === void 0 ? void 0 : _a.forEach(function (dp) {
            // Pass down to drawingProviders to invalidate caches
            dp.onDpiChanged(args);
        });
        (_b = this.pointMarker) === null || _b === void 0 ? void 0 : _b.onDpiChanged(args);
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.toJSON = function (excludeData) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (excludeData === void 0) { excludeData = false; }
        var paletteProvider;
        if (this.paletteProvider) {
            if ("toJSON" in this.paletteProvider) {
                paletteProvider = this.paletteProvider.toJSON();
            }
            else {
                throw new Error("Series contains a palletProvider.  This must implement toJSON to be correctly serialized");
            }
        }
        var options = {
            id: this.id,
            drawNaNAs: this.drawNaNAs,
            effect: (_a = this.effect) === null || _a === void 0 ? void 0 : _a.toJSON(),
            isDigitalLine: this.isDigitalLine,
            isHovered: this.isHovered,
            isSelected: this.isSelected,
            isVisible: this.isVisible,
            opacity: this.opacity,
            paletteProvider: paletteProvider,
            pointMarker: (_b = this.pointMarker) === null || _b === void 0 ? void 0 : _b.toJSON(),
            stroke: this.stroke,
            strokeThickness: this.strokeThickness,
            xAxisId: this.xAxisId,
            yAxisId: this.yAxisId,
            animation: this.animation,
            resamplingMode: this.resamplingMode,
            resamplingPrecision: this.resamplingPrecision,
            clipToYRange: this.clipToYRange,
            yRangeMode: this.yRangeMode,
            onIsVisibleChanged: this.typeMap.get("onIsVisibleChanged"),
            onSelectedChanged: this.typeMap.get("onSelectedChanged"),
            onHoveredChanged: this.typeMap.get("onHoveredChanged"),
            // @ts-ignore
            dataLabelProvider: (_c = this.dataLabelProvider) === null || _c === void 0 ? void 0 : _c.toJSON()
            // onSelectedChanged: this.onSelectedChanged
        };
        var dataSeriesDefinition = (_d = this.dataSeries) === null || _d === void 0 ? void 0 : _d.toJSON(excludeData);
        var dataSeriesOptions = dataSeriesDefinition === null || dataSeriesDefinition === void 0 ? void 0 : dataSeriesDefinition.options;
        if (((_e = this.dataSeries) === null || _e === void 0 ? void 0 : _e.type) === IDataSeries_1.EDataSeriesType.Xy) {
            return { type: this.type, options: options, xyData: dataSeriesOptions };
        }
        else if (((_f = this.dataSeries) === null || _f === void 0 ? void 0 : _f.type) === IDataSeries_1.EDataSeriesType.Xyy) {
            return { type: this.type, options: options, xyyData: dataSeriesOptions };
        }
        else if (((_g = this.dataSeries) === null || _g === void 0 ? void 0 : _g.type) === IDataSeries_1.EDataSeriesType.Xyz) {
            return { type: this.type, options: options, xyzData: dataSeriesOptions };
        }
        else if (((_h = this.dataSeries) === null || _h === void 0 ? void 0 : _h.type) === IDataSeries_1.EDataSeriesType.Ohlc) {
            return { type: this.type, options: options, ohlcData: dataSeriesOptions };
        }
        else if (((_j = this.dataSeries) === null || _j === void 0 ? void 0 : _j.type) === IDataSeries_1.EDataSeriesType.Hlc) {
            return { type: this.type, options: options, hlcData: dataSeriesOptions };
        }
        else if (((_k = this.dataSeries) === null || _k === void 0 ? void 0 : _k.type) === IDataSeries_1.EDataSeriesType.XyText) {
            return { type: this.type, options: options, xyTextData: dataSeriesOptions };
        }
        else if (((_l = this.dataSeries) === null || _l === void 0 ? void 0 : _l.type) === IDataSeries_1.EDataSeriesType.HeatmapUniform) {
            return {
                type: this.type,
                options: options,
                heatmapData: dataSeriesOptions
            };
        }
        else if (((_m = this.dataSeries) === null || _m === void 0 ? void 0 : _m.type) === IDataSeries_1.EDataSeriesType.HeatmapNonUniform) {
            return {
                type: this.type,
                options: options,
                heatmapData: dataSeriesOptions
            };
        }
        else {
            return { type: this.type, options: options };
        }
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.enqueueAnimation = function (animation) {
        this.animationQueue.push(animation);
        this.invalidateParent();
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.runAnimation = function (animation) {
        var _a;
        this.animationQueue = [];
        (_a = this.animationFSM) === null || _a === void 0 ? void 0 : _a.toCompleted();
        this.enqueueAnimation(animation);
    };
    Object.defineProperty(BaseRenderableSeries.prototype, "animation", {
        /**
         * Sets a start up animation class, a child class for {@link SeriesAnimation}
         */
        set: function (value) {
            if (value) {
                this.animationQueue.push(value);
            }
            this.invalidateParent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "isRunningAnimation", {
        /** @inheritDoc */
        get: function () {
            return animationHelpers_1.animationHelpers.checkIsAnimationRunning(this.animationQueue, this.animationFSM);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "isRunningDataAnimation", {
        /**
         * gets if a data animation is currently running
         */
        get: function () {
            return (this.isRunningAnimation &&
                this.animationFSM &&
                (this.animationFSM.animation.isDataSeriesAnimation || this.animationFSM.animation.isOnStartAnimation));
        },
        enumerable: false,
        configurable: true
    });
    /** @inheritDoc */
    BaseRenderableSeries.prototype.onAnimate = function (timeElapsed) {
        var _a;
        if (!this.animationFSM || ((_a = this.animationFSM) === null || _a === void 0 ? void 0 : _a.is([AnimationFiniteStateMachine_1.EAnimationState.Completed]))) {
            if (this.animationQueue.length >= 1) {
                var animation = this.animationQueue.shift();
                this.animationFSM = new AnimationFiniteStateMachine_1.SeriesAnimationFiniteStateMachine(animation, this);
            }
            else {
                this.animationFSM = undefined;
            }
        }
        if (!this.animationFSM)
            return;
        if (!this.dataSeries.xInitialAnimationValues) {
            this.dataSeries.createAnimationVectors();
        }
        animationHelpers_1.animationHelpers.animationUpdate(this.animationFSM, timeElapsed, this.beforeAnimationStart, this.afterAnimationComplete, this.updateAnimationProperties);
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.toPointSeries = function (rp) {
        if (rp) {
            if (!this.pointSeries) {
                this.pointSeries = new XyPointSeriesResampled_1.XyPointSeriesResampled(this.webAssemblyContext, rp.xVisibleRange);
            }
            else {
                this.pointSeries.xRange = rp.xVisibleRange;
            }
            var result = this.resamplerHelper.resampleIntoPointSeries(this.webAssemblyContext, rp, this.dataSeries.getNativeXValues(), this.dataSeries.getNativeYValues(), this.pointSeries.intIndexes, this.pointSeries.indexes, this.pointSeries.xValues, this.pointSeries.yValues, false);
            this.pointSeries.fifoStartIndex = result.OutputSplitIndex;
            // This is now done in the resampling above
            //this.pointSeries.updateIndexes();
            this.pointSeries.clearIntIndexes();
            //console.log("resampling ", this.type, this.pointSeries.count);
            // this.pointSeries.debugOutputForUnitTests();
            return this.pointSeries;
        }
        else {
            //console.log("NOT resampling ", this.type, this.dataSeries.count());
            return new XyPointSeriesWrapped_1.XyPointSeriesWrapped(this.dataSeries);
        }
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.getIndicesRange = function (xRange, isCategoryData) {
        var _a;
        if (isCategoryData === void 0) { isCategoryData = false; }
        return (_a = this.dataSeries) === null || _a === void 0 ? void 0 : _a.getIndicesRange(xRange, isCategoryData);
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.getCurrentRenderPassData = function () {
        return this.currentRenderPassData;
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.setCurrentRenderPassData = function (renderPassData) {
        var _a;
        this.currentRenderPassData = renderPassData;
        (_a = this.hitTestProvider) === null || _a === void 0 ? void 0 : _a.update(renderPassData);
    };
    Object.defineProperty(BaseRenderableSeries.prototype, "supportsResampling", {
        /** @inheritDoc */
        get: function () {
            var seriesTypeSupportsResampling = ![
                SeriesType_1.ESeriesType.UniformContoursSeries,
                SeriesType_1.ESeriesType.UniformHeatmapSeries,
                SeriesType_1.ESeriesType.NonUniformHeatmapSeries,
                SeriesType_1.ESeriesType.BubbleSeries,
                // ESeriesType.ScatterSeries,
                SeriesType_1.ESeriesType.ErrorBarsSeries
            ].includes(this.type);
            return (seriesTypeSupportsResampling &&
                !SciChartDefaults_1.SciChartDefaults.debugDisableResampling &&
                !this.isStacked &&
                this.dataSeries &&
                this.dataSeries.count() > 0 &&
                (this.enableDrawingOptimisations || this.dataSeries.fifoCapacity) &&
                (this.dataSeries.dataDistributionCalculator.isSortedAscending || this.xAxis.isCategoryAxis)
            //!this.dataSeries.fifoSweeping
            );
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Used internally to check if resampling is needed for the renderable series
     * @protected
     */
    BaseRenderableSeries.prototype.needsResampling = function (rp) {
        this.resamplingParams = rp;
        this.resamplingParams.resampleRequired = this.resamplerHelper.needsResampling(rp, this.getNativeXValues());
        return this.resamplingParams.resampleRequired;
    };
    Object.defineProperty(BaseRenderableSeries.prototype, "dataLabelProvider", {
        /** @inheritDoc */
        get: function () {
            return this.dataLabelProviderProperty;
        },
        /** @inheritDoc */
        set: function (provider) {
            this.dataLabelProviderProperty = provider;
            provider.onAttach(this.webAssemblyContext, this);
            this.notifyPropertyChanged(constants_1.PROPERTY.SERIES_TEXT_PROVIDER);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseRenderableSeries.prototype, "renderDataTransform", {
        /** @inheritDoc */
        get: function () {
            return this.renderDataTransformProperty;
        },
        /** @inheritDoc */
        set: function (transform) {
            if (transform.parentSeries !== this) {
                throw new Error("renderDataTransform can only be added to the series it was created with");
            }
            this.renderDataTransformProperty = transform;
            this.notifyPropertyChanged(constants_1.PROPERTY.SERIES_TEXT_PROVIDER);
        },
        enumerable: false,
        configurable: true
    });
    /** @inheritDoc */
    BaseRenderableSeries.prototype.resolveAutoColors = function (index, maxSeries, theme) {
        if (this.strokeProperty.startsWith(IThemeProvider_1.AUTO_COLOR)) {
            var color = this.parentSurface.themeProvider.getStrokeColor(index, maxSeries, this.webAssemblyContext);
            this.stroke = IThemeProvider_1.AUTO_COLOR + this.adjustAutoColor("stroke", color);
        }
        if (this.pointMarker) {
            this.pointMarker.resolveAutoColors(index, maxSeries, theme);
        }
        if (this.dataLabelProvider) {
            this.dataLabelProvider.resolveAutoColors(index, maxSeries, theme);
        }
    };
    /** @inheritDoc */
    BaseRenderableSeries.prototype.adjustAutoColor = function (propertyName, color) {
        return color;
    };
    /**
     * Runs renderdataTransform to set transformedRenderPassData, usually for use with ranging.
     */
    BaseRenderableSeries.prototype.updateTransformedValues = function (valueType) {
        var _a;
        if (!this.dataSeries || !this.parentSurface || !this.renderDataTransform) {
            return;
        }
        var renderDataToTransform;
        if (this.currentRenderPassData &&
            (valueType !== null && valueType !== void 0 ? valueType : IDataSeries_1.EDataSeriesValueType.Default) === IDataSeries_1.EDataSeriesValueType.Default) {
            renderDataToTransform = this.currentRenderPassData;
        }
        else {
            var pointSeries = ((_a = this.resamplingParams) === null || _a === void 0 ? void 0 : _a.resampleRequired)
                ? this.pointSeries
                : new XyPointSeriesWrapped_1.XyPointSeriesWrapped(this.dataSeries, undefined, valueType);
            renderDataToTransform = new RenderPassData_1.RenderPassData(this.getIndicesRange(this.xAxis.visibleRange, this.xAxis.isCategoryAxis), this.xAxis.getCurrentCoordinateCalculator, this.yAxis.getCurrentCoordinateCalculator, this.xAxis.isVerticalChart, pointSeries);
        }
        this.transformedRenderPassData = this.renderDataTransform.runTransform(renderDataToTransform);
    };
    /**
     * Sets initial and end animation vectors
     * @param animation
     * @protected
     */
    BaseRenderableSeries.prototype.setAnimationVectors = function (animation) {
        var ds = this.dataSeries;
        if (animation.isOnStartAnimation) {
            ds.setFinalAnimationVectors(ds);
        }
        else if (animation.isDataSeriesAnimation) {
            ds.setInitialAnimationVectors(ds);
            ds.setFinalAnimationVectors(animation.dataSeries);
            ds.validateAnimationVectors();
        }
    };
    /**
     * Runs before the animation starts
     * @protected
     */
    BaseRenderableSeries.prototype.beforeAnimationStart = function () {
        var _a;
        var animation = this.animationFSM.animation;
        this.setAnimationVectors(animation);
        var animationPointMarkerStyle = (_a = animation === null || animation === void 0 ? void 0 : animation.styles) === null || _a === void 0 ? void 0 : _a.pointMarker;
        if (animationPointMarkerStyle) {
            this.pointMarker = animationHelpers_1.animationHelpers.createPointMarker(this.webAssemblyContext, animationPointMarkerStyle);
        }
    };
    /**
     * Runs after the animation is complete
     * @protected
     */
    BaseRenderableSeries.prototype.afterAnimationComplete = function () {
        if (this.dataSeries) {
            var ds = this.dataSeries;
            ds.setInitialAnimationVectors(undefined);
            ds.setFinalAnimationVectors(undefined);
        }
    };
    /**
     * Internal method that runs on each animation tick
     * @param progress The current animation progress, a value from 0 to 1
     * @param animationFSM The animation finite state machine
     * @protected
     */
    BaseRenderableSeries.prototype.updateAnimationProperties = function (progress, animationFSM) {
        var animation = animationFSM.animation;
        animation.updateSeriesProperties(this, animationFSM.initialStyles, animationFSM.animationProgress);
        var dataSeries = this.dataSeries;
        if (dataSeries) {
            dataSeries.updateAnimationProperties(progress, animation);
            // force pointseries to be recreated otherwise animations will not work for resampled data
            this.currentRenderPassData = undefined;
        }
        if (this.renderDataTransform) {
            this.renderDataTransform.requiresTransform = true;
        }
        if (this.invalidateParentCallback) {
            this.invalidateParentCallback();
        }
    };
    /**
     * Is being called when the data for the underlying DataSeries changes
     * @protected
     */
    BaseRenderableSeries.prototype.dataSeriesDataChanged = function (args) {
        if (this.renderDataTransform) {
            this.renderDataTransform.onDataChange(args);
        }
        this.invalidateParent();
    };
    BaseRenderableSeries.prototype.valueChanged = function (oldValue, newValue) {
        return oldValue !== newValue;
    };
    BaseRenderableSeries.prototype.setPaletteProvider = function (paletteProvider) {
        var _a, _b;
        if ((_a = this.paletteProviderProperty) === null || _a === void 0 ? void 0 : _a.onDetached) {
            this.paletteProviderProperty.onDetached();
        }
        this.paletteProviderProperty = paletteProvider;
        if ((_b = this.paletteProviderProperty) === null || _b === void 0 ? void 0 : _b.onAttached) {
            this.paletteProviderProperty.onAttached(this);
        }
        this.notifyPropertyChanged(constants_1.PROPERTY.PALETTE_PROVIDER);
    };
    BaseRenderableSeries.prototype.invalidateParent = function () {
        if (this.invalidateParentCallback) {
            this.invalidateParentCallback();
        }
    };
    BaseRenderableSeries.prototype.effectPropertyChanged = function () {
        this.invalidateParent();
    };
    Object.defineProperty(BaseRenderableSeries.prototype, "canDraw", {
        get: function () {
            return animationHelpers_1.animationHelpers.checkCanDraw(this.animationFSM);
        },
        enumerable: false,
        configurable: true
    });
    return BaseRenderableSeries;
}(DeletableEntity_1.DeletableEntity));
exports.BaseRenderableSeries = BaseRenderableSeries;
/** @ignore */
var getDataPointWidth = function (xValues, xCoordCalc, seriesViewRectWidth, widthFraction, isCategoryAxis, wasmContext) {
    if (widthFraction < 0 || widthFraction > 1) {
        throw new Error("WidthFraction should be between 0.0 and 1.0 inclusive");
    }
    // TODO: vertical chart
    var count = xValues.size();
    var dataPointWidth = seriesViewRectWidth;
    var barsAmount = count;
    // TODO: logarithmic axis
    if (barsAmount > 1) {
        var max = Number.MIN_VALUE;
        var min = Number.MAX_VALUE;
        if (isCategoryAxis) {
            max = xCoordCalc.getCoordinate(count - 1);
            min = xCoordCalc.getCoordinate(0);
        }
        else {
            var minMax = void 0;
            try {
                minMax = wasmContext.NumberUtil.MinMax(xValues);
                // if (!isRealNumber(minMax.minD) || !isRealNumber(minMax.maxD)) {
                //     return new NumberRange(0, 0);
                // }
                min = minMax.minD;
                max = minMax.maxD;
            }
            finally {
                (0, Deleter_1.deleteSafe)(minMax);
            }
            max = xCoordCalc.getCoordinate(max);
            min = xCoordCalc.getCoordinate(min);
        }
        dataPointWidth = Math.abs(max - min) / (barsAmount - 1);
    }
    // This can give different width depending on x value, which does not make sense
    // else if (barsAmount === 1) {
    //    dataPointWidth = Math.min(dataPointWidth, xCoordCalc.getCoordinate(xValues.get(0)) * 2);
    // }
    var candleWidth = Math.floor(dataPointWidth * widthFraction);
    if (candleWidth % 2 !== 0) {
        candleWidth -= 1;
    }
    if (candleWidth <= 1) {
        candleWidth = 1;
    }
    return candleWidth;
};
exports.getDataPointWidth = getDataPointWidth;
/** @ignore */
var getDelta = function (_a) {
    var pointSize = _a.pointSize, areaSize = _a.areaSize, range = _a.range;
    if (areaSize === 0) {
        return 0;
    }
    var pointScaled = pointSize * DpiHelper_1.DpiHelper.PIXEL_RATIO;
    var k = areaSize / (areaSize - pointScaled);
    return (Math.abs(range.diff) * (k - 1)) / 2;
};
exports.getDelta = getDelta;
