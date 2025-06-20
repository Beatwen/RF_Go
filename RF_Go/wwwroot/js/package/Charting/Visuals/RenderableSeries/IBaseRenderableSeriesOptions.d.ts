import { TAnimationDefinition, TDataLabelProviderDefinition, TEffectDefinition, TPaletteProviderDefinition, TPointMarkerDefinition } from "../../../Builder/buildSeries";
import { ELineDrawMode } from "../../Drawing/WebGlRenderContext2D";
import { IDataSeries } from "../../Model/IDataSeries";
import { IPaletteProvider } from "../../Model/IPaletteProvider";
import { EResamplingMode } from "../../Numerics/Resamplers/ResamplingMode";
import { IPointMarker } from "../PointMarkers/IPointMarker";
import { SeriesAnimation } from "./Animations/SeriesAnimation";
import { IRenderableSeries } from "./IRenderableSeries";
import { ShaderEffect } from "./ShaderEffect";
import { BaseDataLabelProvider } from "./DataLabels/BaseDataLabelProvider";
import { EYRangeMode } from "../../../types/YRangeMode";
/**
 * The type of the {@link IBaseRenderableSeriesOptions.onIsVisibleChanged } callback
 */
export declare type TSeriesVisibleChangedCallback = (sourceSeries: IRenderableSeries, isVisible: boolean) => void;
/**
 * The type of the {@link IBaseRenderableSeriesOptions.onSelectedChanged } callback
 */
export declare type TSeriesSelectionChangedCallback = (sourceSeries: IRenderableSeries, isSelected: boolean) => void;
/**
 * The type of the {@link IBaseRenderableSeriesOptions.onHoveredChanged } callback
 */
export declare type TSeriesHoverChangedCallback = (sourceSeries: IRenderableSeries, isHovered: boolean) => void;
/**
 * Options to pass to the {@link BaseRenderableSeries} constructor
 */
export interface IBaseRenderableSeriesOptions {
    /**
     * A unique Id for the {@link IRenderableSeries}
     */
    id?: string;
    /**
     * The {@link IDataSeries | DataSeries} which provides a datasource for this {@link IRenderableSeries} to draw
     */
    dataSeries?: IDataSeries;
    /**
     * A {@link IPointMarker | Point Marker} which is used to draw an optional point-marker at each data-point. Applicable to some series types only
     */
    pointMarker?: IPointMarker | TPointMarkerDefinition;
    /**
     * A Stroke for lines, outlines and edges of this RenderableSeries
     * @remarks Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```
     */
    stroke?: string;
    /**
     * The Stroke Thickness for lines, outlines and edges of this RenderableSeries
     */
    strokeThickness?: number;
    /**
     * An Opacity factor of the Series that controls its semi-transparency level,
     * where value 1 means the Series is opaque; 0 - transparent.
     */
    opacity?: number;
    /**
     * @summary The current XAxis Id that this {@link BaseRenderableSeries} is bound to
     * @description By default all series will draw on the first X,Y axis pair in SciChart.
     * If you want this to change, you must add a second axis to your {@link SciChartSurface} and link the {@link BaseRenderableSeries} by Axis Id.
     *
     * For example:
     * ```ts
     * const sciChartSurface: SciChartSurface;
     * const primaryXAxis = new NumericAxis(wasmContext); // Has Id = AxisCore.DEFAULT_AXIS_ID
     * const primaryYAxis = new NumericAxis(wasmContext); // Has Id = AxisCore.DEFAULT_AXIS_ID
     *
     * const secondaryXAxis = new NumericAxis(wasmContext); // For subsequent X,Y axis set an Id
     * secondaryXAxis.id = "SecondaryXAxis";
     * const secondaryYAxis = new NumericAxis(wasmContext);
     * secondaryYAxis.id = "SecondaryYAxis";
     *
     * // Add all Axis to the chart
     * sciChartSurface.xAxes.add(primaryXAxis);
     * sciChartSurface.yAxes.add(primaryYAxis);
     * sciChartSurface.xAxes.add(secondaryXAxis);
     * sciChartSurface.yAxes.add(secondaryYAxis);
     *
     * // Add a series on the default axis
     * const renderSeries = new FastLineRenderableSeries(wasmContext); // xAxisId, yAxisId Defaults to AxisCore.DEFAULT_AXIS_ID
     * sciChartSurface.renderableSeries.add(renderSeries);
     *
     * // Add a series on the specific axis
     * const renderSeries2 = new FastLineRenderableSeries(wasmContext);
     * renderSeries2.xAxisId = "SecondaryXAxis";
     * renderSeries2.yAxisId = "SecondaryYAxis";
     * ```
     * @remarks The default value is set to {@link AxisCore.DEFAULT_AXIS_ID}.
     */
    xAxisId?: string;
    /**
     * @summary The current YAxis Id that this {@link BaseRenderableSeries} is bound to
     * @description By default all series will draw on the first X,Y axis pair in SciChart.
     * If you want this to change, you must add a second axis to your {@link SciChartSurface} and link the {@link BaseRenderableSeries} by Axis Id.
     *
     * For example:
     * ```ts
     * const sciChartSurface: SciChartSurface;
     * const primaryXAxis = new NumericAxis(wasmContext); // Has Id = AxisCore.DEFAULT_AXIS_ID
     * const primaryYAxis = new NumericAxis(wasmContext); // Has Id = AxisCore.DEFAULT_AXIS_ID
     *
     * const secondaryXAxis = new NumericAxis(wasmContext); // For subsequent X,Y axis set an Id
     * secondaryXAxis.id = "SecondaryXAxis";
     * const secondaryYAxis = new NumericAxis(wasmContext);
     * secondaryYAxis.id = "SecondaryYAxis";
     *
     * // Add all Axis to the chart
     * sciChartSurface.xAxes.add(primaryXAxis);
     * sciChartSurface.yAxes.add(primaryYAxis);
     * sciChartSurface.xAxes.add(secondaryXAxis);
     * sciChartSurface.yAxes.add(secondaryYAxis);
     *
     * // Add a series on the default axis
     * const renderSeries = new FastLineRenderableSeries(wasmContext); // xAxisId, yAxisId Defaults to AxisCore.DEFAULT_AXIS_ID
     * sciChartSurface.renderableSeries.add(renderSeries);
     *
     * // Add a series on the specific axis
     * const renderSeries2 = new FastLineRenderableSeries(wasmContext);
     * renderSeries2.xAxisId = "SecondaryXAxis";
     * renderSeries2.yAxisId = "SecondaryYAxis";
     * ```
     * @remarks The default value is set to {@link AxisCore.DEFAULT_AXIS_ID}.
     */
    yAxisId?: string;
    /**
     * When true, the series is visible and drawn
     */
    isVisible?: boolean;
    /**
     * When true, if this series draws a line, the line will be a digital (step) line
     */
    isDigitalLine?: boolean;
    /**
     * An optional {@link ShaderEffect} for modifying the render output of this {@link IRenderableSeries}
     * @remarks Options include {@link GlowEffect} and {@link ShadowEffect}. Apply an effect to see how it modifies rendering!
     */
    effect?: ShaderEffect | TEffectDefinition;
    /**
     * An optional {@link IPaletteProvider} which is used to provide per data-point coloring or paletting.
     * @remarks See {@link IStrokePaletteProvider} for per data-point coloring of lines or strokes, {@link IFillPaletteProvider} for
     * per data-point coloring of fills or series bodies, and {@link IPointMarkerPaletteProvider} for per data-point coloring of
     * point-markers
     */
    paletteProvider?: IPaletteProvider | TPaletteProviderDefinition;
    /**
     * How to treat NAN (Not a number) values in the input {@link dataSeries}. See {@link ELineDrawMode} for a list of values.
     */
    drawNaNAs?: ELineDrawMode;
    /**
     * An animation that runs on the start, child class to {@link SeriesAnimation}
     */
    animation?: SeriesAnimation | TAnimationDefinition;
    /**
     * Initial selected state for the series. Default to false
     */
    isSelected?: boolean;
    /**
     * Initial hovered state for the series. Default to false
     */
    isHovered?: boolean;
    /**
     * Optional callback function when isVisible changed. Also see {@link IRenderableSeries.isVisibleChanged} event handler
     */
    onIsVisibleChanged?: TSeriesVisibleChangedCallback | string;
    /**
     * Optional callback function when selected changed. Also see {@link IRenderableSeries.selected} event handler
     */
    onSelectedChanged?: TSeriesSelectionChangedCallback | string;
    /**
     * Optional callback function when hovered changed. Also see {@link IRenderableSeries.hovered} event handler
     */
    onHoveredChanged?: TSeriesHoverChangedCallback | string;
    /**
     * Gets or sets the {@link EResamplingMode} used when drawing this series.
     * Default value is AUTO.
     * To disable resampling for this series, set mode to NONE.
     */
    resamplingMode?: EResamplingMode;
    /**
     * Gets or sets the resampling precision for this series
     */
    resamplingPrecision?: number;
    /**
     * A {@link DataLabelProvider} used for creating and drawing per-point text.
     */
    dataLabelProvider?: BaseDataLabelProvider | TDataLabelProviderDefinition;
    /**
     * If true, the drawing will be clipped to the visibleRange of the associated Y Axis.
     * This is only really relevant if you are using Stacked Y Axes and do not want the series to be drawn outside that axis range
     */
    clipToYRange?: boolean;
    /** Determines whether the y range for this series should include the drawn points just outside the visible range (the default), or if it should consider only the visible data.
     * Visible mode is often better for Digital lines or if your data has very large jumps in y values.
     */
    yRangeMode?: EYRangeMode;
}
