"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustTextStyle = exports.areEqualTextStyles = exports.areEqualSimpleTextStyles = exports.areEqualNativeTextStyles = exports.areEqualTextureTextStyles = exports.handleInvalidTextAlignment = exports.handleInvalidChartTitlePosition = exports.getIsHorizontalPlacement = exports.ETitlePosition = exports.ETextAlignment = void 0;
var DpiHelper_1 = require("../Charting/Visuals/TextureManager/DpiHelper");
var Thickness_1 = require("../Core/Thickness");
/**
 * Defines the anchor point of a text
 */
var ETextAlignment;
(function (ETextAlignment) {
    ETextAlignment["Center"] = "Center";
    ETextAlignment["Left"] = "Left";
    ETextAlignment["Right"] = "Right";
})(ETextAlignment = exports.ETextAlignment || (exports.ETextAlignment = {}));
/**
 * Defines a side where the chart title should be placed
 */
var ETitlePosition;
(function (ETitlePosition) {
    ETitlePosition["Top"] = "Top";
    ETitlePosition["Bottom"] = "Bottom";
    ETitlePosition["Right"] = "Right";
    ETitlePosition["Left"] = "Left";
})(ETitlePosition = exports.ETitlePosition || (exports.ETitlePosition = {}));
/** @ignore */
var getIsHorizontalPlacement = function (position) {
    return position === ETitlePosition.Top || position === ETitlePosition.Bottom;
};
exports.getIsHorizontalPlacement = getIsHorizontalPlacement;
/** @ignore */
var handleInvalidChartTitlePosition = function (invalidValue) {
    throw new Error("Invalid chart title position: ".concat(invalidValue, "!"));
};
exports.handleInvalidChartTitlePosition = handleInvalidChartTitlePosition;
/** @ignore */
var handleInvalidTextAlignment = function (invalidValue) {
    throw new Error("Invalid text alignment \"".concat(invalidValue, "\"!"));
};
exports.handleInvalidTextAlignment = handleInvalidTextAlignment;
/** @ignore */
var areEqualTextureTextStyles = function (style1, style2) {
    return (style1.color === style2.color &&
        style1.fontFamily === style2.fontFamily &&
        style1.fontSize === style2.fontSize &&
        style1.fontStyle === style2.fontStyle &&
        style1.fontWeight === style2.fontWeight &&
        style1.lineSpacing === style2.lineSpacing &&
        ((style1.padding === undefined && style2.padding === undefined) ||
            Thickness_1.Thickness.areEqual(style1.padding, style2.padding)));
};
exports.areEqualTextureTextStyles = areEqualTextureTextStyles;
/** @ignore */
var areEqualNativeTextStyles = function (style1, style2) {
    return (style1.color === style2.color &&
        style1.fontFamily === style2.fontFamily &&
        style1.fontSize === style2.fontSize &&
        style1.lineSpacing === style2.lineSpacing &&
        ((style1.padding === undefined && style2.padding === undefined) ||
            Thickness_1.Thickness.areEqual(style1.padding, style2.padding)));
};
exports.areEqualNativeTextStyles = areEqualNativeTextStyles;
/** @ignore */
var areEqualSimpleTextStyles = function (style1, style2) {
    if (!style1 || !style2 || !style1.useNativeText !== !style2.useNativeText) {
        // comparing to an undefined style or styles have different rendering methods
        return false;
    }
    else if (style1.useNativeText && style2.useNativeText) {
        return (0, exports.areEqualNativeTextStyles)(style1, style2);
    }
    else {
        return (0, exports.areEqualTextureTextStyles)(style1, style2);
    }
};
exports.areEqualSimpleTextStyles = areEqualSimpleTextStyles;
/** @ignore */
var areEqualTextStyles = function (style1, style2) {
    var areBasePropertiesEqual = (0, exports.areEqualSimpleTextStyles)(style1, style2);
    return (areBasePropertiesEqual &&
        style1.rotation === style2.rotation &&
        style1.multilineAlignment === style2.multilineAlignment);
};
exports.areEqualTextStyles = areEqualTextStyles;
/** @ignore */
var adjustTextStyle = function (textStyle) {
    var adjustedTextStyle = DpiHelper_1.DpiHelper.adjustTextStyle(textStyle);
    return adjustedTextStyle;
};
exports.adjustTextStyle = adjustTextStyle;
