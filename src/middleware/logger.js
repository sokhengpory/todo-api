const morgan = require('morgan');

morgan.token('date', () => {
  const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'Asia/Bangkok',
  });
  return dateTimeFormat.format(new Date());
});

const loggerFormat = '[:method - :url] [:date] [:status - :response-time ms]';

module.exports = () => morgan(loggerFormat);
