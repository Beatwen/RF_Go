"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSingle3dInternal = void 0;
// @ts-ignore
var WasmModule3D = require("../../_wasm/scichart3d");
var chartBuilder_1 = require("../../Builder/chartBuilder");
var licenseManager2D_1 = require("../../Charting/Visuals/licenseManager2D");
var loader_1 = require("../../Charting/Visuals/loader");
var SciChartDefaults_1 = require("../../Charting/Visuals/SciChartDefaults");
var sciChartInitCommon_1 = require("../../Charting/Visuals/sciChartInitCommon");
var SciChartSurfaceBase_1 = require("../../Charting/Visuals/SciChartSurfaceBase");
var BuildStamp_1 = require("../../Core/BuildStamp");
var DeletableEntity_1 = require("../../Core/DeletableEntity");
var WebGlHelper_1 = require("../../Core/WebGlHelper");
var perfomance_1 = require("../../utils/perfomance");
var licenseManager3D_1 = require("./licenseManager3D");
var SciChart3DSurface_1 = require("./SciChart3DSurface");
var createSingle3dInternal = function (divElement, options) {
    (0, chartBuilder_1.ensureRegistrations)();
    return new Promise(function (resolve, reject) {
        var _a, _b, _c, _d, _e;
        var canvases = sciChartInitCommon_1.default.initCanvas(divElement, (_a = options === null || options === void 0 ? void 0 : options.widthAspect) !== null && _a !== void 0 ? _a : 0, (_b = options === null || options === void 0 ? void 0 : options.heightAspect) !== null && _b !== void 0 ? _b : 0, undefined, undefined, options === null || options === void 0 ? void 0 : options.touchAction);
        var loader = (_c = options === null || options === void 0 ? void 0 : options.loader) !== null && _c !== void 0 ? _c : new loader_1.DefaultSciChartLoader();
        var loaderDiv = (_d = loader.addChartLoader) === null || _d === void 0 ? void 0 : _d.call(loader, canvases.domDivContainer, (_e = options === null || options === void 0 ? void 0 : options.theme) !== null && _e !== void 0 ? _e : SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME);
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.EngineInitStart, {
            parentContextId: canvases.domCanvas2D.id
        });
        var webGLSupport = WebGlHelper_1.WebGlHelper.getWebGlSupport();
        // console.log("webGLSupport", webGLSupport);
        if (webGLSupport === WebGlHelper_1.EWebGLSupport.WebGL2 || webGLSupport === WebGlHelper_1.EWebGLSupport.WebGL1) {
            var locateFile = (0, SciChartSurfaceBase_1.getLocateFile)(SciChart3DSurface_1.sciChartConfig3D);
            // @ts-ignore
            new WasmModule3D({ locateFile: locateFile, noInitialRun: true })
                .then(function (wasmContext) {
                var _a, _b;
                (_a = loader.removeChartLoader) === null || _a === void 0 ? void 0 : _a.call(loader, canvases.domDivContainer, loaderDiv);
                // @ts-ignore
                wasmContext.doNotCaptureKeyboard = true;
                var revocable = (0, DeletableEntity_1.createWasmContextRevocableProxy)(wasmContext, canvases.domCanvas2D.id);
                var customResolve = function (res) {
                    res.sciChart3DSurface.addDeletable({
                        delete: function () {
                            revocable.revoke();
                            revocable = undefined;
                        }
                    });
                    perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.EngineInitEnd, {
                        relatedId: mark === null || mark === void 0 ? void 0 : mark.detail.relatedId,
                        contextId: res.sciChart3DSurface.id,
                        parentContextId: canvases.domCanvas2D.id
                    });
                    resolve(res);
                };
                initDrawEngineSingleChart(revocable.proxy, canvases, customResolve, (_b = options === null || options === void 0 ? void 0 : options.theme) !== null && _b !== void 0 ? _b : SciChartSurfaceBase_1.SciChartSurfaceBase.DEFAULT_THEME);
                // initDrawEngineSingleChart(
                //     wasmContext,
                //     canvases,
                //     resolve,
                //     (options?.theme as IThemeProvider) ?? SciChartSurfaceBase.DEFAULT_THEME
                // );
                (0, BuildStamp_1.checkBuildStamp)(wasmContext);
            })
                .catch(function (ex) {
                var _a;
                (_a = loader.removeChartLoader) === null || _a === void 0 ? void 0 : _a.call(loader, canvases.domDivContainer, loaderDiv);
                throw ex;
                reject("Could not load SciChart WebAssembly module.\n                Check your build process and ensure that your scichart3d.wasm, scichart3d.data and scichart3d.js files are from the same version");
            });
        }
        else {
            throw Error("Sorry Your browser does not support WebGL.");
        }
    });
};
exports.createSingle3dInternal = createSingle3dInternal;
// SINGLE CHART FUNCTIONS
/** @ignore */
var initDrawEngineSingleChart = function (wasmContext, canvases, resolve, theme) {
    // @ts-ignore
    wasmContext.preRun.push(function () { return (ENV.SDL_EMSCRIPTEN_KEYBOARD_ELEMENT = "#chart_WebGL"); });
    var scs;
    wasmContext.canvas = canvases.domCanvasWebGL;
    var chartInitializer = {
        InitializeChart: function () {
            scs = new SciChart3DSurface_1.SciChart3DSurface(wasmContext, { canvases: canvases });
            scs.applyTheme(theme);
            scs.addDeletable({
                delete: function () {
                    // Halt the engine
                    wasmContext.TSRRequestExit();
                    frameRenderer3D.delete();
                    wasmContext.SCRTGetGlobalSampleChartInterface().SetFrameRenderer(null);
                    wasmContext.SCRTGetGlobalSampleChartInterface().delete();
                    wasmContext.SCRTSetGlobalSampleChartInterface(null);
                    licenseManager2D_1.licenseManager.clear();
                }
            });
            setTimeout(function () {
                scs.invalidateElement();
                (0, licenseManager3D_1.applyLicense3D)(wasmContext, scs, true);
                var unsub = sciChartInitCommon_1.default.subscribeToResize(canvases.domChartRoot, canvases.aspect, scs);
                scs.addDeletable(unsub);
                scs.setIsInitialized();
                resolve({ wasmContext: wasmContext, sciChart3DSurface: scs });
            }, 0);
        },
        Draw: function (canvasId) {
            if (scs.isInitialized) {
                scs.doDrawingLoop();
            }
        },
        Update: function (deltaTime) {
            //Logger.log("SciChart3DSurface.ts Update()");
        },
        ShutDownChart: function () {
            //Logger.log("SciChart3DSurface.ts ShutDownChart");
        }
    };
    var chartInitObj = wasmContext.SCRTSampleChartInterface.implement(chartInitializer);
    var frameRenderer3D = new wasmContext.SCRTFrameRenderer3D();
    chartInitObj.SetFrameRenderer(frameRenderer3D);
    chartInitObj.SetFPSCounterEnabled(false);
    // This may not be used in the case of 3D charts, but we set the property anyway as its passed down to TSR engine when initialising
    chartInitObj.SetWasmBufferSizesKb(SciChartDefaults_1.SciChartDefaults.wasmBufferSizesKb);
    wasmContext.SCRTSetGlobalSampleChartInterface(chartInitObj);
    // @ts-ignore
    wasmContext.callMain();
};
