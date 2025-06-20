import { IIncludeSeries } from "../../Core/IIncludeSeries";
import { Point } from "../../Core/Point";
import { Rect } from "../../Core/Rect";
import { EChart2DModifierType } from "../../types/ChartModifierType";
import { EMousePosition } from "../../types/MousePosition";
import { TPositionPoperties } from "../../utils/tooltip";
import { SeriesInfo } from "../Model/ChartData/SeriesInfo";
import { IThemeProvider } from "../Themes/IThemeProvider";
import { LineAnnotation } from "../Visuals/Annotations/LineAnnotation";
import { RolloverLegendSvgAnnotation } from "../Visuals/Annotations/RolloverLegendSvgAnnotation";
import { HitTestInfo } from "../Visuals/RenderableSeries/HitTest/HitTestInfo";
import { IRenderableSeries } from "../Visuals/RenderableSeries/IRenderableSeries";
import { IRolloverModifier, RolloverModifierRenderableSeriesProps } from "../Visuals/RenderableSeries/RolloverModifier/RolloverModifierRenderableSeriesProps";
import { ChartModifierBase2D, IChartModifierBaseOptions } from "./ChartModifierBase2D";
import { ModifierMouseArgs } from "./ModifierMouseArgs";
export declare type TRolloverLegendSvgTemplate = (seriesInfos: SeriesInfo[], svgAnnotation: RolloverLegendSvgAnnotation) => string;
export declare type TRolloverTooltipDataTemplate = (seriesInfo: SeriesInfo, tooltipTitle: string, tooltipLabelX: string, tooltipLabelY: string) => string[];
/**
 * @ignore
 * Props type used for tooltips in the {@link RolloverModifier}
 */
export declare type TTooltipProps = {
    /**
     * The index to the data on the tooltip
     */
    index: number;
    /**
     * The XValue of the data on the tooltip
     */
    xValue: number;
    /**
     * The YValue of the data on the tooltip
     */
    yValue: number;
    /**
     * The XCoordinate of the tooltip
     */
    xCoord: number;
    /**
     * The YCoordinate of the tooltip
     */
    yCoord: number;
    /**
     * The xCoordShift for the svg annotation, not scaled value
     */
    xCoordShift: number;
    /**
     * The yCoordShift for the svg annotation, not scaled value
     */
    yCoordShift: number;
    hitTestPointValues: Point;
    isCategoryAxis: boolean;
    isY1: boolean;
    height: number;
    width: number;
    seriesInfo: SeriesInfo;
};
/** @ignore */
export declare const TOOLTIP_SPACING = 4;
/**
 * Optional parameters used to configure a {@link RolloverModifier} at construct time
 */
export interface IRolloverModifierOptions extends IChartModifierBaseOptions {
    /** Sets the color of the vertical rollover line as an html color code */
    rolloverLineStroke?: string;
    /** Sets the thickness of the vertical rollover line */
    rolloverLineStrokeThickness?: number;
    /** Gets or Sets the dash array of the vertical rollover line */
    rolloverLineStrokeDashArray?: number[];
    /** Gets or Sets whether to show the vertical rollover line. Default true */
    showRolloverLine?: boolean;
    /** Sets the template for the legend */
    tooltipLegendTemplate?: TRolloverLegendSvgTemplate | string;
    /** Sets the legend X offset */
    tooltipLegendOffsetX?: number;
    /** Sets the legend Y offset */
    tooltipLegendOffsetY?: number;
    /** Sets the tooltipDataTemplate, which allows to customize content for the tooltip */
    tooltipDataTemplate?: TRolloverTooltipDataTemplate | string;
    /** Sets whether to show the tooltip. Default true */
    showTooltip?: boolean;
    /** Sets if tooltips for multiple series are allowed to overlap.  Default false  */
    allowTooltipOverlapping?: boolean;
    /**
     * If True the {@link RolloverModifier} line snaps to
     * the nearest data-point of the first visible renderable series
     */
    snapToDataPoint?: boolean;
    /** Sets the parent div element id for the Tooltip */
    placementDivId?: string;
    /**
     * If this is set greater than the default of zero, the toolip will only show values for points in this radius, rather than all points on the vertical line
     */
    hitTestRadius?: number;
    /**
     * Sets if the axis label for the rollover Line should be shown. default false.
     * Customize this futher after the modifier has been created by setting properties on rolloverModifer.rolloverLineAnnotation
     */
    showAxisLabel?: boolean;
}
/**
 * The RolloverModifier provides tooltip and cursor behavior on a 2D {@link SciChartSurface}
 * within SciChart - High Performance {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}
 * @remarks
 *
 * To apply the RolloverModifier to a {@link SciChartSurface} and add tooltip behavior,
 * use the following code:
 *
 * ```ts
 * const sciChartSurface: SciChartSurface;
 * sciChartSurface.chartModifiers.add(new RolloverModifier());
 * ```
 */
export declare class RolloverModifier extends ChartModifierBase2D implements IIncludeSeries, IRolloverModifier {
    readonly type = EChart2DModifierType.Rollover;
    /**
     * Gets or sets the template for the legend
     */
    tooltipLegendTemplate?: TRolloverLegendSvgTemplate;
    /**
     * Gets or sets the legend X offset
     */
    tooltipLegendOffsetX: number;
    /**
     * Gets or sets the legend Y offset
     */
    tooltipLegendOffsetY: number;
    /**
     * Gets or sets the snapToDataPoint flag. If True the {@link RolloverModifier} line snaps to
     * the nearest data-point of the first visible renderable series
     */
    snapToDataPoint: boolean;
    /**
     * If this is set greater than the default of zero, the toolip will only show values for points in this radius, rather than all points on the vertical line
     */
    hitTestRadius: number;
    protected showRolloverLineProperty: boolean;
    protected showTooltipProperty: boolean;
    protected absoluteXCoord: number;
    readonly rolloverLineAnnotation: LineAnnotation | undefined;
    protected mousePosition: EMousePosition;
    protected readonly legendAnnotation: RolloverLegendSvgAnnotation | undefined;
    private tooltipDataTemplateProperty?;
    private allowTooltipOverlappingProperty;
    private includedSeriesMap;
    private placementDivIdProperty;
    /**
     * Creates an instance of the RolloverModifier
     * @param options Optional parameters {@link IRolloverModifierOptions} used to configure the modifier
     */
    constructor(options?: IRolloverModifierOptions);
    protected createLine(options?: IRolloverModifierOptions): LineAnnotation;
    /**
     * @inheritDoc
     */
    applyTheme(themeProvider: IThemeProvider): void;
    /** Gets or Sets the color of the vertical rollover line as an html color code */
    get rolloverLineStroke(): string;
    /** Gets or Sets the color of the vertical rollover line as an html color code */
    set rolloverLineStroke(rolloverLineStroke: string);
    /** Gets or Sets the thickness of the vertical rollover line */
    get rolloverLineStrokeThickness(): number;
    /** Gets or Sets the thickness of the vertical rollover line */
    set rolloverLineStrokeThickness(rolloverLineStrokeThickness: number);
    /** Gets or Sets the dash array of the vertical rollover line */
    get rolloverLineStrokeDashArray(): number[];
    /** Gets or Sets the dash array of the vertical rollover line */
    set rolloverLineStrokeDashArray(rolloverLineStrokeDashArray: number[]);
    /** Gets or Sets whether to show the vertical rollover line. Default true */
    get showRolloverLine(): boolean;
    /** Gets or Sets whether to show the vertical rollover line. Default true */
    set showRolloverLine(showRolloverLine: boolean);
    /** Gets or Sets the tooltipDataTemplate, which allows you to customize content for the tooltip */
    get tooltipDataTemplate(): TRolloverTooltipDataTemplate;
    /** Gets or Sets the tooltipDataTemplate, which allows you to customize content for the tooltip */
    set tooltipDataTemplate(value: TRolloverTooltipDataTemplate);
    /** Gets or Sets whether to show the tooltip. Default true */
    get showTooltip(): boolean;
    /** Gets or Sets whether to show the tooltip. Default true */
    set showTooltip(value: boolean);
    /** Gets or Sets if tooltips for multiple series are allowed to overlap.  Default false  */
    get allowTooltipOverlapping(): boolean;
    /** Gets or Sets if tooltips for multiple series are allowed to overlap.  Default false  */
    set allowTooltipOverlapping(value: boolean);
    /**
     * @inheritDoc
     */
    onAttach(): void;
    protected addLineAnnotationToSurface(): void;
    /**
     * @inheritDoc
     */
    onDetach(): void;
    /**
     * @inheritDoc
     */
    onAttachSeries(rs: IRenderableSeries): void;
    /**
     * @inheritDoc
     */
    onDetachSeries(rs: IRenderableSeries): void;
    /**
     * @inheritDoc
     */
    modifierMouseMove(args: ModifierMouseArgs): void;
    /**
     * Hides all tooltips
     */
    hideAllTooltips(): void;
    /**
     * @inheritDoc
     */
    modifierMouseLeave(args: ModifierMouseArgs): void;
    /**
     * @inheritDoc
     */
    onParentSurfaceRendered(): void;
    /**
     * @inheritDoc
     */
    includeSeries(series: IRenderableSeries, isIncluded: boolean): void;
    /**
     * @inheritDoc
     */
    getIncludedRenderableSeries(): IRenderableSeries[];
    /**
     * Override hitTestRenderableSeries and add a custom logic
     * @param rs
     * @param mousePoint
     */
    hitTestRenderableSeries(rs: IRenderableSeries, mousePoint: Point): HitTestInfo;
    /**
     * Returns current mouse position
     */
    getMousePosition(): EMousePosition;
    /** @inheritDoc */
    toJSON(): {
        type: string;
        options: Required<Omit<IChartModifierBaseOptions, never>>;
    };
    /**
     * Called internally to adjust the positions of tooltips if there are overlaps, or if it is a vertical chart
     * @param tooltipArray
     * @param allowTooltipOverlapping
     * @param spacing
     * @param seriesViewRect
     * @param pixelRatio
     * @param isVerticalChart
     * @returns TTooltipProps[]
     */
    protected CalculateTooltipPositions(tooltipArray: TTooltipProps[], allowTooltipOverlapping: boolean, spacing: number, seriesViewRect: Rect, pixelRatio: number, isVerticalChart?: boolean): TTooltipProps[];
    /** @inheritDoc */
    protected notifyPropertyChanged(propertyName: string): void;
    protected isVerticalChart(): boolean;
    protected removeSeriesAnnotationsFromParentSurface(rs: IRenderableSeries): void;
    /**
     * @param rs
     */
    protected addSeriesAnnotationsToParentSurface(rs: IRenderableSeries): void;
    protected getRolloverProps(rs: IRenderableSeries): RolloverModifierRenderableSeriesProps;
    protected getRolloverProps1(rs: IRenderableSeries): RolloverModifierRenderableSeriesProps;
    protected update(): void;
    protected updateLine(): void;
    /**
     * @description Update Markers and Tooltips
     */
    protected updateSeriesAnnotations(): void;
    /**
     * Test if the series is included or excluded, by default it is included
     * @param series
     * @private
     */
    private testIsIncludedSeries;
    protected getSeriesInfos(): SeriesInfo[];
    /**
     * Gets or sets the parent div element reference or id for the Tooltip
     */
    get placementDivId(): string;
    /**
     * Gets or sets the parent div element reference or id for the Tooltip
     */
    set placementDivId(value: string);
}
/**
 * @ignore
 * @description Used internally, calculates tooltip props
 * @param index
 * @param rs
 * @param rolloverProps
 * @param seriesViewRect
 * @param xValue
 * @param yValue
 * @param absoluteXCoord
 * @param absoluteYCoord
 * @param hitTestInfo
 * @param pixelRatio
 * @param isY1
 */
export declare const calcTooltipProps: (index: number, rs: IRenderableSeries, rolloverProps: RolloverModifierRenderableSeriesProps, seriesViewRect: Rect, xValue: number, yValue: number, absoluteXCoord: number, absoluteYCoord: number, hitTestInfo: HitTestInfo, pixelRatio: number, isY1?: boolean, isVerticalChart?: boolean) => TTooltipProps;
/**
 * @ignore
 * @description Used internally, calculates tooltip positions to avoid overlapping
 * @param tooltipArray
 * @param allowTooltipOverlapping
 * @param spacing
 * @param seriesViewRect
 * @param pixelRatio
 * @param isVerticalChart
 */
export declare const calcTooltipPositions: (tooltipArray: TTooltipProps[], allowTooltipOverlapping: boolean, spacing: number, seriesViewRect: Rect, pixelRatio: number, isVerticalChart?: boolean) => TTooltipProps[];
/**
 * @description Splits tooltips into clusters based on their proximity
 * @param tooltipArray
 * @param spacing
 * @param pixelRatio
 * @param positionProperties
 * @returns Array of tooltip clusters
 */
export declare const splitIntoClusters: (tooltipArray: TTooltipProps[], spacing: number, pixelRatio: number, positionProperties: TPositionPoperties) => TTooltipProps[][];
/**
 * Merges clusters that might overlap after internal positioning
 * @param clusters Array of tooltip clusters
 * @param spacing Minimum spacing between tooltips
 * @param pixelRatio Display pixel ratio
 * @param positionProperties Position property names
 * @returns Merged clusters array
 */
export declare const mergeOverlappingClusters: (clusters: TTooltipProps[][], spacing: number, pixelRatio: number, positionProperties: TPositionPoperties) => TTooltipProps[][];
/**
 * Adjust positioning of entire clusters if they overlap after internal positioning
 * @param clusters Array of tooltip clusters
 * @param spacing Minimum spacing between tooltips
 * @param pixelRatio Display pixel ratio
 * @param positionProperties Position property names
 * @param seriesViewRect Chart view rectangle
 */
export declare const adjustClusterPositions: (clusters: TTooltipProps[][], spacing: number, pixelRatio: number, positionProperties: TPositionPoperties, seriesViewRect: Rect) => void;
/** @ignore */
export declare const updateRolloverModifierProps: (rolloverRSProps: RolloverModifierRenderableSeriesProps, rs: IRenderableSeries, tooltipProps: TTooltipProps, showTooltip: boolean, showMarker: boolean, placementDivId?: string) => void;
