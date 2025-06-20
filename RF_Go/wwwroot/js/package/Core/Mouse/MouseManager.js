"use strict";
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
exports.MouseManager = void 0;
var ModifierMouseArgs_1 = require("../../Charting/ChartModifiers/ModifierMouseArgs");
var SciChartSurfaceBase_1 = require("../../Charting/Visuals/SciChartSurfaceBase");
var DpiHelper_1 = require("../../Charting/Visuals/TextureManager/DpiHelper");
var array_1 = require("../../utils/array");
var perfomance_1 = require("../../utils/perfomance");
var Guard_1 = require("../Guard");
var EMouseEventType;
(function (EMouseEventType) {
    EMouseEventType[EMouseEventType["Move"] = 0] = "Move";
    EMouseEventType[EMouseEventType["Down"] = 1] = "Down";
    EMouseEventType[EMouseEventType["Up"] = 2] = "Up";
    EMouseEventType[EMouseEventType["Wheel"] = 3] = "Wheel";
    EMouseEventType[EMouseEventType["Click"] = 4] = "Click";
    EMouseEventType[EMouseEventType["Leave"] = 5] = "Leave";
    EMouseEventType[EMouseEventType["Enter"] = 6] = "Enter";
    EMouseEventType[EMouseEventType["Cancel"] = 7] = "Cancel";
    EMouseEventType[EMouseEventType["Drop"] = 8] = "Drop";
})(EMouseEventType || (EMouseEventType = {}));
/**
 * The MouseManager handles mouse and touch events from any {@link IEventListenerSource} and publishes events to any {@link IReceiveMouseEvents}
 * type
 * @remarks
 * Used internally by the {@link SciChartSurface} and {@link SciChart3DSurface} to manage and route mouse eents
 */
var MouseManager = /** @class */ (function () {
    /**
     * Creates an instance of the {@link MouseManager}
     * @param target The target {@link SciChartSurfaceBase} that we are listening to events on
     */
    function MouseManager(target) {
        /**
         * For subCharts - to track if the mousepointer is over the subChart, so we can fake Enter and Leave events
         */
        this.isOver = false;
        /**
         * Max allowed interval between taps for them to be considered a double tap action.
         * @remarks used by double tap polyfill
         */
        this.maxTapDuration = 500;
        /**
         * Toggles usage of double tap polyfill
         */
        this.enableDoubleTapPolyfill = true;
        /**
         * Defines whether double tap polyfill should  always be used
         */
        this.forceDoubleTapPolyfill = false;
        // We allow null target for testing purpose
        this.sciChartSurface = target;
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onPointerCancel = this.onPointerCancel.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }
    /**
     * Used internally - subscribes to mouse events on the source
     * @param source The source element, must implement {@link IEventListenerSource} which any HTML5 element does
     */
    MouseManager.prototype.subscribe = function (source) {
        Guard_1.Guard.notNull(source, "source");
        this.unsubscribe();
        this.canvas = source;
        source.addEventListener("pointermove", this.onPointerMove);
        source.addEventListener("pointerdown", this.onPointerDown);
        source.addEventListener("pointerup", this.onPointerUp);
        source.addEventListener("pointercancel", this.onPointerCancel);
        source.addEventListener("wheel", this.onMouseWheel);
        source.addEventListener("dblclick", this.onDoubleClick);
        source.addEventListener("mouseleave", this.onMouseLeave);
        source.addEventListener("mouseenter", this.onMouseEnter);
        source.addEventListener("contextmenu", this.onContextMenu);
        source.addEventListener("drop", this.onDrop);
    };
    /**
     * Used internally - unsubscribes from mouse events
     */
    MouseManager.prototype.unsubscribe = function () {
        if (this.canvas) {
            this.canvas.removeEventListener("pointermove", this.onPointerMove);
            this.canvas.removeEventListener("pointerdown", this.onPointerDown);
            this.canvas.removeEventListener("pointerup", this.onPointerUp);
            this.canvas.removeEventListener("pointercancel", this.onPointerCancel);
            this.canvas.removeEventListener("wheel", this.onMouseWheel);
            this.canvas.removeEventListener("dblclick", this.onDoubleClick);
            this.canvas.removeEventListener("mouseleave", this.onMouseLeave);
            this.canvas.removeEventListener("mouseenter", this.onMouseEnter);
            this.canvas.removeEventListener("contextmenu", this.onContextMenu);
            this.canvas.removeEventListener("drop", this.onDrop);
        }
        this.canvas = null;
    };
    MouseManager.prototype.onPointerCancel = function (event) {
        var modifierEvent = ModifierMouseArgs_1.ModifierMouseArgs.fromPointerEvent(event);
        this.modifierPointerCancel(modifierEvent);
    };
    /**
     * Internal function called when 'pointermove' event is fired on the target element
     * @param event The {@link PointerEvent}
     */
    MouseManager.prototype.onPointerMove = function (event) {
        var _a;
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.PointerMoveStart, {
            contextId: this.sciChartSurface.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        var modifierEvent = ModifierMouseArgs_1.ModifierMouseArgs.fromPointerEvent(event);
        this.modifierMouseMove(modifierEvent);
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.PointerMoveEnd, {
            contextId: this.sciChartSurface.id,
            relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
    };
    /**
     * Internal function called when 'pointerdown' event is fired on the target element
     * @param event The {@link PointerEvent}
     */
    MouseManager.prototype.onPointerDown = function (event) {
        // To prevent default browser actions (like fast scroll for mouse wheel click and dragging of selected elements)
        // call args.nativeEvent.preventDefault() in the chart modifier instead of calling event.preventDefault() here
        var _a;
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.PointerDownStart, {
            contextId: this.sciChartSurface.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        var modifierEvent = ModifierMouseArgs_1.ModifierMouseArgs.fromPointerEvent(event);
        this.modifierMouseDown(modifierEvent);
        // workaround for handling double tap in case "dbclick" is not fired
        // (usually happens if touch-action is restricting the event).
        // If enabled, polyfill will be used on the first occurrence of double tap
        // to check if the event is captured by browser and fired as `dbclick`.
        // Then, if double tap is captured natively, the polyfill will not be used on subsequent onPointerDown calls
        var shouldUsePolyfillForDoubleTap = this.forceDoubleTapPolyfill || (this.enableDoubleTapPolyfill && !this.supportsDoubleTap);
        var isTouchEvent = event.pointerType === "touch" || event.pointerType === "pen";
        if (shouldUsePolyfillForDoubleTap && isTouchEvent) {
            var currentTime = new Date().getTime();
            var wasTappedBefore = !!this.lastTapTime;
            var satisfiesDoubleTapInterval = currentTime - this.lastTapTime < this.maxTapDuration;
            var isSingleTouchEvent = event.isPrimary;
            if (wasTappedBefore && isSingleTouchEvent && satisfiesDoubleTapInterval) {
                this.lastTapTime = undefined;
                // mark that double tap event was already handled
                this.doubleTapHandled = true;
                // execute double click behavior
                var tapEvent = ModifierMouseArgs_1.ModifierMouseArgs.fromPointerEvent(event);
                this.modifierDoubleClick(tapEvent);
            }
            else {
                this.lastTapTime = currentTime;
                this.doubleTapHandled = false;
            }
        }
        else {
            this.doubleTapHandled = false;
        }
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.PointerDownEnd, {
            contextId: this.sciChartSurface.id,
            relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
    };
    /**
     * Internal function called when 'pointerup' event is fired on the target element
     * @param event The {@link PointerEvent}
     */
    MouseManager.prototype.onPointerUp = function (event) {
        var _a;
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.PointerUpStart, {
            contextId: this.sciChartSurface.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        var modifierEvent = ModifierMouseArgs_1.ModifierMouseArgs.fromPointerEvent(event);
        this.modifierMouseUp(modifierEvent);
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.PointerUpEnd, {
            contextId: this.sciChartSurface.id,
            relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
    };
    /**
     * Internal function called when 'dblclick' event is fired on the target element
     * @param event The {@link PointerEvent}
     */
    MouseManager.prototype.onDoubleClick = function (event) {
        var _a;
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DoubleClickStart, {
            contextId: this.sciChartSurface.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        if (this.doubleTapHandled) {
            // source of `dbclick` event was a double tap
            this.supportsDoubleTap = true;
            // since event already handled by polyfill
            return;
        }
        var modifierEvent = ModifierMouseArgs_1.ModifierMouseArgs.fromMouseEvent(event);
        this.modifierDoubleClick(modifierEvent);
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.DoubleClickEnd, {
            contextId: this.sciChartSurface.id,
            relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
    };
    /**
     * Internal function called when 'wheel' event is fired on the target element
     * @param event The {@link PointerEvent}
     */
    MouseManager.prototype.onMouseWheel = function (event) {
        var _a;
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.ScrollStart, {
            contextId: this.sciChartSurface.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        var modifierEvent = ModifierMouseArgs_1.ModifierMouseArgs.fromWheelEvent(event);
        this.modifierMouseWheel(modifierEvent);
        if (modifierEvent.handled) {
            event.preventDefault();
        }
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.ScrollEnd, {
            contextId: this.sciChartSurface.id,
            relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
    };
    /**
     * Internal function called when 'mouseleave' event is fired on the target element
     * @param event The {@link PointerEvent}
     */
    MouseManager.prototype.onMouseLeave = function (event) {
        var _a;
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.MouseLeaveStart, {
            contextId: this.sciChartSurface.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        var modifierEvent = ModifierMouseArgs_1.ModifierMouseArgs.fromMouseEvent(event);
        this.modifierMouseLeave(modifierEvent);
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.MouseLeaveEnd, {
            contextId: this.sciChartSurface.id,
            relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
    };
    /**
     * Internal function called when 'mouseenter' event is fired on the target element
     * @param event The {@link PointerEvent}
     */
    MouseManager.prototype.onMouseEnter = function (event) {
        var _a;
        var mark = perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.MouseEnterStart, {
            contextId: this.sciChartSurface.id,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
        var modifierEvent = ModifierMouseArgs_1.ModifierMouseArgs.fromMouseEvent(event);
        this.modifierMouseEnter(modifierEvent);
        perfomance_1.PerformanceDebugHelper.mark(perfomance_1.EPerformanceMarkType.MouseEnterEnd, {
            contextId: this.sciChartSurface.id,
            relatedId: (_a = mark === null || mark === void 0 ? void 0 : mark.detail) === null || _a === void 0 ? void 0 : _a.relatedId,
            level: perfomance_1.EPerformanceDebugLevel.Verbose
        });
    };
    /**
     * Internal function called when 'contextmenu' event is fired on the target element
     * @param event The {@link PointerEvent}
     */
    MouseManager.prototype.onContextMenu = function (event) {
        // prevent context menu on chart elements
        event.preventDefault();
    };
    MouseManager.prototype.onDrop = function (event) {
        var modifierEvent = ModifierMouseArgs_1.ModifierMouseArgs.fromMouseEvent(event);
        this.modifierDrop(modifierEvent);
    };
    MouseManager.prototype.modifierPointerCancel = function (args) {
        var _this = this;
        if (args.isMaster) {
            args.target.releasePointerCapture(args.pointerId);
        }
        this.chartModifiers.forEach(function (cm) {
            if (cm.canReceiveMouseEvents && (!args.handled || cm.receiveHandledEvents)) {
                if (args.isMaster || (!args.isMaster && cm.modifierGroup === args.modifierGroup)) {
                    cm.modifierPointerCancel(args, _this.sciChartSurface);
                }
            }
        });
        if (args.isMaster) {
            var masterData_1 = this.getMasterData(this.sciChartSurface, args);
            this.chartModifierGroups.forEach(function (modifierGroup) {
                _this.sciChartSurface.otherSurfaces.forEach(function (scs) {
                    var argsCopy = ModifierMouseArgs_1.ModifierMouseArgs.copy(args, modifierGroup, _this.sciChartSurface.seriesViewRect, scs.seriesViewRect, masterData_1);
                    scs.mouseManager.modifierPointerCancel(argsCopy);
                });
            });
            this.updateSubCharts(args, EMouseEventType.Cancel);
        }
    };
    /**
     * Internal function called to route a mouse move event to all {@link sciChartSurface.chartModifiers}
     * @param args The {@link ModifierMouseArgs} to route
     * @remarks Event routing stops if any event marks {@link ModifierMouseArgs.handled} as true. To override this,
     * the user must set {@link ChartModifierBase.receiveHandledEvents} = true.
     */
    MouseManager.prototype.modifierMouseMove = function (args) {
        var _this = this;
        // Annotation Adorners
        if (this.sciChartSurface.surfaceType === SciChartSurfaceBase_1.ESurfaceType.SciChartSurfaceType) {
            var scs = this.sciChartSurface;
            if (scs.adornerLayer.isAnnotationSelected) {
                var currentAnnotation = scs.adornerLayer.selectedAnnotation;
                if (currentAnnotation.isDraggingStarted) {
                    currentAnnotation.onDragAdorner(args);
                }
            }
        }
        this.chartModifiers.forEach(function (cm) {
            if (cm.canReceiveMouseEvents && (!args.handled || cm.receiveHandledEvents)) {
                if (args.isMaster || (!args.isMaster && cm.modifierGroup === args.modifierGroup)) {
                    cm.modifierMouseMove(args, _this.sciChartSurface);
                }
            }
        });
        if (args.isMaster) {
            var masterData_2 = this.getMasterData(this.sciChartSurface, args);
            this.chartModifierGroups.forEach(function (modifierGroup) {
                _this.sciChartSurface.otherSurfaces.forEach(function (scs) {
                    var args2 = ModifierMouseArgs_1.ModifierMouseArgs.copy(args, modifierGroup, _this.sciChartSurface.seriesViewRect, scs.seriesViewRect, masterData_2);
                    scs.mouseManager.modifierMouseMove(args2);
                });
            });
            this.updateSubCharts(args, EMouseEventType.Move);
        }
    };
    /**
     * Internal function called to route a mouse down event to all {@link sciChartSurface.chartModifiers}
     * @param args The {@link ModifierMouseArgs} to route
     * @remarks Event routing stops if any event marks {@link ModifierMouseArgs.handled} as true. To override this,
     * the user must set {@link ChartModifierBase.receiveHandledEvents} = true.
     */
    MouseManager.prototype.modifierMouseDown = function (args) {
        var _this = this;
        var _a;
        // allow capturing mouse events outside when pointer is of canvas
        if (args.isMaster) {
            (_a = args.target) === null || _a === void 0 ? void 0 : _a.setPointerCapture(args.pointerId);
        }
        var updateModifiers = function () {
            _this.chartModifiers.forEach(function (cm) {
                if (cm.canReceiveMouseEvents && (!args.handled || cm.receiveHandledEvents)) {
                    if (args.isMaster || (!args.isMaster && cm.modifierGroup === args.modifierGroup)) {
                        cm.modifierMouseDown(args, _this.sciChartSurface);
                    }
                }
            });
            if (args.isMaster) {
                var masterData_3 = _this.getMasterData(_this.sciChartSurface, args);
                _this.chartModifierGroups.forEach(function (modifierGroup) {
                    _this.sciChartSurface.otherSurfaces.forEach(function (scs) {
                        var args2 = ModifierMouseArgs_1.ModifierMouseArgs.copy(args, modifierGroup, _this.sciChartSurface.seriesViewRect, scs.seriesViewRect, masterData_3);
                        scs.mouseManager.modifierMouseDown(args2);
                    });
                });
                _this.updateSubCharts(args, EMouseEventType.Down);
            }
        };
        if (args.isMaster) {
            var selectAnnotationAndUpdateModifiers = function (_scs) {
                _scs.adornerLayer.selectAnnotation(args);
                var currentAnnotation = _scs.adornerLayer.selectedAnnotation;
                if (currentAnnotation) {
                    if (currentAnnotation.onDragStarted(args)) {
                        _this.modifierMouseMove(args);
                    }
                }
                else {
                    updateModifiers();
                }
            };
            // Annotation Adorners
            if (this.sciChartSurface.surfaceType === SciChartSurfaceBase_1.ESurfaceType.SciChartSurfaceType) {
                var scs = this.sciChartSurface;
                var currentAnnotation = scs.adornerLayer.selectedAnnotation;
                if (currentAnnotation) {
                    var isDraggingStarted = currentAnnotation.onDragStarted(args);
                    if (!isDraggingStarted) {
                        selectAnnotationAndUpdateModifiers(scs);
                    }
                }
                else {
                    selectAnnotationAndUpdateModifiers(scs);
                }
            }
            else {
                updateModifiers();
            }
        }
        else {
            // Process even if not master so ZoomPan can work with modifierGroups
            updateModifiers();
        }
    };
    /**
     * Internal function called to route a mouse up event to all {@link sciChartSurface.chartModifiers}
     * @param args The {@link ModifierMouseArgs} to route
     * @remarks Event routing stops if any event marks {@link ModifierMouseArgs.handled} as true. To override this,
     * the user must set {@link ChartModifierBase.receiveHandledEvents} = true.
     */
    MouseManager.prototype.modifierMouseUp = function (args) {
        var _this = this;
        var _a;
        if (args.isMaster) {
            (_a = args.target) === null || _a === void 0 ? void 0 : _a.releasePointerCapture(args.pointerId);
        }
        // Annotation Adorners
        if (this.sciChartSurface.surfaceType === SciChartSurfaceBase_1.ESurfaceType.SciChartSurfaceType) {
            var scs = this.sciChartSurface;
            if (scs.adornerLayer.isAnnotationSelected) {
                var currentAnnotation = scs.adornerLayer.selectedAnnotation;
                if (currentAnnotation.isDraggingStarted) {
                    currentAnnotation.onDragEnded();
                }
            }
        }
        this.chartModifiers.forEach(function (cm) {
            if (cm.canReceiveMouseEvents && (!args.handled || cm.receiveHandledEvents)) {
                if (args.isMaster || (!args.isMaster && cm.modifierGroup === args.modifierGroup)) {
                    cm.modifierMouseUp(args, _this.sciChartSurface);
                }
            }
        });
        if (args.isMaster) {
            var masterData_4 = this.getMasterData(this.sciChartSurface, args);
            this.chartModifierGroups.forEach(function (modifierGroup) {
                _this.sciChartSurface.otherSurfaces.forEach(function (scs) {
                    var args2 = ModifierMouseArgs_1.ModifierMouseArgs.copy(args, modifierGroup, _this.sciChartSurface.seriesViewRect, scs.seriesViewRect, masterData_4);
                    scs.mouseManager.modifierMouseUp(args2);
                });
            });
            this.updateSubCharts(args, EMouseEventType.Up);
        }
    };
    /**
     * Internal function called to route a mouse wheel event to all {@link sciChartSurface.chartModifiers}
     * @param args The {@link ModifierMouseArgs} to route
     * @remarks Event routing stops if any event marks {@link ModifierMouseArgs.handled} as true. To override this,
     * the user must set {@link ChartModifierBase.receiveHandledEvents} = true.
     */
    MouseManager.prototype.modifierMouseWheel = function (args) {
        var _this = this;
        this.chartModifiers.forEach(function (cm) {
            if (cm.canReceiveMouseEvents && (!args.handled || cm.receiveHandledEvents)) {
                if (args.isMaster || (!args.isMaster && cm.modifierGroup === args.modifierGroup)) {
                    cm.modifierMouseWheel(args, _this.sciChartSurface);
                }
            }
        });
        if (args.isMaster) {
            var masterData_5 = this.getMasterData(this.sciChartSurface, args);
            this.chartModifierGroups.forEach(function (modifierGroup) {
                _this.sciChartSurface.otherSurfaces.forEach(function (scs) {
                    var args2 = ModifierMouseArgs_1.ModifierMouseArgs.copy(args, modifierGroup, _this.sciChartSurface.seriesViewRect, scs.seriesViewRect, masterData_5);
                    scs.mouseManager.modifierMouseWheel(args2);
                });
            });
            this.updateSubCharts(args, EMouseEventType.Wheel);
        }
    };
    /**
     * Internal function called to route a mouse double click event to all {@link sciChartSurface.chartModifiers}
     * @param args The {@link ModifierMouseArgs} to route
     * @remarks Event routing stops if any event marks {@link ModifierMouseArgs.handled} as true. To override this,
     * the user must set {@link ChartModifierBase.receiveHandledEvents} = true.
     */
    MouseManager.prototype.modifierDoubleClick = function (args) {
        var _this = this;
        this.chartModifiers.forEach(function (cm) {
            if (cm.canReceiveMouseEvents && (!args.handled || cm.receiveHandledEvents)) {
                if (args.isMaster || (!args.isMaster && cm.modifierGroup === args.modifierGroup)) {
                    cm.modifierDoubleClick(args, _this.sciChartSurface);
                }
            }
        });
        if (args.isMaster) {
            var masterData_6 = this.getMasterData(this.sciChartSurface, args);
            this.chartModifierGroups.forEach(function (modifierGroup) {
                _this.sciChartSurface.otherSurfaces.forEach(function (scs) {
                    var args2 = ModifierMouseArgs_1.ModifierMouseArgs.copy(args, modifierGroup, _this.sciChartSurface.seriesViewRect, scs.seriesViewRect, masterData_6);
                    scs.mouseManager.modifierDoubleClick(args2);
                });
            });
            this.updateSubCharts(args, EMouseEventType.Click);
        }
    };
    /**
     * Internal function called to route a mouse leave event to all {@link sciChartSurface.chartModifiers}
     * @param args The {@link ModifierMouseArgs} to route
     * @remarks Event routing stops if any event marks {@link ModifierMouseArgs.handled} as true. To override this,
     * the user must set {@link ChartModifierBase.receiveHandledEvents} = true.
     */
    MouseManager.prototype.modifierMouseLeave = function (args) {
        var _this = this;
        this.chartModifiers.forEach(function (cm) {
            if (cm.canReceiveMouseEvents && (!args.handled || cm.receiveHandledEvents)) {
                if (args.isMaster || (!args.isMaster && cm.modifierGroup === args.modifierGroup)) {
                    cm.modifierMouseLeave(args, _this.sciChartSurface);
                }
            }
        });
        if (args.isMaster) {
            var masterData_7 = this.getMasterData(this.sciChartSurface, args);
            this.chartModifierGroups.forEach(function (modifierGroup) {
                _this.sciChartSurface.otherSurfaces.forEach(function (scs) {
                    var args2 = ModifierMouseArgs_1.ModifierMouseArgs.copy(args, modifierGroup, _this.sciChartSurface.seriesViewRect, scs.seriesViewRect, masterData_7);
                    scs.mouseManager.modifierMouseLeave(args2);
                });
            });
            this.updateSubCharts(args, EMouseEventType.Leave);
        }
    };
    /**
     * Internal function called to route a mouse enter event to all {@link sciChartSurface.chartModifiers}
     * @param args The {@link ModifierMouseArgs} to route
     * @remarks Event routing stops if any event marks {@link ModifierMouseArgs.handled} as true. To override this,
     * the user must set {@link ChartModifierBase.receiveHandledEvents} = true.
     */
    MouseManager.prototype.modifierMouseEnter = function (args) {
        var _this = this;
        this.chartModifiers.forEach(function (cm) {
            if (cm.canReceiveMouseEvents && (!args.handled || cm.receiveHandledEvents)) {
                if (args.isMaster || (!args.isMaster && cm.modifierGroup === args.modifierGroup)) {
                    cm.modifierMouseEnter(args, _this.sciChartSurface);
                }
            }
        });
        if (args.isMaster) {
            var masterData_8 = this.getMasterData(this.sciChartSurface, args);
            this.chartModifierGroups.forEach(function (modifierGroup) {
                _this.sciChartSurface.otherSurfaces.forEach(function (scs) {
                    var args2 = ModifierMouseArgs_1.ModifierMouseArgs.copy(args, modifierGroup, _this.sciChartSurface.seriesViewRect, scs.seriesViewRect, masterData_8);
                    scs.mouseManager.modifierMouseEnter(args2);
                });
            });
            this.updateSubCharts(args, EMouseEventType.Enter);
        }
    };
    /**
     * Internal function called to route a drop event to all {@link sciChartSurface.chartModifiers}
     * @param args The {@link ModifierMouseArgs} to route
     * @remarks Event routing stops if any event marks {@link ModifierMouseArgs.handled} as true. To override this,
     * the user must set {@link ChartModifierBase.receiveHandledEvents} = true.
     */
    MouseManager.prototype.modifierDrop = function (args) {
        var _this = this;
        this.chartModifiers.forEach(function (cm) {
            if (cm.canReceiveMouseEvents && (!args.handled || cm.receiveHandledEvents)) {
                if (args.isMaster || (!args.isMaster && cm.modifierGroup === args.modifierGroup)) {
                    cm.modifierDrop(args, _this.sciChartSurface);
                }
            }
        });
        if (args.isMaster) {
            var masterData_9 = this.getMasterData(this.sciChartSurface, args);
            this.chartModifierGroups.forEach(function (modifierGroup) {
                _this.sciChartSurface.otherSurfaces.forEach(function (scs) {
                    var args2 = ModifierMouseArgs_1.ModifierMouseArgs.copy(args, modifierGroup, _this.sciChartSurface.seriesViewRect, scs.seriesViewRect, masterData_9);
                    scs.mouseManager.modifierDrop(args2);
                });
            });
            this.updateSubCharts(args, EMouseEventType.Drop);
        }
    };
    /**
     * Get data from the master surface which will be passed to other surfaces when modifierGroups are used.
     * Use this if you want to use the data value from the master surface in the modifier on the other surfaces
     */
    MouseManager.prototype.getMasterData = function (sciChartSurface, args) {
        return {};
    };
    Object.defineProperty(MouseManager.prototype, "chartModifiers", {
        get: function () {
            return this.sciChartSurface.chartModifiers.asArray();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MouseManager.prototype, "chartModifierGroups", {
        get: function () {
            var arr = this.chartModifiers.filter(function (cm) { return cm.modifierGroup !== undefined; }).map(function (el) { return el.modifierGroup; });
            return (0, array_1.getUniqueValues)(arr);
        },
        enumerable: false,
        configurable: true
    });
    MouseManager.prototype.updateSubCharts = function (args, eventType) {
        var _this = this;
        var subCharts = this.sciChartSurface.subCharts;
        if (!subCharts || subCharts.length === 0)
            return;
        var currentActiveSubChart = subCharts === null || subCharts === void 0 ? void 0 : subCharts.find(function (scs) {
            var _a = scs.padding, top = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right;
            var _b = args.mousePoint, x = _b.x, y = _b.y;
            var xns = x / DpiHelper_1.DpiHelper.PIXEL_RATIO;
            var yns = y / DpiHelper_1.DpiHelper.PIXEL_RATIO;
            var _c = _this.sciChartSurface.renderSurface.viewportSize, width = _c.width, height = _c.height;
            var wns = width / DpiHelper_1.DpiHelper.PIXEL_RATIO;
            var hns = height / DpiHelper_1.DpiHelper.PIXEL_RATIO;
            return left <= xns && xns <= wns - right && top <= yns && yns <= hns - bottom;
        });
        var handledBySubchart = false;
        subCharts === null || subCharts === void 0 ? void 0 : subCharts.forEach(function (scs) {
            var subEventType = eventType;
            var isActiveSubChartEvent = true;
            if (scs.mouseManager.isOver) {
                if (scs !== currentActiveSubChart) {
                    scs.mouseManager.isOver = false;
                    // Leaving to surface
                    if (subEventType === EMouseEventType.Move) {
                        var leaveArgs = new ModifierMouseArgs_1.ModifierMouseArgs(args.mousePoint, args);
                        handledBySubchart =
                            handledBySubchart ||
                                _this.processSubChartEvent(EMouseEventType.Leave, scs, leaveArgs, subCharts, undefined);
                    }
                    // If not over the subchart, don't process anything except cancellation events
                    if (subEventType !== EMouseEventType.Cancel && subEventType !== EMouseEventType.Up) {
                        subEventType = undefined;
                    }
                }
            }
            else {
                if (scs === currentActiveSubChart) {
                    scs.mouseManager.isOver = true;
                    // Entering from surface
                    if (subEventType === EMouseEventType.Move) {
                        var enterArgs = new ModifierMouseArgs_1.ModifierMouseArgs(args.mousePoint, args);
                        handledBySubchart =
                            handledBySubchart ||
                                _this.processSubChartEvent(EMouseEventType.Enter, scs, enterArgs, subCharts, undefined);
                    }
                }
                else {
                    // If not over the subchart, don't process events other than these
                    if (![EMouseEventType.Cancel, EMouseEventType.Up, EMouseEventType.Move].includes(subEventType)) {
                        subEventType = undefined;
                    }
                    isActiveSubChartEvent = false;
                }
            }
            if (subEventType !== undefined) {
                var masterData = _this.getMasterData(currentActiveSubChart, args);
                handledBySubchart =
                    handledBySubchart ||
                        _this.processSubChartEvent(subEventType, scs, __assign(__assign({}, args), { isActiveSubChartEvent: isActiveSubChartEvent }), subCharts, masterData);
            }
        });
        args.handled = args.handled || handledBySubchart;
    };
    MouseManager.prototype.processSubChartEvent = function (eventType, scs, args, subCharts, masterData) {
        var _this = this;
        // modifiers on parent may prevent handling of modifer on subchart
        args.handled = false;
        this.callEvent(eventType, scs, args);
        var handled = args.handled;
        if (args.isActiveSubChartEvent) {
            // Only replicate modifier group events for active subchart
            scs.chartModifierGroups.forEach(function (modifierGroup) {
                subCharts
                    .filter(function (sc) { return sc.id !== scs.id; })
                    .forEach(function (scOther) {
                    var args2 = ModifierMouseArgs_1.ModifierMouseArgs.copyForSubChart(args, modifierGroup, scs.seriesViewRect, scOther.seriesViewRect, masterData);
                    _this.callEvent(eventType, scOther, args2);
                    handled = handled || args2.handled;
                });
            });
        }
        return handled;
    };
    MouseManager.prototype.callEvent = function (eventType, scs, args) {
        switch (eventType) {
            case EMouseEventType.Cancel:
                scs.mouseManager.modifierPointerCancel(args);
                break;
            case EMouseEventType.Click:
                scs.mouseManager.modifierDoubleClick(args);
                break;
            case EMouseEventType.Down:
                scs.mouseManager.modifierMouseDown(args);
                break;
            case EMouseEventType.Enter:
                scs.mouseManager.modifierMouseEnter(args);
                break;
            case EMouseEventType.Leave:
                scs.mouseManager.modifierMouseLeave(args);
                break;
            case EMouseEventType.Move:
                scs.mouseManager.modifierMouseMove(args);
                break;
            case EMouseEventType.Up:
                scs.mouseManager.modifierMouseUp(args);
                break;
            case EMouseEventType.Wheel:
                scs.mouseManager.modifierMouseWheel(args);
                break;
            case EMouseEventType.Drop:
                scs.mouseManager.modifierDrop(args);
                break;
            default:
                break;
        }
    };
    return MouseManager;
}());
exports.MouseManager = MouseManager;
