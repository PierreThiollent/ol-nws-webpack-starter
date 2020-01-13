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
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

// coordonnées récupérées depuis https://www.latlong.net/convert-address-to-lat-long.html
var nws = transform([1.06653, 49.42847], 'EPSG:4326', 'EPSG:3857');
var copeauxNumeriques = transform(
  [1.06467, 49.42222],
  'EPSG:4326',
  'EPSG:3857',
);
var ISDFlaubert = transform([1.12029, 49.45093], 'EPSG:4326', 'EPSG:3857');

var image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({color: 'red', width: 10}),
});

var styles = {
  Point: new Style({
    image: image,
  }),
};

const styleFunction = feature => styles[feature.getGeometry().getType()];

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
      geometry: {
        type: 'Point',
        coordinates: nws,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: copeauxNumeriques,
      },
    },
    {
      type: 'Feature',
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
    zoom: 14,
  }),
});
