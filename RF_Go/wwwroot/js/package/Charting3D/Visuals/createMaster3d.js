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
exports.disposeMultiChart3d = exports.createMultichart3d = void 0;
// @ts-ignore
var WasmModule3D = require("../../_wasm/scichart3d");
var chartBuilder_1 = require("../../Builder/chartBuilder");
var copyCanvasUtils_1 = require("../../Charting/Visuals/copyCanvasUtils");
var licenseManager2D_1 = require("../../Charting/Visuals/licenseManager2D");
var loader_1 = require("../../Charting/Visuals/loader");
var SciChartDefaults_1 = require("../../Charting/Visuals/SciChartDefaults");
var sciChartInitCommon_1 = require("../../Charting/Visuals/sciChartInitCommon");
var SciChartSurfaceBase_1 = require("../../Charting/Visuals/SciChartSurfaceBase");
var BuildStamp_1 = require("../../Core/BuildStamp");
var DeletableEntity_1 = require("../../Core/DeletableEntity");
var Globals_1 = require("../../Core/Globals");
var guid_1 = require("../../utils/guid");
var MemoryUsageHelper_1 = require("../../utils/MemoryUsageHelper");
var perfomance_1 = require("../../utils/perfomance");
var licenseManager3D_1 = require("./licenseManager3D");
var SciChart3DSurface_1 = require("./SciChart3DSurface");
/** @ignore */
var sciChartMaster3D = {
    id: undefined,
    wasmContext: undefined,
    getChildSurfaces: undefined,
    createChildSurface: undefined
};
/** @ignore */
var sciChartMaster3DPromise;
/** @ignore */
var createMultichart3d = function (divElement, options) { return __awaiter(void 0, void 0, void 0, function () {
    var canvases, loader, loaderDiv, canvas2DId, mark, master, createChildSurface, wasmContext_1, divElementId, sciChart3DSurface_1, err_1;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                (0, chartBuilder_1.ensureRegistrations)();
                sciChartInitCommon_1.default.checkChartDivExists(divElement);
                canvases = sciChartInitCommon_1.default.initCanvas(divElement, (_a = options === null || options === void 0 ? void 0 : options.widthAspect) !== null && _a !== void 0 ? _a : 0, (_b = options === null || options === void 0 ? void 0 : options.heightAspect) !== null && _b !== void 0 ? _b : 0, sciChartInitCommon_1.default.ECanvasType.canvas2D, undefined, options === null || options === void 0 ? void 0 : options.touchAction);
                loader = (_c = options === null || options === void 0 ? void 0 : options.loader) !== null && _c !== void 0 ? _c : new loader_1.DefaultSciChartLoader();
                loaderDiv = (_d = loader.addChartLoader) === null || _d === void 0 ? void 0 : _d.call(loader, canvases.domDivContainer, (_e = options === null || options === void 0 ? void 0 : options.theme) !== null && _e !== void 0 ? _e : SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME);
                _k.label = 1;
            case 1:
                _k.trys.push([1, 4, , 5]);
                canvas2DId = (_f = canvases.domCanvas2D) === null || _f === void 0 ? void 0 : _f.id;
                mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.EngineInitStart, { parentContextId: canvas2DId });
                if (!(!sciChartMaster3D.wasmContext ||
                    !sciChartMaster3D.createChildSurface ||
                    !sciChartMaster3D.getChildSurfaces)) return [3 /*break*/, 3];
                if (!sciChartMaster3DPromise) {
                    (0, licenseManager3D_1.forceReapplyLicense3D)();
                    sciChartMaster3DPromise = createMaster();
                }
                return [4 /*yield*/, sciChartMaster3DPromise];
            case 2:
                master = _k.sent();
                (0, BuildStamp_1.checkBuildStamp)(master.wasmContext);
                sciChartMaster3D.id = master.id;
                sciChartMaster3D.wasmContext = master.wasmContext;
                sciChartMaster3D.createChildSurface = master.createChildSurface;
                sciChartMaster3D.getChildSurfaces = master.getChildSurfaces;
                _k.label = 3;
            case 3:
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.EngineInitEnd, {
                    relatedId: (_g = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _g === void 0 ? void 0 : _g.relatedId,
                    contextId: sciChartMaster3D.id,
                    parentContextId: canvas2DId
                });
                createChildSurface = sciChartMaster3D.createChildSurface, wasmContext_1 = sciChartMaster3D.wasmContext;
                divElementId = canvases.domChartRoot.id;
                sciChart3DSurface_1 = createChildSurface(divElementId, canvases, (_h = options === null || options === void 0 ? void 0 : options.theme) !== null && _h !== void 0 ? _h : SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME);
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            var _a;
                            (_a = loader.removeChartLoader) === null || _a === void 0 ? void 0 : _a.call(loader, canvases.domDivContainer, loaderDiv);
                            sciChart3DSurface_1.setIsInitialized();
                            resolve({ wasmContext: wasmContext_1, sciChart3DSurface: sciChart3DSurface_1 });
                        }, 0);
                    })];
            case 4:
                err_1 = _k.sent();
                console.error(err_1);
                // replace with div with error message
                (_j = loader.removeChartLoader) === null || _j === void 0 ? void 0 : _j.call(loader, canvases.domDivContainer, loaderDiv);
                return [2 /*return*/, Promise.reject(err_1)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createMultichart3d = createMultichart3d;
var cleanupWasmContext;
/** @ignore */
var disposeMultiChart3d = function () {
    if (cleanupWasmContext) {
        cleanupWasmContext();
    }
    sciChartMaster3D.createChildSurface = undefined;
    sciChartMaster3D.getChildSurfaces = undefined;
    sciChartMaster3D.wasmContext = undefined;
    sciChartMaster3DPromise = undefined;
    licenseManager2D_1.licenseManager.clear();
};
exports.disposeMultiChart3d = disposeMultiChart3d;
/** @ignore */
var createMaster = function () {
    var createChildSurfaceInner = function (wasmContext, divElementId, canvases, theme) {
        var sciChart3DSurface = new SciChart3DSurface_1.SciChart3DSurface(wasmContext, { canvases: canvases });
        sciChart3DSurface.applyTheme(theme);
        sciChart3DSurface.setDestinations(Globals_1.sciChart3DDestinations);
        var unsub = sciChartInitCommon_1.default.subscribeToResize(canvases.domChartRoot, canvases.aspect, sciChart3DSurface);
        sciChart3DSurface.addDeletable(unsub);
        return sciChart3DSurface;
    };
    var addDestination = function (wasmContext, canvasElementId, sciChartSurface, width, height, chartInitObj3D) {
        var newDestination = (0, SciChartSurfaceBase_1.createChartDestination)(sciChartSurface.domCanvas2D);
        if (!newDestination) {
            sciChartSurface.delete();
            return;
        }
        var dest = wasmContext.SCRTSurfaceDestination.implement(newDestination);
        chartInitObj3D.AddDestination(dest);
        Globals_1.sciChart3DDestinations.push({ canvasElementId: canvasElementId, sciChartSurface: sciChartSurface, width: width, height: height });
    };
    return new Promise(function (resolve, reject) {
        var locateFile = (0, SciChartSurfaceBase_1.getLocateFile)(SciChart3DSurface_1.sciChartConfig3D);
        // @ts-ignore
        new WasmModule3D({ locateFile: locateFile, noInitialRun: true })
            .then(function (originalWasmContext) {
            var wasmContextId = (0, guid_1.generateGuid)();
            var revocable = (0, DeletableEntity_1.createWasmContextRevocableProxy)(originalWasmContext, wasmContextId);
            var wasmContext = revocable.proxy;
            cleanupWasmContext = function () {
                // Halt the engine
                wasmContext.TSRRequestExit();
                frameRenderer3D.delete();
                // wasmContext.SCRTGetGlobalSampleChartInterface().GetFrameRenderer().delete();
                wasmContext.SCRTGetGlobalSampleChartInterface().SetFrameRenderer(null);
                wasmContext.SCRTGetGlobalSampleChartInterface().delete();
                wasmContext.SCRTSetGlobalSampleChartInterface(null);
                // deleteCache(wasmContext);
                canvasCopyObj.delete();
                wasmContext.SCRTSetGlobalCopyToDestinationInterface(null);
                revocable.revoke();
                revocable = undefined;
                cleanupWasmContext = undefined;
            };
            var getChildSurfaces = function () {
                return Globals_1.sciChart3DDestinations.map(function (el) { return el.sciChartSurface; });
            };
            // Create of replace child surface
            var createChildSurface = function (divElementId, canvases, theme) {
                var canvas2dId = sciChartInitCommon_1.default.getCanvas2dId(divElementId);
                var otherDestinations = Globals_1.sciChart3DDestinations.filter(function (el) { return el.canvasElementId !== canvas2dId; });
                chartInitObj.ClearDestinations();
                var sameIdDestination = Globals_1.sciChart3DDestinations.filter(function (el) { return el.canvasElementId === canvas2dId; });
                sameIdDestination.forEach(function (el) { return el.sciChartSurface.delete(); });
                while (Globals_1.sciChart3DDestinations.length > 0) {
                    Globals_1.sciChart3DDestinations.pop();
                }
                otherDestinations.forEach(function (el) {
                    return addDestination(wasmContext, el.canvasElementId, el.sciChartSurface, el.width, el.height, chartInitObj);
                });
                var sciChart3DSurface = createChildSurfaceInner(wasmContext, divElementId, canvases, theme);
                sciChart3DSurface.addDeletable({
                    delete: function () {
                        if (SciChart3DSurface_1.SciChart3DSurface.autoDisposeWasmContext &&
                            sciChart3DSurface.otherSurfaces.length === 0) {
                            if (SciChart3DSurface_1.SciChart3DSurface.wasmContextDisposeTimeout) {
                                setTimeout(function () {
                                    if (Globals_1.sciChart3DDestinations.length === 0) {
                                        SciChart3DSurface_1.SciChart3DSurface.disposeSharedWasmContext();
                                    }
                                }, SciChart3DSurface_1.SciChart3DSurface.wasmContextDisposeTimeout);
                            }
                            else {
                                SciChart3DSurface_1.SciChart3DSurface.disposeSharedWasmContext();
                            }
                        }
                        else {
                            try {
                                if (process.env.NODE_ENV !== "production") {
                                    if (MemoryUsageHelper_1.MemoryUsageHelper.isMemoryUsageDebugEnabled &&
                                        sciChart3DSurface.otherSurfaces.length === 0) {
                                        console.warn("SciChart3DSurface.autoDisposeWasmContext is disabled, thus wasmContext should be disposed explicitly using \"SciChartSurface.disposeSharedWasmContext()\".");
                                    }
                                }
                            }
                            catch (err) {
                                console.warn(err);
                            }
                        }
                    }
                });
                addDestination(wasmContext, canvas2dId, sciChart3DSurface, canvases.domCanvas2D.width, canvases.domCanvas2D.height, chartInitObj);
                (0, licenseManager3D_1.applyLicense3D)(wasmContext, sciChart3DSurface, false);
                return sciChart3DSurface;
            };
            wasmContext.canvas = (0, SciChartSurfaceBase_1.getMasterCanvas)();
            var chartInitializer = {
                InitializeChart: function () {
                    resolve({ id: wasmContextId, getChildSurfaces: getChildSurfaces, createChildSurface: createChildSurface, wasmContext: wasmContext });
                },
                Draw: function (canvasId) {
                    var dest = Globals_1.sciChart3DDestinations.find(function (d) { return d.canvasElementId === canvasId; });
                    if (dest) {
                        dest.sciChartSurface.doDrawingLoop();
                    }
                },
                Update: function (deltaTime) {
                    // console.log("Update");
                },
                ShutDownChart: function () {
                    // console.log("ShutDownChart");
                }
            };
            var chartInitObj = wasmContext.SCRTSampleChartInterface.implement(chartInitializer);
            var frameRenderer3D = new wasmContext.SCRTFrameRenderer3D();
            chartInitObj.SetFrameRenderer(frameRenderer3D);
            chartInitObj.SetFPSCounterEnabled(false);
            // This may not be used in the case of 3D charts, but we set the property anyway as its passed down to TSR engine when initialising
            chartInitObj.SetWasmBufferSizesKb(SciChartDefaults_1.SciChartDefaults.wasmBufferSizesKb);
            wasmContext.SCRTSetGlobalSampleChartInterface(chartInitObj);
            // create an object that native side can trigger the copy to from...
            var canvasCopyObj = wasmContext.SCRTCopyToDestinationInterface.implement({
                CopyToDestination: (0, copyCanvasUtils_1.copyToCanvas)(SciChartSurfaceBase_1.SciChartSurfaceBase.domMasterCanvas, getDestinationById)
            });
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
            .catch(function () {
            reject("Could not load SciChart WebAssembly module.\n            Check your build process and ensure that your scichart3d.wasm, scichart3d.data and scichart3d.js files are from the same version");
        });
    });
};
/** @ignore */
var getDestinationById = function (destinationId) {
    return Globals_1.sciChart3DDestinations.find(function (dest) { return dest.canvasElementId === destinationId; });
};
