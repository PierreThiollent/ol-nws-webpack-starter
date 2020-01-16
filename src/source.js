import './source.scss';
import 'ol/ol.css';
import Map from 'ol/Map';
import 'bootstrap/dist/css/bootstrap.min.css';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import Feature from 'ol/Feature';
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction';
import {transform} from 'ol/proj';
import Circle from 'ol/geom/Circle';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import {geojsonObject} from './geoJsonService';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';

// const geoJsonObj = getGeoJson();

// Coordonnées NWS
var nws = transform([1.06653, 49.42847], 'EPSG:4326', 'EPSG:3857');

/**
 * Popup
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

/**
 * Style des marqueur
 */
var styles = {
  Point: new Style({
    image: new CircleStyle({
      radius: 5,
      fill: null,
      stroke: new Stroke({color: 'red', width: 10}),
    }),
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
      fill: null,
      stroke: new Stroke({
        color: 'green',
        width: 20,
      }),
    }),
  });

// Forme du marqueur
const styleFunction = feature => styles[feature.getGeometry().getType()];

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
    return true;
  });

  if (clicked) {
    content.innerHTML = clicked.get('name') + '<br>' + clicked.get('description') + '<br> 📍' + clicked.get('adresse');
    overlay.setPosition(event.coordinate);
  }
});

/**
 * Évènement pour cacher la popup
 * @return {boolean} Don't follow the href.
 */
if (window.location.href.indexOf() !== '/addMarker.html') {
  closer.onclick = () => {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };
}

/**
 * Insertion d'un marqueur en base de données
 */
if (window.location.href.indexOf() === '/addMarker.html') {
  let formMarker = document.getElementById('add-marker');
  formMarker.addEventListener('submit', e => {
    e.preventDefault();
    let form = new FormData(formMarker);
    fetch('http://localhost:8080/features', {
      method: 'POST',
      body: form,
    })
      .then(response => {
        alert('Marqueur ajouté ! 👍🏻💪🏻');
        console.log(response);
      })
      .catch(error => {
        console.log(error);
        alert("Une erreur s'est produite.");
      });
  });
}

/**
 * Récupération des coordonnées par rapport à l'adresse
 */
if (window.location.href.indexOf() === '/addMarker.html') {
  document.querySelector('.get-coordinates button').addEventListener('click', () => {
    let adresse = document.getElementById('adresse').value;
    if (adresse) {
      let xmlhttp = new XMLHttpRequest(),
        url = 'https://nominatim.openstreetmap.org/search?format=json&limit=3&q=' + adresse;
      xmlhttp.open('GET', url, true);
      xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          if (xmlhttp.responseText !== '[]') {
            let coordinates = JSON.parse(xmlhttp.responseText)[0];
            document.getElementById('latitude').value = coordinates['lat'];
            document.getElementById('longitude').value = coordinates['lon'];
            document.getElementById('adresse-manquante').style.display = 'none';
          } else {
            alert("Nous n'avons pas pu récupérer la longitude et la latitude, veuillez réessayer.");
          }
        }
      };
      xmlhttp.send();
    } else {
      document.getElementById('adresse-manquante').style.display = 'block';
    }
  });
}
