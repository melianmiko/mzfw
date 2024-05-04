// noinspection JSUnresolvedReference

import {glob} from "@zosx/utils";

if (typeof setTimeout === 'undefined') {
  glob.clearTimeout = function clearTimeout(timerRef) {
    timerRef && timer.stopTimer(timerRef)
  }

  glob.setTimeout = function setTimeout(func, ns) {
    const timer1 = timer.createTimer(
      ns || 1,
      0,
      function () {
        glob.clearTimeout(timer1)
        func && func()
      },
      {},
    )

    return timer1
  }

  glob.clearImmediate = function clearImmediate(timerRef) {
    timerRef && timer.stopTimer(timerRef)
  }

  glob.setImmediate = function setImmediate(func) {
    const timer1 = timer.createTimer(
      1,
        0,
      function () {
        glob.clearImmediate(timer1)
        func && func()
      },
      {},
    )

    return timer1
  }

  glob.clearInterval = function clearInterval(timerRef) {
    timerRef && timer.stopTimer(timerRef)
  }

  glob.setInterval = function setInterval(func, ms) {
    return timer.createTimer(
        1,
        ms,
        function () {
          func && func()
        },
        {},
    )
  }
}
