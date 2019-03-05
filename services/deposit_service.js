const DATA = require('../data/data');
const UTIL = require('../util');
const { Suggestions } = require('actions-on-google');

module.exports = {

  depositTradingPower: (conv) => {
    var deposits = DATA.deposit_details;
    let max_trading_power = 0;
    deposits.filter((deposit) => {
      if (deposit.trading_power > max_trading_power) {
        max_trading_power = deposit.trading_power;
        conv.user.storage.tradingpower = deposit;
      }
    });
    var response_arr = [
      `The maximum deposit trading power you have is ${max_trading_power}`
    ];
    conv.ask(UTIL.getRandomMessage(response_arr));
    conv.ask(new Suggestions(['My deposit details']));
    return conv;
  },

  //ronit
  depositDetails: (conv) => {
    var deposit_detail = conv.user.storage.tradingpower;
    console.log(deposit_detail);
    var resort_name = deposit_detail.resort_name;
    var trading_power = deposit_detail.trading_power;
    var relation_no = deposit_detail.relation_no;
    var response_arr = [
      `Your deposit at ${resort_name} having trading power of ${trading_power} and bearing relation number ${relation_no} is available for a search request.`
    ];
    conv.ask(UTIL.getRandomMessage(response_arr));
    conv.ask(new Suggestions(['Search resorts in Florida', 'My max TP', 'Upcoming vacations']));
    return conv;
  }

};