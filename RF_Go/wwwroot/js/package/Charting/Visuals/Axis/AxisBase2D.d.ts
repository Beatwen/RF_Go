import { TAxisDefinition, TLabelProviderDefinition } from "../../../Builder/buildAxis";
import { TEasingFn } from "../../../Core/Animations/EasingFunctions";
import { Dictionary } from "../../../Core/Dictionary";
import { NumberRange } from "../../../Core/NumberRange";
import { Rect } from "../../../Core/Rect";
import { EAxisAlignment } from "../../../types/AxisAlignment";
import { EAxisType } from "../../../types/AxisType";
import { TBorder } from "../../../types/TBorder";
import { SCRTPen, SCRTSolidBrush, TSciChart } from "../../../types/TSciChart";
import { TStackedAxisLength } from "../../../types/TStackedAxisLength";
import { WebGlRenderContext2D } from "../../Drawing/WebGlRenderContext2D";
import { CoordinateCalculatorBase } from "../../Numerics/CoordinateCalculators/CoordinateCalculatorBase";
import { IThemeable } from "../../Themes/IThemeable";
import { IThemeProvider } from "../../Themes/IThemeProvider";
import { SciChartSurface } from "../SciChartSurface";
import { AxisCore, TTextStyle } from "./AxisCore";
import { AxisLayoutState } from "./AxisLayoutState";
import { AxisRenderer } from "./AxisRenderer";
import { AxisTitleRenderer } from "./AxisTitleRenderer";
import { IAxisCoreOptions } from "./IAxisCoreOptions";
import { LabelProviderBase2D } from "./LabelProvider/LabelProviderBase2D";
/**
 * Defines the clipping mode for scrolling operations found on {@link AxisBase2D.scroll}
 */
export declare enum EClipMode {
    /**
     * Do not clip when scrolling the Axis
     * @remarks
     * Use this to resolve issues such as scaling or stretching
     * when the user pans or scrolls outside of the range of the data.
     */
    None = 0,
    /**
     * Stretch the {@link AxisBase2D.visibleRange} when scrolling past the extents of the data.
     */
    StretchAtExtents = 1,
    /**
     * Clips the {@link AxisBase2D.visibleRange} to not allow scrolling past the minimum of the Axis range
     */
    ClipAtMin = 2,
    /**
     * Clips the {@link AxisBase2D.visibleRange} to not allow scrolling past the maximum of the Axis range
     */
    ClipAtMax = 3,
    /**
     * Clips the {@link AxisBase2D.visibleRange} to not allow scrolling past the minimum or maximum of the Axis range
     */
    ClipAtExtents = 4
}
/**
 * A type which contains info about major, minor tick coordinates, labels and values. Used when drawing the axis gridlines
 */
export declare type TTickObject = {
    /**
     * The major tick numeric values
     */
    majorTicks: number[];
    /**
     * The major tick label strings
     */
    majorTickLabels: string[];
    /**
     * The major tick coordinates
     */
    majorTickCoords: number[];
    /**
     * The minor tick numeric values
     */
    minorTicks: number[];
    /**
     * The minor tick coordinates
     */
    minorTickCoords: number[];
};
export interface IAutoRangeAnimationOptions {
    /** Whether to animate the first autorange  Default false */
    animateInitialRanging: boolean;
    /** Whether to animate all other autoRanges */
    animateSubsequentRanging: boolean;
    /** The length of the animation */
    duration: number;
    /** The easing function to use */
    easing?: TEasingFn;
}
export interface IAxisBase2dOptions extends IAxisCoreOptions {
    /**
     * Limits {@link AxisCore.visibleRange}, meaning the chart cannot autorange outside that range
     */
    visibleRangeLimit?: NumberRange;
    /**
     * Limits the min and max size of the {@link AxisCore.visibleRange}, meaning that the inequality must hold
     * visibleRangeSizeLimit.min <= visibleRange.max - visiblerRange.min <= visibleRangeSizeLimit.max
     */
    visibleRangeSizeLimit?: NumberRange;
    /**
     * If this is set, it will be used as the range when zooming extents, rather than the data max range
     */
    zoomExtentsRange?: NumberRange;
    /**
     * If true, zoomExtentsRange will be set to the visibleRange passed on the options, so that zoomExtents returns to the initially defined range
     */
    zoomExtentsToInitialRange?: boolean;
    /**
     * Sets the Axis Alignment. See {@link EAxisAlignment} for a list of values
     * @remarks use this property to set whether the axis is on the Left, Right, Bottom Top of the chart.
     * SciChart also supports XAxis on the left and YAxis on the top to rotate / create vertical charts.
     */
    axisAlignment?: EAxisAlignment;
    /**
     * Sets a {@link TTextStyle} object for styling axis labels
     */
    labelStyle?: TTextStyle;
    /**
     * Sets the Axis Border properties
     */
    axisBorder?: TBorder;
    /**
     * Sets whether this axis is placed inside the chart viewport
     * @remarks Center axis uses inner layout strategy
     */
    isInnerAxis?: boolean;
    /** Gets or sets the length of a stacked axis as an absolute number or percentage, e.g. 100, or "30%".
     * A plain number will be interpreted as a number of pixels.
     * A number with % will take that percentage of the total length.
     * Stacked axes without a defined length will have the remaining unreserved spaced split between them.
     * @remarks The axis length doesn't include border sizes
     */
    stackedAxisLength?: TStackedAxisLength;
    /**
     * Sets a {@link LabelProvider} - a class which is responsible for formatting axis labels and cursor labels from numeric values
     */
    labelProvider?: LabelProviderBase2D | TLabelProviderDefinition;
    /**
     * When true (default), first and last labels will be shifted to stay within axis bounds.
     * If set to false, these labels will stay aligned to their ticks
     */
    keepLabelsWithinAxis?: boolean;
    /**
     * Default (true) is to not show labels that would overlap. When using rotation you may want to set this false,
     * as the bounding box of rotated text may overlap even if the text itself does not.
     */
    hideOverlappingLabels?: boolean;
    /**
     * Options to configure if and how the axis should animate when autoRanging
     */
    autoRangeAnimation?: IAutoRangeAnimationOptions;
    /**
     * Sets axis label area thickness, by default the value is calculated to have enough space for labels.
     * However, this property allows to set minimal width/height for vertical/horizontal axes.
     * Useful to align seriesViewRects for different charts
     */
    axisThickness?: number;
    backgroundColor?: string;
    /**
     * Sets the offset from the seriesViewRect in the direction of the axis.  This overrides the value set internally during layout,
     * which is 0 for normal axes, but is used to position stacked axes.
     */
    overrideOffset?: number;
    /**
     * For an X Axis only - Determines whether the series will be clipped to the {@link visibleRange}.  Defaults true.
     * You may want to set this false if you have stacked horizontal axes, or are using {@link offsetOverride}.
     */
    clipToXRange?: boolean;
    /**
     * Sets whether the gridlines and axis labels keep their initial position when the visible range changes.
     */
    isStaticAxis?: boolean;
}
/**
 * The base class for 2D Chart Axis within SciChart - High Performance {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}.
 * @description
 * AxisBase2D is a base class for both 2D Axis types in SciChart. Concrete types include:
 *
 *  - {@link NumericAxis}: a Numeric 2D value-axis
 *  - {@link CategoryAxis}: A category 2D axis used for stock chart applications
 *
 *  Set axis on the {@link SciChartSurface.xAxes} or {@link SciChartSurface.yAxes} collections in 2D Charts.
 */
export declare abstract class AxisBase2D extends AxisCore implements IThemeable {
    /**
     * Gets or sets a {@link LabelProviderBase2D} - a class which is responsible for formatting axis labels and cursor labels from numeric values
     */
    get labelProvider(): LabelProviderBase2D;
    /**
     * Gets or sets a {@link LabelProviderBase2D} - a class which is responsible for formatting axis labels and cursor labels from numeric values
     */
    set labelProvider(labelProvider: LabelProviderBase2D);
    /**
     * Gets the {@link AxisRenderer} instance responsible for drawing the axis
     */
    get axisRenderer(): AxisRenderer;
    /**
     * Sets the {@link AxisRenderer} instance responsible for drawing the axis
     */
    set axisRenderer(axisRenderer: AxisRenderer);
    /**
     * Gets whether the axis is currently horizontal or not
     */
    get isHorizontalAxis(): boolean;
    /**
     * Gets whether the axis is flipped or not
     */
    get isAxisFlipped(): boolean;
    /**
     * Gets or sets the Axis Alignment. See {@link EAxisAlignment} for a list of values
     * @remarks use this property to set whether the axis is on the Left, Right, Bottom Top of the chart.
     * SciChart also supports XAxis on the left and YAxis on the top to rotate / create vertical charts.
     */
    get axisAlignment(): EAxisAlignment;
    /**
     * Gets or sets the Axis Alignment. See {@link EAxisAlignment} for a list of values
     * @remarks use this property to set whether the axis is on the Left, Right, Bottom Top of the chart.
     * SciChart also supports XAxis on the left and YAxis on the top to rotate / create vertical charts.
     */
    set axisAlignment(axisAlignment: EAxisAlignment);
    /**
     * Gets or sets a property which limits {@link AxisCore.visibleRange}, meaning the chart cannot autorange outside that range
     */
    get visibleRangeLimit(): NumberRange;
    set visibleRangeLimit(visibleRangeLimit: NumberRange);
    /**
     * Gets or sets a property which limits the size of {@link AxisCore.visibleRange}, meaning that the inequality must hold
     * visibleRangeSizeLimit.min <= visibleRange.max - visiblerRange.min <= visibleRangeSizeLimit.max
     */
    get visibleRangeSizeLimit(): NumberRange;
    set visibleRangeSizeLimit(value: NumberRange);
    /**
     * Gets or sets a property which, if it is set, will be used as the range when zooming extents, rather than the data max range
     */
    get zoomExtentsRange(): NumberRange;
    /**
     * Gets or sets a property which, if it is set, will be used as the range when zooming extents, rather than the data max range
     */
    set zoomExtentsRange(zoomExtentsRange: NumberRange);
    /**
     * Gets or sets whether this axis is placed inside the chart viewport
     * @remarks Center axis uses inner layout strategy
     */
    get isInnerAxis(): boolean;
    /**
     * Gets or sets whether this axis is placed inside the chart viewport
     * @remarks Center axis uses inner layout strategy
     */
    set isInnerAxis(value: boolean);
    /**
     * Gets or sets whether this axis is the Primary axis on the chart
     * @remarks In SciChart 2D Charts, multiple X,Y Axis are supported.
     * The primary axis is the one which draws the gridlines. By default, this is the first axis in the collection
     */
    get isPrimaryAxis(): boolean;
    /**
     * Gets or sets whether this axis is the Primary axis on the chart
     * @remarks In SciChart 2D Charts, multiple X,Y Axis are supported.
     * The primary axis is the one which draws the gridlines. By default, this is the first axis in the collection
     */
    set isPrimaryAxis(value: boolean);
    /** Internal Use.  Gets or Sets if this axis is stacked
     * This is only used to allow multiple primary axes, so that all stacked axes can draw gridlines
     */
    get isStackedAxis(): boolean;
    /**
     * Gets the background color of separate Axis
     */
    get backgroundColor(): string;
    /**
     * Sets the background color of separate Axis
     */
    set backgroundColor(value: string);
    /** Gets or sets the length of a stacked axis as an absolute number or percentage, e.g. 100, or "30%".
     * A plain number will be interpreted as a number of pixels.
     * A number with % will take that percentage of the total length.
     * Stacked axes without a defined length will have the remaining unreserved spaced split between them.
     * @remarks The axis length doesn't include border sizes
     */
    get stackedAxisLength(): TStackedAxisLength | undefined;
    /** Gets or sets the length of a stacked axis as an absolute number or percentage, e.g. 100, or "30%".
     * A plain number will be interpreted as a number of pixels.
     * A number with % will take that percentage of the total length.
     * Stacked axes without a defined length will have the remaining unreserved spaced split between them.
     * @remarks The axis length doesn't include border sizes
     */
    set stackedAxisLength(value: TStackedAxisLength | undefined);
    /**
     * Called internally - Gets or sets the length the current Axis. E.g. width of horizontal axis or height of vertical axis.
     */
    get axisLength(): number;
    set axisLength(value: number);
    /**
     * Gets or sets the offset of the axis position.
     * Defines a position of the axis along the layout flow.
     */
    get offset(): number;
    /**
     * set an offset value that overrides the one used by layout calculation
     */
    overrideOffset(value: number): void;
    /**
     * Called internally by layout strategies when switching between stacked and non-stacked axes.
     * If you want to set a manual offset, call {@link overrideOffset}
     */
    set offset(value: number);
    /**
     * Gets whether the parent {@link SciChartSurface} is a vertical chart, when the XAxis is on the Left or Right,
     * and YAxis is on the Top or Bottom
     */
    get isVerticalChart(): boolean;
    /**
     * Gets the {@link labelStyle} adjusted for current DPI / Browser zoom level
     */
    get dpiAdjustedLabelStyle(): TTextStyle;
    /**
     * Gets or sets a {@link TTextStyle} object for styling axis labels
     */
    get labelStyle(): TTextStyle;
    /**
     * Gets or sets a {@link TTextStyle} object for styling axis labels
     */
    set labelStyle(textStyle: TTextStyle);
    /**
     * Gets or sets the Axis Border properties
     */
    get axisBorder(): TBorder;
    /**
     * Gets or sets the Axis Border properties
     */
    set axisBorder(border: TBorder);
    /**
     * Gets or sets a {@link IAutoRangeAnimationOptions} object that controls if and how the visible range is animated during autoRanging
     */
    get autoRangeAnimation(): IAutoRangeAnimationOptions;
    /**
     * Gets or sets a {@link IAutoRangeAnimationOptions} object that controls if and how the visible range is animated during autoRanging
     */
    set autoRangeAnimation(autoRangeAnimation: IAutoRangeAnimationOptions);
    /**
     * For an X Axis only - Determines whether the series will be clipped to the {@link visibleRange}.  Defaults true.
     * You may want to set this false if you have stacked horizontal axes, or are using {@link offsetOverride}.
     */
    get clipToXRange(): boolean;
    /**
     * For an X Axis only - Determines whether the series will be clipped to the {@link visibleRange}.  Defaults true.
     * You may want to set this false if you have stacked horizontal axes, or are using {@link offsetOverride}.
     */
    set clipToXRange(clipToXRange: boolean);
    /**
     * Gets whether the gridlines and axis labels keep their initial position when the visible range changes.
     */
    get isStaticAxis(): boolean;
    /**
     * Sets whether the gridlines and axis labels keep their initial position when the visible range changes.
     */
    set isStaticAxis(value: boolean);
    abstract type: EAxisType.CategoryAxis | EAxisType.LogarithmicAxis | EAxisType.NumericAxis | EAxisType.DateTimeNumericAxis;
    /**
     * Gets the parent {@link SciChartSurface} that this axis is attached to
     */
    parentSurface: SciChartSurface;
    /**
     * Gets the {@link AxisTitleRenderer} instance responsible for drawing the axis title
     */
    axisTitleRenderer: AxisTitleRenderer;
    /**
     * Gets the {@link AxisLayoutState} class which manages layout
     */
    readonly axisLayoutState: AxisLayoutState;
    /**
     * Gets the {@link Rect | ViewRect} - a rectangle defining the location of the axis within the parent {@link SciChartSurface}
     * This includes the axis title.  Axis border is drawn to this rect.  Labels are rawn relative to axisRenderer.viewRect
     */
    viewRect: Rect;
    /**
     * The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     */
    protected webAssemblyContext2D: TSciChart;
    protected axisRendererProperty: AxisRenderer;
    protected autoRangeAnimationProperty: IAutoRangeAnimationOptions;
    private getlabelStyleProxy;
    private labelStyleProperty;
    private axisAlignmentProperty;
    private isInnerAxisProperty;
    private visibleRangeLimitProperty;
    private visibleRangeSizeLimitProperty;
    private zoomExtentsRangeProperty;
    private isPrimaryAxisProperty;
    private stackedAxisLengthProperty;
    private penCacheForMajorGridLines;
    private penCacheForMinorGridLines;
    private penCacheForMajorTickLines;
    private penCacheForMinorTickLines;
    private solidBrushCacheAxisBands;
    private solidBrushCacheAxisBackground;
    private axisBorderProperty;
    private solidBrushCacheBorder;
    private axisLengthProperty;
    private offsetProperty;
    private offsetOverrideProperty;
    private tickCache;
    private backgroundColorProperty;
    private dpiAdjustedLabelStyleCache;
    private clipToXRangeProperty;
    private isStaticAxisProperty;
    /**
     * Creates an instance of the {@link AxisBase2D}
     * @param webAssemblyContext The {@link TSciChart | SciChart 2D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param options Optional parameters of type {@link IAxisBase2dOptions} used to configure the axis at instantiation time
     */
    protected constructor(webAssemblyContext: TSciChart, options?: IAxisBase2dOptions);
    /** @inheritDoc */
    applyTheme(themeProvider: IThemeProvider): void;
    /**
     * Called when the {@link AxisBase2D} is attached to an {@link SciChartSurface}
     */
    onAttach(parentSurface: SciChartSurface, isXAxis: boolean, isPrimaryAxis: boolean): void;
    /**
     * Called when the {@link AxisBase2D} is detached from an {@link SciChartSurface}
     */
    onDetach(): void;
    /**
     * Called internally - measures the axis as part of the layout phase
     */
    measure(): void;
    /**
     * called internally - allow axis to respond to dpi changes
     */
    onDpiChanged(): void;
    /**
     * Called internally - prepares render data before a draw operation
     */
    prepareRenderData(): void;
    getCurrentCoordinateCalculator(): CoordinateCalculatorBase;
    /**
     * Called internally - draws the current axis using the {@link WebGL2RenderingContext}
     */
    draw(renderContext: WebGlRenderContext2D): void;
    /**
     * Function to draw axis areas with red color
     * @param renderContext
     */
    drawDebug(renderContext: WebGlRenderContext2D): void;
    /**
     * @inheritDoc
     */
    getDefaultNonZeroRange(): NumberRange;
    /**
     * @Summary Part of AutoRanging - Gets the maximum range on this axis
     * @description The getMaximumRange function computes the {@link visibleRange} min and max that this axis must
     * have to display all the data in the chart.
     */
    getMaximumRange(): NumberRange;
    /**
     * @summary Part of AutoRanging - gets the windowed maximum range for Y-Axes
     * @description Returns the max range only for that axis (by the data-series on it),
     * based on associated XAxis visible range of series on the same axis
     * @param xRanges (optional) if provided, we use previously calculated XAxis ranges
     * keyed by AxisId rather than calculate them again
     */
    getWindowedYRange(xRanges: Dictionary<NumberRange> | undefined): NumberRange;
    /**
     * Programmatically scrolls the axis by a number of pixels
     * @param pixelsToScroll The number of pixels to scroll
     * @param clipMode The clipping mode. See {@link EClipMode} for a list of values
     */
    scroll(pixelsToScroll: number, clipMode: EClipMode): boolean;
    /**
     * Apply the axis visibleRangeLimit and visibleRangeSizeLimit to the given range and set the result as the axis visibleRange.
     */
    setVisibleRangeWithLimits(range: NumberRange): void;
    /**
     * Programmatically zooms the axis by a min and max fraction
     * @param minFraction The Min fraction, e.g. 0.1 will zoom the lower part of the range 10%
     * @param maxFraction The Max fraction, e.g. 0.1 will zoom the upper part of the range 10%
     */
    zoomBy(minFraction: number, maxFraction: number): void;
    /**
     * @summary Programmatically zooms the axis with a from and to coordinate
     * @description Used by the {@link RubberBandXyZoomModifier}, which allows the user to draw a rectangle on the chart
     * to zoom in. The from / too coordinate are the x or y components of the rectangle corners used to zoom in
     * @param fromCoord a pixel coordinate to zoom from
     * @param toCoord a pixel coordinate to zoom to
     * @param duration The duration of animation in milliseconds. Pass 0 for no animation.
     * @param easingFunction An optional easing function passed to specify animation easing. See {@link TEasingFn} for a list of values
     */
    zoom(fromCoord: number, toCoord: number, duration?: number, easingFunction?: TEasingFn): void;
    scale(initialRange: NumberRange, delta: number, isMoreThanHalf: boolean): void;
    /**
     * @inheritDoc
     */
    animateVisibleRange(visibleRange: NumberRange, durationMs: number, easingFunction?: TEasingFn, onCompleted?: () => void): import("../../..").IGenericAnimation;
    /**
     * @inheritDoc
     */
    delete(): void;
    toJSON(): TAxisDefinition;
    /**
     * Returns the max size for major/minor ticks. Used in layout and passed to AxisRenderer
     * @protected
     */
    protected getTicksMaxSize(): number;
    /**
     * When true, the axis is valid for drawing
     */
    protected getIsValidForDrawing(): boolean;
    /**
     * Called internally - draws the Axis Bands and Gridlines
     * @param renderContext The {@link WebGL2RenderingContext} used for drawing
     * @param tickObject The {@link TTickObject} contains the major, minor tick numeric values, coordinates and labels for drawing
     * @param penForMinorGridLines The {@link SCRTPen} for drawing minor gridlines in our WebGL graphics engine
     * @param penForMajorGridLines The {@link SCRTPen} for drawing major gridlines in our WebGL graphics engine
     */
    protected drawAxisBandsAndGridLines(renderContext: WebGlRenderContext2D, tickObject: TTickObject, penForMinorGridLines: SCRTPen, penForMajorGridLines: SCRTPen): void;
    /**
     * Called internally - draws the Axis Bands
     * @param renderContext The {@link WebGL2RenderingContext} used for drawing
     * @param ticks An array of tick numeric values
     * @param tickCoords An array of tick coordinates
     * @param brush The {@link SCRTSolidBrush} used to fill the axis band area in our WebGL graphics engine
     */
    protected drawAxisBands(renderContext: WebGlRenderContext2D, ticks: number[], tickCoords: number[], brush: SCRTSolidBrush): void;
    /**
     * Called internally - draws the Axis Grid Lines
     * @param renderContext The {@link WebGL2RenderingContext} used for drawing
     * @param tickCoords An array of tick coordinates
     * @param linesPen The {@link SCRTPen} used to draw the axis gridlines in our WebGL graphics engine
     */
    protected drawGridLines(renderContext: WebGlRenderContext2D, tickCoords: number[], linesPen: SCRTPen): void;
    protected getXVisibleRange(xAxisId: string): NumberRange;
    protected getIsXCategoryAxis(xAxisId: string): boolean;
    /**
     * Returns an array of label strings for an array of major tick numeric values
     * @param majorTicks The major tick numeric values
     */
    protected getLabels(majorTicks: number[]): string[];
    /**
     * Gets the total range on the XAxis required to display all the series zoomed to fit on this axis
     */
    protected getXDataRange(): NumberRange;
    /**
     * @inheritDoc
     */
    protected notifyPropertyChanged(propertyName: string): void;
    protected getMaxXRange(): NumberRange;
    getAxisSize(): number;
    private getMajorTickIndex;
    private getTicks;
    private getTicksWithCoords;
    private applyVisibleRangeLimit;
    private applyVisibleRangeSizeLimit;
}
