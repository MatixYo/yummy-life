/**
 *
 * Map
 *
 **/

const mapboxApi = 'https://api.mapbox.com/{service}/{version}/{mode}/{query}.json',
osmApi = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
opencagedataApi = 'https://api.opencagedata.com/geocode/v1/json',
token = 'pk.eyJ1IjoibWF0aXh5byIsImEiOiJjajI4eXExOXAwMDUzMnFteDFjZTNmOWVhIn0.VQXEabFlk1xCgEujx-RGVg',
geocoderToken = '80a8662c52594a8790f5519d64cdcc30';

class Map {
	static getMapbox(parameters, search = {}) {
		const url = new URL(mapboxApi.replace(/{([^}]+)}/g, (match, p1) => parameters[p1])),
		searchParams = url.searchParams;
		search['access_token'] = token;
		for(const key in search)
			searchParams.append(key, search[key]);
		return fetch(url).then(response => response.json());
	}

	static geoCode(query) {
		return Map.getMapbox({service: 'geocoding', version: 'v5', mode: 'mapbox.places', query: query}, {country: 'pl', types: 'address'});
	}

	static getPath(coordinates) {
		return Map.getMapbox({service: 'directions', version: 'v5', mode: 'mapbox/driving-traffic', query: coordinates.map(coords => coords.join(',')).join(';')}, {overview: 'full', geometries: 'geojson'});
	}

	static geoCodeReverse(coordniates) {
		return fetch(opencagedataApi + '?q=' + coordniates[0] + '+' + coordniates[1] + '&key=' + geocoderToken).then(response => response.json());
	}

	static geoCodeForward(query) {
		return fetch(opencagedataApi + '?q=' + encodeURI(query) + '&key=' + geocoderToken).then(response => response.json());
	}
}
