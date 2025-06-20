"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
var Point_1 = require("./Point");
/**
 * Class to represent a rectangle in 2D space
 */
var Rect = /** @class */ (function () {
    /**
     * Creates a rect with X,Y,Width,Height
     * @remarks
     * To create a rect with two points, or with left, top right bottom, see the factory functions
     * {@link Rect.createWithPoints} or {@link Rect.createWithCoords}
     * @param x
     * @param y
     * @param width
     * @param height
     */
    function Rect(x, y, width, height) {
        if (width < 0 || height < 0) {
            throw new Error("Can not create Rect with negative width/height");
        }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**
     * Creates a rectangle with X,Y top left coordinate and width and height
     * @param x
     * @param y
     * @param width
     * @param height
     */
    Rect.create = function (x, y, width, height) {
        if (width < 0 || height < 0) {
            throw new Error("Rect.create width and height cannot be less than zero");
        }
        return new Rect(x, y, width, height);
    };
    /**
     * Creates a rectangle with left, top ,right, bottom
     * @param left
     * @param top
     * @param right
     * @param bottom
     */
    Rect.createWithCoords = function (left, top, right, bottom) {
        var x = left;
        var y = top;
        var width = right - left;
        var height = bottom - top;
        return new Rect(x, y, width, height);
    };
    /**
     * Create a rectangle with two points which could be top-left, bottom-right
     * @param point1
     * @param point2
     */
    Rect.createWithPoints = function (point1, point2) {
        var x = Math.min(point1.x, point2.x);
        var y = Math.min(point1.y, point2.y);
        var width = Math.max(Math.max(point1.x, point2.x) - x, 0);
        var height = Math.max(Math.max(point1.y, point2.y) - y, 0);
        return Rect.create(x, y, width, height);
    };
    /**
     * Clones a rect
     * @param rect
     */
    Rect.createCopy = function (rect) {
        return new Rect(rect.x, rect.y, rect.width, rect.height);
    };
    /**
     * Creates a zero rect with x,y,w,h = 0
     */
    Rect.createZero = function () {
        return new Rect(0, 0, 0, 0);
    };
    /**
     * Returns true if a rect numerically equals another rect
     * @param rect1
     * @param rect2
     */
    Rect.isEqual = function (rect1, rect2) {
        return (rect1.x === rect2.x && rect1.y === rect2.y && rect1.width === rect2.width && rect1.height === rect2.height);
    };
    /**
     * Clips a point to the rect, so if the point is outside the rect it will be on the boundary of the rect after this operation
     * @param rect The rect
     * @param point The point to clip
     */
    Rect.clipPointToRect = function (point, rect) {
        var x = point.x < rect.x ? rect.x : point.x > rect.x + rect.width ? rect.x + rect.width : point.x;
        var y = point.y < rect.y ? rect.y : point.y > rect.y + rect.height ? rect.y + rect.height : point.y;
        return new Point_1.Point(x, y);
    };
    Object.defineProperty(Rect.prototype, "left", {
        /**
         * Gets the left edge of the rect
         */
        get: function () {
            return this.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "top", {
        /**
         * Gets the top edge of the rect
         */
        get: function () {
            return this.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "right", {
        /**
         * Gets the right edge of the rect
         */
        get: function () {
            return this.x + this.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottom", {
        /**
         * Gets the bottom edge of the rect
         */
        get: function () {
            return this.y + this.height;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Turns a { x, y, width, height } object into a {@link NumberRange}, most helpful for JSON deserialization
     */
    Rect.hydrate = function (input) {
        if (input) {
            var x = input.x, y = input.y, width = input.width, height = input.height;
            return new Rect(x, y, width, height);
        }
        else {
            return undefined;
        }
    };
    return Rect;
}());
exports.Rect = Rect;
