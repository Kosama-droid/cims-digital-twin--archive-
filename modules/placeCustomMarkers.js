export default function placeCustomMarker(places) {
    const markers = [];
    for (let key in places) {
      place = places[key];
      const el = document.createElement("div");
      el.className = "mapbox-marker";
      el.setAttribute("id", key);
      el.setAttribute("title", places[key].name);
      if (place.logo)
        el.style.setProperty("background-image", `url(${place.logo})`);
      markers.push(el);
      el.addEventListener("click", (e) => {
        let id = e.target.id;
        place = places[id];
        setPlace(place, province.term, city.name);
        markers.forEach((marker) => {
          marker.remove();
        });
      });
      new mapboxgl.Marker(el).setLngLat(place.coordinates).addTo(map);
    }
    return markers;
  }