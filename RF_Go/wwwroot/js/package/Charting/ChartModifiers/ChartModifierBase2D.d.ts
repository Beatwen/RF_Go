import { Point } from "../../Core/Point";
import { EChart2DModifierType } from "../../types/ChartModifierType";
import { EExecuteOn } from "../../types/ExecuteOn";
import { EXyDirection } from "../../types/XyDirection";
import { AxisBase2D } from "../Visuals/Axis/AxisBase2D";
import { IRenderableSeries } from "../Visuals/RenderableSeries/IRenderableSeries";
import { SciChartSurface } from "../Visuals/SciChartSurface";
import { ChartModifierBase, EModifierType } from "./ChartModifierBase";
/**
 * Options for passing to the constructor of {@link ChartModifierBase2D} derived types
 */
export interface IChartModifierBaseOptions {
    /**
     * A unique Id for the {@link ChartModifierBase2D}
     */
    id?: string;
    /**
     * Defines the operation that modifier should respond to
     */
    executeOn?: EExecuteOn;
    /**
     * Defines the {@link EXyDirection | Xy Direction} - whether the modifier works in X, Y or XY or neither direction,
     * for vertical charts the behaviour could be inverted, for example for vertical chart
     * with {@link RubberBandXyZoomModifier} and {@link EXyDirection.XDirection} the modifier works on Y axis
     */
    xyDirection?: EXyDirection;
    /**
     * Defines the Modifier Group string - a grouping by ID for sharing mouse events across charts
     */
    modifierGroup?: string;
    /**
     * The XAxis Id to be used by annotations internal to the modifier.
     * Set if you have multiple x axes and need to distinguish between horizontal/vertical, or stacked axes
     */
    xAxisId?: string;
    /**
     * The YAxis Id to be used by annotations internal to the modifier.
     * Set if you have multiple y axes and need the modifier to use something other than the first one.
     */
    yAxisId?: string;
}
/**
 * Defines a base class to a ChartModifier2D - a class which provides Zoom, Pan, Tooltip or interaction behavior
 * to SciChart - High Performance Realtime {@link https://www.scichart.com/javascript-chart-features | 2D JavaScript Charts}
 */
export declare abstract class ChartModifierBase2D extends ChartModifierBase<SciChartSurface> {
    /**
     * The type of chartmodifier. See {@link EChart2DModifierType} for available options
     */
    abstract readonly type: EChart2DModifierType | string;
    xyDirection: EXyDirection;
    protected changedPropertiesList: string[];
    protected xAxisIdProperty: string;
    protected yAxisIdProperty: string;
    protected typeMap: Map<string, string>;
    /**
     * Creates an instance of the {@link ChartModifierBase2D}
     * @param options optional parameters via {@link IChartModifierBaseOptions} which can be passed to configure the modifier
     */
    constructor(options?: IChartModifierBaseOptions);
    /**
     * @inheritDoc
     */
    get modifierType(): EModifierType;
    /** @inheritDoc */
    get xAxisId(): string;
    /** @inheritDoc */
    set xAxisId(xAxisId: string);
    /** @inheritDoc */
    get yAxisId(): string;
    /** @inheritDoc */
    set yAxisId(yAxisId: string);
    /**
     * Gets all series on the parent surface.
     * @protected
     * @remarks This function allows mocking in tests
     */
    getAllSeries(): IRenderableSeries[];
    /**
     * @inheritDoc
     */
    toJSON(): {
        type: string;
        options: Required<Omit<IChartModifierBaseOptions, never>>;
    };
    protected testPropertyChanged(propertyName: string): boolean;
    protected notifyPropertyChanged(propertyName: string): void;
    /**
     * Grows the Axis by a fraction around the mouse point
     * @param mousePoint the X,Y location of the mouse at the time of the operation
     * @param axis the Axis to grow or shrink
     * @param fraction the fraction, e.g. 0.1 grows the axis by 10%
     */
    protected growBy(mousePoint: Point, axis: AxisBase2D, fraction: number): void;
}
export declare const testIsOverAxes: (xAxisArr: AxisBase2D[], mousePoint: Point) => boolean;
export declare const getActiveAxes: (xAxisArr: AxisBase2D[], mousePoint: Point) => AxisBase2D[];
