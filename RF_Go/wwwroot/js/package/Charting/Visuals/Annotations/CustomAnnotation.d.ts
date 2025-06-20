import { CoordinateCalculatorBase } from "../../Numerics/CoordinateCalculators/CoordinateCalculatorBase";
import { EAnnotationType } from "./IAnnotation";
import { ISvgAnnotationBaseOptions, SvgAnnotationBase } from "./SvgAnnotationBase";
/**
 * Optional parameters passed to an {@link CustomAnnotation} during construction
 */
export interface ICustomAnnotationOptions extends ISvgAnnotationBaseOptions {
    /**
     * SVG dom element string provided by the user
     */
    svgString?: string;
}
/**
 * A CustomAnnotation presents SVG information over the chart at specific {@link X1}, {@link Y1} coordinates
 */
export declare class CustomAnnotation extends SvgAnnotationBase {
    /** @inheritDoc */
    readonly type = EAnnotationType.SVGCustomAnnotation;
    /** Set true only if you are using a getSvgString method which is dependent on the position of the annotation
     * This will require the annotation to be recreated each frame which is slow
     */
    isPositionDependent: boolean;
    protected isDirty: boolean;
    private svgStringProperty;
    /**
     * Creates an instance of the {@link CustomAnnotation}
     * @param options The {@link ICustomAnnotationOptions} which contain optional parameters
     */
    constructor(options?: ICustomAnnotationOptions);
    /**
     * SVG dom element string provided by the user
     */
    get svgString(): string;
    /**
     * SVG dom element string provided by the user
     */
    set svgString(value: string);
    /** This is called to get the svg string to use. Override this to customise the svg string for each render */
    getSvgString(annotation: CustomAnnotation): string;
    /**
     * This is called on the svg element immediately after it is created.  Use this to do adjustments or additions to it which require knowlege of its size.
     * For instance, this method adds a bounding rectangle to the existing svg
     * ```ts
     * updateSvg(annotation: CustomAnnotation, svg: SVGSVGElement) {
     *    const annotationRect = svg.getBoundingClientRect();
     *    const padding = 5;
     *    // Offset the existing element by the padding
     *    (svg.firstChild as SVGElement).setAttribute("x", padding.toString());
     *    (svg.firstChild as SVGElement).setAttribute("y", padding.toString());
     *    const rectWidth = annotationRect.width + padding + padding;
     *    const rectHeight = annotationRect.height + padding + padding;
     *    const namespace = "http://www.w3.org/2000/svg";
     *    const newRect = document.createElementNS(namespace, "rect");
     *    newRect.setAttribute("x", "0");
     *    newRect.setAttribute("y", "0");
     *    newRect.setAttribute("width", `${rectWidth}`);
     *    newRect.setAttribute("height", `${rectHeight}`);
     *    newRect.setAttribute("fill", `red`);
     *    return svg;
     * }
     * ```
     */
    updateSvg(annotation: CustomAnnotation, svg: SVGSVGElement): SVGSVGElement;
    /** @inheritDoc */
    toJSON(): {
        type: EAnnotationType;
        options: Required<Omit<import("./AnnotationBase").IAnnotationBaseOptions, never>>;
    };
    /** @inheritDoc */
    protected create(xCalc: CoordinateCalculatorBase, yCalc: CoordinateCalculatorBase, xCoordSvgTrans: number, yCoordSvgTrans: number): void;
}
