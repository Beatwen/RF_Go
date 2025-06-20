"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartLayoutState = void 0;
var ChartLayoutState = /** @class */ (function () {
    function ChartLayoutState() {
        this.leftInnerAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.topInnerAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.bottomInnerAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.rightInnerAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.leftOuterAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.topOuterAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.bottomOuterAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.rightOuterAreaSize = ChartLayoutState.DEFAULT_SIZE;
    }
    ChartLayoutState.prototype.clear = function () {
        this.leftInnerAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.topInnerAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.bottomInnerAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.rightInnerAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.leftOuterAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.topOuterAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.bottomOuterAreaSize = ChartLayoutState.DEFAULT_SIZE;
        this.rightOuterAreaSize = ChartLayoutState.DEFAULT_SIZE;
    };
    ChartLayoutState.DEFAULT_SIZE = 0;
    return ChartLayoutState;
}());
exports.ChartLayoutState = ChartLayoutState;
