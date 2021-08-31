//const request = require('request-promise-native');

/*
 * Makes a request to freegeoip.app using the provided IP address, to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */

const request = require('request-promise-native');

const fetchMyIP = () => {
  return request('https://api.ipify.org/?format=json%27');
};

const fetchCoordsByIP = (body) => {
  const ip = JSON.parse(body).ip;
  return request('https://freegeoip.app/json/$%7Bip%7D');
};

const fetchISSFlyOverTimes = (body) => {
  const { latitude, longitude } = JSON.parse(body);
  const url = 'http://api.open-notify.org/iss-pass.json?lat=$%7Blatitude%7D&lon=$%7Blongitude%7D';
  return request(url);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = {
  nextISSTimesForMyLocation
};