"use strict";
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
exports.monitorWebGL = exports.disposeMultiChart = exports.initializeChartEngine2D = exports.getSharedWasmContext = exports.createMultichart = void 0;
// @ts-ignore
var WasmModule2D = require("../../_wasm/scichart2d");
var BuildStamp_1 = require("../../Core/BuildStamp");
var Guard_1 = require("../../Core/Guard");
var WebGlRenderContext2D_1 = require("../Drawing/WebGlRenderContext2D");
var licenseManager2D_1 = require("./licenseManager2D");
var loader_1 = require("./loader");
var SciChartDefaults_1 = require("./SciChartDefaults");
var sciChartInitCommon_1 = require("./sciChartInitCommon");
var SciChartSurface_1 = require("./SciChartSurface");
var SciChartSurfaceBase_1 = require("./SciChartSurfaceBase");
var Globals_1 = require("../../Core/Globals");
var DeletableEntity_1 = require("../../Core/DeletableEntity");
var NativeObject_1 = require("./Helpers/NativeObject");
var LabelCache_1 = require("./Axis/LabelProvider/LabelCache");
var MemoryUsageHelper_1 = require("../../utils/MemoryUsageHelper");
var WebGlHelper_1 = require("../../Core/WebGlHelper");
var logger_1 = require("../../utils/logger");
var copyCanvasUtils_1 = require("./copyCanvasUtils");
var perfomance_1 = require("../../utils/perfomance");
var guid_1 = require("../../utils/guid");
// Global variables
/** @ignore */
var sciChartMaster = {
    id: undefined,
    wasmContext: undefined,
    getChildSurfaces: undefined,
    createChildSurface: undefined
};
/** @ignore */
var sciChartMasterPromise;
/** @ignore */
var createMultichart = function (divElement, options) { return __awaiter(void 0, void 0, void 0, function () {
    var canvases, loader, loaderDiv, createChildSurface, wasmContext_1, divElementId, sciChartSurface_1, err_1;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                sciChartInitCommon_1.default.checkChartDivExists(divElement);
                canvases = sciChartInitCommon_1.default.initCanvas(divElement, (_a = options === null || options === void 0 ? void 0 : options.widthAspect) !== null && _a !== void 0 ? _a : 0, (_b = options === null || options === void 0 ? void 0 : options.heightAspect) !== null && _b !== void 0 ? _b : 0, sciChartInitCommon_1.default.ECanvasType.canvas2D, options === null || options === void 0 ? void 0 : options.disableAspect, options === null || options === void 0 ? void 0 : options.touchAction);
                loader = (_c = options === null || options === void 0 ? void 0 : options.loader) !== null && _c !== void 0 ? _c : new loader_1.DefaultSciChartLoader();
                loaderDiv = (_d = loader.addChartLoader) === null || _d === void 0 ? void 0 : _d.call(loader, canvases.domDivContainer, options === null || options === void 0 ? void 0 : options.theme);
                _f.label = 1;
            case 1:
                _f.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, exports.initializeChartEngine2D)({ destinationCanvas: canvases.domCanvas2D })];
            case 2:
                _f.sent();
                createChildSurface = sciChartMaster.createChildSurface, wasmContext_1 = sciChartMaster.wasmContext;
                divElementId = canvases ? canvases.domChartRoot.id : "divElementId";
                sciChartSurface_1 = createChildSurface(divElementId, canvases, options === null || options === void 0 ? void 0 : options.theme);
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            var _a, _b;
                            if ((_a = options === null || options === void 0 ? void 0 : options.createSuspended) !== null && _a !== void 0 ? _a : SciChartDefaults_1.SciChartDefaults.createSuspended) {
                                // // @ts-ignore
                                // sciChartSurface.createSuspended = true;
                                sciChartSurface_1.suspendUpdates();
                            }
                            (_b = loader.removeChartLoader) === null || _b === void 0 ? void 0 : _b.call(loader, canvases.domDivContainer, loaderDiv);
                            loaderDiv = undefined;
                            sciChartSurface_1.setIsInitialized();
                            resolve({ wasmContext: wasmContext_1, sciChartSurface: sciChartSurface_1 });
                        }, 0);
                    })];
            case 3:
                err_1 = _f.sent();
                console.error(err_1);
                // replace with div with error message
                (_e = loader.removeChartLoader) === null || _e === void 0 ? void 0 : _e.call(loader, canvases.domDivContainer, loaderDiv);
                loaderDiv = undefined;
                return [2 /*return*/, Promise.reject(err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createMultichart = createMultichart;
var getSharedWasmContext = function () { return __awaiter(void 0, void 0, void 0, function () {
    var wasmContext;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.initializeChartEngine2D)()];
            case 1:
                wasmContext = (_a.sent()).wasmContext;
                return [2 /*return*/, wasmContext];
        }
    });
}); };
exports.getSharedWasmContext = getSharedWasmContext;
var initializeChartEngine2D = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var canvas2DId, mark, master;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                canvas2DId = (_a = options === null || options === void 0 ? void 0 : options.destinationCanvas) === null || _a === void 0 ? void 0 : _a.id;
                mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.EngineInitStart, { parentContextId: canvas2DId });
                WebGlHelper_1.WebGlHelper.initialize();
                if (!(!sciChartMaster.wasmContext || !sciChartMaster.createChildSurface || !sciChartMaster.getChildSurfaces)) return [3 /*break*/, 2];
                if (!sciChartMasterPromise) {
                    (0, licenseManager2D_1.forceReapplyLicense2D)();
                    sciChartMasterPromise = createMaster();
                }
                return [4 /*yield*/, sciChartMasterPromise];
            case 1:
                master = _c.sent();
                sciChartMaster.id = master.id;
                sciChartMaster.wasmContext = master.wasmContext;
                (0, BuildStamp_1.checkBuildStamp)(master.wasmContext);
                sciChartMaster.createChildSurface = master.createChildSurface;
                sciChartMaster.getChildSurfaces = master.getChildSurfaces;
                (0, exports.monitorWebGL)(master.wasmContext);
                _c.label = 2;
            case 2:
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.EngineInitEnd, {
                    relatedId: (_b = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _b === void 0 ? void 0 : _b.relatedId,
                    contextId: sciChartMaster.id,
                    parentContextId: canvas2DId
                });
                return [2 /*return*/, sciChartMasterPromise];
        }
    });
}); };
exports.initializeChartEngine2D = initializeChartEngine2D;
var cleanupWasmContext;
/** @ignore */
var disposeMultiChart = function () {
    if (cleanupWasmContext) {
        cleanupWasmContext();
    }
    sciChartMaster.createChildSurface = undefined;
    sciChartMaster.getChildSurfaces = undefined;
    sciChartMaster.wasmContext = undefined;
    sciChartMaster.id = undefined;
    sciChartMasterPromise = undefined;
    // TODO make sure it works properly in combination with createSingle & 3D
    licenseManager2D_1.licenseManager.clear();
};
exports.disposeMultiChart = disposeMultiChart;
/** @ignore */
var monitorWebGL = function (wasmContext) {
    var restoreContext = function () {
        // restart the engine
        wasmContext.SCRTInitEngine2D();
        wasmContext.TSRSetDrawRequestsEnabled(true);
    };
    var webGLLostContextEventHandler = function (event) {
        console.warn("WebGL context lost: ", event.statusMessage);
        event.preventDefault();
        // invalidate WebGl Resources
        WebGlRenderContext2D_1.WebGlRenderContext2D.webGlResourcesRefs.forEach(function (penCache) {
            penCache.invalidateCache();
        });
        // invalidate Labels Cache
        LabelCache_1.labelCache.resetCache();
        // invalidate native object cache
        (0, NativeObject_1.deleteCache)(wasmContext);
        // stop the engine
        wasmContext.SCRTShutdownEngine2D();
    };
    var webGLRestoredContextHandler = function (event) {
        console.warn("WebGL context restored: ", event.statusMessage);
        restoreContext();
    };
    wasmContext.canvas.addEventListener("webglcontextlost", webGLLostContextEventHandler, false);
    wasmContext.canvas.addEventListener("webglcontextrestored", webGLRestoredContextHandler, false);
};
exports.monitorWebGL = monitorWebGL;
/** @ignore */
var createMaster = function () {
    var createChildSurfaceInner = function (wasmContext, divElementId, canvases, theme) {
        Guard_1.Guard.notNull(theme, "theme");
        var sciChartSurface = new SciChartSurface_1.SciChartSurface(wasmContext, { canvases: canvases });
        sciChartSurface.applyTheme(theme);
        var unsub = sciChartInitCommon_1.default.subscribeToResize(canvases.domChartRoot, canvases.aspect, sciChartSurface, canvases.disableAspect);
        sciChartSurface.addDeletable(unsub);
        sciChartSurface.setDestinations(Globals_1.sciChartDestinations);
        return sciChartSurface;
    };
    var addDestination = function (wasmContext, canvasElementId, sciChartSurface, width, height, chartInitObj) {
        var newDestination = (0, SciChartSurfaceBase_1.createChartDestination)(sciChartSurface.domCanvas2D);
        if (!newDestination) {
            sciChartSurface.delete();
            return;
        }
        var dest = wasmContext.SCRTSurfaceDestination.implement(newDestination);
        chartInitObj.AddDestination(dest);
        chartInitObj.SetFPSCounterEnabled(false);
        Globals_1.sciChartDestinations.push({ canvasElementId: canvasElementId, sciChartSurface: sciChartSurface, width: width, height: height });
    };
    return new Promise(function (resolve, reject) {
        // make sure canvas has event listener for context creation error
        var canvas = (0, SciChartSurfaceBase_1.getMasterCanvas)();
        var locateFile = (0, SciChartSurfaceBase_1.getLocateFile)(SciChartSurface_1.sciChartConfig);
        // @ts-ignore
        new WasmModule2D({ locateFile: locateFile, noInitialRun: true })
            .then(function (originalWasmContext, anythingElse) {
            var wasmContextId = (0, guid_1.generateGuid)();
            var revocable = (0, DeletableEntity_1.createWasmContextRevocableProxy)(originalWasmContext, wasmContextId);
            var wasmContext = revocable.proxy;
            cleanupWasmContext = function () {
                LabelCache_1.labelCache.resetCache();
                // Halt the engine
                wasmContext.TSRRequestExit();
                frameRenderer2D.delete();
                // wasmContext.SCRTGetGlobalSampleChartInterface().GetFrameRenderer().delete();
                wasmContext.SCRTGetGlobalSampleChartInterface().SetFrameRenderer(null);
                wasmContext.SCRTGetGlobalSampleChartInterface().delete();
                wasmContext.SCRTSetGlobalSampleChartInterface(null);
                (0, NativeObject_1.deleteCache)(wasmContext);
                canvasCopyObj.delete();
                wasmContext.SCRTSetGlobalCopyToDestinationInterface(null);
                revocable.revoke();
                revocable = undefined;
                cleanupWasmContext = undefined;
            };
            var frameRenderer2D = new wasmContext.SCRTFrameRenderer2D();
            /// create an object that native side can trigger the copy to from...
            var canvasCopyObj = wasmContext.SCRTCopyToDestinationInterface.implement({
                CopyToDestination: (0, copyCanvasUtils_1.copyToCanvas)(SciChartSurfaceBase_1.SciChartSurfaceBase.domMasterCanvas, getDestinationById)
            });
            var getChildSurfaces = function () { return Globals_1.sciChartDestinations.map(function (el) { return el.sciChartSurface; }); };
            // Create of replace child surface
            var createChildSurface = function (divElementId, canvases, theme) {
                Guard_1.Guard.notNull(theme, "theme");
                var canvas2dId = sciChartInitCommon_1.default.getCanvas2dId(divElementId);
                // TODO check other destinations
                var sameIdDestinations = Globals_1.sciChartDestinations.filter(function (el) { return el.canvasElementId === canvas2dId; });
                try {
                    if (process.env.NODE_ENV !== "production") {
                        if (MemoryUsageHelper_1.MemoryUsageHelper.isMemoryUsageDebugEnabled && sameIdDestinations.length > 0) {
                            console.warn("Trying to create a SciChartSurface on a root element (".concat(divElementId, ") of another surface before it was deleted ! This will automatically delete the previous surface."));
                        }
                    }
                }
                catch (err) {
                    console.warn(err);
                }
                var otherDestinations = Globals_1.sciChartDestinations.filter(function (el) { return el.canvasElementId !== canvas2dId; });
                chartInitObj.ClearDestinations();
                while (Globals_1.sciChartDestinations.length > 0) {
                    Globals_1.sciChartDestinations.pop();
                }
                otherDestinations.forEach(function (el) {
                    return addDestination(wasmContext, el.canvasElementId, el.sciChartSurface, el.width, el.height, chartInitObj);
                });
                var sciChartSurface = createChildSurfaceInner(wasmContext, divElementId, canvases, theme);
                sciChartSurface.addDeletable({
                    delete: function () {
                        if (SciChartSurface_1.SciChartSurface.autoDisposeWasmContext && sciChartSurface.otherSurfaces.length === 0) {
                            if (SciChartSurface_1.SciChartSurface.wasmContextDisposeTimeout) {
                                setTimeout(function () {
                                    if (Globals_1.sciChartDestinations.length === 0) {
                                        SciChartSurface_1.SciChartSurface.disposeSharedWasmContext();
                                    }
                                }, SciChartSurface_1.SciChartSurface.wasmContextDisposeTimeout);
                            }
                            else {
                                SciChartSurface_1.SciChartSurface.disposeSharedWasmContext();
                            }
                        }
                        else {
                            try {
                                if (process.env.NODE_ENV !== "production") {
                                    if (MemoryUsageHelper_1.MemoryUsageHelper.isMemoryUsageDebugEnabled &&
                                        sciChartSurface.otherSurfaces.length === 0) {
                                        console.warn("SciChartSurface.autoDisposeWasmContext is disabled, thus wasmContext should be disposed explicitly using \"SciChartSurface.disposeSharedWasmContext()\".");
                                    }
                                }
                            }
                            catch (err) {
                                console.warn(err);
                            }
                        }
                    }
                });
                addDestination(wasmContext, canvas2dId, sciChartSurface, canvases.domCanvas2D.width, canvases.domCanvas2D.height, chartInitObj);
                sameIdDestinations.forEach(function (el) { return el.sciChartSurface.delete(false); });
                licenseManager2D_1.licenseManager.applyLicense2D(wasmContext, sciChartSurface, false);
                return sciChartSurface;
            };
            wasmContext.canvas = canvas;
            var chartInitializer = {
                InitializeChart: function () {
                    logger_1.Logger.debug("InitializeChart");
                    resolve({ id: wasmContextId, getChildSurfaces: getChildSurfaces, createChildSurface: createChildSurface, wasmContext: wasmContext });
                },
                Draw: function (canvasId) {
                    logger_1.Logger.debug("Draw", canvasId);
                    var dest = Globals_1.sciChartDestinations.find(function (d) { return d.canvasElementId === canvasId; });
                    if (dest) {
                        dest.sciChartSurface.renderSurface.onRenderTimeElapsed();
                    }
                },
                Update: function (deltaTime) {
                    logger_1.Logger.debug("sciChartInitCommon.ts Update", deltaTime);
                },
                ShutDownChart: function () {
                    logger_1.Logger.debug("sciChartInitCommon.ts ShutDownChart");
                }
            };
            var chartInitObj = wasmContext.SCRTSampleChartInterface.implement(chartInitializer);
            chartInitObj.SetFrameRenderer(frameRenderer2D);
            // Note: in case of createMaster this property must be set before the first chart created.
            // It will be shared buffer size across all charts
            chartInitObj.SetWasmBufferSizesKb(SciChartDefaults_1.SciChartDefaults.wasmBufferSizesKb);
            wasmContext.SCRTSetGlobalSampleChartInterface(chartInitObj);
            wasmContext.SCRTSetGlobalCopyToDestinationInterface(canvasCopyObj);
            wasmContext.TSRSetDrawRequestsEnabled(true);
            // SCJS-1321 fixes cutting 3d chart issue. 3D wasm and vice versa doesn't know about domMasterCanvas width/height
            // when creating one 3d chart and one 2d chart on the same screen. So we tell the other wasm about existing master canvas size
            if (SciChartSurfaceBase_1.SciChartSurfaceBase.domMasterCanvas) {
                wasmContext.SCRTSetMainWindowSize(SciChartSurfaceBase_1.SciChartSurfaceBase.domMasterCanvas.width, SciChartSurfaceBase_1.SciChartSurfaceBase.domMasterCanvas.height);
            }
            // @ts-ignore
            wasmContext.callMain();
        })
            .catch(function (err) {
            console.error(err);
            reject("Could not load SciChart WebAssembly module.\n                Check your build process and ensure that your scichart2d.wasm, scichart2d.data and scichart2d.js files are from the same version");
        });
    });
};
/** @ignore */
var getDestinationById = function (destinationId) {
    return Globals_1.sciChartDestinations.find(function (dest) { return dest.canvasElementId === destinationId; });
};
