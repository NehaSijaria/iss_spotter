
//  Makes a single API request to retrieve the user's IP address.
//  Input:
//     - A callback (to pass back an error or the IP string)
//   Returns (via Callback):
//     - An error, if any (nullable)
//     - The IP address as a string (null if error). Example: "162.245.144.188"
 

let url = "https://api.ipify.org/?format=json";

const fetchMyIP = function(callback) {
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) return callback(error, null);
//
//     }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body};
        callback(Error(msg), null)`;
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);

  });
};
// ....to be continued from the above code copy paste all this
const fetchCoordsByIP = function(ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const {latitude, longitude} = JSON.parse(body);
    callback(null, {latitude, longitude});
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching pass times for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body).response;
    callback(null, data);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }

  fetchCoordsByIP(ip, (error, location) => {
        if (error) {
          return callback(error, null);
        }

  fetchISSFlyOverTimes(location, (error, nextPasses) => {
          if (error) {
          return callback(error, null);
          }

          callback(null, nextPasses);
        });
      });
    });
  };

module.exports = {
  nextISSTimesForMyLocation
};
