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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStackedRenderableSeries = void 0;
var classFactory_1 = require("../../../Builder/classFactory");
var Deleter_1 = require("../../../Core/Deleter");
var BaseType_1 = require("../../../types/BaseType");
var DataLabelProviderType_1 = require("../../../types/DataLabelProviderType");
var perfomance_1 = require("../../../utils/perfomance");
var StackedXySeriesInfo_1 = require("../../Model/ChartData/StackedXySeriesInfo");
var IDataSeries_1 = require("../../Model/IDataSeries");
var ResamplingMode_1 = require("../../Numerics/Resamplers/ResamplingMode");
var BaseRenderableSeries_1 = require("./BaseRenderableSeries");
var constants_1 = require("./constants");
var RolloverModifierRenderableSeriesProps_1 = require("./RolloverModifier/RolloverModifierRenderableSeriesProps");
/**
 * Base class for stacked mountain, column series in SciChart's High Performance Real-time
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}
 * @remarks
 * See derived types {@link StackedMountainRenderableSeries} and {@link StackedColumnRenderableSeries} for
 * details on how to implement stacked column and mountain charts in SciChart
 */
var BaseStackedRenderableSeries = /** @class */ (function (_super) {
    __extends(BaseStackedRenderableSeries, _super);
    /**
     * Creates an instance of a {@link BaseStackedRenderableSeries}
     * @param webAssemblyContext The {@link TSciChart | SciChart WebAssembly Context} containing
     * native methods and access to our WebGL2 WebAssembly Drawing Engine
     */
    function BaseStackedRenderableSeries(webAssemblyContext, options) {
        var _this = _super.call(this, webAssemblyContext, options) || this;
        /** @inheritDoc */
        _this.isStacked = true;
        _this.rolloverModifierProps = new RolloverModifierRenderableSeriesProps_1.RolloverModifierRenderableSeriesProps(_this);
        // used to track if registered types were used for function properties, so they can be serialized
        _this.typeMap = new Map();
        _this.opacityOriginalValue = 1;
        _this.isStacked = true;
        _this.accumulatedValues = new webAssemblyContext.SCRTDoubleVector();
        _this.accumulatedFinalAnimationValues = new webAssemblyContext.SCRTDoubleVector();
        if (options === null || options === void 0 ? void 0 : options.dataLabelProvider) {
            if (!("draw" in options.dataLabelProvider)) {
                if (options.dataLabelProvider.type === DataLabelProviderType_1.EDataLabelProviderType.Custom) {
                    options.dataLabelProvider = (0, classFactory_1.createType)(BaseType_1.EBaseType.DataLabelProvider, options.dataLabelProvider.customType, webAssemblyContext, options.dataLabelProvider.options);
                }
                else {
                    options.dataLabelProvider = (0, classFactory_1.createType)(BaseType_1.EBaseType.DataLabelProvider, options.dataLabelProvider.type, webAssemblyContext, options.dataLabelProvider.options);
                }
            }
        }
        _this.dataLabelProviderProperty = options === null || options === void 0 ? void 0 : options.dataLabelProvider;
        if (_this.dataLabelProviderProperty) {
            _this.dataLabelProviderProperty.onAttach(webAssemblyContext, _this);
        }
        if (options === null || options === void 0 ? void 0 : options.animation) {
            _this.animationQueue.push(options.animation);
        }
        return _this;
    }
    BaseStackedRenderableSeries.prototype.dataSeriesDataChanged = function () {
        this.notifyPropertyChanged(constants_1.PROPERTY.DATA_SERIES);
    };
    // PUBLIC
    /** @inheritdoc */
    BaseStackedRenderableSeries.prototype.draw = function (renderContext, renderPassData) {
        var _a, _b, _c, _d;
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawSingleSeriesStart, {
            contextId: this.id,
            parentContextId: (_a = this.parentSurface) === null || _a === void 0 ? void 0 : _a.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        this.currentRenderPassData = renderPassData;
        (_b = this.hitTestProvider) === null || _b === void 0 ? void 0 : _b.update(renderPassData);
        if (this.dataLabelProvider) {
            this.dataLabelProvider.generateDataLabels(renderContext, renderPassData);
            // Don't draw Text here. Renderer will call draw once all text has been created to allow for global layout adjustments
        }
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawSingleSeriesEnd, {
            contextId: this.id,
            parentContextId: (_c = this.parentSurface) === null || _c === void 0 ? void 0 : _c.id,
            relatedId: (_d = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _d === void 0 ? void 0 : _d.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
    };
    /**
     * @inheritDoc
     */
    BaseStackedRenderableSeries.prototype.delete = function () {
        this.accumulatedValues = (0, Deleter_1.deleteSafe)(this.accumulatedValues);
        this.accumulatedFinalAnimationValues = (0, Deleter_1.deleteSafe)(this.accumulatedFinalAnimationValues);
        _super.prototype.delete.call(this);
    };
    /**
     * Called when the {@link BaseStackedRenderableSeries} is detached from its parent {@link BaseStackedCollection}
     */
    BaseStackedRenderableSeries.prototype.onDetachFromParentCollection = function () {
        // console.log("onDetachFromParentCollection");
        this.parentCollection = undefined;
        this.getParentSurfaceFn = undefined;
        this.notifyParentPropertyChangedFn = undefined;
        this.delete();
    };
    /**
     * @inheritDoc
     */
    BaseStackedRenderableSeries.prototype.notifyPropertyChanged = function (propertyName) {
        this.drawingProviders.forEach(function (dp) { return dp.onSeriesPropertyChange(propertyName); });
        if (this.notifyParentPropertyChangedFn) {
            this.notifyParentPropertyChangedFn(propertyName);
        }
    };
    /** @inheritDoc */
    BaseStackedRenderableSeries.prototype.checkIsOutOfDataRange = function (xValue, yValue) {
        var length = this.getDataSeriesValuesCount();
        var isCategoryAxis = this.xAxis.getCurrentCoordinateCalculator().isCategoryCoordinateCalculator;
        var min = isCategoryAxis ? 0 : this.getNativeXValues().get(0);
        var max = isCategoryAxis ? length - 1 : this.getNativeXValues().get(length - 1);
        return xValue < min || xValue > max;
    };
    // NOT SUPPORTED METHODS BEGIN
    /**
     * getBaseXValues() is not supported for BaseStackedRenderableSeries
     */
    BaseStackedRenderableSeries.prototype.getBaseXValues = function () {
        throw Error("getBaseXValues() is not supported for BaseStackedRenderableSeries");
    };
    /**
     * hasStrokePaletteProvider() is not supported for BaseStackedRenderableSeries
     */
    BaseStackedRenderableSeries.prototype.hasStrokePaletteProvider = function () {
        throw Error("hasStrokePaletteProvider() method is not supported for BaseStackedRenderableSeries");
    };
    /**
     * hasPointMarkerPaletteProvider() is not supported for BaseStackedRenderableSeries
     */
    BaseStackedRenderableSeries.prototype.hasPointMarkerPaletteProvider = function () {
        throw Error("hasFillPaletteProvider() method is not supported for BaseStackedRenderableSeries");
    };
    /**
     * hasFillPaletteProvider() is not supported for BaseStackedRenderableSeries
     */
    BaseStackedRenderableSeries.prototype.hasFillPaletteProvider = function () {
        throw Error("hasFillPaletteProvider() method is not supported for BaseStackedRenderableSeries");
    };
    /**
     * onAttach() is not supported for BaseStackedRenderableSeries
     */
    BaseStackedRenderableSeries.prototype.onAttach = function (scs) {
        throw Error("onAttach() method is not supported for BaseStackedRenderableSeries");
    };
    /**
     * onDetach() is not supported for BaseStackedRenderableSeries
     */
    BaseStackedRenderableSeries.prototype.onDetach = function () {
        throw Error("onDetach() method is not supported for BaseStackedRenderableSeries");
    };
    Object.defineProperty(BaseStackedRenderableSeries.prototype, "resamplingMode", {
        /**
         * resamplingMode property is not supported for BaseStackedRenderableSeries
         */
        get: function () {
            return ResamplingMode_1.EResamplingMode.None;
        },
        set: function (value) {
            throw Error("Setting resamplingMode property is not supported for BaseStackedRenderableSeries");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseStackedRenderableSeries.prototype, "resamplingPrecision", {
        /**
         * resamplingPrecision property is not supported for BaseStackedRenderableSeries
         */
        get: function () {
            throw Error("resamplingPrecision property is not supported for BaseStackedRenderableSeries");
        },
        set: function (value) {
            throw Error("resamplingPrecision property is not supported for BaseStackedRenderableSeries");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseStackedRenderableSeries.prototype, "dataLabelProvider", {
        /** @inheritDoc */
        get: function () {
            return this.dataLabelProviderProperty;
        },
        /** @inheritDoc */
        set: function (provider) {
            this.dataLabelProviderProperty = provider;
            provider.onAttach(this.webAssemblyContext, this);
            this.notifyPropertyChanged(constants_1.PROPERTY.SERIES_TEXT_PROVIDER);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseStackedRenderableSeries.prototype, "parentSurface", {
        // NOT SUPPORTED METHODS END
        /**
         * @inheritDoc
         */
        get: function () {
            if (this.getParentSurfaceFn) {
                return this.getParentSurfaceFn();
            }
            else {
                return undefined;
            }
        },
        /**
         * set parentSurface property is not supported for BaseStackedRenderableSeries
         */
        set: function (value) {
            throw Error("set parentSurface property is not supported for BaseStackedRenderableSeries");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseStackedRenderableSeries.prototype, "xAxis", {
        /** @inheritDoc */
        get: function () {
            return this.parentCollection.xAxis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseStackedRenderableSeries.prototype, "yAxis", {
        /** @inheritDoc */
        get: function () {
            return this.parentCollection.yAxis;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Runs before the animation starts
     * @protected
     */
    BaseStackedRenderableSeries.prototype.beforeAnimationStart = function () {
        this.opacityOriginalValue = this.opacity;
        if (this.isRunningAnimation) {
            _super.prototype.beforeAnimationStart.call(this);
            return;
        }
        var size = this.accumulatedValues.size();
        this.accumulatedFinalAnimationValues.resize(size, 0);
        for (var i = 0; i < size; i++) {
            this.accumulatedFinalAnimationValues.set(i, this.accumulatedValues.get(i));
        }
    };
    /**
     * Runs after the animation is complete
     * @protected
     */
    BaseStackedRenderableSeries.prototype.afterAnimationComplete = function () {
        this.opacityProperty = this.opacityOriginalValue;
        if (this.isRunningAnimation) {
            _super.prototype.afterAnimationComplete.call(this);
        }
    };
    /**
     * Internal method that runs on each animation tick
     * @param progress The current animation progress, a value from 0 to 1
     * @param animationFSM The animation finite state machine
     * @protected
     */
    BaseStackedRenderableSeries.prototype.updateAnimationProperties = function (progress, animationFSM) {
        if (this.isRunningAnimation) {
            _super.prototype.updateAnimationProperties.call(this, progress, this.animationFSM);
            this.parentCollection.setAccumulatedValuesDirty();
            return;
        }
        if (animationFSM.animation.isFadeEffectAnimation) {
            this.opacity = progress * this.opacityOriginalValue;
        }
        else {
            this.opacity = this.opacityOriginalValue;
        }
        animationFSM.animation.calculateAnimationValues(this.webAssemblyContext, this.accumulatedFinalAnimationValues, this.accumulatedValues, progress);
        if (this.renderDataTransform) {
            this.renderDataTransform.requiresTransform = true;
        }
    };
    /** @inheritDoc */
    BaseStackedRenderableSeries.prototype.getSeriesInfo = function (hitTestInfo) {
        return new StackedXySeriesInfo_1.StackedXySeriesInfo(this, hitTestInfo);
    };
    /** @inheritDoc */
    BaseStackedRenderableSeries.prototype.toJSON = function (excludeData) {
        var _a, _b;
        if (excludeData === void 0) { excludeData = false; }
        var options = {
            id: this.id,
            opacity: this.opacity,
            animation: this.animation,
            // @ts-ignore
            dataLabelProvider: (_a = this.dataLabelProvider) === null || _a === void 0 ? void 0 : _a.toJSON()
        };
        if (((_b = this.dataSeries) === null || _b === void 0 ? void 0 : _b.type) === IDataSeries_1.EDataSeriesType.Xy) {
            // @ts-ignore
            return { type: this.type, options: options, xyData: this.dataSeries.toJSON(excludeData).options };
        }
        else {
            // @ts-ignore
            return { type: this.type, options: options };
        }
    };
    /**
     * toPointSeries method is not supported for BaseStackedRenderableSeries
     * @param resamplingParams
     */
    BaseStackedRenderableSeries.prototype.toPointSeries = function (resamplingParams) {
        throw Error("toPointSeries method is not supported for BaseStackedRenderableSeries");
    };
    /**
     * getCurrentRenderPassData method is not supported for BaseStackedRenderableSeries
     */
    BaseStackedRenderableSeries.prototype.getCurrentRenderPassData = function () {
        throw Error("getCurrentRenderPassData method is not supported for BaseStackedRenderableSeries");
    };
    Object.defineProperty(BaseStackedRenderableSeries.prototype, "xAxisId", {
        /**
         * xAxisId property is not supported for BaseStackedRenderableSeries,
         * instead set on the {@link StackedColumnCollection} or {@link StackedMountainCollection}
         */
        get: function () {
            var _a;
            return (_a = this.parentCollection) === null || _a === void 0 ? void 0 : _a.xAxisId;
        },
        /**
         * xAxisId property is not supported for BaseStackedRenderableSeries,
         * instead set on the {@link StackedColumnCollection} or {@link StackedMountainCollection}
         */
        set: function (value) {
            throw Error("Setting xAxisId property is not supported for BaseStackedRenderableSeries");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseStackedRenderableSeries.prototype, "yAxisId", {
        /**
         * yAxisId property is not supported for BaseStackedRenderableSeries,
         * instead set on the {@link StackedColumnCollection} or {@link StackedMountainCollection}
         */
        get: function () {
            var _a;
            return (_a = this.parentCollection) === null || _a === void 0 ? void 0 : _a.yAxisId;
        },
        /**
         * yAxisId property is not supported for BaseStackedRenderableSeries,
         * instead set on the {@link StackedColumnCollection} or {@link StackedMountainCollection}
         */
        set: function (value) {
            throw Error("yAxisId property is not supported for BaseStackedRenderableSeries");
        },
        enumerable: false,
        configurable: true
    });
    return BaseStackedRenderableSeries;
}(BaseRenderableSeries_1.BaseRenderableSeries));
exports.BaseStackedRenderableSeries = BaseStackedRenderableSeries;
