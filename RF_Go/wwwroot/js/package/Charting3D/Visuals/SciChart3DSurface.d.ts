import { IChartModifierBase } from "../../Charting/ChartModifiers/ChartModifierBase";
import { IThemeProvider } from "../../Charting/Themes/IThemeProvider";
import { ESurfaceType, SciChartSurfaceBase, TSciChartConfig } from "../../Charting/Visuals/SciChartSurfaceBase";
import { TDpiChangedEventArgs } from "../../Charting/Visuals/TextureManager/DpiHelper";
import { IGenericAnimation } from "../../Core/Animations/GenericAnimation";
import { ObservableArray } from "../../Core/ObservableArray";
import { Point } from "../../Core/Point";
import { SCRTSceneWorld, TSciChart3D as TWasmContext } from "../../types/TSciChart3D";
import { TSciChartSurfaceCanvases } from "../../types/TSciChartSurfaceCanvases";
import { ICameraController } from "../CameraController";
import { I3DSurfaceOptions } from "../I3DSurfaceOptions";
import { Vector3 } from "../Vector3";
import { AxisBase3D } from "./Axis/AxisBase3D";
import { AxisCubeEntity } from "./Axis/AxisCubeEntity";
import { IRenderableSeries3D } from "./RenderableSeries/BaseRenderableSeries3D";
import { RootSceneEntity } from "./RootSceneEntity";
import { ViewportManager3DBase } from "./ViewportManager3DBase";
import { EWatermarkPosition } from "../../types/WatermarkPosition";
import { EventHandler } from "../../Core/EventHandler";
import { Thickness } from "../../Core/Thickness";
export declare type TSciChart3D = TWasmContext;
export declare type TWebAssemblyChart3D = {
    wasmContext: TSciChart3D;
    sciChart3DSurface: SciChart3DSurface;
};
export declare const sciChartConfig3D: TSciChartConfig;
/**
 * Optional parameters passed to the constructor of {@link SciChart3DSurface} to configure it
 */
export interface ISciChart3DSurfaceOptions {
    canvases?: TSciChartSurfaceCanvases;
    /**
     * The {@link ICameraController} is a 3D Camera which allows choosing perspective, orthogonal projections,
     * camera position, target, orientation such as Pitch, Yaw and Roll etc...
     * @remarks See {@link CameraController} for a concrete implementation of {@link ICameraController}
     */
    camera?: ICameraController;
    /**
     * The WorldDimensions defines the size of the world in 3D space. Series and objects can exist outside of this world
     * however the Axis cube will conform to this size.
     * @remarks See our {@link https://www.scichart.com/javascript-chart-documentation | Documentation} online to see
     * how the World Dimensions property configures the size of the chart.
     */
    worldDimensions?: Vector3;
}
/**
 * @summary The {@link SciChart3DSurface} is the root 3D Chart control in SciChart's High Performance Real-time
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript 3D Chart Library}
 * @description
 * To create a 3D chart using SciChart, declare a {@link SciChart3DSurface} using {@link SciChart3DSurface.create},
 * add X,Y,Z axis via the {@link SciChart3DSurface.xAxis} {@link SciChart3DSurface.yAxis} and {@link SciChart3DSurface.zAxis} properties.
 *
 * Next, add a series or chart type by adding a {@link BaseRenderableSeries3D} to the {@link SciChart3DSurface.renderableSeries} collection.
 *
 * Position the camera in the 3D scene by adjusting the {@link SciChart3DSurface.camera} property.
 *
 * To redraw a {@link SciChart3DSurface} at any time, call {@link SciChart3DSurface.invalidateElement}, however all properties are reactive and the
 * chart will automatically redraw if data or properties change.
 * @remarks
 * {@link SciChart3DSurface | SciChartSurfaces} scale to fit the parent DIV where they are hosted. Use CSS to position the DIV.
 */
export declare class SciChart3DSurface extends SciChartSurfaceBase {
    /**
     * USED INTERNALLY - performs a similar operation to {@link SciChart3DSurface.create} but used internally for testing
     * @param divElement The Div Element ID or reference where the {@link SciChartSurface} will reside
     * @param options Optional parameters of type {@link I3DSurfaceOptions}
     */
    static createSingle(divElement: string | HTMLDivElement, options?: I3DSurfaceOptions): Promise<TWebAssemblyChart3D>;
    /**
     * Allows setting of web URL for Wasm and Data files, in the case you are loading SciChart outside of npm/webpack environment.
     * Note if loading from CDN the version number of data/wasm Urls must match the version number of SciChart.js you are using.
     * @example
     * ```ts
     * // 3D Charts
     * SciChart.SciChart3DSurface.configure({
     *  dataUrl: "https://cdn.jsdelivr.net/npm/scichart@2.2.2378/_wasm/scichart3d.data",
     *  wasmUrl: "https://cdn.jsdelivr.net/npm/scichart@2.2.2378/_wasm/scichart3d.wasm"
     * });
     * ```
     * @param config
     */
    static configure(config: TSciChartConfig): void;
    /**
     * Tell SciChart to load the Wasm and Data files from CDN, rather than expecting them to be served by the host server.
     * @deprecated the method name breaks [eslint react-hooks/rules-of-hooks](https://legacy.reactjs.org/docs/hooks-rules.html).
     * To avoid this error in React, use {@link loadWasmFromCDN} instead.
     */
    static useWasmFromCDN(): void;
    /**
     * Tell SciChart to load the Wasm and Data files from CDN, rather than expecting them to be served by the host server.
     */
    static loadWasmFromCDN(): void;
    /**
     * Tell SciChart to load the Wasm and Data files from the local server, rather than from CDN.
     */
    static loadWasmLocal(): void;
    /**
     * Creates a {@link SciChart3DSurface} and {@link TSciChart3D | WebAssembly Context} to occupy the div by element ID in your DOM.
     * @remarks This method is async and must be awaited
     * @param divElementId The ID or reference of Div Element where the {@link SciChart3DSurface} will reside
     * @param options Optional parameters of type {@link I3DSurfaceOptions}
     */
    static create(divElementId: string | HTMLDivElement, options?: I3DSurfaceOptions): Promise<TWebAssemblyChart3D>;
    static disposeSharedWasmContext(): void;
    /**
     * @summary Gets the collection of {@link IRenderableSeries3D} - the chart types or seres on this {@link SciChart3DSurface}
     * @description A {@link SciChart3DSurface} can have zero to many {@link IRenderableSeries3D | RenderableSeries}.
     *
     * The RenderableSeries are drawn as chart types, e.g. {@link ScatterRenderableSeries3D | 3D Scatter series},
     * {@link SurfaceMeshRenderableSeries3D | Surface Mesh series}. Each RenderableSeries
     * must have a {@link BaseDataSeries3D | DataSeries}.
     *
     * Use this collection to add and remove series to the chart.
     * @remarks
     * Adding a series to the chart causes it to automatically redraw. To zoom to fit the data after adding a series, either set
     * {@link AxisCore.autoRange} or call {@link SciChart3DSurface.zoomExtents}
     */
    readonly renderableSeries: ObservableArray<IRenderableSeries3D>;
    /**
     * @summary The {@link RootSceneEntity} is a special {@link BaseSceneEntity3D} type which is the root of the entire scene in
     * in SciChart's High Performance {@link https://www.scichart.com/javascript-chart-features | JavaScript 3D Charts}
     * @remarks
     * Add and remove entities to the scene using the property {@link SciChart3DSurface.rootEntity} and calling
     * {@link RootSceneEntity.children | SceneEntity.children.add}.
     *
     * When a {@link BaseRenderableSeries3D} is added to {@link SciChart3DSurface.renderableSeries}, it's entity is automatically added to the scene.
     */
    rootEntity: RootSceneEntity;
    /**
     * The {@link AxisCubeEntity} is a 3D Scene Entity (inherits {@link BaseSceneEntity3D}) which renders the 3D X,Y,Z axis cube,
     * axis walls and labels in a {@link SciChart3DSurface}
     */
    readonly axisCubeEntity: AxisCubeEntity;
    /**
     * The {@link TSciChart3D | SciChart 3D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     */
    readonly webAssemblyContext3D: TSciChart3D;
    /** The position of the watermark for trials and community licenses */
    watermarkPosition: EWatermarkPosition;
    /**
     * An event handler which notifies its subscribers when a render operation starts. Use this
     * to update elements of the chart for the current render.  Any updates made here will not trigger a subsequent render.
     */
    preRender: EventHandler<void>;
    /** Whether to show errors that occur during the render process.  Defaults true. */
    showErrors: boolean;
    protected animationList: IGenericAnimation[];
    private xAxisProperty;
    private yAxisProperty;
    private zAxisProperty;
    private cameraProperty;
    private worldDimensionsProperty;
    private viewportManagerProperty;
    private readonly sciChart3DRenderer;
    private readonly gizmoEntity;
    private watermarkProperties;
    private watermarkPropertyPosition;
    private isAxisCubeRenderedProperty;
    private sceneWorldProperty;
    private isHitTestEnabledProperty;
    private isZXPlaneVisibleProperty;
    private isXYPlaneVisibleProperty;
    private isZYPlaneVisibleProperty;
    /**
     * Creates an instance of {@link SciChart3DSurface}
     * @param webAssemblyContext The {@link TSciChart3D | SciChart 3D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param options Optional parameters of type {@link ISciChart3DSurfaceOptions} to configure the chart
     */
    constructor(webAssemblyContext: TSciChart3D, options?: ISciChart3DSurfaceOptions);
    /**
     * Used internally: Gets the {@link SCRTSceneWorld} object at the root of the 3d scene graph
     */
    getSceneWorld(): SCRTSceneWorld;
    /**
     * Converts a 3D Xyz coordinate in world coordinates space to a screen coordinate (2d) in pixels.
     * This allows you to get the 2D screen coordinate of any object or vertex in the 3D scene.
     * @remarks Note: Conversions to/from world/data space must be performed using the {@link AxisBase3D.getCurrentCoordinateCalculator()}
     * API, which returns {@link CoordinateCalculatorBase}. Functions {@link CoordinateCalculatorBase.getDataValue} and
     * {@link CoordinateCalculatorBase.getCoordinate} convert to/from world coords/data space
     * @param worldCoordXyz The 3D Xyz coordinate
     * @returns The 2D screen coordinate in pixels
     */
    worldToScreenCoord(worldCoordXyz: Vector3): Point;
    /**
     * @inheritdoc
     */
    delete(clearHtml?: boolean): void;
    /**
     * Gets or sets whether the Xyz gizmo is enabled - a small 3D Xyz axis on the bottom left of the 3D Chart
     */
    get enableGizmo(): boolean;
    /**
     * Gets or sets whether the Xyz gizmo is enabled - a small 3D Xyz axis on the bottom left of the 3D Chart
     */
    set enableGizmo(isEnabled: boolean);
    /**
     * Gets or sets the {@link ViewportManager3DBase | Viewport Manager} - a class that allows managing of viewport axis ranges
     */
    get viewportManager(): ViewportManager3DBase;
    /**
     * Gets or sets the {@link ViewportManager3DBase | Viewport Manager} - a class that allows managing of viewport axis ranges
     */
    set viewportManager(viewportManager: ViewportManager3DBase);
    /**
     * The WorldDimensions defines the size of the world in 3D space. Series and objects can exist outside of this world
     * however the Axis cube will conform to this size.
     * @remarks See our {@link https://www.scichart.com/javascript-chart-documentation | Documentation} online to see
     * how the World Dimensions property configures the size of the chart.
     */
    get worldDimensions(): Vector3;
    /**
     * The WorldDimensions defines the size of the world in 3D space. Series and objects can exist outside of this world
     * however the Axis cube will conform to this size.
     * @remarks See our {@link https://www.scichart.com/javascript-chart-documentation | Documentation} online to see
     * how the World Dimensions property configures the size of the chart.
     */
    set worldDimensions(worldDimensions: Vector3);
    /**
     * Gets / sets visibility of the ZX axis plane
     */
    get isZXPlaneVisible(): boolean;
    set isZXPlaneVisible(value: boolean);
    /**
     * Gets / sets visibility of the XY axis plane
     */
    get isXYPlaneVisible(): boolean;
    set isXYPlaneVisible(value: boolean);
    /**
     * Gets / sets visibility of the ZY axis plane
     */
    get isZYPlaneVisible(): boolean;
    set isZYPlaneVisible(value: boolean);
    /**
     * The {@link ICameraController} is a 3D Camera which allows choosing perspective, orthogonal projections,
     * camera position, target, orientation such as Pitch, Yaw and Roll etc...
     * @remarks See {@link CameraController} for a concrete implementation of {@link ICameraController}
     */
    get camera(): ICameraController;
    /**
     * The {@link ICameraController} is a 3D Camera which allows choosing perspective, orthogonal projections,
     * camera position, target, orientation such as Pitch, Yaw and Roll etc...
     * @remarks See {@link CameraController} for a concrete implementation of {@link ICameraController}
     */
    set camera(value: ICameraController);
    /**
     * Gets or sets the XAxis in the 3D Chart.
     * @remarks Axis types which derive from {@link AxisBase3D} or concrete type {@link NumericAxis3D} are valid
     */
    get xAxis(): AxisBase3D;
    /**
     * Gets or sets the XAxis in the 3D Chart.
     * @remarks Axis types which derive from {@link AxisBase3D} or concrete type {@link NumericAxis3D} are valid
     */
    set xAxis(xAxis: AxisBase3D);
    /**
     * Gets or sets the YAxis in the 3D Chart.
     * @remarks Axis types which derive from {@link AxisBase3D} or concrete type {@link NumericAxis3D} are valid
     */
    get yAxis(): AxisBase3D;
    /**
     * Gets or sets the YAxis in the 3D Chart.
     * @remarks Axis types which derive from {@link AxisBase3D} or concrete type {@link NumericAxis3D} are valid
     */
    set yAxis(yAxis: AxisBase3D);
    /**
     * Gets or sets the ZAxis in the 3D Chart.
     * @remarks Axis types which derive from {@link AxisBase3D} or concrete type {@link NumericAxis3D} are valid
     */
    get zAxis(): AxisBase3D;
    /**
     * Gets or sets the ZAxis in the 3D Chart.
     * @remarks Axis types which derive from {@link AxisBase3D} or concrete type {@link NumericAxis3D} are valid
     */
    set zAxis(zAxis: AxisBase3D);
    /**
     * Required to enable Hit-Test if any of the following functions are needed in SciChart3DSurface:
     *  - {@link BaseRenderableSeries3D.hitTest}
     *  - {@link TooltipModiifer3D}
     *
     *  Enabling hit-test adds minor a performance overhead for drawing and should be disabled if not required.
     * @param isEnabled
     */
    set isHitTestEnabled(isEnabled: boolean);
    /**
     * Required to enable Hit-Test if any of the following functions are needed in SciChart3DSurface:
     *  - {@link BaseRenderableSeries3D.hitTest}
     *  - {@link TooltipModiifer3D}
     *
     *  Enabling hit-test adds minor a performance overhead for drawing and should be disabled if not required.
     * @param isEnabled
     */
    get isHitTestEnabled(): boolean;
    /**
     * Called internally
     * Sets isAxisCubeRenderedProperty flag after Axis Cube is rendered
     */
    setIsAxisCubeRendered(): void;
    /**
     * Called internally
     * Gets isAxisCubeRenderedProperty flag
     */
    get isAxisCubeRendered(): boolean;
    /**
     * @inheritDoc
     */
    invalidateElement(options?: {
        force?: boolean;
    }): void;
    /**
     * @inheritDoc
     */
    onDpiChanged(args: TDpiChangedEventArgs): void;
    /**
     * @inheritDoc
     */
    get surfaceType(): ESurfaceType;
    get isInvalidated(): boolean;
    /**
     * Called after the {@link SciChart3DSurface} has rendered.
     */
    onSciChartRendered(): void;
    /**
     * Called internally - the main drawing loop
     */
    doDrawingLoop(): void;
    /**
     * @inheritDoc
     */
    applyTheme(themeProvider: IThemeProvider): void;
    /**
     * @inheritDoc
     */
    changeViewportSize(pixelWidth: number, pixelHeight: number): void;
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
     * Is being called on each render, to run animations
     * @param timeElapsed
     */
    onAnimate(timeElapsed: number): void;
    /**
     * @inheritDoc
     */
    getXAxisById(axisId: string): AxisBase3D;
    /**
     * @inheritDoc
     */
    getYAxisById(axisId: string): AxisBase3D;
    /**
     * @inheritDoc
     */
    updateWatermark(left: number, bottom: number): void;
    getSeriesViewRectPadding(scaled: boolean): Thickness;
    /**
     *
     * @param fontName Register a font to be used with native text.
     * @param url
     * @returns
     */
    registerFont(fontName: string, url: string): Promise<boolean>;
    protected applyOptions(options: I3DSurfaceOptions): void;
    /**
     * @inheritDoc
     */
    protected attachChartModifier(chartModifier: IChartModifierBase): void;
    /**
     * @inheritDoc
     */
    protected applySciChartBackground(background: string, alphaEnabled?: boolean): void;
    private detachSeries;
    private attachSeries;
    private detachAxis;
    private attachAxis;
    private childPropertyChanged;
}
