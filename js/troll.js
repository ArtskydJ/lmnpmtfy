var rangeInterval = require('range-interval')
var qs = require('querystring')
var cursorElement = require('./element-cursor.js')

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
	// If you go 'back' to this page, it won't troll you again
	window.location.replace(window.location.href + '#')

	moveCursorToInput(function () {
		siteSearchText.focus() // Not sure this does anything

		typeInput(text, function () {
			moveCursorToSearchButton(function () {
				setTimeout(clickSearchButton, 100, text)
			})
		})
	})
}

function moveCursorToInput(cb) {
	var element = cursorElement()

	rangeInterval(cursorRepeatOpts, function (ratio) {
		element.style.top = resolveRatio(ratio, 0, 80) + 'px'
		element.style.left = resolveRatio(ratio, 0, 50) + 'vw'

		if (ratio > 0.7) {
			npmSearch.className = 'hover'
		}
	}, cb)
}

function typeInput(text, cb) {
	var textRepeatOpts = {
		start: 0,
		end: text.length,
		step: 1,
		interval: 200
	}

	rangeInterval(textRepeatOpts, function stepInput(index) {
		siteSearchText.value = text.slice(0, index)
	}, cb)
}

function moveCursorToSearchButton(cb) {
	var element = cursorElement()

	rangeInterval(cursorRepeatOpts, function stepCursor(ratio) {
		element.style.left = calc(
			resolveRatio(ratio, 0, -80) + 'px',
			resolveRatio(ratio, 50, 100) + 'vw'
		)
		if (ratio > 0.95) {
			siteSearchSubmit.className = 'hover'
		}
	}, cb)
}

function clickSearchButton(text) {
	window.location.assign('https://npmjs.com/search?' + qs.stringify({ q: text }))
}

function calc(a, b) {
	return 'calc(' + a + ' + ' + b + ')'
}

function resolveRatio(ratio, low, high) {
	return Math.round(low + (high - low) * ratio)
}
