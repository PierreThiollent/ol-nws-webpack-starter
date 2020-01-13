import './source.scss';
import 'ol/ol.css';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import Feature from 'ol/Feature';
import {
  defaults as defaultInteractions,
  DragRotateAndZoom,
} from 'ol/interaction';
import Circle from 'ol/geom/Circle';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import {transform} from 'ol/proj';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';

// Coordonnées Seine Innopolis
var nws = transform([1.06653, 49.42847], 'EPSG:4326', 'EPSG:3857');
// Coordonnées des copeaux numériques
var copeauxNumeriques = transform(
  [1.06467, 49.42222],
  'EPSG:4326',
  'EPSG:3857',
);
// Coordonnées de l'ISD
var ISDFlaubert = transform([1.12029, 49.45093], 'EPSG:4326', 'EPSG:3857');

// On definit la forme du marqueur
var image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({color: 'red', width: 10}),
});

// Style du marqueur
var styles = {
  Point: new Style({
    image: image,
  }),
};

/**
 * Style au survol d'un marqueur
 * @param feature
 */
var highlightStyle = feature =>
  new Style({
    text: new Text({
      text: selected.get('name'),
      offsetY: -25,
      scale: 1.5,
    }),
    image: new CircleStyle({
      radius: 5,
      text: 'toto',
      fill: null,
      stroke: new Stroke({
        color: 'green',
        width: 20,
      }),
    }),
  });

const styleFunction = feature => styles[feature.getGeometry().getType()];

/**
 * GeoJSON Object
 */
var geojsonObject = {
  type: 'FeatureCollection',
  crs: {
    type: 'name',
    properties: {
      name: 'EPSG:3857',
    },
  },
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Normandie Web School',
        description: 'La meilleure école du numérique',
      },
      geometry: {
        type: 'Point',
        coordinates: nws,
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Les copeaux numériques',
        description: 'FabLab',
      },
      geometry: {
        type: 'Point',
        coordinates: copeauxNumeriques,
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'ISD Flaubert',
        description: 'Centre de formation',
      },
      geometry: {
        type: 'Point',
        coordinates: ISDFlaubert,
      },
    },
  ],
};

var vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(geojsonObject),
});

var vectorLayer = new VectorLayer({
  source: vectorSource,
  style: styleFunction,
});

/**
 * Overlay to anchor the popup to the map.
 */
var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

/**
 * Création de la map
 */
var map = new Map({
  interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayer,
  ],
  overlays: [overlay],
  target: 'carteNWS',
  view: new View({
    center: nws,
    zoom: 12,
  }),
});

/**
 * Marqueur survolé
 */
var selected = null;
var status = document.getElementById('status');

// Au survol d'un marqueur
map.on('pointermove', event => {
  if (selected !== null) {
    selected.setStyle(undefined);
    selected = null;
  }

  map.forEachFeatureAtPixel(event.pixel, feature => {
    selected = feature;
    feature.setStyle(highlightStyle(feature));
  });
});

/**
 * Popup
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var clicked = null;

/**
 * Évènement au clic sur un marqueur
 */
map.on('singleclick', event => {
  if (clicked !== null) {
    clicked = null;
  }

  map.forEachFeatureAtPixel(event.pixel, feature => {
    clicked = feature;
    content.innerHTML = clicked.get('description');
    container.style.display = 'block';
    container.style.top = event.pointerEvent.clientY - 80 + 'px';
    container.style.left = event.pointerEvent.clientX - 50 + 'px';
    return true;
  });
});

/**
 * Évènement pour cacher la popup
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function() {
  overlay.setPosition(undefined);
  container.style.display = 'none';
  return false;
};
