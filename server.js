(function () {
    'use strict';

    const express = require('express');
    const bodyParser = require('body-parser');
    const http = require('http');
    const logger = require('./log');
    const util = require('./util');
    const welcome_service = require('./services/welcome_service');
    const searchResort_service = require('./services/searchResort_service');
    const deposit_service = require('./services/deposit_service');
    const confirmedVacation_service = require('./services/confirmedVacation_service');
    const goodbye_service = require('./services/goodbye_service');
    const fallback_service = require('./services/fallback_service');
    const { WebhookClient } = require('dialogflow-fulfillment');
    const { Card, Suggestion } = require('dialogflow-fulfillment');
    const { Carousel, Image } = require('actions-on-google');
    
    const port = process.env.PORT || 3000;
    process.env.DEBUG = 'dialogflow:debug';

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // URLs for images used in card rich responses
    const imageUrl = 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png';
    const imageUrl2 = 'https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw';
    const linkUrl = 'https://assistant.google.com/';


    app.post('/', (request, response) => {
        logger.trace(`Post hit!`);
        const agent = new WebhookClient({ request: request, response: response });
        logger.trace('Dialogflow Request headers: ' + JSON.stringify(request.headers));
        logger.trace('Dialogflow Request body: ' + JSON.stringify(request.body));
        console.log(request.body);

        function googleAssistantOther(agent) {
            let conv = agent.conv(); // Get Actions on Google library conversation object
            conv.ask('Please choose an item:');
            conv.ask(new Carousel({
                title: 'Google Assistant',
                items: {
                    'WorksWithGoogleAssistantItemKey': {
                        title: 'Works With the Google Assistant',
                        description: 'If you see this logo, you know it will work with the Google Assistant.',
                        image: {
                            url: imageUrl,
                            accessibilityText: 'Works With the Google Assistant logo',
                        },
                    },
                    'GoogleHomeItemKey': {
                        title: 'Google Home',
                        description: 'Google Home is a powerful speaker and voice Assistant.',
                        image: {
                            url: imageUrl2,
                            accessibilityText: 'Google Home'
                        },
                    },
                },
            }));
            agent.add(conv);
        }

        function welcome(agent) {
          let conv = agent.conv();
          welcome_service.welcome(conv);
          agent.add(conv);
           // agent.add(welcome_service.welcome());
        }

        function fallback(agent) {
            agent.add(fallback_service.fallback);
        }
      
        function searchResort(){
          let location = request.body.queryResult.parameters.geostate;
          let checkin_date = request.body.queryResult.parameters.checkin;
          let checkout_date = request.body.queryResult.parameters.checkout;
          
          let conv = agent.conv();
          conv.user.storage.startResortIndex=0;        //Reset to beginning
          conv.user.storage.resortLocation=location;    //Store location in session
          conv.user.storage.checkin_date=checkin_date;
          conv.user.storage.checkout_date=checkout_date;
          searchResort_service.searchResort(checkin_date,
                                            checkout_date,
                                            location,
                                            conv);
          agent.add(conv);
        } 
      
      function searchResortNext(){
        let conv = agent.conv();
        searchResort_service.searchResort(conv.user.storage.checkin_date,
                                          conv.user.storage.checkout_date,
                                          conv.user.storage.resortLocation,
                                          conv);
        agent.add(conv);
      }
      
      function depositTradingPower() {
        let conv = agent.conv();
        agent.add(deposit_service.depositTradingPower(conv));
        }
      
      function depositDetails(){
        let conv = agent.conv();
        deposit_service.depositDetails(conv);
        agent.add(conv);
      }
      
      function upcomingVacation(){
        let conv = agent.conv();
        conv.user.storage.startResortIndex=0;
        confirmedVacation_service.showUpcomingVacation(conv);
        agent.add(conv);
      } 
      
       function upcomingVacationNext(){
        let conv = agent.conv();
        confirmedVacation_service.showUpcomingVacation(conv);
        agent.add(conv);
      }
      
       function exit(agent) {
          agent.add(goodbye_service.exit());
        }

        function testWebhook(agent) {
            agent.add(`This went right inside Webhook`);
        }

        function other(agent) {
            agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
            agent.add(new Card({
                title: `Title: this is a card title`,
                imageUrl: imageUrl,
                text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
                buttonText: 'This is a button',
                buttonUrl: linkUrl
            })
            );
            agent.add(new Suggestion(`Quick Reply`));
            agent.add(new Suggestion(`Suggestion`));
            agent.context.set({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' } });
        }


        // Dialogflow intent Function Mapping
        let intentMap = new Map();
        intentMap.set('Default Welcome Intent', welcome);
        intentMap.set('Default Fallback Intent', fallback);
        intentMap.set('Search Resort', searchResort);
        intentMap.set('Search Resort Next', searchResortNext);
        intentMap.set('Deposit Trading Power', depositTradingPower);
        intentMap.set('Deposit Details', depositDetails);
        intentMap.set('Vacation Details', upcomingVacation);
        intentMap.set('Vacation Details Next', upcomingVacationNext);
        intentMap.set('Exit', exit);
        intentMap.set('TestWebhook', testWebhook);

        // Intent Error Handling: If req from Google Assistant use fn(googleAssistantOther) else fn(other)
        if (agent.requestSource === agent.ACTIONS_ON_GOOGLE) {
            intentMap.set(null, googleAssistantOther);
        } else {
            intentMap.set(null, other);
        }
        agent.handleRequest(intentMap);
    });
  
    app.get('/', (request, response) => {
      response.send('Say hello to SasChatter! Running on port: '+process.env.PORT);
      logger.trace(`Get hit!`);
    });


    // Creating a server at port 
    http.createServer(app).listen(port, () => {
        logger.trace(`Express server listening on port ${port}`);
    });
}());
