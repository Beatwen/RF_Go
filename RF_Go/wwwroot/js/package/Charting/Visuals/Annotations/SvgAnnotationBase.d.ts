import { Point } from "../../../Core/Point";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "../../../types/AnchorPoint";
import { ModifierMouseArgs } from "../../ChartModifiers/ModifierMouseArgs";
import { CoordinateCalculatorBase } from "../../Numerics/CoordinateCalculators/CoordinateCalculatorBase";
import { SciChartSurfaceBase } from "../SciChartSurfaceBase";
import { AnnotationBase, IAnnotationBaseOptions } from "./AnnotationBase";
/**
 * Options passed to the constructor of a {@link SvgAnnotationBase}, used to configure it at instantiation time
 */
export interface ISvgAnnotationBaseOptions extends IAnnotationBaseOptions {
    xCoordShift?: number;
    yCoordShift?: number;
    /**
     * Sets vertical anchor point
     */
    verticalAnchorPoint?: EVerticalAnchorPoint;
    /**
     * Sets horizontal anchor point
     */
    horizontalAnchorPoint?: EHorizontalAnchorPoint;
}
/**
 * The Base class for an {@link AnnotationBase | Annotation} which draws using an HTML5 SVG canvas
 */
export declare abstract class SvgAnnotationBase extends AnnotationBase {
    /** @inheritDoc */
    readonly isSvgAnnotation: boolean;
    isDeleted: boolean;
    /**
     * The {@link SVGElement} which will be added to the chart
     */
    protected xCoordShiftProperty: number;
    protected yCoordShiftProperty: number;
    protected verticalAnchorPointProperty: EVerticalAnchorPoint;
    protected horizontalAnchorPointProperty: EHorizontalAnchorPoint;
    protected svgDOMRect: DOMRect;
    protected prevX1Coordinate: number;
    protected prevY1Coordinate: number;
    protected nextSibling: Element;
    private svgProperty;
    private svgRootProperty;
    /**
     * Creates an instance of an SvgAnnotationbase
     * @param options Optional parameters of type {@link ISvgAnnotationBaseOptions} used to configure the annotation on construction
     */
    protected constructor(options?: ISvgAnnotationBaseOptions);
    /** @inheritDoc */
    onAttach(scs: SciChartSurfaceBase): void;
    /** @inheritDoc */
    onDetach(): void;
    /**
     * Gets or sets an offset to shift X-coordinates
     */
    get xCoordShift(): number;
    /**
     * Gets or sets an offset to shift X-coordinates
     */
    set xCoordShift(value: number);
    /**
     * Gets or sets an offset to shift Y-coordinates
     */
    get yCoordShift(): number;
    /**
     * Gets or sets an offset to shift Y-coordinates
     */
    set yCoordShift(value: number);
    /**
     * Gets or sets vertical anchor point
     */
    get verticalAnchorPoint(): EVerticalAnchorPoint;
    /**
     * Gets or sets vertical anchor point
     */
    set verticalAnchorPoint(value: EVerticalAnchorPoint);
    /**
     * Gets or sets horizontal anchor point
     */
    get horizontalAnchorPoint(): EHorizontalAnchorPoint;
    /**
     * Gets or sets horizontal anchor point
     */
    set horizontalAnchorPoint(value: EHorizontalAnchorPoint);
    suspendInvalidate(): void;
    resumeInvalidate(): void;
    /**
     * Updates the annotation position, with the {@link CoordinateCalculatorBase | Coordinate Calculators} passed in
     * @param xCalc The XAxis {@link CoordinateCalculatorBase | CoordinateCalculator} applied to this annotation
     * @param yCalc The YAxis {@link CoordinateCalculatorBase | CoordinateCalculator} applied to this annotation
     * @param xCoordSvgTrans X-coordinate translation which is needed to use SVG canvas having the whole chart size
     * @param yCoordSvgTrans Y-coordinate translation which is needed to use SVG canvas having the whole chart size
     */
    update(xCalc: CoordinateCalculatorBase, yCalc: CoordinateCalculatorBase, xCoordSvgTrans: number, yCoordSvgTrans: number): void;
    calcDragDistance(xyValues: Point): void;
    onDragStarted(args: ModifierMouseArgs): boolean;
    /** @inheritDoc */
    delete(): void;
    toJSON(): {
        type: import("./IAnnotation").EAnnotationType;
        options: Required<Omit<IAnnotationBaseOptions, never>>;
    };
    get svg(): SVGElement;
    protected getSvgDomRect(): DOMRect;
    protected clear(): void;
    protected checkIsClickedOnAnnotationInternal(x: number, y: number): boolean;
    protected updateAdornerInner(): void;
    /**
     * Called to create the SVG Dom Element right before it is added to the parent chart
     * @param xCalc The XAxis {@link CoordinateCalculatorBase | CoordinateCalculator} applied to this annotation
     * @param yCalc The YAxis {@link CoordinateCalculatorBase | CoordinateCalculator} applied to this annotation
     * @param xCoordSvgTrans X-coordinate translation which is needed to use SVG canvas having the whole chart size
     * @param yCoordSvgTrans Y-coordinate translation which is needed to use SVG canvas having the whole chart size
     */
    protected abstract create(xCalc: CoordinateCalculatorBase, yCalc: CoordinateCalculatorBase, xCoordSvgTrans: number, yCoordSvgTrans: number): void;
    /**
     * Gets the {@link SVGSVGElement | SVG Element} at the root of this annotation
     */
    protected get svgRoot(): SVGSVGElement;
    protected selectSvgRoot(): void;
    protected setSvgAttribute(attributeName: string, value: number): void;
    protected setSvg(svg: SVGElement): void;
    protected notifyPropertyChanged(propertyName: string): void;
    /**
     * Calculates and sets annotationBorders
     * @protected
     */
    protected calcAndSetAnnotationBorders(xCalc: CoordinateCalculatorBase, yCalc: CoordinateCalculatorBase): void;
    svgStringAdornerTemplate(x1: number, y1: number, x2: number, y2: number): string;
}
