import { TLabelProviderDefinition } from "../../../Builder/buildAxis";
import { IThemeable } from "../../../Charting/Themes/IThemeable";
import { IThemeProvider } from "../../../Charting/Themes/IThemeProvider";
import { AxisCore } from "../../../Charting/Visuals/Axis/AxisCore";
import { IAxisCoreOptions } from "../../../Charting/Visuals/Axis/IAxisCoreOptions";
import { ILabelOptions } from "../../../Charting/Visuals/Axis/LabelProvider/LabelProvider";
import { LabelProviderBase2D } from "../../../Charting/Visuals/Axis/LabelProvider/LabelProviderBase2D";
import { NumberRange } from "../../../Core/NumberRange";
import { ObservableArray } from "../../../Core/ObservableArray";
import { TTextStyleBase3D } from "../../../types/TextStyle3D";
import { TSciChart3D } from "../../../types/TSciChart3D";
import { IRenderableSeries3D } from "../RenderableSeries/BaseRenderableSeries3D";
import { SciChart3DSurface } from "../SciChart3DSurface";
import { AxisBase3DLabelStyle } from "./AxisBase3DLabelStyle";
import { EAxisSideClipping } from "./EAxisSideClipping";
import { ETextAlignment3D } from "./ETextAlignment3D";
import { IAxisDescriptor } from "./IAxisDescriptor";
/**
 * Optional parameters passed to {@link AxisBase3D} constructor to set defaults at construction time
 */
export interface IAxisBase3dOptions extends IAxisCoreOptions, ILabelOptions {
    /**
     * Gets or sets tick labels offset from the axis plane
     */
    tickLabelsOffset?: number;
    /**
     * Gets or sets title text offset from the axis plane
     */
    titleOffset?: number;
    /**
     * Sets the Plane border color as an HTML Color string
     */
    planeBorderColor?: string;
    /**
     * Sets the plane border thickness in world units
     */
    planeBorderThickness?: number;
    /**
     * Sets the plane background color as an HTML Color string
     */
    planeBackgroundFill?: string;
    /**
     * Sets a {@link LabelProvider} - a class which is responsible for formatting axis labels and cursor labels from numeric values
     */
    labelProvider?: LabelProviderBase2D | TLabelProviderDefinition;
    /**
     * Style for axis labels
     */
    labelStyle?: TTextStyleBase3D;
    /**
     * Style for axis title
     */
    axisTitleStyle?: TTextStyleBase3D;
}
/**
 * Which axis - used for calculations
 */
export declare enum EWhichAxis {
    xAxis = 0,
    yAxis = 1,
    zAxis = 2
}
/**
 * The base class for 3D Chart Axis within SciChart - High Performance
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript 3D Charts}.
 * @description
 * AxisBase3D is a base class for both 3D Axis types in SciChart. Concrete types include:
 *
 *  - {@link NumericAxis3D}: a Numeric 3D value-axis
 *
 * Set axis on the {@link SciChart3DSurface.xAxis}, {@link SciChart3DSurface.yAxis} or {@link SciChart3DSurface.zAxis} in 3D Charts.
 */
export declare abstract class AxisBase3D extends AxisCore implements IThemeable {
    /**
     * Gets the parent {@link SciChart3DSurface} that this axis is attached to
     */
    parentSurface: SciChart3DSurface;
    readonly labelStyle: AxisBase3DLabelStyle;
    readonly titleStyle: AxisBase3DLabelStyle;
    /**
     * The {@link TSciChart3D | SciChart 3D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     */
    protected readonly webAssemblyContext3D: TSciChart3D;
    private labelDepthTestEnabledProperty;
    private planeBorderThicknessProperty;
    private planeBorderColorProperty;
    private tickLabelAlignmentProperty;
    private negativeSideClippingProperty;
    private positiveSideClippingProperty;
    private axisPlaneBackgroundFillProperty;
    private isYAxisProperty;
    private isZAxisProperty;
    private titleOffsetProperty;
    private tickLabelsOffsetProperty;
    /**
     * Creates an instance of the {@link AxisBase3D}
     * @param webAssemblyContext The {@link TSciChart3D | SciChart 3D WebAssembly Context} containing native methods and
     * access to our WebGL2 Engine and WebAssembly numerical methods
     * @param options optional parameters of type {@link IAxisBase3dOptions} to pass to the constructor
     * @protected
     */
    protected constructor(webAssemblyContext: TSciChart3D, options?: IAxisBase3dOptions);
    /**
     * @inheritDoc
     */
    applyTheme(themeProvider: IThemeProvider): void;
    /**
     * Used internally - gets whether this axis is a Y Axis
     */
    get isYAxis(): boolean;
    /**
     * Used internally - sets whether this axis is a Y Axis
     */
    setIsYAxis(isYAxis: boolean): void;
    /**
     * Used internally - gets whether this axis is a Z Axis
     */
    get isZAxis(): boolean;
    /**
     * Used internally - sets whether this axis is a Z Axis
     */
    setIsZAxis(isZAxis: boolean): void;
    /**
     * Gets or sets if Label Depth test is enabled
     * @description When true, Labels are rendered with depth and can be behind chart objects.
     * Else, labels are always on top and closest to the viewer
     */
    get labelDepthTestEnabled(): boolean;
    /**
     * Gets or sets if Label Depth test is enabled
     * @description When true, Labels are rendered with depth and can be behind chart objects.
     * Else, labels are always on top and closest to the viewer
     */
    set labelDepthTestEnabled(labelDepthTestEnabled: boolean);
    /**
     * Gets or sets a thickness of the axis plane border.
     */
    get planeBorderThickness(): number;
    /**
     * Gets or sets a thickness of the axis plane border.
     */
    set planeBorderThickness(planeBorderThickness: number);
    /**
     * Gets or sets the color of the axis plane border as an HTML Color code
     */
    get planeBorderColor(): string;
    /**
     * Gets or sets the color of the axis plane border as an HTML Color code
     */
    set planeBorderColor(planeBorderColor: string);
    /**
     * Gets or sets the Axis Label Alignment. See {@link ETextAlignment3D} for a list of values
     */
    get tickLabelAlignment(): ETextAlignment3D;
    /**
     * Gets or sets the Axis Label Alignment. See {@link ETextAlignment3D} for a list of values
     */
    set tickLabelAlignment(tickLabelAlignment: ETextAlignment3D);
    /**
     * Gets or sets a value determining how {@link BaseRenderableSeries3D | 3D RenderableSeries} are clipped by axis on the positive side
     * @remarks See {@link EAxisSideClipping} for a list of values
     */
    get positiveSideClipping(): EAxisSideClipping;
    /**
     * Gets or sets a value determining how {@link BaseRenderableSeries3D | 3D RenderableSeries} are clipped by axis on the positive side
     * @remarks See {@link EAxisSideClipping} for a list of values
     */
    set positiveSideClipping(positiveSideClipping: EAxisSideClipping);
    /**
     * Gets or sets a value determining how {@link BaseRenderableSeries3D | 3D RenderableSeries} are clipped by axis on the negative side
     * @remarks See {@link EAxisSideClipping} for a list of values
     */
    get negativeSideClipping(): EAxisSideClipping;
    /**
     * Gets or sets a value determining how {@link BaseRenderableSeries3D | 3D RenderableSeries} are clipped by axis on the negative side
     * @remarks See {@link EAxisSideClipping} for a list of values
     */
    set negativeSideClipping(negativeSideClipping: EAxisSideClipping);
    /**
     * Gets or sets the fill of the Axis Plane background as an HTML Color code. Defaults to transparent
     */
    get axisPlaneBackgroundFill(): string;
    /**
     * Gets or sets the fill of the Axis Plane background as an HTML Color code. Defaults to transparent
     */
    set axisPlaneBackgroundFill(axisPlaneBackgroundFill: string);
    /**
     *  Gets or sets title text offset from the axis plane
     */
    get titleOffset(): number;
    /**
     *  Gets or sets title text offset from the axis plane
     */
    set titleOffset(value: number);
    /**
     * Gets or sets the color of the background of the axis plane as an HTML Color code
     */
    get backgroundColor(): string;
    /**
     * Gets or sets the color of the background of the axis plane as an HTML Color code
     */
    set backgroundColor(value: string);
    /**
     * Gets or sets tick labels offset from the axis plane
     */
    get tickLabelsOffset(): number;
    /**
     * Gets or sets tick labels offset from the axis plane
     */
    set tickLabelsOffset(value: number);
    onAttach(parentSurface: SciChart3DSurface, isXaxis: boolean, isYAxis: boolean, isZAxis: boolean): void;
    /**
     * Called internally - returns an {@link IAxisDescriptor} which contains parameters, property and data
     * to pass to the WebAssembly 3D Engine for drawing this axis
     */
    toAxisDescriptor(): IAxisDescriptor;
    validateAxis(): void;
    /**
     * @Summary Part of AutoRanging - Gets the maximum range on this axis
     * @description The getMaximumRange function computes the {@link visibleRange} min and max that this axis must
     * have to display all the data in the chart.
     */
    getMaximumRange(): NumberRange;
    /**
     * @Summary Part of AutoRanging - Gets the maximum range on this axis.
     * @description The getMaximumRange function computes the {@link visibleRange} min and max that this axis must
     * have to display all the data in the chart.
     * @remarks This overload impersonates a specific axis according to the {@link EWhichAxis} parameter
     * @param whichAxis Which axis we should calculate as. See {@link EWhichAxis} for a list of values
     * @param renderableSeries The series to use for calculations
     */
    getMaximumRangeAs(renderableSeries: ObservableArray<IRenderableSeries3D>, whichAxis: EWhichAxis): NumberRange;
    /**
     * gets the axis size from the WorldDimensions, depending on whether it is an X,Y or ZAxis
     */
    getAxisSize(): number;
    /**
     * Given an array of numeric values for axis labels, returns a list of strings. Uses {@link labelProvider} property to format labels
     * @param majorTicks The major tick values as numbers to be converted to labels
     * @protected
     */
    protected getLabels(majorTicks: number[]): string[];
    private getTicks;
    private getTickCoordsAndLabels;
}
