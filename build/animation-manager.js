(function() {
  var dotty;

  dotty = require('dotty');

  module.exports = function(objects, clock) {
    var queue;
    queue = [];
    return {
      addToQueue: function(args) {
        var endTime, item, objRef, startTime;
        startTime = args.startTime || (clock.getElapsedTime() + (args.delay || 0));
        endTime = args.endTime || (startTime + args.duration);
        objRef = dotty.get(objects, args.object);
        args.easing = args.easing || function(t) {
          return t;
        };
        item = {
          startTime: startTime,
          endTime: endTime,
          objRef: objRef,
          property: args.property,
          startValue: args.startValue,
          endValue: args.endValue,
          easingFn: args.easing,
          callback: args.callback || null
        };
        return queue.push(item);
      },
      update: function() {
        var delMe, i, item, j, len, len1, now, ratio, results, value;
        if (queue.length === 0) {
          return;
        }
        now = clock.getElapsedTime();
        delMe = [];
        for (i = 0, len = queue.length; i < len; i++) {
          item = queue[i];
          if (now > item.endTime) {
            item.objRef[item.property] = item.endValue;
            delMe.push(item);
            if (typeof callback === "function") {
              callback();
            }
          } else if (now >= item.startTime) {
            if (!item.startValue && item.startValue !== 0) {
              item.startValue = item.objRef[item.property];
            }
            ratio = (now - item.startTime) / (item.endTime - item.startTime);
            value = item.startValue + (item.endValue - item.startValue) * item.easingFn(ratio);
            item.objRef[item.property] = value;
          }
        }
        results = [];
        for (j = 0, len1 = delMe.length; j < len1; j++) {
          item = delMe[j];
          results.push(queue.splice(queue.indexOf(item), 1));
        }
        return results;
      }
    };
  };

}).call(this);

//# sourceMappingURL=animation-manager.js.map
