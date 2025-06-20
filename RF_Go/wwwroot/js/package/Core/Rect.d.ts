import { Point } from "./Point";
/**
 * Class to represent a rectangle in 2D space
 */
export declare class Rect {
    /**
     * Creates a rectangle with X,Y top left coordinate and width and height
     * @param x
     * @param y
     * @param width
     * @param height
     */
    static create(x: number, y: number, width: number, height: number): Rect;
    /**
     * Creates a rectangle with left, top ,right, bottom
     * @param left
     * @param top
     * @param right
     * @param bottom
     */
    static createWithCoords(left: number, top: number, right: number, bottom: number): Rect;
    /**
     * Create a rectangle with two points which could be top-left, bottom-right
     * @param point1
     * @param point2
     */
    static createWithPoints(point1: Point, point2: Point): Rect;
    /**
     * Clones a rect
     * @param rect
     */
    static createCopy(rect: Rect): Rect;
    /**
     * Creates a zero rect with x,y,w,h = 0
     */
    static createZero(): Rect;
    /**
     * Returns true if a rect numerically equals another rect
     * @param rect1
     * @param rect2
     */
    static isEqual(rect1: Rect, rect2: Rect): boolean;
    /**
     * Clips a point to the rect, so if the point is outside the rect it will be on the boundary of the rect after this operation
     * @param rect The rect
     * @param point The point to clip
     */
    static clipPointToRect(point: Point, rect: Rect): Point;
    /**
     * Gets or sets the top left X coordinate
     */
    readonly x: number;
    /**
     * Gets or sets the top left Y coordinate
     */
    readonly y: number;
    /**
     * Gets or sets the width
     */
    readonly width: number;
    /**
     * Gets or sets the height
     */
    readonly height: number;
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
    constructor(x: number, y: number, width: number, height: number);
    /**
     * Gets the left edge of the rect
     */
    get left(): number;
    /**
     * Gets the top edge of the rect
     */
    get top(): number;
    /**
     * Gets the right edge of the rect
     */
    get right(): number;
    /**
     * Gets the bottom edge of the rect
     */
    get bottom(): number;
    /**
     * Turns a { x, y, width, height } object into a {@link NumberRange}, most helpful for JSON deserialization
     */
    static hydrate(input: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): Rect;
}
