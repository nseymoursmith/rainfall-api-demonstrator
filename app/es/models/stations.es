import {_} from "lodash";
import {allStations} from "../services/rainfall-api.es";

/** Cached array of rainfall stations */
let stations, stationsPromise;

/** @return A promise of an array of all of the rainfall stations */
export function stationsCollection() {
  if (stations) {
    return Promise.resolve( stations );
  }
  else if (stationsPromise) {
    return stationsPromise;
  }
  else {
    return retrieveStations();
  }
}

/** @return True if there are cached stations */
export function hasCachedStations() {
  return !!stations;
}

/** @return A promise of the names of all of the stations */
export function stationNames() {
  return stationsCollection()
    .then( (stations) => {
      return _.map( stations, station => {return station.label();} );
    } );
}

/** @return A promise of the names of all of the unique river names */
export function riverNames() {
  return stationsCollection()
    .then( (stations) => {
      return compactify( stations, "riverName" );
    } );
}

/** @return A promise of the names of all of the unique catchment names */
export function catchmentNames() {
  return stationsCollection()
    .then( (stations) => {
      return compactify( stations, "catchmentName" );
    } );
}

/**
 * @param searchStr A non-empty search string
 * @return A promise of station names that match a given input string
 */
export function searchStationNames( searchStr ) {
  const pattern = new RegExp( searchStr, "ig" );
  return stationNames().then( names => {
    return _.filter( names, name => {return pattern.test(name);} );
  } );
}

/** @return a promise of stations retrieved via tha API */
function retrieveStations() {
  stationsPromise = allStations()
    .then( (stns) => {
      stations = stns;
      stationsPromise = null;
      return stns;
    } );
  return stationsPromise;
}

/** @return A compacted, uniqified array of the values of `fieldFn` */
function compactify( arr, fieldFn ) {
  return _.uniq(
    _.reject(
      _.map( arr, value => {return value[fieldFn].call( value );} ),
      _.isEmpty
    )
  );
}
