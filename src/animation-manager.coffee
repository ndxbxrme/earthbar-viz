dotty = require 'dotty'

module.exports = (objects, clock) ->
  queue = []
  
  addToQueue: (args) ->
    startTime = args.startTime or (clock.getElapsedTime() + (args.delay or 0))
    endTime = args.endTime or (startTime + args.duration)
    objRef = dotty.get objects, args.object
    args.easing = args.easing or (t) -> t
    item =
      startTime: startTime
      endTime: endTime
      objRef: objRef
      property: args.property
      startValue: args.startValue
      endValue: args.endValue
      easingFn: args.easing
      callback: args.callback or null
    queue.push item
  update: ->
    return if queue.length is 0
    now = clock.getElapsedTime()
    delMe = []
    for item in queue
      if now > item.endTime
        item.objRef[item.property] = item.endValue
        delMe.push item
        callback?()
      else if now >= item.startTime
        item.startValue = item.objRef[item.property] if not item.startValue and item.startValue isnt 0
        ratio = (now - item.startTime) / (item.endTime - item.startTime)
        value = item.startValue + (item.endValue - item.startValue) * item.easingFn ratio
        item.objRef[item.property] = value
    for item in delMe
      queue.splice queue.indexOf(item), 1
      