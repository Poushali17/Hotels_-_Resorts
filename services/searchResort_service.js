const UTIL = require('../util');
const CONFIG = require('../config');
const DATA = require('../data/data');
const { Carousel, BrowseCarousel, Image, Suggestions } = require('actions-on-google');

module.exports = {

  searchResort: (checkin_date, checkout_date, location, conv) => {
    var resorts = DATA.resort_details;
    let checkin = checkin_date.split('T')[0];
    let checkout = checkout_date.split('T')[0];
    let response_arr = [
      `These are the resorts available between ${checkin} and ${checkout}:`,
      `You can choose among the following hotels for your date starting from ${checkin} to ${checkout}:`
    ];

    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
      conv.ask('Sorry, try this on a screen device or select the phone surface in the simulator.');
      return conv;
    }

    //Search resorts in location - CONFIG.pagination_count
    let temp = [];
    for (let i = 0; i < resorts.length; i++) {
      let resort = resorts[i];
      if (resort.location.toLowerCase() == location.toLowerCase()) {
        temp.push(resorts[i]);
      }
    }
    resorts = temp;

    let resort_list = [];
    let startIndex = 0;
    if (!UTIL.isEmpty(conv.user.storage.startResortIndex)) {
      startIndex = conv.user.storage.startResortIndex;
    }
    for (let i = startIndex; i < startIndex + CONFIG.pagination_count && i < resorts.length; i++) {
      let resort = resorts[i];

      let item = UTIL.buildBrowserCarouselItem(`#${resort.resort_code}`,
        resort.resort_name,
        resort.image,
        'https://www.rci.com/resort-directory/resortDetails?resortCode=2512',
        resort.location);
      resort_list.push(item);
      conv.user.storage.startResortIndex++;
    }
    console.log(resort_list);

    if (!UTIL.isEmpty(resort_list)) {
      if (startIndex === 0) {
        conv.ask(UTIL.getRandomMessage(response_arr));
      }
      else {
        conv.ask(`Here are ${resort_list.length} more resorts for you.`);
      }
      conv.ask(new BrowseCarousel({
        items: resort_list
      }));
      conv.ask(new Suggestions(['Show more', 'Search resorts in Hawaii']));
    }
    else {
      conv.ask('Sorry, no more resorts available.');
      conv.ask(new Suggestions(['Search resorts in Hawaii', 'Upcoming vacations']));
    }
  }
}