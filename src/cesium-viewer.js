// CESIUM
import { canada } from "../static/data/canada.js"
import { icons } from "../static/icons.js"
const cesiumContainer = document.getElementById("cesiumContainer");
initCesium();

function initCesium() {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNGRmZjIxZC0wMTJkLTQzZmEtOGVhYy05MjYzNWM3ZTRmMjAiLCJpZCI6NTczNTEsImlhdCI6MTYyMjIxMTIwOX0.DiHzzec1-KXRcfMmpppc_4yGSVYSSiEchZa2cGw6dIU";
  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: Cesium.createWorldTerrain(),
    // useDefaultRenderLoop: false,
    selectionIndicator: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    // infoBox: false,
    animation: false,
    timeline: false,
    allowTextureFilterAnisotropic: false,
    targetFrameRate: 60,
    resolutionScale: 0.1,
    orderIndependentTranslucency: true,
    baseLayerPicker: true,
    geocoder: false,
    automaticallyTrackDataSourceClocks: false,
    fullscreenButton: false,
    dataSources: null,
    clock: null,
    terrainShadows: Cesium.ShadowMode.DISABLED,
  });

  // Fly the camera to the Canada.
  flyTo(viewer, -98.74, 56.415, 5000000, -90.0, 0);
  // GET LOCATION CANDA🔍
  //    GET PROVINCE 🗺️
    const pNames = [];
    const provinces = canada.provinces;
    const territories = canada.territories;
    territories.forEach((territory) => {
      provinces.push(territory);
    });
    const provinceMenu = document.getElementById("p-menu");
    provinces.forEach((province) => {
      let option = document.createElement("option");
      option.innerHTML = province.provinceName;
      pNames.push(province.provinceName);
      provinceMenu.appendChild(option);
    });
    document.getElementById("p-menu").addEventListener("change", function () {
      viewer.dataSources.removeAll();
      const pIndex = pNames.indexOf(this.value);
      const pCode = provinces[pIndex].code;

      // GET PROVINCE GEOJSON 🌐
      getJson(
        "https://geogratis.gc.ca/services/geoname/en/geonames.geojson?concise=PROV&province=" +
          pCode
      ).then((pGeojson) => {
        loadGeojson(pGeojson, viewer);
        cMenu.style.display = "inline-block";
      });
      // GET CITY 🏙️
      const cNames = [];
      getJson(
        "https://geogratis.gc.ca/services/geoname/en/geonames.json?province=" +
          pCode +
          "&concise=CITY"
      ).then((jsonCity) => {
        const cities = jsonCity.items;
        cities.sort((a, b) => a.name.localeCompare(b.name));
        let cityMenu = document.getElementById("c-menu");
        while (cityMenu.childElementCount > 1) {
          cityMenu.removeChild(cityMenu.lastChild);
        } //Clear cities
        cities.forEach((city) => {
          cNames.push(city.name);
          let option = document.createElement("option");
          option.innerHTML = city.name;
          cityMenu.appendChild(option);
        });
        cityMenu = document.getElementById("c-menu");
        let city = "";
        cityMenu.addEventListener("change", function () {
          viewer.dataSources.removeAll();
          const cIndex = cNames.indexOf(this.value);
          city = cities[cIndex];
          const { latitude, longitude } = city;
  
          // GET CITY GEOJSON 🌐
          getJson(
            "https://geogratis.gc.ca/services/geoname/en/geonames.geojson?q=" +
              city.name +
              "&concise=CITY&province=" +
              pCode
          ).then((cGeojson) => {
            sMenu.style.display = "inline-block";
            loadGeojson(cGeojson, viewer);
          });
        });
      });
    });

    // Toggle Menu
    const locationBar = document.getElementById("location");
    const locationButton = document.getElementById("close-nav-bar");
    let toggleLocationBar = false;
    locationButton.onclick = function () {
      locationBar.style.display = toggleLocationBar ? "inline-block" : "none";
      locationButton.style.transform = toggleLocationBar ? "": "rotate(180deg)";
      const navBar = document.getElementById("nav-bar")
      navBar.style.backgroundColor = toggleLocationBar ? "": "#FFFFFF00";
      navBar.style.boxShadow = toggleLocationBar ? "": "none";
      toggleLocationBar = !toggleLocationBar;
    };

    // Map Style
    let baseLayerPickerViewModel = viewer.baseLayerPicker.viewModel;
    baseLayerPickerViewModel.selectedImagery =
      baseLayerPickerViewModel.imageryProviderViewModels[0];
    // Toggle Map view
    const mapView = document.getElementById("map-view");
    let style = 1;
    let toggleMapView = true;
    mapView.onclick = function () {
      if (toggleMapView) {
        style = 2;
        const mapIcon = document.getElementById("map-icon");
        mapIcon.setAttribute("d", icons.satelliteIcon);
        this.setAttribute("title", "Satellite view");
      } else {
        const mapIcon = document.getElementById("map-icon");
        style = 0;
        this.setAttribute("title", "Map view");
        mapIcon.setAttribute("d", icons.mapIcon);
      }
      baseLayerPickerViewModel.selectedImagery =
        baseLayerPickerViewModel.imageryProviderViewModels[style];
      toggleMapView = !toggleMapView;
    };

    // DOM OBJECTS
    const goTo = document.getElementById("go-to");

    // BUILDING LEVEL 🏢
    const worldIconD = "M13.144 8.171c-.035-.066.342-.102.409-.102.074.009-.196.452-.409.102zm-2.152-3.072l.108-.031c.064.055-.072.095-.051.136.086.155.021.248.008.332-.014.085-.104.048-.149.093-.053.066.258.075.262.085.011.033-.375.089-.304.171.096.136.824-.195.708-.176.225-.113.029-.125-.097-.19-.043-.215-.079-.547-.213-.68l.088-.102c-.206-.299-.36.362-.36.362zm13.008 6.901c0 6.627-5.373 12-12 12-6.628 0-12-5.373-12-12s5.372-12 12-12c6.627 0 12 5.373 12 12zm-8.31-5.371c-.006-.146-.19-.284-.382-.031-.135.174-.111.439-.184.557-.104.175.567.339.567.174.025-.277.732-.063.87-.025.248.069.643-.226.211-.381-.355-.13-.542-.269-.574-.523 0 0 .188-.176.106-.166-.218.027-.614.786-.614.395zm6.296 5.371c0-1.035-.177-2.08-.357-2.632-.058-.174-.189-.312-.359-.378-.256-.1-1.337.597-1.5.254-.107-.229-.324.146-.572.008-.12-.066-.454-.515-.605-.46-.309.111.474.964.688 1.076.201-.152.852-.465.992-.038.268.804-.737 1.685-1.251 2.149-.768.694-.624-.449-1.147-.852-.275-.211-.272-.66-.55-.815-.124-.07-.693-.725-.688-.813l-.017.166c-.094.071-.294-.268-.315-.321 0 .295.48.765.639 1.001.271.405.416.995.748 1.326.178.178.858.914 1.035.898.193-.017.803-.458.911-.433.644.152-1.516 3.205-1.721 3.583-.169.317.138 1.101.113 1.476-.029.433-.37.573-.693.809-.346.253-.265.745-.556.925-.517.318-.889 1.353-1.623 1.348-.216-.001-1.14.36-1.261.007-.094-.256-.22-.45-.353-.703-.13-.248-.015-.505-.173-.724-.109-.152-.475-.497-.508-.677-.002-.155.117-.626.28-.708.229-.117.044-.458.016-.656-.048-.354-.267-.646-.53-.851-.389-.299-.188-.537-.097-.964 0-.204-.124-.472-.398-.392-.564.164-.393-.44-.804-.413-.296.021-.538.209-.813.292-.346.104-.7-.082-1.042-.125-1.407-.178-1.866-1.786-1.499-2.946.037-.19-.114-.542-.048-.689.158-.352.48-.747.762-1.014.158-.15.361-.112.547-.229.287-.181.291-.553.572-.781.4-.325.946-.318 1.468-.388.278-.037 1.336-.266 1.503-.06 0 .038.191.604-.019.572.433.023 1.05.749 1.461.579.211-.088.134-.736.567-.423.262.188 1.436.272 1.68.069.15-.124.234-.93.052-1.021.116.115-.611.124-.679.098-.12-.044-.232.114-.425.025.116.055-.646-.354-.218-.667-.179.131-.346-.037-.539.107-.133.108.062.18-.128.274-.302.153-.53-.525-.644-.602-.116-.076-1.014-.706-.77-.295l.789.785c-.039.025-.207-.286-.207-.059.053-.135.02.579-.104.347-.055-.089.09-.139.006-.268 0-.085-.228-.168-.272-.226-.125-.155-.457-.497-.637-.579-.05-.023-.764.087-.824.11-.07.098-.13.201-.179.311-.148.055-.287.126-.419.214l-.157.353c-.068.061-.765.291-.769.3.029-.075-.487-.171-.453-.321.038-.165.213-.68.168-.868-.048-.197 1.074.284 1.146-.235.029-.225.046-.487-.313-.525.068.008.695-.246.799-.36.146-.168.481-.442.724-.442.284 0 .223-.413.354-.615.131.053-.07.376.087.507-.01-.103.445.057.489.033.104-.054.684-.022.594-.294-.1-.277.051-.195.181-.253-.022.009.34-.619.402-.413-.043-.212-.421.074-.553.063-.305-.024-.176-.52-.061-.665.089-.115-.243-.256-.247-.036-.006.329-.312.627-.241 1.064.108.659-.735-.159-.809-.114-.28.17-.509-.214-.364-.444.148-.235.505-.224.652-.476.104-.178.225-.385.385-.52.535-.449.683-.09 1.216-.041.521.048.176.124.104.324-.069.19.286.258.409.099.07-.092.229-.323.298-.494.089-.222.901-.197.334-.536-.374-.223-2.004-.672-3.096-.672-.236 0-.401.263-.581.412-.356.295-1.268.874-1.775.698-.519-.179-1.63.66-1.808.666-.065.004.004-.634.358-.681-.153.023 1.247-.707 1.209-.859-.046-.18-2.799.822-2.676 1.023.059.092.299.092-.016.294-.18.109-.372.801-.541.801-.505.221-.537-.435-1.099.409l-.894.36c-1.328 1.411-2.247 3.198-2.58 5.183-.013.079.334.226.379.28.112.134.112.712.167.901.138.478.479.744.74 1.179.154.259.41.914.329 1.186.108-.178 1.07.815 1.246 1.022.414.487.733 1.077.061 1.559-.217.156.33 1.129.048 1.368l-.361.093c-.356.219-.195.756.021.982 1.818 1.901 4.38 3.087 7.22 3.087 5.517 0 9.989-4.472 9.989-9.989zm-11.507-6.357c.125-.055.293-.053.311-.22.015-.148.044-.046.08-.1.035-.053-.067-.138-.11-.146-.064-.014-.108.069-.149.104l-.072.019-.068.087.008.048-.087.106c-.085.084.002.139.087.102z"
    const goToIconD = "M24.012 20h-20v-2h20v2zm-2.347-5.217c-.819 1.083-2.444 1.284-3.803 1.2-1.142-.072-10.761-1.822-11.186-1.939-1.917-.533-3.314-1.351-4.276-2.248-.994-.927-1.557-1.902-1.676-2.798l-.724-4.998 3.952.782 2.048 2.763 1.886.386-1.344-4.931 4.667 1.095 4.44 5.393 2.162.51c1.189.272 2.216.653 3.181 1.571.957.911 1.49 2.136.673 3.214zm-3.498-2.622c-.436-.15-3.221-.781-3.717-.892l-4.45-5.409-.682-.164 1.481 4.856-5.756-1.193-2.054-2.773-.772-.19.486 2.299c.403 1.712 2.995 3.155 4.575 3.439 1.06.192 8.89 1.612 9.959 1.773.735.105 2.277.214 2.805-.302l.003-.002c-.268-.652-1.214-1.213-1.878-1.442z"
    let toggleGoTo = true;
    goTo.onclick = function () {
      if (toggleGoTo) {
        viewer.dataSources.removeAll();
        this.setAttribute("title", "Go to Canada");
        document.getElementById("go-to-icon").setAttribute("d", worldIconD);
        // Fly To Downsview flyTo(viewer, -79.47, 43.73, 1000, -45.0, 0);
        // Fly to Carleton
        flyTo(viewer, -75.696, 45.371, 1500, -45.0, 0);
        pMenu.style.display = "none";
        cMenu.style.display = "none";
        sMenu.style.display = "none";
        bMenu.style.display = "inline-block";

        // Load OSM 🏢
        let bldgs =
          "${elementId} === 	43804390 ||" +
          "${elementId} === 	192359488 ||" +
          "${elementId} === 	43804824 ||" +
          "${elementId} === 	43804597 ||" +
          "${elementId} === 	43804599";
        let range = document.getElementById("myRange");
        getJson(
          "https://raw.githubusercontent.com/nicoarellano/RTEM/main/assets/data/daily_co2_temp_hospitality_426_new_york.json"
        ).then((data) => {
          range.addEventListener("input", function () {
            // COLOURS 🎨
            let hexColor = perc2color(this.value / 10.97);
            let timestamp = data[this.value].timestamp;
            let date = new Date(timestamp);
            let day = date.getDay().toString();
            let month = date.getMonth().toString();
            let year = date.getFullYear().toString();
            date = date.toString();
            document.getElementById("timestamp").innerHTML = "📅 " + date;
            // CO2 INSIDE 📩
            let co2_inside = Math.round(data[this.value].co2_inside);
            let co2_inside_hex = perc2color((co2_inside + 286) / 17.56);
            let co2_inside_html = document.getElementById("co2_inside");
            co2_inside_html.innerHTML = co2_inside;
            co2_inside_html.style.color = "black";
            co2_inside_html.style.background = co2_inside_hex;
            buildingTileset.style = new Cesium.Cesium3DTileStyle({
              color: {
                conditions: [[bldgs, "color('" + co2_inside_hex + "')"]],
              },
              show: {
                conditions: [["${elementId} === 949254697", false]],
              },
            });
          });
        });
      } else {
        this.setAttribute("title", "Go to site");
        document.getElementById("go-to-icon").setAttribute("d", worldIconD);
        // Fly to Canada
        flyTo(viewer, -98.74, 56.415, 5000000, -90.0, 0);
        pMenu.style.display = "inline-block";
        cMenu.style.display = "none";
        sMenu.style.display = "none";
        bMenu.style.display = "none";

      }
      toggleGoTo = !toggleGoTo;
    };

    // Add Cesium OSM Buildings, a global 3D buildings layer.
    const buildingTileset = viewer.scene.primitives.add(
      Cesium.createOsmBuildings()
    );
;
}
// Select Provinces and Territories
let pMenu = document.getElementById("p-menu");
// Select Cities
let cMenu = document.getElementById("c-menu");
// Select Site
let sMenu = document.getElementById("s-menu");
// Select Building
let bMenu = document.getElementById("b-menu");

// FUNCTIONS _____________________________________________________________________________________________________

async function getJson(path) {
  let response = await fetch(path);
  let json = await response.json();
  return json;
}

async function loadGraph1(geojson, viewer, param, min, max) {
  let colors = [];
  const promise = Cesium.GeoJsonDataSource.load(geojson);
  promise.then(function (dataSource) {
    viewer.dataSources.add(dataSource);
    const entities = dataSource.entities.values;
    entities.forEach((entity) => {
      let geoParam = geojson.properties[param];
      isNaN(geoParam) ? (geoParam = 0) : geoParam;
      let perc = ((geoParam - min) * 100) / (max - min);
      let color = perc2color(perc);
      colors.push(color);
      if (geoParam === 0) {
        entity.polygon.extrudedHeight = 1700;
        entity.polygon.material = Cesium.Color.DARKGRAY;
        entity.polygon.outlineColor = Cesium.Color.DARKGRAY;
      } else {
        entity.polygon.extrudedHeight = (perc + 5) * 1000;
        entity.polygon.material = Cesium.Color.fromCssColorString(color);
        entity.polygon.outlineColor = Cesium.Color.fromCssColorString(color);
      }
    });
  });
  return colors;
}

async function loadGeojson(geojson, viewer, h) {
  const fillPromise = Cesium.GeoJsonDataSource.load(geojson, {
    fill: Cesium.Color.fromBytes(251, 184, 41, 50),
    clampToGround: true,
  });
  fillPromise.then(function (dataSource) {
    viewer.dataSources.add(dataSource);
    const entities = dataSource.entities.values;
    viewer.flyTo(entities);
  });
}

function flyTo(viewer, lng, lat, h, pitch = 0, roll = 0) {
  const destination = Cesium.Cartesian3.fromDegrees(lng, lat, h);
  viewer.camera.flyTo({
    destination: destination,
    duration: 0.5,
    orientation: {
      pitch: Cesium.Math.toRadians(pitch),
      roll: Cesium.Math.toRadians(roll),
    },
  });
}

function perc2color(perc) {
  let r,
    g,
    b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * perc);
  }
  let h = r * 0x10000 + g * 0x100 + b * 0x1;
  return "#" + ("000000" + h.toString(16)).slice(-6);
}

async function chartIt(x, y, label) {
  const ctx = document.getElementById("myChart").getContext("2d");

  const max = Math.max(...y);
  const min = Math.min(...y);
  let color = [];
  y.forEach((i) => {
    let p = ((i - min) * 100) / (max - min);
    let c = perc2color(p);
    color.push(c);
  });
  color.length === 1 ? (color = "darkgray") : color;

  let chartStatus = Chart.getChart("myChart");
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }

  const myChart = await new Chart(ctx, {
    type: "bar",
    data: {
      labels: x,
      datasets: [
        {
          label: label,
          data: y,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          ticks: {
            // Include degrees sign
            callback: function (value) {
              return value;
              // + '°'
            },
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            boxWidth: 0,
          },
        },
      },
    },
  });
  return myChart;
}
