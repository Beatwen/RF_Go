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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWindowedYRange = exports.getIndicesRange = exports.BaseDataSeries = void 0;
var classFactory_1 = require("../../Builder/classFactory");
var DeletableEntity_1 = require("../../Core/DeletableEntity");
var Deleter_1 = require("../../Core/Deleter");
var EventHandler_1 = require("../../Core/EventHandler");
var Guard_1 = require("../../Core/Guard");
var NumberRange_1 = require("../../Core/NumberRange");
var BaseType_1 = require("../../types/BaseType");
var SearchMode_1 = require("../../types/SearchMode");
var YRangeMode_1 = require("../../types/YRangeMode");
var array_1 = require("../../utils/array");
var copyVector_1 = require("../../utils/copyVector");
var guid_1 = require("../../utils/guid");
var isRealNumber_1 = require("../../utils/isRealNumber");
var DataDistributionCalculator_1 = require("./DataDistributionCalculator/DataDistributionCalculator");
var DoubleVectorProvider_1 = require("./DoubleVectorProvider");
var IDataSeries_1 = require("./IDataSeries");
var IPointMetadata_1 = require("./IPointMetadata");
/**
 * The base class for DataSeries in SciChart's
 * {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}
 * @remarks
 * A DataSeries stores the data to render. This is independent from the {@link IRenderableSeries | RenderableSeries}
 * which defines how that data should be rendered.
 *
 * See derived types of {@link BaseDataSeries} to find out what data-series are available.
 * See derived types of {@link IRenderableSeries} to find out what 2D JavaScript Chart types are available.
 */
var BaseDataSeries = /** @class */ (function (_super) {
    __extends(BaseDataSeries, _super);
    /**
     * Creates an instance of {@link BaseDataSeries}
     * @param webAssemblyContext the {@link TSciChart | SciChart WebAssembly Context} containing native methods
     * and access to our underlying WebGL2 rendering engine
     * @param options the {@link IBaseDataSeriesOptions} which can be passed to config the DataSeries at construct time
     */
    function BaseDataSeries(webAssemblyContext, options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g;
        _this = _super.call(this) || this;
        /** @inheritDoc */
        _this.dataChanged = new EventHandler_1.EventHandler();
        /** @inheritDoc */
        _this.dataDistributionCalculator = new DataDistributionCalculator_1.DataDistributionCalculator();
        _this.minXSpacing = 0;
        _this.doubleVectorProvider = new DoubleVectorProvider_1.DoubleVectorProvider();
        _this.isSortedProperty = undefined;
        _this.containsNaNProperty = undefined;
        _this.isEvenlySpacedProperty = false;
        _this.metadataGeneratorProperty = undefined;
        _this.changeCountProperty = 0;
        _this.fifoCapacityProperty = undefined;
        _this.fifoSweepingProperty = false;
        _this.fifoSweepingGapProperty = 1;
        _this.webAssemblyContext = webAssemblyContext;
        _this.id = (_a = options === null || options === void 0 ? void 0 : options.id) !== null && _a !== void 0 ? _a : (0, guid_1.generateGuid)();
        if (options === null || options === void 0 ? void 0 : options.fifoCapacity) {
            _this.fifoCapacityProperty = options.fifoCapacity;
            _this.doubleVectorProvider = new DoubleVectorProvider_1.FIFOVectorProvider(options.fifoCapacity);
        }
        else {
            var initialCapacity = _this.calculateInitialCapacity(options);
            Guard_1.Guard.argumentIsRealInteger(initialCapacity, "initialCapacity");
            _this.doubleVectorProvider.capacity = initialCapacity;
        }
        _this.fifoSweepingProperty = (options === null || options === void 0 ? void 0 : options.fifoSweeping) || _this.fifoSweepingProperty;
        _this.fifoSweepingGapProperty = (options === null || options === void 0 ? void 0 : options.fifoSweepingGap) || _this.fifoSweepingGapProperty;
        _this.xValues = _this.doubleVectorProvider.getDoubleVector(webAssemblyContext);
        _this.yValues = _this.doubleVectorProvider.getDoubleVector(webAssemblyContext);
        // Indexes do not need to be fifo
        _this.indexes = new webAssemblyContext.SCRTDoubleVector();
        _this.dataSeriesNameProperty = (_b = options === null || options === void 0 ? void 0 : options.dataSeriesName) !== null && _b !== void 0 ? _b : _this.dataSeriesNameProperty;
        _this.isSorted = (_d = (_c = options === null || options === void 0 ? void 0 : options.dataIsSortedInX) !== null && _c !== void 0 ? _c : options === null || options === void 0 ? void 0 : options.isSorted) !== null && _d !== void 0 ? _d : _this.isSortedProperty;
        _this.containsNaN = (_e = options === null || options === void 0 ? void 0 : options.containsNaN) !== null && _e !== void 0 ? _e : _this.containsNaNProperty;
        _this.isEvenlySpaced = (_f = options === null || options === void 0 ? void 0 : options.dataEvenlySpacedInX) !== null && _f !== void 0 ? _f : _this.isEvenlySpacedProperty;
        if (options === null || options === void 0 ? void 0 : options.metadata) {
            if ("type" in options.metadata) {
                _this.metadataGeneratorProperty = (0, classFactory_1.createType)(BaseType_1.EBaseType.MetadataGenerator, options.metadata.type, webAssemblyContext, options.metadata.data);
                options.metadata = (_g = _this.metadataGeneratorProperty) === null || _g === void 0 ? void 0 : _g.getMetadata();
            }
            else if (!Array.isArray(options === null || options === void 0 ? void 0 : options.metadata)) {
                _this.metadataGeneratorProperty = new IPointMetadata_1.TemplateMetadataGenerator(options === null || options === void 0 ? void 0 : options.metadata);
                options.metadata = undefined;
            }
        }
        return _this;
    }
    /** @inheritDoc */
    BaseDataSeries.prototype.clear = function () {
        var _a;
        (_a = this.indexes) === null || _a === void 0 ? void 0 : _a.clear();
        this.dataDistributionCalculator.clear(this.isSorted, this.containsNaN);
    };
    Object.defineProperty(BaseDataSeries.prototype, "capacity", {
        /**
         * Gets or sets the capacity of data-points in the DataSeries
         */
        get: function () {
            return this.xValues.capacity();
        },
        /**
         * Gets or sets the capacity of data-points in the DataSeries
         */
        set: function (value) {
            if (value > this.capacity) {
                this.reserve(value);
            }
            // TODO Not sure whether this is needed
            // this.notifyDataChanged(EDataChangeType.Property, undefined, undefined, "capacity");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseDataSeries.prototype, "containsNaN", {
        /** @inheritDoc */
        get: function () {
            return this.containsNaNProperty;
        },
        /** @inheritDoc */
        set: function (containsNaN) {
            this.containsNaNProperty = containsNaN;
            if (containsNaN !== undefined) {
                this.dataDistributionCalculator.setContainsNaN(containsNaN);
            }
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Property, undefined, undefined, "containsNaN");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseDataSeries.prototype, "isSorted", {
        /** @inheritDoc */
        get: function () {
            return this.isSortedProperty;
        },
        /** @inheritDoc */
        set: function (isSorted) {
            this.isSortedProperty = isSorted;
            if (isSorted !== undefined) {
                this.dataDistributionCalculator.setIsSortedAscending(isSorted);
            }
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Property, undefined, undefined, "isSorted");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseDataSeries.prototype, "isEvenlySpaced", {
        /** @inheritDoc */
        get: function () {
            return this.isEvenlySpacedProperty;
        },
        /** @inheritDoc */
        set: function (isSorted) {
            this.isEvenlySpacedProperty = isSorted;
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Property, undefined, undefined, "isEvenlySpaced");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseDataSeries.prototype, "dataSeriesName", {
        /** @inheritDoc */
        get: function () {
            return this.dataSeriesNameProperty;
        },
        /** @inheritDoc */
        set: function (dataSeriesName) {
            this.dataSeriesNameProperty = dataSeriesName;
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Property, undefined, undefined, "dataSeriesName");
        },
        enumerable: false,
        configurable: true
    });
    /** @inheritDoc */
    BaseDataSeries.prototype.count = function () {
        if (this.xValues) {
            return this.xValues.size();
        }
        return 0;
    };
    /** @inheritDoc */
    BaseDataSeries.prototype.getIsDeleted = function () {
        return this.isDeleted;
    };
    Object.defineProperty(BaseDataSeries.prototype, "fifoCapacity", {
        /** @inheritDoc */
        get: function () {
            return this.fifoCapacityProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseDataSeries.prototype, "fifoStartIndex", {
        /** @inheritDoc */
        get: function () {
            return this.fifoCapacity > 0 ? this.xValues.getStartIndex() : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseDataSeries.prototype, "fifoSweeping", {
        /** @inheritDoc */
        get: function () {
            return this.fifoCapacity && this.fifoSweepingProperty;
        },
        /** @inheritDoc */
        set: function (enabled) {
            this.fifoSweepingProperty = enabled;
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Property, undefined, undefined, "fifoSweeping");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseDataSeries.prototype, "fifoSweepingGap", {
        /** @inheritDoc */
        get: function () {
            return this.fifoSweepingGapProperty;
        },
        /** @inheritDoc */
        set: function (fifoSweepingGap) {
            this.fifoSweepingGapProperty = fifoSweepingGap;
            this.notifyDataChanged(IDataSeries_1.EDataChangeType.Property, undefined, undefined, "fifoSweepingGap");
        },
        enumerable: false,
        configurable: true
    });
    /** @inheritDoc */
    BaseDataSeries.prototype.getNativeIndexes = function () {
        if (!this.indexes) {
            return undefined;
        }
        var expectedDataSeriesSize = this.count();
        var currentIndexesSize = this.indexes.size();
        if (currentIndexesSize < expectedDataSeriesSize) {
            this.webAssemblyContext.SCRTFillVectorSequential(this.indexes, expectedDataSeriesSize);
        }
        else if (currentIndexesSize > expectedDataSeriesSize) {
            this.indexes.resizeFast(expectedDataSeriesSize);
        }
        return this.indexes;
    };
    /** @inheritDoc */
    BaseDataSeries.prototype.getNativeXValues = function () {
        return this.xValues;
    };
    /** @inheritDoc */
    BaseDataSeries.prototype.getNativeValue = function (values, index) {
        // @ts-ignore
        if (!this.fifoSweeping || !values.getRaw) {
            return values.get(index);
        }
        else {
            return values.getRaw(index);
        }
    };
    /** @inheritDoc */
    BaseDataSeries.prototype.getNativeYValues = function () {
        return this.yValues;
    };
    /** @inheritDoc */
    BaseDataSeries.prototype.delete = function () {
        this.xValues = (0, Deleter_1.deleteSafe)(this.xValues);
        this.yValues = (0, Deleter_1.deleteSafe)(this.yValues);
        this.indexes = (0, Deleter_1.deleteSafe)(this.indexes);
        this.xInitialAnimationValues = (0, Deleter_1.deleteSafe)(this.xInitialAnimationValues);
        this.yInitialAnimationValues = (0, Deleter_1.deleteSafe)(this.yInitialAnimationValues);
        this.xFinalAnimationValues = (0, Deleter_1.deleteSafe)(this.xFinalAnimationValues);
        this.yFinalAnimationValues = (0, Deleter_1.deleteSafe)(this.yFinalAnimationValues);
        this.setMetadata(undefined);
        this.isDeleted = true;
    };
    /**
     * Call to notify subscribers of {@link dataChanged} that the data has changed and {@link SciChartSurface} needs redrawing
     */
    BaseDataSeries.prototype.notifyDataChanged = function (changeType, index, count, name) {
        this.changeCountProperty++;
        this.dataChanged.raiseEvent({ changeType: changeType, index: index, count: count });
    };
    Object.defineProperty(BaseDataSeries.prototype, "xRange", {
        /** @inheritDoc */
        get: function () {
            return this.getXRange();
        },
        enumerable: false,
        configurable: true
    });
    /** @inheritDoc */
    BaseDataSeries.prototype.getXRange = function (dataSeriesValueType) {
        var xValues = this.getXValues(dataSeriesValueType);
        var temp;
        if (this.count() === 1) {
            var min = xValues.get(0) - 1;
            var max = xValues.get(0) + 1;
            return new NumberRange_1.NumberRange(min, max);
        }
        else if (this.count() > 1) {
            var min = xValues.get(0);
            var max = xValues.get(this.count() - 1);
            if (!this.dataDistributionCalculator.isSortedAscending) {
                var minMax = void 0;
                try {
                    minMax = this.webAssemblyContext.NumberUtil.MinMax(this.getNativeXValues());
                    if (!(0, isRealNumber_1.isRealNumber)(minMax.minD) || !(0, isRealNumber_1.isRealNumber)(minMax.maxD)) {
                        return new NumberRange_1.NumberRange(0, 0);
                    }
                    min = minMax.minD;
                    max = minMax.maxD;
                }
                finally {
                    (0, Deleter_1.deleteSafe)(minMax);
                }
            }
            if (min === max) {
                return new NumberRange_1.NumberRange(min - 1, max + 1);
            }
            else if (min > max) {
                temp = min;
                min = max;
                max = temp;
            }
            return new NumberRange_1.NumberRange(min, max);
        }
        return new NumberRange_1.NumberRange(0, 0);
    };
    /** @inheritDoc */
    BaseDataSeries.prototype.getWindowedYRange = function (xRange, getPositiveRange, isXCategoryAxis, dataSeriesValueType, yRangeMode) {
        if (isXCategoryAxis === void 0) { isXCategoryAxis = false; }
        if (dataSeriesValueType === void 0) { dataSeriesValueType = IDataSeries_1.EDataSeriesValueType.Default; }
        if (yRangeMode === void 0) { yRangeMode = YRangeMode_1.EYRangeMode.Visible; }
        var xValues = this.getXValues(dataSeriesValueType);
        var yValues = this.getYValues(dataSeriesValueType);
        return (0, exports.getWindowedYRange)(this.webAssemblyContext, xValues, yValues, xRange, getPositiveRange, isXCategoryAxis, this.dataDistributionCalculator.isSortedAscending, yRangeMode === YRangeMode_1.EYRangeMode.Visible ? SearchMode_1.ESearchMode.RoundUp : SearchMode_1.ESearchMode.RoundDown, yRangeMode === YRangeMode_1.EYRangeMode.Visible ? SearchMode_1.ESearchMode.RoundDown : SearchMode_1.ESearchMode.RoundUp);
    };
    /** @inheritDoc */
    BaseDataSeries.prototype.getIndicesRange = function (xRange, isCategoryData, downSearchMode, upSearchMode) {
        if (isCategoryData === void 0) { isCategoryData = false; }
        if (downSearchMode === void 0) { downSearchMode = SearchMode_1.ESearchMode.RoundDown; }
        if (upSearchMode === void 0) { upSearchMode = SearchMode_1.ESearchMode.RoundUp; }
        // TODO SearchMode downSearchMode = SearchMode.RoundDown, SearchMode upSearchMode = SearchMode.RoundUp
        var vector = isCategoryData ? this.getNativeIndexes() : this.xValues;
        return (0, exports.getIndicesRange)(this.webAssemblyContext, vector, xRange, this.dataDistributionCalculator.isSortedAscending, downSearchMode, upSearchMode);
    };
    Object.defineProperty(BaseDataSeries.prototype, "hasValues", {
        /** @inheritDoc */
        get: function () {
            return this.count() > 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Check if the series has an existing metadataGenerator
     */
    BaseDataSeries.prototype.hasMetadataGenerator = function () {
        return typeof this.metadataGeneratorProperty !== "undefined";
    };
    /**
     * Sets a function that will be used to generate metadata for values when they are appended/inserted, if no explicit metadata is supplied.
     * @param generator
     */
    BaseDataSeries.prototype.setMetadataGenerator = function (generator) {
        var _this = this;
        var newGenerator = !this.hasMetadataGenerator();
        this.metadataGeneratorProperty = generator;
        if (newGenerator && !this.metadataProperty) {
            var metadata = Array(this.xValues.size())
                .fill(1)
                .map(function (x) { return _this.metadataGeneratorProperty.getSingleMetadata(); });
            this.metadataProperty = metadata;
        }
    };
    /**
     * Gets the metadata by index
     * @param index The X index
     */
    BaseDataSeries.prototype.getMetadataAt = function (index, ignoreFifo) {
        if (ignoreFifo === void 0) { ignoreFifo = false; }
        this.validateIndex(index);
        if (!this.metadataProperty) {
            return undefined;
        }
        if (this.fifoCapacity && !ignoreFifo) {
            var fifoIndex = (this.xValues.getStartIndex() + index) % this.fifoCapacity;
            return this.metadataProperty[fifoIndex];
        }
        else {
            return this.metadataProperty[index];
        }
    };
    /**
     * Gets the metadata array length
     */
    BaseDataSeries.prototype.getMetadataLength = function () {
        if (!this.metadataProperty) {
            return this.count();
        }
        return this.metadataProperty.length;
    };
    Object.defineProperty(BaseDataSeries.prototype, "hasMetadata", {
        /**
         * Check if the series has an existing metadata
         */
        get: function () {
            return this.metadataProperty !== undefined;
        },
        enumerable: false,
        configurable: true
    });
    BaseDataSeries.prototype.createAnimationVectors = function () {
        this.xInitialAnimationValues = this.doubleVectorProvider.getDoubleVector(this.webAssemblyContext);
        this.yInitialAnimationValues = this.doubleVectorProvider.getDoubleVector(this.webAssemblyContext);
        this.xFinalAnimationValues = this.doubleVectorProvider.getDoubleVector(this.webAssemblyContext);
        this.yFinalAnimationValues = this.doubleVectorProvider.getDoubleVector(this.webAssemblyContext);
    };
    /**
     * Sets initial values for the data animation
     * @param dataSeries The {@link BaseDataSeries} to be used for initial values
     */
    BaseDataSeries.prototype.setInitialAnimationVectors = function (dataSeries) {
        if (!dataSeries) {
            this.xInitialAnimationValues.resize(0, 0);
            this.yInitialAnimationValues.resize(0, 0);
            return;
        }
        (0, copyVector_1.copyDoubleVector)(dataSeries.getNativeXValues(), this.xInitialAnimationValues, this.webAssemblyContext);
        (0, copyVector_1.copyDoubleVector)(dataSeries.getNativeYValues(), this.yInitialAnimationValues, this.webAssemblyContext);
    };
    /**
     * Sets final values for the data animation
     * @param dataSeries The {@link BaseDataSeries} to be used for final values
     */
    BaseDataSeries.prototype.setFinalAnimationVectors = function (dataSeries) {
        if (!dataSeries) {
            this.xFinalAnimationValues.resize(0, 0);
            this.yFinalAnimationValues.resize(0, 0);
            return;
        }
        (0, copyVector_1.copyDoubleVector)(dataSeries.getNativeXValues(), this.xFinalAnimationValues, this.webAssemblyContext);
        (0, copyVector_1.copyDoubleVector)(dataSeries.getNativeYValues(), this.yFinalAnimationValues, this.webAssemblyContext);
    };
    /**
     * Puts the animation values back into the dataSeries after a reverse animation
     * @param dataSeries The {@link BaseDataSeries} to be used for target values
     */
    BaseDataSeries.prototype.revertAnimationVectors = function (dataSeries) {
        dataSeries = dataSeries !== null && dataSeries !== void 0 ? dataSeries : this;
        (0, copyVector_1.copyDoubleVector)(this.xFinalAnimationValues, dataSeries.getNativeXValues(), this.webAssemblyContext);
        (0, copyVector_1.copyDoubleVector)(this.yFinalAnimationValues, dataSeries.getNativeYValues(), this.webAssemblyContext);
    };
    /**
     * Validates the length of the animation vectors
     */
    BaseDataSeries.prototype.validateAnimationVectors = function () {
        var size = this.xInitialAnimationValues.size();
        if (size !== this.yInitialAnimationValues.size() ||
            size !== this.xFinalAnimationValues.size() ||
            size !== this.yFinalAnimationValues.size()) {
            throw Error("initialAnimationValues and finalAnimationValues must have the same length");
        }
    };
    /**
     * Updates the {@link BaseDataSeries} values for the animation
     * @param progress The animation progress from 0 to 1
     * @param animation The animation
     */
    BaseDataSeries.prototype.updateAnimationProperties = function (progress, animation) {
        if (animation.isOnStartAnimation) {
            animation.calculateAnimationValues(this.webAssemblyContext, this.yFinalAnimationValues, this.getNativeYValues(), progress);
        }
        else if (animation.isDataSeriesAnimation) {
            animation.calculateDataSeriesAnimationValues(this.webAssemblyContext, this.xInitialAnimationValues, this.xFinalAnimationValues, this.getNativeXValues(), progress);
            animation.calculateDataSeriesAnimationValues(this.webAssemblyContext, this.yInitialAnimationValues, this.yFinalAnimationValues, this.getNativeYValues(), progress);
        }
    };
    /** @inheritDoc */
    BaseDataSeries.prototype.toJSON = function (excludeData) {
        if (excludeData === void 0) { excludeData = false; }
        var options = this.getOptions(excludeData);
        return { type: this.type, options: options };
    };
    Object.defineProperty(BaseDataSeries.prototype, "changeCount", {
        /** @inheritDoc */
        get: function () {
            return this.changeCountProperty;
        },
        enumerable: false,
        configurable: true
    });
    BaseDataSeries.prototype.getOptions = function (excludeData) {
        if (excludeData === void 0) { excludeData = false; }
        var options = __assign({ id: this.id, containsNaN: this.containsNaN, isSorted: this.isSorted, dataIsSortedInX: this.isSorted, dataEvenlySpacedInX: this.isEvenlySpaced, dataSeriesName: this.dataSeriesName, fifoCapacity: this.fifoCapacity, fifoSweeping: this.fifoSweeping, fifoSweepingGap: this.fifoSweepingGap, fifoStartIndex: this.fifoSweeping ? this.fifoStartIndex : 0, capacity: this.capacity, metadata: undefined, 
            // values must be serialized in derived classes
            xValues: undefined, yValues: undefined }, this.dataIds);
        // @ts-ignore
        options.metadata = this.metadataGeneratorProperty
            ? this.metadataGeneratorProperty.toJSON()
            : excludeData
                ? undefined
                : this.metadataProperty;
        return options;
    };
    /**
     * Finds the nearest index of the xValue passed in by performing binary or linear search on the X-Values array.
     * Returns -1 for index not found. Other negative numbers indicate an error condition
     * @param xValue the X-value to find
     * @param findMode the {@link ESearchMode} to use when searching. Defaults to {@link ESearchMode.Nearest}.
     * Mode {@link ESearchMode.Exact} will result in a slower search, other modes will result in fast binary search.
     * @return The index, or -1 if not found
     */
    BaseDataSeries.prototype.findIndex = function (xValue, searchMode) {
        var _a, _b;
        if (searchMode === void 0) { searchMode = SearchMode_1.ESearchMode.Nearest; }
        if (this.count() === 0) {
            return -1;
        }
        // Get whether data is sorted ascending or not (affects which algorithms can be used)
        var dataIsSorted = (_b = (_a = this.dataDistributionCalculator) === null || _a === void 0 ? void 0 : _a.isSortedAscending) !== null && _b !== void 0 ? _b : false;
        // Search mode Exact must be used when data is not sorted, else, use user-defined search mode
        var findMode = dataIsSorted
            ? (0, SearchMode_1.convertSearchMode)(this.webAssemblyContext, searchMode)
            : this.webAssemblyContext.SCRTFindIndexSearchMode.Exact;
        return this.webAssemblyContext.NumberUtil.FindIndex(this.xValues, xValue, findMode, dataIsSorted);
    };
    BaseDataSeries.prototype.validateIndex = function (index, message) {
        if (Math.round(index) !== index) {
            throw Error("Index must be an integer");
        }
        var msg = message !== null && message !== void 0 ? message : "Index is out of range";
        if (index < 0 || index >= this.count()) {
            throw new Error(msg);
        }
    };
    BaseDataSeries.prototype.setMetadataAt = function (index, metadata) {
        if (!metadata) {
            return;
        }
        this.validateIndex(index);
        this.fillMetadataIfUndefined();
        if (this.fifoCapacity) {
            var fifoIndex = (this.xValues.getStartIndex() + index) % this.fifoCapacity;
            this.metadataProperty[fifoIndex] = metadata;
        }
        else {
            this.metadataProperty[index] = metadata;
        }
    };
    BaseDataSeries.prototype.appendMetadata = function (metadata) {
        if (!metadata) {
            if (!this.metadataGeneratorProperty) {
                return;
            }
            else {
                metadata = this.metadataGeneratorProperty.getSingleMetadata();
            }
        }
        this.fillMetadataIfUndefined();
        if (this.fifoCapacity && this.count() === this.fifoCapacity) {
            this.metadataProperty[this.xValues.getStartIndex()] = metadata;
        }
        else {
            this.metadataProperty.push(metadata);
        }
    };
    BaseDataSeries.prototype.appendMetadataRange = function (metadata, length) {
        var _this = this;
        if (!metadata) {
            if (!this.metadataGeneratorProperty) {
                return;
            }
            else {
                metadata = Array(length)
                    .fill(1)
                    .map(function (x) { return _this.metadataGeneratorProperty.getSingleMetadata(); });
            }
        }
        this.fillMetadataIfUndefined();
        if (this.fifoCapacity) {
            (0, array_1.appendRangeFifo)(metadata, this.metadataProperty, this.fifoCapacity, this.xValues.getStartIndex());
        }
        else {
            var startIndex = this.metadataProperty.length;
            // reserve space for new values
            this.metadataProperty.length += length;
            // merge new values into the collection
            for (var i = 0; i < length; ++i) {
                this.metadataProperty[startIndex + i] = metadata[i];
            }
        }
        // Alternative approach
        // this.metadataProperty = this.metadataProperty.concat(metadata);
    };
    BaseDataSeries.prototype.insertMetadata = function (startIndex, metadata) {
        if (!metadata) {
            if (!this.metadataGeneratorProperty) {
                return;
            }
            else {
                metadata = this.metadataGeneratorProperty.getSingleMetadata();
            }
        }
        this.fillMetadataIfUndefined();
        this.metadataProperty.splice(startIndex, 0, metadata);
    };
    BaseDataSeries.prototype.insertMetadataRange = function (startIndex, metadata) {
        var _this = this;
        if (!metadata) {
            if (!this.metadataGeneratorProperty) {
                return;
            }
            else {
                metadata = Array(length)
                    .fill(1)
                    .map(function (x) { return _this.metadataGeneratorProperty.getSingleMetadata(); });
            }
        }
        this.fillMetadataIfUndefined();
        // TODO probably this could be optimized
        var previousValues = this.metadataProperty.slice(0, startIndex);
        var nextValues = this.metadataProperty.slice(startIndex);
        this.metadataProperty = previousValues.concat(metadata, nextValues);
    };
    BaseDataSeries.prototype.removeMetadataAt = function (index) {
        if (!this.metadataProperty) {
            return;
        }
        this.metadataProperty.splice(index, 1);
    };
    BaseDataSeries.prototype.removeMetadataRange = function (startIndex, count) {
        if (!this.metadataProperty) {
            return;
        }
        this.metadataProperty.splice(startIndex, count);
    };
    BaseDataSeries.prototype.setMetadata = function (value) {
        this.metadataProperty = value;
    };
    BaseDataSeries.prototype.getXValues = function (dataSeriesValueType) {
        var xValues;
        switch (dataSeriesValueType) {
            case IDataSeries_1.EDataSeriesValueType.FinalAnimationValues:
                xValues = this.xFinalAnimationValues;
                break;
            case IDataSeries_1.EDataSeriesValueType.InitialAnimationValues:
                xValues = this.xInitialAnimationValues;
                break;
            default:
                xValues = this.xValues;
        }
        return xValues;
    };
    BaseDataSeries.prototype.throwIfFifo = function (operation) {
        if (this.fifoCapacity) {
            throw new Error("".concat(operation, " is not supported in fifo mode"));
        }
    };
    BaseDataSeries.prototype.reserve = function (size) {
        if (this.fifoCapacity) {
            throw new Error("Resizing a fifo dataSeries is not currently supported.");
        }
        Guard_1.Guard.argumentIsRealInteger(size, "capacity");
        this.xValues.reserve(size);
        this.yValues.reserve(size);
    };
    BaseDataSeries.prototype.calculateInitialCapacity = function (options) {
        var _a, _b, _c;
        return Math.max((_a = options === null || options === void 0 ? void 0 : options.capacity) !== null && _a !== void 0 ? _a : 0, (_c = (_b = options === null || options === void 0 ? void 0 : options.xValues) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0);
    };
    BaseDataSeries.prototype.fillMetadataIfUndefined = function () {
        if (this.metadataProperty === undefined) {
            var length_1 = this.count();
            this.metadataProperty = Array(length_1).fill(undefined);
        }
    };
    BaseDataSeries.prototype.getYValues = function (dataSeriesValueType) {
        var yValues;
        switch (dataSeriesValueType) {
            case IDataSeries_1.EDataSeriesValueType.FinalAnimationValues:
                yValues = this.yFinalAnimationValues;
                break;
            case IDataSeries_1.EDataSeriesValueType.InitialAnimationValues:
                yValues = this.yInitialAnimationValues;
                break;
            default:
                yValues = this.yValues;
        }
        return yValues;
    };
    return BaseDataSeries;
}(DeletableEntity_1.DeletableEntity));
exports.BaseDataSeries = BaseDataSeries;
/** @ignore */
var getIndicesRange = function (webAssemblyContext, xValues, xRange, isSorted, downSearchMode, upSearchMode) {
    if (downSearchMode === void 0) { downSearchMode = SearchMode_1.ESearchMode.RoundDown; }
    if (upSearchMode === void 0) { upSearchMode = SearchMode_1.ESearchMode.RoundUp; }
    var count = xValues.size();
    var result = new NumberRange_1.NumberRange(0, -1);
    if (count > 0) {
        // For unsorted data, we need to draw everything
        if (!isSorted) {
            return new NumberRange_1.NumberRange(0, count - 1);
        }
        var convertSearchMode_1 = function (mode) {
            switch (mode) {
                case SearchMode_1.ESearchMode.Exact:
                    return webAssemblyContext.SCRTFindIndexSearchMode.Exact;
                case SearchMode_1.ESearchMode.Nearest:
                    return webAssemblyContext.SCRTFindIndexSearchMode.Nearest;
                case SearchMode_1.ESearchMode.RoundDown:
                    return webAssemblyContext.SCRTFindIndexSearchMode.RoundDown;
                case SearchMode_1.ESearchMode.RoundUp:
                    return webAssemblyContext.SCRTFindIndexSearchMode.RoundUp;
            }
        };
        // For sorted data, we search the points in the viewport
        var iMin = webAssemblyContext.NumberUtil.FindIndex(xValues, xRange.min, convertSearchMode_1(downSearchMode), true);
        var iMax = webAssemblyContext.NumberUtil.FindIndex(xValues, xRange.max, convertSearchMode_1(upSearchMode), true);
        result = new NumberRange_1.NumberRange(iMin, iMax);
    }
    return result;
};
exports.getIndicesRange = getIndicesRange;
var getWindowedYRange = function (webAssemblyContext, xValues, yValues, xRange, getPositiveRange, isXCategoryAxis, // false
isSorted, minSearchMode, maxSearchMode) {
    if (minSearchMode === void 0) { minSearchMode = SearchMode_1.ESearchMode.RoundUp; }
    if (maxSearchMode === void 0) { maxSearchMode = SearchMode_1.ESearchMode.RoundDown; }
    // TODO: getPositiveRange
    var count = xValues.size();
    // if one point
    // We will expand zero width ranges in the axis
    if (count === 1) {
        var y = yValues.get(0);
        return new NumberRange_1.NumberRange(y, y);
    }
    var iMin = 0;
    var iMax = count;
    if (isXCategoryAxis) {
        iMin = Math.max(Math.floor(xRange.min), 0);
        iMax = Math.min(Math.ceil(xRange.max), count - 1);
    }
    else {
        var indicesRange = (0, exports.getIndicesRange)(webAssemblyContext, xValues, xRange, isSorted, minSearchMode, maxSearchMode);
        iMin = Math.max(Math.floor(indicesRange.min), 0);
        iMax = Math.min(Math.ceil(indicesRange.max), count - 1);
    }
    if (iMax < iMin) {
        return undefined;
    }
    var minMax;
    try {
        minMax = webAssemblyContext.NumberUtil.MinMaxWithIndex(yValues, iMin, iMax - iMin + 1);
        if (!(0, isRealNumber_1.isRealNumber)(minMax.minD) || !(0, isRealNumber_1.isRealNumber)(minMax.maxD)) {
            return undefined;
        }
        return new NumberRange_1.NumberRange(minMax.minD, minMax.maxD);
    }
    finally {
        (0, Deleter_1.deleteSafe)(minMax);
    }
};
exports.getWindowedYRange = getWindowedYRange;
