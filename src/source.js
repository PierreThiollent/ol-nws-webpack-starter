import './source.scss';
import 'ol/ol.css';
import Map from 'ol/Map';
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

// Style au survol d'un marqueur
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

// GeoJSON Object
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

var map = new Map({
  interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayer,
  ],
  target: 'carteNWS',
  view: new View({
    center: nws,
    zoom: 12,
  }),
});

// Marqueur survolé
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
    return true;
  });
});
