import { icons } from "../static/icons.js"

initMapbox();

/* Mapbox renders maps and map tiles with Web Mercator projection 
using the EPSG:3857 projected coordinate system 
(sometimes called EPSG:900913)
You can use Mapbox GL JS adaptive projections to display map tiles on the web using different projections.*/

function initMapbox() {
    const mapStyles = [
        "mapbox://styles/mapbox/streets-v11",
        "mapbox://styles/mapbox/satellite-streets-v11",
        "mapbox://styles/mapbox/satellite-v9",
        "mapbox://styles/mapbox/outdoors-v11",
        "mapbox://styles/mapbox/light-v10",
        "mapbox://styles/mapbox/dark-v10",
        "mapbox://styles/mapbox/navigation-day-v1",
        "mapbox://styles/mapbox/navigation-night-v1"
        ];

  mapboxgl.accessToken =
    "pk.eyJ1Ijoibmljby1hcmVsbGFubyIsImEiOiJjbDU2bTA3cmkxa3JzM2luejI2dnd3bzJsIn0.lKKSghBtWMQdXszpTJN32Q";
  const map = new mapboxgl.Map({
    container: "mapboxContainer", // container ID
    style: mapStyles[0], // style URL
    center: [-75.697, 45.384], // starting position [lng, lat]
    zoom: 15, // starting zoom
    pitch: 50,
    antialias: true,
    projection: "globe", // display the map as a 3D globe
  });
  // Day sky
  map.on("style.load", () => {
    map.setFog({}); // Set the default atmosphere style
  });

  const mapStyle = document.getElementById("map-style"); // Toggle Map style
  map.setStyle(mapStyles[0]);
  let toggleMapStyle = true;
  mapStyle.onclick = function () {
    if (toggleMapStyle) {
        map.setStyle(mapStyles[1]);
      const satelliteIcon = document.getElementById("satellite-icon");
      satelliteIcon.setAttribute("d", icons.mapIcon);
      this.setAttribute("title", "Map view");
    } else {
      const satelliteIcon = document.getElementById("satellite-icon");
      map.setStyle(mapStyles[0]);
      this.setAttribute("title", "Satellite view");
      satelliteIcon.setAttribute("d", icons.satelliteIcon);
    }
    toggleMapStyle = !toggleMapStyle;
  };
}