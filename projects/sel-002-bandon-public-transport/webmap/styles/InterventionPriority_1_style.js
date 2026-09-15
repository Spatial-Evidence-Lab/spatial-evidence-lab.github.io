var size = 0;
var placement = 'point';

var style_InterventionPriority_1 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var labelText = ""; 
    var value = feature.get("Hotspot_Score_eq");
    var labelFont = "10px, sans-serif";
    var labelFill = "#000000";
    var bufferColor = "";
    var bufferWidth = 0;
    var textAlign = 'left';
    var offsetX = 8;
    var offsetY = 3;
    var overflow = false;
    var repeat = 0;
    var placement = 'point';
    if ("" !== null) {
        labelText = String("");
    }
    if (value >= 0.744743 && value <= 0.947497) {
            style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(178,178,178,0.35)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 2.6599999999999997}),fill: new ol.style.Fill({color: 'rgba(116,60,104,0.35)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })]
                    } else if (value >= 0.465323 && value <= 0.744743) {
            style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(178,178,178,0.35)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 2.6599999999999997}),fill: new ol.style.Fill({color: 'rgba(178,98,57,0.35)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })]
                    } else if (value >= 0.321568 && value <= 0.465323) {
            style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(178,178,178,0.35)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 2.6599999999999997}),fill: new ol.style.Fill({color: 'rgba(217,154,43,0.35)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })]
                    } else if (value >= 0.151236 && value <= 0.321568) {
            style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(178,178,178,0.35)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 2.6599999999999997}),fill: new ol.style.Fill({color: 'rgba(213,191,113,0.35)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })]
                    } else if (value >= 0.058601 && value <= 0.151236) {
            style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(178,178,178,0.35)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 2.6599999999999997}),fill: new ol.style.Fill({color: 'rgba(249,246,161,0.35)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })]
                    };

    return style;
};
