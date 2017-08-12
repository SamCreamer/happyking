/**
* Happy King
* Author: Sam Creamer
*/

/**
* This module is for strictly UI related things
*/
module.exports = class UI {
  /**
  * Updates the property count in the UI
  */
  static updatePropertyCountUI(property) {
    console.log(property);
    const el = document.querySelector('[data-propid-container="' + property.id + '"]').querySelector('.property-count');
    el.innerHTML = property.count;
  }


  /**
  * Update property cost in the UI
  */
  static updatePropertyCostUI(property) {
    const el = document.querySelector('[data-propid-container="' + property.id + '"]').querySelector('.property-cost');
    el.innerHTML = property.cost;
  }

}
