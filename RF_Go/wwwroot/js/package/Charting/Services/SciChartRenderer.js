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
exports.SciChartRenderer = void 0;
var app_1 = require("../../constants/app");
var Dictionary_1 = require("../../Core/Dictionary");
var Rect_1 = require("../../Core/Rect");
var AutoRange_1 = require("../../types/AutoRange");
var AxisAlignment_1 = require("../../types/AxisAlignment");
var DefaultRenderLayer_1 = require("../../types/DefaultRenderLayer");
var WebGlRenderContext2D_1 = require("../Drawing/WebGlRenderContext2D");
var IAnnotation_1 = require("../Visuals/Annotations/IAnnotation");
var SciChartSurface_1 = require("../Visuals/SciChartSurface");
var SciChartSurfaceBase_1 = require("../Visuals/SciChartSurfaceBase");
var DpiHelper_1 = require("../Visuals/TextureManager/DpiHelper");
var RenderPassData_1 = require("./RenderPassData");
var RenderPassInfo_1 = require("./RenderPassInfo");
var SvgClippingMode_1 = require("../../types/SvgClippingMode");
var WatermarkPosition_1 = require("../../types/WatermarkPosition");
var NativeObject_1 = require("../Visuals/Helpers/NativeObject");
var createNativeRect_1 = require("../Visuals/Helpers/createNativeRect");
var parseColor_1 = require("../../utils/parseColor");
var logger_1 = require("../../utils/logger");
var perfomance_1 = require("../../utils/perfomance");
var translate_1 = require("../../utils/translate");
var ExtremeResamplerHelper_1 = require("../Numerics/Resamplers/ExtremeResamplerHelper");
/**
 * A class used internally in SciChart to perform layout, arrangement, data-preparation and rendering on the Cartesian 2D {@link SciChartSurface}
 */
var SciChartRenderer = /** @class */ (function () {
    /**
     * Creates an instance of the SciChartRenderer
     * @param sciChartSurface The {@link SciChartSurface} that we are rendering
     */
    function SciChartRenderer(sciChartSurface) {
        this.isInvalidated = false;
        this.sciChartSurface = sciChartSurface;
    }
    /**
     * Render loop for the current {@SciChartSurface}
     * @param renderContext the {@WebGLRenderContext2D} used for drawing
     */
    SciChartRenderer.prototype.render = function (renderContext) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        if (this.sciChartSurface.isDeleted) {
            return;
        }
        var renderStartMark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.RenderStart, {
            contextId: this.sciChartSurface.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        logger_1.Logger.debug("render start");
        this.isInvalidated = false;
        var nativeContext = renderContext.getNativeContext();
        var wasmContext = this.sciChartSurface.webAssemblyContext2D;
        var oldBlendMode;
        if (!app_1.IS_TEST_ENV) {
            oldBlendMode = nativeContext.GetBlendMode();
            nativeContext.SetBlendMode(wasmContext.eSCRTBlendMode.BlendAdditiveOneAlpha);
        }
        // Step 1 validate the chart and show errors
        var _g = this.getAxisDictionaries(), xAxesById = _g.xAxesById, yAxesById = _g.yAxesById;
        this.validate();
        // Animation Step
        var timeElapsed = this.previousTime ? Date.now() - this.previousTime : 0;
        this.previousTime = Date.now();
        var animationStartMark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.GenericAnimationStart, {
            contextId: this.sciChartSurface.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        this.sciChartSurface.onAnimate(timeElapsed);
        this.sciChartSurface.genericAnimationsRun.raiseEvent();
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.GenericAnimationEnd, {
            contextId: this.sciChartSurface.id,
            relatedId: (_a = animationStartMark === null || animationStartMark === void 0 ? void 0 : animationStartMark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        renderContext.enqueueLayeredDraw(function () {
            _this.sciChartSurface.updateBackground();
        }, this.getAbsoluteLayer(DefaultRenderLayer_1.EDefaultRenderLayer.Background));
        // Step 2 autorange x
        this.sciChartSurface.updateStackedCollectionAccumulatedVectors();
        var autoRangeStartMark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.AutoRangeStart, {
            contextId: this.sciChartSurface.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        this.sciChartSurface.xAxes.asArray().forEach(function (axis) { return _this.tryPerformAutoRangeOn(axis, _this.sciChartSurface); });
        // Step 3 prepare render data
        var viewRect = (_b = this.sciChartSurface.seriesViewRect) !== null && _b !== void 0 ? _b : Rect_1.Rect.create(0, 0, renderContext.viewportSize.width, renderContext.viewportSize.height);
        var renderPassInfo = this.prepareSeriesRenderData(viewRect);
        // Step 4 autorange y using resampled data if available.
        this.sciChartSurface.yAxes.asArray().forEach(function (axis) { return _this.tryPerformAutoRangeOn(axis, _this.sciChartSurface); });
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.AutoRangeEnd, {
            contextId: this.sciChartSurface.id,
            relatedId: (_c = autoRangeStartMark === null || autoRangeStartMark === void 0 ? void 0 : autoRangeStartMark.detail) === null || _c === void 0 ? void 0 : _c.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        // Step 3 layout
        var layoutStartMark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.LayoutStart, {
            contextId: this.sciChartSurface.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        var titleOffset = this.measureTitle(renderContext);
        var seriesViewRect = this.sciChartSurface.layoutManager.layoutChart(renderContext.viewportSize, titleOffset);
        var viewportSvgRect = this.getViewportSvgRect(renderContext.viewportSize, seriesViewRect);
        this.sciChartSurface.setCoordSvgTranslation(seriesViewRect.x - viewportSvgRect.x, seriesViewRect.y - viewportSvgRect.y);
        this.resizeAnnotationRootElements(viewportSvgRect);
        this.layoutTitle(seriesViewRect);
        this.scheduleTitleDraw(renderContext);
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.LayoutEnd, {
            contextId: this.sciChartSurface.id,
            relatedId: (_d = layoutStartMark === null || layoutStartMark === void 0 ? void 0 : layoutStartMark.detail) === null || _d === void 0 ? void 0 : _d.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        this.sciChartSurface.layoutMeasured.raiseEvent();
        // Initialise axes coordinate calculators.  Must happen after layout.
        this.prepareAxesRenderData();
        // Draw seriesViewRect border
        renderContext.enqueueLayeredDraw(function () {
            _this.sciChartSurface.drawBorder(renderContext);
        }, this.getAbsoluteLayer(DefaultRenderLayer_1.EDefaultRenderLayer.AxisBandsLayer));
        // Step 5 Draw X, Y axis and gridlines
        if (this.sciChartSurface.debugRendering) {
            this.drawDebugAxes(this.sciChartSurface, renderContext);
        }
        this.drawAxes(this.sciChartSurface, renderContext);
        // Step 6 Draw annotations below the series
        var userAnnotations = this.sciChartSurface.annotations.asArray();
        var modifierAnnotations = this.sciChartSurface.modifierAnnotations.asArray();
        var annotations = __spreadArray(__spreadArray([], userAnnotations, true), modifierAnnotations, true);
        var renderContextAnnotations = annotations.filter(function (el) {
            // TODO This is bad as it makes it hard to add custom renderContext annotations
            // probably could be replaced with !el.isSvgAnnotation
            return (el.type === IAnnotation_1.EAnnotationType.RenderContextBoxAnnotation ||
                el.type === IAnnotation_1.EAnnotationType.RenderContextLineAnnotation ||
                el.type === IAnnotation_1.EAnnotationType.RenderContextHorizontalLineAnnotation ||
                el.type === IAnnotation_1.EAnnotationType.RenderContextVerticalLineAnnotation ||
                el.type === IAnnotation_1.EAnnotationType.RenderContextAxisMarkerAnnotation ||
                el.type === IAnnotation_1.EAnnotationType.RenderContextNativeTextAnnotation);
        });
        // Draw annotations before axis
        var annotationsLayerBelowAxis = this.getAbsoluteLayer(DefaultRenderLayer_1.EDefaultRenderLayer.Background);
        renderContext.enqueueLayeredDraw(function () {
            _this.drawRenderContextAnnotations(renderContextAnnotations, xAxesById, yAxesById, IAnnotation_1.EAnnotationLayer.Background, renderContext, seriesViewRect);
        }, annotationsLayerBelowAxis);
        var annotationsBelowLayer = this.getAbsoluteLayer(DefaultRenderLayer_1.EDefaultRenderLayer.AnnotationsBelowSeriesLayer);
        renderContext.enqueueLayeredDraw(function () {
            _this.drawRenderContextAnnotations(renderContextAnnotations, xAxesById, yAxesById, IAnnotation_1.EAnnotationLayer.BelowChart, renderContext, seriesViewRect);
        }, annotationsBelowLayer);
        var seriesLayer = this.getAbsoluteLayer(DefaultRenderLayer_1.EDefaultRenderLayer.SeriesLayer);
        // Step 7 Draw series. Queue series rendering after grid lines and bands, but before the axes
        renderContext.enqueueLayeredDraw(function () { return _this.drawSeries(_this.sciChartSurface, renderPassInfo, renderContext); }, seriesLayer);
        var annotationsAboveLayer = this.getAbsoluteLayer(DefaultRenderLayer_1.EDefaultRenderLayer.AnnotationsAboveSeriesLayer);
        // Step 8 Draw annotations above the series
        renderContext.enqueueLayeredDraw(function () {
            _this.drawRenderContextAnnotations(renderContextAnnotations, xAxesById, yAxesById, IAnnotation_1.EAnnotationLayer.AboveChart, renderContext, seriesViewRect);
        }, annotationsAboveLayer);
        // Execute rendering of queued elements
        renderContext.drawLayers();
        renderContext.endFonts();
        // Step 9 Draw SVG or Html Overlays
        var svgAnnotations = annotations.filter(function (el) {
            return el.type === IAnnotation_1.EAnnotationType.SVG ||
                el.type === IAnnotation_1.EAnnotationType.SVGTextAnnotation ||
                el.type === IAnnotation_1.EAnnotationType.SVGCustomAnnotation;
        });
        this.drawSvgAnnotations(svgAnnotations, xAxesById, yAxesById, this.sciChartSurface.getCoordSvgTranslation());
        // Update watermark
        if (!this.sciChartSurface.isSubSurface) {
            this.updateWatermark(renderContext, seriesViewRect);
        }
        else if (renderContext.doDraw) {
            this.updateWatermark(renderContext, this.sciChartSurface.parentSurface.seriesViewRect);
        }
        // Step 10 Call OnParentSurfaceRendered
        var postDrawActionsStartMark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.PostDrawActionsStart, {
            contextId: this.sciChartSurface.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        this.onParentSurfaceRendered();
        if (!app_1.IS_TEST_ENV) {
            nativeContext.SetBlendMode(oldBlendMode);
        }
        // Invalidate for the animations
        if (this.sciChartSurface.isRunningAnimation) {
            setTimeout(this.sciChartSurface.invalidateElement, 0);
        }
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.PostDrawActionsEnd, {
            contextId: this.sciChartSurface.id,
            relatedId: (_e = postDrawActionsStartMark === null || postDrawActionsStartMark === void 0 ? void 0 : postDrawActionsStartMark.detail) === null || _e === void 0 ? void 0 : _e.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.RenderEnd, {
            contextId: this.sciChartSurface.id,
            relatedId: (_f = renderStartMark === null || renderStartMark === void 0 ? void 0 : renderStartMark.detail) === null || _f === void 0 ? void 0 : _f.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        logger_1.Logger.debug("render end");
    };
    SciChartRenderer.prototype.drawRenderContextAnnotations = function (annotations, xAxisById, yAxisById, annotationLayer, renderContext, seriesViewRect) {
        var _this = this;
        annotations
            .filter(function (a) { return a.annotationLayer === annotationLayer; })
            .forEach(function (a) {
            var _a;
            if (xAxisById.count === 0 || yAxisById.count === 0) {
                console.error("Cannot draw annotations before axes have been configured. Add axes first, or use suspendUpdates to pause drawing until axes are available.");
            }
            else {
                var xAxis = xAxisById.item(a.xAxisId) || xAxisById.values[0];
                var yAxis = yAxisById.item(a.yAxisId) || yAxisById.values[0];
                if (a.showWarning) {
                    if (xAxisById.count > 0 && xAxis.id !== a.xAxisId) {
                        console.warn("Annotation looked for xAxis Id ".concat(a.xAxisId, " but got ").concat(xAxis.id, ". Do you need to set xAxisId on an annotation or modifier?"));
                    }
                    if (yAxisById.count > 0 && yAxis.id !== a.yAxisId) {
                        console.warn("Annotation looked for yAxis Id ".concat(a.yAxisId, " but got ").concat(yAxis.id, ". Do you need to set yAxisId on an annotation or modifier?"));
                    }
                    a.showWarning = false;
                }
                if (!a.isHidden) {
                    var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAnnotationStart, {
                        contextId: a.id,
                        parentContextId: _this.sciChartSurface.id,
                        level: perfomance_1.EPerformanceDebugLevel.Verbose
                    });
                    a.drawWithContext(renderContext, xAxis.getCurrentCoordinateCalculator(), yAxis.getCurrentCoordinateCalculator(), seriesViewRect);
                    perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAnnotationEnd, {
                        contextId: a.id,
                        parentContextId: _this.sciChartSurface.id,
                        relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
                        level: perfomance_1.EPerformanceDebugLevel.Verbose
                    });
                }
            }
        });
    };
    SciChartRenderer.prototype.drawSvgAnnotations = function (annotations, xAxisById, yAxisById, coordSvgTranslation) {
        var _this = this;
        annotations.forEach(function (a) {
            var _a;
            var xAxis = xAxisById.item(a.xAxisId) || xAxisById.values[0];
            var yAxis = yAxisById.item(a.yAxisId) || yAxisById.values[0];
            if (a.showWarning) {
                if (xAxisById.count > 0 && xAxis.id !== a.xAxisId) {
                    console.warn("Annotation looked for xAxis Id ".concat(a.xAxisId, " but got ").concat(xAxis.id, ". Do you need to set xAxisId on an annotation or modifier?"));
                }
                if (yAxisById.count > 0 && yAxis.id !== a.yAxisId) {
                    console.warn("Annotation looked for yAxis Id ".concat(a.yAxisId, " but got ").concat(yAxis.id, ". Do you need to set yAxisId on an annotation or modifier?"));
                }
                a.showWarning = false;
            }
            var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAnnotationStart, {
                contextId: _this.sciChartSurface.id,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
            a.update(xAxis.getCurrentCoordinateCalculator(), yAxis.getCurrentCoordinateCalculator(), coordSvgTranslation.x / DpiHelper_1.DpiHelper.PIXEL_RATIO, coordSvgTranslation.y / DpiHelper_1.DpiHelper.PIXEL_RATIO);
            perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawAnnotationEnd, {
                contextId: _this.sciChartSurface.id,
                relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
        });
    };
    SciChartRenderer.prototype.validate = function () {
        this.sciChartSurface.xAxes.asArray().forEach(function (axis) { return (axis.isMeasured = false); });
        this.sciChartSurface.yAxes.asArray().forEach(function (axis) { return (axis.isMeasured = false); });
        // TODO: Check the surface is valid and output error codes to console
        // Checks would include
        // Is XAxes and YAxes collection null or empty
        // is XAxis a CategoryAxis and renderableseries is null or empty
        // Do all renderableseries have dataseries
        var errors = [];
        if (this.sciChartSurface.renderableSeries.size() > 0) {
            if (this.sciChartSurface.xAxes.size() === 0) {
                errors.push("Chart must have at least one X axis");
            }
            if (this.sciChartSurface.yAxes.size() === 0) {
                errors.push("Chart must have at least one Y axis");
            }
            this.sciChartSurface.renderableSeries.asArray().forEach(function (rs, i) {
                var xAxis = rs.xAxis;
                if (!xAxis) {
                    errors.push("".concat(rs.type, ", index ").concat(i, ", id ").concat(rs.id, " references xAxisId ").concat(rs.xAxisId, " which does not exist on the surface"));
                }
                var yAxis = rs.yAxis;
                if (!yAxis) {
                    errors.push("".concat(rs.type, ", index ").concat(i, ", id ").concat(rs.id, " references yAxisId ").concat(rs.yAxisId, " which does not exist on the surface"));
                }
                if (xAxis && yAxis) {
                    if (xAxis.isVerticalChart &&
                        ![AxisAlignment_1.EAxisAlignment.Top, AxisAlignment_1.EAxisAlignment.Bottom].includes(yAxis.axisAlignment))
                        errors.push("For vertical chart (chart with X Axis alignment Left or Right) Y Axis alignment should be Top or Bottom, X Axis ID = ".concat(xAxis.id));
                    if ((0, AxisAlignment_1.getIsVertical)(xAxis.axisAlignment) && (0, AxisAlignment_1.getIsVertical)(yAxis.axisAlignment))
                        errors.push("Both x and y axes can't have vertical alignment");
                    if ((0, AxisAlignment_1.getIsHorizontal)(xAxis.axisAlignment) && (0, AxisAlignment_1.getIsHorizontal)(yAxis.axisAlignment))
                        errors.push("Both x and y axes can't have horizontal alignment");
                }
            });
        }
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }
    };
    SciChartRenderer.prototype.resizeAnnotationRootElements = function (seriesViewRect) {
        // Convert seriesViewRect back to device pixels
        // e.g. at Retina display canvas size may be 400x300 but seriesViewRect size would be 800x600
        var viewRectInDevicePixels = new Rect_1.Rect(seriesViewRect.x / DpiHelper_1.DpiHelper.PIXEL_RATIO, seriesViewRect.y / DpiHelper_1.DpiHelper.PIXEL_RATIO, seriesViewRect.width / DpiHelper_1.DpiHelper.PIXEL_RATIO, seriesViewRect.height / DpiHelper_1.DpiHelper.PIXEL_RATIO);
        if (!this.prevRect) {
            this.prevRect = viewRectInDevicePixels;
        }
        else if (Rect_1.Rect.isEqual(this.prevRect, viewRectInDevicePixels)) {
            return;
        }
        this.prevRect = viewRectInDevicePixels;
        var svgRootElement = this.sciChartSurface.domSvgContainer;
        if (svgRootElement) {
            (0, translate_1.fitSvgToViewRect)(svgRootElement, viewRectInDevicePixels);
        }
        var backgroundSvgRootElement = this.sciChartSurface.domBackgroundSvgContainer;
        if (backgroundSvgRootElement) {
            (0, translate_1.fitSvgToViewRect)(backgroundSvgRootElement, viewRectInDevicePixels);
        }
        var backgroundDivElement = this.sciChartSurface.domSeriesBackground;
        if (backgroundDivElement) {
            (0, translate_1.fitElementToViewRect)(backgroundDivElement, viewRectInDevicePixels);
        }
    };
    SciChartRenderer.prototype.getAxisDictionaries = function () {
        var xAxesById = new Dictionary_1.Dictionary();
        var yAxesById = new Dictionary_1.Dictionary();
        this.sciChartSurface.xAxes.asArray().forEach(function (xAxis) {
            xAxesById.add(xAxis.id, xAxis);
        });
        this.sciChartSurface.yAxes.asArray().forEach(function (yAxis) {
            yAxesById.add(yAxis.id, yAxis);
        });
        return { xAxesById: xAxesById, yAxesById: yAxesById };
    };
    SciChartRenderer.prototype.prepareAxesRenderData = function () {
        // Prepare XAxes
        this.sciChartSurface.xAxes.asArray().forEach(function (xAxis) {
            xAxis.prepareRenderData();
        });
        // Prepare YAxes
        this.sciChartSurface.yAxes.asArray().forEach(function (yAxis) {
            yAxis.prepareRenderData();
        });
    };
    SciChartRenderer.prototype.prepareSeriesRenderData = function (seriesViewRect) {
        var _a;
        var seriesCount = this.sciChartSurface.renderableSeries.size();
        var renderPassInfo = new RenderPassInfo_1.RenderPassInfo(seriesCount, seriesViewRect);
        for (var i = 0; i < this.sciChartSurface.renderableSeries.size(); i++) {
            var series = this.sciChartSurface.renderableSeries.get(i);
            // don't try and draw series with no data
            if (!series.isStacked && !series.dataSeries)
                continue;
            // don't try and draw deleted dataseries
            if (!series.isStacked && series.dataSeries.getIsDeleted()) {
                throw new Error("SciChartSurface.renderableSeries[index=".concat(i, "] dataSeries has been deleted. ") +
                    "This is an invalid state for SciChart. Have you shared this DataSeries between chart surfaces?");
            }
            var resampleSingleSeriesStartMark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.ResampleSingleSeriesStart, {
                contextId: series.id,
                parentContextId: this.sciChartSurface.id,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
            var xAxis = series.xAxis;
            var yAxis = series.yAxis;
            var seriesRenderPassInfo = ExtremeResamplerHelper_1.ExtremeResamplerHelper.resampleSeries(xAxis, series, seriesViewRect);
            renderPassInfo.renderableSeriesArray.push(seriesRenderPassInfo.renderableSeries);
            var renderPassData = new RenderPassData_1.RenderPassData(seriesRenderPassInfo.indicesRange, xAxis.getCurrentCoordinateCalculator, yAxis.getCurrentCoordinateCalculator, xAxis.isVerticalChart, seriesRenderPassInfo.pointSeries, seriesRenderPassInfo.resamplingHash);
            // Set the renderPassData early
            series.setCurrentRenderPassData(renderPassData);
            perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.ResampleSingleSeriesEnd, {
                contextId: series.id,
                parentContextId: this.sciChartSurface.id,
                relatedId: (_a = resampleSingleSeriesStartMark === null || resampleSingleSeriesStartMark === void 0 ? void 0 : resampleSingleSeriesStartMark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
        }
        return renderPassInfo;
    };
    SciChartRenderer.prototype.drawAxes = function (scs, renderContext) {
        scs.xAxes.asArray().forEach(function (xAxis) {
            xAxis.draw(renderContext);
        });
        scs.yAxes.asArray().forEach(function (yAxis) {
            yAxis.draw(renderContext);
        });
    };
    SciChartRenderer.prototype.drawSeries = function (scs, renderPassInfo, renderContext) {
        var _this = this;
        var _a;
        var renderableSeriesArray = renderPassInfo.renderableSeriesArray;
        var nativeContext = renderContext.getNativeContext();
        var viewRect = this.sciChartSurface.seriesViewRect;
        nativeContext.PushMatrix();
        nativeContext.PushState();
        nativeContext.Translate(viewRect.x, viewRect.y);
        nativeContext.SetClipRect(viewRect.x, viewRect.y, viewRect.width, viewRect.height);
        // Draw unselected series first
        renderableSeriesArray.forEach(function (rs, index) {
            if (rs.isVisible && !rs.isSelected && !rs.isHovered)
                rs.draw(renderContext, rs.getCurrentRenderPassData());
        });
        // Draw hovered series next
        renderableSeriesArray.forEach(function (rs, index) {
            if (rs.isVisible && rs.isHovered)
                rs.draw(renderContext, rs.getCurrentRenderPassData());
        });
        // Draw selected series at higher z-index
        renderableSeriesArray.forEach(function (rs, index) {
            if (rs.isVisible && rs.isSelected)
                rs.draw(renderContext, rs.getCurrentRenderPassData());
        });
        // Perform global text layout
        if (this.sciChartSurface.dataLabelLayoutManager) {
            var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.PerformTextLayoutStart, {
                contextId: this.sciChartSurface.id,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
            this.sciChartSurface.dataLabelLayoutManager.performTextLayout(this.sciChartSurface, renderPassInfo);
            perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.PerformTextLayoutEnd, {
                contextId: this.sciChartSurface.id,
                relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
        }
        // Draw series text
        renderableSeriesArray.forEach(function (rs, index) {
            var _a;
            if (rs.isVisible && rs.dataLabelProvider) {
                var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawDataLabelsStart, {
                    contextId: rs.id,
                    parentContextId: _this.sciChartSurface.id,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
                rs.dataLabelProvider.draw(renderContext);
                perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawDataLabelsEnd, {
                    contextId: rs.id,
                    parentContextId: _this.sciChartSurface.id,
                    relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
                    level: perfomance_1.EPerformanceDebugLevel.Verbose
                });
            }
        });
        nativeContext.PopMatrix();
        nativeContext.PopState();
    };
    SciChartRenderer.prototype.drawDebugAxes = function (scs, renderContext) {
        renderContext.enqueueLayeredDraw(function () {
            scs.xAxes.asArray().forEach(function (xAxis) {
                xAxis.drawDebug(renderContext);
            });
            scs.yAxes.asArray().forEach(function (yAxis) {
                yAxis.drawDebug(renderContext);
            });
        });
    };
    SciChartRenderer.prototype.tryPerformAutoRangeOn = function (axis, sciChartSurface) {
        var firstRange = !axis.hasValidVisibleRange() || axis.hasDefaultVisibleRange();
        var shouldAutoRange = axis.autoRange === AutoRange_1.EAutoRange.Always || (axis.autoRange === AutoRange_1.EAutoRange.Once && firstRange);
        if (shouldAutoRange) {
            // Different implementation for YAxis and XAxis because of windowing
            var newRange = axis.getMaximumRange();
            if (!newRange.equals(axis.visibleRange)) {
                if (!axis.autoRangeAnimation ||
                    (firstRange && !axis.autoRangeAnimation.animateInitialRanging) ||
                    (!firstRange && !axis.autoRangeAnimation.animateSubsequentRanging)) {
                    axis.visibleRange = newRange;
                }
                else if (!newRange.equals(axis.animatedVisibleRange)) {
                    axis.animateVisibleRange(newRange, axis.autoRangeAnimation.duration, axis.autoRangeAnimation.easing);
                }
            }
        }
    };
    SciChartRenderer.prototype.onParentSurfaceRendered = function () {
        var _a;
        if (!this.sciChartSurface.isSubSurface) {
            this.sciChartSurface.chartModifiers.asArray().forEach(function (cm) {
                cm.onParentSurfaceRendered();
            });
        }
        // For subCharts, run this once from the parent surface, after draw has happened
        (_a = this.sciChartSurface.subCharts) === null || _a === void 0 ? void 0 : _a.forEach(function (sc) {
            sc.chartModifiers.asArray().forEach(function (cm) {
                cm.onParentSurfaceRendered();
            });
        });
    };
    SciChartRenderer.prototype.updateWatermark = function (renderContext, seriesViewRect) {
        var chartHeight = this.sciChartSurface.isCopyCanvasSurface
            ? SciChartSurfaceBase_1.SciChartSurfaceBase.domMasterCanvas.height
            : renderContext.viewportSize.height;
        var left = seriesViewRect.x + 5;
        var bottom = chartHeight - (seriesViewRect.top + seriesViewRect.height) + 10;
        var wmWidth = Math.max(72, Math.min(0.25 * renderContext.viewportSize.width, 256));
        var wmHeight = (42 * wmWidth) / 256;
        if (this.sciChartSurface.watermarkRelativeToCanvas) {
            switch (this.sciChartSurface.watermarkPosition) {
                case WatermarkPosition_1.EWatermarkPosition.BottomRight:
                    left = renderContext.viewportSize.width - wmWidth - 5;
                    bottom = chartHeight - renderContext.viewportSize.height + 12;
                    break;
                case WatermarkPosition_1.EWatermarkPosition.TopLeft:
                    bottom = chartHeight - (5 + wmHeight);
                    left = 5;
                    break;
                case WatermarkPosition_1.EWatermarkPosition.TopRight:
                    left = renderContext.viewportSize.width - wmWidth - 5;
                    bottom = chartHeight - (5 + wmHeight);
                    break;
                case WatermarkPosition_1.EWatermarkPosition.BottomLeft:
                    left = 5;
                    bottom = chartHeight - renderContext.viewportSize.height + 12;
                    break;
            }
        }
        else {
            switch (this.sciChartSurface.watermarkPosition) {
                case WatermarkPosition_1.EWatermarkPosition.BottomRight:
                    left = seriesViewRect.left + seriesViewRect.width - wmWidth - 5;
                    break;
                case WatermarkPosition_1.EWatermarkPosition.TopLeft:
                    bottom = chartHeight - (seriesViewRect.top + 5 + wmHeight);
                    break;
                case WatermarkPosition_1.EWatermarkPosition.TopRight:
                    left = seriesViewRect.left + seriesViewRect.width - wmWidth - 5;
                    bottom = chartHeight - (seriesViewRect.top + 5 + wmHeight);
                    break;
                case WatermarkPosition_1.EWatermarkPosition.BottomLeft:
                default:
                    break;
            }
        }
        this.sciChartSurface.updateWatermark(left, bottom);
    };
    SciChartRenderer.prototype.getViewportSvgRect = function (viewportSize, seriesViewRect) {
        switch (this.sciChartSurface.svgClippingMode) {
            case SvgClippingMode_1.ESvgClippingMode.SeriesViewRect:
                return seriesViewRect;
            case SvgClippingMode_1.ESvgClippingMode.Chart:
                return new Rect_1.Rect(0, 0, viewportSize.width, viewportSize.height);
            case SvgClippingMode_1.ESvgClippingMode.SubChart:
                var viewportRect = new Rect_1.Rect(0, 0, viewportSize.width, viewportSize.height);
                if (this.sciChartSurface.isSubSurface) {
                    var sub = this.sciChartSurface;
                    viewportRect = sub.getSubChartRect();
                }
                return viewportRect;
            default:
                return seriesViewRect;
        }
    };
    SciChartRenderer.prototype.scheduleTitleDraw = function (renderContext) {
        var _this = this;
        renderContext.enqueueLayeredDraw(function () {
            _this.sciChartSurface.chartTitleRenderer.draw(renderContext);
        }, this.getAbsoluteLayer(DefaultRenderLayer_1.EDefaultRenderLayer.AnnotationsAboveSeriesLayer));
    };
    SciChartRenderer.prototype.measureTitle = function (renderContext) {
        this.sciChartSurface.chartTitleRenderer.measure(this.sciChartSurface.title, this.sciChartSurface.titleStyle, renderContext);
        return this.sciChartSurface.chartTitleRenderer.titleOffset;
    };
    SciChartRenderer.prototype.layoutTitle = function (seriesViewRect) {
        // current surface area which will contain title
        var chartViewRect = this.sciChartSurface.titleStyle.placeWithinChart
            ? seriesViewRect
            : this.getChartViewRect();
        // title position calculation
        this.sciChartSurface.chartTitleRenderer.layout(chartViewRect);
    };
    SciChartRenderer.prototype.getChartViewRect = function () {
        var viewportSize = this.sciChartSurface.renderSurface.viewportSize;
        if (SciChartSurface_1.SciChartSurface.isSubSurface(this.sciChartSurface)) {
            var viewportRect = new Rect_1.Rect(0, 0, viewportSize.width, viewportSize.height);
            var sub = this.sciChartSurface;
            viewportRect = sub.getSubChartRect();
            return viewportRect;
        }
        return new Rect_1.Rect(0, 0, viewportSize.width, viewportSize.height);
    };
    SciChartRenderer.prototype.getAbsoluteLayer = function (relativeRenderLayer) {
        return (0, WebGlRenderContext2D_1.calculateAbsoluteRenderLayer)(this.sciChartSurface.layersOffset, this.sciChartSurface.stepBetweenLayers, relativeRenderLayer);
    };
    SciChartRenderer.prototype.drawDebugSurfaceRect = function (renderContext, viewRect, wasmContext) {
        var vecRects = (0, NativeObject_1.getVectorRectVertex)(wasmContext);
        var brush = new wasmContext.SCRTSolidBrush((0, parseColor_1.parseColorToUIntArgb)("rgba(0,255,0,0.7)"), false);
        var nativeRect = (0, createNativeRect_1.createNativeRect)(wasmContext, 0, 0, viewRect.width, viewRect.height);
        vecRects.push_back(nativeRect);
        renderContext.drawRects(vecRects, brush, viewRect.left, viewRect.top);
        brush.delete();
    };
    return SciChartRenderer;
}());
exports.SciChartRenderer = SciChartRenderer;
