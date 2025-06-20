"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SciChartOverview = void 0;
var buildSeries_1 = require("../../Builder/buildSeries");
var DeletableEntity_1 = require("../../Core/DeletableEntity");
var NumberRange_1 = require("../../Core/NumberRange");
var AutoRange_1 = require("../../types/AutoRange");
var AxisType_1 = require("../../types/AxisType");
var OverviewRangeSelectionModifier_1 = require("../ChartModifiers/OverviewRangeSelectionModifier");
var AxisBase2D_1 = require("./Axis/AxisBase2D");
var CategoryAxis_1 = require("./Axis/CategoryAxis");
var LogarithmicAxis_1 = require("./Axis/LogarithmicAxis");
var NumericAxis_1 = require("./Axis/NumericAxis");
var SciChartSurface_1 = require("./SciChartSurface");
/**
 * @summary The {@link SciChartOverview} is the component that can control the visible range of the parent {@link SciChartSurface} using a slider
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript Chart Library}
 * @description
 * To instantiate an overview use {@link SciChartOverview.create} method
 * @remarks
 * It is possible to specify options to customize style and behavior of the component.
 */
var SciChartOverview = /** @class */ (function (_super) {
    __extends(SciChartOverview, _super);
    function SciChartOverview(parentSciChartSurface, overviewSciChartSurface, wasmContext, rangeSelectionModifier, overviewXAxis, overviewYAxis) {
        var _this = _super.call(this) || this;
        _this.overviewXAxisProperty = overviewXAxis;
        _this.overviewYAxisProperty = overviewYAxis;
        _this.rangeSelectionModifierProperty = rangeSelectionModifier;
        _this.parentSciChartSurfaceProperty = parentSciChartSurface;
        _this.overviewSciChartSurfaceProperty = overviewSciChartSurface;
        _this.overviewWasmContext = wasmContext;
        return _this;
    }
    /**
     * Creates a {@link SciChartOverview} and {@link TSciChart | WebAssembly Context} to occupy the div by element ID in your DOM.
     * @remarks This method is async and must be awaited
     * @param parentChart The {@link SciChartSurface} of the {@link SciChartOverview} will reside
     * @param overviewRootElementId The Div Element ID or reference where the {@link SciChartSurface} of the {@link SciChartOverview} will reside
     * @param options Optional - Optional parameters for chart creation. See {@link IOverviewOptions for more details}
     */
    SciChartOverview.create = function (parentChart, overviewRootElement, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, sciChartSurface, wasmContext, rangeSelectionModifier, xAxis, yAxis;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, createSciChartOverview(parentChart, overviewRootElement, options)];
                    case 1:
                        _a = _b.sent(), sciChartSurface = _a.sciChartSurface, wasmContext = _a.wasmContext, rangeSelectionModifier = _a.rangeSelectionModifier, xAxis = _a.xAxis, yAxis = _a.yAxis;
                        return [2 /*return*/, new SciChartOverview(parentChart, sciChartSurface, wasmContext, rangeSelectionModifier, xAxis, yAxis)];
                }
            });
        });
    };
    Object.defineProperty(SciChartOverview.prototype, "overviewSciChartSurface", {
        /**
         * Gets the {@link SciChartSurface} used by the {@link @SciChartOverview}
         */
        get: function () {
            return this.overviewSciChartSurfaceProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartOverview.prototype, "parentSciChartSurface", {
        /**
         * Gets the parent {@link SciChartSurface} controlled by the {@link @SciChartOverview}
         */
        get: function () {
            return this.parentSciChartSurfaceProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartOverview.prototype, "rangeSelectionModifier", {
        /**
         * Gets the {@link OverviewRangeSelectionModifier} used by the {@link @SciChartOverview}
         */
        get: function () {
            return this.rangeSelectionModifierProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartOverview.prototype, "overviewXAxis", {
        /**
         * Gets the X Axis of the {@link SciChartSurface} used by the {@link @SciChartOverview}
         */
        get: function () {
            return this.overviewXAxisProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SciChartOverview.prototype, "overviewYAxis", {
        /**
         * Gets the Y Axis of the {@link SciChartSurface} used by the {@link @SciChartOverview}
         */
        get: function () {
            return this.overviewYAxisProperty;
        },
        enumerable: false,
        configurable: true
    });
    /** @inheritDoc */
    SciChartOverview.prototype.applyTheme = function (theme) {
        this.overviewSciChartSurface.applyTheme(theme);
    };
    /** @inheritDoc */
    SciChartOverview.prototype.delete = function () {
        if (this.overviewSciChartSurface && !this.overviewSciChartSurface.isDeleted) {
            this.overviewSciChartSurface.delete();
        }
        this.overviewWasmContext = undefined;
    };
    return SciChartOverview;
}(DeletableEntity_1.DeletableEntity));
exports.SciChartOverview = SciChartOverview;
/** @ignore */
var createSciChartOverview = function (originalSciChartSurface, overviewRootElement, options) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, wasmContext, sciChartSurface, mainAxisId, secondaryAxisId, originalMainAxis, originalSecondaryAxis, originalXAxis, originalYAxis, xAxisOptions, yAxisOptions, xAxis, yAxis, mainOverviewAxis, defaultTransform, renderableSeries, rangeSelectionModifier;
    var _b;
    var _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, SciChartSurface_1.SciChartSurface.create(overviewRootElement, options)];
            case 1:
                _a = _g.sent(), wasmContext = _a.wasmContext, sciChartSurface = _a.sciChartSurface;
                mainAxisId = (_c = options === null || options === void 0 ? void 0 : options.mainAxisId) !== null && _c !== void 0 ? _c : AxisBase2D_1.AxisBase2D.DEFAULT_AXIS_ID;
                secondaryAxisId = (_d = options === null || options === void 0 ? void 0 : options.secondaryAxisId) !== null && _d !== void 0 ? _d : AxisBase2D_1.AxisBase2D.DEFAULT_AXIS_ID;
                originalMainAxis = originalSciChartSurface.getXAxisById(mainAxisId);
                originalSecondaryAxis = originalSciChartSurface.getYAxisById(secondaryAxisId);
                if (!originalMainAxis)
                    throw new Error("Could not find a main axis with id ".concat(mainAxisId, ".") +
                        (!(options === null || options === void 0 ? void 0 : options.mainAxisId) ? "Please specify mainAxisId in the options" : ""));
                if (!originalMainAxis)
                    throw new Error("Could not find a secondary axis with id ".concat(secondaryAxisId, ".") +
                        (!(options === null || options === void 0 ? void 0 : options.secondaryAxisId) ? "Please specify secondaryAxisId in the options" : ""));
                originalXAxis = originalMainAxis.isXAxis ? originalMainAxis : originalSecondaryAxis;
                originalYAxis = originalMainAxis.isXAxis ? originalSecondaryAxis : originalMainAxis;
                xAxisOptions = __assign({ axisAlignment: originalXAxis.axisAlignment, isVisible: false, autoRange: AutoRange_1.EAutoRange.Always, visibleRange: originalXAxis.visibleRange }, options === null || options === void 0 ? void 0 : options.overviewXAxisOptions);
                yAxisOptions = __assign({ axisAlignment: originalYAxis.axisAlignment, isVisible: false, autoRange: AutoRange_1.EAutoRange.Always, visibleRange: originalYAxis.visibleRange }, options === null || options === void 0 ? void 0 : options.overviewYAxisOptions);
                xAxis = originalXAxis.isCategoryAxis
                    ? new CategoryAxis_1.CategoryAxis(wasmContext, xAxisOptions)
                    : originalXAxis.type === AxisType_1.EAxisType.LogarithmicAxis
                        ? new LogarithmicAxis_1.LogarithmicAxis(wasmContext, xAxisOptions)
                        : new NumericAxis_1.NumericAxis(wasmContext, xAxisOptions);
                yAxis = originalYAxis.isCategoryAxis
                    ? new CategoryAxis_1.CategoryAxis(wasmContext, yAxisOptions)
                    : originalXAxis.type === AxisType_1.EAxisType.LogarithmicAxis
                        ? new LogarithmicAxis_1.LogarithmicAxis(wasmContext, yAxisOptions)
                        : new NumericAxis_1.NumericAxis(wasmContext, yAxisOptions);
                mainOverviewAxis = originalMainAxis.isXAxis ? xAxis : yAxis;
                defaultTransform = function (rendSeries) {
                    // return undefined to skip
                    if (rendSeries.xAxisId !== originalXAxis.id || rendSeries.yAxisId !== originalYAxis.id) {
                        return undefined;
                    }
                    // clone the series using builder api
                    var overviewSeries = (0, buildSeries_1.buildSeries)(wasmContext, rendSeries.toJSON(true))[0];
                    overviewSeries.dataSeries.delete();
                    overviewSeries.dataSeries = rendSeries.dataSeries;
                    overviewSeries.xAxisId = xAxis.id;
                    overviewSeries.yAxisId = yAxis.id;
                    return overviewSeries;
                };
                renderableSeries = originalSciChartSurface.renderableSeries
                    .asArray()
                    .map((_e = options === null || options === void 0 ? void 0 : options.transformRenderableSeries) !== null && _e !== void 0 ? _e : defaultTransform)
                    .filter(function (rendSeries) { return rendSeries; });
                sciChartSurface.xAxes.add(xAxis);
                sciChartSurface.yAxes.add(yAxis);
                (_b = sciChartSurface.renderableSeries).add.apply(_b, renderableSeries);
                sciChartSurface.zoomExtents();
                rangeSelectionModifier = (_f = options === null || options === void 0 ? void 0 : options.customRangeSelectionModifier) !== null && _f !== void 0 ? _f : new OverviewRangeSelectionModifier_1.OverviewRangeSelectionModifier();
                rangeSelectionModifier.xAxisId = xAxis.id;
                rangeSelectionModifier.yAxisId = yAxis.id;
                rangeSelectionModifier.onSelectedAreaChanged = function (selectedRange) {
                    if (!selectedRange.equals(originalMainAxis.visibleRange)) {
                        originalMainAxis.setVisibleRangeWithLimits(selectedRange);
                    }
                };
                rangeSelectionModifier.selectedArea = new NumberRange_1.NumberRange(Math.max(xAxis.visibleRange.min, originalMainAxis.visibleRange.min), Math.min(xAxis.visibleRange.max, originalMainAxis.visibleRange.max));
                sciChartSurface.chartModifiers.add(rangeSelectionModifier);
                if ((options === null || options === void 0 ? void 0 : options.rangeSelectionAnnotationSvgString) !== undefined) {
                    rangeSelectionModifier.rangeSelectionAnnotation.svgString = options.rangeSelectionAnnotationSvgString;
                }
                xAxis.visibleRangeChanged.subscribe(function (_a) {
                    var overviewVisibleRange = _a.visibleRange;
                    var updatedSelectedRange = originalMainAxis.visibleRange.clip(overviewVisibleRange);
                    rangeSelectionModifier.selectedArea = updatedSelectedRange;
                });
                originalMainAxis.visibleRangeChanged.subscribe(function (_a) {
                    var visibleRange = _a.visibleRange;
                    var updatedSelectedRange = visibleRange.clip(mainOverviewAxis.visibleRange);
                    var shouldUpdateSelectedRange = !updatedSelectedRange.equals(rangeSelectionModifier.selectedArea);
                    if (shouldUpdateSelectedRange) {
                        rangeSelectionModifier.selectedArea = updatedSelectedRange;
                    }
                });
                return [2 /*return*/, { sciChartSurface: sciChartSurface, xAxis: xAxis, yAxis: yAxis, rangeSelectionModifier: rangeSelectionModifier, wasmContext: wasmContext }];
        }
    });
}); };
