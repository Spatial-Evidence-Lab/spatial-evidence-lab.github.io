var wms_layers = [];


        var lyr_CARTOPositron_0 = new ol.layer.Tile({
            'title': 'CARTO Positron',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_3h4z_1_8f89edc890a6f37ec1295171'
            })
        });
var format_InterventionPriority_1 = new ol.format.GeoJSON();
var features_InterventionPriority_1 = format_InterventionPriority_1.readFeatures(json_InterventionPriority_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_InterventionPriority_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_InterventionPriority_1.addFeatures(features_InterventionPriority_1);
var lyr_InterventionPriority_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_InterventionPriority_1, 
                style: style_InterventionPriority_1,
                popuplayertitle: 'Intervention Priority',
                interactive: false,
    title: 'Intervention Priority<br />\
    <img src="styles/legend/InterventionPriority_1_0.png" /> Priority<br />\
    <img src="styles/legend/InterventionPriority_1_1.png" /> High Concern<br />\
    <img src="styles/legend/InterventionPriority_1_2.png" /> Concern<br />\
    <img src="styles/legend/InterventionPriority_1_3.png" /> Emerging<br />\
    <img src="styles/legend/InterventionPriority_1_4.png" /> Neutral<br />' });
var format_BandonPublicTransportAccessibilityAnalysis_2 = new ol.format.GeoJSON();
var features_BandonPublicTransportAccessibilityAnalysis_2 = format_BandonPublicTransportAccessibilityAnalysis_2.readFeatures(json_BandonPublicTransportAccessibilityAnalysis_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_BandonPublicTransportAccessibilityAnalysis_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_BandonPublicTransportAccessibilityAnalysis_2.addFeatures(features_BandonPublicTransportAccessibilityAnalysis_2);
var lyr_BandonPublicTransportAccessibilityAnalysis_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_BandonPublicTransportAccessibilityAnalysis_2, 
                style: style_BandonPublicTransportAccessibilityAnalysis_2,
                popuplayertitle: 'Bandon Public Transport Accessibility Analysis',
                interactive: true,
                title: '<img src="styles/legend/BandonPublicTransportAccessibilityAnalysis_2.png" /> Bandon Public Transport Accessibility Analysis'
            });
var format_Study_boundary_3 = new ol.format.GeoJSON();
var features_Study_boundary_3 = format_Study_boundary_3.readFeatures(json_Study_boundary_3, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Study_boundary_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Study_boundary_3.addFeatures(features_Study_boundary_3);
var lyr_Study_boundary_3 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Study_boundary_3, 
                style: style_Study_boundary_3,
                popuplayertitle: 'Study_boundary',
                interactive: false,
                title: '<img src="styles/legend/Study_boundary_3.png" /> Study_boundary'
            });
var format_Busstop_4 = new ol.format.GeoJSON();
var features_Busstop_4 = format_Busstop_4.readFeatures(json_Busstop_4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Busstop_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Busstop_4.addFeatures(features_Busstop_4);
var lyr_Busstop_4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Busstop_4, 
                style: style_Busstop_4,
                popuplayertitle: 'Bus stop',
                interactive: false,
                title: '<img src="styles/legend/Busstop_4.png" /> Bus stop'
            });
var group_WalkingAccessibility = new ol.layer.Group({
                                layers: [],
                                fold: 'open',
                                title: 'Walking Accessibility'});
var group_PublicTransport = new ol.layer.Group({
                                layers: [],
                                fold: 'open',
                                title: 'Public Transport'});
var group_PopulationVulnerability = new ol.layer.Group({
                                layers: [],
                                fold: 'open',
                                title: 'Population Vulnerability'});
var group_CompositeAccessibility = new ol.layer.Group({
                                layers: [],
                                fold: 'open',
                                title: 'Composite Accessibility'});

lyr_CARTOPositron_0.setVisible(true);lyr_InterventionPriority_1.setVisible(true);lyr_BandonPublicTransportAccessibilityAnalysis_2.setVisible(true);lyr_Study_boundary_3.setVisible(true);lyr_Busstop_4.setVisible(true);
var layersList = [lyr_CARTOPositron_0,lyr_InterventionPriority_1,lyr_BandonPublicTransportAccessibilityAnalysis_2,lyr_Study_boundary_3,lyr_Busstop_4];
lyr_InterventionPriority_1.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'OBJECTID_1': 'OBJECTID', 'GEOGID': 'GEOGID', 'AREA': 'AREA', 'AS': 'AS', 'Elderly_Ratio': 'Elderly_Ratio', 'Health_Disability': 'Health_Disability', 'NoCar_Ratio': 'NoCar_Ratio', 'Econ_Vuln': 'Econ_Vuln', 'Elderly_Norm': 'Elderly_Norm', 'Health_Norm': 'Health_Norm', 'NoCar_Norm': 'NoCar_Norm', 'Econ_Norm': 'Econ_Norm', 'Vulnerability_Index': 'Vulnerability_Index', 'Composite_Accessibility_Index': 'Composite_Accessibility_Index', 'Shape_Length': 'Shape_Length', 'Shape_Area': 'Shape_Area', 'CAI_norm': 'CAI_norm', 'VUL_norm': 'VUL_norm', 'Access_Deficit': 'Access_Deficit', 'Hotspot_Score': 'Hotspot_Score', 'Hotspot_Score_eq': 'Hotspot_Score_eq', });
lyr_BandonPublicTransportAccessibilityAnalysis_2.set('fieldAliases', {'GEOGID': 'GEOGID', 'Small Area ID': 'Small Area ID', 'Electoral Division': 'Electoral Division', 'Walking Catchment': 'Walking Catchment', 'Walking Accessibility': 'Walking Accessibility', 'Peak-Time Service': 'Peak-Time Service', 'Older Population': 'Older Population', 'Health Vulnerability': 'Health Vulnerability', 'No-Car Vulnerability': 'No-Car Vulnerability', 'Economic Vulnerability': 'Economic Vulnerability', 'Population Vulnerability': 'Population Vulnerability', 'Composite Accessibility': 'Composite Accessibility', 'Accessibility Deficit': 'Accessibility Deficit', 'Intervention Priority': 'Intervention Priority', });
lyr_Study_boundary_3.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'URBAN_AREA_GUID': 'URBAN_AREA_GUID', 'URBAN_AREA_CODE': 'URBAN_AREA_CODE', 'URBAN_AREA_NAME': 'URBAN_AREA_NAME', 'COUNTY': 'COUNTY', 'Centroid_x': 'Centroid_x', 'Centroid_y': 'Centroid_y', 'Shape_Length': 'Shape_Length', 'Shape_Area': 'Shape_Area', });
lyr_Busstop_4.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'stop_id': 'stop_id', 'stop_code': 'stop_code', 'stop_name': 'stop_name', 'stop_desc': 'stop_desc', 'stop_lat': 'stop_lat', 'stop_lon': 'stop_lon', 'zone_id': 'zone_id', 'stop_url': 'stop_url', 'location_type': 'location_type', 'parent_station': 'parent_station', });
lyr_InterventionPriority_1.set('fieldImages', {'OBJECTID': 'TextEdit', 'OBJECTID_1': 'Range', 'GEOGID': 'TextEdit', 'AREA': 'Range', 'AS': 'TextEdit', 'Elderly_Ratio': 'TextEdit', 'Health_Disability': 'TextEdit', 'NoCar_Ratio': 'TextEdit', 'Econ_Vuln': 'TextEdit', 'Elderly_Norm': 'TextEdit', 'Health_Norm': 'TextEdit', 'NoCar_Norm': 'TextEdit', 'Econ_Norm': 'TextEdit', 'Vulnerability_Index': 'TextEdit', 'Composite_Accessibility_Index': 'TextEdit', 'Shape_Length': 'TextEdit', 'Shape_Area': 'TextEdit', 'CAI_norm': 'TextEdit', 'VUL_norm': 'TextEdit', 'Access_Deficit': 'TextEdit', 'Hotspot_Score': 'TextEdit', 'Hotspot_Score_eq': 'TextEdit', });
lyr_BandonPublicTransportAccessibilityAnalysis_2.set('fieldImages', {'GEOGID': 'TextEdit', 'Small Area ID': 'TextEdit', 'Electoral Division': 'TextEdit', 'Walking Catchment': 'TextEdit', 'Walking Accessibility': 'TextEdit', 'Peak-Time Service': 'TextEdit', 'Older Population': 'TextEdit', 'Health Vulnerability': 'TextEdit', 'No-Car Vulnerability': 'TextEdit', 'Economic Vulnerability': 'TextEdit', 'Population Vulnerability': 'TextEdit', 'Composite Accessibility': 'TextEdit', 'Accessibility Deficit': 'TextEdit', 'Intervention Priority': 'TextEdit', });
lyr_Study_boundary_3.set('fieldImages', {'OBJECTID': 'TextEdit', 'URBAN_AREA_GUID': 'TextEdit', 'URBAN_AREA_CODE': 'TextEdit', 'URBAN_AREA_NAME': 'TextEdit', 'COUNTY': 'TextEdit', 'Centroid_x': 'Range', 'Centroid_y': 'Range', 'Shape_Length': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr_Busstop_4.set('fieldImages', {'OBJECTID': 'TextEdit', 'stop_id': 'TextEdit', 'stop_code': 'Range', 'stop_name': 'TextEdit', 'stop_desc': 'TextEdit', 'stop_lat': 'TextEdit', 'stop_lon': 'TextEdit', 'zone_id': 'TextEdit', 'stop_url': 'TextEdit', 'location_type': 'TextEdit', 'parent_station': 'TextEdit', });
lyr_InterventionPriority_1.set('fieldLabels', {'OBJECTID': 'header label - always visible', 'OBJECTID_1': 'header label - always visible', 'GEOGID': 'header label - always visible', 'AREA': 'header label - always visible', 'AS': 'header label - always visible', 'Elderly_Ratio': 'header label - always visible', 'Health_Disability': 'header label - always visible', 'NoCar_Ratio': 'header label - always visible', 'Econ_Vuln': 'header label - always visible', 'Elderly_Norm': 'header label - always visible', 'Health_Norm': 'header label - always visible', 'NoCar_Norm': 'header label - always visible', 'Econ_Norm': 'header label - always visible', 'Vulnerability_Index': 'header label - always visible', 'Composite_Accessibility_Index': 'header label - always visible', 'Shape_Length': 'header label - always visible', 'Shape_Area': 'header label - always visible', 'CAI_norm': 'header label - always visible', 'VUL_norm': 'header label - always visible', 'Access_Deficit': 'header label - always visible', 'Hotspot_Score': 'header label - always visible', 'Hotspot_Score_eq': 'header label - always visible', });
lyr_BandonPublicTransportAccessibilityAnalysis_2.set('fieldLabels', {
    'GEOGID': 'hidden field',

    'Small Area ID':
        'inline label - visible with data',

    'Electoral Division':
        'inline label - visible with data',

    'Walking Catchment':
        'inline label - visible with data',

    'Walking Accessibility':
        'inline label - visible with data',

    'Peak-Time Service':
        'inline label - visible with data',

    'Older Population':
        'inline label - visible with data',

    'Health Vulnerability':
        'inline label - visible with data',

    'No-Car Vulnerability':
        'inline label - visible with data',

    'Economic Vulnerability':
        'inline label - visible with data',

    'Population Vulnerability':
        'inline label - visible with data',

    'Composite Accessibility':
        'inline label - visible with data',

    'Accessibility Deficit':
        'inline label - visible with data',

    'Intervention Priority':
        'inline label - visible with data'
});
lyr_Study_boundary_3.set('fieldLabels', {'OBJECTID': 'header label - always visible', 'URBAN_AREA_GUID': 'header label - always visible', 'URBAN_AREA_CODE': 'header label - always visible', 'URBAN_AREA_NAME': 'header label - always visible', 'COUNTY': 'header label - always visible', 'Centroid_x': 'header label - always visible', 'Centroid_y': 'header label - always visible', 'Shape_Length': 'header label - always visible', 'Shape_Area': 'header label - always visible', });
lyr_Busstop_4.set('fieldLabels', {'OBJECTID': 'header label - always visible', 'stop_id': 'header label - always visible', 'stop_code': 'header label - always visible', 'stop_name': 'header label - always visible', 'stop_desc': 'header label - always visible', 'stop_lat': 'header label - always visible', 'stop_lon': 'header label - always visible', 'zone_id': 'header label - always visible', 'stop_url': 'header label - always visible', 'location_type': 'header label - always visible', 'parent_station': 'header label - always visible', });
lyr_Busstop_4.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});