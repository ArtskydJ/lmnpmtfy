(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function calculate(element, ranges) {
	return function (fraction) {
		var a = compute(fraction, ranges.topPx, 'px')
		var b = compute(fraction, ranges.topVh, 'vh')
		if (a || b) element.style.top = (a && b) ? 'calc(' + a + '+ ' + b + 'vh)' : (a || b)

		var c = compute(fraction, ranges.leftPx, 'px')
		var d = compute(fraction, ranges.leftVw, 'vw')
		if (c || d) element.style.left = (c && d) ? 'calc(' + c + ' + ' + d + ')' : (c || d)
	}
}

function compute(fraction, range, str) {
	return range && (String(Math.round(range[0] + ((range[1] - range[0]) * fraction))) + str)
}

},{}],2:[function(require,module,exports){
module.exports = function cursorElement() {
	var cursor = document.getElementById('cursor')
	if (!cursor) {
		var div = document.createElement('div')
		div.innerHTML = '<img id="cursor" src="./img/cursor.png"></img>'
		document.body.appendChild(div)
		cursor = document.getElementById('cursor')
	}
	return cursor
}

},{}],3:[function(require,module,exports){
module.exports = function killEvent(ev) {
	ev.stopPropagation()
	ev.preventDefault()
}

},{}],4:[function(require,module,exports){
module.exports = function selectAll(element) {
	element.selectionStart = 0
	element.selectionEnd = element.value.length
}

},{}],5:[function(require,module,exports){
var rangeInterval = require('range-interval')
var cursorElement = require('./element-cursor.js')
var calculate = require('./calculate.js')

var siteSearchText = document.getElementById('site-search-text')
var siteSearchSubmit = document.getElementById('site-search-submit')

var cursorRepeatOpts = {
	start: 0,
	end: 1,
	step: 0.01,
	interval: 10
}

module.exports = function troll(text) {
	init()
	moveCursorToInput(function () {
		clickInput()
		typeInput(text, function () {
			moveCursorToSearchButton(function () {
				setTimeout(clickSearchButton, 100, text)
			})
		})
	})
}

function moveCursorToInput(cb) {
	var next = calculate(cursorElement(), {
		topPx: [ 0, 80 ],
		leftVw: [ 0, 50 ]
	})
	rangeInterval(cursorRepeatOpts, next, cb)
}

function clickInput() {
	siteSearchText.focus()
	siteSearchText.className = 'hover' // This doesn't really show up...
}

function typeInput(text, cb) {
	rangeInterval({
		start: 0,
		end: text.length,
		step: 1,
		interval: 200
	}, function stepInput(index) {
		siteSearchText.value = text.slice(0, index)
	}, cb)
}

function moveCursorToSearchButton(cb) {
	var next = calculate(cursorElement(), {
		leftPx: [ 0, -140 ],
		leftVw: [ 50, 100 ]
	})

	rangeInterval(cursorRepeatOpts, stepCursor, cb)

	function stepCursor(fraction) {
		next(fraction)
		if (fraction > 0.9) {
			siteSearchSubmit.className = 'hover'
		}
	}
}

function init() {
	window.location.replace(window.location.href + '#') // If you go 'back' to this page, it won't troll you again.
}

function clickSearchButton(text) {
	window.location.assign('https://npmjs.com/search?q=' + text)
}

},{"./calculate.js":1,"./element-cursor.js":2,"range-interval":9}],6:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],8:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":6,"./encode":7}],9:[function(require,module,exports){
module.exports = function repeatDelay(opts, each, cb) {
	if (!opts || typeof opts !== 'object') throw new TypeError('Expected options to be an object.')
	if (typeof opts.interval !== 'number') throw new TypeError('Expected options.interval to be a number.')
	if (typeof opts.end !== 'number') throw new TypeError('Expected options.end to be a number.')

	var n = opts.start || 0
	var higher = (n < opts.end)
	var iv = setInterval(iterate, opts.interval)

	function iterate() {
		each(n)
		n += Math.abs(opts.step || 1) * (higher ? 1 : -1)
		if (higher ? (n > opts.end) : (n < opts.end)) {
			clearInterval(iv)
			cb && cb()
		}
	}
}

},{}],10:[function(require,module,exports){
var troll = require('./troll.js')
var qs = require('querystring')
var killEvent = require('./kill-event.js')
var selectAll = require('./select-all.js')

var siteSearchText = document.getElementById('site-search-text')
var siteSearchForm = document.getElementById('site-search-form')

var hashExists = /#/.test(window.location.href)
var query = window.location.search.slice(1)

var searchText = qs.parse(query).q
if (!hashExists && searchText) {
	siteSearchText.value = ''
	troll(searchText)
} else {
	siteSearchText.value = searchText || ''

	siteSearchForm.onsubmit = function onsubmit(ev) {
		killEvent(ev)

		var path = window.location.origin + window.location.pathname
		if (siteSearchText.value.indexOf('/?q=') === -1) {
			siteSearchText.value = path.replace(/\/?$/, '/?') + qs.stringify({ q: siteSearchText.value })
		}
		selectAll(siteSearchText)
	}
}

},{"./kill-event.js":3,"./select-all.js":4,"./troll.js":5,"querystring":8}]},{},[10])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jYWxjdWxhdGUuanMiLCJqcy9lbGVtZW50LWN1cnNvci5qcyIsImpzL2tpbGwtZXZlbnQuanMiLCJqcy9zZWxlY3QtYWxsLmpzIiwianMvdHJvbGwuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yYW5nZS1pbnRlcnZhbC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FsY3VsYXRlKGVsZW1lbnQsIHJhbmdlcykge1xyXG5cdHJldHVybiBmdW5jdGlvbiAoZnJhY3Rpb24pIHtcclxuXHRcdHZhciBhID0gY29tcHV0ZShmcmFjdGlvbiwgcmFuZ2VzLnRvcFB4LCAncHgnKVxyXG5cdFx0dmFyIGIgPSBjb21wdXRlKGZyYWN0aW9uLCByYW5nZXMudG9wVmgsICd2aCcpXHJcblx0XHRpZiAoYSB8fCBiKSBlbGVtZW50LnN0eWxlLnRvcCA9IChhICYmIGIpID8gJ2NhbGMoJyArIGEgKyAnKyAnICsgYiArICd2aCknIDogKGEgfHwgYilcclxuXHJcblx0XHR2YXIgYyA9IGNvbXB1dGUoZnJhY3Rpb24sIHJhbmdlcy5sZWZ0UHgsICdweCcpXHJcblx0XHR2YXIgZCA9IGNvbXB1dGUoZnJhY3Rpb24sIHJhbmdlcy5sZWZ0VncsICd2dycpXHJcblx0XHRpZiAoYyB8fCBkKSBlbGVtZW50LnN0eWxlLmxlZnQgPSAoYyAmJiBkKSA/ICdjYWxjKCcgKyBjICsgJyArICcgKyBkICsgJyknIDogKGMgfHwgZClcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbXB1dGUoZnJhY3Rpb24sIHJhbmdlLCBzdHIpIHtcclxuXHRyZXR1cm4gcmFuZ2UgJiYgKFN0cmluZyhNYXRoLnJvdW5kKHJhbmdlWzBdICsgKChyYW5nZVsxXSAtIHJhbmdlWzBdKSAqIGZyYWN0aW9uKSkpICsgc3RyKVxyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3Vyc29yRWxlbWVudCgpIHtcblx0dmFyIGN1cnNvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXJzb3InKVxuXHRpZiAoIWN1cnNvcikge1xuXHRcdHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdGRpdi5pbm5lckhUTUwgPSAnPGltZyBpZD1cImN1cnNvclwiIHNyYz1cIi4vaW1nL2N1cnNvci5wbmdcIj48L2ltZz4nXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpXG5cdFx0Y3Vyc29yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1cnNvcicpXG5cdH1cblx0cmV0dXJuIGN1cnNvclxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBraWxsRXZlbnQoZXYpIHtcclxuXHRldi5zdG9wUHJvcGFnYXRpb24oKVxyXG5cdGV2LnByZXZlbnREZWZhdWx0KClcclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlbGVjdEFsbChlbGVtZW50KSB7XHJcblx0ZWxlbWVudC5zZWxlY3Rpb25TdGFydCA9IDBcclxuXHRlbGVtZW50LnNlbGVjdGlvbkVuZCA9IGVsZW1lbnQudmFsdWUubGVuZ3RoXHJcbn1cclxuIiwidmFyIHJhbmdlSW50ZXJ2YWwgPSByZXF1aXJlKCdyYW5nZS1pbnRlcnZhbCcpXHJcbnZhciBjdXJzb3JFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50LWN1cnNvci5qcycpXHJcbnZhciBjYWxjdWxhdGUgPSByZXF1aXJlKCcuL2NhbGN1bGF0ZS5qcycpXHJcblxyXG52YXIgc2l0ZVNlYXJjaFRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2l0ZS1zZWFyY2gtdGV4dCcpXHJcbnZhciBzaXRlU2VhcmNoU3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpdGUtc2VhcmNoLXN1Ym1pdCcpXHJcblxyXG52YXIgY3Vyc29yUmVwZWF0T3B0cyA9IHtcclxuXHRzdGFydDogMCxcclxuXHRlbmQ6IDEsXHJcblx0c3RlcDogMC4wMSxcclxuXHRpbnRlcnZhbDogMTBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cm9sbCh0ZXh0KSB7XHJcblx0aW5pdCgpXHJcblx0bW92ZUN1cnNvclRvSW5wdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0Y2xpY2tJbnB1dCgpXHJcblx0XHR0eXBlSW5wdXQodGV4dCwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRtb3ZlQ3Vyc29yVG9TZWFyY2hCdXR0b24oZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoY2xpY2tTZWFyY2hCdXR0b24sIDEwMCwgdGV4dClcclxuXHRcdFx0fSlcclxuXHRcdH0pXHJcblx0fSlcclxufVxyXG5cclxuZnVuY3Rpb24gbW92ZUN1cnNvclRvSW5wdXQoY2IpIHtcclxuXHR2YXIgbmV4dCA9IGNhbGN1bGF0ZShjdXJzb3JFbGVtZW50KCksIHtcclxuXHRcdHRvcFB4OiBbIDAsIDgwIF0sXHJcblx0XHRsZWZ0Vnc6IFsgMCwgNTAgXVxyXG5cdH0pXHJcblx0cmFuZ2VJbnRlcnZhbChjdXJzb3JSZXBlYXRPcHRzLCBuZXh0LCBjYilcclxufVxyXG5cclxuZnVuY3Rpb24gY2xpY2tJbnB1dCgpIHtcclxuXHRzaXRlU2VhcmNoVGV4dC5mb2N1cygpXHJcblx0c2l0ZVNlYXJjaFRleHQuY2xhc3NOYW1lID0gJ2hvdmVyJyAvLyBUaGlzIGRvZXNuJ3QgcmVhbGx5IHNob3cgdXAuLi5cclxufVxyXG5cclxuZnVuY3Rpb24gdHlwZUlucHV0KHRleHQsIGNiKSB7XHJcblx0cmFuZ2VJbnRlcnZhbCh7XHJcblx0XHRzdGFydDogMCxcclxuXHRcdGVuZDogdGV4dC5sZW5ndGgsXHJcblx0XHRzdGVwOiAxLFxyXG5cdFx0aW50ZXJ2YWw6IDIwMFxyXG5cdH0sIGZ1bmN0aW9uIHN0ZXBJbnB1dChpbmRleCkge1xyXG5cdFx0c2l0ZVNlYXJjaFRleHQudmFsdWUgPSB0ZXh0LnNsaWNlKDAsIGluZGV4KVxyXG5cdH0sIGNiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBtb3ZlQ3Vyc29yVG9TZWFyY2hCdXR0b24oY2IpIHtcclxuXHR2YXIgbmV4dCA9IGNhbGN1bGF0ZShjdXJzb3JFbGVtZW50KCksIHtcclxuXHRcdGxlZnRQeDogWyAwLCAtMTQwIF0sXHJcblx0XHRsZWZ0Vnc6IFsgNTAsIDEwMCBdXHJcblx0fSlcclxuXHJcblx0cmFuZ2VJbnRlcnZhbChjdXJzb3JSZXBlYXRPcHRzLCBzdGVwQ3Vyc29yLCBjYilcclxuXHJcblx0ZnVuY3Rpb24gc3RlcEN1cnNvcihmcmFjdGlvbikge1xyXG5cdFx0bmV4dChmcmFjdGlvbilcclxuXHRcdGlmIChmcmFjdGlvbiA+IDAuOSkge1xyXG5cdFx0XHRzaXRlU2VhcmNoU3VibWl0LmNsYXNzTmFtZSA9ICdob3ZlcidcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcblx0d2luZG93LmxvY2F0aW9uLnJlcGxhY2Uod2luZG93LmxvY2F0aW9uLmhyZWYgKyAnIycpIC8vIElmIHlvdSBnbyAnYmFjaycgdG8gdGhpcyBwYWdlLCBpdCB3b24ndCB0cm9sbCB5b3UgYWdhaW4uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsaWNrU2VhcmNoQnV0dG9uKHRleHQpIHtcclxuXHR3aW5kb3cubG9jYXRpb24uYXNzaWduKCdodHRwczovL25wbWpzLmNvbS9zZWFyY2g/cT0nICsgdGV4dClcclxufVxyXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBJZiBvYmouaGFzT3duUHJvcGVydHkgaGFzIGJlZW4gb3ZlcnJpZGRlbiwgdGhlbiBjYWxsaW5nXG4vLyBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgd2lsbCBicmVhay5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzA3XG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHFzLCBzZXAsIGVxLCBvcHRpb25zKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICB2YXIgb2JqID0ge307XG5cbiAgaWYgKHR5cGVvZiBxcyAhPT0gJ3N0cmluZycgfHwgcXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHZhciByZWdleHAgPSAvXFwrL2c7XG4gIHFzID0gcXMuc3BsaXQoc2VwKTtcblxuICB2YXIgbWF4S2V5cyA9IDEwMDA7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLm1heEtleXMgPT09ICdudW1iZXInKSB7XG4gICAgbWF4S2V5cyA9IG9wdGlvbnMubWF4S2V5cztcbiAgfVxuXG4gIHZhciBsZW4gPSBxcy5sZW5ndGg7XG4gIC8vIG1heEtleXMgPD0gMCBtZWFucyB0aGF0IHdlIHNob3VsZCBub3QgbGltaXQga2V5cyBjb3VudFxuICBpZiAobWF4S2V5cyA+IDAgJiYgbGVuID4gbWF4S2V5cykge1xuICAgIGxlbiA9IG1heEtleXM7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHggPSBxc1tpXS5yZXBsYWNlKHJlZ2V4cCwgJyUyMCcpLFxuICAgICAgICBpZHggPSB4LmluZGV4T2YoZXEpLFxuICAgICAgICBrc3RyLCB2c3RyLCBrLCB2O1xuXG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICBrc3RyID0geC5zdWJzdHIoMCwgaWR4KTtcbiAgICAgIHZzdHIgPSB4LnN1YnN0cihpZHggKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAga3N0ciA9IHg7XG4gICAgICB2c3RyID0gJyc7XG4gICAgfVxuXG4gICAgayA9IGRlY29kZVVSSUNvbXBvbmVudChrc3RyKTtcbiAgICB2ID0gZGVjb2RlVVJJQ29tcG9uZW50KHZzdHIpO1xuXG4gICAgaWYgKCFoYXNPd25Qcm9wZXJ0eShvYmosIGspKSB7XG4gICAgICBvYmpba10gPSB2O1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICBvYmpba10ucHVzaCh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqW2tdID0gW29ialtrXSwgdl07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHN0cmluZ2lmeVByaW1pdGl2ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdjtcblxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHYgPyAndHJ1ZScgOiAnZmFsc2UnO1xuXG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiBpc0Zpbml0ZSh2KSA/IHYgOiAnJztcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBzZXAsIGVxLCBuYW1lKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgb2JqID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG1hcChvYmplY3RLZXlzKG9iaiksIGZ1bmN0aW9uKGspIHtcbiAgICAgIHZhciBrcyA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG4gICAgICBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICAgIHJldHVybiBtYXAob2JqW2tdLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZSh2KSk7XG4gICAgICAgIH0pLmpvaW4oc2VwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqW2tdKSk7XG4gICAgICB9XG4gICAgfSkuam9pbihzZXApO1xuXG4gIH1cblxuICBpZiAoIW5hbWUpIHJldHVybiAnJztcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUobmFtZSkpICsgZXEgK1xuICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmopKTtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5mdW5jdGlvbiBtYXAgKHhzLCBmKSB7XG4gIGlmICh4cy5tYXApIHJldHVybiB4cy5tYXAoZik7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgIHJlcy5wdXNoKGYoeHNbaV0sIGkpKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHJlcy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuZGVjb2RlID0gZXhwb3J0cy5wYXJzZSA9IHJlcXVpcmUoJy4vZGVjb2RlJyk7XG5leHBvcnRzLmVuY29kZSA9IGV4cG9ydHMuc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9lbmNvZGUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVwZWF0RGVsYXkob3B0cywgZWFjaCwgY2IpIHtcblx0aWYgKCFvcHRzIHx8IHR5cGVvZiBvcHRzICE9PSAnb2JqZWN0JykgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgb3B0aW9ucyB0byBiZSBhbiBvYmplY3QuJylcblx0aWYgKHR5cGVvZiBvcHRzLmludGVydmFsICE9PSAnbnVtYmVyJykgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgb3B0aW9ucy5pbnRlcnZhbCB0byBiZSBhIG51bWJlci4nKVxuXHRpZiAodHlwZW9mIG9wdHMuZW5kICE9PSAnbnVtYmVyJykgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgb3B0aW9ucy5lbmQgdG8gYmUgYSBudW1iZXIuJylcblxuXHR2YXIgbiA9IG9wdHMuc3RhcnQgfHwgMFxuXHR2YXIgaGlnaGVyID0gKG4gPCBvcHRzLmVuZClcblx0dmFyIGl2ID0gc2V0SW50ZXJ2YWwoaXRlcmF0ZSwgb3B0cy5pbnRlcnZhbClcblxuXHRmdW5jdGlvbiBpdGVyYXRlKCkge1xuXHRcdGVhY2gobilcblx0XHRuICs9IE1hdGguYWJzKG9wdHMuc3RlcCB8fCAxKSAqIChoaWdoZXIgPyAxIDogLTEpXG5cdFx0aWYgKGhpZ2hlciA/IChuID4gb3B0cy5lbmQpIDogKG4gPCBvcHRzLmVuZCkpIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwoaXYpXG5cdFx0XHRjYiAmJiBjYigpXG5cdFx0fVxuXHR9XG59XG4iXX0=
