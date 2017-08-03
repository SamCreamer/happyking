module.exports = class Worker {
  /**
  * Id {int}
  * Name {string}
  * goldPerSecond {int}
  * description {string}
  * eligibility {int} How much gold do you need to earn before you are eglibigle to see this upgrade
  * hired {bool} Is this worker hired?
  */
  constructor(id, name, goldPerSecond, workValue, description, eligibility) {
    this.id = id;
    this.name = name;
    this.goldPerSecond = goldPerSecond;
    this.workValue = workValue;
    this.description = description;
    this.eligibility = eligibility;
    this.hired = false;
  }
};
