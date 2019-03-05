const UTIL = require('../util');
const DATA = require('../data/data');
const { Carousel, Image, Suggestions } = require('actions-on-google');

module.exports = {

  fallback: (conv) => {
    var fallback_arr = [
      `I didn't understand`,
      `I'm sorry, can you try again?`
    ];

    conv.ask(UTIL.getRandomMessage(fallback_arr));
    conv.ask(new Suggestions(['Search resorts in Florida', 'My max TP', 'Upcoming vacations']));
    return conv;
  }
}