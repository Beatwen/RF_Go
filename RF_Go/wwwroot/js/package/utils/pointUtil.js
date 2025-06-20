"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcDistanceFromLineSegment = exports.calcDotProduct = exports.testIsInInterval = exports.testIsInXBounds = exports.calcAnnotationBordersForAxisMarker = exports.testIsInBounds = exports.calcDistance = exports.calcCrossProduct = exports.calcDistanceFromLine = void 0;
var AxisAlignment_1 = require("../types/AxisAlignment");
var calcDistanceFromLine = function (x, y, startX, startY, endX, endY) {
    return Math.abs((0, exports.calcCrossProduct)(startX, startY, endX, endY, x, y) / (0, exports.calcDistance)(startX, startY, endX, endY));
};
exports.calcDistanceFromLine = calcDistanceFromLine;
var calcCrossProduct = function (xA, yA, xB, yB, xC, yC) {
    return (xB - xA) * (yC - yA) - (yB - yA) * (xC - xA);
};
exports.calcCrossProduct = calcCrossProduct;
var calcDistance = function (x1, y1, x2, y2) {
    var diffX = x1 - x2;
    var diffY = y1 - y2;
    return Math.sqrt(diffX * diffX + diffY * diffY);
};
exports.calcDistance = calcDistance;
/** Tests whether a point is within rectangle bounds */
var testIsInBounds = function (x, y, left, bottom, right, top, radius) {
    if (radius === void 0) { radius = 0; }
    return isBetween(x, left - radius, right + radius) && isBetween(y, top + radius, bottom - radius);
};
exports.testIsInBounds = testIsInBounds;
/** Returns whether a number is in the range of 2 other numbers, regardless if ascending or descending */
var isBetween = function (value, start, end) {
    return (value >= start && value <= end) || (value >= end && value <= start);
};
/**
 * Calculates annotation borders for {@link AxisMarkerAnnotation}
 * @param isVerticalChart the vertical chart flag
 * @param x1 the X1 data value of the annotation
 * @param y1 the Y1 data value of the annotation
 * @param horizontalAxis the horizontal axis
 * @param verticalAxis the vertical axis
 * @param textureWidth the texture width
 * @param viewRect the seriesViewRect
 * @param xPosition the X position of the texture on the SciChartSurface, the left-top corner position on the canvas
 * @param yPosition the Y position of the texture on the SciChartSurface, the left-top corner position on the canvas
 * @param textureHeight the texture width
 * @param annotationMarginXDirection the texture margin in X direction
 * @param annotationMarginYDirection the texture margin in Y direction
 * @param isHorizontalAxisAlignmentReversed if true EAxisAlignment.Top, otherwise EAxisAlignment.Bottom
 * @param isVerticalAxisAlignmentReversed if true EAxisAlignment.Left, otherwise EAxisAlignment.Right
 */
var calcAnnotationBordersForAxisMarker = function (isVerticalChart, x1, y1, horizontalAxis, verticalAxis, textureWidth, viewRect, xPosition, yPosition, textureHeight, annotationMarginXDirection, annotationMarginYDirection, isHorizontalAxisAlignmentReversed, isVerticalAxisAlignmentReversed) {
    var annotationBorders = { x1: 0, x2: 0, y1: 0, y2: 0 };
    if (isVerticalChart) {
        if (x1) {
            if (horizontalAxis.axisAlignment === AxisAlignment_1.EAxisAlignment.Top) {
                if (verticalAxis.axisAlignment === AxisAlignment_1.EAxisAlignment.Left) {
                    annotationBorders.x1 = textureWidth - viewRect.y;
                    annotationBorders.y1 = yPosition - viewRect.y;
                    annotationBorders.x2 = 0;
                    annotationBorders.y2 = yPosition + textureHeight - viewRect.y;
                }
                else if (verticalAxis.axisAlignment === AxisAlignment_1.EAxisAlignment.Right) {
                    annotationBorders.x1 = viewRect.width - textureWidth + viewRect.y;
                    annotationBorders.y1 = yPosition - viewRect.y;
                    annotationBorders.x2 = viewRect.width;
                    annotationBorders.y2 = yPosition + textureHeight - viewRect.y;
                }
            }
            else {
                if (verticalAxis.axisAlignment === AxisAlignment_1.EAxisAlignment.Left) {
                    annotationBorders.x1 = textureWidth - viewRect.x + annotationMarginXDirection;
                    annotationBorders.y1 = yPosition - viewRect.y;
                    annotationBorders.x2 = 0;
                    annotationBorders.y2 = yPosition + textureHeight - viewRect.y;
                }
                else if (verticalAxis.axisAlignment === AxisAlignment_1.EAxisAlignment.Right) {
                    annotationBorders.x1 = xPosition - annotationMarginXDirection;
                    annotationBorders.y1 = yPosition - viewRect.y;
                    annotationBorders.x2 = viewRect.width;
                    annotationBorders.y2 = yPosition + textureHeight - viewRect.y;
                }
            }
        }
        else if (y1) {
            if (horizontalAxis.axisAlignment === AxisAlignment_1.EAxisAlignment.Top) {
                annotationBorders.x1 = xPosition + textureWidth / 2 - viewRect.x + annotationMarginYDirection;
                annotationBorders.y1 = textureHeight - viewRect.y + annotationMarginYDirection;
                annotationBorders.x2 = xPosition - textureWidth / 2 - viewRect.x + annotationMarginYDirection;
                annotationBorders.y2 = 0;
            }
            else {
                annotationBorders.x1 = xPosition - textureWidth / 2 - viewRect.x + annotationMarginYDirection;
                annotationBorders.y1 = yPosition - annotationMarginYDirection;
                annotationBorders.x2 = xPosition + textureWidth / 2 - viewRect.x + annotationMarginYDirection;
                annotationBorders.y2 = viewRect.height;
            }
        }
    }
    else {
        if (x1) {
            if (isHorizontalAxisAlignmentReversed) {
                annotationBorders.x1 = xPosition - textureWidth / 2 + annotationMarginYDirection;
                annotationBorders.y1 = yPosition + textureHeight - viewRect.y;
                annotationBorders.x2 = xPosition + textureWidth / 2;
                annotationBorders.y2 = yPosition;
            }
            else if (isVerticalAxisAlignmentReversed) {
                annotationBorders.x1 = xPosition - textureWidth / 2 + annotationMarginXDirection - viewRect.x;
                annotationBorders.y1 = yPosition - annotationMarginXDirection;
                annotationBorders.x2 = xPosition + textureWidth / 2 + annotationMarginXDirection - viewRect.x;
                annotationBorders.y2 = viewRect.height;
            }
            else {
                annotationBorders.x1 = xPosition - textureWidth / 2 - annotationMarginYDirection;
                annotationBorders.y1 = yPosition - annotationMarginXDirection;
                annotationBorders.x2 = xPosition + textureWidth / 2 - annotationMarginYDirection;
                annotationBorders.y2 = yPosition + textureHeight - viewRect.y;
            }
        }
        else if (y1) {
            if (isVerticalAxisAlignmentReversed) {
                annotationBorders.x1 = textureWidth - viewRect.x + annotationMarginYDirection;
                annotationBorders.y1 = yPosition - textureHeight / 2;
                annotationBorders.x2 = 0;
                annotationBorders.y2 = yPosition + textureHeight / 2;
            }
            else {
                annotationBorders.x1 = xPosition - annotationMarginYDirection;
                annotationBorders.y1 = yPosition - textureHeight / 2 - annotationMarginXDirection;
                annotationBorders.x2 = xPosition + textureWidth;
                annotationBorders.y2 = yPosition + textureHeight / 2 - annotationMarginXDirection;
            }
        }
    }
    return annotationBorders;
};
exports.calcAnnotationBordersForAxisMarker = calcAnnotationBordersForAxisMarker;
var testIsInXBounds = function (xHitTestPoint, xDataPointCoord, maxDistance) {
    var distance = Math.abs(xHitTestPoint - xDataPointCoord);
    return distance < maxDistance;
};
exports.testIsInXBounds = testIsInXBounds;
/**
 * Tests if X is within radius from the [intervalStart, intervalEnd] interval,
 * intervalStart, intervalEnd values might not be sorted
 * @param x
 * @param intervalStart
 * @param intervalEnd
 * @param radius
 */
var testIsInInterval = function (x, intervalStart, intervalEnd, radius) {
    if (radius === void 0) { radius = 0; }
    if (intervalStart <= intervalEnd) {
        return intervalStart - radius <= x && x <= intervalEnd + radius;
    }
    else {
        return intervalEnd - radius <= x && x <= intervalStart + radius;
    }
};
exports.testIsInInterval = testIsInInterval;
var calcDotProduct = function (v1x, v1y, v2x, v2y, v3x, v3y) {
    return (v2x - v1x) * (v3x - v2x) + (v2y - v1y) * (v3y - v2y);
};
exports.calcDotProduct = calcDotProduct;
var calcDistanceFromLineSegment = function (x, y, startX, startY, endX, endY) {
    if ((0, exports.calcDotProduct)(startX, startY, endX, endY, x, y) > 0) {
        return (0, exports.calcDistance)(endX, endY, x, y);
    }
    if ((0, exports.calcDotProduct)(endX, endY, startX, startY, x, y) > 0) {
        return (0, exports.calcDistance)(startX, startY, x, y);
    }
    return (0, exports.calcDistanceFromLine)(x, y, startX, startY, endX, endY);
};
exports.calcDistanceFromLineSegment = calcDistanceFromLineSegment;
