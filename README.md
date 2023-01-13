# CIMS - Digital Twin

https://cimsprojects.ca/CDT

https://nicoarellano.github.io/cims-digital-twin/

#Prototype version (using localhost at port 3000)

Running the application:

- open node.js and go to the directory where the folders and files are, using: cd
- then 'node PrototypeServer.js' which will start the Server
- Once the server is started go to your browser and run this url: http://localhost:3000/

testing new fork

Functions (wip):

(not unique too) Bim-viewer-wiv.js

- LoadIfc (ifcURL);
- loadGlbByCategory(category);
- getFirstItemOfType(type);
- getAllItemsOfType(type);
- constructSpacialTree();
- constructsSpacialTreeNode();
- getPropertySets(props);
- createPropsMenu(props);
- createPropertyEntry(key, value);
- createTreeMenu(ifcProject);
- constructTreeMenuNode(parent, node);
- createNestedChild(parent, node);
- createSimpleChild(parent, node);
- createTitle(parent, content);
- nodeToString(node);
- removeAllChildren(element);
- toggleShadow(active);
- togglePostproduction(active);
- infoMessage (message, seconds = 6);
- osmVisibility (map, toggle);
- unhideElementsById (…ids);
- hideSelectors ();
- selectObj (selector);
- loadMasses (masses, place, visible = true, x = 0, y = 0, z = 0);
- placeMarker(places);
- toggleCustomLayer (button, toggle, layerKey);
- closeBimViewer ();

(not unique too) MapViewer.js

- Mapbox ();
  - Calls to the library to create a map.
- flyToCanada ();
- flyTo ();
- goTo(location);
- removeMarker(placeMarkers);
- removeChildren (parent, childrenToKeep = 0);
- removeFromScene ();
- createOptions (selector, objects, keepSelectors =2);
  - Populates the dropdowns
- createLayerButtons(city);
- addNewPlace();
- addCustomLayer (layer, radius = 7);
- addTerrain(…);
- getCities (provinceCode);
- getGeojson (id, url, map, locGeojason);
- setModelOrigin (place);
- setPlace (place, provinceTerm, cityName);
- setTerrain (…);
- setIntersections ();
- infoMessage (message, seconds = 6);
- osmVisibility (map, toggle);
- unhideElementsById (…ids);
- hideSelectors ();
- selectObj (selector);
- loadMasses (masses, place, visible = true, x = 0, y = 0, z = 0);
- placeMarker(places);
- toggleCustomLayer (button, toggle, layerKey);
- closeBimViewer ();
