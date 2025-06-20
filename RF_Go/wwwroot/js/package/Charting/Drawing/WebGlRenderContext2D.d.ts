import { ICacheable } from "../../Core/ICacheable";
import { Rect } from "../../Core/Rect";
import { EDefaultRenderLayer } from "../../types/DefaultRenderLayer";
import { Size } from "../../types/Size";
import { SCRTBrush, SCRTPen, SCRTRenderContext, TSciChart, VectorColorVertex, VectorRectVertex } from "../../types/TSciChart";
import { TTextStyle } from "../Visuals/Axis/AxisCore";
import { ShaderEffect } from "../Visuals/RenderableSeries/ShaderEffect";
import { IBrush2D } from "./IBrush2D";
import { IPen2D } from "./IPen2D";
import { IRenderContext2D } from "./IRenderContext2D";
import { WebGlBrush } from "./WebGlBrush";
import { DeletableEntity } from "../../Core/DeletableEntity";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "../../types/AnchorPoint";
import { Thickness } from "../../Core/Thickness";
declare type TDrawFunction = () => void;
/**
 *
 * @param step specifies the capacity of layers that could be potentially added between the default chart layers
 * @param offset layer z-order offset of the surface
 * @param relativeRenderLayer layer number relative to the specific surface layers
 * @returns absolute order of the layer on the chart (considering parent chart and previous subChart surface layers)
 */
export declare const calculateAbsoluteRenderLayer: (offset: number, step: number, relativeRenderLayer: EDefaultRenderLayer) => number;
/**
 * Defines enumeration constants for Line Drawing modes
 */
export declare enum ELineDrawMode {
    /**
     * Points provided define a poly-line (continuous line)
     */
    PolyLine = 0,
    /**
     * Points provided define discontinuous lines, e.g. x1y1 x2y2  is one line, x3y3 x4y4 is the next
     */
    DiscontinuousLine = 1
}
/**
 * The WebGlRenderContext2D provides methods for drawing to a WebGL2 / WebAssembly canvas powered by SciChart's Visual Xccelerator engine.
 * This context class is used in SciChart's High Performance Realtime {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}
 * to draw shapes, lines, fills, images and more
 */
export declare class WebGlRenderContext2D extends DeletableEntity implements IRenderContext2D {
    /**
     * Should store references to all cached WebGlResources {@link ICacheable}
     * Is used to invalidate the resources when the WebGL context is lost.
     */
    static readonly webGlResourcesRefs: Set<ICacheable>;
    /**
     * Gets the current viewport {@link Size}
     */
    readonly viewportSize: Size;
    /** The id of the canvas of the calling surface. Used to allow this to call a redraw */
    readonly canvasId: string;
    private readonly layers;
    private readonly webAssemblyContext;
    private readonly effects;
    private nativeContext;
    /**
     * Creates an instance of the WebGlRenderContext2D
     * @param webAssemblyContext The {@link TSciChart | SciChart WebAssembly Context} containing native methods and access to our WebGL2 Engine
     * @param viewportSize The Viewport {@link Size}
     */
    constructor(webAssemblyContext: TSciChart, viewportSize: Size, canvasId: string);
    /**
     * Get the native {@link SCRTRenderContext} for direct access to SciChart's WebAssembly Visual Xccelerator engine
     */
    getNativeContext(): SCRTRenderContext;
    /**
     * Draw lines: grid lines, etc.
     * @param vertices
     * @param pen
     * @param lineDrawMode
     * @param left - offset in pixels from left, typically used for axes
     * @param top - offset in pixels from top, typically used for axes
     */
    drawLinesNative(vertices: VectorColorVertex, pen: SCRTPen, lineDrawMode: ELineDrawMode, left?: number, top?: number): void;
    /**
     * Draw rectangles: grid bands, etc.
     * @param vertices
     * @param brush
     * @param left - offset in pixels from left, typically used for axes
     * @param top - offset in pixels from top, typically used for axes
     */
    drawRects(vertices: VectorRectVertex, brush: SCRTBrush, left?: number, top?: number): void;
    /**
     * Enqueues a draw operation to the specified layer. Use in combination with {@link drawLayers} to flush layered draws
     * @param drawFunction the {@link TDrawFunction | Draw Function} to enqueue
     * @param layer the {@link ERenderLayer | Layer} to draw to
     */
    enqueueLayeredDraw(drawFunction: TDrawFunction, layer?: number): void;
    /**
     * Flushes the {@link layers} which have been enqueued with drawing operations in order.
     * Use this in combination with {@link enqueueLayeredDraw} to draw in layers
     */
    drawLayers(): void;
    /**
     * Applies a {@link ShaderEffect} to the rendering pipeline. Calling {@link WebGL2RenderingContext.popShaderEffect} pops the effect from the stack
     * reverting to normal drawing
     * @param effect the {@link ShaderEffect} to apply to subsequent draw operations
     */
    pushShaderEffect(effect: ShaderEffect): void;
    /**
     * Pops a {@link ShaderEffect} from the rendering pipeline. Call {@link WebGL2RenderingContext.pushShaderEffect} to apply an effect
     */
    popShaderEffect(): void;
    /**
     * @inheritDoc
     */
    createPen(stroke: string, strokeThickness: number, strokeDashArray?: number[], antiAliased?: boolean): IPen2D;
    /**
     * @inheritDoc
     */
    createSolidBrush(fill: string, opacity?: number): IBrush2D;
    /**
     * @inheritDoc
     */
    delete(): void;
    /**
     * @inheritDoc
     */
    drawLine(x1: number, y1: number, x2: number, y2: number, pen: IPen2D, viewRect: Rect): void;
    /**
     * @inheritDoc
     */
    drawLines(xyValues: number[], strokePen: IPen2D, viewRect: Rect, lineDrawMode?: ELineDrawMode): void;
    /**
     * @inheritDoc
     */
    drawRect(rect: Rect, viewRect: Rect, strokePen?: IPen2D, fillBrush?: IBrush2D): void;
    private drawTextBackground;
    drawNativeText(rotationRadians: number, xCoord: number, yCoord: number, seriesViewRect: Rect, chartViewRect: Rect, fontFamily: string, fontSize: number, textColor: string, textColorOpacity: number, backgroundFillBrush: WebGlBrush | undefined, verticalAnchorPoint: EVerticalAnchorPoint, horizontalAnchorPoint: EHorizontalAnchorPoint, text: string, padding: Thickness, drawImmediately?: boolean, scale?: number): void;
    printBlendMode(): void;
    /**
     * Get a native font.  Fonts are cached and shared within webassembly so there is no need to cache them in JS.
     * Set advanced: true if you are planning to rotate or scale the text.
     * Set drawEarly: true if you are planning to call font.End() early.  Otherwise all native text will be drawn at the end of the render cycle.
     */
    getFont(labelStyle: TTextStyle, advanced?: boolean, drawEarly?: boolean): import("../../types/TSciChart").SCRTFont;
    /** End all fonts, causing text to be drawn */
    endFonts(force?: boolean): void;
}
export {};
