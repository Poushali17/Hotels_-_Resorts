const UTIL = require('../util');
const CONFIG = require('../config');
const DATA = require('../data/data');
const { Card } = require('dialogflow-fulfillment');
const { BasicCard, Image, Suggestions } = require('actions-on-google');

module.exports = {

    showUpcomingVacation: (conv) => {
        var vacations = UTIL.sortByDateAsc(DATA.confirmed_vacations, 'checkin_date');    //Sort Vacation by date 

        let startIndex = 0;
        if (!UTIL.isEmpty(conv.user.storage.startResortIndex)) {
            startIndex = conv.user.storage.startResortIndex;
        }
        let vacation = vacations[startIndex];

        if (startIndex == 0) {
            let response_arr = [
                `There are ${vacations.length} confirmed vacations for you. Earliest one is at ${vacation.resort_name}.`
            ];
            conv.ask(UTIL.getRandomMessage(response_arr));
        }

        if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
            conv.ask('Sorry, try this on a screen device or select the phone surface in the simulator.');
            return conv;
        }


        if (startIndex < vacations.length) {
            if (startIndex > 0) {
                conv.ask("Here's the details of the next vacation.");
            }

            //UTIL.buildCardItem(title, subtitle, desc, button_title, button_url, image)
            let date_arr = vacation.checkin_date.toString().split(' ');
            let checkinDate = `${date_arr[0]} ${date_arr[2]} ${date_arr[1]} ${date_arr[3]}`;
            conv.ask(UTIL.buildCardItem(
                `#${vacation.resort_code}`,
                `${vacation.resort_name}, ${vacation.location}`,
                `Check-in Date: ${checkinDate}`,
                'Visit Resort',
                'https://www.rci.com/resort-directory/resortDetails?resortCode=2512',
                vacation.image
            ));
            conv.ask(new Suggestions(['Next One']));
            conv.user.storage.startResortIndex++;
        }
        else {
            conv.ask('Sorry, no more Vacations available.');
            conv.ask(new Suggestions(['Search resorts in Florida', 'My max TP', 'Upcoming vacations']));
        }


    }

}