"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSvgLayer = exports.ELayerClass = void 0;
var WebGlHelper_1 = require("../../Core/WebGlHelper");
var perfomance_1 = require("../../utils/perfomance");
var SciChartSurfaceBase_1 = require("./SciChartSurfaceBase");
var DpiHelper_1 = require("./TextureManager/DpiHelper");
var ECanvasType;
(function (ECanvasType) {
    ECanvasType[ECanvasType["canvasWebGL"] = 0] = "canvasWebGL";
    ECanvasType[ECanvasType["canvas2D"] = 1] = "canvas2D";
    ECanvasType[ECanvasType["svg"] = 2] = "svg";
})(ECanvasType || (ECanvasType = {}));
var ELayerClass;
(function (ELayerClass) {
    ELayerClass["DIV_ROOT"] = "div-root";
    ELayerClass["SVG_ROOT"] = "svg-root";
    ELayerClass["BACK_DIV_ROOT"] = "back-div-root";
    ELayerClass["FRONT_DIV_ROOT"] = "front-div-root";
    ELayerClass["BACK_SVG_ROOT"] = "back-svg-root";
    ELayerClass["FRONT_SVG_ROOT"] = "front-svg-root";
    ELayerClass["ADORNER_SVG_ROOT"] = "adorner-svg-root";
    ELayerClass["CANVAS_ROOT"] = "canvas-root";
})(ELayerClass = exports.ELayerClass || (exports.ELayerClass = {}));
var DEFAULT_ASPECT_RATIO = 1.5;
var getCanvas2dId = function (divElementId) { return "".concat(divElementId, "_2D"); };
var getCanvasSizes = function (divWidth, divHeight, maxHeight, aspectWidth, aspectHeight) {
    if (aspectWidth === void 0) { aspectWidth = 0; }
    if (aspectHeight === void 0) { aspectHeight = 0; }
    var aspectRatio;
    if (aspectWidth && aspectHeight) {
        aspectRatio = aspectWidth / aspectHeight;
    }
    else if (divWidth && divHeight) {
        // We do not use aspect ratio if width and height is defined
        aspectRatio = undefined;
    }
    else {
        aspectRatio = DEFAULT_ASPECT_RATIO;
    }
    var width = Math.round(divWidth || 600);
    if (aspectRatio) {
        var height = Math.round(width / aspectRatio);
        if (height > maxHeight) {
            height = maxHeight;
        }
        return { width: width, height: height, aspectRatio: aspectRatio };
    }
    else {
        var height = Math.round(divHeight);
        return { width: width, height: height, aspectRatio: aspectRatio };
    }
};
var getChartRootDomElement = function (divElement) {
    var chartRoot = typeof divElement === "string" ? document.querySelector("#".concat(divElement)) : divElement;
    if (!chartRoot) {
        throw new Error("Check div element with id \"".concat(chartRoot.id, "\" exists"));
    }
    if (chartRoot.nodeName.toLowerCase() !== "div") {
        throw new Error("Element with id \"".concat(chartRoot.id, "\" should be of type div"));
    }
    return chartRoot;
};
var getMaxHeight = function (divElement) {
    var styleMaxHeight = divElement.style.maxHeight;
    if (styleMaxHeight) {
        var isPx = styleMaxHeight.includes("px");
        if (isPx) {
            var maxHeight = parseInt(styleMaxHeight.replace("px", ""), 10);
            if (!isNaN(maxHeight)) {
                return maxHeight;
            }
        }
    }
    return undefined;
};
/**
 * Initialize SciChart canvases.
 * @param divElementId
 * @param aspectWidth - aspect ratio width, if set to 0 is auto-calculated
 * @param aspectHeight - aspect ratio height, if set to 0 is auto-calculated
 * @param activeCanvas - ECanvasType.canvasWebGL for sciChartSurface.createSingle, ECanvasType.canvas2D for copy canvas,
 * ECanvasType.svg for SciChartPieSurface
 */
var initCanvas = function (divElement, aspectWidth, aspectHeight, activeCanvas, disableAspect, touchAction) {
    var _a;
    if (activeCanvas === void 0) { activeCanvas = ECanvasType.canvasWebGL; }
    var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.CanvasInitializationStart, {
        level: perfomance_1.EPerformanceDebugLevel.Verbose
    });
    WebGlHelper_1.WebGlHelper.initialize();
    DpiHelper_1.DpiHelper.initialize();
    var chartRoot = getChartRootDomElement(divElement);
    chartRoot.innerHTML = "";
    // prevent unexpected behavior with no positioned element
    if (chartRoot.style.position === "") {
        chartRoot.style.position = "relative";
    }
    var divElementId = chartRoot.id;
    var divWidth = chartRoot.offsetWidth, divHeight = chartRoot.offsetHeight;
    var maxHeight = getMaxHeight(chartRoot);
    var _b = getCanvasSizes(divWidth, divHeight, maxHeight, aspectWidth, aspectHeight), width = _b.width, height = _b.height, aspectRatio = _b.aspectRatio;
    // if aspect ration is defined we use is to calc height
    if (!disableAspect && aspectRatio) {
        // @ts-ignore
        chartRoot.style.aspectRatio = "".concat(aspectRatio);
    }
    // Background Div Root Element
    var backgroundDomRoot = document.createElement("div");
    backgroundDomRoot.id = "".concat(divElementId, "_background_div");
    backgroundDomRoot.classList.add(ELayerClass.DIV_ROOT, ELayerClass.BACK_DIV_ROOT);
    backgroundDomRoot.style.width = "100%";
    backgroundDomRoot.style.height = "100%";
    backgroundDomRoot.style.position = "absolute";
    backgroundDomRoot.style.pointerEvents = "none";
    chartRoot.appendChild(backgroundDomRoot);
    // Background SVG Root Element
    var backgroundSvgRootElement = (0, exports.createSvgLayer)("".concat(divElementId, "_BACKGROUND_SVG"), width, height);
    backgroundSvgRootElement.style.width = "100%";
    backgroundSvgRootElement.style.height = "100%";
    backgroundSvgRootElement.style.pointerEvents = "none";
    backgroundSvgRootElement.classList.add(ELayerClass.BACK_SVG_ROOT);
    chartRoot.appendChild(backgroundSvgRootElement);
    // set canvasSize for parent div because of all children in absolute
    var canvasWebGL;
    if (activeCanvas === ECanvasType.canvasWebGL) {
        // WebGL Canvas
        canvasWebGL = document.createElement("canvas");
        canvasWebGL.id = "".concat(divElementId, "_WebGL");
        canvasWebGL.classList.add(ELayerClass.CANVAS_ROOT);
        canvasWebGL.style.position = "absolute";
        canvasWebGL.style.display = "block";
        canvasWebGL.style.width = "100%";
        canvasWebGL.style.height = "100%";
        var gl = WebGlHelper_1.WebGlHelper.getContext(canvasWebGL, {
            premultipliedAlpha: true,
            antialias: SciChartSurfaceBase_1.SciChartSurfaceBase.AntiAliasWebGlBackbuffer
        });
        chartRoot.appendChild(canvasWebGL);
    }
    // 2D Canvas
    var canvas2D = document.createElement("canvas");
    canvas2D.id = getCanvas2dId(divElementId);
    canvas2D.classList.add(ELayerClass.CANVAS_ROOT);
    canvas2D.style.width = "100%";
    canvas2D.style.height = "100%";
    DpiHelper_1.DpiHelper.setSize(canvas2D, width, height);
    canvas2D.style.position = "absolute";
    if (activeCanvas !== ECanvasType.canvas2D) {
        canvas2D.style.pointerEvents = "none";
    }
    if (activeCanvas === ECanvasType.canvasWebGL) {
        canvas2D.style.display = "none";
    }
    else {
        canvas2D.style.display = "block";
    }
    chartRoot.appendChild(canvas2D);
    // used to prevent default browser behavior on touchscreen
    canvas2D.style.touchAction = touchAction !== null && touchAction !== void 0 ? touchAction : "none";
    canvas2D.onselectstart = function () { return false; };
    // prevents default browser behavior of dragging the selected elements
    // canvas2D.ondragstart = () => false;
    // SVG Root Element
    var svgRootElement = (0, exports.createSvgLayer)("".concat(divElementId, "_SVG"), width, height);
    svgRootElement.style.width = "100%";
    svgRootElement.style.height = "100%";
    if (activeCanvas !== ECanvasType.svg) {
        svgRootElement.style.pointerEvents = "none";
    }
    svgRootElement.classList.add(ELayerClass.FRONT_SVG_ROOT);
    chartRoot.appendChild(svgRootElement);
    // SVG Adorner Layer
    var svgAdornerLayer = (0, exports.createSvgLayer)("".concat(divElementId, "_Adorner"), width, height);
    svgAdornerLayer.style.pointerEvents = "none";
    svgAdornerLayer.style.width = "100%";
    svgAdornerLayer.style.height = "100%";
    svgAdornerLayer.style.zIndex = "1";
    svgAdornerLayer.classList.add(ELayerClass.ADORNER_SVG_ROOT);
    chartRoot.appendChild(svgAdornerLayer);
    // Root Div Element
    var divRootElement = document.createElement("div");
    divRootElement.id = "".concat(divElementId, "_div");
    divRootElement.classList.add(ELayerClass.DIV_ROOT, ELayerClass.FRONT_DIV_ROOT);
    divRootElement.style.width = "100%";
    divRootElement.style.height = "100%";
    divRootElement.style.position = "relative";
    divRootElement.style.pointerEvents = "none";
    divRootElement.style.textAlign = "center";
    chartRoot.appendChild(divRootElement);
    if (activeCanvas === ECanvasType.canvasWebGL) {
        canvasWebGL.addEventListener("webglcontextlost", function (event) {
            console.warn("WebGL context lost. Reloading the page.");
            event.preventDefault();
            location.reload();
        }, !1);
    }
    perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.CanvasInitializationEnd, {
        level: perfomance_1.EPerformanceDebugLevel.Verbose,
        contextId: canvas2D.id,
        relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId
    });
    return {
        domChartRoot: chartRoot,
        domCanvasWebGL: canvasWebGL,
        domCanvas2D: canvas2D,
        domSvgContainer: svgRootElement,
        domSvgAdornerLayer: svgAdornerLayer,
        domDivContainer: divRootElement,
        domSeriesBackground: backgroundDomRoot,
        domBackgroundSvgContainer: backgroundSvgRootElement,
        aspect: aspectRatio,
        disableAspect: disableAspect
    };
};
var subscribeToResize = function (chartRoot, aspect, sciChartSurface, disableAspect) {
    // @ts-ignore
    var resizeObserver = new ResizeObserver(function (entries) {
        var _loop_1 = function (entry) {
            var newWidth, newHeight;
            if (entry.contentRect) {
                newWidth = entry.contentRect.width;
                newHeight = entry.contentRect.height;
            }
            else if (entry.contentBoxSize) {
                // @ts-ignore
                if (entry.contentBoxSize.inlineSize) {
                    // @ts-ignore
                    newWidth = entry.contentBoxSize.inlineSize;
                }
                else if (entry.contentBoxSize[0]) {
                    newWidth = entry.contentBoxSize[0].inlineSize;
                }
            }
            else {
                console.error("ResizeObserver is not supported");
                newWidth = 900;
            }
            // check max-height
            var maxHeight = getMaxHeight(chartRoot);
            if (maxHeight && newHeight > maxHeight) {
                newHeight = maxHeight;
            }
            var isNotZero = newWidth !== 0 && newHeight !== 0;
            var isChanged = sciChartSurface.domCanvas2D.width !== newWidth * DpiHelper_1.DpiHelper.PIXEL_RATIO ||
                sciChartSurface.domCanvas2D.height !== newHeight * DpiHelper_1.DpiHelper.PIXEL_RATIO;
            if (isNotZero && isChanged) {
                // We use setTimeout to fix "ResizeObserver loop limit exceeded" issue which occurs in Electron app
                setTimeout(function () {
                    perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.Resize, { contextId: sciChartSurface.id });
                    sciChartSurface.changeViewportSize(newWidth, newHeight);
                }, 0);
            }
        };
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            _loop_1(entry);
        }
    });
    resizeObserver.observe(chartRoot, { box: "border-box" });
    // Return an IDeletable which will unsubscribe
    var unsub = { delete: function () { return resizeObserver.disconnect(); } };
    return unsub;
};
/**
 * Check DOM element with specified ID exists and unique
 * @param divElementId
 */
var checkChartDivExists = function (divElement) {
    if (typeof divElement === "string") {
        var numberOfElements = document.querySelectorAll("[id=".concat(divElement, "]")).length;
        if (numberOfElements > 1) {
            console.error("Please provide a unique ID for each chart div element, \"".concat(divElement, "\" it is not a unique identifier"));
        }
        else if (numberOfElements === 0) {
            console.error("Chart div element with the ID \"".concat(divElement, "\" is not present in the DOM"));
        }
    }
    else if (!divElement) {
        throw new Error("Provided div element doesn't exist!");
    }
};
var createSvgLayer = function (id, width, height) {
    var svgRootElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgRootElement.id = id;
    svgRootElement.setAttribute("width", width.toString());
    svgRootElement.setAttribute("height", height.toString());
    svgRootElement.setAttribute("role", "img");
    svgRootElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgRootElement.style.position = "absolute";
    svgRootElement.style.display = "block";
    svgRootElement.classList.add(ELayerClass.SVG_ROOT);
    return svgRootElement;
};
exports.createSvgLayer = createSvgLayer;
var sciChartInitCommon = {
    checkChartDivExists: checkChartDivExists,
    ECanvasType: ECanvasType,
    getCanvas2dId: getCanvas2dId,
    initCanvas: initCanvas,
    subscribeToResize: subscribeToResize
};
exports.default = sciChartInitCommon;
