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
exports.CustomAnnotation = void 0;
var annotationHelpers_1 = require("./annotationHelpers");
var IAnnotation_1 = require("./IAnnotation");
var SvgAnnotationBase_1 = require("./SvgAnnotationBase");
/**
 * A CustomAnnotation presents SVG information over the chart at specific {@link X1}, {@link Y1} coordinates
 */
var CustomAnnotation = /** @class */ (function (_super) {
    __extends(CustomAnnotation, _super);
    /**
     * Creates an instance of the {@link CustomAnnotation}
     * @param options The {@link ICustomAnnotationOptions} which contain optional parameters
     */
    function CustomAnnotation(options) {
        var _this = this;
        var _a;
        _this = _super.call(this, options) || this;
        /** @inheritDoc */
        _this.type = IAnnotation_1.EAnnotationType.SVGCustomAnnotation;
        /** Set true only if you are using a getSvgString method which is dependent on the position of the annotation
         * This will require the annotation to be recreated each frame which is slow
         */
        _this.isPositionDependent = false;
        _this.isDirty = true;
        _this.svgStringProperty = (_a = options === null || options === void 0 ? void 0 : options.svgString) !== null && _a !== void 0 ? _a : undefined;
        return _this;
    }
    Object.defineProperty(CustomAnnotation.prototype, "svgString", {
        /**
         * SVG dom element string provided by the user
         */
        get: function () {
            return this.svgStringProperty;
        },
        /**
         * SVG dom element string provided by the user
         */
        set: function (value) {
            if (this.svgStringProperty !== value) {
                this.isDirty = true;
                this.svgStringProperty = value;
                this.notifyPropertyChanged("svgString");
            }
        },
        enumerable: false,
        configurable: true
    });
    /** This is called to get the svg string to use. Override this to customise the svg string for each render */
    CustomAnnotation.prototype.getSvgString = function (annotation) {
        return annotation.svgString;
    };
    /**
     * This is called on the svg element immediately after it is created.  Use this to do adjustments or additions to it which require knowlege of its size.
     * For instance, this method adds a bounding rectangle to the existing svg
     * ```ts
     * updateSvg(annotation: CustomAnnotation, svg: SVGSVGElement) {
     *    const annotationRect = svg.getBoundingClientRect();
     *    const padding = 5;
     *    // Offset the existing element by the padding
     *    (svg.firstChild as SVGElement).setAttribute("x", padding.toString());
     *    (svg.firstChild as SVGElement).setAttribute("y", padding.toString());
     *    const rectWidth = annotationRect.width + padding + padding;
     *    const rectHeight = annotationRect.height + padding + padding;
     *    const namespace = "http://www.w3.org/2000/svg";
     *    const newRect = document.createElementNS(namespace, "rect");
     *    newRect.setAttribute("x", "0");
     *    newRect.setAttribute("y", "0");
     *    newRect.setAttribute("width", `${rectWidth}`);
     *    newRect.setAttribute("height", `${rectHeight}`);
     *    newRect.setAttribute("fill", `red`);
     *    return svg;
     * }
     * ```
     */
    CustomAnnotation.prototype.updateSvg = function (annotation, svg) {
        return svg;
    };
    /** @inheritDoc */
    CustomAnnotation.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        var options = {
            svgString: this.svgString
        };
        Object.assign(json.options, options);
        return json;
    };
    /** @inheritDoc */
    CustomAnnotation.prototype.create = function (xCalc, yCalc, xCoordSvgTrans, yCoordSvgTrans) {
        if (this.svg && !this.isDirty && !this.isPositionDependent) {
            this.calcAndSetAnnotationBorders(xCalc, yCalc);
            if (this.isSelected || this.prevIsSelected !== this.isSelected) {
                this.updateAdornerInner();
                this.prevIsSelected = this.isSelected;
            }
            return;
        }
        if (this.isDirty ||
            !this.svg ||
            (this.svg &&
                this.isPositionDependent &&
                (this.prevX1Coordinate !== this.getX1Coordinate(xCalc, yCalc) ||
                    this.prevY1Coordinate !== this.getY1Coordinate(xCalc, yCalc)))) {
            this.prevX1Coordinate = this.getX1Coordinate(xCalc, yCalc);
            this.prevY1Coordinate = this.getY1Coordinate(xCalc, yCalc);
            if (this.svg) {
                this.clear();
            }
            var svg = annotationHelpers_1.annotationHelpers.createSvg(this.getSvgString(this), this.svgRoot, this.nextSibling);
            this.setSvg(this.updateSvg(this, svg));
            this.calcAndSetAnnotationBorders(xCalc, yCalc);
            this.updateAdornerInner();
            this.prevIsSelected = this.isSelected;
            this.isDirty = false;
        }
        if (this.prevIsSelected !== this.isSelected && this.svg && this.isEditable) {
            this.updateAdornerInner();
            this.prevIsSelected = this.isSelected;
        }
    };
    return CustomAnnotation;
}(SvgAnnotationBase_1.SvgAnnotationBase));
exports.CustomAnnotation = CustomAnnotation;
