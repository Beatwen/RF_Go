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
exports.XAxisDragModifier = void 0;
var CursorStyle_1 = require("../../types/CursorStyle");
var DragMode_1 = require("../../types/DragMode");
var translate_1 = require("../../utils/translate");
var AxisBase2D_1 = require("../Visuals/Axis/AxisBase2D");
var ChartModifierBase2D_1 = require("./ChartModifierBase2D");
var Guard_1 = require("../../Core/Guard");
var ChartModifierType_1 = require("../../types/ChartModifierType");
/**
 * The XAxisDragModifier provides scaling/panning behavior for X axis {@link AxisBase2D}
 * within SciChart - High Performance {@link https://www.scichart.com/javascript-chart-features | JavaScript Charts}
 * @remarks
 *
 * To apply the XAxisDragModifier to a {@link SciChartSurface} and add scaling behavior,
 * use the following code:
 *
 * ```ts
 * sciChartSurface.chartModifiers.add(new XAxisDragModifier());
 * ```
 */
var XAxisDragModifier = /** @class */ (function (_super) {
    __extends(XAxisDragModifier, _super);
    /**
     * Creates an instance of a XAxisDragModifier
     * @param options optional parameters to pass to the XAxisDragModifier to configure it upon construction
     */
    function XAxisDragModifier(options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, options) || this;
        _this.type = ChartModifierType_1.EChart2DModifierType.XAxisDrag;
        _this.dragMode = DragMode_1.EDragMode.Scaling;
        _this.isClickedOverXAxis = false;
        _this.isVerticalChart = false;
        _this.cursorStyle = CursorStyle_1.ECursorStyle.Defalut;
        _this.includedSeriesMapProperty = new Map();
        _this.dragMode = (_a = options === null || options === void 0 ? void 0 : options.dragMode) !== null && _a !== void 0 ? _a : _this.dragMode;
        (_b = options === null || options === void 0 ? void 0 : options.excludedAxisIds) === null || _b === void 0 ? void 0 : _b.forEach(function (id) {
            _this.includedSeriesMapProperty.set(id, false);
        });
        return _this;
    }
    /**
     * @inheritDoc
     */
    XAxisDragModifier.prototype.includeAxis = function (axis, isIncluded) {
        Guard_1.Guard.notNull(axis, "axis");
        if (!isIncluded) {
            this.includedSeriesMapProperty.set(axis.id, isIncluded);
        }
        if (isIncluded) {
            this.includedSeriesMapProperty.delete(axis.id);
        }
    };
    /**
     * @inheritDoc
     */
    XAxisDragModifier.prototype.getIncludedAxis = function () {
        var _this = this;
        var _a, _b;
        return ((_b = (_a = this.parentSurface) === null || _a === void 0 ? void 0 : _a.xAxes.asArray().filter(function (axis) { return _this.includedSeriesMapProperty.get(axis.id) !== false; })) !== null && _b !== void 0 ? _b : []);
    };
    Object.defineProperty(XAxisDragModifier.prototype, "includedAxisMap", {
        /**
         * Used internally for tests. Gets a Map of included Axis
         * @remarks Axis include flag set to false means excluded. Axis not present or flag=true means included
         */
        get: function () {
            return this.includedSeriesMapProperty;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    XAxisDragModifier.prototype.modifierMouseDown = function (args) {
        _super.prototype.modifierMouseDown.call(this, args);
        if (!this.isAttached) {
            throw new Error("Should not call XAxisDragModifier.modifierMouseDown if not attached");
        }
        if ((0, ChartModifierBase2D_1.testIsOverAxes)(this.getHorizontalXAxes(), args.mousePoint)) {
            // Horizontal chart
            this.isVerticalChart = false;
            this.startDragging(this.getHorizontalXAxes(), args);
        }
        else if ((0, ChartModifierBase2D_1.testIsOverAxes)(this.getVerticalXAxes(), args.mousePoint)) {
            // Vertical chart
            this.isVerticalChart = true;
            this.startDragging(this.getVerticalXAxes(), args);
        }
    };
    /**
     * @inheritDoc
     */
    XAxisDragModifier.prototype.modifierMouseMove = function (args) {
        if (this.isClickedOverXAxis) {
            _super.prototype.modifierMouseMove.call(this, args);
            if (this.pointFrom === undefined) {
                return;
            }
            if (this.dragMode === DragMode_1.EDragMode.Panning) {
                this.doPanning(args.mousePoint);
            }
            else if (this.dragMode === DragMode_1.EDragMode.Scaling) {
                this.doScaling(args.mousePoint);
            }
        }
        else {
            this.updateCursor(args.mousePoint);
        }
    };
    /**
     * @inheritDoc
     */
    XAxisDragModifier.prototype.modifierMouseUp = function (args) {
        _super.prototype.modifierMouseUp.call(this, args);
        this.updateCursor(args.mousePoint);
        this.pointFrom = undefined;
        this.isClickedOverXAxis = false;
    };
    XAxisDragModifier.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        var options = {
            dragMode: this.dragMode,
            excludedAxisIds: Array.from(this.includedSeriesMapProperty.entries())
                .filter(function (e) { return !e[1]; })
                .map(function (e) { return e[0]; })
        };
        Object.assign(json.options, options);
        return json;
    };
    XAxisDragModifier.prototype.updateCursor = function (mousePoint) {
        var canvas = this.parentSurface.getMainCanvas();
        if ((0, ChartModifierBase2D_1.testIsOverAxes)(this.getHorizontalXAxes(), mousePoint)) {
            if (this.cursorStyle !== CursorStyle_1.ECursorStyle.EW) {
                canvas.style.cursor = CursorStyle_1.ECursorStyle.EW;
                this.cursorStyle = CursorStyle_1.ECursorStyle.EW;
            }
        }
        else if ((0, ChartModifierBase2D_1.testIsOverAxes)(this.getVerticalXAxes(), mousePoint)) {
            if (this.cursorStyle !== CursorStyle_1.ECursorStyle.NS) {
                canvas.style.cursor = CursorStyle_1.ECursorStyle.NS;
                this.cursorStyle = CursorStyle_1.ECursorStyle.NS;
            }
        }
        else {
            if (this.cursorStyle !== CursorStyle_1.ECursorStyle.Defalut) {
                canvas.style.cursor = CursorStyle_1.ECursorStyle.Defalut;
                this.cursorStyle = CursorStyle_1.ECursorStyle.Defalut;
            }
        }
    };
    XAxisDragModifier.prototype.doPanning = function (mousePoint) {
        var pointTo = mousePoint;
        if (this.isVerticalChart) {
            var yDelta_1 = pointTo.y - this.pointFrom.y;
            this.activeAxes.forEach(function (x) {
                var delta = x.flippedCoordinates ? -yDelta_1 : yDelta_1;
                x.scroll(delta, AxisBase2D_1.EClipMode.None);
            });
        }
        else {
            var xDelta_1 = pointTo.x - this.pointFrom.x;
            this.activeAxes.forEach(function (x) {
                var delta = x.flippedCoordinates ? -xDelta_1 : xDelta_1;
                x.scroll(delta, AxisBase2D_1.EClipMode.None);
            });
        }
        this.pointFrom = pointTo;
    };
    XAxisDragModifier.prototype.doScaling = function (pointTo) {
        var _this = this;
        if (this.isVerticalChart) {
            this.activeAxes.forEach(function (axis, index) {
                var axisViewRect = axis.viewRect;
                var yFromTrans = (0, translate_1.translateFromCanvasToSeriesViewRectY)(_this.pointFrom.y, axisViewRect);
                var isMoreThanHalf = yFromTrans >= axisViewRect.height / 2;
                var yDelta = (pointTo.y - _this.pointFrom.y) / axisViewRect.height;
                axis.scale(_this.initialVisibleRanges[index], yDelta, isMoreThanHalf);
            });
        }
        else {
            this.activeAxes.forEach(function (axis, index) {
                var axisViewRect = axis.viewRect;
                var xFromTrans = (0, translate_1.translateFromCanvasToSeriesViewRectX)(_this.pointFrom.x, axisViewRect);
                var isMoreThanHalf = xFromTrans >= axisViewRect.width / 2;
                var xDelta = (pointTo.x - _this.pointFrom.x) / axisViewRect.width;
                axis.scale(_this.initialVisibleRanges[index], xDelta, isMoreThanHalf);
            });
        }
    };
    XAxisDragModifier.prototype.getHorizontalXAxes = function () {
        return this.getIncludedAxis().filter(function (el) { return el.isHorizontalAxis; });
    };
    XAxisDragModifier.prototype.getVerticalXAxes = function () {
        return this.getIncludedAxis().filter(function (el) { return !el.isHorizontalAxis; });
    };
    XAxisDragModifier.prototype.startDragging = function (axes, args) {
        this.isClickedOverXAxis = true;
        var activeAxes = (0, ChartModifierBase2D_1.getActiveAxes)(axes, args.mousePoint);
        var initialVisibleRanges = [];
        activeAxes.forEach(function (el) {
            initialVisibleRanges.push(el.visibleRange);
        });
        this.activeAxes = activeAxes;
        this.initialVisibleRanges = initialVisibleRanges;
        this.pointFrom = args.mousePoint;
        args.handled = true;
    };
    return XAxisDragModifier;
}(ChartModifierBase2D_1.ChartModifierBase2D));
exports.XAxisDragModifier = XAxisDragModifier;
