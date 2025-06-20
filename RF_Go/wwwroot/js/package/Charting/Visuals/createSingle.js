"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDrawEngineSingleChart = exports.createSingleInternal = void 0;
// @ts-ignore
var WasmModule2D = require("../../_wasm/scichart2d");
var BuildStamp_1 = require("../../Core/BuildStamp");
var Guard_1 = require("../../Core/Guard");
var WebGlHelper_1 = require("../../Core/WebGlHelper");
var logger_1 = require("../../utils/logger");
var licenseManager2D_1 = require("./licenseManager2D");
var loader_1 = require("./loader");
var SciChartDefaults_1 = require("./SciChartDefaults");
var sciChartInitCommon_1 = require("./sciChartInitCommon");
var SciChartSurface_1 = require("./SciChartSurface");
var SciChartSurfaceBase_1 = require("./SciChartSurfaceBase");
var NativeObject_1 = require("./Helpers/NativeObject");
var DeletableEntity_1 = require("../../Core/DeletableEntity");
var Globals_1 = require("../../Core/Globals");
var LabelCache_1 = require("./Axis/LabelProvider/LabelCache");
var createMaster_1 = require("./createMaster");
var perfomance_1 = require("../../utils/perfomance");
// Global variables
/** @ignore */
var createSingleInternal = function (divElement, options) {
    return new Promise(function (resolve, reject) {
        var _a, _b;
        var canvases = sciChartInitCommon_1.default.initCanvas(divElement, options === null || options === void 0 ? void 0 : options.widthAspect, options === null || options === void 0 ? void 0 : options.heightAspect, undefined, options === null || options === void 0 ? void 0 : options.disableAspect, options === null || options === void 0 ? void 0 : options.touchAction);
        var loader = (_a = options === null || options === void 0 ? void 0 : options.loader) !== null && _a !== void 0 ? _a : new loader_1.DefaultSciChartLoader();
        var loaderDiv = (_b = loader.addChartLoader) === null || _b === void 0 ? void 0 : _b.call(loader, canvases.domDivContainer, options === null || options === void 0 ? void 0 : options.theme);
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.EngineInitStart, {
            parentContextId: canvases.domCanvas2D.id
        });
        var webGLSupport = WebGlHelper_1.WebGlHelper.getWebGlSupport();
        // console.log("webGLSupport", webGLSupport);
        if (webGLSupport === WebGlHelper_1.EWebGLSupport.WebGL2 || webGLSupport === WebGlHelper_1.EWebGLSupport.WebGL1) {
            var locateFile = (0, SciChartSurfaceBase_1.getLocateFile)(SciChartSurface_1.sciChartConfig);
            // @ts-ignore
            new WasmModule2D({ locateFile: locateFile, noInitialRun: true })
                .then(function (wasmContext) {
                var _a;
                (_a = loader.removeChartLoader) === null || _a === void 0 ? void 0 : _a.call(loader, canvases.domDivContainer, loaderDiv);
                // @ts-ignore
                wasmContext.doNotCaptureKeyboard = true;
                // TODO replace workaround with proper wasmContext references cleanup
                // TODO use revocable only for memory debug
                // if (process.env.NODE_ENV !== "production") {
                var revocable = (0, DeletableEntity_1.createWasmContextRevocableProxy)(wasmContext, canvases.domCanvas2D.id);
                var customResolve = function (res) {
                    var _a;
                    if ((_a = options === null || options === void 0 ? void 0 : options.createSuspended) !== null && _a !== void 0 ? _a : SciChartDefaults_1.SciChartDefaults.createSuspended) {
                        // // @ts-ignore
                        // sciChartSurface.createSuspended = true;
                        res.sciChartSurface.suspendUpdates();
                    }
                    res.sciChartSurface.addDeletable({
                        delete: function () {
                            revocable.revoke();
                            revocable = undefined;
                        }
                    });
                    perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.EngineInitEnd, {
                        relatedId: mark === null || mark === void 0 ? void 0 : mark.detail.relatedId,
                        contextId: res.sciChartSurface.id,
                        parentContextId: canvases.domCanvas2D.id
                    });
                    resolve(res);
                };
                (0, exports.initDrawEngineSingleChart)(revocable.proxy, canvases, customResolve, options === null || options === void 0 ? void 0 : options.theme);
                // return;
                // }
                // initDrawEngineSingleChart(wasmContext, canvases, resolve, options?.theme as IThemeProvider);
                (0, BuildStamp_1.checkBuildStamp)(wasmContext);
                (0, createMaster_1.monitorWebGL)(wasmContext);
            })
                .catch(function (err) {
                var _a;
                logger_1.Logger.debug(err);
                (_a = loader.removeChartLoader) === null || _a === void 0 ? void 0 : _a.call(loader, canvases.domDivContainer, loaderDiv);
                reject("Could not load SciChart WebAssembly module.\n                    Check your build process and ensure that your scichart2d.wasm, scichart2d.data and scichart2d.js files are from the same version");
            });
        }
        else {
            throw Error("Sorry Your browser does not support WebGL.");
        }
    });
};
exports.createSingleInternal = createSingleInternal;
/** @ignore */
var initDrawEngineSingleChart = function (wasmContext, canvases, resolve, theme) {
    Guard_1.Guard.notNull(theme, "theme");
    var width = canvases.domCanvas2D.width;
    var height = canvases.domCanvas2D.height;
    // @ts-ignore
    wasmContext.preRun.push(function () { return (ENV.SDL_EMSCRIPTEN_KEYBOARD_ELEMENT = "#chart_WebGL"); });
    var scs;
    wasmContext.canvas = canvases.domCanvasWebGL;
    var frameRenderer2D = new wasmContext.SCRTFrameRenderer2D();
    var webGlCanvasId = canvases.domCanvasWebGL.id;
    var chartInitializer = {
        InitializeChart: function () {
            scs = new SciChartSurface_1.SciChartSurface(wasmContext, { canvases: canvases });
            scs.applyTheme(theme);
            Globals_1.sciChartSingleDestinations.push({
                canvasElementId: webGlCanvasId,
                sciChartSurface: scs,
                width: width,
                height: height
            });
            scs.setDestinations(Globals_1.sciChartSingleDestinations);
            scs.addDeletable({
                delete: function () {
                    // Halt the engine
                    wasmContext.TSRRequestExit();
                    frameRenderer2D.delete();
                    wasmContext.SCRTGetGlobalSampleChartInterface().SetFrameRenderer(null);
                    wasmContext.SCRTGetGlobalSampleChartInterface().delete();
                    wasmContext.SCRTSetGlobalSampleChartInterface(null);
                    LabelCache_1.labelCache.resetCache();
                }
            });
            setTimeout(function () {
                scs.invalidateElement();
                licenseManager2D_1.licenseManager.applyLicense2D(wasmContext, scs, true);
                var unsub = sciChartInitCommon_1.default.subscribeToResize(canvases.domChartRoot, canvases.aspect, scs, canvases.disableAspect);
                scs.addDeletable(unsub);
                scs.addDeletable((0, NativeObject_1.freeCache)(wasmContext));
                scs.setIsInitialized();
                resolve({ wasmContext: wasmContext, sciChartSurface: scs });
            }, 0);
        },
        Draw: function (canvasId) {
            scs.renderSurface.onRenderTimeElapsed();
        },
        Update: function (deltaTime) {
            // Logger.debug("sciChartInitCommon.ts Update");
        },
        ShutDownChart: function () {
            // Logger.debug("sciChartInitCommon.ts ShutDownChart");
        }
    };
    var chartInitObj = wasmContext.SCRTSampleChartInterface.implement(chartInitializer);
    chartInitObj.SetFrameRenderer(frameRenderer2D);
    chartInitObj.SetFPSCounterEnabled(false);
    chartInitObj.SetWasmBufferSizesKb(SciChartDefaults_1.SciChartDefaults.wasmBufferSizesKb);
    wasmContext.SCRTSetGlobalSampleChartInterface(chartInitObj);
    // @ts-ignore
    wasmContext.callMain();
};
exports.initDrawEngineSingleChart = initDrawEngineSingleChart;
