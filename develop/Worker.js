/**
* Happy King
* Author: Sam Creamer
*/

module.exports = class Worker {
  /**
  * Id {int}
  * PropId {int} The corresponding property ID. Usually the same as id
  * Name {string}
  * description {string}
  * eligibility {int} How much gold do you need to earn before you are eglibigle to see this upgrade
  * secondsToWork {int} how many seconds does it take for this worker to work
  * hired {bool} Is this worker hired?
  */
  constructor(id, propId, name, cost, description, eligibility, secondsToWork) {
    this.id = id;
    this.propId = propId;
    this.name = name;
    this.cost = cost;
    this.description = description;
    this.eligibility = eligibility;
    this.secondsToWork = secondsToWork;
    this.hired = false;
  }
};
