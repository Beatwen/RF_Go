window.scichartInterop = {
    initSciChart: async function (elementId, frequencyData) {
        const {
            SciChartSurface,
            NumericAxis,
            FastLineRenderableSeries,
            XyDataSeries,
            NumberRange,
            ZoomPanModifier,
            MouseWheelZoomModifier,
            EXyDirection
        } = SciChart;

        const { sciChartSurface, wasmContext } = await SciChartSurface.create(elementId, {
            theme: {
                sciChartBackground: "Transparent",
                loadingAnimationBackground: "Transparent",
                tickTextBrush: "White"
            },
            logoVisible: false
        });

        sciChartSurface.background = "#1a1a27";

        // Définir un ID explicite pour l'axe X
        const xAxis = new NumericAxis(wasmContext, {
            id: "xAxis",
            axisTitle: "Frequency (Hz)",
            axisTitleStyle: { fontSize: 10, color: "White" },
            growBy: new NumberRange(0.1, 0.1),
            backgroundColor: "Transparent",
            axisBandsFill: "Transparent",
            majorGridLineBrush: "#FFFFFF33",
            minorGridLineBrush: "#FFFFFF33",
            axisBorder: {
                borderLeft: 0,
                borderTop: 0,
                borderRight: 0,
                borderBottom: 0,
                color: "White"
            }
        });

        const yAxis = new NumericAxis(wasmContext, {
            id: "yAxis",
            axisTitle: "Level (dB)",
            axisTitleStyle: { fontSize: 10, color: "White" },
            growBy: new NumberRange(0, 0),
            visibleRange: new NumberRange(-100, 0),
            backgroundColor: "Transparent",
            axisBandsFill: "Transparent",
            majorGridLineStyle: { color: "Transparent" },
            minorGridLineStyle: { color: "Transparent" },
            axisBorder: {
                borderLeft: 0,
                borderTop: 0,
                borderRight: 0,
                borderBottom: 0,
                color: "White"
            }
        });

        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        // Configuration des modificateurs
        const zoomPanModifier = new ZoomPanModifier({
            xyDirection: EXyDirection.XDirection,
            clipModeX: "None"
        });

        const mouseWheelModifier = new MouseWheelZoomModifier({
            xyDirection: EXyDirection.XDirection,
            clipModeX: "None"
        });

        sciChartSurface.chartModifiers.add(zoomPanModifier);
        sciChartSurface.chartModifiers.add(mouseWheelModifier);

        const createDataSeries = (frequencies, dBLevel) => {
            const dataSeries = new XyDataSeries(wasmContext);
            if (Array.isArray(frequencies) && frequencies.length > 0) {
                frequencies.forEach(freq => {
                    dataSeries.append(freq, -100);
                    dataSeries.append(freq, dBLevel);
                    dataSeries.append(NaN, NaN);
                });
            } else {
                console.warn("Empty or invalid frequencies array:", frequencies);
            }
            return dataSeries;
        };

        const createLineSeries = (dataSeries, color) => {
            return new FastLineRenderableSeries(wasmContext, {
                dataSeries: dataSeries,
                stroke: color,
                strokeThickness: 2,
                xAxisId: "xAxis",  // Associer la série à l'axe X
                yAxisId: "yAxis"   // Associer la série à l'axe Y
            });
        };
        console.log(frequencyData.usedFrequencies);
        // Création des séries de données avec les IDs d'axes spécifiés
        const seriesData = [
            { data: frequencyData.usedFrequencies, level: 0, color: "Green" },
            { data: frequencyData.twoTX3rdOrder, level: -40, color: "Purple" },
            { data: frequencyData.twoTX5rdOrder, level: -60, color: "SteelBlue" },
            { data: frequencyData.twoTX7rdOrder, level: -80, color: "Orange" },
            { data: frequencyData.twoTX9rdOrder, level: -100, color: "Blue" },
            { data: frequencyData.threeTX3rdOrder, level: -80, color: "Magenta" }
        ];

        // Création et ajout des séries
        seriesData.forEach(series => {
            const dataSeries = createDataSeries(series.data, series.level);
            const lineSeries = createLineSeries(dataSeries, series.color);
            sciChartSurface.renderableSeries.add(lineSeries);
        });
    }
};