import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
    let markers = this.markers, targetId = this.targetId,
    targetSel = "#" + targetId;
    
    console.log("components/path-hover didInsertElement()", this.element,
                markers, targetId, this._targetObject, this.parentView.element);

    Ember.$(this.element).position({
      // my:        "left top",
      // at:        "left bottom",
      of:        Ember.$(targetSel), // this, // or $("#otherdiv")
      // collision: "fit"
    });

    Ember.run.later(function() {
      let d = Ember.$('.tooltip.ember-popover');  // make-ui-draggable
      console.log(d, d.length, d[0], d[1]);
      // d.draggable();
    });
  }
});
