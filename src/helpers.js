module.exports = {
  // Format given datestring to a UNIX timestamp
  formatDateAsUnix: (date) => {
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
      month: date.getUTCMonth()+1,
      date: date.getUTCDate(),
      hours: date.getUTCHours(),
      minutes: date.getUTCMinutes(),
      seconds: date.getUTCSeconds(),
    };
    return dateobj;
  },
};
