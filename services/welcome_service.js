const UTIL = require('../util');
const DATA = require('../data/data');
const { Carousel, Image, Suggestions } = require('actions-on-google');

module.exports = {

  welcome: (conv) => {
    let fname = DATA.user.name.split(' ')[0];
    var welcome_arr = [
      `Hello ${fname}, Welcome to RITZY Hotels & Resorts. How can I assist you?`,
      `Good Day ${fname}, Welcome to RITZY Hotels & Resorts. How can I help you?`,
      `Hi ${fname}, Greetings from RITZY hotels & Resorts. I am here to help you. What assistance do you require?`
    ];

    conv.ask(UTIL.getRandomMessage(welcome_arr));
    conv.ask(new Suggestions(['Search resorts in Florida', 'My max TP', 'Upcoming vacations']));
    return conv;
  }
}