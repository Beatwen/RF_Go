import { DeletableEntity } from "../../Core/DeletableEntity";
import { EventHandler } from "../../Core/EventHandler";
import { IDeletable } from "../../Core/IDeletable";
import { MouseManager } from "../../Core/Mouse/MouseManager";
import { ObservableArray } from "../../Core/ObservableArray";
import { VisibilityObserver } from "../../Core/ObserveVisibility";
import { PropertyChangedEventArgs } from "../../Core/PropertyChangedEventArgs";
import { Rect } from "../../Core/Rect";
import { Thickness } from "../../Core/Thickness";
import { EThemeProviderType } from "../../types/ThemeProviderType";
import { TSciChart } from "../../types/TSciChart";
import { TSciChart3D } from "../../types/TSciChart3D";
import { TSciChartSurfaceCanvases } from "../../types/TSciChartSurfaceCanvases";
import { IChartModifierBase } from "../ChartModifiers/ChartModifierBase";
import { IThemeable } from "../Themes/IThemeable";
import { IThemePartial, IThemeProvider } from "../Themes/IThemeProvider";
import { AdornerLayer } from "./Annotations/AdornerLayer";
import { IAnnotation } from "./Annotations/IAnnotation";
import { AxisCore } from "./Axis/AxisCore";
import { ISciChartLoader } from "./loader";
import { INotifyOnDpiChanged, TDpiChangedEventArgs } from "./TextureManager/DpiHelper";
import { ISuspendable, IUpdateSuspender, UpdateSuspender } from "./UpdateSuspender";
export declare type TSciChartDestination = {
    canvasElementId: string;
    width: number;
    height: number;
    sciChartSurface: ISciChartSurfaceBase;
};
export declare type TSciChartConfig = {
    wasmUrl?: string;
    dataUrl?: string;
    /** Internal testing use only */
    testWasm?: TSciChart | TSciChart3D;
};
export interface ISurfaceOptionsBase {
    /**
     * Allows you to set custom Id for the surface;
     * @remarks If skipped the Id will be auto-generated
     */
    id?: string;
    /**
     * Optional - The theme applied to the {@link SciChartSurfaceBase} on startup
     * @remarks see {@link IThemeProvider} for properties which can affect SciChart theme. Two default
     * themes are included out of the box {@link SciChartJSLightTheme} and {@link SciChartJSDarkTheme}.
     * Custom themes may be created by implementing {@link IThemeProvider}
     */
    theme?: IThemeProvider | ({
        type: string | EThemeProviderType;
    } & IThemePartial);
    /**
     * Allows you to customize the loading elements or animation as part of the HTML page / DOM when a {@link SciChartSurface}
     * or {@link SciChart3DSurface} is loading WebAssembly.
     *
     * Set to false for disabling.
     */
    loader?: false | ISciChartLoader | {
        type: string;
        options?: any;
    };
    /**
     * Sets a `touch-action` property to the canvas style.
     * Useful if touch interactions in browser should be configured.
     * https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
     *
     * @remarks By default a chart will use `touch-action: none` to prevent the default browser behavior.
     */
    touchAction?: string;
    /**
     * Optional - the width aspect ratio of the {@link SciChartSurfaceBase}. By default SciChart will scale to fit the parent Div.
     * However if height of the div is not provided it will use width/height aspect ratio to calculate the height. The default ratio is 3/2.
     */
    widthAspect?: number;
    /**
     * Optional - the height aspect ratio of the {@link SciChartSurfaceBase}. By default SciChart will scale to fit the parent Div.
     * However if height of the div is not provided it will use width/height aspect ratio to calculate the height. The default ratio is 3/2.
     */
    heightAspect?: number;
    /**
     * Optional - the option of disabling / enabling scaling of the {@link SciChartSurfaceBase}.
     * If false - the {@link SciChartSurfaceBase} will take the height and width of parent div without scaling.
     */
    disableAspect?: boolean;
    /**
     * Optional - when true, charts that are out of the viewport will be frozen (pausing rendering). Data updates can resume
     * Once the chart is in view again, rendering will resume. This can be useful for performance optimization.
     */
    freezeWhenOutOfView?: boolean;
}
export declare const DebugForDpi: boolean;
/**
 * @summary Defines the interface to a 2D Cartesian {@link SciChartSurface} or 3D Cartesian  {@link SciChart3DSurface} within SciChart -
 * High Performance Realtime {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}
 * @remarks
 * See derived types {@link SciChartSurface} (2D Charts) and {@link SciChart3DSurface} (3D Charts) for more specific instructions on how
 * to use the SciChartSurface and create a 2D or 3D {@link https://www.scichart.com/javascript-chart-features | JavaScript Chart}
 */
export interface ISciChartSurfaceBase extends IDeletable, IThemeable {
    readonly id: string;
    readonly domChartRoot: HTMLDivElement;
    readonly domDivContainer: HTMLDivElement;
    readonly domCanvas2D: HTMLCanvasElement;
    readonly themeProvider: IThemeProvider;
    readonly isDeleted: boolean;
    readonly otherSurfaces: ISciChartSurfaceBase[];
    /**
     * Changes the Viewport Size of the {@link SciChartSurfaceBase}
     * @param width
     * @param height
     */
    changeViewportSize(width: number, height: number): void;
    /**
     * Add an IDeleteable object to the surface which will have its delete method called when the surface is deleted
     */
    addDeletable(deletable: IDeletable): void;
    invalidateElement(options?: {
        force?: boolean;
    }): void;
    delete(clearHtml?: boolean): void;
    /**
     * An event handler which notifies its subscribers when a render operation has finished. Use this
     * to time render performance, or to update elements of the chart or your UI on redraw.
     */
    rendered: EventHandler<boolean>;
}
/**
 * Enum constants to specify SciChartSurface type
 */
export declare enum ESurfaceType {
    /**
     * A 2D Cartesian {@link SciChartSurface}
     */
    SciChartSurfaceType = "SciChartSurfaceType",
    /**
     * A 3D Cartesian {@link SciChart3DSurface}
     */
    SciChart3DSurfaceType = "SciChart3DSurfaceType"
}
/**
 * @summary The base class for a 2D Cartesian {@link SciChartSurface} or 3D Cartesian {@link SciChart3DSurface} within SciChart -
 * High Performance Realtime {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}
 * @remarks
 * See derived types {@link SciChartSurface} (2D Charts) and {@link SciChart3DSurface} (3D Charts) for more specific instructions on how
 * to use the SciChartSurface and create a 2D or 3D {@link https://www.scichart.com/javascript-chart-features | JavaScript Chart}
 */
export declare abstract class SciChartSurfaceBase extends DeletableEntity implements ISciChartSurfaceBase, ISuspendable, INotifyOnDpiChanged {
    /**
     * Gets or sets the application-wide default theme. See {@link IThemeProvider} for details
     */
    static DEFAULT_THEME: IThemeProvider;
    /**
     * The master WebGL canvas
     * @remarks WARNING: Do not set this property, this is set internally by SciChart when initializing mutliple charts
     */
    static domMasterCanvas: HTMLCanvasElement;
    /**
     * Global property defining whether the WebGL render target is anti-aliased or not. This will affect all SciChartSurfaces (2D & 3D)
     * in the application.
     * @remarks Defaults to FALSE for crisp gridlines and lines. Individual line series and text labels are
     * chart parts are automatically anti-aliased
     */
    static AntiAliasWebGlBackbuffer: boolean;
    /**
     * Defines a delay of the shared wasmContext auto-dispose if {@link autoDisposeWasmContext} is enabled.
     */
    static wasmContextDisposeTimeout: number;
    /**
     * Defines if the shared wasmContext ({@link TSciChart | WebAssembly Context}) should be deleted after all of the surfaces that use it are deleted.
     */
    static autoDisposeWasmContext: boolean;
    /**
     * Defines if charts should rerender when the tab becomes active.
     * @remarks
     * Enabled by default. Purpose of this behavior is to deal with the issue of canvas data being cleared on an inactive tab .
     */
    static invalidateOnTabVisible: boolean;
    /**
     * Deletes the shared wasmContext ({@link TSciChart | WebAssembly Context}) used by the charts instantiated with {@link SciChartSurface.create} or {@link SciChart3DSurface.create}.
     */
    static disposeSharedWasmContext(): void;
    /**
     * Sets the runtime license key.  Use for full licenses or trials only, not developer licenses.
     * @param keyCode
     */
    static setRuntimeLicenseKey(keyCode: string): void;
    /**
     * Causes SciChart to always use its built in community non-commercial license.  This stops it attempting to look for the license wizard
     * Usage of the community license constitutes acceptance of the terms at https://www.scichart.com/community-licensing/
     */
    static UseCommunityLicense(): void;
    /**
     * Sets the endpoint for validating a runtime license key with the server.  Must be a relative path.
     * @default api/license
     * @param endpoint
     */
    static setServerLicenseEndpoint(endpoint: string): void;
    /**
     * Sets function that will be called by the framework to validate a runtime license from the server,
     * if you need to add additional handling, such as custom authentication.
     * The request sent to the server must include the queryString section passed in, which does not come with a leading ?
     * @param callback
     */
    static setLicenseCallback(callback: (queryString: string) => Promise<Response>): void;
    static resolveOptions(options: ISurfaceOptionsBase): ISurfaceOptionsBase;
    /**
     * A propertyChanged EventHandler. See {@link EventHandler} for how to subscribe to and be
     * notified when a property changes on the {@link SciChartSurfaceBase}
     */
    readonly propertyChanged: EventHandler<PropertyChangedEventArgs>;
    /**
     * An {@link ObservableArray} of {@link IChartModifierBase} derived types. Chart Modifiers provide behavior such as zooming, panning,
     * tooltips, legends and more in SciChart's High Performance Realtime
     * {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}.
     * You can use our built in modifiers (see derived types of {@link ChartModifierBase}, or create your own for custom interaction behavior.
     */
    readonly chartModifiers: ObservableArray<IChartModifierBase>;
    /**
     * The {@link HTMLDivElement} which is the dom chart root
     */
    domChartRoot: HTMLDivElement;
    /**
     * The {@link HTMLCanvasElement} which is the WebGL canvas that SciChart draws to
     */
    domCanvasWebGL: HTMLCanvasElement;
    /**
     * The {@link HTMLCanvasElement} which is the HTML5 canvas which SciChart draws overlays (cursors, tooltips) to
     */
    domCanvas2D: HTMLCanvasElement;
    /**
     * The {@link SVGSVGElement} which is the SVG canvas which SciChart adds elements (tooltips, annotations) to
     */
    domSvgContainer: SVGSVGElement;
    /**
     * The {@link SVGSVGElement} which is the SVG adorner layer canvas, is used for annotation adorners
     */
    domSvgAdornerLayer: SVGSVGElement;
    /**
     * The {@link SVGSVGElement} placed on the background and could be used instead of {@link domSvgContainer}
     */
    domBackgroundSvgContainer: SVGSVGElement;
    /**
     * The inner {@link HTMLDivElement} div element placed on the background
     */
    domSeriesBackground: HTMLDivElement;
    /**
     * The inner {@link HTMLDivElement} div element
     */
    domDivContainer: HTMLDivElement;
    /**
     * The {@link MouseManager} subscribes to mouse events on the {@link domChartRoot} and routes them to components within SciChart
     */
    mouseManager: MouseManager;
    /**
     * The {@link IThemeProvider} provides colors, brushes and theme information for the current {@link SciChartSurfaceBase}
     */
    /** For serialization Only.  The name of the onCreated function applied by the builder api */
    onCreatedName: string;
    /**
     * @summary Gets the collection of {@link IAnnotation} - annotations, markers or shapes drawn over the top of a {@link SciChartSurface}
     * @description A {@link SciChartSurface} can have zero to many {@link IAnnotation | Annotations}.
     *
     * The Annotations are drawn using our WebGL / WebAssembly rendering engine, but some use SVG for maximum configurability.
     * See derived types of {@link IAnnotation} such as {@link BoxAnnotation}, {@link LineAnnotation} etc...
     *
     * Use this collection to add and remove Annotations to the chart.
     * @remarks
     * Adding an Annotation to the chart causes it to automatically redraw. Note that annotations do not pariticpate in autoranging,
     * meaning a chart will zoom to fit data and chart series but not annotations
     */
    readonly annotations: ObservableArray<IAnnotation>;
    /**
     * @summary Gets the collection of {@link IAnnotation} - modifier annotations, markers or shapes drawn over the top of a {@link SciChartSurface}
     * @description A {@link SciChartSurface} can have zero to many {@link IAnnotation | Annotations}.
     *
     * The Annotations are drawn using our WebGL / WebAssembly rendering engine, but some use SVG for maximum configurability.
     * See derived types of {@link IAnnotation} such as {@link BoxAnnotation}, {@link LineAnnotation} etc...
     *
     * Use this collection to add and remove Modifier Annotations to the chart.
     * @remarks
     * Adding an Modifier Annotation to the chart causes it to automatically redraw. Note that annotations do not pariticpate in autoranging,
     * meaning a chart will zoom to fit data and chart series but not annotations
     */
    readonly modifierAnnotations: ObservableArray<IAnnotation>;
    adornerLayer: AdornerLayer;
    abstract isInvalidated: boolean;
    /**
     * An event handler which notifies its subscribers when a layout stage in render process has finished.
     */
    layoutMeasured: EventHandler<any>;
    /**
     * An event handler which notifies its subscribers when animations stage in render process has finished.
     */
    genericAnimationsRun: EventHandler<any>;
    /**
     * An event handler which notifies its subscribers when a chart was rendered to WebgL Canvas.
     * @remarks Not applicable to sub-charts
     */
    renderedToWebGl: EventHandler<any>;
    /**
     * An event handler which notifies its subscribers when a render operation has finished.
     */
    rendered: EventHandler<boolean>;
    /**
     * An event handler which notifies its subscribers when a chart was rendered to a display canvas.
     * @remarks Not applicable to sub-charts
     */
    renderedToDestination: EventHandler<any>;
    /**
     * An event handler which notifies its subscribers when a chart was visually painted a display canvas.
     * @remarks Not applicable to sub-charts
     */
    painted: EventHandler<any>;
    protected destinations: TSciChartDestination[];
    protected themeProviderProperty: IThemeProvider;
    protected previousThemeProviderProperty: IThemeProvider;
    protected isInitializedProperty: boolean;
    protected isDeletedProperty: boolean;
    protected backgroundProperty: string;
    protected idProperty: string;
    protected touchActionProperty: string;
    protected widthAspect: number;
    protected heightAspect: number;
    protected disableAspect: boolean;
    protected loaderJson: any;
    protected suspender: UpdateSuspender;
    protected createSuspended: boolean;
    protected visibilityObserver: VisibilityObserver;
    private sharedWasmContext;
    private readonly suspendableIdProperty;
    private seriesViewRectProperty;
    private isAlphaEnabledProperty;
    private deletables;
    private freezeWhenOutOfViewProperty;
    /**
     * Creates an instance of a SciChartSurfaceBase
     * @param webAssemblyContext  The {@link TSciChart | SciChart 2D WebAssembly Context} or {@link TSciChart | SciChart 3D WebAssembly Context}
     * containing native methods and access to our WebGL2 WebAssembly Rendering Engine
     * @param canvases A list of {@link TSciChartSurfaceCanvases} to draw to
     */
    protected constructor(webAssemblyContext: TSciChart | TSciChart3D, canvases?: TSciChartSurfaceCanvases);
    /**
     * Gets or sets the SciChartSurface Id
     */
    get id(): string;
    /**
     * Gets or sets the SciChartSurface Id
     */
    set id(value: string);
    /**
     * Gets or sets the SciChartSurface Background as an HTML color code
     */
    get background(): string;
    /**
     * Gets or sets the SciChartSurface Background as an HTML color code
     */
    set background(background: string);
    /**
     * Used internally, updates background after switching between different SciChartSurfaces
     */
    updateBackground(): void;
    /**
     * Gets the Surface Type. See {@link ESurfaceType} for list of values
     */
    abstract get surfaceType(): ESurfaceType;
    get isCopyCanvasSurface(): HTMLCanvasElement;
    /**
     * Gets the Series View {@link Rect}, a rectangle relative to the entire size of the {@link SciChartSurfaceBase}
     */
    get seriesViewRect(): Rect;
    /**
     * Used internally - gets other SciChartSurfaces
     */
    get otherSurfaces(): SciChartSurfaceBase[];
    /**
     * Used internally - gets isInitialized flag
     */
    get isInitialized(): boolean;
    /**
     * Used internally - gets isDeleted flag
     */
    get isDeleted(): boolean;
    /**
     * @inheritDoc
     */
    get isSuspended(): boolean;
    /**
     * @inheritDoc
     */
    get suspendableId(): string;
    /**
     * @inheritDoc
     */
    decrementSuspend(): void;
    /**
     * @inheritDoc
     */
    resumeUpdates(suspender: IUpdateSuspender): void;
    resume(): void;
    /**
     * @inheritDoc
     */
    suspendUpdates(): IUpdateSuspender;
    /**
     * @inheritDoc
     */
    applyTheme(themeProvider: IThemeProvider): void;
    /**
     * Used internally - gets the previous {@link IThemeProvider}
     */
    get themeProvider(): IThemeProvider;
    /**
     * Used internally - gets the previous {@link IThemeProvider}
     */
    get previousThemeProvider(): IThemeProvider;
    /**
     * When true, charts that are out of the viewport will be frozen (pausing rendering). Data updates can resume
     * Once the chart is in view again, rendering will resume. This can be useful for performance optimization.
     */
    set freezeWhenOutOfView(freezeWhenOutOfView: boolean);
    /**
     * When true, charts that are out of the viewport will be frozen (pausing rendering). Data updates can resume
     * Once the chart is in view again, rendering will resume. This can be useful for performance optimization.
     */
    get freezeWhenOutOfView(): boolean;
    /**
     * @inheritDoc
     */
    delete(clearHtml?: boolean): void;
    addDeletable(deletable: IDeletable): void;
    /**
     * Call invalidateElement() to trigger a redraw of the {@link SciChartSurfaceBase}. SciChart's WebGL WebAssembly rendering
     * engine will schedule a redraw a the next time the renderer is free.
     */
    abstract invalidateElement(options?: {
        force?: boolean;
    }): void;
    abstract getSeriesViewRectPadding(scaled: boolean): Thickness;
    getMainCanvas(): HTMLCanvasElement;
    /**
     * Sets the Series View {@link Rect}, a rectangle relative to the entire size of the {@link SciChartSurfaceBase}
     * @param seriesViewRect a {@link Rect} which defines the portion of the view for drawing series
     */
    setSeriesViewRect(seriesViewRect: Rect): void;
    /**
     * Gets the {@link AxisCore | XAxis} which matches the axisId. Returns undefined if not axis found
     * @param axisId The AxisId to search for
     */
    abstract getXAxisById(axisId: string): AxisCore;
    /**
     * Gets the {@link AxisCore | YAxis} which matches the axisId. Returns undefined if not axis found
     * @param axisId The AxisId to search for
     */
    abstract getYAxisById(axisId: string): AxisCore;
    /**
     * Changes the Viewport Size of the {@link SciChartSurfaceBase}
     * @param width
     * @param height
     */
    abstract changeViewportSize(width: number, height: number): void;
    /**
     * Used internally - sets destinations
     */
    setDestinations(destinations: TSciChartDestination[]): void;
    /**
     * Used internally, the flag is set after {@link SciChartSurfaceBase} is initialized
     */
    setIsInitialized(): void;
    /**
     * Used internally - updates watermark
     */
    abstract updateWatermark(left: number, bottom: number): void;
    /**
     * @inheritDoc
     */
    onDpiChanged(args: TDpiChangedEventArgs): void;
    /**
     * Creates a promise which resolves when the chart is updated to the next fully rendered state
     *
     * @remarks
     * If the surface is initialized with `createSingle` the promise resolves after the main `render` function is executed.
     * Otherwise, if it is initialized with `create` - the promise resolves after image data is copied to the 2D canvas.
     */
    nextStateRender(options?: {
        resumeBefore?: boolean;
        suspendAfter?: boolean;
        invalidateOnResume?: boolean;
    }): Promise<unknown>;
    get chartModifierGroups(): string[];
    protected clearRootElement(clearHtml: boolean): void;
    protected applyOptions(options: ISurfaceOptionsBase): void;
    /**
     * Detaches a {@link ChartModifierBase2D} from the {@link SciChartSurfaceBase}
     * @param chartModifier
     */
    protected detachChartModifier(chartModifier: IChartModifierBase): void;
    /**
     * Attaches a {@link ChartModifierBase2D} to the {@link SciChartSurfaceBase}
     * @param chartModifier
     */
    protected attachChartModifier(chartModifier: IChartModifierBase): void;
    /**
     * @summary Notifies subscribers of {@link SciChartSurfaceBase.propertyChanged} that a property has changed and the chart requires redrawing
     * @description SciChart provides fully reactive components, changing any property or changing data will cause the {@link SciChartSurfaceBase} to
     * redraw where necessary. This method notifies subscribers of the {@link SciChartSurfaceBase.propertyChanged} {@link EventHandler}
     * that a property has changed.
     * @param propertyName The name of the property which has changed
     */
    protected notifyPropertyChanged(propertyName: string): void;
    /**
     * When overridden in a derived type, applies an HTML color code or CSS background to surface background
     * @remarks Allowable values are colors e.g. 'Red', '#FF00FF', 'rgba(255,0,0,1)'.
     * Also gradients 'linear-gradient(45deg, rgb(255,0,0,1), rgb(0,0,255,1))',
     * or background images e.g. 'url('https://somewebsite.com/someimage.png')'
     * @param htmlColor The HTML color code
     * @param alphaEnabled
     */
    protected abstract applySciChartBackground(htmlColor: string, alphaEnabled?: boolean): void;
    protected changeMasterCanvasViewportSize(wasmContext: TSciChart | TSciChart3D, pixelWidth: number, pixelHeight: number): void;
    protected changeWebGLCanvasViewportSize(wasmContext: TSciChart | TSciChart3D, pixelWidth: number, pixelHeight: number): void;
    private detachAnnotation;
    private attachAnnotation;
}
export declare const createChartDestination: (canvas: HTMLCanvasElement) => {
    canvas: HTMLCanvasElement;
    GetHeight(): any;
    GetWidth(): any;
    GetID(): any;
};
/** @ignore */
export declare const getMasterCanvas: () => HTMLCanvasElement;
/** @ignore */
export declare const getLocateFile: (sciChartConfig: TSciChartConfig) => (path: string, prefix: string) => string;
