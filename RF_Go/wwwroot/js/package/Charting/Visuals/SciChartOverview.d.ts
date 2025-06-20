import { DeletableEntity } from "../../Core/DeletableEntity";
import { IDeletable } from "../../Core/IDeletable";
import { OverviewRangeSelectionModifier } from "../ChartModifiers/OverviewRangeSelectionModifier";
import { IThemeable } from "../Themes/IThemeable";
import { IThemeProvider } from "../Themes/IThemeProvider";
import { AxisBase2D } from "./Axis/AxisBase2D";
import { INumericAxisOptions } from "./Axis/NumericAxis";
import { I2DSurfaceOptions } from "./I2DSurfaceOptions";
import { IRenderableSeries } from "./RenderableSeries/IRenderableSeries";
import { SciChartSurface } from "./SciChartSurface";
/**
 * Options for passing to the {@link SciChartOverview.create} method
 */
export interface IOverviewOptions extends I2DSurfaceOptions {
    mainAxisId?: string;
    secondaryAxisId?: string;
    customRangeSelectionModifier?: OverviewRangeSelectionModifier;
    rangeSelectionAnnotationSvgString?: string;
    transformRenderableSeries?: (renderableSeries: IRenderableSeries) => IRenderableSeries | undefined;
    overviewXAxisOptions?: INumericAxisOptions;
    overviewYAxisOptions?: INumericAxisOptions;
}
/**
 * @summary The {@link SciChartOverview} is the component that can control the visible range of the parent {@link SciChartSurface} using a slider
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript Chart Library}
 * @description
 * To instantiate an overview use {@link SciChartOverview.create} method
 * @remarks
 * It is possible to specify options to customize style and behavior of the component.
 */
export declare class SciChartOverview extends DeletableEntity implements IDeletable, IThemeable {
    /**
     * Creates a {@link SciChartOverview} and {@link TSciChart | WebAssembly Context} to occupy the div by element ID in your DOM.
     * @remarks This method is async and must be awaited
     * @param parentChart The {@link SciChartSurface} of the {@link SciChartOverview} will reside
     * @param overviewRootElementId The Div Element ID or reference where the {@link SciChartSurface} of the {@link SciChartOverview} will reside
     * @param options Optional - Optional parameters for chart creation. See {@link IOverviewOptions for more details}
     */
    static create(parentChart: SciChartSurface, overviewRootElement?: string | HTMLDivElement, options?: IOverviewOptions): Promise<SciChartOverview>;
    private readonly overviewXAxisProperty;
    private readonly overviewYAxisProperty;
    private readonly rangeSelectionModifierProperty;
    private readonly parentSciChartSurfaceProperty;
    private readonly overviewSciChartSurfaceProperty;
    private overviewWasmContext;
    private constructor();
    /**
     * Gets the {@link SciChartSurface} used by the {@link @SciChartOverview}
     */
    get overviewSciChartSurface(): SciChartSurface;
    /**
     * Gets the parent {@link SciChartSurface} controlled by the {@link @SciChartOverview}
     */
    get parentSciChartSurface(): SciChartSurface;
    /**
     * Gets the {@link OverviewRangeSelectionModifier} used by the {@link @SciChartOverview}
     */
    get rangeSelectionModifier(): OverviewRangeSelectionModifier;
    /**
     * Gets the X Axis of the {@link SciChartSurface} used by the {@link @SciChartOverview}
     */
    get overviewXAxis(): AxisBase2D;
    /**
     * Gets the Y Axis of the {@link SciChartSurface} used by the {@link @SciChartOverview}
     */
    get overviewYAxis(): AxisBase2D;
    /** @inheritDoc */
    applyTheme(theme: IThemeProvider): void;
    /** @inheritDoc */
    delete(): void;
}
