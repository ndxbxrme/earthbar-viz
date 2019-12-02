(function() {
  module.exports = {
    linear: function(t) {
      return t;
    },
    easeInQuad: function(t) {
      return t * t;
    },
    easeOutQuad: function(t) {
      return t * (2 - t);
    },
    easeInOutQuad: function(t) {
      if (t < .5) {
        return 2 * t * t;
      } else {
        return -1 + (4 - 2 * t) * t;
      }
    },
    easeInCubic: function(t) {
      return t * t * t;
    },
    easeOutCubic: function(t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic: function(t) {
      if (t < .5) {
        return 4 * t * t * t;
      } else {
        return (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      }
    },
    easeInQuart: function(t) {
      return t * t * t * t;
    },
    easeOutQuart: function(t) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart: function(t) {
      if (t < .5) {
        return 8 * t * t * t * t;
      } else {
        return 1 - 8 * (--t) * t * t * t;
      }
    },
    easeInQuint: function(t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function(t) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint: function(t) {
      if (t < .5) {
        return 16 * t * t * t * t * t;
      } else {
        return 1 + 16 * (--t) * t * t * t * t;
      }
    }
  };

}).call(this);

//# sourceMappingURL=easing.js.map
