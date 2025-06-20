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
exports.TextAnnotation = void 0;
var Thickness_1 = require("../../../Core/Thickness");
var annotationHelpers_1 = require("./annotationHelpers");
var constants_1 = require("./constants");
var IAnnotation_1 = require("./IAnnotation");
var SvgAnnotationBase_1 = require("./SvgAnnotationBase");
/**
 * A TextAnnotation presents text information over the chart at specific {@link X1}, {@link Y1} coordinates
 */
var TextAnnotation = /** @class */ (function (_super) {
    __extends(TextAnnotation, _super);
    /**
     * Creates an instance of the {@link TextAnnotation}
     * @param options The {@link ITextAnnotationOptions} which contain optional parameters
     */
    function TextAnnotation(options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        _this = _super.call(this, options) || this;
        /** @inheritDoc */
        _this.type = IAnnotation_1.EAnnotationType.SVGTextAnnotation;
        _this.textProperty = "DEFAULT TEXT";
        _this.textColorProperty = "#ffffff";
        _this.fontSizeProperty = 14;
        _this.fontFamilyProperty = "Arial";
        _this.fontWeightProperty = "Normal";
        _this.paddingProperty = Thickness_1.Thickness.fromNumber(0);
        _this.classNameProperty = "scichart__text-annotation";
        _this.isDirty = true;
        _this.textProperty = (_a = options === null || options === void 0 ? void 0 : options.text) !== null && _a !== void 0 ? _a : _this.textProperty;
        _this.textColorProperty = (_b = options === null || options === void 0 ? void 0 : options.textColor) !== null && _b !== void 0 ? _b : _this.textColorProperty;
        _this.fontSizeProperty = (_c = options === null || options === void 0 ? void 0 : options.fontSize) !== null && _c !== void 0 ? _c : _this.fontSizeProperty;
        _this.fontFamilyProperty = (_d = options === null || options === void 0 ? void 0 : options.fontFamily) !== null && _d !== void 0 ? _d : _this.fontFamilyProperty;
        _this.backgroundProperty = (_e = options === null || options === void 0 ? void 0 : options.background) !== null && _e !== void 0 ? _e : _this.backgroundProperty;
        _this.paddingProperty = (_f = options === null || options === void 0 ? void 0 : options.padding) !== null && _f !== void 0 ? _f : _this.paddingProperty;
        _this.classNameProperty = (_g = options === null || options === void 0 ? void 0 : options.className) !== null && _g !== void 0 ? _g : _this.classNameProperty;
        _this.fontWeight = (_h = options === null || options === void 0 ? void 0 : options.fontWeight) !== null && _h !== void 0 ? _h : _this.fontWeight;
        return _this;
    }
    Object.defineProperty(TextAnnotation.prototype, "text", {
        /**
         * text provided by the user
         */
        get: function () {
            return this.textProperty;
        },
        set: function (text) {
            if (this.textProperty !== text) {
                this.textProperty = text;
                this.notifyPropertyChanged(constants_1.PROPERTY.TEXT);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextAnnotation.prototype, "background", {
        /**
         * Gets or sets the background of {@link TextAnnotation}
         */
        get: function () {
            return this.backgroundProperty;
        },
        /**
         * Gets or sets the background of {@link TextAnnotation}
         */
        set: function (value) {
            if (this.backgroundProperty !== value) {
                this.backgroundProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.BACKGROUND_COLOR);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextAnnotation.prototype, "padding", {
        /**
         * Gets or sets the padding of {@link TextAnnotation}
         */
        get: function () {
            return this.paddingProperty;
        },
        /**
         * Gets or sets the padding of {@link TextAnnotation}
         */
        set: function (value) {
            if (this.paddingProperty !== value) {
                this.paddingProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.PADDING);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextAnnotation.prototype, "className", {
        /**
         * Gets or sets the class on underlying SVG element of {@link TextAnnotation}
         */
        get: function () {
            return this.classNameProperty;
        },
        /**
         * Gets or sets the class on underlying SVG element of {@link TextAnnotation}
         */
        set: function (value) {
            if (this.classNameProperty !== value) {
                this.classNameProperty = value;
                this.notifyPropertyChanged(constants_1.PROPERTY.CLASS_NAME);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextAnnotation.prototype, "textColor", {
        /**
         * text color provided by the user
         */
        get: function () {
            return this.textColorProperty;
        },
        set: function (textColor) {
            if (this.textColorProperty !== textColor) {
                this.textColorProperty = textColor;
                this.notifyPropertyChanged(constants_1.PROPERTY.TEXT_STROKE);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextAnnotation.prototype, "fontSize", {
        /**
         * font size provided by the user
         */
        get: function () {
            return this.fontSizeProperty;
        },
        set: function (fontSize) {
            if (this.fontSizeProperty !== fontSize) {
                this.fontSizeProperty = fontSize;
                this.notifyPropertyChanged(constants_1.PROPERTY.FONT_SIZE);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextAnnotation.prototype, "fontFamily", {
        /**
         * font family provided by the user
         */
        get: function () {
            return this.fontFamilyProperty;
        },
        set: function (fontFamily) {
            if (this.fontFamilyProperty !== fontFamily) {
                this.fontFamilyProperty = fontFamily;
                this.notifyPropertyChanged(constants_1.PROPERTY.FONT_FAMILY);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextAnnotation.prototype, "fontWeight", {
        /**
         * font weight provided by the user
         */
        get: function () {
            return this.fontWeightProperty;
        },
        set: function (fontWeight) {
            if (this.fontWeightProperty !== fontWeight) {
                this.fontWeightProperty = fontWeight;
                this.notifyPropertyChanged(constants_1.PROPERTY.FONT_WEIGHT);
            }
        },
        enumerable: false,
        configurable: true
    });
    TextAnnotation.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        var options = {
            fontFamily: this.fontFamily,
            fontSize: this.fontSize,
            fontWeight: this.fontWeight,
            text: this.text,
            textColor: this.textColor
        };
        Object.assign(json.options, options);
        return json;
    };
    /**
     * Notifies listeners of {@link invalidateParentCallback} that a property has changed
     */
    TextAnnotation.prototype.notifyPropertyChanged = function (p) {
        if (p !== constants_1.PROPERTY.IS_HIDDEN &&
            p !== constants_1.PROPERTY.X_COORD_SHIFT &&
            p !== constants_1.PROPERTY.Y_COORD_SHIFT &&
            p !== constants_1.PROPERTY.HORIZONTAL_ANCHOR_POINT &&
            p !== constants_1.PROPERTY.VERTICAL_ANCHOR_POINT &&
            p !== constants_1.PROPERTY.X1 &&
            p !== constants_1.PROPERTY.X2 &&
            p !== constants_1.PROPERTY.Y1 &&
            p !== constants_1.PROPERTY.Y2) {
            this.isDirty = true;
        }
        if (this.invalidateParentCallback) {
            this.invalidateParentCallback();
        }
    };
    /**
     * @inheritDoc
     */
    TextAnnotation.prototype.create = function (xCalc, yCalc, xCoordSvgTrans, yCoordSvgTrans) {
        if (this.svg && !this.isDirty) {
            this.calcAndSetAnnotationBorders(xCalc, yCalc);
            if (this.isSelected || this.prevIsSelected !== this.isSelected) {
                this.updateAdornerInner();
                this.prevIsSelected = this.isSelected;
            }
            return;
        }
        if (this.svg) {
            this.clear();
        }
        this.setSvg(this.createSvg());
        this.calcAndSetAnnotationBorders(xCalc, yCalc);
        this.updateAdornerInner();
        this.isDirty = false;
    };
    TextAnnotation.prototype.createSvg = function () {
        var x = this.padding.left;
        var y = this.fontSize + this.padding.top;
        //dominant-baseline="text-after-edge"
        var svgString = "<svg id=\"scichart__text-annotation-".concat(this.id, "\" class=\"").concat(this.className, "\">\n            <text x=\"").concat(x, "\" y=\"").concat(y, "\" fill=\"").concat(this.textColor, "\"  font-size=\"").concat(this.fontSize, "\" font-family=\"").concat(this.fontFamily, "\" font-weight=\"").concat(this.fontWeight, "\">").concat(this.text, "</text>\n        </svg>");
        var svgNode = annotationHelpers_1.annotationHelpers.createSvg(svgString, this.svgRoot, this.nextSibling);
        if (this.background) {
            this.attachSvgBackgroundRect(svgNode, this.background, this.padding);
        }
        return svgNode;
    };
    TextAnnotation.prototype.attachSvgBackgroundRect = function (svgRoot, background, padding) {
        var textAnnotationRect = svgRoot.getBBox();
        var rectWidth = textAnnotationRect.width + padding.left + padding.right;
        var rectHeight = textAnnotationRect.height + padding.top + padding.bottom;
        var namespace = "http://www.w3.org/2000/svg";
        var newRect = document.createElementNS(namespace, "rect");
        newRect.setAttribute("x", "0");
        newRect.setAttribute("y", "0");
        newRect.setAttribute("width", "".concat(rectWidth));
        newRect.setAttribute("height", "".concat(rectHeight));
        newRect.setAttribute("fill", "".concat(background));
        svgRoot.insertBefore(newRect, svgRoot.firstChild);
    };
    return TextAnnotation;
}(SvgAnnotationBase_1.SvgAnnotationBase));
exports.TextAnnotation = TextAnnotation;
