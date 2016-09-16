import {allStations} from "../services/rainfall-api.es";

/** Cached array of rainfall stations */
let stations;

/** @return A promise of an array of all of the rainfall stations */
export function stationsCollection() {
  if (!stations) {
    return retrieveStations();
  }
  else {
    return Promise.resolve( stations );
  }
}

/** @return True if there are cached stations */
export function hasCachedStations() {
  return !!stations;
}

/** Return a promise of stations retrieved via tha API */
function retrieveStations() {
  return allStations()
    .then( (stns) => {
      stations = stns;
      return stns;
    } );
}