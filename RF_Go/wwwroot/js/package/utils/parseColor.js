"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webColors = exports.parseTArgbToHtmlColor = exports.parseArgbToHtmlColor = exports.parseColorToTArgb = exports.toHex = exports.parseColorToUIntAbgr = exports.parseColorToUIntArgb = exports.parseColorToHexStringAbgr = exports.parseColorToHexStringArgb = void 0;
/**
 * Parse colors and convert them to hex string to use in c++
 * Examples: "#fff", "#ff0000", "rgba(255,255,0,1)", "#11333333"
 * @param input
 */
function parseColorToHexStringArgb(input, opacityOverride) {
    var res = parseColorToTArgb(input);
    return "0x" + toHex(opacityOverride !== null && opacityOverride !== void 0 ? opacityOverride : res.opacity) + toHex(res.red) + toHex(res.green) + toHex(res.blue);
}
exports.parseColorToHexStringArgb = parseColorToHexStringArgb;
/**
 * Parse colors and convert them to hex string in ABGR format to use in c++
 * Examples: "#fff", "#ff0000", "rgba(255,255,0,1)", "#11333333"
 * @param input
 */
function parseColorToHexStringAbgr(input, opacityOverride) {
    var res = parseColorToTArgb(input);
    return ("0x" +
        toHex(opacityOverride ? opacityOverride : res.opacity) +
        toHex(res.blue) +
        toHex(res.green) +
        toHex(res.red));
}
exports.parseColorToHexStringAbgr = parseColorToHexStringAbgr;
function parseColorToUIntArgb(input, opacity) {
    return parseInt(parseColorToHexStringArgb(input, opacity), 16);
}
exports.parseColorToUIntArgb = parseColorToUIntArgb;
function parseColorToUIntAbgr(input, opacity) {
    return parseInt(parseColorToHexStringAbgr(input, opacity), 16);
}
exports.parseColorToUIntAbgr = parseColorToUIntAbgr;
/**
 * Converts a UINT color number to a 8-digit hex code e.g. #FFAABBCC
 * @param value
 */
function toHex(value) {
    var hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
exports.toHex = toHex;
/**
 * Converts an HTML color code to TArgb
 * @param input
 */
function parseColorToTArgb(input) {
    if (!input || !input.length || input.length > 50) {
        throw Error("'" + input + "' is not a valid color...");
    }
    // Obviously, the numeric values will be easier to parse than names.So we do those first.
    // For three-digit format:
    var matchFor3digitColor = input.match(/^#?([0-9a-f]{3})$/i);
    if (matchFor3digitColor) {
        var m = matchFor3digitColor[1];
        // in three-character format, each value is multiplied by 0x11 to give an even scale from 0x00 to 0xff
        var opacity = 0xff;
        var red = parseInt(m.charAt(0), 16) * 0x11;
        var green = parseInt(m.charAt(1), 16) * 0x11;
        var blue = parseInt(m.charAt(2), 16) * 0x11;
        validateColorValues([red, green, blue], ["red", "green", "blue"]);
        return { opacity: opacity, red: red, green: green, blue: blue };
    }
    // That's one for the full six-digit format:
    var matchFor6digitColor = input.match(/^#?([0-9a-f]{6})$/i);
    if (matchFor6digitColor) {
        var m = matchFor6digitColor[1];
        var opacity = 0xff;
        var red = parseInt(m.substr(0, 2), 16);
        var green = parseInt(m.substr(2, 2), 16);
        var blue = parseInt(m.substr(4, 2), 16);
        validateColorValues([red, green, blue], ["red", "green", "blue"]);
        return { opacity: opacity, red: red, green: green, blue: blue };
    }
    // That's for eight-digit format, where last two digits stand for opacity:
    var matchFor8digitColor = input.match(/^#?([0-9a-f]{8})$/i);
    if (matchFor8digitColor) {
        var m = matchFor8digitColor[1];
        var red = parseInt(m.substr(0, 2), 16);
        var green = parseInt(m.substr(2, 2), 16);
        var blue = parseInt(m.substr(4, 2), 16);
        var opacity = parseInt(m.substr(6, 2), 16);
        validateColorValues([opacity, red, green, blue], ["opacity", "red", "green", "blue"]);
        return { opacity: opacity, red: red, green: green, blue: blue };
    }
    // And now for rgba() format:
    var matchForRgbaColor = input.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d*\.?\d*)\s*\)$/i);
    if (matchForRgbaColor) {
        var opacity01 = parseFloat(matchForRgbaColor[4]);
        validateOpacity(opacity01);
        var opacity = convertOpacity(opacity01);
        var red = parseInt(matchForRgbaColor[1], 10);
        var green = parseInt(matchForRgbaColor[2], 10);
        var blue = parseInt(matchForRgbaColor[3], 10);
        validateColorValues([red, green, blue], ["red", "green", "blue"]);
        return { opacity: opacity, red: red, green: green, blue: blue };
    }
    var wc = exports.webColors[input.toLowerCase()];
    if (wc)
        return parseColorToTArgb(wc);
    throw Error("'" + input + "' is not a valid color...");
}
exports.parseColorToTArgb = parseColorToTArgb;
/**
 * Converts color from ARGB number format into HTML string format #FFFFFFFF
 * @param argbColor color in ARGB format
 */
var parseArgbToHtmlColor = function (argbColor) {
    var res = argbColor.toString(16);
    var length = res.length;
    if (length > 8) {
        throw new Error("HTML color length cannot be greater than 8");
    }
    var addLeadingZeros = function (str, len) {
        var numLeadingZeros = len - str.length;
        var zerosStr = new Array(numLeadingZeros + 1).join("0");
        return zerosStr + str;
    };
    var rgb = addLeadingZeros(res.substr(-6), 6);
    var a = addLeadingZeros(res.substring(0, res.length - 6), 2);
    return "#" + rgb + a;
};
exports.parseArgbToHtmlColor = parseArgbToHtmlColor;
/**
 * Useful for debugging purposes. Converts {@link TArgb} to HTML Color code e.g. '#FF112233'=RGBA
 * @param targb
 */
var parseTArgbToHtmlColor = function (targb) {
    var r = convertComponent(targb.red);
    var g = convertComponent(targb.green);
    var b = convertComponent(targb.blue);
    var a = convertComponent(targb.opacity);
    return ("#" + r + g + b + a).toUpperCase();
};
exports.parseTArgbToHtmlColor = parseTArgbToHtmlColor;
/** @ignore */
function validateColorValues(values, variableNames) {
    values.forEach(function (value, index) {
        var variableName = variableNames[index];
        if (value === undefined) {
            throw Error("parseColor error ".concat(variableName, " color should not be null"));
        }
        else if (Number.isNaN(value)) {
            throw Error("parseColor error ".concat(variableName, " color should not be NaN"));
        }
        else if (value < 0 || value > 255) {
            throw Error("parseColor error ".concat(variableName, " color should be within [0, 255] range"));
        }
    });
}
/** @ignore */
function validateOpacity(value) {
    if (value === undefined) {
        throw Error("parseColor error opacity should not be null");
    }
    else if (Number.isNaN(value)) {
        throw Error("parseColor error opacity should not be NaN");
    }
    else if (value < 0 || value > 1) {
        throw Error("parseColor error opacity should be within [0, 1] range");
    }
}
/**
 * @ignore
 * Converts number from 0 to 1 to hex string. For example 1 -> "ff", 0.5 => "80"
 * @param opacity
 */
var convertOpacity = function (opacity) {
    if (opacity >= 1) {
        return 0xff;
    }
    if (opacity <= 0) {
        return 0;
    }
    return Math.floor(opacity * 256);
};
/**
 * @ignore
 * Converts number (color component) from 0 to 256 to hex string, with 0 padding
 * @param component
 */
var convertComponent = function (component) {
    if (component >= 256) {
        return "ff";
    }
    if (component <= 0) {
        return "00";
    }
    var hex = component.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
};
// https://www.w3schools.com/colors/colors_names.asp
// https://en.wikipedia.org/wiki/Web_colors
// http://www.colors.commutercreative.com/grid/
/** @ignore */
exports.webColors = {
    transparent: "#00000000",
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgrey: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    grey: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgrey: "#d3d3d3",
    lightgreen: "#90ee90",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
};
