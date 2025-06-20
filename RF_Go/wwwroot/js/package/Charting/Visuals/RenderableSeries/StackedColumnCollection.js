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
exports.StackedColumnCollection = void 0;
var Deleter_1 = require("../../../Core/Deleter");
var NumberRange_1 = require("../../../Core/NumberRange");
var SeriesType_1 = require("../../../types/SeriesType");
var RenderPassData_1 = require("../../Services/RenderPassData");
var BaseRenderableSeries_1 = require("./BaseRenderableSeries");
var BaseStackedCollection_1 = require("./BaseStackedCollection");
var constants_1 = require("./constants");
var XyPointSeriesWrapped_1 = require("../../Model/PointSeries/XyPointSeriesWrapped");
var StackedCollectionDataLabelProvider_1 = require("./DataLabels/StackedCollectionDataLabelProvider");
var DataPointWidthMode_1 = require("../../../types/DataPointWidthMode");
var perfomance_1 = require("../../../utils/perfomance");
/**
 * @summary A {@link StackedColumnCollection} allows grouping multiple {@link StackedColumnRenderableSeries}
 * to create a JavaScript Stacked Column, 100 Stacked Column or Stacked Bar chart
 * @description
 * Multiple {@link StackedColumnRenderableSeries} are required to create a stacked column chart type in SciChart.
 * These are grouped with a {@link StackedColumnCollection}, which implements {@link IRenderableSeries} and may be added
 * directly to a {@link SciChartSurface.renderableSeries} collection.
 *
 * Code sample below for stacking above and below (vertical stacking)
 * ```ts
 * const stackedColumn0 = new StackedColumnRenderableSeries(wasmContext);
 * stackedColumn0.stackedGroupId = "group one"; // Same group ID means stack vertically
 * const stackedColumn1 = new StackedColumnRenderableSeries(wasmContext);
 * stackedColumn1.stackedGroupId = "group one"; // Same group ID means stack vertically
 * const stackedColumn2 = new StackedColumnRenderableSeries(wasmContext);
 * stackedColumn2.stackedGroupId = "group one"; // Same group ID means stack vertically
 * const stackedColumnCollection = new StackedColumnCollection(wasmContext);
 * stackedColumnCollection.add(stackedColumn0, stackedColumn1, stackedColumn2);
 *
 * sciChartSurface.renderableSeries.add(stackedColumnCollection);
 * ````
 *
 *  Code sample below for stacking side by side (horizontal stacking)
 * ```ts
 * const stackedColumn0 = new StackedColumnRenderableSeries(wasmContext);
 * stackedColumn0.stackedGroupId = "group one"; // Different group ID means stack horizontally
 * const stackedColumn1 = new StackedColumnRenderableSeries(wasmContext);
 * stackedColumn1.stackedGroupId = "group two"; // Different group ID means stack horizontally
 * const stackedColumn2 = new StackedColumnRenderableSeries(wasmContext);
 * stackedColumn2.stackedGroupId = "group three"; // Different group ID means stack horizontally
 * const stackedColumnCollection = new StackedColumnCollection(wasmContext);
 * stackedColumnCollection.add(stackedColumn0, stackedColumn1, stackedColumn2);
 *
 * sciChartSurface.renderableSeries.add(stackedColumnCollection);
 * ````
 * @remarks This type implements {@link IRenderableSeries} but it is not a renderable series, instead it wraps multiple
 * {@link StackedColumnRenderableSeries} to create a stacked column chart
 */
var StackedColumnCollection = /** @class */ (function (_super) {
    __extends(StackedColumnCollection, _super);
    /**
     * Creates an instance of the {@link StackedColumnCollection}
     * @param webAssemblyContext The {@link TSciChart | SciChart WebAssembly Context} containing
     * native methods and access to our WebGL2 WebAssembly Drawing Engine
     * @param options Optional parameters of type {@link IStackedColumnCollectionOptions} to configure the series
     */
    function StackedColumnCollection(webAssemblyContext, options) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        _this = _super.call(this, webAssemblyContext, options) || this;
        _this.type = SeriesType_1.ESeriesType.StackedColumnCollection;
        _this.seriesGroups = {};
        _this.dataPointWidthProperty = 0.5;
        _this.dataPointWidthModeProperty = DataPointWidthMode_1.EDataPointWidthMode.Relative;
        _this.zeroLineYProperty = 0;
        _this.dataPointWidthProperty = (_a = options === null || options === void 0 ? void 0 : options.dataPointWidth) !== null && _a !== void 0 ? _a : _this.dataPointWidthProperty;
        _this.dataPointWidthMode = (_b = options === null || options === void 0 ? void 0 : options.dataPointWidthMode) !== null && _b !== void 0 ? _b : _this.dataPointWidthModeProperty;
        _this.zeroLineYProperty = (_c = options === null || options === void 0 ? void 0 : options.zeroLineY) !== null && _c !== void 0 ? _c : _this.zeroLineYProperty;
        _this.spacingProperty = (_e = (_d = options === null || options === void 0 ? void 0 : options.spacing) !== null && _d !== void 0 ? _d : _this.spacingProperty) !== null && _e !== void 0 ? _e : 0;
        _this.getColumnWidth = _this.getColumnWidth.bind(_this);
        _this.detachChildSeries = _this.detachChildSeries.bind(_this);
        _this.attachChildSeries = _this.attachChildSeries.bind(_this);
        _this.collectionChanged.subscribe(function (arg) {
            var _a, _b;
            (_a = arg.getOldItems()) === null || _a === void 0 ? void 0 : _a.forEach(_this.detachChildSeries);
            (_b = arg.getNewItems()) === null || _b === void 0 ? void 0 : _b.forEach(_this.attachChildSeries);
        });
        // @ts-ignore
        _this.dataLabelProvider = new StackedCollectionDataLabelProvider_1.StackedCollectionDataLabelProvider();
        _this.dataLabelProviderProperty.onAttach(_this.webAssemblyContext, _this);
        return _this;
    }
    /** @inheritDoc */
    StackedColumnCollection.prototype.delete = function () {
        this.nativeDrawingProvider = (0, Deleter_1.deleteSafe)(this.nativeDrawingProvider);
        _super.prototype.delete.call(this);
    };
    /** @inheritDoc */
    StackedColumnCollection.prototype.updateAccumulatedVectors = function () {
        var _this = this;
        var dataValuesCount = this.getDataSeriesValuesCount();
        if (!this.isAccumulatedVectorDirty || !dataValuesCount) {
            return;
        }
        this.checkXValuesCorrect();
        this.isAccumulatedVectorDirty = false;
        this.clearAccumulatedVectors(dataValuesCount);
        // GROUP SERIES BY STACKED_GROUP_ID
        this.updateGroups();
        var seriesGroups = this.seriesGroups;
        var seriesGroupsCount = this.getGroupsCount();
        Object.keys(seriesGroups).forEach(function (key, groupIndex) {
            var seriesList = seriesGroups[key];
            seriesList.forEach(function (rs) {
                rs.setGroupsCount(seriesGroupsCount);
                rs.setGroupIndex(groupIndex);
            });
        });
        var _loop_1 = function (i) {
            this_1.accumulatedValues0.push_back(this_1.zeroLineY);
            Object.keys(seriesGroups).forEach(function (key) {
                var seriesList = seriesGroups[key];
                var sum;
                if (_this.isOneHundredPercent) {
                    sum = seriesList.reduce(function (prev, cur) { return prev + cur.dataSeries.getNativeYValues().get(i); }, 0);
                }
                var previous = 0;
                seriesList.forEach(function (rs) {
                    var currentY = rs.dataSeries.getNativeYValues().get(i);
                    if (_this.isOneHundredPercent) {
                        currentY = (currentY * 100) / sum;
                    }
                    var current = previous + currentY;
                    rs.accumulatedValues.push_back(current);
                    previous = current;
                });
            });
        };
        var this_1 = this;
        for (var i = 0; i < dataValuesCount; i++) {
            _loop_1(i);
        }
    };
    /** @inheritDoc */
    StackedColumnCollection.prototype.draw = function (renderContext, renderPassData) {
        var _this = this;
        var _a, _b, _c;
        if (this.canDraw) {
            this.updateHitTestProviders(renderPassData);
            if (!this.isEnoughDataToDraw()) {
                return;
            }
            var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawCollectionSeriesStart, {
                contextId: this.id,
                parentContextId: (_a = this.parentSurface) === null || _a === void 0 ? void 0 : _a.id,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
            this.updateAccumulatedVectors();
            var isCategoryAxis = renderPassData.xCoordinateCalculator.isCategoryCoordinateCalculator;
            var firstDataSeries = this.getFirstSeries().dataSeries;
            var viewRect_1 = this.parentSurface.seriesViewRect;
            if (firstDataSeries === null || firstDataSeries === void 0 ? void 0 : firstDataSeries.fifoCapacity) {
                throw new Error("Sorry, fifo is not currently supported for stacked series");
            }
            var isVerticalChart_1 = renderPassData.isVerticalChart, xCoordinateCalculator_1 = renderPassData.xCoordinateCalculator, yCoordinateCalculator_1 = renderPassData.yCoordinateCalculator;
            var xValues_1 = isCategoryAxis ? firstDataSeries.getNativeIndexes() : firstDataSeries.getNativeXValues();
            var seriesGroups_1 = this.seriesGroups;
            var stackedColumnsCount_1 = this.getGroupsCount();
            var columnWidth_1 = this.getColumnWidth(xCoordinateCalculator_1);
            Object.keys(seriesGroups_1).forEach(function (key, groupIndex) {
                var seriesArray = seriesGroups_1[key];
                var previousEl;
                seriesArray.forEach(function (el, seriesIndex) {
                    var _a;
                    var bottomVector = seriesIndex === 0 ? _this.accumulatedValues0 : previousEl.accumulatedValues;
                    var topVector = el.accumulatedValues;
                    // pass topVector to dataLabelProvider for use as y position values
                    // Use the helper method to set data label provider properties
                    _this.setDataLabelProviderProperties(el.dataLabelProvider, topVector, groupIndex, stackedColumnsCount_1, columnWidth_1, _this.spacingProperty, _this.isOneHundredPercent);
                    el.dataLabelProvider.generateDataLabels(renderContext, new RenderPassData_1.RenderPassData((_a = el.dataSeries) === null || _a === void 0 ? void 0 : _a.getIndicesRange(_this.xAxis.visibleRange, _this.xAxis.isCategoryAxis), _this.xAxis.getCurrentCoordinateCalculator, _this.yAxis.getCurrentCoordinateCalculator, _this.xAxis.isVerticalChart, new XyPointSeriesWrapped_1.XyPointSeriesWrapped(el.dataSeries)));
                    drawColumns(_this.webAssemblyContext, renderContext, xCoordinateCalculator_1, yCoordinateCalculator_1, isVerticalChart_1, _this.nativeDrawingProvider, xValues_1, bottomVector, topVector, el.getFillBrush(), el.getStrokePen(), viewRect_1, columnWidth_1, _this.spacingProperty, stackedColumnsCount_1, groupIndex);
                    previousEl = el;
                });
            });
            perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DrawCollectionSeriesEnd, {
                contextId: this.id,
                parentContextId: (_b = this.parentSurface) === null || _b === void 0 ? void 0 : _b.id,
                relatedId: (_c = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _c === void 0 ? void 0 : _c.relatedId,
                level: perfomance_1.EPerformanceDebugLevel.Verbose
            });
        }
    };
    /** @inheritDoc */
    StackedColumnCollection.prototype.getXRange = function () {
        if (!this.isEnoughDataToDraw()) {
            return new NumberRange_1.NumberRange();
        }
        var range = this.getFirstSeries().dataSeries.xRange;
        var count = this.getFirstSeries().dataSeries.count();
        // Range
        var additionalValue = this.dataPointWidth / 2;
        if (this.dataPointWidthMode === DataPointWidthMode_1.EDataPointWidthMode.Relative) {
            if (count > 1) {
                additionalValue = ((range.diff / (count - 1)) * this.dataPointWidth) / 2;
            }
            else {
                additionalValue = 0;
            }
        }
        if (this.dataPointWidthMode === DataPointWidthMode_1.EDataPointWidthMode.Absolute) {
            var cc = this.xAxis.getCurrentCoordinateCalculator();
            var dataWidth = cc.getDataValue(this.dataPointWidth) - cc.getDataValue(0);
            additionalValue = dataWidth / 2;
        }
        return new NumberRange_1.NumberRange(range.min - additionalValue, range.max + additionalValue);
    };
    /** @inheritDoc */
    StackedColumnCollection.prototype.getYRange = function (xVisibleRange, isXCategoryAxis) {
        var yRange = _super.prototype.getYRange.call(this, xVisibleRange, isXCategoryAxis);
        return new NumberRange_1.NumberRange(Math.min(yRange.min, this.zeroLineY), Math.max(yRange.max, this.zeroLineY));
    };
    /** @inheritDoc */
    StackedColumnCollection.prototype.onAttach = function (scs) {
        _super.prototype.onAttach.call(this, scs);
        this.nativeDrawingProvider = new this.webAssemblyContext.SCRTStackedColumnSeriesDrawingProvider();
    };
    /** @inheritDoc */
    StackedColumnCollection.prototype.notifyPropertyChanged = function (propertyName) {
        _super.prototype.notifyPropertyChanged.call(this, propertyName);
        if (propertyName === constants_1.PROPERTY.DATA_SERIES ||
            propertyName === constants_1.PROPERTY.IS_VISIBLE ||
            propertyName === constants_1.PROPERTY.IS_ONE_HUNDRED_PERCENT ||
            propertyName === constants_1.PROPERTY.STACKED_GROUP_ID) {
            this.isAccumulatedVectorDirty = true;
        }
    };
    /** @inheritDoc */
    StackedColumnCollection.prototype.hasDataSeriesValues = function () {
        return this.isEnoughDataToDraw();
    };
    /**
     * Called internally - gets the column width in pixels
     * @param xCoordinateCalculator The current XAxis {@link CoordinateCalculatorBase}
     */
    StackedColumnCollection.prototype.getColumnWidth = function (xCoordinateCalculator) {
        var widthFraction = this.dataPointWidth;
        var widthMode = this.dataPointWidthMode;
        var firstDataSeries = this.getFirstSeries().dataSeries;
        var isCategoryAxis = xCoordinateCalculator.isCategoryCoordinateCalculator;
        var xValues = isCategoryAxis ? firstDataSeries.getNativeIndexes() : firstDataSeries.getNativeXValues();
        var viewRect = this.parentSurface.seriesViewRect;
        var stackedColumnsCount = this.getGroupsCount();
        if (widthMode === DataPointWidthMode_1.EDataPointWidthMode.Range) {
            var range = xCoordinateCalculator.visibleMax - xCoordinateCalculator.visibleMin;
            // This treats dataPointWidth as "xRange per column"
            return ((xCoordinateCalculator.viewportDimension / range) * widthFraction) / stackedColumnsCount;
        }
        else if (widthMode === DataPointWidthMode_1.EDataPointWidthMode.Absolute) {
            return widthFraction / stackedColumnsCount;
        }
        else {
            return ((0, BaseRenderableSeries_1.getDataPointWidth)(xValues, xCoordinateCalculator, viewRect.width, widthFraction, isCategoryAxis, this.webAssemblyContext) / stackedColumnsCount);
        }
    };
    /** @inheritDoc */
    StackedColumnCollection.prototype.toJSON = function (excludeData) {
        if (excludeData === void 0) { excludeData = false; }
        var json = _super.prototype.toJSON.call(this, excludeData);
        var options = {
            dataPointWidth: this.dataPointWidth,
            dataPointWidthMode: this.dataPointWidthMode,
            zeroLineY: this.zeroLineY,
            spacing: this.spacingProperty
            // dataLabels: this.dataLabelProvider
        };
        Object.assign(json.options, options);
        return json;
    };
    Object.defineProperty(StackedColumnCollection.prototype, "dataPointWidth", {
        // PROPERTIES
        /**
         * Gets or sets the Datapoint width, as a fraction of available space from 0.0 - 1.0
         */
        get: function () {
            return this.dataPointWidthProperty;
        },
        /**
         * Gets or sets the Datapoint width, as a fraction of available space from 0.0 - 1.0
         */
        set: function (dataPointWidth) {
            this.dataPointWidthProperty = dataPointWidth;
            this.notifyPropertyChanged(constants_1.PROPERTY.DATA_POINT_WIDTH);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StackedColumnCollection.prototype, "dataPointWidthMode", {
        /**
         * Gets or sets the mode which determines how dataPointWidth is interpreted. Available values are {@link EDataPointWidthMode}.  Default Relative.
         */
        get: function () {
            return this.dataPointWidthModeProperty;
        },
        /**
         * Gets or sets the mode which determines how dataPointWidth is interpreted. Available values are {@link EDataPointWidthMode}.  Default Relative.
         */
        set: function (value) {
            this.dataPointWidthModeProperty = value;
            this.notifyPropertyChanged(constants_1.PROPERTY.DATA_POINT_WIDTH_MODE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StackedColumnCollection.prototype, "zeroLineY", {
        /**
         * Gets or sets the Zero-line Y, the Y-value where the mountain crosses zero and inverts. Default is 0
         */
        get: function () {
            return this.zeroLineYProperty;
        },
        /**
         * Gets or sets the Zero-line Y, the Y-value where the mountain crosses zero and inverts. Default is 0
         */
        set: function (zeroLineY) {
            this.zeroLineYProperty = zeroLineY;
            this.notifyPropertyChanged(constants_1.PROPERTY.ZERO_LINE_Y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StackedColumnCollection.prototype, "spacing", {
        /**
         * Gets the spacing between columns in pixels
         */
        get: function () {
            return this.spacingProperty;
        },
        /**
         * Sets the spacing between columns in pixels
         */
        set: function (spacing) {
            this.spacingProperty = spacing;
            this.notifyPropertyChanged(constants_1.PROPERTY.SPACING);
        },
        enumerable: false,
        configurable: true
    });
    // PROTECTED
    // PRIVATE
    StackedColumnCollection.prototype.detachChildSeries = function (series) {
        series.onDetachFromParentCollection();
        this.isAccumulatedVectorDirty = true;
        this.invalidateParent();
    };
    StackedColumnCollection.prototype.attachChildSeries = function (series) {
        series.onAttachToParentCollection(this, this.getParentSurface, this.notifyPropertyChanged, this.getColumnWidth);
        this.isAccumulatedVectorDirty = true;
        this.invalidateParent();
    };
    StackedColumnCollection.prototype.checkXValuesCorrect = function () {
        var length = this.getDataSeriesValuesCount();
        this.getVisibleSeries().forEach(function (el) {
            var _a;
            if (!(((_a = el.dataSeries) === null || _a === void 0 ? void 0 : _a.count()) === length)) {
                throw Error("All stacked series in on collection should have the same amount of X Values");
            }
        });
    };
    StackedColumnCollection.prototype.setDataLabelProviderProperties = function (dataLabelProvider, topVector, groupIndex, groupSize, columnWidth, spacing, isOneHundredPercent) {
        dataLabelProvider.topVector = topVector;
        dataLabelProvider.groupIndex = groupIndex;
        dataLabelProvider.groupSize = groupSize;
        dataLabelProvider.columnWidth = columnWidth;
        dataLabelProvider.spacing = spacing;
        dataLabelProvider.isOneHundredPercent = isOneHundredPercent;
    };
    /**
     * @param numberOfElements - number of element expected is used for performance to reserve memory
     */
    StackedColumnCollection.prototype.clearAccumulatedVectors = function (numberOfElements) {
        this.accumulatedValues0.clear();
        this.accumulatedValues0.reserve(numberOfElements);
        this.asArray().forEach(function (el) {
            el.accumulatedValues.clear();
            el.accumulatedValues.reserve(numberOfElements);
        });
    };
    StackedColumnCollection.prototype.getLastVisibleSeries = function () {
        var lastItem = this.getVisibleSeries().slice(-1)[0];
        return lastItem;
    };
    /**
     * @description Group series by stackedGroupId
     */
    StackedColumnCollection.prototype.updateGroups = function () {
        var seriesGroups = {};
        this.getVisibleSeries().forEach(function (el) {
            var stackedColumnId = el.stackedGroupId;
            if (!seriesGroups[stackedColumnId]) {
                seriesGroups[stackedColumnId] = [];
            }
            seriesGroups[stackedColumnId].push(el);
        });
        this.seriesGroups = seriesGroups;
    };
    StackedColumnCollection.prototype.getGroupsCount = function () {
        return Object.keys(this.seriesGroups).length;
    };
    return StackedColumnCollection;
}(BaseStackedCollection_1.BaseStackedCollection));
exports.StackedColumnCollection = StackedColumnCollection;
/** @ignore */
var drawColumns = function (wasmContext, renderContext, xCoordinateCalculator, yCoordinateCalculator, isVerticalChart, nativeDrawingProvider, xValues, yValues, y1Values, fillBrush, strokePen, viewRect, columnWidth, spacing, stackedGroupCount, stackedGroupIndex) {
    var args = new wasmContext.SCRTStackedColumnDrawingParams();
    args.count = xValues.size();
    args.columnWidth = columnWidth <= 0 ? 1 : columnWidth;
    args.spacing = spacing;
    args.viewportWidth = viewRect.width;
    args.viewportHeight = viewRect.height;
    args.verticalChart = isVerticalChart;
    // TODO: fix stacked group
    args.stackedGroupCount = stackedGroupCount;
    args.stackedGroupIndex = stackedGroupIndex;
    args.forceShaderMethod = true;
    if (strokePen) {
        args.SetLinesPen(strokePen);
    }
    if (fillBrush) {
        args.SetFillBrush(fillBrush);
    }
    var nativeContext = renderContext.getNativeContext();
    nativeDrawingProvider.DrawPointsVec(nativeContext, xValues, y1Values, yValues, xCoordinateCalculator.nativeCalculator, yCoordinateCalculator.nativeCalculator, args);
    args.delete();
};
