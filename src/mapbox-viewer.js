initMapbox()

/* Mapbox renders maps and map tiles with Web Mercator projection 
using the EPSG:3857 projected coordinate system 
(sometimes called EPSG:900913)
You can use Mapbox GL JS adaptive projections to display map tiles on the web using different projections.*/

function initMapbox(){
    mapboxgl.accessToken = 'pk.eyJ1Ijoibmljby1hcmVsbGFubyIsImEiOiJjbDU2bTA3cmkxa3JzM2luejI2dnd3bzJsIn0.lKKSghBtWMQdXszpTJN32Q';
    const map = new mapboxgl.Map({
        container: 'mapboxContainer', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [-75.697, 45.384], // starting position [lng, lat] -75.696, 45.371
        zoom: 15, // starting zoom
        pitch: 50,
    antialias: true,
        projection: 'globe' // display the map as a 3D globe
    });
    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });
}