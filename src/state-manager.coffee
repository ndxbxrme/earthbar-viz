easing = require './easing'

module.exports = (animationManager, objects) ->
  transitioning = false
  nextTransition = null
  currentRods = 8
  positions = {}
  
  init: ->
    positions.rod = objects.rods[1].rod.position.y
    positions.nut1 = objects.rods[1].nut1.position.y
    positions.nut2 = objects.rods[1].nut2.position.y
    positions.nut3 = objects.rods[1].nut3.position.z
    positions.nubble = objects.rods[1].nubble.position.z
  transitionTo: (noRods) ->
    noRods = +noRods
    if transitioning
      nextTransition = noRods
      return
    removeRod = (rodNo, delay) ->
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.rod.position'
        property: 'y'
        endValue: 50
        duration: 0.5
        delay: delay
        easing: easing.easeInOutCubic
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.rod.position'
        property: 'y'
        endValue: 5000
        duration: 0.1
        delay: delay + 0.5
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut1.rotation'
        property: 'y'
        endValue: 5
        duration: 1.0
        delay: 0
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut1.position'
        property: 'y'
        endValue: 50
        duration: 0.5
        delay: delay + 0.2
        easing: easing.easeInOutCubic
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut1.position'
        property: 'y'
        endValue: 5000
        duration: 0.1
        delay: delay + 0.7
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut2.rotation'
        property: 'y'
        endValue: 5
        duration: 1.0
        delay: 0
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut2.position'
        property: 'y'
        endValue: 50
        duration: 0.5
        delay: delay + 0.3
        easing: easing.easeInOutCubic
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut2.position'
        property: 'y'
        endValue: 5000
        duration: 0.1
        delay: delay + 0.8
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut3.rotation'
        property: 'y'
        endValue: 5
        duration: 1.0
        delay: 0
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut3.position'
        property: 'z'
        endValue: -50
        duration: 0.5
        delay: delay + 0.3
        easing: easing.easeInOutCubic
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut3.position'
        property: 'z'
        endValue: -5000
        duration: 0.1
        delay: delay + 0.8
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nubble.position'
        property: 'z'
        endValue: -5000
        duration: 0.1
        delay: delay
        easing: easing.linear
    insertRod = (rodNo, delay) ->
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.rod.position'
        property: 'y'
        endValue: 50
        duration: 0.1
        delay: delay
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.rod.position'
        property: 'y'
        endValue: positions.rod
        duration: 0.5
        delay: delay + 0.1
        easing: easing.easeInOutCubic
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut1.rotation'
        property: 'y'
        endValue: Math.random() * Math.PI
        duration: 1.0
        delay: delay
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut1.position'
        property: 'y'
        endValue: 50
        duration: 0.1
        delay: delay + 0.2
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut1.position'
        property: 'y'
        endValue: positions.nut1
        duration: 0.5
        delay: delay + 0.3
        easing: easing.easeInOutCubic
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut2.rotation'
        property: 'y'
        endValue: Math.random() * Math.PI
        duration: 1.0
        delay: delay
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut2.position'
        property: 'y'
        endValue: 50
        duration: 0.1
        delay: delay + 0.3
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut2.position'
        property: 'y'
        endValue: positions.nut2
        duration: 0.5
        delay: delay + 0.4
        easing: easing.easeInOutCubic
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut3.rotation'
        property: 'y'
        endValue: Math.random() * Math.PI
        duration: 1.0
        delay: delay
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut3.position'
        property: 'z'
        endValue: -50
        duration: 0.1
        delay: delay
        easing: easing.linear
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nut3.position'
        property: 'z'
        endValue: positions.nut3
        duration: 0.5
        delay: delay + 0.1
        easing: easing.easeInOutCubic
      animationManager.addToQueue
        object: 'rods.' + rodNo + '.nubble.position'
        property: 'z'
        endValue: positions.nubble
        duration: 0.1
        delay: delay + 0.5
        easing: easing.linear
    moveCone = (x, duration, delay) ->
      lastRod = 'rods.' + (objects.rods.length - 1)
      nutOffset = objects.rods[objects.rods.length - 1].nut1.position.x - objects.cone3.position.x
      rodOffset = objects.rods[objects.rods.length - 1].rod.position.x - objects.cone3.position.x
      ['cone3', 'cone4', 'bignut2'].forEach (item) ->
        animationManager.addToQueue
          object: item + '.position'
          property: 'x'
          endValue: x
          duration: duration
          delay: delay
          easing: easing.easeInOutCubic
      [lastRod + '.nut1', lastRod + '.nut2', lastRod + '.nut3'].forEach (item) ->
        animationManager.addToQueue
          object: item + '.position'
          property: 'x'
          endValue: x + nutOffset
          duration: duration
          delay: delay
          easing: easing.easeInOutCubic
      [lastRod + '.rod', lastRod + '.nubble'].forEach (item) ->
        animationManager.addToQueue
          object: item + '.position'
          property: 'x'
          endValue: x + rodOffset
          duration: duration
          delay: delay
          easing: easing.easeInOutCubic
    morph = (val, duration, delay) ->
      animationManager.addToQueue
        object: 'base.morphTargetInfluences'
        property: 0
        endValue: val
        duration: duration
        delay: delay
        easing: easing.easeInOutCubic
      animationManager.addToQueue
        object: 'plate.morphTargetInfluences'
        property: 0
        endValue: val
        duration: duration
        delay: delay
        easing: easing.easeInOutCubic
    moveCamera = (x, duration, delay) ->
      animationManager.addToQueue
        object: 'controls.target'
        property: 'x'
        endValue: x
        duration: duration
        delay: delay
        easing: easing.easeInOutCubic
    if noRods < currentRods
      delay = 0
      while currentRods isnt noRods
        removeRod currentRods - 2, delay
        delay += 0.1
        currentRods -= 1
      moveCone 5 * (currentRods - 1), 1, 0
      totalRods = objects.rods.length - 2
      morph (totalRods - (currentRods - 2)) / totalRods, 1, 0
    else
      delay = 0
      while currentRods isnt noRods
        insertRod currentRods - 1, delay
        delay += 0.1
        currentRods += 1
      moveCone 5 * (currentRods - 1), 1, 0
      totalRods = objects.rods.length - 2
      morph (totalRods - (currentRods - 2)) / totalRods, 1, 0
    moveCamera (currentRods - 8) * 5 / 3, 1, 0
      
    return
    