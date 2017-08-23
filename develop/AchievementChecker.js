/**
* Happy King
* Author: Sam Creamer
*/

/**
* This class checks if an achievment has been done. If it has, it awards that achievment
*/
module.exports = class AchievementChecker {
  /**
   * Checks if any achievements have been earned
   * @param  {array} achievements all of the achievements
   * @param  {obj} game         game object
   */
  static check(achievements, game) {
    for (let i = 0; i < achievements.length; i++) {
      let achievement = achievements[i];

      /**
      * Skip things we've already achieved
      */
      if (achievement.achieved) continue;

      /**
      * Check if the achievement has been gotten
      */
      if (achievement.criteria(game)) {
        achievement.earnAchievement();
      }
    }
  }
};
