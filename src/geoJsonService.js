/**
 * Récupération du GeoJson
 */
const geoJsonService = async () => {
  return await fetch('http://localhost:8080/features').then(async response => {
    return await response.json();
  });
};
export default geoJsonService;
