const UTIL = require('../util');
const DATA = require('../data/data');

module.exports = {

  exit: () => {
    let fname = DATA.user.name.split(' ')[0];
    var exit_arr = [
      `Thank you ${fname} for using RITZY Hotels & Resorts. Good Bye!!!`
    ];
    return UTIL.getRandomMessage(exit_arr);
  }
}