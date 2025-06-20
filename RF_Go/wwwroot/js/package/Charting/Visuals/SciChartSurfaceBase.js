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
exports.getLocateFile = exports.getMasterCanvas = exports.createChartDestination = exports.SciChartSurfaceBase = exports.ESurfaceType = exports.DebugForDpi = void 0;
var classFactory_1 = require("../../Builder/classFactory");
var licenseManager2D_1 = require("../../Charting/Visuals/licenseManager2D");
var licenseManager3D_1 = require("../../Charting3D/Visuals/licenseManager3D");
var app_1 = require("../../constants/app");
var DeletableEntity_1 = require("../../Core/DeletableEntity");
var Deleter_1 = require("../../Core/Deleter");
var EventHandler_1 = require("../../Core/EventHandler");
var Globals_1 = require("../../Core/Globals");
var Guard_1 = require("../../Core/Guard");
var MouseManager_1 = require("../../Core/Mouse/MouseManager");
var ObservableArray_1 = require("../../Core/ObservableArray");
var ObserveVisibility_1 = require("../../Core/ObserveVisibility");
var PropertyChangedEventArgs_1 = require("../../Core/PropertyChangedEventArgs");
var WebGlHelper_1 = require("../../Core/WebGlHelper");
var BaseType_1 = require("../../types/BaseType");
var array_1 = require("../../utils/array");
var guid_1 = require("../../utils/guid");
var MemoryUsageHelper_1 = require("../../utils/MemoryUsageHelper");
var ChartModifierBase_1 = require("../ChartModifiers/ChartModifierBase");
var SciChartJSDarkv2Theme_1 = require("../Themes/SciChartJSDarkv2Theme");
var DpiHelper_1 = require("./TextureManager/DpiHelper");
var UpdateSuspender_1 = require("./UpdateSuspender");
exports.DebugForDpi = false;
/**
 * Enum constants to specify SciChartSurface type
 */
var ESurfaceType;
(function (ESurfaceType) {
    /**
     * A 2D Cartesian {@link SciChartSurface}
     */
    ESurfaceType["SciChartSurfaceType"] = "SciChartSurfaceType";
    /**
     * A 3D Cartesian {@link SciChart3DSurface}
     */
    ESurfaceType["SciChart3DSurfaceType"] = "SciChart3DSurfaceType";
})(ESurfaceType = exports.ESurfaceType || (exports.ESurfaceType = {}));
/**
 * @summary The base class for a 2D Cartesian {@link SciChartSurface} or 3D Cartesian {@link SciChart3DSurface} within SciChart -
 * High Performance Realtime {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}
 * @remarks
 * See derived types {@link SciChartSurface} (2D Charts) and {@link SciChart3DSurface} (3D Charts) for more specific instructions on how
 * to use the SciChartSurface and create a 2D or 3D {@link https://www.scichart.com/javascript-chart-features | JavaScript Chart}
 */
var SciChartSurfaceBase = /** @class */ (function (_super) {
    __extends(SciChartSurfaceBase, _super);
    /**
     * Creates an instance of a SciChartSurfaceBase
     * @param webAssemblyContext  The {@link TSciChart | SciChart 2D WebAssembly Context} or {@link TSciChart | SciChart 3D WebAssembly Context}
     * containing native methods and access to our WebGL2 WebAssembly Rendering Engine
     * @param canvases A list of {@link TSciChartSurfaceCanvases} to draw to
     */
    function SciChartSurfaceBase(webAssemblyContext, canvases) {
        if (canvases === void 0) { canvases = {}; }
        var _this = _super.call(this) || this;
        /**
         * An event handler which notifies its subscribers when a layout stage in render process has finished.
         */
        _this.layoutMeasured = new EventHandler_1.EventHandler();
        /**
         * An event handler which notifies its subscribers when animations stage in render process has finished.
         */
        _this.genericAnimationsRun = new EventHandler_1.EventHandler();
        /**
         * An event handler which notifies its subscribers when a chart was rendered to WebgL Canvas.
         * @remarks Not applicable to sub-charts
         */
        _this.renderedToWebGl = new EventHandler_1.EventHandler();
        /**
         * An event handler which notifies its subscribers when a render operation has finished.
         */
        _this.rendered = new EventHandler_1.EventHandler();
        /**
         * An event handler which notifies its subscribers when a chart was rendered to a display canvas.
         * @remarks Not applicable to sub-charts
         */
        _this.renderedToDestination = new EventHandler_1.EventHandler();
        /**
         * An event handler which notifies its subscribers when a chart was visually painted a display canvas.
         * @remarks Not applicable to sub-charts
         */
        _this.painted = new EventHandler_1.EventHandler();
        _this.themeProviderProperty = SciChartSurfaceBase.DEFAULT_THEME;
        _this.previousThemeProviderProperty = SciChartSurfaceBase.DEFAULT_THEME;
        _this.isInitializedProperty = false;
        _this.isDeletedProperty = false;
        _this.backgroundProperty = SciChartSurfaceBase.DEFAULT_THEME.sciChartBackground;
        _this.idProperty = (0, guid_1.generateGuid)();
        _this.suspendableIdProperty = (0, guid_1.generateGuid)();
        _this.isAlphaEnabledProperty = true;
        _this.deletables = [];
        _this.freezeWhenOutOfViewProperty = false;
        Guard_1.Guard.notNull(webAssemblyContext, "webAssemblyContext");
        _this.domChartRoot = canvases.domChartRoot;
        _this.domCanvasWebGL = canvases.domCanvasWebGL;
        _this.domCanvas2D = canvases.domCanvas2D;
        _this.domSvgContainer = canvases.domSvgContainer;
        _this.domSvgAdornerLayer = canvases.domSvgAdornerLayer;
        _this.domBackgroundSvgContainer = canvases.domBackgroundSvgContainer;
        _this.domSeriesBackground = canvases.domSeriesBackground;
        _this.domDivContainer = canvases.domDivContainer;
        _this.sharedWasmContext = webAssemblyContext;
        _this.propertyChanged = new EventHandler_1.EventHandler();
        // Flag which ensures Typescript side drives emscripten rendering (one render per draw request)
        webAssemblyContext.TSRSetDrawRequestsEnabled(true);
        // Setup chart modifiers
        _this.detachChartModifier = _this.detachChartModifier.bind(_this);
        _this.attachChartModifier = _this.attachChartModifier.bind(_this);
        _this.chartModifiers = new ObservableArray_1.ObservableArray();
        _this.chartModifiers.collectionChanged.subscribe(function (arg) {
            var _a, _b;
            (_a = arg.getOldItems()) === null || _a === void 0 ? void 0 : _a.forEach(function (cm) { return _this.detachChartModifier(cm); });
            (_b = arg.getNewItems()) === null || _b === void 0 ? void 0 : _b.forEach(function (cm) { return _this.attachChartModifier(cm); });
        });
        // Setup annotations
        _this.detachAnnotation = _this.detachAnnotation.bind(_this);
        _this.attachAnnotation = _this.attachAnnotation.bind(_this);
        _this.annotations = new ObservableArray_1.ObservableArray();
        _this.modifierAnnotations = new ObservableArray_1.ObservableArray();
        _this.annotations.collectionChanged.subscribe(function (arg) {
            var _a, _b;
            (_a = arg.getOldItems()) === null || _a === void 0 ? void 0 : _a.forEach(function (a) { return _this.detachAnnotation(a); });
            (_b = arg.getNewItems()) === null || _b === void 0 ? void 0 : _b.forEach(function (a) { return _this.attachAnnotation(a); });
        });
        _this.modifierAnnotations.collectionChanged.subscribe(function (arg) {
            var _a, _b;
            (_a = arg.getOldItems()) === null || _a === void 0 ? void 0 : _a.forEach(function (a) { return _this.detachAnnotation(a); });
            (_b = arg.getNewItems()) === null || _b === void 0 ? void 0 : _b.forEach(function (a) { return _this.attachAnnotation(a); });
        });
        // Setup mouse manager
        _this.mouseManager = new MouseManager_1.MouseManager(_this);
        if (canvases.domCanvasWebGL) {
            _this.mouseManager.subscribe(canvases.domCanvasWebGL);
        }
        else if (canvases.domCanvas2D) {
            _this.mouseManager.subscribe(canvases.domCanvas2D);
        }
        // Setup Dpi change listeners
        _this.onDpiChanged = _this.onDpiChanged.bind(_this);
        DpiHelper_1.DpiHelper.dpiChanged.subscribe(_this.onDpiChanged);
        try {
            if (process.env.NODE_ENV !== "production") {
                if (MemoryUsageHelper_1.MemoryUsageHelper.isMemoryUsageDebugEnabled) {
                    var rootContainer = document.body;
                    var wasAttached_1 = false;
                    var observer_1 = new MutationObserver(function () {
                        var isInDom = _this.domChartRoot.isConnected;
                        if (wasAttached_1 && !isInDom && !_this.isDeleted) {
                            console.warn("The chart root element \"".concat(_this.domChartRoot.id, "\" was detached before the surface ").concat(_this.id, " was properly disposed! Make sure to call \"delete\" method on the surface when it is not longer needed."));
                        }
                        if (isInDom) {
                            wasAttached_1 = true;
                        }
                    });
                    observer_1.observe(rootContainer, { childList: true, subtree: true });
                    _this.addDeletable({
                        delete: function () { return observer_1.disconnect(); }
                    });
                }
            }
        }
        catch (err) {
            console.warn(err);
        }
        if (!app_1.IS_TEST_ENV && SciChartSurfaceBase.invalidateOnTabVisible) {
            var visibilityChangeHandler_1 = function () {
                if (document.visibilityState === "visible") {
                    _this.invalidateElement({ force: true });
                }
            };
            document.addEventListener("visibilitychange", visibilityChangeHandler_1);
            _this.addDeletable({
                delete: function () { return document.removeEventListener("visibilitychange", visibilityChangeHandler_1); }
            });
        }
        return _this;
    }
    /**
     * Deletes the shared wasmContext ({@link TSciChart | WebAssembly Context}) used by the charts instantiated with {@link SciChartSurface.create} or {@link SciChart3DSurface.create}.
     */
    SciChartSurfaceBase.disposeSharedWasmContext = function () {
        if (Globals_1.sciChart3DDestinations.length === 0 && Globals_1.sciChartDestinations.length === 0) {
            if (SciChartSurfaceBase.domMasterCanvas) {
                document.body.removeChild(SciChartSurfaceBase.domMasterCanvas);
                SciChartSurfaceBase.domMasterCanvas = undefined;
            }
        }
        (0, licenseManager2D_1.forceReapplyLicense2D)();
        (0, licenseManager3D_1.forceReapplyLicense3D)();
        // try {
        //     if (process.env.NODE_ENV !== "production") {
        //         if (MemoryUsageHelper.isMemoryUsageDebugEnabled) {
        //             // @ts-ignore
        //             window.gc && window.gc();
        //             // TODO add warning if there are undeleted or uncollected entities instead
        //             // MemoryUsageHelper.objectRegistry.log();
        //         }
        //     }
        // } catch (err) {
        //     console.warn(err);
        // }
    };
    /**
     * Sets the runtime license key.  Use for full licenses or trials only, not developer licenses.
     * @param keyCode
     */
    SciChartSurfaceBase.setRuntimeLicenseKey = function (keyCode) {
        licenseManager2D_1.licenseManager.setRuntimeLicenseKey(keyCode);
    };
    /**
     * Causes SciChart to always use its built in community non-commercial license.  This stops it attempting to look for the license wizard
     * Usage of the community license constitutes acceptance of the terms at https://www.scichart.com/community-licensing/
     */
    SciChartSurfaceBase.UseCommunityLicense = function () {
        licenseManager2D_1.licenseManager.setRuntimeLicenseKey("community");
    };
    /**
     * Sets the endpoint for validating a runtime license key with the server.  Must be a relative path.
     * @default api/license
     * @param endpoint
     */
    SciChartSurfaceBase.setServerLicenseEndpoint = function (endpoint) {
        licenseManager2D_1.licenseManager.setServerLicenseEndpoint(endpoint);
    };
    /**
     * Sets function that will be called by the framework to validate a runtime license from the server,
     * if you need to add additional handling, such as custom authentication.
     * The request sent to the server must include the queryString section passed in, which does not come with a leading ?
     * @param callback
     */
    SciChartSurfaceBase.setLicenseCallback = function (callback) {
        licenseManager2D_1.licenseManager.setLicenseCallback(callback);
    };
    SciChartSurfaceBase.resolveOptions = function (options) {
        // We need to resolve these before create as the loader and theme are required before the surface is created.
        if ((options === null || options === void 0 ? void 0 : options.theme) && "type" in options.theme) {
            if (!("applyOverrides" in options.theme)) {
                // This is {type, overrides}
                var theme = (0, classFactory_1.createType)(BaseType_1.EBaseType.ThemeProvider, options.theme.type, null, options.theme);
                if ("applyOverrides" in theme) {
                    // We got a ThemeProvider we can give overrides to
                    theme.applyOverrides(options.theme);
                }
                options.theme = theme;
            }
        }
        else {
            if (!options) {
                options = { theme: SciChartSurfaceBase.DEFAULT_THEME };
            }
            else {
                options.theme = SciChartSurfaceBase.DEFAULT_THEME;
            }
        }
        if (options === null || options === void 0 ? void 0 : options.loader) {
            if (!("addChartLoader" in options.loader)) {
                options.loader = (0, classFactory_1.createType)(BaseType_1.EBaseType.Loader, options.loader.type, null, options.loader);
            }
        }
        return options;
    };
    Object.defineProperty(SciChartSurfaceBase.prototype, "id", {
        /**
         * Gets or sets the SciChartSurface Id
         */
        get: function () {
            return this.idProperty;
        },
        /**
         * Gets or sets the SciChartSurface Id
         */
        set: function (value) {
            this.idProperty = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurfaceBase.prototype, "background", {
        /**
         * Gets or sets the SciChartSurface Background as an HTML color code
         */
        get: function () {
            return this.backgroundProperty;
        },
        /**
         * Gets or sets the SciChartSurface Background as an HTML color code
         */
        set: function (background) {
            this.backgroundProperty = background;
            this.applySciChartBackground(background, this.isAlphaEnabledProperty);
            this.notifyPropertyChanged("Background");
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Used internally, updates background after switching between different SciChartSurfaces
     */
    SciChartSurfaceBase.prototype.updateBackground = function () {
        this.applySciChartBackground(this.backgroundProperty, this.isAlphaEnabledProperty);
    };
    Object.defineProperty(SciChartSurfaceBase.prototype, "isCopyCanvasSurface", {
        get: function () {
            return !this.domCanvasWebGL && this.domCanvas2D;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurfaceBase.prototype, "seriesViewRect", {
        /**
         * Gets the Series View {@link Rect}, a rectangle relative to the entire size of the {@link SciChartSurfaceBase}
         */
        get: function () {
            return this.seriesViewRectProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurfaceBase.prototype, "otherSurfaces", {
        /**
         * Used internally - gets other SciChartSurfaces
         */
        get: function () {
            var _this = this;
            if (!this.destinations) {
                return [];
            }
            return this.destinations.map(function (el) { return el.sciChartSurface; }).filter(function (el2) { return el2 !== _this; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurfaceBase.prototype, "isInitialized", {
        /**
         * Used internally - gets isInitialized flag
         */
        get: function () {
            return this.isInitializedProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurfaceBase.prototype, "isDeleted", {
        /**
         * Used internally - gets isDeleted flag
         */
        get: function () {
            return this.isDeletedProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurfaceBase.prototype, "isSuspended", {
        /**
         * @inheritDoc
         */
        get: function () {
            return UpdateSuspender_1.UpdateSuspender.getIsSuspended(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurfaceBase.prototype, "suspendableId", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.suspendableIdProperty;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SciChartSurfaceBase.prototype.decrementSuspend = function () { };
    /**
     * @inheritDoc
     */
    SciChartSurfaceBase.prototype.resumeUpdates = function (suspender) {
        if (suspender.shouldResumeTarget) {
            this.invalidateElement();
            if (suspender === this.suspender) {
                this.suspender = undefined;
            }
        }
    };
    SciChartSurfaceBase.prototype.resume = function () {
        var _a;
        (_a = this.suspender) === null || _a === void 0 ? void 0 : _a.resume();
    };
    /**
     * @inheritDoc
     */
    SciChartSurfaceBase.prototype.suspendUpdates = function () {
        this.suspender = new UpdateSuspender_1.UpdateSuspender(this);
        return this.suspender;
    };
    /**
     * @inheritDoc
     */
    SciChartSurfaceBase.prototype.applyTheme = function (themeProvider) {
        this.previousThemeProviderProperty = this.themeProviderProperty;
        this.themeProviderProperty = themeProvider;
        this.applySciChartBackground(themeProvider.sciChartBackground);
        this.chartModifiers.asArray().forEach(function (el) { return el.applyTheme(themeProvider); });
        this.invalidateElement();
    };
    Object.defineProperty(SciChartSurfaceBase.prototype, "themeProvider", {
        /**
         * Used internally - gets the previous {@link IThemeProvider}
         */
        get: function () {
            return this.themeProviderProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurfaceBase.prototype, "previousThemeProvider", {
        /**
         * Used internally - gets the previous {@link IThemeProvider}
         */
        get: function () {
            return this.previousThemeProviderProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartSurfaceBase.prototype, "freezeWhenOutOfView", {
        /**
         * When true, charts that are out of the viewport will be frozen (pausing rendering). Data updates can resume
         * Once the chart is in view again, rendering will resume. This can be useful for performance optimization.
         */
        get: function () {
            return this.freezeWhenOutOfViewProperty;
        },
        /**
         * When true, charts that are out of the viewport will be frozen (pausing rendering). Data updates can resume
         * Once the chart is in view again, rendering will resume. This can be useful for performance optimization.
         */
        set: function (freezeWhenOutOfView) {
            var _this = this;
            var _a;
            this.freezeWhenOutOfViewProperty = freezeWhenOutOfView;
            if (freezeWhenOutOfView && !this.visibilityObserver) {
                this.visibilityObserver = ObserveVisibility_1.VisibilityObserver.observe(this.domChartRoot, function (isVisible) {
                    if (!isVisible && !_this.isSuspended) {
                        _this.suspendUpdates();
                        // console.log(`${spec.title} is out of view`);
                    }
                    else if (isVisible && _this.isSuspended) {
                        _this.resume();
                        // console.log(`${spec.title} is in view`);
                    }
                });
            }
            else if (!freezeWhenOutOfView && this.visibilityObserver) {
                (_a = this.visibilityObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
                this.visibilityObserver = undefined;
                this.resume();
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SciChartSurfaceBase.prototype.delete = function (clearHtml) {
        var _this = this;
        var _a, _b, _c, _d;
        if (clearHtml === void 0) { clearHtml = true; }
        this.isDeletedProperty = true;
        (_b = (_a = this.suspender) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.suspender = undefined;
        // TODO probably this should be moved outside for Proxy === this comparison issue exists
        var currentSurfaceIndex = (_c = this.destinations) === null || _c === void 0 ? void 0 : _c.findIndex(function (dest) { return dest.sciChartSurface.id === _this.id; });
        if (currentSurfaceIndex >= 0) {
            this.destinations.splice(currentSurfaceIndex, 1);
        }
        DpiHelper_1.DpiHelper.dpiChanged.unsubscribe(this.onDpiChanged);
        this.mouseManager.unsubscribe();
        this.mouseManager = undefined;
        this.chartModifiers.asArray().forEach(function (chm) { return chm.delete(); });
        this.modifierAnnotations.asArray().forEach(function (annotation) { return annotation.delete(); });
        this.annotations.asArray().forEach(function (annotation) { return annotation.delete(); });
        this.adornerLayer = undefined;
        for (var _i = 0, _e = this.deletables; _i < _e.length; _i++) {
            var deletable = _e[_i];
            (0, Deleter_1.deleteSafe)(deletable);
        }
        this.domChartRoot = undefined;
        this.domCanvasWebGL = undefined;
        this.domCanvas2D = undefined;
        this.domSvgContainer = undefined;
        this.domSvgAdornerLayer = undefined;
        this.domBackgroundSvgContainer = undefined;
        this.domSeriesBackground = undefined;
        this.domDivContainer = undefined;
        this.sharedWasmContext = undefined;
        this.deletables = [];
        (_d = this.visibilityObserver) === null || _d === void 0 ? void 0 : _d.disconnect();
        this.visibilityObserver = undefined;
    };
    SciChartSurfaceBase.prototype.addDeletable = function (deletable) {
        this.deletables.push(deletable);
    };
    SciChartSurfaceBase.prototype.getMainCanvas = function () {
        return this.domCanvasWebGL || this.domCanvas2D;
    };
    /**
     * Sets the Series View {@link Rect}, a rectangle relative to the entire size of the {@link SciChartSurfaceBase}
     * @param seriesViewRect a {@link Rect} which defines the portion of the view for drawing series
     */
    SciChartSurfaceBase.prototype.setSeriesViewRect = function (seriesViewRect) {
        this.seriesViewRectProperty = seriesViewRect;
    };
    /**
     * Used internally - sets destinations
     */
    SciChartSurfaceBase.prototype.setDestinations = function (destinations) {
        this.destinations = destinations;
    };
    /**
     * Used internally, the flag is set after {@link SciChartSurfaceBase} is initialized
     */
    SciChartSurfaceBase.prototype.setIsInitialized = function () {
        this.isInitializedProperty = true;
    };
    /**
     * @inheritDoc
     */
    SciChartSurfaceBase.prototype.onDpiChanged = function (args) {
        this.annotations.asArray().forEach(function (a) { return a.onDpiChanged(args); });
        this.modifierAnnotations.asArray().forEach(function (a) { return a.onDpiChanged(args); });
        this.invalidateElement();
    };
    /**
     * Creates a promise which resolves when the chart is updated to the next fully rendered state
     *
     * @remarks
     * If the surface is initialized with `createSingle` the promise resolves after the main `render` function is executed.
     * Otherwise, if it is initialized with `create` - the promise resolves after image data is copied to the 2D canvas.
     */
    SciChartSurfaceBase.prototype.nextStateRender = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var listener = function (isInvalidated) {
                            try {
                                if (!isInvalidated) {
                                    if (options === null || options === void 0 ? void 0 : options.suspendAfter) {
                                        var nextSuspender = _this.suspendUpdates();
                                        resolve(nextSuspender);
                                    }
                                    else {
                                        resolve(null);
                                    }
                                    _this.rendered.unsubscribe(listener);
                                }
                            }
                            catch (err) {
                                console.error(err);
                                reject(err);
                            }
                        };
                        _this.rendered.subscribe(listener);
                        if (options === null || options === void 0 ? void 0 : options.resumeBefore) {
                            _this.resume();
                            if (options === null || options === void 0 ? void 0 : options.invalidateOnResume) {
                                _this.invalidateElement();
                            }
                        }
                    })];
            });
        });
    };
    Object.defineProperty(SciChartSurfaceBase.prototype, "chartModifierGroups", {
        get: function () {
            var arr = this.chartModifiers
                .asArray()
                .filter(function (cm) { return cm.modifierGroup !== undefined; })
                .map(function (el) { return el.modifierGroup; });
            return (0, array_1.getUniqueValues)(arr);
        },
        enumerable: false,
        configurable: true
    });
    SciChartSurfaceBase.prototype.clearRootElement = function (clearHtml) {
        if (clearHtml && this.domChartRoot) {
            var style = this.domChartRoot.style;
            if (style) {
                style.background = "";
                style.position = "";
            }
            if (this.domChartRoot.hasOwnProperty("replaceChildren")) {
                // @ts-ignore
                this.domChartRoot.replaceChildren();
            }
            else {
                this.domChartRoot.innerHTML = "";
            }
        }
    };
    SciChartSurfaceBase.prototype.applyOptions = function (options) {
        var _a, _b;
        this.idProperty = (_a = options === null || options === void 0 ? void 0 : options.id) !== null && _a !== void 0 ? _a : this.idProperty;
        this.widthAspect = options === null || options === void 0 ? void 0 : options.widthAspect;
        this.heightAspect = options === null || options === void 0 ? void 0 : options.heightAspect;
        this.disableAspect = options === null || options === void 0 ? void 0 : options.disableAspect;
        this.freezeWhenOutOfView = (_b = options === null || options === void 0 ? void 0 : options.freezeWhenOutOfView) !== null && _b !== void 0 ? _b : false;
    };
    /**
     * Detaches a {@link ChartModifierBase2D} from the {@link SciChartSurfaceBase}
     * @param chartModifier
     */
    SciChartSurfaceBase.prototype.detachChartModifier = function (chartModifier) {
        if (chartModifier.modifierType !== ChartModifierBase_1.EModifierType.MultiChart2DModifier) {
            chartModifier.invalidateParentCallback = undefined;
            chartModifier.onDetach();
            chartModifier.setParentSurface(undefined);
            this.invalidateElement();
        }
    };
    /**
     * Attaches a {@link ChartModifierBase2D} to the {@link SciChartSurfaceBase}
     * @param chartModifier
     */
    SciChartSurfaceBase.prototype.attachChartModifier = function (chartModifier) {
        if (chartModifier.modifierType === ChartModifierBase_1.EModifierType.MultiChart2DModifier) {
            if (this.chartModifiers.asArray().filter(function (cm) { return cm === chartModifier; }).length > 1) {
                throw Error("Invalid operation in sciChartSurface.attachChartModifier, this FinChartModifier has already been attached to this SciChartSurface.");
            }
        }
        else {
            if (chartModifier.invalidateParentCallback) {
                throw Error("Invalid operation in sciChartSurface.attachChartModifier, this chartModifier has already been attached to a SciChartSurface. Please detach it from a SciChartSurface before attaching to another");
            }
        }
        if (this.themeProviderProperty) {
            chartModifier.applyTheme(this.themeProviderProperty);
        }
    };
    /**
     * @summary Notifies subscribers of {@link SciChartSurfaceBase.propertyChanged} that a property has changed and the chart requires redrawing
     * @description SciChart provides fully reactive components, changing any property or changing data will cause the {@link SciChartSurfaceBase} to
     * redraw where necessary. This method notifies subscribers of the {@link SciChartSurfaceBase.propertyChanged} {@link EventHandler}
     * that a property has changed.
     * @param propertyName The name of the property which has changed
     */
    SciChartSurfaceBase.prototype.notifyPropertyChanged = function (propertyName) {
        var _a;
        (_a = this.propertyChanged) === null || _a === void 0 ? void 0 : _a.raiseEvent(new PropertyChangedEventArgs_1.PropertyChangedEventArgs(propertyName));
        this.invalidateElement();
    };
    SciChartSurfaceBase.prototype.changeMasterCanvasViewportSize = function (wasmContext, pixelWidth, pixelHeight) {
        if (!SciChartSurfaceBase.domMasterCanvas)
            return;
        var newWidth = pixelWidth;
        var newHeight = pixelHeight;
        var width = SciChartSurfaceBase.domMasterCanvas.width / DpiHelper_1.DpiHelper.PIXEL_RATIO;
        var height = SciChartSurfaceBase.domMasterCanvas.height / DpiHelper_1.DpiHelper.PIXEL_RATIO;
        if (width > newWidth)
            newWidth = width;
        if (height > newHeight)
            newHeight = height;
        // domMasterCanvas.width/height are backBuffer sizes so we want to expand canvas size
        // if the backBuffer size is too small
        DpiHelper_1.DpiHelper.setSize(SciChartSurfaceBase.domMasterCanvas, newWidth, newHeight);
        var masterCanvasBackBufferWidth = SciChartSurfaceBase.domMasterCanvas.width;
        var masterCanvasBackBufferHeight = SciChartSurfaceBase.domMasterCanvas.height;
        wasmContext.SCRTSetMainWindowSize(masterCanvasBackBufferWidth, masterCanvasBackBufferHeight);
    };
    SciChartSurfaceBase.prototype.changeWebGLCanvasViewportSize = function (wasmContext, pixelWidth, pixelHeight) {
        if (!this.domCanvasWebGL)
            return;
        var backBufferWidth = pixelWidth * DpiHelper_1.DpiHelper.PIXEL_RATIO;
        var backBufferHeight = pixelHeight * DpiHelper_1.DpiHelper.PIXEL_RATIO;
        DpiHelper_1.DpiHelper.setSize(this.domCanvasWebGL, pixelWidth, pixelHeight);
        wasmContext.SCRTSetMainWindowSize(backBufferWidth, backBufferHeight);
    };
    SciChartSurfaceBase.prototype.detachAnnotation = function (annotation) {
        annotation.onDetach();
        annotation.invalidateParentCallback = undefined;
        annotation.parentSurface = undefined;
        this.invalidateElement();
    };
    SciChartSurfaceBase.prototype.attachAnnotation = function (annotation) {
        if (annotation.invalidateParentCallback) {
            throw new Error("Invalid operation in sciChartSurface.attachAnnotation, this annotation has already been attached to a SciChartSurface. Please detach it from a SciChartSurface before attaching to another");
        }
        annotation.parentSurface = this;
        annotation.invalidateParentCallback = this.invalidateElement;
        annotation.onAttach(this);
        this.invalidateElement();
    };
    /**
     * Gets or sets the application-wide default theme. See {@link IThemeProvider} for details
     */
    SciChartSurfaceBase.DEFAULT_THEME = new SciChartJSDarkv2Theme_1.SciChartJSDarkv2Theme();
    /**
     * Global property defining whether the WebGL render target is anti-aliased or not. This will affect all SciChartSurfaces (2D & 3D)
     * in the application.
     * @remarks Defaults to FALSE for crisp gridlines and lines. Individual line series and text labels are
     * chart parts are automatically anti-aliased
     */
    SciChartSurfaceBase.AntiAliasWebGlBackbuffer = false;
    /**
     * Defines a delay of the shared wasmContext auto-dispose if {@link autoDisposeWasmContext} is enabled.
     */
    SciChartSurfaceBase.wasmContextDisposeTimeout = 0;
    /**
     * Defines if the shared wasmContext ({@link TSciChart | WebAssembly Context}) should be deleted after all of the surfaces that use it are deleted.
     */
    SciChartSurfaceBase.autoDisposeWasmContext = false;
    /**
     * Defines if charts should rerender when the tab becomes active.
     * @remarks
     * Enabled by default. Purpose of this behavior is to deal with the issue of canvas data being cleared on an inactive tab .
     */
    SciChartSurfaceBase.invalidateOnTabVisible = true;
    return SciChartSurfaceBase;
}(DeletableEntity_1.DeletableEntity));
exports.SciChartSurfaceBase = SciChartSurfaceBase;
var createChartDestination = function (canvas) {
    if (!canvas)
        return undefined;
    return {
        canvas: canvas,
        GetHeight: function () {
            return this.canvas.height;
        },
        GetWidth: function () {
            return this.canvas.width;
        },
        GetID: function () {
            return this.canvas.id;
        }
    };
};
exports.createChartDestination = createChartDestination;
/** @ignore */
var getMasterCanvas = function () {
    /** @ignore */
    var SCICHART_MASTER_CANVAS_ID = "SciChartMasterCanvas";
    // Have we created a master canvas yet?
    if (!SciChartSurfaceBase.domMasterCanvas) {
        var canvasWebGL = document.createElement("canvas");
        canvasWebGL.id = SCICHART_MASTER_CANVAS_ID;
        canvasWebGL.style.display = "none";
        canvasWebGL.style.position = "absolute";
        canvasWebGL.style.left = "0";
        canvasWebGL.style.top = "0";
        if (exports.DebugForDpi) {
            canvasWebGL.style.background = "#00000077";
            canvasWebGL.style.pointerEvents = "none";
            canvasWebGL.style.left = "";
            canvasWebGL.style.top = "";
            canvasWebGL.style.display = "inline";
        }
        canvasWebGL.addEventListener("webglcontextcreationerror", function (event) {
            console.warn("WebGL Context creation error: ", event.statusMessage || "Unknown error");
        }, false);
        document.body.appendChild(canvasWebGL);
        var gl = WebGlHelper_1.WebGlHelper.getContext(canvasWebGL, {
            premultipliedAlpha: true,
            antialias: SciChartSurfaceBase.AntiAliasWebGlBackbuffer
        });
        // if (gl) {
        //     const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        //     const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        //     const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        //     console.log(`WebGL Debug info: ${vendor}, ${renderer}`);
        // }
        SciChartSurfaceBase.domMasterCanvas = canvasWebGL;
    }
    return SciChartSurfaceBase.domMasterCanvas;
};
exports.getMasterCanvas = getMasterCanvas;
/** @ignore */
var getLocateFile = function (sciChartConfig) { return function (path, prefix) {
    if (path.endsWith(".wasm") && sciChartConfig.wasmUrl) {
        return sciChartConfig.wasmUrl;
    }
    if (path.endsWith(".data") && sciChartConfig.dataUrl) {
        return sciChartConfig.dataUrl;
    }
    return prefix + path;
}; };
exports.getLocateFile = getLocateFile;
