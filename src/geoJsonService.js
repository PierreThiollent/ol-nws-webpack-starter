import {transform} from 'ol/proj';

const SOURCE = 'EPSG:4326';
const DESTINATION = 'EPSG:3857';

/**
 * GeoJSON Object
 */
export const geojsonObject = {
  type: 'FeatureCollection',
  crs: {
    type: 'name',
    properties: {
      name: DESTINATION,
    },
  },
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Normandie Web School',
        description: 'La meilleure école du numérique',
        adresse: '72 Rue de la République, 76140 Le Petit-Quevilly',
      },
      geometry: {
        type: 'Point',
        coordinates: transform([1.06653, 49.42847], SOURCE, DESTINATION),
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Digit',
        description: 'Agence de développement',
        adresse: '72 Rue de la République, 76140 Le Petit-Quevilly',
      },
      geometry: {
        type: 'Point',
        coordinates: transform([1.065818, 49.429407], SOURCE, DESTINATION),
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Siqual',
        description: 'Agence de développement sur mesure',
        adresse: '64 Boulevard Stanislas Girardin, 76140 Le Petit-Quevilly',
      },
      geometry: {
        type: 'Point',
        coordinates: transform([1.061695, 49.415935], SOURCE, DESTINATION),
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Le Plus du Web',
        description: 'Agence de développement web',
        adresse: '220 Allée Robert Lemasson, 76230 Bois-Guillaume',
      },
      geometry: {
        type: 'Point',
        coordinates: transform([1.111293, 49.474323], SOURCE, DESTINATION),
      },
    },
  ],
};
