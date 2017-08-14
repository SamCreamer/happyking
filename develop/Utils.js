/**
* Happy King
* Author: Sam Creamer
*/

module.exports = class Utils {
  /**
   * Rounds number
   */
  static roundNumber(number, decimals) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
};
