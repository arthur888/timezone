import BoundingBox from '../data/bounding_boxes.json';
import HoverRegion from '../data/hover_regions.json';

function hitTestAndConvert(polygons, lat, lng) {
    var allPolygons = [];
    var inZone = false;
    var selectedPolygon;
    var polygonss = [];
    for(let i in polygons) {
    	polygonss.push(polygons[i]);
    }
    polygonss.forEach(function(polygon, i) {
      // Ray casting counter for hit testing.
      var rayTest = 0;
      var lastPoint = polygon.points.slice(-2);

      var coords = [];
      var j = 0;
      for (j = 0; j < polygon.points.length; j += 2) {
        var point = polygon.points.slice(j, j + 2);

        coords.push([point[0], point[1]]);

        // Ray casting test
        if ((lastPoint[0] <= lat && point[0] >= lat) ||
          (lastPoint[0] > lat && point[0] < lat)) {
          var slope = (point[1] - lastPoint[1]) / (point[0] - lastPoint[0]);
          var testPoint = slope * (lat - lastPoint[0]) + lastPoint[1];
          if (testPoint < lng) {
            rayTest++;
          }
        }

        lastPoint = point;
      }

      allPolygons.push({
        polygon: polygon,
        coords: coords
      });

      // If the count is odd, we are in the polygon
      var odd = (rayTest % 2 === 1);
      inZone = inZone || odd;
      if (odd) {
        selectedPolygon = polygon;
      }
    });

    return {
      allPolygons: allPolygons,
      inZone: inZone,
      selectedPolygon: selectedPolygon
    };
  };

export function getPolygon(lat, lng) {
	var poly = [];
	BoundingBox.forEach( (v, i) => {
		var bb = v.boundingBox;
	      if (lat > bb.ymin && lat < bb.ymax &&
	      lng > bb.xmin &&
	      lng < bb.xmax) {

	        var hoverRegion = HoverRegion.filter( (_r) => {
	        	if(_r.name === v.name) {
	        		return true;
	        	} else {
	        		return false;
	        	}
	        } );
	        if (!hoverRegion[0]) {
	          return;
	        }
          hoverRegion = hoverRegion[0];
	        var result = hitTestAndConvert(hoverRegion.hoverRegion, lat, lng);
          if (result.inZone) {
            poly.push({
	          	poly:result.allPolygons,
	          	tz: v.name,
	          	bb: v,
              name: hoverRegion.name
	          });

	        }
	      }
	} );
	return poly;
}

var exp = {
	BoundingBox: BoundingBox,
	HoverRegion: HoverRegion,
};

export default exp;