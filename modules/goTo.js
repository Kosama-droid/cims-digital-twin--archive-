export default function goTo(location) {
    if (
      document.getElementById("lng").value !== "" &&
      !document.getElementById("lat").value !== ""
    ) {
      def.coordinates.lng = parseFloat(document.getElementById("new-lng").value);
      def.coordinates.lat = parseFloat(document.getElementById("new-lat").value);
      delete def.objects;
      delete def.gltfMasses;
      def.name = "this place";
    }
    place = carleton;
    setPlace(place, province.term, city.name);
  }