var rangeInterval = require('range-interval')
var qs = require('querystring')
var cursorElement = require('./element-cursor.js')
var calculate = require('./calculate.js')

var npmSearch = document.getElementById('npm-search')
var siteSearchText = document.getElementById('site-search')
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
	npmSearch.className = 'hover'
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
		leftPx: [ 0, -80 ],
		leftVw: [ 50, 100 ]
	})

	rangeInterval(cursorRepeatOpts, stepCursor, cb)

	function stepCursor(fraction) {
		next(fraction)
		if (fraction > 0.95) {
			siteSearchSubmit.className = 'hover'
		}
	}
}

function init() {
	window.location.replace(window.location.href + '#') // If you go 'back' to this page, it won't troll you again.
}

function clickSearchButton(text) {
	window.location.assign('https://npmjs.com/search?' + qs.stringify({ q: text }))
}
