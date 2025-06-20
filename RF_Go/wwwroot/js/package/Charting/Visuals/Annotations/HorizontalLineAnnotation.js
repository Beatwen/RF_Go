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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizontalLineAnnotation = void 0;
var Guard_1 = require("../../../Core/Guard");
var Point_1 = require("../../../Core/Point");
var Rect_1 = require("../../../Core/Rect");
var Thickness_1 = require("../../../Core/Thickness");
var AxisAlignment_1 = require("../../../types/AxisAlignment");
var pointUtil_1 = require("../../../utils/pointUtil");
var translate_1 = require("../../../utils/translate");
var Pen2DCache_1 = require("../../Drawing/Pen2DCache");
var drawLabel_1 = require("../Helpers/drawLabel");
var DpiHelper_1 = require("../TextureManager/DpiHelper");
var AnnotationBase_1 = require("./AnnotationBase");
var IAnnotation_1 = require("./IAnnotation");
var LineAnnotation_1 = require("./LineAnnotation");
/**
 * @summary The {@link HorizontalLineAnnotation} provides an {@link AnnotationBase | Annotation} which draws a horizontal line at
 * specific y1 (or x1 for Vertical Chart) over the {@link SciChartSurface}
 * @description
 * To add a {@link HorizontalLineAnnotation} to a {@link SciChartSurface}, use the following code:
 * ```ts
 * const sciChartSurface: SciChartSurface;
 * const horizontalLineAnnotation = new HorizontalLineAnnotation( { x1: 1, y1: 3, fill: "#FF000077", stroke: "#FF0000"});
 * sciChartSurface.annotations.add(horizontalLineAnnotation);
 * ```
 * @remarks Uses the fast WebGL/WebAssembly {@link WebGL2RenderingContext} for rendering
 */
var HorizontalLineAnnotation = /** @class */ (function (_super) {
    __extends(HorizontalLineAnnotation, _super);
    /**
     * Create an instance of a HorizontalLineAnnotation
     * @param options Optional parameters of type {@link ILineAnnotationOptions} which configure the annotation upon construction
     */
    function HorizontalLineAnnotation(options) {
        var _this = this;
        var _a, _b, _c;
        _this = _super.call(this, options) || this;
        /** @inheritDoc */
        _this.type = IAnnotation_1.EAnnotationType.RenderContextHorizontalLineAnnotation;
        _this.dragOnLine = true;
        _this.dragOnLabel = true;
        if (options === null || options === void 0 ? void 0 : options.x2) {
            _this.x2 = options.x2;
        }
        if (options === null || options === void 0 ? void 0 : options.y2) {
            _this.y2 = options.y2;
        }
        _this.dragOnLine = (_a = options === null || options === void 0 ? void 0 : options.dragOnLine) !== null && _a !== void 0 ? _a : _this.dragOnLine;
        _this.dragOnLabel = (_b = options === null || options === void 0 ? void 0 : options.dragOnLabel) !== null && _b !== void 0 ? _b : _this.dragOnLabel;
        _this.horizontalAlignment = (_c = options === null || options === void 0 ? void 0 : options.horizontalAlignment) !== null && _c !== void 0 ? _c : _this.horizontalAlignment;
        return _this;
    }
    Object.defineProperty(HorizontalLineAnnotation.prototype, "y2", {
        /**
         * y2 property is not supported for HorizontalLineAnnotation
         */
        get: function () {
            throw Error("y2 property is not supported for HorizontalLineAnnotation");
        },
        /**
         * y2 property is not supported for HorizontalLineAnnotation
         */
        set: function (y2) {
            throw Error("y2 property is not supported for HorizontalLineAnnotation");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HorizontalLineAnnotation.prototype, "x2", {
        /**
         * x2 property is not supported for HorizontalLineAnnotation
         */
        get: function () {
            throw Error("x2 property is not supported for HorizontalLineAnnotation");
        },
        /**
         * x2 property is not supported for HorizontalLineAnnotation
         */
        set: function (x2) {
            throw Error("x2 property is not supported for HorizontalLineAnnotation");
        },
        enumerable: false,
        configurable: true
    });
    /** @inheritDoc */
    HorizontalLineAnnotation.prototype.drawWithContext = function (renderContext, xCalc, yCalc, viewRect) {
        Guard_1.Guard.notNull(renderContext, "renderContext");
        Guard_1.Guard.notNull(xCalc, "xCalc");
        Guard_1.Guard.notNull(yCalc, "yCalc");
        var strokePen = this.stroke && this.strokeThickness ? (0, Pen2DCache_1.getWebGlPenFromCache)(this.strokePenCache) : undefined;
        var _a = this.getDrawConfig(xCalc, yCalc), annotationCoord = _a.annotationCoord, lineAnnotationEdgeCoord = _a.lineAnnotationEdgeCoord, horizontalAxis = _a.horizontalAxis, verticalAxis = _a.verticalAxis, horizontalAxisCoordinateMode = _a.horizontalAxisCoordinateMode, verticalAxisCoordinateMode = _a.verticalAxisCoordinateMode, horizontalCoordinateCalculator = _a.horizontalCoordinateCalculator, verticalCoordinateCalculator = _a.verticalCoordinateCalculator, isAlignmentRight = _a.isAlignmentRight;
        if (!horizontalAxis || !verticalAxis)
            return;
        var borderX1 = 0;
        var borderX2 = viewRect.width;
        if (isAlignmentRight) {
            borderX1 = viewRect.width;
            borderX2 = 0;
        }
        var lineAnnotationEdgeCoordValue = this.getValue(lineAnnotationEdgeCoord, horizontalCoordinateCalculator, horizontalAxisCoordinateMode);
        var isPartialLine = lineAnnotationEdgeCoordValue || lineAnnotationEdgeCoordValue === 0;
        if (isPartialLine) {
            borderX2 = borderX2 = this.getX1Coordinate(xCalc, yCalc);
        }
        var borderY1 = this.getY1Coordinate(xCalc, yCalc);
        var borderY2 = borderY1;
        this.setAnnotationBorders(borderX1, borderX2, borderY1, borderY2);
        var lineEdgeAbsoluteHorizontalCoord = this.getCoordinate(lineAnnotationEdgeCoord, horizontalCoordinateCalculator, horizontalAxisCoordinateMode);
        var absoluteVerticalCoord = this.getCoordinate(annotationCoord, verticalCoordinateCalculator, verticalAxisCoordinateMode);
        var isAxisLabelInVerticalVisibleRange = absoluteVerticalCoord >= 0 && absoluteVerticalCoord <= verticalAxis.parentSurface.seriesViewRect.height;
        var isLineAnnotationInHorizontalVisibleRange = isAlignmentRight
            ? lineEdgeAbsoluteHorizontalCoord <= horizontalAxis.parentSurface.seriesViewRect.width
            : lineEdgeAbsoluteHorizontalCoord >= 0;
        var isLineAnnotationEdgeVisible = !isPartialLine || isLineAnnotationInHorizontalVisibleRange;
        if (isAxisLabelInVerticalVisibleRange && isLineAnnotationEdgeVisible) {
            var textStyle = __assign(__assign({}, verticalAxis.labelStyle), { padding: new Thickness_1.Thickness(2, 2, 2, 2), color: this.axisLabelStroke, fontSize: this.axisFontSize * DpiHelper_1.DpiHelper.PIXEL_RATIO, fontFamily: this.axisFontFamily });
            var labelRect = (0, drawLabel_1.drawLineAnnotation)(verticalAxis, renderContext, this.labelPlacement, this.labelValue, borderX1, borderX2, borderY1, borderY2, textStyle, this.axisLabelFill, strokePen, viewRect, this.showLabel, this.opacity, this.horizontalAlignment);
            if (labelRect) {
                var point1 = (0, translate_1.translateFromCanvasToSeriesViewRect)(new Point_1.Point(labelRect.left, labelRect.top), viewRect, true);
                var point2 = (0, translate_1.translateFromCanvasToSeriesViewRect)(new Point_1.Point(labelRect.right, labelRect.bottom), viewRect, true);
                this.labelRect = Rect_1.Rect.createWithPoints(point1, point2);
            }
        }
        if (this.dragOnLine) {
            this.updateAdornerInner();
        }
    };
    HorizontalLineAnnotation.prototype.onDragStarted = function (args) {
        if (this.dragOnLine) {
            return _super.prototype.onDragStarted.call(this, args);
        }
        if (this.dragOnLabel && this.labelRect) {
            if (this.clickToSelect(args)) {
                this.adornerDraggingPoint = AnnotationBase_1.EDraggingGripPoint.Body;
                return true;
            }
        }
        return false;
    };
    HorizontalLineAnnotation.prototype.checkIsClickedOnAnnotationInternal = function (x, y) {
        if (this.dragOnLine) {
            if (_super.prototype.checkIsClickedOnAnnotationInternal.call(this, x, y)) {
                return true;
            }
        }
        if (this.dragOnLabel && this.labelRect) {
            var _a = this.labelRect, left = _a.left, top_1 = _a.top, right = _a.right, bottom = _a.bottom;
            // TODO not sure if this is a bug in testIsInBounds or if it's just the reversed nature of y on screen
            if ((0, pointUtil_1.testIsInBounds)(x, y, left, bottom, right, top_1)) {
                return true;
            }
        }
        return false;
    };
    /**
     * returns axis related properties accordingly to chart configuration
     */
    HorizontalLineAnnotation.prototype.getDrawConfig = function (xCalc, yCalc) {
        var xAxisId = this.xAxisId;
        var xAxis = this.parentSurface.getXAxisById(xAxisId);
        var yAxisId = this.yAxisId;
        var yAxis = this.parentSurface.getYAxisById(yAxisId);
        var defaultChartCoordinateConfig = {
            annotationCoord: this.y1,
            lineAnnotationEdgeCoord: this.x1,
            horizontalAxis: xAxis,
            verticalAxis: yAxis,
            horizontalAxisCoordinateMode: this.xCoordinateMode,
            verticalAxisCoordinateMode: this.yCoordinateMode,
            horizontalCoordinateCalculator: xCalc,
            verticalCoordinateCalculator: yCalc,
            isAlignmentRight: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.axisAlignment) === AxisAlignment_1.EAxisAlignment.Right
        };
        var verticalChartCoordinateConfig = {
            annotationCoord: this.x1,
            lineAnnotationEdgeCoord: this.y1,
            horizontalAxis: yAxis,
            verticalAxis: xAxis,
            horizontalAxisCoordinateMode: this.yCoordinateMode,
            verticalAxisCoordinateMode: this.xCoordinateMode,
            horizontalCoordinateCalculator: yCalc,
            verticalCoordinateCalculator: xCalc,
            isAlignmentRight: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.axisAlignment) === AxisAlignment_1.EAxisAlignment.Right
        };
        return this.isVerticalChart ? verticalChartCoordinateConfig : defaultChartCoordinateConfig;
    };
    return HorizontalLineAnnotation;
}(LineAnnotation_1.LineAnnotation));
exports.HorizontalLineAnnotation = HorizontalLineAnnotation;
