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
exports.VerticalLineAnnotation = void 0;
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
 * @summary The {@link VerticalLineAnnotation} provides an {@link AnnotationBase | Annotation} which draws a vertical line at
 * specific x1 (or y1 for Vertical Chart) over the {@link SciChartSurface}
 * @description
 * To add a {@link VerticalLineAnnotation} to a {@link SciChartSurface}, use the following code:
 * ```ts
 * const sciChartSurface: SciChartSurface;
 * const verticalLineAnnotation = new VerticalLineAnnotation( { x1: 1, y1: 3 fill: "#FF000077", stroke: "#FF0000"});
 * sciChartSurface.annotations.add(verticalLineAnnotation);
 * ```
 * @remarks Uses the fast WebGL/WebAssembly {@link WebGL2RenderingContext} for rendering
 */
var VerticalLineAnnotation = /** @class */ (function (_super) {
    __extends(VerticalLineAnnotation, _super);
    /**
     * Create an instance of a LineAnnotation
     * @param options Optional parameters of type {@link ILineAnnotationOptions} which configure the annotation upon construction
     */
    function VerticalLineAnnotation(options) {
        var _this = this;
        var _a, _b, _c;
        _this = _super.call(this, options) || this;
        /** @inheritDoc */
        _this.type = IAnnotation_1.EAnnotationType.RenderContextVerticalLineAnnotation;
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
        _this.verticalAlignment = (_c = options === null || options === void 0 ? void 0 : options.verticalAlignment) !== null && _c !== void 0 ? _c : _this.verticalAlignment;
        return _this;
    }
    Object.defineProperty(VerticalLineAnnotation.prototype, "y2", {
        /**
         * y2 property is not supported for VerticalLineAnnotation
         */
        get: function () {
            throw Error("y2 property is not supported for VerticalLineAnnotation");
        },
        /**
         * y2 property is not supported for VerticalLineAnnotation
         */
        set: function (y2) {
            throw Error("y2 property is not supported for VerticalLineAnnotation");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VerticalLineAnnotation.prototype, "x2", {
        /**
         * x2 property is not supported for VerticalLineAnnotation
         */
        get: function () {
            throw Error("x2 property is not supported for VerticalLineAnnotation");
        },
        /**
         * x2 property is not supported for VerticalLineAnnotation
         */
        set: function (x2) {
            throw Error("x2 property is not supported for VerticalLineAnnotation");
        },
        enumerable: false,
        configurable: true
    });
    /** @inheritDoc */
    VerticalLineAnnotation.prototype.drawWithContext = function (renderContext, xCalc, yCalc, viewRect) {
        Guard_1.Guard.notNull(renderContext, "renderContext");
        Guard_1.Guard.notNull(xCalc, "xCalc");
        Guard_1.Guard.notNull(yCalc, "yCalc");
        var strokePen = (0, Pen2DCache_1.getWebGlPenFromCache)(this.strokePenCache);
        var _a = this.getDrawConfig(xCalc, yCalc), annotationCoord = _a.annotationCoord, lineAnnotationEdgeCoord = _a.lineAnnotationEdgeCoord, horizontalAxis = _a.horizontalAxis, verticalAxis = _a.verticalAxis, horizontalAxisCoordinateMode = _a.horizontalAxisCoordinateMode, verticalAxisCoordinateMode = _a.verticalAxisCoordinateMode, horizontalCoordinateCalculator = _a.horizontalCoordinateCalculator, verticalCoordinateCalculator = _a.verticalCoordinateCalculator, isAlignmentTop = _a.isAlignmentTop;
        if (!horizontalAxis || !verticalAxis)
            return;
        var borderY1 = viewRect.height;
        var borderY2 = 0;
        if (isAlignmentTop) {
            borderY1 = borderY1 = 0;
            borderY2 = borderY2 = viewRect.height;
        }
        var lineAnnotationEdgeCoordValue = this.getValue(lineAnnotationEdgeCoord, verticalCoordinateCalculator, verticalAxisCoordinateMode);
        var isPartialLine = lineAnnotationEdgeCoordValue || lineAnnotationEdgeCoordValue === 0;
        if (isPartialLine) {
            borderY2 = borderY2 = this.getY1Coordinate(xCalc, yCalc);
        }
        var borderX1 = this.getX1Coordinate(xCalc, yCalc);
        var borderX2 = borderX1;
        // console.log("borderX1, borderX2, borderY1, borderY2", borderX1, borderX2, borderY1, borderY2);
        this.setAnnotationBorders(borderX1, borderX2, borderY1, borderY2);
        var lineEdgeAbsoluteVerticalCoord = this.getCoordinate(lineAnnotationEdgeCoord, verticalCoordinateCalculator, verticalAxisCoordinateMode);
        var absoluteHorizontalCoord = this.getCoordinate(annotationCoord, horizontalCoordinateCalculator, horizontalAxisCoordinateMode);
        var isAxisLabelInHorizontalVisibleRange = absoluteHorizontalCoord >= 0 &&
            absoluteHorizontalCoord <= horizontalAxis.parentSurface.seriesViewRect.width;
        var isLineAnnotationInVerticalVisibleRange = isAlignmentTop
            ? lineEdgeAbsoluteVerticalCoord >= 0
            : lineEdgeAbsoluteVerticalCoord <= verticalAxis.parentSurface.seriesViewRect.height;
        var isLineAnnotationEdgeVisible = !isPartialLine || isLineAnnotationInVerticalVisibleRange;
        if (isAxisLabelInHorizontalVisibleRange && isLineAnnotationEdgeVisible) {
            var textStyle = __assign(__assign({}, verticalAxis.labelStyle), { padding: new Thickness_1.Thickness(2, 2, 2, 2), color: this.axisLabelStroke, fontSize: this.axisFontSize * DpiHelper_1.DpiHelper.PIXEL_RATIO, fontFamily: this.axisFontFamily });
            var labelRect = (0, drawLabel_1.drawLineAnnotation)(horizontalAxis, renderContext, this.labelPlacement, this.labelValue, borderX1, borderX2, borderY1, borderY2, textStyle, this.axisLabelFill, strokePen, viewRect, this.showLabel, this.opacity, null, this.verticalAlignment);
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
    VerticalLineAnnotation.prototype.onDragStarted = function (args) {
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
    VerticalLineAnnotation.prototype.checkIsClickedOnAnnotationInternal = function (x, y) {
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
    VerticalLineAnnotation.prototype.getDrawConfig = function (xCalc, yCalc) {
        var xAxisId = this.xAxisId;
        var xAxis = this.parentSurface.getXAxisById(xAxisId);
        var yAxisId = this.yAxisId;
        var yAxis = this.parentSurface.getYAxisById(yAxisId);
        var defaultChartCoordinateConfig = {
            annotationCoord: this.x1,
            lineAnnotationEdgeCoord: this.y1,
            horizontalAxis: xAxis,
            verticalAxis: yAxis,
            horizontalAxisCoordinateMode: this.xCoordinateMode,
            verticalAxisCoordinateMode: this.yCoordinateMode,
            horizontalCoordinateCalculator: xCalc,
            verticalCoordinateCalculator: yCalc,
            isAlignmentTop: (xAxis === null || xAxis === void 0 ? void 0 : xAxis.axisAlignment) === AxisAlignment_1.EAxisAlignment.Top
        };
        var verticalChartCoordinateConfig = {
            annotationCoord: this.y1,
            lineAnnotationEdgeCoord: this.x1,
            horizontalAxis: yAxis,
            verticalAxis: xAxis,
            horizontalAxisCoordinateMode: this.yCoordinateMode,
            verticalAxisCoordinateMode: this.xCoordinateMode,
            horizontalCoordinateCalculator: yCalc,
            verticalCoordinateCalculator: xCalc,
            isAlignmentTop: (yAxis === null || yAxis === void 0 ? void 0 : yAxis.axisAlignment) === AxisAlignment_1.EAxisAlignment.Top
        };
        return this.isVerticalChart ? verticalChartCoordinateConfig : defaultChartCoordinateConfig;
    };
    return VerticalLineAnnotation;
}(LineAnnotation_1.LineAnnotation));
exports.VerticalLineAnnotation = VerticalLineAnnotation;
