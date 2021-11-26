module.exports = {
  // Format given datestring to a UNIX timestamp
  formatDateUnix: (date) => {
    const unixTimeStamp = +new Date(date) / 1000;
    return unixTimeStamp;
  },
  timestampToDatestring: (timestamp) => {
    const datestring = new Date(timestamp);
    return datestring;
  },
  // Format date from UNIX timestamp to a human readable format
  formatDate: (date, locale, options) => {
    locale = locale || 'fi';
    options = options || {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(date * 1000).toLocaleDateString(locale, options);
  },
  // Format date from UNIX timestamp to a human readable format (UTC)
  formatDateUTCObject: (timestamp) => {
    let date = new Date(timestamp);
    let dateobj = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      date: date.getUTCDate(),
      hours: date.getUTCHours(),
      minutes: date.getUTCMinutes(),
      seconds: date.getUTCSeconds(),
    };
    return dateobj;
  },
  // Transform data gotten from the Coingecko API as daily data
  // Parameters require an object and it's property to be transformed (prices/market_caps/total_volumes)
  transformToDaily: (obj, property) => {
    const data = obj[property];
    let newData = [[data[0][0]/1000, data[0][1]]];
    let day = module.exports.formatDateUTCObject(data[0][0]).date; // Set starting point
    for (let i = 1; i < data.length; i++) {
      let dayCounter = module.exports.formatDateUTCObject(data[i][0]).date;
      // Check if the day has changed and push the first marking of the day to an array
      if (dayCounter !== day) {
        day = dayCounter;
        newData.push([data[i][0]/1000, data[i][1]]);
      }
    }
    return newData;
  },
};
