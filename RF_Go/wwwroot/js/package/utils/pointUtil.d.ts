import { AxisBase2D } from "../Charting/Visuals/Axis/AxisBase2D";
import { Rect } from "../Core/Rect";
export declare const calcDistanceFromLine: (x: number, y: number, startX: number, startY: number, endX: number, endY: number) => number;
export declare const calcCrossProduct: (xA: number, yA: number, xB: number, yB: number, xC: number, yC: number) => number;
export declare const calcDistance: (x1: number, y1: number, x2: number, y2: number) => number;
/** Tests whether a point is within rectangle bounds */
export declare const testIsInBounds: (x: number, y: number, left: number, bottom: number, right: number, top: number, radius?: number) => boolean;
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
export declare const calcAnnotationBordersForAxisMarker: (isVerticalChart: boolean, x1: number, y1: number, horizontalAxis: AxisBase2D, verticalAxis: AxisBase2D, textureWidth: number, viewRect: Rect, xPosition: number, yPosition: number, textureHeight: number, annotationMarginXDirection: number, annotationMarginYDirection: number, isHorizontalAxisAlignmentReversed: boolean, isVerticalAxisAlignmentReversed: boolean) => {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};
export declare const testIsInXBounds: (xHitTestPoint: number, xDataPointCoord: number, maxDistance: number) => boolean;
/**
 * Tests if X is within radius from the [intervalStart, intervalEnd] interval,
 * intervalStart, intervalEnd values might not be sorted
 * @param x
 * @param intervalStart
 * @param intervalEnd
 * @param radius
 */
export declare const testIsInInterval: (x: number, intervalStart: number, intervalEnd: number, radius?: number) => boolean;
export declare const calcDotProduct: (v1x: number, v1y: number, v2x: number, v2y: number, v3x: number, v3y: number) => number;
export declare const calcDistanceFromLineSegment: (x: number, y: number, startX: number, startY: number, endX: number, endY: number) => number;
