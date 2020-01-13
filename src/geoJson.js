import {transform} from 'ol/proj';

/**
 * GeoJSON Object
 */
export const geojsonObject = {
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
        coordinates: transform([1.06653, 49.42847], 'EPSG:4326', 'EPSG:3857'),
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
        coordinates: transform([1.06467, 49.42222], 'EPSG:4326', 'EPSG:3857'),
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
        coordinates: transform([1.12029, 49.45093], 'EPSG:4326', 'EPSG:3857'),
      },
    },
  ],
};
