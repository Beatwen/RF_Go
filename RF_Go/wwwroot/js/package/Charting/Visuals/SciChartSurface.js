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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SciChartSubSurface = exports.SciChartSurface = exports.sciChartConfig = void 0;
var chartBuilder_1 = require("../../Builder/chartBuilder");
var classFactory_1 = require("../../Builder/classFactory");
var app_1 = require("../../constants/app");
var performanceWarnings_1 = require("../../constants/performanceWarnings");
var EasingFunctions_1 = require("../../Core/Animations/EasingFunctions");
var BuildStamp_1 = require("../../Core/BuildStamp");
var Deleter_1 = require("../../Core/Deleter");
var Dictionary_1 = require("../../Core/Dictionary");
var EventHandler_1 = require("../../Core/EventHandler");
var ObservableArray_1 = require("../../Core/ObservableArray");
var Rect_1 = require("../../Core/Rect");
var Thickness_1 = require("../../Core/Thickness");
var AutoColorMode_1 = require("../../types/AutoColorMode");
var BaseType_1 = require("../../types/BaseType");
var SeriesType_1 = require("../../types/SeriesType");
var Size_1 = require("../../types/Size");
var SvgClippingMode_1 = require("../../types/SvgClippingMode");
var ZoomState_1 = require("../../types/ZoomState");
var parseColor_1 = require("../../utils/parseColor");
var translate_1 = require("../../utils/translate");
var ChartModifierBase_1 = require("../ChartModifiers/ChartModifierBase");
var BatchRenderContext_1 = require("../Drawing/BatchRenderContext");
var BrushCache_1 = require("../Drawing/BrushCache");
var RenderSurface_1 = require("../Drawing/RenderSurface");
var SolidBrushCache_1 = require("../Drawing/SolidBrushCache");
var WebGlRenderContext2D_1 = require("../Drawing/WebGlRenderContext2D");
var LayoutManager_1 = require("../LayoutManager/LayoutManager");
var SciChartRenderer_1 = require("../Services/SciChartRenderer");
var AdornerLayer_1 = require("./Annotations/AdornerLayer");
var AnnotationBase_1 = require("./Annotations/AnnotationBase");
var AxisBase2D_1 = require("./Axis/AxisBase2D");
var AxisCore_1 = require("./Axis/AxisCore");
var createMaster_1 = require("./createMaster");
var createSingle_1 = require("./createSingle");
var createNativeRect_1 = require("./Helpers/createNativeRect");
var drawBorder_1 = require("./Helpers/drawBorder");
var NativeObject_1 = require("./Helpers/NativeObject");
var StackedColumnCollection_1 = require("./RenderableSeries/StackedColumnCollection");
var StackedMountainCollection_1 = require("./RenderableSeries/StackedMountainCollection");
var sciChartInitCommon_1 = require("./sciChartInitCommon");
var SciChartSurfaceBase_1 = require("./SciChartSurfaceBase");
var DpiHelper_1 = require("./TextureManager/DpiHelper");
var UpdateSuspender_1 = require("./UpdateSuspender");
var Point_1 = require("../../Core/Point");
var SciChartDefaults_1 = require("./SciChartDefaults");
var ChartTitleRenderer_1 = require("../Services/ChartTitleRenderer");
var TextStyle_1 = require("../../types/TextStyle");
var TextPosition_1 = require("../../types/TextPosition");
var Globals_1 = require("../../Core/Globals");
var createMaster3d_1 = require("../../Charting3D/Visuals/createMaster3d");
var LayoutMangerType_1 = require("../../types/LayoutMangerType");
var logger_1 = require("../../utils/logger");
var perfomance_1 = require("../../utils/perfomance");
exports.sciChartConfig = {};
/**
 * @summary The {@link SciChartSurface} is the root 2D Chart control in SciChart's High Performance Real-time
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript Chart Library}
 * @description
 * To create a chart using SciChart, declare a {@link SciChartSurface} using {@link SciChartSurface.create},
 * add X and Y axes to the {@link SciChartSurface.xAxes} {@link SciChartSurface.yAxes} collection.
 *
 * Next, add a series or chart type by adding a {@link BaseRenderableSeries} to the {@link SciChartSurface.renderableSeries} collection.
 *
 * You can add annotations and markers using the {@link SciChartSurface.annotations} property, and you can add zoom and pan behaviours,
 * tooltips and more by using the {@link SciChartSurface.chartModifiers} property.
 *
 * To redraw a {@link SciChartSurface} at any time, call {@link SciChartSurface.invalidateElement}, however all properties are reactive and the
 * chart will automatically redraw if data or properties change.
 * @remarks
 * It is possible to have more than one {@link SciChartSurface} on screen at the same time.
 * {@link SciChartSurface | SciChartSurfaces} scale to fit the parent DIV where they are hosted. Use CSS to position the DIV.
 */
var SciChartSurface = /** @class */ (function (_super) {
    __extends(SciChartSurface, _super);
    /**
     * Creates an instance of the {@link SciChartSurface}
     * @param webAssemblyContext The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param options optional parameters of type {@link ISciChartSurfaceOptions} used to configure the {@link SciChartSurface}
     */
    function SciChartSurface(webAssemblyContext, options) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        _this = _super.call(this, webAssemblyContext, options === null || options === void 0 ? void 0 : options.canvases) || this;
        /**
         * Used internally - the {@link RenderContext2D} for drawing
         */
        //public renderContext2D: RenderContext2D;
        /**
         * An event handler which notifies its subscribers when a render operation starts. Use this
         * to update elements of the chart for the current render.  Any updates made here will not trigger a subsequent render.
         */
        _this.preRender = new EventHandler_1.EventHandler();
        _this.preRenderAll = new EventHandler_1.EventHandler();
        // TODO make these properties internal only; or add some provider
        _this.layersOffset = 0;
        _this.stepBetweenLayers = 10;
        _this.isSubSurface = false;
        /**
         * Sets / Gets the clipping mode for SVG Annotations
         */
        _this.svgClippingMode = SvgClippingMode_1.ESvgClippingMode.SeriesViewRect;
        /**
         * Normally, native labels are drawn all at once at the end of the render cycle to improve performance.
         * In circumstances where you want to draw over the labels, eg with a subchart, set this true to have them drawn earlier.
         */
        _this.renderNativeAxisLabelsImmediately = false;
        /** The position of the watermark for trials and community licenses */
        _this.watermarkPosition = SciChartDefaults_1.SciChartDefaults.watermarkPosition;
        /** Set true to position the watermark relative to the overall canvas, rather than the series area.   */
        _this.watermarkRelativeToCanvas = false;
        _this.animationList = [];
        _this.titleStyleProperty = {
            fontSize: 60,
            fontFamily: "Arial",
            color: SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME.chartTitleColor,
            fontWeight: "normal",
            fontStyle: "normal",
            lineSpacing: 1.1,
            padding: Thickness_1.Thickness.fromString("10 4 10 4"),
            multilineAlignment: TextPosition_1.EMultiLineAlignment.Center,
            rotation: undefined,
            alignment: TextStyle_1.ETextAlignment.Center,
            position: TextStyle_1.ETitlePosition.Top,
            placeWithinChart: false,
            useNativeText: SciChartDefaults_1.SciChartDefaults.useNativeText
        };
        //function to create a proxy for the object, which traps the setter
        _this.getPaddingProxy = function (newPadding) {
            return new Proxy(newPadding, {
                set: function (target, key, value) {
                    //@ts-ignore
                    if (target[key] !== value) {
                        //@ts-ignore
                        target[key] = value;
                        _this.invalidateElement();
                    }
                    return true;
                }
            });
        };
        _this.paddingProperty = _this.getPaddingProxy(Thickness_1.Thickness.fromNumber(10));
        _this.zoomStateProperty = ZoomState_1.EZoomState.AtExtents;
        _this.viewportBorderProperty = {
            borderBottom: undefined,
            borderLeft: undefined,
            borderRight: undefined,
            borderTop: undefined,
            color: "#00000000",
            border: undefined
        };
        _this.canvasBorderProperty = {
            borderBottom: undefined,
            borderLeft: undefined,
            borderRight: undefined,
            borderTop: undefined,
            color: "#00000000",
            border: undefined
        };
        _this.subChartsProperty = [];
        _this.drawSeriesBehindAxisProperty = false;
        _this.autoColorModeProperty = AutoColorMode_1.EAutoColorMode.OnAddRemoveSeries;
        _this.autoColorRequired = true;
        _this.xCoordSvgTrans = 0;
        _this.yCoordSvgTrans = 0;
        _this.subChartCounter = 0;
        var canvasWidth = (_b = (_a = _this.domCanvas2D) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : app_1.DEFAULT_WIDTH;
        var canvasHeight = (_d = (_c = _this.domCanvas2D) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : app_1.DEFAULT_HEIGHT;
        _this.webAssemblyContext2D = webAssemblyContext;
        if (!app_1.IS_TEST_ENV) {
            var canvasPixelWidth = canvasWidth / DpiHelper_1.DpiHelper.PIXEL_RATIO;
            var canvasPixelHeight = canvasHeight / DpiHelper_1.DpiHelper.PIXEL_RATIO;
            if (_this.isCopyCanvasSurface) {
                _this.changeMasterCanvasViewportSize(webAssemblyContext, canvasPixelWidth, canvasPixelHeight);
            }
            else {
                _this.changeWebGLCanvasViewportSize(webAssemblyContext, canvasPixelWidth, canvasPixelHeight);
            }
        }
        _this.invalidateElement = _this.invalidateElement.bind(_this);
        _this.onRenderSurfaceDraw = _this.onRenderSurfaceDraw.bind(_this);
        var viewportSize = _this.domCanvas2D
            ? new Size_1.Size(canvasWidth, canvasHeight)
            : new Size_1.Size(app_1.DEFAULT_WIDTH, app_1.DEFAULT_HEIGHT);
        _this.renderSurface = new RenderSurface_1.RenderSurface(webAssemblyContext, viewportSize, (_e = _this.domCanvas2D) === null || _e === void 0 ? void 0 : _e.id);
        _this.renderSurface.handleDraw = _this.onRenderSurfaceDraw;
        _this.sciChartRenderer = new SciChartRenderer_1.SciChartRenderer(_this);
        _this.chartTitleRendererProperty = new ChartTitleRenderer_1.ChartTitleRenderer(_this.webAssemblyContext2D);
        _this.layoutManager = new LayoutManager_1.LayoutManager();
        // TODO: remove this
        //if (this.domCanvas2D) {
        //     this.renderContext2D = new RenderContext2D(this.domCanvas2D);
        //}
        // Setup series
        _this.detachSeries = _this.detachSeries.bind(_this);
        _this.attachSeries = _this.attachSeries.bind(_this);
        _this.renderableSeries = new ObservableArray_1.ObservableArray();
        _this.renderableSeries.collectionChanged.subscribe(function (args) {
            var _a, _b;
            (_a = args.getOldItems()) === null || _a === void 0 ? void 0 : _a.forEach(_this.detachSeries);
            (_b = args.getNewItems()) === null || _b === void 0 ? void 0 : _b.forEach(_this.attachSeries);
        });
        // Setup axis
        _this.detachAxis = _this.detachAxis.bind(_this);
        _this.attachAxis = _this.attachAxis.bind(_this);
        _this.xAxes = new ObservableArray_1.ObservableArray();
        _this.yAxes = new ObservableArray_1.ObservableArray();
        var handler = function (args, isXAxis) {
            var _a, _b;
            (_a = args.getOldItems()) === null || _a === void 0 ? void 0 : _a.forEach(function (axis) {
                axis.visibleRangeChanged.unsubscribeAll();
                _this.detachAxis(axis);
            });
            (_b = args.getNewItems()) === null || _b === void 0 ? void 0 : _b.forEach(function (a) { return _this.attachAxis(a, isXAxis); });
        };
        _this.xAxes.collectionChanged.subscribe(function (arg) { return handler(arg, true); });
        _this.yAxes.collectionChanged.subscribe(function (arg) { return handler(arg, false); });
        _this.adornerLayer = new AdornerLayer_1.AdornerLayer(_this);
        _this.solidBrushCacheViewportBorder = new SolidBrushCache_1.SolidBrushCache(webAssemblyContext);
        _this.solidBrushCacheCanvasBorder = new SolidBrushCache_1.SolidBrushCache(webAssemblyContext);
        // Watermark
        if (!app_1.IS_TEST_ENV) {
            _this.watermarkProperties = new webAssemblyContext.SCRTWaterMarkProperties();
            _this.watermarkPropertyPosition = new webAssemblyContext.TSRVector2(0, 0);
            _this.watermarkProperties.SetPosition(_this.watermarkPropertyPosition);
            _this.watermarkProperties.SetOpacity(0.5);
            webAssemblyContext.SCRTSetWaterMarkProperties(_this.watermarkProperties);
        }
        return _this;
    }
    /**
     * Creates a {@link SciChartSurface} and {@link TSciChart | WebAssembly Context} to occupy the div by element ID in your DOM.
     * @remarks This method is async and must be awaited
     * @param divElement The Div Element ID or reference where the {@link SciChartSurface} will reside
     * @param options Optional - Optional parameters for chart creation. See {@link I2DSurfaceOptions} for more details
     */
    SciChartSurface.create = function (divElement, options) {
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.InitializationStart, { contextId: options === null || options === void 0 ? void 0 : options.id });
        (0, chartBuilder_1.ensureRegistrations)();
        options = SciChartSurface.resolveOptions(options);
        if (app_1.IS_TEST_ENV) {
            return this.createTest(divElement, options);
        }
        else {
            return (0, createMaster_1.createMultichart)(divElement, options).then(function (result) {
                var _a;
                result.sciChartSurface.applyOptions(options);
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.InitializationEnd, {
                    parentContextId: result.sciChartSurface.domCanvas2D.id,
                    contextId: result.sciChartSurface.id,
                    relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId
                });
                return result;
            });
        }
    };
    SciChartSurface.disposeSharedWasmContext = function () {
        if (Globals_1.sciChart3DDestinations.length === 0 && Globals_1.sciChartDestinations.length === 0) {
            (0, createMaster_1.disposeMultiChart)();
            (0, createMaster3d_1.disposeMultiChart3d)();
        }
        _super.disposeSharedWasmContext.call(this);
    };
    /**
     * Performs a similar operation to {@link SciChartSurface.create} but uses a dedicated WebAssembly context for this chart, and draws directly to the target canvas
     * This provides better performance for a single chart, but there is a limit (16) to how many you can have on one page.
     * If you need large numbers of charts all updating at the same time, use this, together with {@link addSubChart} to create many charts on one surface.
     * @param divElement The Div Element ID or reference where the {@link SciChartSurface} will reside
     * @param options - optional parameters for chart creation. See {@link I2DSurfaceOptions} for more details
     */
    SciChartSurface.createSingle = function (divElement, options) {
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.InitializationStart, { contextId: options === null || options === void 0 ? void 0 : options.id });
        (0, chartBuilder_1.ensureRegistrations)();
        options = SciChartSurface.resolveOptions(options);
        if (app_1.IS_TEST_ENV) {
            return this.createTest(divElement, options);
        }
        else {
            return (0, createSingle_1.createSingleInternal)(divElement, options).then(function (result) {
                var _a;
                result.sciChartSurface.applyOptions(options);
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.InitializationEnd, {
                    parentContextId: result.sciChartSurface.domCanvas2D.id,
                    contextId: result.sciChartSurface.id,
                    relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId
                });
                return result;
            });
        }
    };
    /**
     * Allows setting of web URL for Wasm and Data files, in the case you are loading SciChart outside of npm/webpack environment.
     * Note the version number of data/wasm Urls must match the version number of SciChart.js you are using.
     * To use the default CDN, just call SciChart.SciChartSurface.useWasmFromCDN();
     * @example
     * ```ts
     * import { libraryVersion } from "scichart/Core/BuildStamp";
     *
     * SciChart.SciChartSurface.configure({
     *  dataUrl: `https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart2d.data`,
     *  wasmUrl: `https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart2d.wasm`
     * });
     * ```
     * @param config
     */
    SciChartSurface.configure = function (config) {
        var _a, _b;
        exports.sciChartConfig.dataUrl = (_a = config === null || config === void 0 ? void 0 : config.dataUrl) !== null && _a !== void 0 ? _a : undefined;
        exports.sciChartConfig.wasmUrl = (_b = config === null || config === void 0 ? void 0 : config.wasmUrl) !== null && _b !== void 0 ? _b : undefined;
    };
    /**
     * Tell SciChart to load the Wasm and Data files from CDN, rather than expecting them to be served by the host server.
     * @deprecated the method name breaks [eslint react-hooks/rules-of-hooks](https://legacy.reactjs.org/docs/hooks-rules.html).
     * To avoid this error in React, use {@link loadWasmFromCDN} instead.
     *
     */
    SciChartSurface.useWasmFromCDN = function () {
        exports.sciChartConfig.dataUrl = "https://cdn.jsdelivr.net/npm/scichart@".concat(BuildStamp_1.libraryVersion, "/_wasm/scichart2d.data");
        exports.sciChartConfig.wasmUrl = "https://cdn.jsdelivr.net/npm/scichart@".concat(BuildStamp_1.libraryVersion, "/_wasm/scichart2d.wasm");
    };
    /**
     * Tell SciChart to load the Wasm and Data files from the local server, rather than from CDN.
     * @deprecated the method name breaks [eslint react-hooks/rules-of-hooks](https://legacy.reactjs.org/docs/hooks-rules.html).
     * To avoid this error in React, use {@link loadWasmLocal} instead.
     *
     */
    SciChartSurface.useWasmLocal = function () {
        SciChartSurface.configure(undefined);
    };
    /**
     * Tell SciChart to load the Wasm and Data files from CDN, rather than expecting them to be served by the host server.
     */
    SciChartSurface.loadWasmFromCDN = function () {
        return SciChartSurface.useWasmFromCDN();
    };
    /**
     * Tell SciChart to load the Wasm and Data files from the local server, rather than from CDN.
     */
    SciChartSurface.loadWasmLocal = function () {
        return SciChartSurface.useWasmLocal();
    };
    SciChartSurface.isSubSurface = function (surface) {
        return surface.isSubSurface;
    };
    SciChartSurface.createTest = function (divElement, options) {
        var _a, _b;
        var canvases = sciChartInitCommon_1.default.initCanvas(divElement, (_a = options === null || options === void 0 ? void 0 : options.widthAspect) !== null && _a !== void 0 ? _a : 0, (_b = options === null || options === void 0 ? void 0 : options.heightAspect) !== null && _b !== void 0 ? _b : 0, sciChartInitCommon_1.default.ECanvasType.canvas2D);
        var sciChartSurface = new SciChartSurface(exports.sciChartConfig.testWasm, { canvases: canvases });
        sciChartSurface.applyTheme(options === null || options === void 0 ? void 0 : options.theme);
        sciChartSurface.applyOptions(options);
        return new Promise(function (resolve) {
            return resolve({ wasmContext: sciChartSurface.webAssemblyContext2D, sciChartSurface: sciChartSurface });
        });
    };
    /**
     * Add another chart to an existing surface.
     * This is a performance optimization if you need to have multiple charts all updating together, eg because they have synced axes.
     * We suggest you use SciChartSurface.createSingle for the parent surface.  The parent surface does not have to have any chart elements defined.
     * The position property required in the options determines the placement and size of the subchart.  Its values are interpreted differently depending on the coordinateMode
     * Modifiers using modifierGroup will work across other subcharts on the surface, but not to any other surface.
     */
    SciChartSurface.prototype.addSubChart = function (options) {
        var _a;
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.AddSubSurfaceStart, {
            contextId: options === null || options === void 0 ? void 0 : options.id,
            parentContextId: this.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        var optionsBase = SciChartSurface.resolveOptions(options);
        options = __assign(__assign({}, options), optionsBase);
        this.subChartCounter++;
        var divElementId = this.domChartRoot.id + "_" + this.subChartCounter.toString();
        var chartRoot = this.domChartRoot;
        var width = chartRoot.clientWidth;
        var height = chartRoot.clientHeight;
        // SVG Root Element
        var svgRootElement = (0, sciChartInitCommon_1.createSvgLayer)("".concat(divElementId, "_SVG"), width, height);
        svgRootElement.style.left = "0";
        svgRootElement.style.top = "0";
        svgRootElement.style.pointerEvents = "none";
        svgRootElement.classList.add(sciChartInitCommon_1.ELayerClass.FRONT_SVG_ROOT);
        chartRoot.appendChild(svgRootElement);
        // SVG Root Element
        var backgroundSvgRootElement = (0, sciChartInitCommon_1.createSvgLayer)("".concat(divElementId, "_BACKGROUND_SVG"), width, height);
        backgroundSvgRootElement.style.left = "0";
        backgroundSvgRootElement.style.top = "0";
        backgroundSvgRootElement.style.pointerEvents = "none";
        backgroundSvgRootElement.classList.add(sciChartInitCommon_1.ELayerClass.BACK_SVG_ROOT);
        chartRoot.insertBefore(backgroundSvgRootElement, this.getMainCanvas());
        // Background Div Root Element
        var backgroundDomRoot = document.createElement("div");
        backgroundDomRoot.id = "".concat(divElementId, "_background_div");
        backgroundDomRoot.classList.add(sciChartInitCommon_1.ELayerClass.DIV_ROOT, sciChartInitCommon_1.ELayerClass.BACK_DIV_ROOT);
        backgroundDomRoot.style.left = "0";
        backgroundDomRoot.style.top = "0";
        backgroundDomRoot.style.position = "absolute";
        backgroundDomRoot.style.pointerEvents = "none";
        chartRoot.insertBefore(backgroundDomRoot, backgroundSvgRootElement);
        var canvases = {
            domChartRoot: this.domChartRoot,
            domCanvasWebGL: this.domCanvasWebGL,
            domCanvas2D: this.domCanvas2D,
            domSvgContainer: svgRootElement,
            domSvgAdornerLayer: this.domSvgAdornerLayer,
            domDivContainer: this.domDivContainer,
            domBackgroundSvgContainer: backgroundSvgRootElement,
            domSeriesBackground: backgroundDomRoot
        };
        var subSurface = new SciChartSubSurface(this.webAssemblyContext2D, {
            canvases: canvases,
            parentSurface: this,
            subSurfaceOptions: options
        });
        if (options === null || options === void 0 ? void 0 : options.theme) {
            subSurface.applyTheme(options.theme);
        }
        // subcharts get mouse events from parent
        subSurface.mouseManager.unsubscribe();
        this.subChartsProperty.push(subSurface);
        this.onAttachSubSurface(subSurface);
        subSurface.setIsInitialized();
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.AddSubSurfaceEnd, {
            contextId: subSurface.id,
            relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
            parentContextId: this.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        return subSurface;
    };
    /**
     * Remove an existing subChart from a parent surface.  See {@link addSubChart}
     */
    SciChartSurface.prototype.removeSubChart = function (subChart) {
        var index = this.subChartsProperty.findIndex(function (s) { return s === subChart; });
        if (index > -1) {
            this.subChartsProperty.splice(index, 1);
            subChart.delete();
        }
    };
    Object.defineProperty(SciChartSurface.prototype, "subCharts", {
        /**
         * The list of subCharts on this surface.  See {@link addSubChart}
         */
        get: function () {
            return this.subChartsProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "surfaceType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return SciChartSurfaceBase_1.ESurfaceType.SciChartSurfaceType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "layoutManager", {
        /**
         * Gets or sets the {@link LayoutManager}
         */
        get: function () {
            return this.layoutManagerProperty;
        },
        /**
         * Used internally - gets or sets the {@link LayoutManager}
         */
        set: function (value) {
            this.layoutManagerProperty = value;
            this.layoutManagerProperty.sciChartSurface = this;
            this.invalidateElement();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "chartTitleRenderer", {
        /**
         * Controls the rendering of {@link SiCharSurface.title}
         */
        get: function () {
            return this.chartTitleRendererProperty;
        },
        set: function (value) {
            var _a;
            (_a = this.chartTitleRendererProperty) === null || _a === void 0 ? void 0 : _a.delete();
            this.chartTitleRendererProperty = value;
            this.invalidateElement();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "dataLabelLayoutManager", {
        /**
         * Gets or sets the {@link ISeriesTextLayoutManager} for performing text layout across multiple series
         */
        get: function () {
            return this.dataLabelLayoutManagerProperty;
        },
        /**
         * Used internally - gets or sets the {@link ISeriesTextLayoutManager} for performing text layout across multiple series
         */
        set: function (value) {
            this.dataLabelLayoutManagerProperty = value;
            this.invalidateElement();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "title", {
        /**
         * Gets or sets the title for the SciChartSurface
         */
        get: function () {
            return this.titleProperty;
        },
        /**
         * Gets or sets the title for the SciChartSurface
         */
        set: function (value) {
            if (this.titleProperty !== value) {
                this.titleProperty = value;
                this.invalidateElement();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "titleStyle", {
        /**
         * Gets or sets the title text style and placement for the SciChartSurface as {@link TChartTitleStyle}
         */
        get: function () {
            return this.titleStyleProperty;
        },
        /**
         * Gets or sets the title text style and placement for the SciChartSurface as {@link TChartTitleStyle}
         * @remarks if updating, should be set as an object (or partial object) of type {@link TChartTitleStyle},
         * instead of directly setting individual properties
         */
        set: function (value) {
            if (this.titleStyleProperty !== value) {
                this.titleStyleProperty = Object.assign({}, this.titleStyleProperty, value);
                this.invalidateElement();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "padding", {
        /**
         * Gets or sets the Padding between the SciChartSurface and its inner elements, in order top, right, bottom, left
         */
        get: function () {
            return this.paddingProperty;
        },
        set: function (padding) {
            if (!Thickness_1.Thickness.areEqual(this.paddingProperty, padding)) {
                this.paddingProperty = this.getPaddingProxy(padding);
                this.invalidateElement();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "adjustedPadding", {
        /**
         * Gets the adjusted padding between the SciChartSurface and its inner elements, in order top, right, bottom, left
         * Defines a resulting padding accordingly to DPI scaling.
         */
        get: function () {
            return DpiHelper_1.DpiHelper.adjustThickness(this.padding);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "debugRendering", {
        /**
         * Gets or sets a property whether rendering should be debugged. This will draw rectangles around key boxes and areas on the chart.
         * Used internally for development purposes
         */
        get: function () {
            return this.debugRenderingProperty;
        },
        /**
         * Gets or sets a property whether rendering should be debugged. This will draw rectangles around key boxes and areas on the chart.
         * Used internally for development purposes
         */
        set: function (debugRendering) {
            this.debugRenderingProperty = debugRendering;
            this.invalidateElement();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "autoColorMode", {
        /**
         * Gets or sets the {@link EAutoColorMode} which determines when resolution of AUTO_COLOR should occur
         */
        get: function () {
            return this.autoColorModeProperty;
        },
        /**
         * Gets or sets the {@link EAutoColorMode} which determines when resolution of AUTO_COLOR should occur
         */
        set: function (autoColorMode) {
            this.autoColorModeProperty = autoColorMode;
            if (autoColorMode !== AutoColorMode_1.EAutoColorMode.Never && !this.autoColorRequired) {
                this.autoColorRequired = true;
            }
            else if (autoColorMode === AutoColorMode_1.EAutoColorMode.Never) {
                this.autoColorRequired = false;
            }
            this.invalidateElement();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "isInvalidated", {
        get: function () {
            var _a;
            return (_a = this.sciChartRenderer) === null || _a === void 0 ? void 0 : _a.isInvalidated;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SciChartSurface.prototype.applyTheme = function (themeProvider) {
        // TODO move to base when title is implemented on 3d charts
        var previousThemeProvider = this.previousThemeProvider;
        if (this.titleStyle.color === previousThemeProvider.chartTitleColor) {
            this.titleStyle = { color: themeProvider.chartTitleColor };
        }
        _super.prototype.applyTheme.call(this, themeProvider);
        this.renderableSeries.asArray().forEach(function (rs) { return rs.applyTheme(themeProvider); });
        this.xAxes.asArray().forEach(function (axis) { return axis.applyTheme(themeProvider); });
        this.yAxes.asArray().forEach(function (axis) { return axis.applyTheme(themeProvider); });
    };
    /**
     * @inheritDoc
     */
    SciChartSurface.prototype.changeViewportSize = function (pixelWidth, pixelHeight) {
        logger_1.Logger.debug("changeViewportSize");
        if (!pixelWidth || !pixelHeight || this.isDeleted) {
            return;
        }
        // Changing the viewportSize
        var backBufferWidth = pixelWidth * DpiHelper_1.DpiHelper.PIXEL_RATIO;
        var backBufferHeight = pixelHeight * DpiHelper_1.DpiHelper.PIXEL_RATIO;
        this.renderSurface.viewportSize = new Size_1.Size(backBufferWidth, backBufferHeight);
        if (this.isCopyCanvasSurface) {
            this.changeMasterCanvasViewportSize(this.webAssemblyContext2D, pixelWidth, pixelHeight);
            if (this.domCanvas2D) {
                DpiHelper_1.DpiHelper.setSize(this.domCanvas2D, pixelWidth, pixelHeight);
            }
        }
        else {
            this.changeWebGLCanvasViewportSize(this.webAssemblyContext2D, pixelWidth, pixelHeight);
        }
        // Notice: this.domSvgContainer is updated in SciChartRenderer.resizeAnnotationRootElements() method
        if (this.domSvgAdornerLayer) {
            this.domSvgAdornerLayer.setAttribute("width", pixelWidth.toString());
            this.domSvgAdornerLayer.setAttribute("height", pixelHeight.toString());
        }
        for (var _i = 0, _a = this.subChartsProperty; _i < _a.length; _i++) {
            var chart = _a[_i];
            chart.updateSubLayout();
        }
        // Bypass the isSuspended check, otherwise the chart will go blank if it is resized while suspended
        this.invalidateElement({ force: true });
    };
    /**
     * @inheritDoc
     */
    SciChartSurface.prototype.invalidateElement = function (options) {
        var _a, _b;
        logger_1.Logger.debug("Invalidating ".concat((_b = (_a = this.domChartRoot) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : this.id, ": force=").concat(options === null || options === void 0 ? void 0 : options.force, " isSuspended=").concat(this.isSuspended, " isInitialized=").concat(this.isInitialized, "."));
        // When isSuspended (see suspendUpdates() function) ignore drawing
        if (!(options === null || options === void 0 ? void 0 : options.force) && (this.isSuspended || this.isDeleted || !this.isInitialized)) {
            return;
        }
        perfomance_1.PerformanceDebugHelper.mark(this.sciChartRenderer.isInvalidated
            ? perfomance_1.EPerformanceMarkType.Invalidate
            : perfomance_1.EPerformanceMarkType.LeadingInvalidate, { contextId: this.id });
        if (!this.sciChartRenderer.isInvalidated) {
            this.sciChartRenderer.isInvalidated = true;
            // console.trace("Invalidating ", this.domChartRoot.id);
            var canvasId = this.domCanvas2D ? this.domCanvas2D.id : "undefinedCanvasId";
            this.renderSurface.invalidateElement(canvasId);
        }
    };
    // Step_5: Get context and pass drawing to SciChartRenderer
    SciChartSurface.prototype.doDrawingLoop = function (context) {
        var _a;
        if (this.isDeleted)
            return;
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawingLoopStart, {
            contextId: this.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        context = context !== null && context !== void 0 ? context : this.renderSurface.getRenderContext();
        this.currentWebGlRenderContextProperty = context;
        try {
            var sus = new UpdateSuspender_1.UpdateSuspender(this, false); // Don't want to invalidate on resume
            try {
                if (this.autoColorRequired &&
                    ((this.themeProvider.strokePalette && this.themeProvider.strokePalette.length > 0) ||
                        (this.themeProvider.fillPalette && this.themeProvider.fillPalette.length > 0))) {
                    this.resolveAutoColors();
                    if (this.autoColorMode !== AutoColorMode_1.EAutoColorMode.Always) {
                        this.autoColorRequired = false;
                    }
                }
                this.preRender.raiseEvent(context);
            }
            catch (err) {
                if (err === null || err === void 0 ? void 0 : err.message) {
                    console.error(err === null || err === void 0 ? void 0 : err.message);
                }
                console.error(err);
            }
            finally {
                sus.resume();
            }
            this.sciChartRenderer.render(context);
            var isInvalidated = this.isInvalidated;
            perfomance_1.PerformanceDebugHelper.mark(isInvalidated ? perfomance_1.EPerformanceMarkType.Rendered : perfomance_1.EPerformanceMarkType.FullStateRendered, { contextId: this.id });
            this.rendered.raiseEvent(isInvalidated);
        }
        catch (err) {
            // @ts-ignore
            if (err.name === "BindingError") {
                console.error(err);
                console.warn("Binding errors can occur if a previous chart using the same div id was not deleted correctly, or if you try to share data or series between charts that use different webassembly contexts.");
                (0, NativeObject_1.freeCache)(this.webAssemblyContext2D).delete();
            }
            else if (this.domChartRoot) {
                console.error("Error from chart in div ".concat(this.domChartRoot.id, ":"), err);
            }
            else {
                // Surface the error for tests
                throw err;
            }
        }
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawingLoopEnd, {
            contextId: this.id,
            relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
    };
    /**
     * @inheritDoc
     */
    SciChartSurface.prototype.delete = function (clearHtml) {
        if (clearHtml === void 0) { clearHtml = true; }
        if (this.isDeleted) {
            try {
                if (process.env.NODE_ENV !== "production") {
                    console.warn("Trying to delete the surface with ID = \"".concat(this.id, ")\", which has already been deleted!"));
                }
            }
            catch (err) {
                console.warn(err);
            }
            return;
        }
        for (var _i = 0, _a = this.subChartsProperty; _i < _a.length; _i++) {
            var chart = _a[_i];
            chart.delete();
        }
        this.subChartsProperty = [];
        if (this.layoutManagerProperty.type === LayoutMangerType_1.ELayoutManagerType.Synchronised) {
            if (this.layoutManagerProperty.verticalGroup) {
                this.layoutManagerProperty.verticalGroup.removeSurface(this);
            }
            if (this.layoutManagerProperty.horizontalGroup) {
                this.layoutManagerProperty.horizontalGroup.removeSurface(this);
            }
        }
        this.layoutManagerProperty.sciChartSurface = undefined;
        this.layoutManagerProperty = undefined;
        this.renderableSeries.asArray().forEach(function (rs) { return rs.delete(); });
        this.renderableSeries.clear();
        this.xAxes.asArray().forEach(function (xAxis) { return xAxis.delete(); });
        this.yAxes.asArray().forEach(function (yAxis) { return yAxis.delete(); });
        this.solidBrushCacheViewportBorder = (0, Deleter_1.deleteSafe)(this.solidBrushCacheViewportBorder);
        this.solidBrushCacheCanvasBorder = (0, Deleter_1.deleteSafe)(this.solidBrushCacheCanvasBorder);
        this.watermarkProperties = (0, Deleter_1.deleteSafe)(this.watermarkProperties);
        this.watermarkPropertyPosition = (0, Deleter_1.deleteSafe)(this.watermarkPropertyPosition);
        this.chartTitleRendererProperty = (0, Deleter_1.deleteSafe)(this.chartTitleRenderer);
        this.sciChartRenderer = undefined;
        this.renderSurface = undefined;
        this.clearRootElement(clearHtml);
        _super.prototype.delete.call(this);
    };
    /**
     * @inheritDoc
     */
    SciChartSurface.prototype.onDpiChanged = function (args) {
        var _a, _b;
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DpiChange, { contextId: this.id });
        logger_1.Logger.debug("onDpiChanged");
        this.renderableSeries.asArray().forEach(function (rs) { return rs.onDpiChanged(args); });
        this.xAxes.asArray().forEach(function (a) { return a.onDpiChanged(); });
        this.yAxes.asArray().forEach(function (a) { return a.onDpiChanged(); });
        // Force a viewport size change as size-changed may not fire when parent div has width, height
        this.changeViewportSize((_a = this.getMainCanvas()) === null || _a === void 0 ? void 0 : _a.clientWidth, (_b = this.getMainCanvas()) === null || _b === void 0 ? void 0 : _b.clientHeight);
        _super.prototype.onDpiChanged.call(this, args);
    };
    /**
     * Gets the {@link AxisBase2D | XAxis} which matches the axisId. Returns undefined if not axis found
     * @param axisId The AxisId to search for
     */
    SciChartSurface.prototype.getXAxisById = function (axisId) {
        var axis = this.xAxes.getById(axisId);
        if (!axis && axisId === AxisCore_1.AxisCore.DEFAULT_AXIS_ID && this.xAxes.size() > 0) {
            axis = this.xAxes.get(0);
        }
        return axis;
    };
    /**
     * Gets the {@link AxisBase2D | YAxis} which matches the axisId. Returns undefined if not axis found
     * @param axisId The AxisId to search for
     */
    SciChartSurface.prototype.getYAxisById = function (axisId) {
        var axis = this.yAxes.getById(axisId);
        if (!axis && axisId === AxisCore_1.AxisCore.DEFAULT_AXIS_ID && this.yAxes.size() > 0) {
            axis = this.yAxes.get(0);
        }
        return axis;
    };
    /**
     * Update accumulated vectors for all stacked collections
     */
    SciChartSurface.prototype.updateStackedCollectionAccumulatedVectors = function () {
        var stackedCollection = this.renderableSeries.asArray().filter(function (el) { return el.isStacked && "size" in el; });
        stackedCollection.forEach(function (el) { return el.updateAccumulatedVectors(); });
    };
    /**
     * @summary Zooms the {@link SciChartSurface} in the X and Y direction to extents of all data (zoom to fit)
     * @description
     * @param animationDurationMs An optional animation duration. Default value is 0, which means 'no animation'
     * @param easingFunction An optional easing function for animations. See {@link TEasingFn} for a list of values
     * @param onCompleted the callback function
     */
    SciChartSurface.prototype.zoomExtents = function (animationDurationMs, easingFunction, onCompleted) {
        if (animationDurationMs === void 0) { animationDurationMs = 0; }
        if (easingFunction === void 0) { easingFunction = EasingFunctions_1.easing.outExpo; }
        if (onCompleted === void 0) { onCompleted = function () { }; }
        this.updateStackedCollectionAccumulatedVectors();
        var xSize = this.xAxes === undefined ? 0 : this.xAxes.size();
        var ySize = this.yAxes === undefined ? 0 : this.yAxes.size();
        if (xSize === 0 || ySize === 0) {
            throw new Error("Cannot ZoomExtents when XAxes or YAxes is undefined or empty");
        }
        // Update the VisibleRange of X Axes
        var xRanges = this.zoomExtentsXInternal(animationDurationMs, easingFunction, onCompleted);
        // Now ZoomExtents on Y for N Y-axes
        this.zoomExtentsYInternal(xRanges, animationDurationMs, easingFunction, onCompleted);
    };
    /**
     * @summary Zooms the {@link SciChartSurface} in the X direction to extents of all data (zoom to fit)
     * @description
     * @param animationDurationMs An optional animation duration. Default value is 0, which means 'no animation'
     * @param easingFunction An optional easing function for animations. See {@link TEasingFn} for a list of values
     */
    SciChartSurface.prototype.zoomExtentsX = function (animationDurationMs, easingFunction) {
        if (animationDurationMs === void 0) { animationDurationMs = 0; }
        if (easingFunction === void 0) { easingFunction = EasingFunctions_1.easing.outExpo; }
        this.zoomExtentsXInternal(animationDurationMs, easingFunction);
    };
    /**
     * @summary Zooms the {@link SciChartSurface} in the Y direction to extents of all data (zoom to fit)
     * @description
     * @param animationDurationMs An optional animation duration. Default value is 0, which means 'no animation'
     * @param easingFunction An optional easing function for animations. See {@link TEasingFn} for a list of values
     */
    SciChartSurface.prototype.zoomExtentsY = function (animationDurationMs, easingFunction) {
        if (animationDurationMs === void 0) { animationDurationMs = 0; }
        if (easingFunction === void 0) { easingFunction = EasingFunctions_1.easing.outExpo; }
        this.zoomExtentsYInternal(undefined, animationDurationMs, easingFunction);
    };
    /**
     * @inheritDoc
     */
    SciChartSurface.prototype.updateWatermark = function (left, bottom) {
        var _a;
        if (!app_1.IS_TEST_ENV) {
            this.watermarkPropertyPosition.x = left;
            this.watermarkPropertyPosition.y = bottom;
            this.watermarkProperties.m_fCanvasWidth = this.renderSurface.viewportSize.width;
            this.watermarkProperties.SetPosition(this.watermarkPropertyPosition);
            var isLightBackground = (_a = this.themeProvider) === null || _a === void 0 ? void 0 : _a.isLightBackground;
            this.watermarkProperties.m_bIsDarkBackground = isLightBackground !== undefined ? !isLightBackground : false;
            this.webAssemblyContext2D.SCRTSetWaterMarkProperties(this.watermarkProperties);
        }
    };
    /**
     * Sets zoomStateProperty
     * @param zoomState
     */
    SciChartSurface.prototype.setZoomState = function (zoomState) {
        this.zoomStateProperty = zoomState;
    };
    Object.defineProperty(SciChartSurface.prototype, "zoomState", {
        /**
         * Gets zoomStateProperty
         */
        get: function () {
            return this.zoomStateProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "viewportBorder", {
        /**
         * Gets or sets the SciChartSurface Viewport Border properties
         */
        get: function () {
            return this.viewportBorderProperty;
        },
        /**
         * Gets or sets the SciChartSurface Viewport Border properties
         */
        set: function (value) {
            this.viewportBorderProperty = __assign(__assign({}, this.viewportBorderProperty), value);
            this.notifyPropertyChanged("ViewportBorder");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "canvasBorder", {
        /**
         * Gets or sets the SciChartSurface Canvas Border properties
         */
        get: function () {
            return this.canvasBorderProperty;
        },
        /**
         * Gets or sets the SciChartSurface Canvas Border properties
         */
        set: function (value) {
            this.canvasBorderProperty = __assign(__assign({}, this.canvasBorderProperty), value);
            this.notifyPropertyChanged("Border");
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Used internally - draws SciChartSurface borders
     */
    SciChartSurface.prototype.drawBorder = function (renderContext) {
        // Draw Viewport Border
        (0, drawBorder_1.drawBorder)(renderContext, this.webAssemblyContext2D, this.solidBrushCacheViewportBorder, this.seriesViewRect, this.leftViewportBorder, this.topViewportBorder, this.rightViewportBorder, this.bottomViewportBorder, this.viewportBorder.color);
        // Draw Canvas Border
        var canvasSize = renderContext.viewportSize;
        var canvasBorderRect = Rect_1.Rect.create(this.leftCanvasBorder, this.topCanvasBorder, Math.floor(canvasSize.width - this.leftCanvasBorder - this.rightCanvasBorder), Math.floor(canvasSize.height - this.topCanvasBorder - this.bottomCanvasBorder));
        (0, drawBorder_1.drawBorder)(renderContext, this.webAssemblyContext2D, this.solidBrushCacheCanvasBorder, canvasBorderRect, this.leftCanvasBorder, this.topCanvasBorder, this.rightCanvasBorder, this.bottomCanvasBorder, this.canvasBorder.color);
    };
    Object.defineProperty(SciChartSurface.prototype, "leftViewportBorder", {
        /**
         * Gets the SciChartSurface Viewport Left Border
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this.viewportBorder.borderLeft) !== null && _a !== void 0 ? _a : this.viewportBorder.border) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "rightViewportBorder", {
        /**
         * Gets the SciChartSurface Viewport Right Border
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this.viewportBorder.borderRight) !== null && _a !== void 0 ? _a : this.viewportBorder.border) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "topViewportBorder", {
        /**
         * Gets the SciChartSurface Viewport Top Border
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this.viewportBorder.borderTop) !== null && _a !== void 0 ? _a : this.viewportBorder.border) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "bottomViewportBorder", {
        /**
         * Gets the SciChartSurface Viewport Bottom Border
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this.viewportBorder.borderBottom) !== null && _a !== void 0 ? _a : this.viewportBorder.border) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "leftCanvasBorder", {
        /**
         * Gets the SciChartSurface Canvas Left Border
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this.canvasBorder.borderLeft) !== null && _a !== void 0 ? _a : this.canvasBorder.border) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "rightCanvasBorder", {
        /**
         * Gets the SciChartSurface Canvas Right Border
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this.canvasBorder.borderRight) !== null && _a !== void 0 ? _a : this.canvasBorder.border) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "topCanvasBorder", {
        /**
         * Gets the SciChartSurface Canvas Top Border
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this.canvasBorder.borderTop) !== null && _a !== void 0 ? _a : this.canvasBorder.border) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "bottomCanvasBorder", {
        /**
         * Gets the SciChartSurface Canvas Bottom Border
         */
        get: function () {
            var _a, _b;
            return (_b = (_a = this.canvasBorder.borderBottom) !== null && _a !== void 0 ? _a : this.canvasBorder.border) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurface.prototype, "currentWebGlRenderContext", {
        get: function () {
            return this.currentWebGlRenderContextProperty;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Is being called on each render, to run animations
     * @param timeElapsed
     */
    SciChartSurface.prototype.onAnimate = function (timeElapsed) {
        this.renderableSeries.asArray().forEach(function (rs) { return rs.onAnimate(timeElapsed); });
        // advance all animations in queue
        var remainingAnimations = [];
        for (var i = 0; i < this.animationList.length; i++) {
            var animation = this.animationList[i];
            if (!animation.isComplete) {
                animation.update(timeElapsed);
                if (!animation.isComplete) {
                    remainingAnimations.push(animation);
                }
            }
        }
        this.animationList = remainingAnimations;
    };
    /**
     * Gets the generic animations currently on the surface. Do not manipulate this array directly.
     * To add, use addAnimation.  To remove, find an animation and call .cancel() on it.
     */
    SciChartSurface.prototype.getAnimations = function () {
        return this.animationList;
    };
    /**
     * Add a {@link GenericAnimation} to the surface.
     * Multiple animations will be run in parallel, so if you want to run one after another, use the onCompleted callback
     * to add another animation after the first completes
     */
    SciChartSurface.prototype.addAnimation = function () {
        var _this = this;
        var animations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            animations[_i] = arguments[_i];
        }
        if (animations === undefined)
            return;
        animations.forEach(function (a) { return _this.animationList.push(a); });
        this.invalidateElement();
    };
    Object.defineProperty(SciChartSurface.prototype, "isRunningAnimation", {
        /**
         * Returns true if an animation is running
         */
        get: function () {
            for (var i = 0; i < this.renderableSeries.size(); i++) {
                if (this.renderableSeries.get(i).isRunningAnimation) {
                    return true;
                }
            }
            return this.animationList.some(function (a) { return !a.isComplete; });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the seriesViewRect padding relative to the canvas
     * @param scaled If True returns scaled values, if False divided by {@link DpiHelper.PIXEL_RATIO}
     * Use not scaled values for SVG annotations and the Legend
     */
    SciChartSurface.prototype.getSeriesViewRectPadding = function (scaled) {
        if (scaled === void 0) { scaled = true; }
        if (!this.seriesViewRect) {
            throw new Error("Cannot get seriesViewRect before layout has ocurred. Move code that calls to be triggered by sciChartSurface.rendered");
        }
        var divider = scaled ? 1 : DpiHelper_1.DpiHelper.PIXEL_RATIO;
        var seriesViewRect = this.seriesViewRect;
        var left = seriesViewRect.left / divider;
        var top = seriesViewRect.top / divider;
        var right = (this.domCanvas2D.width - seriesViewRect.right) / divider;
        var bottom = (this.domCanvas2D.height - seriesViewRect.bottom) / divider;
        return new Thickness_1.Thickness(top, right, bottom, left);
    };
    /** Calls resolveAutoColors on each series to resolve colors marked as auto based on the seriesColorPalette */
    SciChartSurface.prototype.resolveAutoColors = function (maxSeries) {
        if (!maxSeries) {
            var stackedCollections = this.renderableSeries
                .asArray()
                .filter(function (el) { return el.isStacked && "size" in el; });
            maxSeries = this.renderableSeries.size() - stackedCollections.length;
            for (var _i = 0, stackedCollections_1 = stackedCollections; _i < stackedCollections_1.length; _i++) {
                var sc = stackedCollections_1[_i];
                maxSeries += sc.size();
            }
        }
        var index = 0;
        for (var i = 0; i < this.renderableSeries.size(); i++) {
            var rs = this.renderableSeries.get(i);
            if (rs) {
                rs.resolveAutoColors(index, maxSeries, this.themeProvider);
            }
            if (rs.isStacked && "size" in rs) {
                index += rs.size();
            }
            else {
                index += 1;
            }
        }
    };
    /**
     *
     * @param fontName Register a font to be used with native text.
     * @param url
     * @returns
     */
    SciChartSurface.prototype.registerFont = function (fontName, url) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!fontName.includes(".")) {
                    fontName += ".ttf";
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var callback = _this.webAssemblyContext2D.SCRTFileLoadCallbackInterface.implement({
                            OnLoadComplete: function (success, message) {
                                if (success) {
                                    resolve(true);
                                }
                                else {
                                    console.error("Failed to load ".concat(fontName, " from ").concat(url, ".  Error: ").concat(message));
                                    resolve(false);
                                }
                            }
                        });
                        _this.webAssemblyContext2D.SCRTRegisterFile(fontName, url, callback);
                    })];
            });
        });
    };
    /**
     * Used internally - sets SVG Canvas Translation
     * @param x
     * @param y
     */
    SciChartSurface.prototype.setCoordSvgTranslation = function (x, y) {
        this.xCoordSvgTrans = x;
        this.yCoordSvgTrans = y;
    };
    /**
     * Gets SVG Canvas Translation, used to draw on SVG Canvas using different {@link ESvgClippingMode}
     */
    SciChartSurface.prototype.getCoordSvgTranslation = function () {
        return new Point_1.Point(this.xCoordSvgTrans, this.yCoordSvgTrans);
    };
    /**
     * Convert the object to a definition that can be serialized to JSON, or used directly with the builder api
     * @param excludeData if set true, data values will not be included in the json.
     */
    SciChartSurface.prototype.toJSON = function (excludeData) {
        var _a;
        if (excludeData === void 0) { excludeData = false; }
        var theme;
        if ("toJSON" in this.themeProvider) {
            // @ts-ignore
            theme = this.themeProvider.toJSON();
        }
        else {
            theme = this.themeProvider;
        }
        var options = {
            id: this.id,
            title: this.title,
            titleStyle: this.titleStyle,
            canvasBorder: this.canvasBorder,
            heightAspect: this.heightAspect,
            widthAspect: this.widthAspect,
            layoutManager: (_a = this.layoutManager) === null || _a === void 0 ? void 0 : _a.toJSON(),
            padding: this.padding,
            theme: theme,
            viewportBorder: this.viewportBorder,
            loader: this.loaderJson,
            drawSeriesBehindAxis: this.drawSeriesBehindAxis,
            disableAspect: this.disableAspect,
            createSuspended: this.createSuspended,
            autoColorMode: this.autoColorMode,
            touchAction: this.touchActionProperty,
            freezeWhenOutOfView: this.freezeWhenOutOfView
        };
        var definition = {
            surface: options,
            xAxes: this.xAxes.asArray().map(function (axis) { return axis.toJSON(); }),
            yAxes: this.yAxes.asArray().map(function (axis) { return axis.toJSON(); }),
            series: this.renderableSeries.asArray().map(function (series) { return series.toJSON(excludeData); }),
            modifiers: this.chartModifiers.asArray().map(function (modifier) { return modifier.toJSON(); }),
            annotations: this.annotations.asArray().map(function (annotation) { return annotation.toJSON(); }),
            onCreated: this.onCreatedName,
            subCharts: this.subCharts.map(function (sc) { return sc.toJSON(); }),
            createSingle: this.webAssemblyContext2D.canvas.id !== "SciChartMasterCanvas"
        };
        return definition;
    };
    /**
     * Triggers the rerendering of the surface and after the chart rerendering is completed,
     * returns its serialized state retrieved with {@link SciChartSurface.toJSON}.
     *
     * @param excludeData - if set true, data values will not be included in the json.
     * @returns JSON-like object {@link ISciChart2DDefinition}
     */
    SciChartSurface.prototype.getNextState = function (excludeData) {
        if (excludeData === void 0) { excludeData = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nextStateRender({ resumeBefore: true, invalidateOnResume: true, suspendAfter: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.toJSON(excludeData)];
                }
            });
        });
    };
    SciChartSurface.prototype.applyOptions = function (options) {
        _super.prototype.applyOptions.call(this, options);
        if (options === null || options === void 0 ? void 0 : options.layoutManager) {
            if (!("layoutChart" in options.layoutManager)) {
                options.layoutManager = (0, classFactory_1.createType)(BaseType_1.EBaseType.LayoutManager, options.layoutManager.type, null, options.layoutManager.options);
            }
            this.layoutManager = options.layoutManager;
        }
        if (options === null || options === void 0 ? void 0 : options.padding) {
            this.padding = options.padding;
        }
        if (options === null || options === void 0 ? void 0 : options.viewportBorder) {
            this.viewportBorder = options.viewportBorder;
        }
        if (options === null || options === void 0 ? void 0 : options.canvasBorder) {
            this.canvasBorder = options.canvasBorder;
        }
        if ((options === null || options === void 0 ? void 0 : options.loader) && "toJSON" in options.loader) {
            // @ts-ignore
            this.loaderJson = options.loader.toJSON();
        }
        else if ((options === null || options === void 0 ? void 0 : options.loader) === false) {
            // loader should be disabled
            this.loaderJson = false;
        }
        if (options === null || options === void 0 ? void 0 : options.drawSeriesBehindAxis) {
            this.drawSeriesBehindAxisProperty = options.drawSeriesBehindAxis;
        }
        if (options === null || options === void 0 ? void 0 : options.autoColorMode) {
            this.autoColorMode = options.autoColorMode;
        }
        if (options === null || options === void 0 ? void 0 : options.title) {
            this.title = options.title;
        }
        if (options === null || options === void 0 ? void 0 : options.titleStyle) {
            this.titleStyle = options.titleStyle;
        }
        if (options === null || options === void 0 ? void 0 : options.touchAction) {
            this.touchActionProperty = options.touchAction;
        }
    };
    /**
     * @inheritDoc
     */
    SciChartSurface.prototype.detachChartModifier = function (chartModifier) {
        _super.prototype.detachChartModifier.call(this, chartModifier);
        this.subCharts.forEach(function (subChart) {
            chartModifier.onDetachSubSurface(subChart);
        });
    };
    /**
     * @inheritDoc
     */
    SciChartSurface.prototype.attachChartModifier = function (chartModifier) {
        _super.prototype.attachChartModifier.call(this, chartModifier);
        if (chartModifier.modifierType !== ChartModifierBase_1.EModifierType.MultiChart2DModifier) {
            chartModifier.setParentSurface(this);
            chartModifier.invalidateParentCallback = this.invalidateElement;
            chartModifier.onAttach();
            this.subCharts.forEach(function (subChart) {
                chartModifier.onAttachSubSurface(subChart);
            });
            this.invalidateElement();
        }
    };
    /**
     * @inheritDoc
     */
    SciChartSurface.prototype.applySciChartBackground = function (background, alphaEnabled) {
        if (alphaEnabled === void 0) { alphaEnabled = true; }
        this.backgroundProperty = background;
        var renderContext = this.webAssemblyContext2D.SCRTGetMainRenderContext2D();
        if (this.domChartRoot) {
            this.domChartRoot.style.background = background;
        }
        if (renderContext) {
            renderContext.SetClearColor(0, 0, 0, 0);
            renderContext.Clear();
        }
    };
    /**
     * @inheritDoc
     */
    SciChartSurface.prototype.setClearAlphaParams = function (enabled, alpha) {
        this.webAssemblyContext2D.SCRTSetClearAlphaParams(enabled, alpha);
    };
    SciChartSurface.prototype.zoomExtentsYInternal = function (xRanges, animationDurationMs, easingFunction, onCompleted) {
        if (animationDurationMs === void 0) { animationDurationMs = 0; }
        if (easingFunction === void 0) { easingFunction = EasingFunctions_1.easing.outExpo; }
        if (onCompleted === void 0) { onCompleted = function () { }; }
        this.yAxes.asArray().forEach(function (yAxis) {
            var yRange = yAxis.getWindowedYRange(xRanges);
            if (yRange) {
                yAxis.animateVisibleRange(yRange, animationDurationMs, easingFunction, onCompleted);
            }
        });
    };
    SciChartSurface.prototype.zoomExtentsXInternal = function (animationDurationMs, easingFunction, onCompleted) {
        if (animationDurationMs === void 0) { animationDurationMs = 0; }
        if (easingFunction === void 0) { easingFunction = EasingFunctions_1.easing.outExpo; }
        if (onCompleted === void 0) { onCompleted = function () { }; }
        var xRanges = new Dictionary_1.Dictionary();
        this.xAxes.asArray().forEach(function (xAxis) {
            var maxXRange = xAxis.getMaximumRange();
            xAxis.animateVisibleRange(maxXRange, animationDurationMs, easingFunction, onCompleted);
            xRanges.add(xAxis.id, maxXRange);
        });
        return xRanges;
    };
    // Step_4: Start drawing
    SciChartSurface.prototype.onRenderSurfaceDraw = function () {
        var _this = this;
        var _a, _b;
        var renderSurfaceDrawStartMark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.RenderSurfaceDrawStart, {
            contextId: this.id
        });
        this.preRenderAll.raiseEvent();
        if (this.subChartsProperty.length > 0) {
            var batchContext_1 = new BatchRenderContext_1.BatchRenderContext(this.webAssemblyContext2D, this.renderSurface.viewportSize, (_a = this.domCanvas2D) === null || _a === void 0 ? void 0 : _a.id);
            var visibleSubCharts_1 = this.subChartsProperty.filter(function (sc) { return sc.isVisible; });
            if (visibleSubCharts_1.length === 0) {
                // Draw on parent if no visible SubCharts
                batchContext_1.doDraw = true;
            }
            // Render parent
            this.doDrawingLoop(batchContext_1);
            var middleChartLayersOffset_1 = 100;
            visibleSubCharts_1.forEach(function (chart, index) {
                chart.layersOffset = middleChartLayersOffset_1 * (index + 1);
                if (index === visibleSubCharts_1.length - 1) {
                    // If this is the last subChart, draw
                    batchContext_1.doDraw = true;
                }
                chart.doDrawingLoop(batchContext_1);
            });
        }
        else {
            this.doDrawingLoop();
        }
        this.renderedToWebGl.raiseEvent(this.sciChartRenderer.isInvalidated);
        if (!this.isCopyCanvasSurface) {
            this.renderedToDestination.raiseEvent(this.sciChartRenderer.isInvalidated);
        }
        // @ts-ignore access to private field
        if (this.painted.handlers.length > 0 || perfomance_1.PerformanceDebugHelper.enableDebug) {
            (0, perfomance_1.runAfterFramePaint)(function () {
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.Painted, { contextId: _this.id });
                _this.painted.raiseEvent(_this.sciChartRenderer.isInvalidated);
            });
        }
        this.currentWebGlRenderContextProperty = (0, Deleter_1.deleteSafe)(this.currentWebGlRenderContext);
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.RenderSurfaceDrawEnd, {
            contextId: this.id,
            relatedId: (_b = renderSurfaceDrawStartMark === null || renderSurfaceDrawStartMark === void 0 ? void 0 : renderSurfaceDrawStartMark.detail) === null || _b === void 0 ? void 0 : _b.relatedId
        });
    };
    SciChartSurface.prototype.detachSeries = function (renderableSeries) {
        if (renderableSeries.type === SeriesType_1.ESeriesType.StackedColumnSeries ||
            renderableSeries.type === SeriesType_1.ESeriesType.StackedMountainSeries) {
            return;
        }
        this.chartModifiers.asArray().forEach(function (cm) {
            cm.onDetachSeries(renderableSeries);
        });
        renderableSeries.onDetach();
        if (this.autoColorMode === AutoColorMode_1.EAutoColorMode.OnAddRemoveSeries) {
            this.autoColorRequired = true;
        }
        this.invalidateElement();
    };
    SciChartSurface.prototype.attachSeries = function (renderableSeries) {
        // If the user tries to add a stacked series, add it to a stacked collection, creating if necessary.
        if (renderableSeries.type === SeriesType_1.ESeriesType.StackedColumnSeries) {
            var col = this.renderableSeries
                .asArray()
                .find(function (rs) { return rs.type === SeriesType_1.ESeriesType.StackedColumnCollection; });
            if (!col) {
                col = new StackedColumnCollection_1.StackedColumnCollection(this.webAssemblyContext2D);
                //  Insert collection at old index to preserve z order
                var index = this.renderableSeries.asArray().findIndex(function (s) { return s === renderableSeries; });
                this.renderableSeries.insert(index, col);
            }
            col.add(renderableSeries);
            this.renderableSeries.remove(renderableSeries);
            return;
        }
        else if (renderableSeries.type === SeriesType_1.ESeriesType.StackedMountainSeries) {
            var col = this.renderableSeries
                .asArray()
                .find(function (rs) { return rs.type === SeriesType_1.ESeriesType.StackedMountainCollection; });
            if (!col) {
                col = new StackedMountainCollection_1.StackedMountainCollection(this.webAssemblyContext2D);
                var index = this.renderableSeries.asArray().findIndex(function (s) { return s === renderableSeries; });
                this.renderableSeries.insert(index, col);
            }
            col.add(renderableSeries);
            this.renderableSeries.remove(renderableSeries);
        }
        if (!renderableSeries.isStacked || "size" in renderableSeries) {
            renderableSeries.onAttach(this);
        }
        if (this.themeProviderProperty) {
            renderableSeries.applyTheme(this.themeProviderProperty);
        }
        this.chartModifiers.asArray().forEach(function (cm) {
            cm.onAttachSeries(renderableSeries);
        });
        if (this.autoColorMode === AutoColorMode_1.EAutoColorMode.OnAddRemoveSeries) {
            this.autoColorRequired = true;
        }
        this.invalidateElement();
    };
    SciChartSurface.prototype.detachAxis = function (axis) {
        axis.onDetach();
        this.invalidateElement();
    };
    SciChartSurface.prototype.attachAxis = function (axis, isXAxis) {
        if (axis.invalidateParentCallback) {
            throw new Error("Invalid operation in sciChartSurface.attachAxis, this axis has already been attached to a SciChartSurface. Please detach it from a SciChartSurface before attaching to another");
        }
        var isPrimaryAxis = false;
        if (isXAxis && !this.xAxes.asArray().some(function (a) { return a.isPrimaryAxis; })) {
            isPrimaryAxis = true;
        }
        if (!isXAxis && !this.yAxes.asArray().some(function (a) { return a.isPrimaryAxis; })) {
            isPrimaryAxis = true;
        }
        axis.onAttach(this, isXAxis, isPrimaryAxis);
        if (this.themeProviderProperty) {
            axis.applyTheme(this.themeProviderProperty);
        }
        axis.invalidateParentCallback = this.invalidateElement;
        this.invalidateElement();
    };
    SciChartSurface.prototype.onAttachSubSurface = function (subSurface) {
        this.chartModifiers.asArray().forEach(function (modifier) {
            modifier.onAttachSubSurface(subSurface);
        });
    };
    SciChartSurface.prototype.onDetachSubSurface = function (subSurface) {
        this.chartModifiers.asArray().forEach(function (modifier) {
            modifier.onDetachSubSurface(subSurface);
        });
    };
    Object.defineProperty(SciChartSurface.prototype, "drawSeriesBehindAxis", {
        /**
         * Gets or sets the boolean flag for switching behaviour of Axises rendering
         */
        get: function () {
            return this.drawSeriesBehindAxisProperty;
        },
        /**
         * Gets or sets the boolean flag for switching behaviour of Axises rendering
         */
        set: function (value) {
            this.drawSeriesBehindAxisProperty = value;
            this.invalidateElement();
        },
        enumerable: false,
        configurable: true
    });
    return SciChartSurface;
}(SciChartSurfaceBase_1.SciChartSurfaceBase));
exports.SciChartSurface = SciChartSurface;
/**
 * @summary The {@link SciChartSubSurface} is the surface created within another surface
 * @description
 * It can be added using {@link SciChartSurface.addSubChart} method.
 *
 * To update the positioning of the {@link SciChartSubSurface}, use {@link SciChartSubSurface.subPosition};
 * also you can call {@link SciChartSubSurface.updateSubLayout} to refresh the layout of the sub-surface.
 * @remarks
 * It is not possible to have more than one level of nested sub-surfaces.
 */
// tslint:disable-next-line: max-classes-per-file
var SciChartSubSurface = /** @class */ (function (_super) {
    __extends(SciChartSubSurface, _super);
    /**
     * Creates an instance of the {@link SciChartSurface}
     * @param webAssemblyContext The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param options optional parameters of type {@link ISciChartSurfaceOptions} used to configure the {@link SciChart2DSurfaceBase}
     */
    function SciChartSubSurface(webAssemblyContext, options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        _this = _super.call(this, webAssemblyContext, options) || this;
        _this.isSubSurface = true;
        _this.topSectionClass = "top-section";
        _this.leftSectionClass = "left-section";
        _this.bottomSectionClass = "bottom-section";
        _this.rightSectionClass = "right-section";
        // TODO move to constant for subCharts
        _this.backgroundProperty = "transparent";
        _this.isTransparentProperty = true;
        _this.subPositionProperty = new Rect_1.Rect(0, 0, 1, 1);
        _this.coordinateModeProperty = AnnotationBase_1.ECoordinateMode.Relative;
        _this.parentXAxisIdProperty = AxisBase2D_1.AxisBase2D.DEFAULT_AXIS_ID;
        _this.parentYAxisIdProperty = AxisBase2D_1.AxisBase2D.DEFAULT_AXIS_ID;
        _this.isVisibleProperty = true;
        _this.sectionScaleProperty = 1;
        _this.parentSurfaceProperty = options.parentSurface;
        _this.subChartContainerId = (_a = options.subSurfaceOptions) === null || _a === void 0 ? void 0 : _a.subChartContainerId;
        _this.subPaddingProperty = (_b = options === null || options === void 0 ? void 0 : options.subSurfaceOptions) === null || _b === void 0 ? void 0 : _b.subChartPadding;
        _this.isTransparentProperty = (_d = (_c = options === null || options === void 0 ? void 0 : options.subSurfaceOptions) === null || _c === void 0 ? void 0 : _c.isTransparent) !== null && _d !== void 0 ? _d : _this.isTransparent;
        _this.coordinateModeProperty = (_f = (_e = options === null || options === void 0 ? void 0 : options.subSurfaceOptions) === null || _e === void 0 ? void 0 : _e.coordinateMode) !== null && _f !== void 0 ? _f : _this.coordinateMode;
        _this.parentXAxisIdProperty = (_h = (_g = options === null || options === void 0 ? void 0 : options.subSurfaceOptions) === null || _g === void 0 ? void 0 : _g.parentXAxisId) !== null && _h !== void 0 ? _h : _this.parentXAxisId;
        _this.parentYAxisIdProperty = (_k = (_j = options === null || options === void 0 ? void 0 : options.subSurfaceOptions) === null || _j === void 0 ? void 0 : _j.parentYAxisId) !== null && _k !== void 0 ? _k : _this.parentYAxisId;
        _this.sectionScaleProperty = (_m = (_l = options === null || options === void 0 ? void 0 : options.subSurfaceOptions) === null || _l === void 0 ? void 0 : _l.sectionScale) !== null && _m !== void 0 ? _m : _this.sectionScaleProperty;
        _this.isVisible = (_p = (_o = options === null || options === void 0 ? void 0 : options.subSurfaceOptions) === null || _o === void 0 ? void 0 : _o.isVisible) !== null && _p !== void 0 ? _p : _this.isVisible;
        if (_this.subChartContainerId) {
            _this.subChartContainer =
                typeof _this.subChartContainerId === "string"
                    ? document.querySelector("[id='".concat(_this.subChartContainerId, "']"))
                    : _this.subChartContainerId;
        }
        _this.applyOptions(options.subSurfaceOptions);
        _this.subPosition = (_r = Rect_1.Rect.hydrate((_q = options.subSurfaceOptions) === null || _q === void 0 ? void 0 : _q.position)) !== null && _r !== void 0 ? _r : _this.subPositionProperty;
        _this.backgroundFillBrushCache = new BrushCache_1.BrushCache(webAssemblyContext);
        _this.preRender.subscribe(function (context) {
            // Parent coordcalc may not be available when the chart is first created, so recalculate padding before drawing
            if (_this.coordinateMode === AnnotationBase_1.ECoordinateMode.DataValue) {
                _this.updateSubLayout(true);
            }
        });
        return _this;
    }
    Object.defineProperty(SciChartSubSurface.prototype, "isTransparent", {
        /**
         * Whether other surfaces, including the parent, will be visible underneath this surface
         */
        get: function () {
            return this.isTransparentProperty;
        },
        /**
         * Whether other surfaces, including the parent, will be visible underneath this surface
         */
        set: function (value) {
            if (this.isTransparentProperty !== value) {
                this.isTransparentProperty = value;
                this.updateBackground();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSubSurface.prototype, "subChartPadding", {
        /**
         * Gets or sets additional absolute padding between the SciChartSubSurface and its parent, in order top, right, bottom, left
         * {@link subPosition} is applied first, then this padding is added.
         */
        get: function () {
            return this.subPaddingProperty;
        },
        /**
         * Gets or sets additional absolute padding between the SciChartSubSurface and its parent, in order top, right, bottom, left
         * {@link subPosition} is applied first, then this padding is added.
         */
        set: function (padding) {
            this.subPaddingProperty = padding;
            this.updateSubLayout();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSubSurface.prototype, "coordinateMode", {
        /**
         * Gets or sets the {@link ECoordinateMode} used when calculating the actual position based on the {@link subPosition}
         */
        get: function () {
            return this.coordinateModeProperty;
        },
        /**
         * Gets or sets the {@link ECoordinateMode} used when calculating the actual position based on the {@link subPosition}
         */
        set: function (coordinateMode) {
            this.coordinateModeProperty = coordinateMode;
            this.updateSubLayout();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSubSurface.prototype, "parentXAxisId", {
        /**
         * Gets or sets the AxisId used to determing which X Axis should be used when calculating the actual position based on the {@link subPosition}
         * if {@link coordinateMode} is DataValue
         */
        get: function () {
            return this.parentXAxisIdProperty;
        },
        /**
         * Gets or sets the AxisId used to determing which X Axis should be used when calculating the actual position based on the {@link subPosition}
         * if {@link coordinateMode} is DataValue
         */
        set: function (id) {
            this.parentXAxisIdProperty = id;
            this.updateSubLayout();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSubSurface.prototype, "parentYAxisId", {
        /**
         * Gets or sets the AxisId used to determing which Y Axis should be used when calculating the actual position based on the {@link subPosition}
         * if {@link coordinateMode} is DataValue
         */
        get: function () {
            return this.parentYAxisIdProperty;
        },
        /**
         * Gets or sets the AxisId used to determing which Y Axis should be used when calculating the actual position based on the {@link subPosition}
         * if {@link coordinateMode} is DataValue
         */
        set: function (id) {
            this.parentYAxisIdProperty = id;
            this.updateSubLayout();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSubSurface.prototype, "subPosition", {
        /**
         * A rectangle defining the position and size of a subchart.
         * If {@link coordinateMode} is Relative (the default) then the values give the size as a proportion of the parent div, and all properties must be between 0 and 1 inclusive.
         * If {@link coordinateMode} is DataValue, values will be converted to coordinates using {@link parentXAxisId} and {@link parentYAxisId}. Subchart will be clpped to the parent SeriesViewRect
         * Can only be set if this is a subChart.  See {@link addSubChart}
         */
        get: function () {
            return this.subPositionProperty;
        },
        /**
         * A rectangle defining the position and size of a subchart.
         * If {@link coordinateMode} is Relative (the default) then the values give the size as a proportion of the parent div, and all properties must be between 0 and 1 inclusive.
         * If {@link coordinateMode} is DataValue, values will be converted to coordinates using {@link parentXAxisId} and {@link parentYAxisId}. Subchart will be clpped to the parent SeriesViewRect
         * Can only be set if this is a subChart.  See {@link addSubChart}
         */
        set: function (value) {
            if (!this.parentSurface) {
                throw new Error("subPosition can only be changed for subCharts.");
            }
            if (!Rect_1.Rect.isEqual(this.subPositionProperty, value)) {
                this.subPositionProperty = value;
                this.updateSubLayout();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSubSurface.prototype, "isVisible", {
        /**
         * Gets or sets if the subchart is visible, allowing you to hide a subchart without removing it from the parent surface
         */
        get: function () {
            return this.isVisibleProperty;
        },
        /**
         * Gets or sets if the subchart is visible, allowing you to hide a subchart without removing it from the parent surface
         */
        set: function (isVisible) {
            this.isVisibleProperty = isVisible;
            this.invalidateElement();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSubSurface.prototype, "sectionScale", {
        /**
         * Gets or sets scale property for all sections
         * It is necessary if the scale transformation is being used for html areas around the subchart
         * For example, style = { width: "50%", transform: scale(2), transformOrigin: 'left top' }
         */
        get: function () {
            return this.sectionScaleProperty;
        },
        set: function (value) {
            this.sectionScaleProperty = value;
            this.updateSubLayout();
        },
        enumerable: false,
        configurable: true
    });
    /** Recalculate the position of the subChart.  Call if you update the size of html elements in the wrapper */
    SciChartSubSurface.prototype.updateSubLayout = function (isDrawing) {
        if (isDrawing === void 0) { isDrawing = false; }
        this.updateWrapper(this.subPosition);
        var offsets = this.getOffsets(this.subChartContainer);
        this.padding = this.calcPadding(this.parentSurface.renderSurface.viewportSize, this.subPositionProperty, offsets, isDrawing);
    };
    Object.defineProperty(SciChartSubSurface.prototype, "parentSurface", {
        /**
         * The parent SciChartSurface, if this is a subChart. See {@link addSubChart}
         */
        get: function () {
            return this.parentSurfaceProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSubSurface.prototype, "surfaceType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return SciChartSurfaceBase_1.ESurfaceType.SciChartSurfaceType;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SciChartSubSurface.prototype.changeViewportSize = function (pixelWidth, pixelHeight) {
        this.renderSurface.viewportSize = this.parentSurface.renderSurface.viewportSize;
    };
    /**
     * Gets the sub-chart container
     */
    SciChartSubSurface.prototype.getSubChartContainer = function () {
        return this.subChartContainer;
    };
    SciChartSubSurface.prototype.getSubChartRect = function () {
        var _a = this.renderSurface.viewportSize, width = _a.width, height = _a.height;
        var _b = this.adjustedPadding, top = _b.top, left = _b.left, bottom = _b.bottom, right = _b.right;
        // When resizing too fast it could happen that width < left + right or height < top + bottom and it breaks subcharts
        var newWidth = width - left - right > 0 ? width - left - right : 0;
        var newHeight = height - top - bottom > 0 ? height - top - bottom : 0;
        return new Rect_1.Rect(left, top, newWidth, newHeight);
    };
    /**
     * @inheritDoc
     */
    SciChartSubSurface.prototype.delete = function (clearHtml) {
        if (clearHtml === void 0) { clearHtml = true; }
        // Don't ever clear html on the parent here as it kills the drawing for all subcharts.
        if (clearHtml && this.domChartRoot.contains(this.domSvgContainer)) {
            this.domChartRoot.removeChild(this.domSvgContainer);
        }
        if (clearHtml && this.domChartRoot.contains(this.domBackgroundSvgContainer)) {
            this.domChartRoot.removeChild(this.domBackgroundSvgContainer);
        }
        this.backgroundFillBrushCache = (0, Deleter_1.deleteSafe)(this.backgroundFillBrushCache);
        _super.prototype.delete.call(this, false);
    };
    SciChartSubSurface.prototype.toJSON = function (excludeData) {
        var _a;
        if (excludeData === void 0) { excludeData = false; }
        var theme;
        if ("toJSON" in this.themeProvider) {
            // @ts-ignore
            theme = this.themeProvider.toJSON();
        }
        else {
            theme = this.themeProvider;
        }
        var baseSurfaceDefinition = _super.prototype.toJSON.call(this);
        var options = __assign(__assign({}, baseSurfaceDefinition.surface), { isTransparent: this.isTransparent, isVisible: this.isVisible, sectionScale: this.sectionScale, subChartPadding: this.subPaddingProperty, position: this.subPosition, subChartContainerId: typeof this.subChartContainerId === "string" ? this.subChartContainerId : (_a = this.subChartContainerId) === null || _a === void 0 ? void 0 : _a.id, coordinateMode: this.coordinateMode, parentXAxisId: this.parentXAxisId, parentYAxisId: this.parentYAxisId });
        var definition = {
            surface: options,
            xAxes: this.xAxes.asArray().map(function (axis) { return axis.toJSON(); }),
            yAxes: this.yAxes.asArray().map(function (axis) { return axis.toJSON(); }),
            series: this.renderableSeries.asArray().map(function (series) { return series.toJSON(excludeData); }),
            modifiers: this.chartModifiers.asArray().map(function (modifier) { return modifier.toJSON(); }),
            annotations: this.annotations.asArray().map(function (annotation) { return annotation.toJSON(); })
        };
        return definition;
    };
    SciChartSubSurface.prototype.calcPadding = function (viewportSize, position, offsets, isDrawing) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (isDrawing === void 0) { isDrawing = false; }
        var scaledViewWidth = viewportSize.width, scaledViewHeight = viewportSize.height;
        var viewWidth = (0, translate_1.translateToNotScaled)(scaledViewWidth);
        var viewHeight = (0, translate_1.translateToNotScaled)(scaledViewHeight);
        var x = position.x, y = position.y, width = position.width, height = position.height;
        // Pixel mode
        // TODO DPI scale absolute coords?
        var left = x;
        var top = y;
        var bottom = viewHeight - y - height;
        var right = viewWidth - x - width;
        if (this.coordinateMode === AnnotationBase_1.ECoordinateMode.Relative) {
            left = viewWidth * x + offsets.left;
            top = viewHeight * y + offsets.top;
            right = viewWidth - viewWidth * x - viewWidth * width + offsets.right;
            bottom = viewHeight - viewHeight * y - viewHeight * height + offsets.bottom;
        }
        else if (this.coordinateMode === AnnotationBase_1.ECoordinateMode.DataValue && isDrawing) {
            var xAxis = this.parentSurface.getXAxisById(this.parentXAxisId);
            if (!xAxis) {
                throw new Error("No x axis with id ".concat(this.parentXAxisId, " found on parent surface"));
            }
            var xCoordCalc = xAxis.getCurrentCoordinateCalculator();
            var yAxis = this.parentSurface.getYAxisById(this.parentYAxisId);
            if (!yAxis) {
                throw new Error("No y axis with id ".concat(this.parentYAxisId, " found on parent surface"));
            }
            var seriesViewRect = this.parentSurface.seriesViewRect;
            var scaledParentLeft = (0, translate_1.translateToNotScaled)(seriesViewRect.left);
            var scaledParentTop = (0, translate_1.translateToNotScaled)(seriesViewRect.top);
            var scaledParentBottom = (0, translate_1.translateToNotScaled)(seriesViewRect.bottom);
            var scaledParentRight = (0, translate_1.translateToNotScaled)(seriesViewRect.right);
            var yCoordCalc = yAxis.getCurrentCoordinateCalculator();
            left = xAxis.isVerticalChart ? yCoordCalc.getCoordinate(x) : xCoordCalc.getCoordinate(x);
            top = xAxis.isVerticalChart ? xCoordCalc.getCoordinate(y) : yCoordCalc.getCoordinate(y);
            left = Math.max((0, translate_1.translateToNotScaled)(left), 0);
            top = Math.max((0, translate_1.translateToNotScaled)(top), 0);
            left += scaledParentLeft;
            top += scaledParentTop;
            var x2 = xAxis.flippedCoordinates ? x - width : x + width;
            var y2 = yAxis.flippedCoordinates ? y + height : y - height;
            bottom = Math.max(viewHeight -
                scaledParentTop -
                (0, translate_1.translateToNotScaled)(xAxis.isVerticalChart ? xCoordCalc.getCoordinate(y2) : yCoordCalc.getCoordinate(y2)), viewHeight - scaledParentBottom);
            right = Math.max(viewWidth -
                scaledParentLeft -
                (0, translate_1.translateToNotScaled)(xAxis.isVerticalChart ? yCoordCalc.getCoordinate(x2) : xCoordCalc.getCoordinate(x2)), viewWidth - scaledParentRight);
        }
        left += (_b = (_a = this.subPaddingProperty) === null || _a === void 0 ? void 0 : _a.left) !== null && _b !== void 0 ? _b : 0;
        top += (_d = (_c = this.subPaddingProperty) === null || _c === void 0 ? void 0 : _c.top) !== null && _d !== void 0 ? _d : 0;
        right += (_f = (_e = this.subPaddingProperty) === null || _e === void 0 ? void 0 : _e.right) !== null && _f !== void 0 ? _f : 0;
        bottom += (_h = (_g = this.subPaddingProperty) === null || _g === void 0 ? void 0 : _g.bottom) !== null && _h !== void 0 ? _h : 0;
        return new Thickness_1.Thickness(top, right, bottom, left);
    };
    /**
     * @inheritDoc
     */
    SciChartSubSurface.prototype.applySciChartBackground = function (background, alphaEnabled) {
        if (alphaEnabled === void 0) { alphaEnabled = true; }
        this.backgroundProperty = background;
        if (!this.isTransparent) {
            // const renderContext = this.renderSurface.getRenderContext();
            // This is probably an unnecessary change, and mostly here to prevent a memory usage debug warning
            var renderContext = new WebGlRenderContext2D_1.WebGlRenderContext2D(this.webAssemblyContext2D, this.renderSurface.viewportSize, this.renderSurface.canvasId);
            var nativeContext = renderContext.getNativeContext();
            var _a = this.parentSurface.renderSurface.viewportSize, width = _a.width, height = _a.height;
            nativeContext.SetClipRect(this.adjustedPadding.left, this.adjustedPadding.top, width - this.adjustedPadding.right - this.adjustedPadding.left, height - this.adjustedPadding.bottom - this.adjustedPadding.top);
            nativeContext.SetClearColor(0, 0, 0, 0);
            nativeContext.Clear();
            nativeContext.SetClipRect(0, 0, width, height);
            try {
                // try parse background value. throws if cannot parse html color
                var brushColor = (0, parseColor_1.parseColorToUIntArgb)(background);
                var vecRects = (0, NativeObject_1.getVectorRectVertex)(this.webAssemblyContext2D);
                vecRects.push_back((0, createNativeRect_1.createNativeRect)(this.webAssemblyContext2D, this.adjustedPadding.left, this.adjustedPadding.top, this.renderSurface.viewportSize.width - this.adjustedPadding.right, this.renderSurface.viewportSize.height - this.adjustedPadding.bottom));
                var brush = (0, BrushCache_1.createBrushInCache)(this.backgroundFillBrushCache, background, 1);
                renderContext.drawRects(vecRects, brush, 0, 0);
            }
            catch (error) {
                performanceWarnings_1.performanceWarnings.subchartBackgroundNotSimpleColor.warn();
            }
            renderContext.delete();
        }
    };
    SciChartSubSurface.prototype.updateWrapper = function (subChartPosition) {
        var _this = this;
        if (!this.parentSurface || !this.subChartContainer) {
            return;
        }
        var seriesViewRect = this.parentSurface.seriesViewRect;
        if (!seriesViewRect && this.coordinateMode !== AnnotationBase_1.ECoordinateMode.Relative) {
            return;
        }
        this.subChartContainer.style.pointerEvents = "none";
        this.subChartContainer.style.position = "absolute";
        var getSubChartContainerPosition = function (subChartPosition) {
            if (_this.coordinateMode === AnnotationBase_1.ECoordinateMode.DataValue) {
                var xAxis = _this.parentSurface.getXAxisById(_this.parentXAxisId);
                if (!xAxis) {
                    throw new Error("No x axis with id ".concat(_this.parentXAxisId, " found on parent surface"));
                }
                var yAxis = _this.parentSurface.getYAxisById(_this.parentYAxisId);
                if (!yAxis) {
                    throw new Error("No y axis with id ".concat(_this.parentYAxisId, " found on parent surface"));
                }
                var absolutePositionRect = (0, translate_1.translateDataValueRectToAbsolute)(subChartPosition, xAxis, yAxis, seriesViewRect);
                var left = (0, translate_1.convertToHtmlPx)(absolutePositionRect.x);
                var top_1 = (0, translate_1.convertToHtmlPx)(absolutePositionRect.y);
                var width = (0, translate_1.convertToHtmlPx)(absolutePositionRect.width);
                var height = (0, translate_1.convertToHtmlPx)(absolutePositionRect.height);
                return { left: left, top: top_1, width: width, height: height };
            }
            else if (_this.coordinateMode === AnnotationBase_1.ECoordinateMode.Relative) {
                var left = (0, translate_1.convertToRelativeHtmlSize)(subChartPosition.x);
                var top_2 = (0, translate_1.convertToRelativeHtmlSize)(subChartPosition.y);
                var width = (0, translate_1.convertToRelativeHtmlSize)(subChartPosition.width);
                var height = (0, translate_1.convertToRelativeHtmlSize)(subChartPosition.height);
                return { left: left, top: top_2, width: width, height: height };
            }
            else {
                var left = (0, translate_1.convertToHtmlPx)(subChartPosition.x);
                var top_3 = (0, translate_1.convertToHtmlPx)(subChartPosition.y);
                var width = (0, translate_1.convertToHtmlPx)(subChartPosition.width);
                var height = (0, translate_1.convertToHtmlPx)(subChartPosition.height);
                return { left: left, top: top_3, width: width, height: height };
            }
        };
        var subChartContainerPosition = getSubChartContainerPosition(subChartPosition);
        this.subChartContainer.style.left = subChartContainerPosition.left;
        this.subChartContainer.style.top = subChartContainerPosition.top;
        this.subChartContainer.style.width = subChartContainerPosition.width;
        this.subChartContainer.style.height = subChartContainerPosition.height;
    };
    SciChartSubSurface.prototype.getOffsets = function (subChartContainer) {
        var _a, _b, _c, _d;
        if (!subChartContainer) {
            return {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            };
        }
        // TODO probably we can use better selector
        var leftSection = subChartContainer.getElementsByClassName(this.leftSectionClass)[0];
        var topSection = subChartContainer.getElementsByClassName(this.topSectionClass)[0];
        var rightSection = subChartContainer.getElementsByClassName(this.rightSectionClass)[0];
        var bottomSection = subChartContainer.getElementsByClassName(this.bottomSectionClass)[0];
        var leftSectionWidth = (_a = leftSection === null || leftSection === void 0 ? void 0 : leftSection.clientWidth) !== null && _a !== void 0 ? _a : 0;
        var topSectionHeight = (_b = topSection === null || topSection === void 0 ? void 0 : topSection.clientHeight) !== null && _b !== void 0 ? _b : 0;
        var rightSectionWidth = (_c = rightSection === null || rightSection === void 0 ? void 0 : rightSection.clientWidth) !== null && _c !== void 0 ? _c : 0;
        var bottomSectionHeight = (_d = bottomSection === null || bottomSection === void 0 ? void 0 : bottomSection.clientHeight) !== null && _d !== void 0 ? _d : 0;
        return {
            left: leftSectionWidth * this.sectionScaleProperty,
            top: topSectionHeight * this.sectionScaleProperty,
            right: rightSectionWidth * this.sectionScaleProperty,
            bottom: bottomSectionHeight * this.sectionScaleProperty
        };
    };
    return SciChartSubSurface;
}(SciChartSurface));
exports.SciChartSubSurface = SciChartSubSurface;
