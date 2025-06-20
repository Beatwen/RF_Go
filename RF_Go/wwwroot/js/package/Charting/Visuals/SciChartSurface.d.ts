import { ISciChart2DDefinition, ISubChartDefinition } from "../../Builder/buildSurface";
import { TEasingFn } from "../../Core/Animations/EasingFunctions";
import { IGenericAnimation } from "../../Core/Animations/GenericAnimation";
import { EventHandler } from "../../Core/EventHandler";
import { ObservableArray } from "../../Core/ObservableArray";
import { Rect } from "../../Core/Rect";
import { Thickness } from "../../Core/Thickness";
import { EAutoColorMode } from "../../types/AutoColorMode";
import { Size } from "../../types/Size";
import { ESvgClippingMode } from "../../types/SvgClippingMode";
import { TBorder } from "../../types/TBorder";
import { TSciChart as TWasmContext } from "../../types/TSciChart";
import { TSciChartSurfaceCanvases } from "../../types/TSciChartSurfaceCanvases";
import { EZoomState } from "../../types/ZoomState";
import { IChartModifierBase } from "../ChartModifiers/ChartModifierBase";
import { RenderSurface } from "../Drawing/RenderSurface";
import { WebGlRenderContext2D } from "../Drawing/WebGlRenderContext2D";
import { LayoutManager } from "../LayoutManager/LayoutManager";
import { SciChartRenderer } from "../Services/SciChartRenderer";
import { IThemeProvider } from "../Themes/IThemeProvider";
import { ECoordinateMode } from "./Annotations/AnnotationBase";
import { AxisBase2D } from "./Axis/AxisBase2D";
import { I2DSubSurfaceOptions, I2DSurfaceOptions } from "./I2DSurfaceOptions";
import { IDataLabelLayoutManager } from "./RenderableSeries/DataLabels/DataLabelLayoutManager";
import { IRenderableSeries } from "./RenderableSeries/IRenderableSeries";
import { ESurfaceType, SciChartSurfaceBase, TSciChartConfig } from "./SciChartSurfaceBase";
import { TDpiChangedEventArgs } from "./TextureManager/DpiHelper";
import { Point } from "../../Core/Point";
import { EWatermarkPosition } from "../../types/WatermarkPosition";
import { TChartTitleStyle } from "../../types/TextStyle";
import { IChartTitleRenderer } from "../Services/TitleRenderer";
export declare type TSciChart = TWasmContext;
export declare type TWebAssemblyChart = {
    wasmContext: TSciChart;
    sciChartSurface: SciChartSurface;
};
export interface ISciChartSurfaceOptions {
    canvases?: TSciChartSurfaceCanvases;
    masterCanvas?: HTMLCanvasElement;
}
export declare const sciChartConfig: TSciChartConfig;
/**
 * @summary The {@link SciChartSurface} is the root 2D Chart control in SciChart's High Performance Real-time
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript Chart Library}
 * @description
 * To create a chart using SciChart, declare a {@link SciChartSurface} using {@link SciChartSurface.create},
 * add X and Y axes to the {@link SciChartSurface.xAxes} {@link SciChartSurface.yAxes} collection.
 *
 * Next, add a series or chart type by adding a {@link BaseRenderableSeries} to the {@link SciChartSurface.renderableSeries} collection.
 *
 * You can add annotations and markers using the {@link SciChartSurface.annotations} property, and you can add zoom and pan behaviours,
 * tooltips and more by using the {@link SciChartSurface.chartModifiers} property.
 *
 * To redraw a {@link SciChartSurface} at any time, call {@link SciChartSurface.invalidateElement}, however all properties are reactive and the
 * chart will automatically redraw if data or properties change.
 * @remarks
 * It is possible to have more than one {@link SciChartSurface} on screen at the same time.
 * {@link SciChartSurface | SciChartSurfaces} scale to fit the parent DIV where they are hosted. Use CSS to position the DIV.
 */
export declare class SciChartSurface extends SciChartSurfaceBase {
    /**
     * Creates a {@link SciChartSurface} and {@link TSciChart | WebAssembly Context} to occupy the div by element ID in your DOM.
     * @remarks This method is async and must be awaited
     * @param divElement The Div Element ID or reference where the {@link SciChartSurface} will reside
     * @param options Optional - Optional parameters for chart creation. See {@link I2DSurfaceOptions} for more details
     */
    static create(divElement: string | HTMLDivElement, options?: I2DSurfaceOptions): Promise<TWebAssemblyChart>;
    static disposeSharedWasmContext(): void;
    /**
     * Performs a similar operation to {@link SciChartSurface.create} but uses a dedicated WebAssembly context for this chart, and draws directly to the target canvas
     * This provides better performance for a single chart, but there is a limit (16) to how many you can have on one page.
     * If you need large numbers of charts all updating at the same time, use this, together with {@link addSubChart} to create many charts on one surface.
     * @param divElement The Div Element ID or reference where the {@link SciChartSurface} will reside
     * @param options - optional parameters for chart creation. See {@link I2DSurfaceOptions} for more details
     */
    static createSingle(divElement: string | HTMLDivElement, options?: I2DSurfaceOptions): Promise<TWebAssemblyChart>;
    /**
     * Allows setting of web URL for Wasm and Data files, in the case you are loading SciChart outside of npm/webpack environment.
     * Note the version number of data/wasm Urls must match the version number of SciChart.js you are using.
     * To use the default CDN, just call SciChart.SciChartSurface.useWasmFromCDN();
     * @example
     * ```ts
     * import { libraryVersion } from "scichart/Core/BuildStamp";
     *
     * SciChart.SciChartSurface.configure({
     *  dataUrl: `https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart2d.data`,
     *  wasmUrl: `https://cdn.jsdelivr.net/npm/scichart@${libraryVersion}/_wasm/scichart2d.wasm`
     * });
     * ```
     * @param config
     */
    static configure(config: TSciChartConfig): void;
    /**
     * Tell SciChart to load the Wasm and Data files from CDN, rather than expecting them to be served by the host server.
     * @deprecated the method name breaks [eslint react-hooks/rules-of-hooks](https://legacy.reactjs.org/docs/hooks-rules.html).
     * To avoid this error in React, use {@link loadWasmFromCDN} instead.
     *
     */
    static useWasmFromCDN(): void;
    /**
     * Tell SciChart to load the Wasm and Data files from the local server, rather than from CDN.
     * @deprecated the method name breaks [eslint react-hooks/rules-of-hooks](https://legacy.reactjs.org/docs/hooks-rules.html).
     * To avoid this error in React, use {@link loadWasmLocal} instead.
     *
     */
    static useWasmLocal(): void;
    /**
     * Tell SciChart to load the Wasm and Data files from CDN, rather than expecting them to be served by the host server.
     */
    static loadWasmFromCDN(): void;
    /**
     * Tell SciChart to load the Wasm and Data files from the local server, rather than from CDN.
     */
    static loadWasmLocal(): void;
    static isSubSurface(surface: SciChartSurface): surface is SciChartSubSurface;
    private static createTest;
    renderSurface: RenderSurface;
    /**
     * @summary Gets the collection of {@link IRenderableSeries} - the chart types or series on this {@link SciChartSurface}
     * @description A {@link SciChartSurface} can have zero to many {@link IRenderableSeries | RenderableSeries}.
     *
     * The RenderableSeries are drawn as chart types, e.g. {@link FastLineRenderableSeries | Line series},
     * {@link XyScatterRenderableSeries | Scatter series}. Each RenderableSeries
     * must have a {@link BaseDataSeries | DataSeries}.
     *
     * Use this collection to add and remove series to the chart.
     * @remarks
     * Adding a series to the chart causes it to automatically redraw. To zoom to fit the data after adding a series, either set
     * {@link AxisCore.autoRange} or call {@link SciChartSurface.zoomExtents}
     */
    readonly renderableSeries: ObservableArray<IRenderableSeries>;
    /**
     * @summary Gets the collection of {@link AxisBase2D} - the X Axis on a {@link SciChartSurface}
     * @description A {@link SciChartSurface} can have one to many {@link AxisBase2D | XAxes}.
     *
     * Axis may be positioned on the left, right, top or bottom of the chart by using {@link AxisBase2D.axisAlignment}.
     *
     * XAxis may be positioned on the top/bottom (default) or left/right in the case of a rotated or vertical chart.
     *
     * Series and annotations may be linked to an axis via the {@link AxisCore.id}, {@link BaseRenderableSeries.xAxisId} and
     * {@link AnnotationBase.xAxisId} property.
     * @remarks
     * Adding an Axis to the chart causes it to automatically redraw. Note that Axis by default do not zoom to fit data.
     * See the {@link AxisBase2D.autoRange} property for more information.
     */
    readonly xAxes: ObservableArray<AxisBase2D>;
    /**
     * @summary Gets the collection of {@link AxisBase2D} - the Y Axis on a {@link SciChartSurface}
     * @description A {@link SciChartSurface} can have one to many {@link AxisBase2D | YAxes}.
     *
     * Axis may be positioned on the left, right, top or bottom of the chart by using {@link AxisBase2D.axisAlignment}.
     *
     * YAxis may be positioned on the left/right (default) or bottom/top in the case of a rotated or vertical chart.
     *
     * Series and annotations may be linked to an axis via the {@link AxisCore.id}, {@link BaseRenderableSeries.yAxisId} and
     * {@link AnnotationBase.yAxisId} property.
     * @remarks
     * Adding an Axis to the chart causes it to automatically redraw. Note that Axis by default do not zoom to fit data.
     * See the {@link AxisBase2D.autoRange} property for more information.
     */
    readonly yAxes: ObservableArray<AxisBase2D>;
    /**
     * A ViewRect defining the bounds of the Annotation surface under the chart
     */
    annotationUnderlaySurfaceViewRect: Rect;
    /**
     * A ViewRect defining the bounds of the Annotation surface over the chart
     */
    annotationOverlaySurfaceViewRect: Rect;
    /**
     * A ViewRect defining the bounds of the Chart Modifier Surface (an area for placing tooltips and overlays during mouse interaction)
     */
    chartModifierSurfaceViewRect: Rect;
    /**
     * Used internally - the {@link RenderContext2D} for drawing
     */
    /**
     * An event handler which notifies its subscribers when a render operation starts. Use this
     * to update elements of the chart for the current render.  Any updates made here will not trigger a subsequent render.
     */
    preRender: EventHandler<WebGlRenderContext2D>;
    preRenderAll: EventHandler<WebGlRenderContext2D>;
    layersOffset: number;
    stepBetweenLayers: number;
    readonly isSubSurface: boolean;
    /**
     * Sets / Gets the clipping mode for SVG Annotations
     */
    svgClippingMode: ESvgClippingMode;
    /**
     * Normally, native labels are drawn all at once at the end of the render cycle to improve performance.
     * In circumstances where you want to draw over the labels, eg with a subchart, set this true to have them drawn earlier.
     */
    renderNativeAxisLabelsImmediately: boolean;
    /**
     * The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     */
    readonly webAssemblyContext2D: TSciChart;
    /** The position of the watermark for trials and community licenses */
    watermarkPosition: EWatermarkPosition;
    /** Set true to position the watermark relative to the overall canvas, rather than the series area.   */
    watermarkRelativeToCanvas: boolean;
    sciChartRenderer: SciChartRenderer;
    protected animationList: IGenericAnimation[];
    protected titleProperty: string | string[];
    protected titleStyleProperty: Readonly<Required<TChartTitleStyle>>;
    protected chartTitleRendererProperty: IChartTitleRenderer;
    private getPaddingProxy;
    protected paddingProperty: Thickness;
    protected currentWebGlRenderContextProperty: WebGlRenderContext2D;
    private layoutManagerProperty;
    private dataLabelLayoutManagerProperty;
    private zoomStateProperty;
    private watermarkProperties;
    private watermarkPropertyPosition;
    private debugRenderingProperty;
    private solidBrushCacheViewportBorder;
    private solidBrushCacheCanvasBorder;
    private viewportBorderProperty;
    private canvasBorderProperty;
    private subChartsProperty;
    private drawSeriesBehindAxisProperty;
    private autoColorModeProperty;
    private autoColorRequired;
    private xCoordSvgTrans;
    private yCoordSvgTrans;
    /**
     * Creates an instance of the {@link SciChartSurface}
     * @param webAssemblyContext The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param options optional parameters of type {@link ISciChartSurfaceOptions} used to configure the {@link SciChartSurface}
     */
    constructor(webAssemblyContext: TSciChart, options?: ISciChartSurfaceOptions);
    private subChartCounter;
    /**
     * Add another chart to an existing surface.
     * This is a performance optimization if you need to have multiple charts all updating together, eg because they have synced axes.
     * We suggest you use SciChartSurface.createSingle for the parent surface.  The parent surface does not have to have any chart elements defined.
     * The position property required in the options determines the placement and size of the subchart.  Its values are interpreted differently depending on the coordinateMode
     * Modifiers using modifierGroup will work across other subcharts on the surface, but not to any other surface.
     */
    addSubChart(options?: I2DSubSurfaceOptions): SciChartSubSurface;
    /**
     * Remove an existing subChart from a parent surface.  See {@link addSubChart}
     */
    removeSubChart(subChart: SciChartSubSurface): void;
    /**
     * The list of subCharts on this surface.  See {@link addSubChart}
     */
    get subCharts(): ReadonlyArray<SciChartSubSurface>;
    /**
     * @inheritDoc
     */
    get surfaceType(): ESurfaceType;
    /**
     * Gets or sets the {@link LayoutManager}
     */
    get layoutManager(): LayoutManager;
    /**
     * Used internally - gets or sets the {@link LayoutManager}
     */
    set layoutManager(value: LayoutManager);
    /**
     * Controls the rendering of {@link SiCharSurface.title}
     */
    get chartTitleRenderer(): IChartTitleRenderer;
    set chartTitleRenderer(value: IChartTitleRenderer);
    /**
     * Gets or sets the {@link ISeriesTextLayoutManager} for performing text layout across multiple series
     */
    get dataLabelLayoutManager(): IDataLabelLayoutManager;
    /**
     * Used internally - gets or sets the {@link ISeriesTextLayoutManager} for performing text layout across multiple series
     */
    set dataLabelLayoutManager(value: IDataLabelLayoutManager);
    /**
     * Gets or sets the title for the SciChartSurface
     */
    get title(): string | string[];
    /**
     * Gets or sets the title for the SciChartSurface
     */
    set title(value: string | string[]);
    /**
     * Gets or sets the title text style and placement for the SciChartSurface as {@link TChartTitleStyle}
     */
    get titleStyle(): TChartTitleStyle;
    /**
     * Gets or sets the title text style and placement for the SciChartSurface as {@link TChartTitleStyle}
     * @remarks if updating, should be set as an object (or partial object) of type {@link TChartTitleStyle},
     * instead of directly setting individual properties
     */
    set titleStyle(value: TChartTitleStyle);
    /**
     * Gets or sets the Padding between the SciChartSurface and its inner elements, in order top, right, bottom, left
     */
    get padding(): Thickness;
    set padding(padding: Thickness);
    /**
     * Gets the adjusted padding between the SciChartSurface and its inner elements, in order top, right, bottom, left
     * Defines a resulting padding accordingly to DPI scaling.
     */
    get adjustedPadding(): Thickness;
    /**
     * Gets or sets a property whether rendering should be debugged. This will draw rectangles around key boxes and areas on the chart.
     * Used internally for development purposes
     */
    get debugRendering(): boolean;
    /**
     * Gets or sets a property whether rendering should be debugged. This will draw rectangles around key boxes and areas on the chart.
     * Used internally for development purposes
     */
    set debugRendering(debugRendering: boolean);
    /**
     * Gets or sets the {@link EAutoColorMode} which determines when resolution of AUTO_COLOR should occur
     */
    get autoColorMode(): EAutoColorMode;
    /**
     * Gets or sets the {@link EAutoColorMode} which determines when resolution of AUTO_COLOR should occur
     */
    set autoColorMode(autoColorMode: EAutoColorMode);
    get isInvalidated(): boolean;
    /**
     * @inheritDoc
     */
    applyTheme(themeProvider: IThemeProvider): void;
    /**
     * @inheritDoc
     */
    changeViewportSize(pixelWidth: number, pixelHeight: number): void;
    /**
     * @inheritDoc
     */
    invalidateElement(options?: {
        force?: boolean;
    }): void;
    doDrawingLoop(context?: WebGlRenderContext2D): void;
    /**
     * @inheritDoc
     */
    delete(clearHtml?: boolean): void;
    /**
     * @inheritDoc
     */
    onDpiChanged(args: TDpiChangedEventArgs): void;
    /**
     * Gets the {@link AxisBase2D | XAxis} which matches the axisId. Returns undefined if not axis found
     * @param axisId The AxisId to search for
     */
    getXAxisById(axisId: string): AxisBase2D;
    /**
     * Gets the {@link AxisBase2D | YAxis} which matches the axisId. Returns undefined if not axis found
     * @param axisId The AxisId to search for
     */
    getYAxisById(axisId: string): AxisBase2D;
    /**
     * Update accumulated vectors for all stacked collections
     */
    updateStackedCollectionAccumulatedVectors(): void;
    /**
     * @summary Zooms the {@link SciChartSurface} in the X and Y direction to extents of all data (zoom to fit)
     * @description
     * @param animationDurationMs An optional animation duration. Default value is 0, which means 'no animation'
     * @param easingFunction An optional easing function for animations. See {@link TEasingFn} for a list of values
     * @param onCompleted the callback function
     */
    zoomExtents(animationDurationMs?: number, easingFunction?: TEasingFn, onCompleted?: () => void): void;
    /**
     * @summary Zooms the {@link SciChartSurface} in the X direction to extents of all data (zoom to fit)
     * @description
     * @param animationDurationMs An optional animation duration. Default value is 0, which means 'no animation'
     * @param easingFunction An optional easing function for animations. See {@link TEasingFn} for a list of values
     */
    zoomExtentsX(animationDurationMs?: number, easingFunction?: TEasingFn): void;
    /**
     * @summary Zooms the {@link SciChartSurface} in the Y direction to extents of all data (zoom to fit)
     * @description
     * @param animationDurationMs An optional animation duration. Default value is 0, which means 'no animation'
     * @param easingFunction An optional easing function for animations. See {@link TEasingFn} for a list of values
     */
    zoomExtentsY(animationDurationMs?: number, easingFunction?: TEasingFn): void;
    /**
     * @inheritDoc
     */
    updateWatermark(left: number, bottom: number): void;
    /**
     * Sets zoomStateProperty
     * @param zoomState
     */
    setZoomState(zoomState: EZoomState): void;
    /**
     * Gets zoomStateProperty
     */
    get zoomState(): EZoomState;
    /**
     * Gets or sets the SciChartSurface Viewport Border properties
     */
    get viewportBorder(): TBorder;
    /**
     * Gets or sets the SciChartSurface Viewport Border properties
     */
    set viewportBorder(value: TBorder);
    /**
     * Gets or sets the SciChartSurface Canvas Border properties
     */
    get canvasBorder(): TBorder;
    /**
     * Gets or sets the SciChartSurface Canvas Border properties
     */
    set canvasBorder(value: TBorder);
    /**
     * Used internally - draws SciChartSurface borders
     */
    drawBorder(renderContext: WebGlRenderContext2D): void;
    /**
     * Gets the SciChartSurface Viewport Left Border
     */
    get leftViewportBorder(): number;
    /**
     * Gets the SciChartSurface Viewport Right Border
     */
    get rightViewportBorder(): number;
    /**
     * Gets the SciChartSurface Viewport Top Border
     */
    get topViewportBorder(): number;
    /**
     * Gets the SciChartSurface Viewport Bottom Border
     */
    get bottomViewportBorder(): number;
    /**
     * Gets the SciChartSurface Canvas Left Border
     */
    get leftCanvasBorder(): number;
    /**
     * Gets the SciChartSurface Canvas Right Border
     */
    get rightCanvasBorder(): number;
    /**
     * Gets the SciChartSurface Canvas Top Border
     */
    get topCanvasBorder(): number;
    /**
     * Gets the SciChartSurface Canvas Bottom Border
     */
    get bottomCanvasBorder(): number;
    get currentWebGlRenderContext(): WebGlRenderContext2D;
    /**
     * Is being called on each render, to run animations
     * @param timeElapsed
     */
    onAnimate(timeElapsed: number): void;
    /**
     * Gets the generic animations currently on the surface. Do not manipulate this array directly.
     * To add, use addAnimation.  To remove, find an animation and call .cancel() on it.
     */
    getAnimations(): ReadonlyArray<IGenericAnimation>;
    /**
     * Add a {@link GenericAnimation} to the surface.
     * Multiple animations will be run in parallel, so if you want to run one after another, use the onCompleted callback
     * to add another animation after the first completes
     */
    addAnimation(...animations: IGenericAnimation[]): void;
    /**
     * Returns true if an animation is running
     */
    get isRunningAnimation(): boolean;
    /**
     * Returns the seriesViewRect padding relative to the canvas
     * @param scaled If True returns scaled values, if False divided by {@link DpiHelper.PIXEL_RATIO}
     * Use not scaled values for SVG annotations and the Legend
     */
    getSeriesViewRectPadding(scaled?: boolean): Thickness;
    /** Calls resolveAutoColors on each series to resolve colors marked as auto based on the seriesColorPalette */
    resolveAutoColors(maxSeries?: number): void;
    /**
     *
     * @param fontName Register a font to be used with native text.
     * @param url
     * @returns
     */
    registerFont(fontName: string, url: string): Promise<boolean>;
    /**
     * Used internally - sets SVG Canvas Translation
     * @param x
     * @param y
     */
    setCoordSvgTranslation(x: number, y: number): void;
    /**
     * Gets SVG Canvas Translation, used to draw on SVG Canvas using different {@link ESvgClippingMode}
     */
    getCoordSvgTranslation(): Point;
    /**
     * Convert the object to a definition that can be serialized to JSON, or used directly with the builder api
     * @param excludeData if set true, data values will not be included in the json.
     */
    toJSON(excludeData?: boolean): ISciChart2DDefinition;
    /**
     * Triggers the rerendering of the surface and after the chart rerendering is completed,
     * returns its serialized state retrieved with {@link SciChartSurface.toJSON}.
     *
     * @param excludeData - if set true, data values will not be included in the json.
     * @returns JSON-like object {@link ISciChart2DDefinition}
     */
    getNextState(excludeData?: boolean): Promise<ISciChart2DDefinition>;
    protected applyOptions(options: I2DSurfaceOptions): void;
    /**
     * @inheritDoc
     */
    protected detachChartModifier(chartModifier: IChartModifierBase): void;
    /**
     * @inheritDoc
     */
    protected attachChartModifier(chartModifier: IChartModifierBase): void;
    /**
     * @inheritDoc
     */
    protected applySciChartBackground(background: string, alphaEnabled?: boolean): void;
    /**
     * @inheritDoc
     */
    protected setClearAlphaParams(enabled: boolean, alpha: number): void;
    private zoomExtentsYInternal;
    private zoomExtentsXInternal;
    private onRenderSurfaceDraw;
    private detachSeries;
    private attachSeries;
    private detachAxis;
    private attachAxis;
    protected onAttachSubSurface(subSurface: SciChartSubSurface): void;
    protected onDetachSubSurface(subSurface: SciChartSubSurface): void;
    /**
     * Gets or sets the boolean flag for switching behaviour of Axises rendering
     */
    get drawSeriesBehindAxis(): boolean;
    /**
     * Gets or sets the boolean flag for switching behaviour of Axises rendering
     */
    set drawSeriesBehindAxis(value: boolean);
}
export interface ISciChartSubSurfaceOptions extends ISciChartSurfaceOptions {
    subSurfaceOptions: I2DSubSurfaceOptions;
    parentSurface: SciChartSurface;
}
export interface IOffsets {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
/**
 * @summary The {@link SciChartSubSurface} is the surface created within another surface
 * @description
 * It can be added using {@link SciChartSurface.addSubChart} method.
 *
 * To update the positioning of the {@link SciChartSubSurface}, use {@link SciChartSubSurface.subPosition};
 * also you can call {@link SciChartSubSurface.updateSubLayout} to refresh the layout of the sub-surface.
 * @remarks
 * It is not possible to have more than one level of nested sub-surfaces.
 */
export declare class SciChartSubSurface extends SciChartSurface {
    readonly isSubSurface: boolean;
    readonly subChartContainer: HTMLDivElement;
    topSectionClass: string;
    leftSectionClass: string;
    bottomSectionClass: string;
    rightSectionClass: string;
    protected backgroundProperty: string;
    protected isTransparentProperty: boolean;
    protected subPaddingProperty: Thickness;
    private subPositionProperty;
    private coordinateModeProperty;
    private parentXAxisIdProperty;
    private parentYAxisIdProperty;
    private subChartContainerId;
    private parentSurfaceProperty;
    private backgroundFillBrushCache;
    private isVisibleProperty;
    private sectionScaleProperty;
    /**
     * Creates an instance of the {@link SciChartSurface}
     * @param webAssemblyContext The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param options optional parameters of type {@link ISciChartSurfaceOptions} used to configure the {@link SciChart2DSurfaceBase}
     */
    constructor(webAssemblyContext: TSciChart, options?: ISciChartSubSurfaceOptions);
    /**
     * Whether other surfaces, including the parent, will be visible underneath this surface
     */
    get isTransparent(): boolean;
    /**
     * Whether other surfaces, including the parent, will be visible underneath this surface
     */
    set isTransparent(value: boolean);
    /**
     * Gets or sets additional absolute padding between the SciChartSubSurface and its parent, in order top, right, bottom, left
     * {@link subPosition} is applied first, then this padding is added.
     */
    get subChartPadding(): Thickness;
    /**
     * Gets or sets additional absolute padding between the SciChartSubSurface and its parent, in order top, right, bottom, left
     * {@link subPosition} is applied first, then this padding is added.
     */
    set subChartPadding(padding: Thickness);
    /**
     * Gets or sets the {@link ECoordinateMode} used when calculating the actual position based on the {@link subPosition}
     */
    get coordinateMode(): ECoordinateMode;
    /**
     * Gets or sets the {@link ECoordinateMode} used when calculating the actual position based on the {@link subPosition}
     */
    set coordinateMode(coordinateMode: ECoordinateMode);
    /**
     * Gets or sets the AxisId used to determing which X Axis should be used when calculating the actual position based on the {@link subPosition}
     * if {@link coordinateMode} is DataValue
     */
    get parentXAxisId(): string;
    /**
     * Gets or sets the AxisId used to determing which X Axis should be used when calculating the actual position based on the {@link subPosition}
     * if {@link coordinateMode} is DataValue
     */
    set parentXAxisId(id: string);
    /**
     * Gets or sets the AxisId used to determing which Y Axis should be used when calculating the actual position based on the {@link subPosition}
     * if {@link coordinateMode} is DataValue
     */
    get parentYAxisId(): string;
    /**
     * Gets or sets the AxisId used to determing which Y Axis should be used when calculating the actual position based on the {@link subPosition}
     * if {@link coordinateMode} is DataValue
     */
    set parentYAxisId(id: string);
    /**
     * A rectangle defining the position and size of a subchart.
     * If {@link coordinateMode} is Relative (the default) then the values give the size as a proportion of the parent div, and all properties must be between 0 and 1 inclusive.
     * If {@link coordinateMode} is DataValue, values will be converted to coordinates using {@link parentXAxisId} and {@link parentYAxisId}. Subchart will be clpped to the parent SeriesViewRect
     * Can only be set if this is a subChart.  See {@link addSubChart}
     */
    get subPosition(): Rect;
    /**
     * A rectangle defining the position and size of a subchart.
     * If {@link coordinateMode} is Relative (the default) then the values give the size as a proportion of the parent div, and all properties must be between 0 and 1 inclusive.
     * If {@link coordinateMode} is DataValue, values will be converted to coordinates using {@link parentXAxisId} and {@link parentYAxisId}. Subchart will be clpped to the parent SeriesViewRect
     * Can only be set if this is a subChart.  See {@link addSubChart}
     */
    set subPosition(value: Rect);
    /**
     * Gets or sets if the subchart is visible, allowing you to hide a subchart without removing it from the parent surface
     */
    get isVisible(): boolean;
    /**
     * Gets or sets if the subchart is visible, allowing you to hide a subchart without removing it from the parent surface
     */
    set isVisible(isVisible: boolean);
    /**
     * Gets or sets scale property for all sections
     * It is necessary if the scale transformation is being used for html areas around the subchart
     * For example, style = { width: "50%", transform: scale(2), transformOrigin: 'left top' }
     */
    get sectionScale(): number;
    set sectionScale(value: number);
    /** Recalculate the position of the subChart.  Call if you update the size of html elements in the wrapper */
    updateSubLayout(isDrawing?: boolean): void;
    /**
     * The parent SciChartSurface, if this is a subChart. See {@link addSubChart}
     */
    get parentSurface(): SciChartSurface;
    /**
     * @inheritDoc
     */
    get surfaceType(): ESurfaceType;
    /**
     * @inheritDoc
     */
    changeViewportSize(pixelWidth: number, pixelHeight: number): void;
    /**
     * Gets the sub-chart container
     */
    getSubChartContainer(): HTMLDivElement;
    getSubChartRect(): Rect;
    /**
     * @inheritDoc
     */
    delete(clearHtml?: boolean): void;
    toJSON(excludeData?: boolean): ISubChartDefinition;
    protected calcPadding(viewportSize: Size, position: Rect, offsets: IOffsets, isDrawing?: boolean): Thickness;
    /**
     * @inheritDoc
     */
    protected applySciChartBackground(background: string, alphaEnabled?: boolean): void;
    protected updateWrapper(subChartPosition: Rect): void;
    protected getOffsets(subChartContainer: HTMLDivElement): IOffsets;
}
