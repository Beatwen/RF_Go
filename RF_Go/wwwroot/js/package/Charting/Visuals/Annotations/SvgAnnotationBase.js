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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvgAnnotationBase = void 0;
var Point_1 = require("../../../Core/Point");
var AnchorPoint_1 = require("../../../types/AnchorPoint");
var pointUtil_1 = require("../../../utils/pointUtil");
var translate_1 = require("../../../utils/translate");
var DpiHelper_1 = require("../TextureManager/DpiHelper");
var AnnotationBase_1 = require("./AnnotationBase");
var IAnnotation_1 = require("./IAnnotation");
var annotationHelpers_1 = require("./annotationHelpers");
var constants_1 = require("./constants");
/**
 * The Base class for an {@link AnnotationBase | Annotation} which draws using an HTML5 SVG canvas
 */
var SvgAnnotationBase = /** @class */ (function (_super) {
    __extends(SvgAnnotationBase, _super);
    /**
     * Creates an instance of an SvgAnnotationbase
     * @param options Optional parameters of type {@link ISvgAnnotationBaseOptions} used to configure the annotation on construction
     */
    function SvgAnnotationBase(options) {
        var _this = this;
        var _a, _b, _c, _d;
        _this = _super.call(this, options) || this;
        /** @inheritDoc */
        _this.isSvgAnnotation = true;
        _this.isDeleted = false;
        /**
         * The {@link SVGElement} which will be added to the chart
         */
        _this.xCoordShiftProperty = 0;
        _this.yCoordShiftProperty = 0;
        _this.verticalAnchorPointProperty = AnchorPoint_1.EVerticalAnchorPoint.Top;
        _this.horizontalAnchorPointProperty = AnchorPoint_1.EHorizontalAnchorPoint.Left;
        _this.prevX1Coordinate = 0;
        _this.prevY1Coordinate = 0;
        _this.xCoordShiftProperty = (_a = options === null || options === void 0 ? void 0 : options.xCoordShift) !== null && _a !== void 0 ? _a : _this.xCoordShiftProperty;
        _this.yCoordShiftProperty = (_b = options === null || options === void 0 ? void 0 : options.yCoordShift) !== null && _b !== void 0 ? _b : _this.yCoordShiftProperty;
        _this.verticalAnchorPointProperty = (_c = options === null || options === void 0 ? void 0 : options.verticalAnchorPoint) !== null && _c !== void 0 ? _c : _this.verticalAnchorPointProperty;
        _this.horizontalAnchorPointProperty = (_d = options === null || options === void 0 ? void 0 : options.horizontalAnchorPoint) !== null && _d !== void 0 ? _d : _this.horizontalAnchorPointProperty;
        return _this;
    }
    /** @inheritDoc */
    SvgAnnotationBase.prototype.onAttach = function (scs) {
        _super.prototype.onAttach.call(this, scs);
        this.selectSvgRoot();
        // Override in derived classes to be notified of attached
    };
    /** @inheritDoc */
    SvgAnnotationBase.prototype.onDetach = function () {
        _super.prototype.onDetach.call(this);
        this.delete();
    };
    Object.defineProperty(SvgAnnotationBase.prototype, "xCoordShift", {
        /**
         * Gets or sets an offset to shift X-coordinates
         */
        get: function () {
            return this.xCoordShiftProperty;
        },
        /**
         * Gets or sets an offset to shift X-coordinates
         */
        set: function (value) {
            if (this.xCoordShiftProperty !== value) {
                this.xCoordShiftProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.X_COORD_SHIFT);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SvgAnnotationBase.prototype, "yCoordShift", {
        /**
         * Gets or sets an offset to shift Y-coordinates
         */
        get: function () {
            return this.yCoordShiftProperty;
        },
        /**
         * Gets or sets an offset to shift Y-coordinates
         */
        set: function (value) {
            if (this.yCoordShiftProperty !== value) {
                this.yCoordShiftProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.Y_COORD_SHIFT);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SvgAnnotationBase.prototype, "verticalAnchorPoint", {
        /**
         * Gets or sets vertical anchor point
         */
        get: function () {
            return this.verticalAnchorPointProperty;
        },
        /**
         * Gets or sets vertical anchor point
         */
        set: function (value) {
            if (this.verticalAnchorPointProperty !== value) {
                this.verticalAnchorPointProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.VERTICAL_ANCHOR_POINT);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SvgAnnotationBase.prototype, "horizontalAnchorPoint", {
        /**
         * Gets or sets horizontal anchor point
         */
        get: function () {
            return this.horizontalAnchorPointProperty;
        },
        /**
         * Gets or sets horizontal anchor point
         */
        set: function (value) {
            if (this.horizontalAnchorPointProperty !== value) {
                this.horizontalAnchorPointProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.HORIZONTAL_ANCHOR_POINT);
            }
        },
        enumerable: false,
        configurable: true
    });
    SvgAnnotationBase.prototype.suspendInvalidate = function () {
        _super.prototype.suspendInvalidate.call(this);
        //@ts-ignore
        this.invalidateState.xCoordShift = this.xCoordShift;
        //@ts-ignore
        this.invalidateState.yCoordShift = this.yCoordShift;
    };
    SvgAnnotationBase.prototype.resumeInvalidate = function () {
        if (!this.invalidateState)
            return;
        if (
        //@ts-ignore
        this.xCoordShift !== this.invalidateState.xCoordShift ||
            //@ts-ignore
            this.yCoordShift !== this.invalidateState.yCoordShift) {
            if (this.invalidateParentCallback) {
                this.invalidateParentCallback();
            }
        }
        _super.prototype.resumeInvalidate.call(this);
    };
    /**
     * Updates the annotation position, with the {@link CoordinateCalculatorBase | Coordinate Calculators} passed in
     * @param xCalc The XAxis {@link CoordinateCalculatorBase | CoordinateCalculator} applied to this annotation
     * @param yCalc The YAxis {@link CoordinateCalculatorBase | CoordinateCalculator} applied to this annotation
     * @param xCoordSvgTrans X-coordinate translation which is needed to use SVG canvas having the whole chart size
     * @param yCoordSvgTrans Y-coordinate translation which is needed to use SVG canvas having the whole chart size
     */
    SvgAnnotationBase.prototype.update = function (xCalc, yCalc, xCoordSvgTrans, yCoordSvgTrans) {
        var _a, _b;
        this.create(xCalc, yCalc, xCoordSvgTrans, yCoordSvgTrans);
        var shiftX = (_a = this.xCoordShift) !== null && _a !== void 0 ? _a : 0;
        var shiftY = (_b = this.yCoordShift) !== null && _b !== void 0 ? _b : 0;
        // @ts-ignore
        var _c = this.getSvgDomRect(), width = _c.width, height = _c.height;
        if (this.horizontalAnchorPointProperty === AnchorPoint_1.EHorizontalAnchorPoint.Center) {
            shiftX -= width / 2;
        }
        else if (this.horizontalAnchorPointProperty === AnchorPoint_1.EHorizontalAnchorPoint.Right) {
            shiftX -= width;
        }
        if (this.verticalAnchorPointProperty === AnchorPoint_1.EVerticalAnchorPoint.Center) {
            shiftY -= height / 2;
        }
        else if (this.verticalAnchorPointProperty === AnchorPoint_1.EVerticalAnchorPoint.Bottom) {
            shiftY -= height;
        }
        this.svg.style.visibility = this.isHidden ? "hidden" : "visible";
        this.svg.style.opacity = this.opacity.toString();
        var x1Coord = shiftX + this.getX1Coordinate(xCalc, yCalc) + xCoordSvgTrans;
        var y1Coord = shiftY + this.getY1Coordinate(xCalc, yCalc) + yCoordSvgTrans;
        if (isNaN(x1Coord) || isNaN(y1Coord) || !isFinite(x1Coord) || !isFinite(y1Coord)) {
            this.svg.style.display = "none";
        }
        else {
            this.setSvgAttribute("x", x1Coord);
            this.setSvgAttribute("y", y1Coord);
        }
    };
    SvgAnnotationBase.prototype.calcDragDistance = function (xyValues) {
        if (!this.prevValue) {
            this.prevValue = xyValues;
            return;
        }
        var _a = this.getAnnotationBorders(), x1 = _a.x1, x2 = _a.x2, y1 = _a.y1, y2 = _a.y2;
        if (this.adornerDraggingPoint === AnnotationBase_1.EDraggingGripPoint.Body ||
            this.adornerDraggingPoint === AnnotationBase_1.EDraggingGripPoint.x1y1) {
            x1 = this.x1 - (this.prevValue.x - xyValues.x);
            y1 = this.y1 - (this.prevValue.y - xyValues.y);
            this.x1 = x1;
            this.y1 = y1;
            x2 = x2 - (this.prevValue.x - xyValues.x);
            y2 = y2 - (this.prevValue.y - xyValues.y);
        }
        this.prevValue = xyValues;
        this.setAnnotationBorders(x1, x2, y1, y2);
    };
    SvgAnnotationBase.prototype.onDragStarted = function (args) {
        _super.prototype.onDragStarted.call(this, args);
        var _a = this.getAnnotationBorders(), x1 = _a.x1, x2 = _a.x2, y1 = _a.y1, y2 = _a.y2;
        var xyCoord1 = new Point_1.Point(x1, y1);
        var circleCenterX = x1;
        var circleCenterY = y1;
        var height = Math.abs((y1 - y2) / 2);
        var width = Math.abs((x1 - x2) / 2);
        if (this.verticalAnchorPoint === AnchorPoint_1.EVerticalAnchorPoint.Center) {
            circleCenterY = circleCenterY + height;
        }
        if (this.horizontalAnchorPoint === AnchorPoint_1.EHorizontalAnchorPoint.Center) {
            circleCenterX = circleCenterX + width;
        }
        var xyMousePoint = (0, translate_1.translateFromCanvasToSeriesViewRect)(new Point_1.Point(args.mousePoint.x, args.mousePoint.y), this.parentSurface.seriesViewRect);
        if (!xyMousePoint) {
            return false;
        }
        if (xyCoord1 && this.canDragPoint(AnnotationBase_1.EDraggingGripPoint.x1y1)) {
            var dist = (0, pointUtil_1.calcDistance)(circleCenterX, circleCenterY, (0, translate_1.translateToNotScaled)(xyMousePoint.x), (0, translate_1.translateToNotScaled)(xyMousePoint.y));
            if (dist < this.annotationsGripsRadius) {
                this.adornerDraggingPoint = AnnotationBase_1.EDraggingGripPoint.x1y1;
                return true;
            }
        }
        if (this.canDragPoint(AnnotationBase_1.EDraggingGripPoint.Body) && this.clickToSelect(args)) {
            this.adornerDraggingPoint = AnnotationBase_1.EDraggingGripPoint.Body;
            return true;
        }
        return false;
    };
    /** @inheritDoc */
    SvgAnnotationBase.prototype.delete = function () {
        this.clear();
        this.isDeleted = true;
    };
    SvgAnnotationBase.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        var options = {
            xCoordShift: this.xCoordShift,
            yCoordShift: this.yCoordShift,
            verticalAnchorPoint: this.verticalAnchorPoint,
            horizontalAnchorPoint: this.horizontalAnchorPoint
        };
        Object.assign(json.options, options);
        return json;
    };
    Object.defineProperty(SvgAnnotationBase.prototype, "svg", {
        get: function () {
            return this.svgProperty;
        },
        enumerable: false,
        configurable: true
    });
    SvgAnnotationBase.prototype.getSvgDomRect = function () {
        var _a, _b, _c;
        if (!this.svgDOMRect) {
            // getBBox has issue measuring the inner content of SVG on Firefox SCJS-1936,
            // thus here we try to measure the contents, e.g. background element if it exists
            // @ts-ignore property doesn't exist warning
            this.svgDOMRect = (_c = (_b = (_a = this.svg.firstChild) === null || _a === void 0 ? void 0 : _a.getBBox) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : this.svg.getBBox();
        }
        return this.svgDOMRect;
    };
    SvgAnnotationBase.prototype.clear = function () {
        if (!this.parentSurface || this.parentSurface.isDeleted || !this.svg)
            return;
        this.nextSibling = this.svg.nextElementSibling;
        this.svg.parentNode.removeChild(this.svg);
        this.setSvg(undefined);
        this.svgDOMRect = undefined;
    };
    SvgAnnotationBase.prototype.checkIsClickedOnAnnotationInternal = function (x, y) {
        var _a = this.getAnnotationBorders(true), x1 = _a.x1, x2 = _a.x2, y1 = _a.y1, y2 = _a.y2;
        // For SVG annotations we need to use not scaled coordinates
        var notScaledX = x / DpiHelper_1.DpiHelper.PIXEL_RATIO;
        var notScaledY = y / DpiHelper_1.DpiHelper.PIXEL_RATIO;
        return (0, pointUtil_1.testIsInBounds)(notScaledX, notScaledY, x1, y2, x2, y1);
    };
    SvgAnnotationBase.prototype.updateAdornerInner = function () {
        this.deleteAdorner();
        if (this.isSelected) {
            var _a = this.getAdornerAnnotationBorders(true, true), x1 = _a.x1, x2 = _a.x2, y1 = _a.y1, y2 = _a.y2;
            var svgString = this.svgStringAdornerTemplate(x1, y1, x2, y2);
            this.svgAdorner = annotationHelpers_1.annotationHelpers.createSvg(svgString, this.svgAdornerRoot);
        }
    };
    Object.defineProperty(SvgAnnotationBase.prototype, "svgRoot", {
        /**
         * Gets the {@link SVGSVGElement | SVG Element} at the root of this annotation
         */
        get: function () {
            return this.svgRootProperty;
        },
        enumerable: false,
        configurable: true
    });
    SvgAnnotationBase.prototype.selectSvgRoot = function () {
        if (this.annotationLayer === IAnnotation_1.EAnnotationLayer.AboveChart) {
            this.svgRootProperty = this.parentSurface.domSvgContainer;
        }
        else if (this.annotationLayer === IAnnotation_1.EAnnotationLayer.BelowChart) {
            // default to foreground for back compatability
            this.svgRootProperty = this.parentSurface.domSvgContainer;
        }
        else if (this.annotationLayer === IAnnotation_1.EAnnotationLayer.Background) {
            this.svgRootProperty = this.parentSurface.domBackgroundSvgContainer;
        }
        else {
            throw new Error("Unexpected annotationLayer value: \"".concat(this.annotationLayer, "!\""));
        }
    };
    SvgAnnotationBase.prototype.setSvgAttribute = function (attributeName, value) {
        var strValue = value.toString(10);
        this.svg.setAttribute(attributeName, strValue);
    };
    SvgAnnotationBase.prototype.setSvg = function (svg) {
        this.svgProperty = svg;
    };
    SvgAnnotationBase.prototype.notifyPropertyChanged = function (propertyName) {
        if (propertyName === constants_1.PROPERTY.ANNOTATION_CANVAS) {
            this.clear();
            this.nextSibling = undefined;
            this.selectSvgRoot();
        }
        _super.prototype.notifyPropertyChanged.call(this, propertyName);
    };
    /**
     * Calculates and sets annotationBorders
     * @protected
     */
    SvgAnnotationBase.prototype.calcAndSetAnnotationBorders = function (xCalc, yCalc) {
        if (!this.svg)
            return;
        var borderX1 = this.getX1Coordinate(xCalc, yCalc) + this.xCoordShift;
        var borderY1 = this.getY1Coordinate(xCalc, yCalc) + this.yCoordShift;
        // @ts-ignore
        var _a = this.getSvgDomRect(), width = _a.width, height = _a.height;
        var borderX2 = borderX1 + width;
        var borderY2 = borderY1 + height;
        if (this.verticalAnchorPoint === AnchorPoint_1.EVerticalAnchorPoint.Bottom) {
            borderY2 = borderY1 - height;
        }
        if (this.verticalAnchorPoint === AnchorPoint_1.EVerticalAnchorPoint.Center) {
            borderY2 = borderY1 + height / 2;
            borderY1 = borderY1 - height / 2;
        }
        if (this.horizontalAnchorPoint === AnchorPoint_1.EHorizontalAnchorPoint.Right) {
            borderX2 = borderX1 - width;
        }
        if (this.horizontalAnchorPoint === AnchorPoint_1.EHorizontalAnchorPoint.Center) {
            borderX2 = borderX1 + width / 2;
            borderX1 = borderX1 - width / 2;
        }
        this.setAnnotationBorders(borderX1, borderX2, borderY1, borderY2);
    };
    SvgAnnotationBase.prototype.svgStringAdornerTemplate = function (x1, y1, x2, y2) {
        var circleCenterX = x1;
        var circleCenterY = y1;
        var height = Math.abs((y1 - y2) / 2);
        var width = Math.abs((x1 - x2) / 2);
        if (this.verticalAnchorPoint === AnchorPoint_1.EVerticalAnchorPoint.Center) {
            circleCenterY = circleCenterY + height;
        }
        if (this.horizontalAnchorPoint === AnchorPoint_1.EHorizontalAnchorPoint.Center) {
            circleCenterX = circleCenterX + width;
        }
        return "<svg xmlns=\"http://www.w3.org/2000/svg\">\n        <rect x=\"".concat(x1, "\" y=\"").concat(y1, "\" width=\"").concat(Math.abs(x1 - x2), "\" height=\"").concat(Math.abs(y1 - y2), "\" stroke=\"").concat(this.selectionBoxStroke, "\" stroke-width=\"").concat(this.selectionBoxThickness, "px\" fill=\"none\" />\n        ").concat(this.canDragPoint(AnnotationBase_1.EDraggingGripPoint.x1y1) ? this.getAnnotationGripSvg(circleCenterX, circleCenterY) : "", "\n      </svg>");
    };
    return SvgAnnotationBase;
}(AnnotationBase_1.AnnotationBase));
exports.SvgAnnotationBase = SvgAnnotationBase;
