"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArraysEqual = exports.getTextStylesEqual = exports.getTArgbEqual = exports.getLineStylesEqual = exports.getDescriptorsEqual = void 0;
/**
 * Returns true if descriptors are deeply equal, else false
 * @param a
 * @param b
 */
function getDescriptorsEqual(a, b) {
    if (a === undefined) {
        return b === undefined;
    }
    if (b === undefined) {
        return a === undefined;
    }
    return (a.axisTitle === b.axisTitle &&
        a.axisSize === b.axisSize &&
        getTArgbEqual(a.backgroundColor, b.backgroundColor) &&
        getTArgbEqual(a.bandColor, b.bandColor) &&
        getTArgbEqual(a.borderColor, b.borderColor) &&
        getArraysEqual(a.majorCoordinates, b.majorCoordinates) &&
        getArraysEqual(a.minorCoordinates, b.minorCoordinates) &&
        getArraysEqual(a.tickLabels, b.tickLabels) &&
        getLineStylesEqual(a.majorLineStyle, b.majorLineStyle) &&
        getLineStylesEqual(a.minorLineStyle, b.minorLineStyle) &&
        getLineStylesEqual(a.majorTickStyle, b.majorTickStyle) &&
        getLineStylesEqual(a.minorTickStyle, b.minorTickStyle) &&
        getTextStylesEqual(a.titleStyle, b.titleStyle) &&
        getTextStylesEqual(a.labelStyle, b.labelStyle) &&
        a.drawMajorGridlines === b.drawMajorGridlines &&
        a.drawMinorGridlines === b.drawMinorGridlines &&
        a.drawMajorTicks === b.drawMajorTicks &&
        a.drawMinorTicks === b.drawMinorTicks &&
        a.drawBands === b.drawBands &&
        a.drawLabels === b.drawLabels &&
        a.isVisible === b.isVisible &&
        a.borderThickness === b.borderThickness &&
        a.labelDepthTestEnabled === b.labelDepthTestEnabled &&
        a.titleOffset === b.titleOffset &&
        a.tickLabelsOffset === b.tickLabelsOffset &&
        a.smoothLabelOverlapAvoidance === b.smoothLabelOverlapAvoidance);
}
exports.getDescriptorsEqual = getDescriptorsEqual;
function getLineStylesEqual(a, b) {
    if (a === undefined && b !== undefined)
        return false;
    if (b === undefined && a !== undefined)
        return false;
    if (a === undefined && b === undefined)
        return true;
    return (a.start === b.start &&
        a.end === b.end &&
        getTArgbEqual(a.stroke, b.stroke) &&
        a.strokeThickness === b.strokeThickness);
}
exports.getLineStylesEqual = getLineStylesEqual;
function getTArgbEqual(a, b) {
    if (a === undefined && b !== undefined)
        return false;
    if (b === undefined && a !== undefined)
        return false;
    if (a === undefined && b === undefined)
        return true;
    return a.red === b.red && a.green === b.green && a.blue === b.blue && a.opacity === b.opacity;
}
exports.getTArgbEqual = getTArgbEqual;
function getTextStylesEqual(a, b) {
    if (a === undefined && b !== undefined)
        return false;
    if (b === undefined && a !== undefined)
        return false;
    if (a === undefined && b === undefined)
        return true;
    return (a.alignment === b.alignment &&
        a.dpiScaling === b.dpiScaling &&
        a.fontFamily === b.fontFamily &&
        a.fontSize === b.fontSize &&
        a.foreground === b.foreground);
}
exports.getTextStylesEqual = getTextStylesEqual;
function getArraysEqual(a, b) {
    if (a === undefined && b !== undefined)
        return false;
    if (b === undefined && a !== undefined)
        return false;
    if (b === undefined && a === undefined)
        return true;
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
exports.getArraysEqual = getArraysEqual;
