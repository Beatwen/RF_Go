"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hitTestHelpers = void 0;
var Deleter_1 = require("../../../../Core/Deleter");
var Point_1 = require("../../../../Core/Point");
var ErrorDirection_1 = require("../../../../types/ErrorDirection");
var pointUtil_1 = require("../../../../utils/pointUtil");
var HitTestInfo_1 = require("./HitTestInfo");
var interpolateLinear = function (x, x1, y1, x2, y2) {
    return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
};
// TODO: take isVertical property into account
/**
 *
 * @param renderableSeries
 * @param xCoordinateCalculator
 * @param yCoordinateCalculator
 * @param isVerticalChart
 * @param dataSeries
 * @param xNativeValues
 * @param yNativeValues
 * @param xHitCoord the X coordinate on the screen relative to seriesViewRect, X and Y swapped for vertical charts
 * @param yHitCoord the Y coordinate on the screen relative to seriesViewRect, X and Y swapped for vertical charts
 * @param nearestPointIndex
 * @param hitTestRadius
 */
var createHitTestInfo = function (renderableSeries, xCoordinateCalculator, yCoordinateCalculator, isVerticalChart, dataSeries, xNativeValues, yNativeValues, xHitCoord, yHitCoord, nearestPointIndex, hitTestRadius, distance) {
    var isCategoryAxis = xCoordinateCalculator.isCategoryCoordinateCalculator;
    var hitTestInfo = new HitTestInfo_1.HitTestInfo(renderableSeries);
    hitTestInfo.dataSeriesName = dataSeries.dataSeriesName;
    hitTestInfo.dataSeriesType = dataSeries.type;
    hitTestInfo.hitTestPoint = new Point_1.Point(xHitCoord, yHitCoord);
    var hitTestPointXValue = xCoordinateCalculator.getDataValue(xHitCoord);
    var hitTestPointYValue = yCoordinateCalculator.getDataValue(yHitCoord);
    hitTestInfo.hitTestPointValues = new Point_1.Point(hitTestPointXValue, hitTestPointYValue);
    hitTestInfo.dataSeriesIndex = nearestPointIndex;
    hitTestInfo.hitTestRadius = hitTestRadius;
    hitTestInfo.isCategoryAxis = isCategoryAxis;
    hitTestInfo.distance = distance;
    // If there is no data, don't attempt to access it.
    if (nearestPointIndex >= 0) {
        var xValue = isCategoryAxis ? nearestPointIndex : dataSeries.getNativeValue(xNativeValues, nearestPointIndex);
        var yValue = dataSeries.getNativeValue(yNativeValues, nearestPointIndex);
        hitTestInfo.xCoord = xCoordinateCalculator.getCoordinate(xValue);
        hitTestInfo.yCoord = yCoordinateCalculator.getCoordinate(yValue);
        // TODO: It might be worth to flip them to make the API better
        // if (isVerticalChart) {
        //     const temp = hitTestInfo.xCoord;
        //     hitTestInfo.xCoord = hitTestInfo.yCoord;
        //     hitTestInfo.yCoord = temp;
        // }
        hitTestInfo.xValue = xValue;
        if (isCategoryAxis) {
            hitTestInfo.xCategoryValue = xNativeValues.get(nearestPointIndex);
        }
        hitTestInfo.yValue = yValue;
        var xFirstValue = isCategoryAxis ? 0 : dataSeries.getNativeValue(xNativeValues, 0);
        var xLastValue = isCategoryAxis
            ? xNativeValues.size() - 1
            : dataSeries.getNativeValue(xNativeValues, xNativeValues.size() - 1);
        // TODO - do this once when data changes
        if (!dataSeries.dataDistributionCalculator.isSortedAscending) {
            for (var i = 0; i < dataSeries.count(); i++) {
                var x = dataSeries.getNativeValue(xNativeValues, i);
                if (x < xFirstValue) {
                    xFirstValue = x;
                }
                if (x > xLastValue) {
                    xLastValue = x;
                }
            }
        }
        hitTestInfo.isWithinDataBounds = (0, pointUtil_1.testIsInInterval)(hitTestPointXValue, xFirstValue, xLastValue);
        hitTestInfo.metadata = dataSeries.getMetadataAt(nearestPointIndex);
    }
    else {
        hitTestInfo.isWithinDataBounds = false;
    }
    hitTestInfo.isHit = undefined;
    return hitTestInfo;
};
var getNearestXPoint = function (webAssemblyContext, xCoordinateCalculator, dataSeries, xHitCoord, isSorted) {
    var result = getNearestXyPoint(webAssemblyContext, xCoordinateCalculator, xCoordinateCalculator, dataSeries, xHitCoord, 0, 0);
    return result.nearestPointIndex;
};
var getNearestXyPoint = function (webassemblyContext, xCoordinateCalculator, yCoordinateCalculator, dataSeries, xHitCoord, yHitCoord, hitTestRadius) {
    var isCategoryAxis = xCoordinateCalculator.isCategoryCoordinateCalculator;
    var dataX = isCategoryAxis ? dataSeries.getNativeIndexes() : dataSeries.getNativeXValues();
    var dataY = dataSeries.getNativeYValues();
    return getNearestPoint(webassemblyContext, xCoordinateCalculator, yCoordinateCalculator, dataX, dataY, dataSeries.dataDistributionCalculator.isSortedAscending, xHitCoord, yHitCoord, hitTestRadius);
};
var getNearestPoint = function (webassemblyContext, xCoordinateCalculator, yCoordinateCalculator, xValues, yValues, isSorted, xHitCoord, yHitCoord, hitTestRadius) {
    var result;
    try {
        result = webassemblyContext.SCRTHitTestHelper.GetNearestXyPoint(xCoordinateCalculator.nativeCalculator, yCoordinateCalculator.nativeCalculator, xValues, yValues, isSorted, xHitCoord, yHitCoord, hitTestRadius !== null && hitTestRadius !== void 0 ? hitTestRadius : 1 // Default to 1 here so unsorted data will get nearest by x and y
        );
        return { nearestPointIndex: result.minD, distance: result.maxD };
    }
    finally {
        (0, Deleter_1.deleteSafe)(result);
    }
};
var getNearestXyyPoint = function (webassemblyContext, xCoordinateCalculator, yCoordinateCalculator, dataSeries, xHitCoord, yHitCoord, hitTestRadius) {
    var isCategoryAxis = xCoordinateCalculator.isCategoryCoordinateCalculator;
    var dataX = isCategoryAxis ? dataSeries.getNativeIndexes() : dataSeries.getNativeXValues();
    var dataY = dataSeries.getNativeYValues();
    var result;
    var nearestY;
    var distanceY;
    try {
        result = webassemblyContext.SCRTHitTestHelper.GetNearestXyPoint(xCoordinateCalculator.nativeCalculator, yCoordinateCalculator.nativeCalculator, dataX, dataY, dataSeries.dataDistributionCalculator.isSortedAscending, xHitCoord, yHitCoord, hitTestRadius !== null && hitTestRadius !== void 0 ? hitTestRadius : 1);
        nearestY = result.minD;
        distanceY = result.maxD;
    }
    finally {
        (0, Deleter_1.deleteSafe)(result);
    }
    try {
        result = webassemblyContext.SCRTHitTestHelper.GetNearestXyPoint(xCoordinateCalculator.nativeCalculator, yCoordinateCalculator.nativeCalculator, dataX, dataSeries.getNativeY1Values(), dataSeries.dataDistributionCalculator.isSortedAscending, xHitCoord, yHitCoord, hitTestRadius !== null && hitTestRadius !== void 0 ? hitTestRadius : 1);
        if (distanceY < result.maxD) {
            // Y is nearer
            return { nearestPointIndex: nearestY, distance: distanceY };
        }
        else {
            return { nearestPointIndex: result.minD, distance: result.maxD };
        }
    }
    finally {
        (0, Deleter_1.deleteSafe)(result);
    }
};
var getNearestUniformHeatmapPoint = function (xCoordinateCalculator, yCoordinateCalculator, heatmapDataSeries, xHitCoord, yHitCoord) {
    var xHitValue = xCoordinateCalculator.getDataValue(xHitCoord);
    var yHitValue = yCoordinateCalculator.getDataValue(yHitCoord);
    var xIndex = Math.floor((xHitValue - heatmapDataSeries.xStart) / heatmapDataSeries.xStep);
    var yIndex = Math.floor((yHitValue - heatmapDataSeries.yStart) / heatmapDataSeries.yStep);
    if (xIndex < 0 || xIndex >= heatmapDataSeries.arrayWidth || yIndex < 0 || yIndex >= heatmapDataSeries.arrayHeight) {
        return { xIndex: -1, yIndex: -1, zValue: undefined };
    }
    var zValue = heatmapDataSeries.getZValue(yIndex, xIndex);
    return { xIndex: xIndex, yIndex: yIndex, zValue: zValue };
};
var getNearestNonUniformHeatmapPoint = function (xCoordinateCalculator, yCoordinateCalculator, heatmapDataSeries, xHitCoord, yHitCoord) {
    var xHitValue = xCoordinateCalculator.getDataValue(xHitCoord);
    var yHitValue = yCoordinateCalculator.getDataValue(yHitCoord);
    var xCellOffsets = heatmapDataSeries.xCellOffsets, yCellOffsets = heatmapDataSeries.yCellOffsets;
    var xIndex = -1;
    if (xHitValue >= xCellOffsets[0] && xHitValue <= xCellOffsets[xCellOffsets.length - 1]) {
        for (var i = 0; i < xCellOffsets.length; i++) {
            var isWithinCellOffsets = xHitValue >= xCellOffsets[i] && xHitValue <= xCellOffsets[i + 1];
            if (isWithinCellOffsets) {
                xIndex = i;
                break;
            }
        }
    }
    var yIndex = -1;
    if (yHitValue >= yCellOffsets[0] && yHitValue <= yCellOffsets[yCellOffsets.length - 1]) {
        for (var i = 0; i < yCellOffsets.length - 1; i++) {
            var isWithinCellOffsets = yHitValue >= yCellOffsets[i] && yHitValue <= yCellOffsets[i + 1];
            if (isWithinCellOffsets) {
                yIndex = i;
                break;
            }
        }
    }
    // TODO shouldn't we return a neerest cell anyway?
    if (xIndex < 0 || xIndex >= heatmapDataSeries.arrayWidth || yIndex < 0 || yIndex >= heatmapDataSeries.arrayHeight) {
        return { xIndex: -1, yIndex: -1, zValue: undefined };
    }
    var zValue = heatmapDataSeries.getZValue(yIndex, xIndex);
    return { xIndex: xIndex, yIndex: yIndex, zValue: zValue };
};
var testIsHitForPoint = function (xCoordinateCalculator, yCoordinateCalculator, xValues, yValues, pointIndex, xHitCoord, yHitCoord, hitTestRadius, dataSeries) {
    var isCategoryAxis = xCoordinateCalculator.isCategoryCoordinateCalculator;
    var xValue = isCategoryAxis ? pointIndex : dataSeries.getNativeValue(xValues, pointIndex);
    var yValue = dataSeries.getNativeValue(yValues, pointIndex);
    var dataXCoord = xCoordinateCalculator.getCoordinate(xValue);
    var dataYCoord = yCoordinateCalculator.getCoordinate(yValue);
    var distance = (0, pointUtil_1.calcDistance)(xHitCoord, yHitCoord, dataXCoord, dataYCoord);
    return distance < hitTestRadius;
};
/**
 *
 * @param xCoordinateCalculator
 * @param yCoordinateCalculator
 * @param xValues
 * @param yValues
 * @param pointIndex
 * @param xHitCoord The X coordinate, isVertical property is already taken into account
 * @param yHitCoord The Y coordinate, isVertical property is already taken into account
 * @param hitTestRadius
 */
var testIsHitForLine = function (xCoordinateCalculator, yCoordinateCalculator, xValues, yValues, pointIndex, xHitCoord, yHitCoord, hitTestRadius, dataSeries) {
    var isHit;
    var secondPointIndex;
    var xLeft, xRight, yLeft, yRight;
    var isCategoryAxis = xCoordinateCalculator.isCategoryCoordinateCalculator;
    var xValue = isCategoryAxis ? pointIndex : dataSeries.getNativeValue(xValues, pointIndex);
    var yValue = dataSeries.getNativeValue(yValues, pointIndex);
    var xHitValue = xCoordinateCalculator.getDataValue(xHitCoord);
    if (xValue <= xHitValue) {
        xLeft = xValue;
        yLeft = yValue;
        xRight = isCategoryAxis ? pointIndex + 1 : dataSeries.getNativeValue(xValues, pointIndex + 1);
        yRight = dataSeries.getNativeValue(yValues, pointIndex + 1);
        secondPointIndex = pointIndex + 1;
    }
    else {
        xLeft = isCategoryAxis ? pointIndex - 1 : dataSeries.getNativeValue(xValues, pointIndex - 1);
        yLeft = dataSeries.getNativeValue(yValues, pointIndex - 1);
        secondPointIndex = pointIndex - 1;
        xRight = xValue;
        yRight = yValue;
    }
    var xLeftCoord = xCoordinateCalculator.getCoordinate(xLeft);
    var xRightCoord = xCoordinateCalculator.getCoordinate(xRight);
    var yLeftCoord = yCoordinateCalculator.getCoordinate(yLeft);
    var yRightCoord = yCoordinateCalculator.getCoordinate(yRight);
    var lineSegmentLength = (0, pointUtil_1.calcDistance)(xLeftCoord, yLeftCoord, xRightCoord, yRightCoord);
    var distanceToLeftPoint = (0, pointUtil_1.calcDistance)(xLeftCoord, yLeftCoord, xHitCoord, yHitCoord);
    var distanceToRightPoint = (0, pointUtil_1.calcDistance)(xRightCoord, yRightCoord, xHitCoord, yHitCoord);
    // Because the line that goes through two points is infinite it could happen that mouse click is near this line
    // but far away from the line segment, especially if the segment is almost a vertical line
    // in this case we set isHit = false
    if (distanceToLeftPoint > lineSegmentLength + hitTestRadius ||
        distanceToRightPoint > lineSegmentLength + hitTestRadius) {
        isHit = false;
    }
    else {
        isHit =
            (0, pointUtil_1.calcDistanceFromLine)(xHitCoord, yHitCoord, xLeftCoord, yLeftCoord, xRightCoord, yRightCoord) <
                hitTestRadius;
    }
    return { isHit: isHit, secondPointIndex: secondPointIndex };
};
var testIsHitForBand = function (isDigitalLine, xCoordinateCalculator, yCoordinateCalculator, xValues, getYValue, getY1Value, pointIndex, xHitCoord, yHitCoord, dataSeries) {
    var isHit;
    var xHitValue = xCoordinateCalculator.getDataValue(xHitCoord);
    var isCategoryAxis = xCoordinateCalculator.isCategoryCoordinateCalculator;
    var xValue = isCategoryAxis ? pointIndex : dataSeries.getNativeValue(xValues, pointIndex);
    var isLeftHit = xValue <= xHitValue;
    var secondPointIndex = isLeftHit ? pointIndex + 1 : pointIndex - 1;
    if (secondPointIndex < 0 || secondPointIndex >= xValues.size()) {
        return { isHit: false, secondPointIndex: undefined };
    }
    var secondPointXValue = isCategoryAxis ? secondPointIndex : dataSeries.getNativeValue(xValues, secondPointIndex);
    var xLeft = isLeftHit ? xValue : secondPointXValue;
    var yLeft = isLeftHit ? getYValue(pointIndex) : getYValue(secondPointIndex);
    var y1Left = isLeftHit ? getY1Value(pointIndex) : getY1Value(secondPointIndex);
    var xRight = isLeftHit ? secondPointXValue : xValue;
    var yRight = isLeftHit ? getYValue(secondPointIndex) : getYValue(pointIndex);
    var y1Right = isLeftHit ? getY1Value(secondPointIndex) : getY1Value(pointIndex);
    var xLeftCoord = xCoordinateCalculator.getCoordinate(xLeft);
    var xRightCoord = xCoordinateCalculator.getCoordinate(xRight);
    var yLeftCoord = yCoordinateCalculator.getCoordinate(yLeft);
    var yRightCoord = yCoordinateCalculator.getCoordinate(yRight);
    var y1LeftCoord = yCoordinateCalculator.getCoordinate(y1Left);
    var y1RightCoord = yCoordinateCalculator.getCoordinate(y1Right);
    if (isDigitalLine) {
        if (yLeftCoord < y1LeftCoord) {
            isHit = yHitCoord >= yLeftCoord && yHitCoord <= y1LeftCoord;
        }
        else {
            isHit = yHitCoord >= y1LeftCoord && yHitCoord <= yLeftCoord;
        }
    }
    else {
        var interpolatedLineY = interpolateLinear(xHitCoord, xLeftCoord, yLeftCoord, xRightCoord, yRightCoord);
        var interpolatedLineY1 = interpolateLinear(xHitCoord, xLeftCoord, y1LeftCoord, xRightCoord, y1RightCoord);
        if (interpolatedLineY < interpolatedLineY1) {
            isHit = yHitCoord >= interpolatedLineY && yHitCoord <= interpolatedLineY1;
        }
        else {
            isHit = yHitCoord >= interpolatedLineY1 && yHitCoord <= interpolatedLineY;
        }
    }
    return { isHit: isHit, secondPointIndex: secondPointIndex };
};
var testIsHitForColumn = function (xCoordinateCalculator, yCoordinateCalculator, renderableSeries, xValues, yValues, pointIndex, xHitCoord, yHitCoord) {
    var getDataPointWidth = renderableSeries.getDataPointWidth, dataPointWidth = renderableSeries.dataPointWidth, zeroLineY = renderableSeries.zeroLineY, dataSeries = renderableSeries.dataSeries, dataPointWidthMode = renderableSeries.dataPointWidthMode;
    var isCategoryAxis = xCoordinateCalculator.isCategoryCoordinateCalculator;
    var xValue = isCategoryAxis ? pointIndex : dataSeries.getNativeValue(xValues, pointIndex);
    var yValue = dataSeries.getNativeValue(yValues, pointIndex);
    var xCoord = xCoordinateCalculator.getCoordinate(xValue);
    var yCoord = yCoordinateCalculator.getCoordinate(yValue);
    var columnWidth = getDataPointWidth(xCoordinateCalculator, dataPointWidth, dataPointWidthMode);
    var zeroLineYCoord = yCoordinateCalculator.getCoordinate(zeroLineY);
    var halfWidth = columnWidth / 2;
    var topColumnSide = zeroLineYCoord > yCoord ? zeroLineYCoord : yCoord;
    var bottomColumnSide = zeroLineYCoord > yCoord ? yCoord : zeroLineYCoord;
    return (0, pointUtil_1.testIsInBounds)(xHitCoord, yHitCoord, xCoord - halfWidth, topColumnSide, xCoord + halfWidth, bottomColumnSide);
};
var testIsHitForErrorBars = function (xCoordinateCalculator, yCoordinateCalculator, renderableSeries, xValues, yValues, pointIndex, xHitCoord, yHitCoord) {
    var getDataPointWidth = renderableSeries.getDataPointWidth, dataPointWidth = renderableSeries.dataPointWidth, errorDirection = renderableSeries.errorDirection, dataSeries = renderableSeries.dataSeries, dataPointWidthMode = renderableSeries.dataPointWidthMode;
    var isCategoryAxis = xCoordinateCalculator.isCategoryCoordinateCalculator;
    var isVerticalDirection = errorDirection === ErrorDirection_1.EErrorDirection.Vertical;
    var xValue = isCategoryAxis ? pointIndex : dataSeries.getNativeValue(xValues, pointIndex);
    var yValue = dataSeries.getNativeValue(yValues, pointIndex);
    var highValue = dataSeries.getNativeValue(dataSeries.getNativeHighValues(), pointIndex);
    var lowValue = dataSeries.getNativeValue(dataSeries.getNativeLowValues(), pointIndex);
    if (isNaN(highValue))
        highValue = yValue;
    if (isNaN(lowValue))
        lowValue = yValue;
    var xCoord = xCoordinateCalculator.getCoordinate(xValue);
    var yCoord = yCoordinateCalculator.getCoordinate(yValue);
    var highCoord = isVerticalDirection
        ? yCoordinateCalculator.getCoordinate(highValue)
        : xCoordinateCalculator.getCoordinate(highValue);
    var lowCoord = isVerticalDirection
        ? yCoordinateCalculator.getCoordinate(lowValue)
        : xCoordinateCalculator.getCoordinate(lowValue);
    var columnWidth = getDataPointWidth(isVerticalDirection ? xCoordinateCalculator : yCoordinateCalculator, dataPointWidth, dataPointWidthMode);
    var halfWidth = columnWidth / 2;
    var isHit = false;
    var upperErrorBoundary = highCoord > lowCoord ? highCoord : lowCoord;
    var lowerErrorBoundary = highCoord > lowCoord ? lowCoord : highCoord;
    if (isVerticalDirection) {
        isHit = (0, pointUtil_1.testIsInBounds)(xHitCoord, yHitCoord, xCoord - halfWidth, upperErrorBoundary, xCoord + halfWidth, lowerErrorBoundary);
    }
    else {
        isHit = (0, pointUtil_1.testIsInBounds)(xHitCoord, yHitCoord, lowerErrorBoundary, yCoord + halfWidth, upperErrorBoundary, yCoord - halfWidth);
    }
    return { isHit: isHit, highValue: highValue, lowValue: lowValue };
};
var testIsHitForImpulse = function (xCoordinateCalculator, yCoordinateCalculator, renderableSeries, xValues, yValues, pointIndex, xHitCoord, yHitCoord, hitTestRadius) {
    var zeroLineY = renderableSeries.zeroLineY, dataSeries = renderableSeries.dataSeries;
    var isCategoryAxis = xCoordinateCalculator.isCategoryCoordinateCalculator;
    var xValue = isCategoryAxis ? pointIndex : dataSeries.getNativeValue(xValues, pointIndex);
    var yValue = dataSeries.getNativeValue(yValues, pointIndex);
    var xCoord = xCoordinateCalculator.getCoordinate(xValue);
    var yCoord = yCoordinateCalculator.getCoordinate(yValue);
    var zeroLineYCoord = yCoordinateCalculator.getCoordinate(zeroLineY);
    var topColumnSide = zeroLineYCoord > yCoord ? zeroLineYCoord : yCoord;
    var bottomColumnSide = zeroLineYCoord > yCoord ? yCoord : zeroLineYCoord;
    return (0, pointUtil_1.testIsInBounds)(xHitCoord, yHitCoord, xCoord, topColumnSide, xCoord, bottomColumnSide, hitTestRadius);
};
var testIsHitForOHLC = function (xCoordinateCalculator, yCoordinateCalculator, renderableSeries, dataSeries, pointIndex, xHitCoord, yHitCoord, hitTestRadius) {
    var getDataPointWidth = renderableSeries.getDataPointWidth, dataPointWidth = renderableSeries.dataPointWidth, dataPointWidthMode = renderableSeries.dataPointWidthMode;
    var isCategoryAxis = xCoordinateCalculator.isCategoryCoordinateCalculator;
    var xValue = isCategoryAxis ? pointIndex : dataSeries.getNativeValue(dataSeries.getNativeXValues(), pointIndex);
    var xCoord = xCoordinateCalculator.getCoordinate(xValue);
    var openValue = dataSeries.getNativeValue(dataSeries.getNativeOpenValues(), pointIndex);
    var openCoord = yCoordinateCalculator.getCoordinate(openValue);
    var highValue = dataSeries.getNativeValue(dataSeries.getNativeHighValues(), pointIndex);
    var highCoord = yCoordinateCalculator.getCoordinate(highValue);
    var lowValue = dataSeries.getNativeValue(dataSeries.getNativeLowValues(), pointIndex);
    var lowCoord = yCoordinateCalculator.getCoordinate(lowValue);
    var closeValue = dataSeries.getNativeValue(dataSeries.getNativeCloseValues(), pointIndex);
    var closeCoord = yCoordinateCalculator.getCoordinate(closeValue);
    var columnWidth = getDataPointWidth(xCoordinateCalculator, dataPointWidth, dataPointWidthMode);
    var halfWidth = columnWidth / 2;
    var topSide = closeCoord > openCoord ? closeCoord : openCoord;
    var bottomSide = closeCoord > openCoord ? openCoord : closeCoord;
    // test candle body
    var isCandleBodyHit = (0, pointUtil_1.testIsInBounds)(xHitCoord, yHitCoord, xCoord - halfWidth, topSide, xCoord + halfWidth, bottomSide);
    // test candle wicks
    var distanceToWicks = (0, pointUtil_1.calcDistanceFromLineSegment)(xHitCoord, yHitCoord, xCoord, highCoord, xCoord, lowCoord);
    var isHit = isCandleBodyHit || distanceToWicks < hitTestRadius;
    return { isHit: isHit, openValue: openValue, highValue: highValue, lowValue: lowValue, closeValue: closeValue };
};
var testIsHitForMountain = function (isDigitalLine, xCoordinateCalculator, yCoordinateCalculator, dataSeries, zeroLineY, pointIndex, xHitCoord, yHitCoord) {
    var isHit;
    var xValues = dataSeries.getNativeXValues();
    var isCategoryAxis = xCoordinateCalculator.isCategoryCoordinateCalculator;
    var xValue = isCategoryAxis ? pointIndex : dataSeries.getNativeValue(xValues, pointIndex);
    var yValues = dataSeries.getNativeYValues();
    var xHitValue = xCoordinateCalculator.getDataValue(xHitCoord);
    var isLeftHit = xValue <= xHitValue;
    var secondPointIndex = isLeftHit ? pointIndex + 1 : pointIndex - 1;
    if (secondPointIndex < 0 || secondPointIndex >= dataSeries.count()) {
        return { isHit: false, secondPointIndex: undefined };
    }
    var secondPointXValue = isCategoryAxis ? secondPointIndex : xValues.get(secondPointIndex);
    var xLeft = isLeftHit ? xValue : secondPointXValue;
    var yLeft = isLeftHit
        ? dataSeries.getNativeValue(yValues, pointIndex)
        : dataSeries.getNativeValue(yValues, secondPointIndex);
    var xRight = isLeftHit ? secondPointXValue : xValue;
    var yRight = isLeftHit
        ? dataSeries.getNativeValue(yValues, secondPointIndex)
        : dataSeries.getNativeValue(yValues, pointIndex);
    var xLeftCoord = xCoordinateCalculator.getCoordinate(xLeft);
    var xRightCoord = xCoordinateCalculator.getCoordinate(xRight);
    var yLeftCoord = yCoordinateCalculator.getCoordinate(yLeft);
    var yRightCoord = yCoordinateCalculator.getCoordinate(yRight);
    var zeroLineYCoord = yCoordinateCalculator.getCoordinate(zeroLineY);
    if (isDigitalLine) {
        if (yLeftCoord < zeroLineYCoord) {
            isHit = yHitCoord >= yLeftCoord && yHitCoord <= zeroLineYCoord;
        }
        else {
            isHit = yHitCoord >= zeroLineYCoord && yHitCoord <= yLeftCoord;
        }
    }
    else {
        var interpolatedLineY = interpolateLinear(xHitCoord, xLeftCoord, yLeftCoord, xRightCoord, yRightCoord);
        if (interpolatedLineY < zeroLineYCoord) {
            isHit = yHitCoord >= interpolatedLineY && yHitCoord <= zeroLineYCoord;
        }
        else {
            isHit = yHitCoord >= zeroLineYCoord && yHitCoord <= interpolatedLineY;
        }
    }
    return { isHit: isHit, secondPointIndex: secondPointIndex };
};
exports.hitTestHelpers = {
    createHitTestInfo: createHitTestInfo,
    getNearestPoint: getNearestPoint,
    getNearestXPoint: getNearestXPoint,
    getNearestXyPoint: getNearestXyPoint,
    getNearestXyyPoint: getNearestXyyPoint,
    getNearestUniformHeatmapPoint: getNearestUniformHeatmapPoint,
    getNearestNonUniformHeatmapPoint: getNearestNonUniformHeatmapPoint,
    testIsHitForPoint: testIsHitForPoint,
    testIsHitForLine: testIsHitForLine,
    testIsHitForBand: testIsHitForBand,
    testIsHitForColumn: testIsHitForColumn,
    testIsHitForOHLC: testIsHitForOHLC,
    testIsHitForMountain: testIsHitForMountain,
    testIsHitForErrorBars: testIsHitForErrorBars,
    testIsHitForImpulse: testIsHitForImpulse
};
