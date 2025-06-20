"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SciChart3DRenderer = void 0;
var IAnnotation_1 = require("../../Charting/Visuals/Annotations/IAnnotation");
var Deleter_1 = require("../../Core/Deleter");
var Guard_1 = require("../../Core/Guard");
var Rect_1 = require("../../Core/Rect");
var AutoRange_1 = require("../../types/AutoRange");
var WatermarkPosition_1 = require("../../types/WatermarkPosition");
var perfomance_1 = require("../../utils/perfomance");
var AxisCubeDescriptor_1 = require("./Primitives/AxisCubeDescriptor");
var RenderPassInfo3D_1 = require("./Primitives/RenderPassInfo3D");
var SceneDescriptor_1 = require("./Primitives/SceneDescriptor");
/**
 * A class used internally in SciChart to perform layout, arrangement, data-preparation and rendering on the Cartesian 3D {@link SciChart3DSurface}
 */
var SciChart3DRenderer = /** @class */ (function () {
    function SciChart3DRenderer(scs, wasmContext) {
        this.isInvalidated = false;
        Guard_1.Guard.notNull(scs, "scs");
        this.scs = scs;
        this.wasmContext = wasmContext;
    }
    /**
     * get the {@link SceneDescriptor} to define the look & styling of the scene in the current render pass
     * @param scs the {@link SciChart3DSurface} we are drawing
     */
    SciChart3DRenderer.getSceneDescriptor = function (scs) {
        var _a, _b, _c;
        // Collect info from axis and scene how to draw / what to draw
        var scene = new SceneDescriptor_1.SceneDescriptor();
        scene.axisCubeDescriptor = new AxisCubeDescriptor_1.AxisCubeDescriptor();
        scene.axisCubeDescriptor.dimensions = scs.worldDimensions;
        scene.axisCubeDescriptor.isVisible = true;
        scene.axisCubeDescriptor.xAxisDescriptor = (_a = scs.xAxis) === null || _a === void 0 ? void 0 : _a.toAxisDescriptor();
        scene.axisCubeDescriptor.yAxisDescriptor = (_b = scs.yAxis) === null || _b === void 0 ? void 0 : _b.toAxisDescriptor();
        scene.axisCubeDescriptor.zAxisDescriptor = (_c = scs.zAxis) === null || _c === void 0 ? void 0 : _c.toAxisDescriptor();
        return scene;
    };
    /**
     * Prepares render data and returns a {@link RenderPassInfo3D} for the current render pass
     * @param scs the {@link SciChart3DSurface} we are drawing
     */
    SciChart3DRenderer.prepareRenderData = function (scs) {
        var rpd = new RenderPassInfo3D_1.RenderPassInfo3D();
        rpd.xCalc = scs.xAxis.getCurrentCoordinateCalculator();
        rpd.yCalc = scs.yAxis.getCurrentCoordinateCalculator();
        rpd.zCalc = scs.zAxis.getCurrentCoordinateCalculator();
        rpd.worldDimensions = scs.worldDimensions;
        rpd.sceneDescriptor = SciChart3DRenderer.getSceneDescriptor(scs);
        return rpd;
    };
    /**
     * Performs autorange on the {@link AxisBase3D} depending on flags such as {@link AxisBase3D.autoRange}
     * @param axis The {@link AxisBase3D} we are auto-ranging
     * @param scs the {@link SciChart3DSurface} we are drawing
     */
    SciChart3DRenderer.tryPerformAutoRangeOn = function (axis, scs) {
        var shouldAutoRange = ((!axis.hasValidVisibleRange() || axis.hasDefaultVisibleRange()) && axis.autoRange === AutoRange_1.EAutoRange.Once) ||
            axis.autoRange === AutoRange_1.EAutoRange.Always;
        if (shouldAutoRange) {
            var newRange = scs.viewportManager.calculateAutoRange(axis);
            if (newRange && !(newRange === axis.visibleRange) && axis.isValidRange(newRange)) {
                axis.visibleRange = newRange;
            }
        }
    };
    /**
     * The main render loop
     */
    SciChart3DRenderer.prototype.render = function () {
        var _this = this;
        var _a, _b;
        if (this.scs.isDeleted || !this.scs.isInitialized) {
            return;
        }
        this.isInvalidated = false;
        var renderStartMark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.RenderStart, {
            contextId: this.scs.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        // Step 1: Sanity checks
        this.isSurfaceValid(this.scs); // Throws errors if false
        // Enable/disable hit test as required.
        this.scs.webAssemblyContext3D.SCRTSetIsSelectionBufferEnabled(this.scs.isHitTestEnabled);
        // Step 1: Update the current active SceneWorld and camera
        var sceneWorld = this.scs.getSceneWorld();
        if (!sceneWorld) {
            console.warn("SciChart3DRenderer: Undefined scene world!");
            return;
        }
        this.wasmContext.SCRTSetActiveWorld(sceneWorld);
        this.updateWorldDimensions(sceneWorld, this.scs.worldDimensions);
        var tsrCamera = sceneWorld.GetMainCamera();
        var typescriptCamera = this.scs.camera;
        typescriptCamera.updateEngineCamera(tsrCamera);
        var _c = this.scs.viewportManager, width = _c.width, height = _c.height;
        var viewRect = new Rect_1.Rect(0, 0, width, height);
        this.scs.setSeriesViewRect(viewRect);
        // Animation Step
        var timeElapsed = this.previousTime ? Date.now() - this.previousTime : undefined;
        this.previousTime = Date.now();
        var animationStartMark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.GenericAnimationStart, {
            contextId: this.scs.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        this.scs.genericAnimationsRun.raiseEvent();
        this.scs.onAnimate(timeElapsed);
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.GenericAnimationEnd, {
            contextId: this.scs.id,
            relatedId: (_a = animationStartMark === null || animationStartMark === void 0 ? void 0 : animationStartMark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        // Step 2: Update background of the chart
        this.scs.updateBackground();
        // Step 3: Prepare the Axes
        this.prepareAxes(this.scs.xAxis, this.scs.yAxis, this.scs.zAxis);
        // Step 4: Prepare the RenderPassData
        var rpd = SciChart3DRenderer.prepareRenderData(this.scs);
        // Step 5: Prepare the Axis Cube
        // Viewport3D already checked to be not null in IsSurfaceValid
        this.scs.rootEntity.visitEntities(function (e) { return e.setRenderPassData(rpd); });
        var userAnnotations = this.scs.annotations.asArray();
        var modifierAnnotations = this.scs.modifierAnnotations.asArray();
        var annotations = __spreadArray(__spreadArray([], userAnnotations, true), modifierAnnotations, true);
        var svgAnnotations = annotations.filter(function (el) {
            return el.type === IAnnotation_1.EAnnotationType.SVG ||
                el.type === IAnnotation_1.EAnnotationType.SVGTextAnnotation ||
                el.type === IAnnotation_1.EAnnotationType.SVGCustomAnnotation;
        });
        svgAnnotations.forEach(function (svg) {
            var _a;
            var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAnnotationStart, {
                contextId: svg.id,
                parentContextId: _this.scs.id,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
            svg.update(undefined, undefined, 0, 0);
            perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAnnotationEnd, {
                contextId: svg.id,
                parentContextId: _this.scs.id,
                relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
        });
        // We add the same padding as we have for 2D 6px
        this.updateWatermark();
        // Step 6: Notify that scene is about to be drawn
        this.scs.onSciChartRendered();
        // Invalidate for the animations
        if (this.scs.isRunningAnimation) {
            setTimeout(this.scs.invalidateElement, 0);
        }
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.RenderEnd, {
            contextId: this.scs.id,
            relatedId: (_b = renderStartMark === null || renderStartMark === void 0 ? void 0 : renderStartMark.detail) === null || _b === void 0 ? void 0 : _b.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
    };
    SciChart3DRenderer.prototype.updateWatermark = function () {
        var chartHeight = this.scs.getMainCanvas().clientHeight;
        var chartWidth = this.scs.getMainCanvas().clientWidth;
        var left = 5;
        var bottom = chartHeight - 10;
        var wmWidth = Math.max(72, Math.min(0.25 * chartWidth, 256));
        var wmHeight = (42 * wmWidth) / 256;
        switch (this.scs.watermarkPosition) {
            case WatermarkPosition_1.EWatermarkPosition.BottomRight:
                left = chartWidth - wmWidth - 5;
                bottom = 12;
                break;
            case WatermarkPosition_1.EWatermarkPosition.TopLeft:
                left = 5;
                bottom = chartHeight - (5 + wmHeight);
                break;
            case WatermarkPosition_1.EWatermarkPosition.TopRight:
                left = chartWidth - wmWidth - 5;
                bottom = chartHeight - (5 + wmHeight);
                break;
            case WatermarkPosition_1.EWatermarkPosition.BottomLeft:
                left = 5;
                bottom = 12;
                break;
        }
        this.scs.updateWatermark(left, bottom);
    };
    SciChart3DRenderer.prototype.isSurfaceValid = function (sciChartSurface, viewportSize) {
        if (!sciChartSurface.xAxis) {
            throw new Error("Unable to draw SciChart3DSurface as the xAxis is undefined");
        }
        if (!sciChartSurface.yAxis) {
            throw new Error("Unable to draw SciChart3DSurface as the yAxis is undefined");
        }
        if (!sciChartSurface.zAxis) {
            throw new Error("Unable to draw SciChart3DSurface as the zAxis is undefined");
        }
        return true;
    };
    SciChart3DRenderer.prototype.prepareAxes = function () {
        var _this = this;
        var axis = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            axis[_i] = arguments[_i];
        }
        axis.forEach(function (el) {
            el.validateAxis();
            SciChart3DRenderer.tryPerformAutoRangeOn(el, _this.scs);
            el.isMeasured = true;
        });
    };
    SciChart3DRenderer.prototype.updateWorldDimensions = function (sceneWorld, worldDimensions) {
        Guard_1.Guard.notNull(worldDimensions, "worldDimensions");
        var worldDimensionsVector4;
        try {
            worldDimensionsVector4 = this.scs.worldDimensions.toTsrVector3(this.wasmContext);
            sceneWorld.SetWorldDimensions(worldDimensionsVector4);
        }
        finally {
            (0, Deleter_1.deleteSafe)(worldDimensionsVector4);
        }
    };
    return SciChart3DRenderer;
}());
exports.SciChart3DRenderer = SciChart3DRenderer;
/** @ignore */
var toString = function (vector) {
    return "TSRVector3 (".concat(vector.x.toFixed(2), ", ").concat(vector.y.toFixed(2), ", ").concat(vector.z.toFixed(2), ")");
};
