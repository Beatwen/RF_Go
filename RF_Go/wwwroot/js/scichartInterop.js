window.scichartInterop = {
    // Stockage des références des éléments pour pouvoir les filtrer
    chartState: {
        groups: {},
        sciChartSurface: null,
        wasmContext: null,
        sciChartModules: null,
        annotationVisibility: {}, // Pour suivre la visibilité par groupe
        groupNames: {} // Pour stocker les noms des groupes
    },
    
    // Nouvelle fonction pour définir les noms des groupes
    setGroupNames: function(groupNamesData) {
        this.chartState.groupNames = groupNamesData || {};
    },
    
    // Fonction pour obtenir le nom d'un groupe à partir de son ID
    getGroupName: function(groupId) {
        return this.chartState.groupNames[groupId] || `Groupe ${groupId}`;
    },
    
    initSciChart: async function (elementId, frequencyData, scans) {
        const {
            SciChartSurface,
            NumericAxis,
            FastLineRenderableSeries,
            XyDataSeries,
            NumberRange,
            ZoomPanModifier,
            MouseWheelZoomModifier,
            EXyDirection,
            BoxAnnotation,
            EHorizontalAnchorPoint,
            EVerticalAnchorPoint
        } = SciChart;

        // Stocker les modules pour une utilisation ultérieure
        this.chartState.sciChartModules = {
            BoxAnnotation,
            XyDataSeries,
            FastLineRenderableSeries
        };

        const { sciChartSurface, wasmContext } = await SciChartSurface.create(elementId, {
            theme: {
                sciChartBackground: "Transparent",
                loadingAnimationBackground: "Transparent",
                tickTextBrush: "White"
            },
            logoVisible: false
        });

        // Stocker les références pour pouvoir les manipuler plus tard
        this.chartState.sciChartSurface = sciChartSurface;
        this.chartState.wasmContext = wasmContext;
        
        sciChartSurface.background = "#1a1a27";

        // Define colors for different frequency types
        const frequencyColors = {
            usedFrequencies: "#FF0000",    // Red for used frequencies
            twoTX3rdOrder: "#00FF00",      // Green for 3rd order
            twoTX5rdOrder: "#0000FF",      // Blue for 5th order
            twoTX7rdOrder: "#FFFF00",      // Yellow for 7th order
            twoTX9rdOrder: "#FF00FF",      // Magenta for 9th order
            threeTX3rdOrder: "#00FFFF"     // Cyan for 3TX 3rd order
        };

        // Définir un ID explicite pour l'axe X
        const xAxis = new NumericAxis(wasmContext, {
            id: "DefaultAxisId",
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
            id: "DefaultAxisId",
            axisTitle: "Level (dB)",
            axisTitleStyle: { fontSize: 10, color: "White" },
            growBy: new NumberRange(0, 0),
            visibleRange: new NumberRange(-130, 0),
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

        const createDataSeries = (frequencies, dBLevel, color) => {
            const dataSeries = new XyDataSeries(wasmContext);
            if (Array.isArray(frequencies) && frequencies.length > 0) {
                frequencies.forEach(freq => {
                    dataSeries.append(freq, -130);
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
                xAxisId: "DefaultAxisId",
                yAxisId: "DefaultAxisId"
            });
        };

        // Méthode pour créer une box autour d'une fréquence
        const createBoxForFrequency = (freq, color, width = 200) => {
            console.log("Creating box for frequency:", freq, "with color:", color, "width:", width);
            
            // Créer une box autour de la fréquence avec la largeur spécifiée
            const boxAnnotation = new BoxAnnotation({
                x1: freq - width/2,  // Moitié de la largeur à gauche
                x2: freq + width/2,  // Moitié de la largeur à droite
                y1: -130,            // Du bas du graphique
                y2: 0,               // Au haut du graphique
                fill: color,         // Couleur avec transparence
                stroke: color,       // Même couleur pour le contour
                strokeThickness: 1   // Épaisseur de la bordure
            });
            
            console.log("Box properties:", {
                x1: boxAnnotation.x1, 
                x2: boxAnnotation.x2, 
                y1: boxAnnotation.y1, 
                y2: boxAnnotation.y2,
                fill: boxAnnotation.fill
            });
            
            sciChartSurface.annotations.add(boxAnnotation);
            console.log("Box added, total annotations:", sciChartSurface.annotations.size);
            
            return boxAnnotation;
        };

        // Process each group's data
        if (frequencyData.groupData) {
            console.log("GroupData found:", frequencyData.groupData);
            Object.entries(frequencyData.groupData).forEach(([groupId, groupData]) => {
                console.log("Processing group:", groupId, "with color:", groupData.color);
                
                // Stockage des références pour ce groupe
                this.chartState.groups[groupId] = {
                    id: groupId,
                    color: groupData.color,
                    series: [],
                    annotationData: [] // Stocke les données pour recréer les annotations, pas les références
                };
                
                // Initialiser l'état de visibilité à true
                this.chartState.annotationVisibility[groupId] = true;
                
                // Convertir la couleur du groupe en format RGBA avec transparence
                const groupColorRGBA = "rgba(" + 
                    parseInt(groupData.color.slice(1, 3), 16) + "," + 
                    parseInt(groupData.color.slice(3, 5), 16) + "," + 
                    parseInt(groupData.color.slice(5, 7), 16) + ",0.1)";
                
                console.log("Converted color to RGBA:", groupColorRGBA);
                
                // Définir les séries et leurs couleurs
                const seriesData = [
                    { data: groupData.usedFrequencies, level: 0, color: "Green" },
                    { data: groupData.twoTX3rdOrder, level: -40, color: "Purple" },
                    { data: groupData.twoTX5rdOrder, level: -60, color: "SteelBlue" },
                    { data: groupData.twoTX7rdOrder, level: -80, color: "Orange" },
                    { data: groupData.twoTX9rdOrder, level: -100, color: "Blue" },
                    { data: groupData.threeTX3rdOrder, level: -80, color: "Magenta" }
                ];
                
                // Créer une box pour CHAQUE fréquence dans CHAQUE série
                seriesData.forEach(series => {
                    if (series.data && series.data.length > 0) {
                        console.log(`Creating ${series.data.length} boxes for frequencies in series with level ${series.level}`);
                        
                        series.data.forEach(freq => {
                            // Stocker les données au lieu de la référence
                            this.chartState.groups[groupId].annotationData.push({
                                freq: freq,
                                color: groupColorRGBA,
                                width: 200
                            });
                            
                            // Créer l'annotation directement
                            createBoxForFrequency(freq, groupColorRGBA);
                        });
                    }
                    
                    // Créer la série de lignes pour affichage
                    const dataSeries = createDataSeries(series.data, series.level, series.color);
                    const lineSeries = createLineSeries(dataSeries, series.color);
                    sciChartSurface.renderableSeries.add(lineSeries);
                    this.chartState.groups[groupId].series.push(lineSeries);
                });
            });
            
            // Créer la légende après avoir traité tous les groupes
            this.createLegend(elementId, frequencyData.groupData);
        }

        // Add scans if available
        if (scans && scans.length > 0) {
            scans.forEach(scan => {
                if (scan.isVisible) {
                    const frequencies = JSON.parse(scan.frequenciesJson);
                    const values = JSON.parse(scan.valuesJson);
                    const scanSeries = new FastLineRenderableSeries(wasmContext, {
                        dataSeries: new XyDataSeries(wasmContext, {
                            xValues: frequencies,
                            yValues: values
                        }),
                        stroke: "#808080",
                        strokeThickness: 1,
                        opacity: 0.5,
                        xAxisId: "DefaultAxisId",
                        yAxisId: "DefaultAxisId"
                    });
                    sciChartSurface.renderableSeries.add(scanSeries);
                }
            });
        }

        sciChartSurface.zoomExtents();
    },
    
    // Fonction pour créer la légende avec filtres
    createLegend: function(chartDivId, groupData) {
        // Créer un conteneur pour la légende
        const legendContainer = document.createElement('div');
        legendContainer.style.position = 'absolute';
        legendContainer.style.top = '10px';
        legendContainer.style.left = '10px'; // Placer à gauche au lieu de droite
        legendContainer.style.backgroundColor = 'rgba(26, 26, 39, 0.9)';
        legendContainer.style.padding = '10px';
        legendContainer.style.borderRadius = '5px';
        legendContainer.style.color = 'white';
        legendContainer.style.zIndex = '1000';
        legendContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        legendContainer.style.maxHeight = '80%';
        legendContainer.style.overflowY = 'auto';
        legendContainer.style.maxWidth = '280px'; // Limiter la largeur
        legendContainer.style.fontSize = '12px'; // Réduire la taille de police
        
        // Ajouter un titre et boutons globaux
        const headerContainer = document.createElement('div');
        headerContainer.style.display = 'flex';
        headerContainer.style.justifyContent = 'space-between';
        headerContainer.style.alignItems = 'center';
        headerContainer.style.marginBottom = '10px';
        headerContainer.style.borderBottom = '1px solid rgba(255,255,255,0.2)';
        headerContainer.style.paddingBottom = '5px';
        
        const title = document.createElement('div');
        title.textContent = 'Légende';
        title.style.fontWeight = 'bold';
        headerContainer.appendChild(title);
        
        // Conteneur pour les boutons globaux
        const globalButtonsContainer = document.createElement('div');
        
        // Bouton pour masquer/afficher la légende
        const toggleLegendButton = document.createElement('button');
        toggleLegendButton.innerHTML = '&minus;'; // Symbole moins
        toggleLegendButton.title = 'Réduire/Agrandir la légende';
        toggleLegendButton.style.backgroundColor = 'rgba(0,0,0,0.2)';
        toggleLegendButton.style.border = '1px solid rgba(255,255,255,0.3)';
        toggleLegendButton.style.borderRadius = '3px';
        toggleLegendButton.style.color = 'white';
        toggleLegendButton.style.width = '20px';
        toggleLegendButton.style.height = '20px';
        toggleLegendButton.style.marginRight = '5px';
        toggleLegendButton.style.padding = '0';
        toggleLegendButton.style.fontSize = '14px';
        toggleLegendButton.style.cursor = 'pointer';
        toggleLegendButton.style.textAlign = 'center';
        toggleLegendButton.style.lineHeight = '18px';
        
        const legendContentContainer = document.createElement('div');
        legendContentContainer.id = 'legend-content';
        
        toggleLegendButton.addEventListener('click', () => {
            if (legendContentContainer.style.display === 'none') {
                legendContentContainer.style.display = 'block';
                toggleLegendButton.innerHTML = '&minus;';
            } else {
                legendContentContainer.style.display = 'none';
                toggleLegendButton.innerHTML = '+';
            }
        });
        
        // Bouton pour masquer/afficher toutes les boxes
        const toggleAllBoxesButton = document.createElement('button');
        toggleAllBoxesButton.textContent = 'Hide boxes';
        toggleAllBoxesButton.style.backgroundColor = 'rgba(0,0,0,0.2)';
        toggleAllBoxesButton.style.border = '1px solid rgba(255,255,255,0.3)';
        toggleAllBoxesButton.style.borderRadius = '3px';
        toggleAllBoxesButton.style.color = 'white';
        toggleAllBoxesButton.style.padding = '2px 5px';
        toggleAllBoxesButton.style.fontSize = '11px';
        toggleAllBoxesButton.style.cursor = 'pointer';
        
        let allBoxesVisible = true;
        toggleAllBoxesButton.addEventListener('click', () => {
            allBoxesVisible = !allBoxesVisible;
            toggleAllBoxesButton.textContent = allBoxesVisible ? 'Hide boxes' : 'Show boxes';
            
            // Parcourir tous les groupes et mettre à jour les checkboxes et visibilité
            Object.keys(this.chartState.groups).forEach(groupId => {
                const annotCheckbox = document.getElementById(`annot-checkbox-${groupId}`);
                if (annotCheckbox) {
                    annotCheckbox.checked = allBoxesVisible;
                }
                this.toggleGroupAnnotations(groupId, allBoxesVisible);
            });
        });
        
        globalButtonsContainer.appendChild(toggleLegendButton);
        globalButtonsContainer.appendChild(toggleAllBoxesButton);
        headerContainer.appendChild(globalButtonsContainer);
        legendContainer.appendChild(headerContainer);
        legendContainer.appendChild(legendContentContainer);
        
        // Ajouter des options pour chaque groupe
        Object.entries(groupData).forEach(([groupId, data]) => {
            const groupContainer = document.createElement('div');
            groupContainer.style.display = 'flex';
            groupContainer.style.alignItems = 'center';
            groupContainer.style.marginBottom = '8px';
            groupContainer.style.padding = '5px';
            groupContainer.style.borderRadius = '3px';
            groupContainer.style.backgroundColor = 'rgba(255,255,255,0.05)';
            
            // Case à cocher pour les séries (lignes)
            const seriesCheckbox = document.createElement('input');
            seriesCheckbox.type = 'checkbox';
            seriesCheckbox.checked = true;
            seriesCheckbox.style.marginRight = '5px';
            seriesCheckbox.id = `series-checkbox-${groupId}`;
            seriesCheckbox.addEventListener('change', (e) => {
                this.toggleGroupSeries(groupId, e.target.checked);
            });
            
            // Case à cocher pour les annotations (rectangles)
            const annotationsCheckbox = document.createElement('input');
            annotationsCheckbox.type = 'checkbox';
            annotationsCheckbox.checked = true;
            annotationsCheckbox.style.marginRight = '5px';
            annotationsCheckbox.style.marginLeft = '10px';
            annotationsCheckbox.id = `annot-checkbox-${groupId}`;
            annotationsCheckbox.addEventListener('change', (e) => {
                this.toggleGroupAnnotations(groupId, e.target.checked);
            });
            
            // Indicateur de couleur
            const colorIndicator = document.createElement('span');
            colorIndicator.style.display = 'inline-block';
            colorIndicator.style.width = '14px';
            colorIndicator.style.height = '14px';
            colorIndicator.style.backgroundColor = data.color;
            colorIndicator.style.marginRight = '6px';
            colorIndicator.style.borderRadius = '2px';
            
            // Conteneur pour les informations du groupe
            const groupInfoContainer = document.createElement('div');
            groupInfoContainer.style.display = 'flex';
            groupInfoContainer.style.flexDirection = 'column';
            groupInfoContainer.style.flex = '1';
            
            // Label pour le groupe
            const groupLabel = document.createElement('span');
            groupLabel.textContent = this.getGroupName(groupId);
            groupLabel.style.fontWeight = 'bold';
            groupInfoContainer.appendChild(groupLabel);
            
            // Conteneur pour les cases à cocher des rectangles
            const annotationsContainer = document.createElement('div');
            annotationsContainer.style.display = 'flex';
            annotationsContainer.style.alignItems = 'center';
            annotationsContainer.style.marginTop = '3px';
            
            // Label pour les annotations
            const annotationsLabel = document.createElement('span');
            annotationsLabel.textContent = 'Box';
            annotationsLabel.style.fontSize = '11px';
            annotationsLabel.style.opacity = '0.8';
            
            annotationsContainer.appendChild(annotationsCheckbox);
            annotationsContainer.appendChild(annotationsLabel);
            
            // Ajouter les éléments au conteneur du groupe
            groupContainer.appendChild(seriesCheckbox);
            groupContainer.appendChild(colorIndicator);
            groupContainer.appendChild(groupInfoContainer);
            groupContainer.appendChild(annotationsContainer);
            
            legendContentContainer.appendChild(groupContainer);
        });
        
        // Rendre la légende déplaçable
        this.makeDraggable(legendContainer, headerContainer);
        
        // Ajouter la légende au conteneur du graphique
        const chartDiv = document.getElementById(chartDivId);
        chartDiv.style.position = 'relative';
        chartDiv.appendChild(legendContainer);
    },
    
    // Fonction pour rendre un élément déplaçable
    makeDraggable: function(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        handle.style.cursor = 'move';
        handle.style.userSelect = 'none';
        
        handle.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // Récupérer la position initiale du curseur
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Appeler une fonction à chaque mouvement du curseur
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculer la nouvelle position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Définir la nouvelle position de l'élément
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            // Arrêter de bouger quand le bouton de la souris est relâché
            document.onmouseup = null;
            document.onmousemove = null;
        }
    },
    
    // Fonction pour afficher/masquer les séries d'un groupe
    toggleGroupSeries: function(groupId, isVisible) {
        console.log(`Toggling series for group ${groupId} to ${isVisible ? 'visible' : 'hidden'}`);
        const group = this.chartState.groups[groupId];
        if (group && group.series) {
            group.series.forEach(series => {
                series.isVisible = isVisible;
            });
            
            // Synchroniser l'état des annotations avec celui des séries
            // Quand on masque les fréquences, on masque aussi les box annotations
            const annotCheckbox = document.getElementById(`annot-checkbox-${groupId}`);
            if (annotCheckbox) {
                // Mettre à jour la case à cocher des annotations
                annotCheckbox.checked = isVisible;
            }
            
            // Mettre à jour l'état de visibilité des annotations
            this.chartState.annotationVisibility[groupId] = isVisible;
            
            // Reconstruire les annotations
            this.rebuildAllAnnotations();
            
            // Mettre à jour le graphique
            if (this.chartState.sciChartSurface) {
                this.chartState.sciChartSurface.invalidateElement();
            }
        }
    },
    
    // Fonction pour afficher/masquer les annotations d'un groupe
    toggleGroupAnnotations: function(groupId, isVisible) {
        console.log(`Toggling annotations for group ${groupId} to ${isVisible ? 'visible' : 'hidden'}`);
        
        // Mettre à jour l'état de visibilité
        this.chartState.annotationVisibility[groupId] = isVisible;
        
        // Récupérer les modules nécessaires
        const surface = this.chartState.sciChartSurface;
        const wasmContext = this.chartState.wasmContext;
        const BoxAnnotation = this.chartState.sciChartModules.BoxAnnotation;
        
        if (!surface || !wasmContext || !BoxAnnotation) {
            console.error("SciChart surface, wasmContext, or BoxAnnotation is not available");
            return;
        }
        
        // Régénérer toutes les annotations
        this.rebuildAllAnnotations();
    },
    
    // Fonction pour reconstruire toutes les annotations
    rebuildAllAnnotations: function() {
        const surface = this.chartState.sciChartSurface;
        const wasmContext = this.chartState.wasmContext;
        const BoxAnnotation = this.chartState.sciChartModules.BoxAnnotation;
        
        if (!surface || !wasmContext || !BoxAnnotation) {
            console.error("SciChart surface, wasmContext, or BoxAnnotation is not available");
            return;
        }
        
        // Supprimer toutes les annotations existantes
        surface.annotations.clear();
        
        // Recréer les annotations pour chaque groupe visible
        Object.entries(this.chartState.groups).forEach(([groupId, group]) => {
            if (this.chartState.annotationVisibility[groupId] && group.annotationData) {
                console.log(`Recreating ${group.annotationData.length} annotations for group ${groupId}`);
                
                group.annotationData.forEach(data => {
                    const annotation = new BoxAnnotation({
                        x1: data.freq - data.width/2,
                        x2: data.freq + data.width/2,
                        y1: -130,
                        y2: 0,
                        fill: data.color,
                        stroke: data.color,
                        strokeThickness: 1
                    });
                    
                    surface.annotations.add(annotation);
                });
            }
        });
        
        // Forcer la mise à jour
        surface.invalidateElement();
    },
    
    updateScans: function (chartDivId, scans) {
        const sciChartSurface = document.getElementById(chartDivId).sciChartSurface;
        if (!sciChartSurface) return;

        // Remove existing scan series
        const existingScanSeries = sciChartSurface.renderableSeries.filter(rs => rs.isScanSeries);
        existingScanSeries.forEach(rs => sciChartSurface.renderableSeries.remove(rs));
        
        // Add new scan series
        scans.forEach(scan => {
            const frequencies = JSON.parse(scan.frequenciesJson);
            console.log(frequencies)
            const values = JSON.parse(scan.valuesJson);
            console.log("Values ", values)
            const scanSeries = new SciChart.Charting.Visuals.RenderableSeries.FastLineRenderableSeries({
                stroke: "#808080", // Grey color for scans
                strokeThickness: 1,
                opacity: 0.5,
                isScanSeries: true,
                dataSeries: new SciChart.Charting.Model.DataSeries.XyDataSeries({
                    xValues: frequencies,
                    yValues: values
                })
            });

            sciChartSurface.renderableSeries.add(scanSeries);
        });

        sciChartSurface.zoomExtents();
    }
};