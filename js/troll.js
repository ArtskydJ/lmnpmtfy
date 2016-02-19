var rangeInterval = require('range-interval')
var qs = require('querystring')

var cursor = document.getElementById('cursor')
var defaultCursor = document.getElementById('cursor-default')
var pointerCursor = document.getElementById('cursor-pointer')
var textCursor = document.getElementById('cursor-text')
var npmSearch = document.getElementById('npm-search')
var siteSearchText = document.getElementById('site-search')
var siteSearchSubmit = document.getElementById('site-search-submit')

var debugMode = window.location.hostname === 'localhost'

var called = false
module.exports = function troll(text, initialX, initialY) {
	if (called) return
	called = true

	// If you go 'back' to this page, it won't troll you again
	if (!debugMode) {
		window.location.replace(window.location.href + '#')
	}
	defaultCursor.className = 'show'

	// Initialize cursor in a random position
	cursor.style.left = initialX
	cursor.style.top = initialY

	// Move cursor to input box
	setTimeout(function () {
		cursor.style.left = '50vw'
		cursor.style.top = '80px'
	}, 10) // async

	// Hover over the input box
	setTimeout(function () {
		npmSearch.className = 'hover'
		defaultCursor.className = ''
		textCursor.className = 'show'
	}, 700)

	// Click the input box, and start typing
	setTimeout(function () {
		// I don't think this does anything
		siteSearchText.focus()

		// Type the letters into the input box
		typeInput(text, afterInputBoxIsPopulated)
	}, 1000)

	function afterInputBoxIsPopulated() {
		// Move cursor to search button
		cursor.style.left = 'calc(100vw - 80px)'

		// Hover on the search button
		setTimeout(function () {
			siteSearchSubmit.className = 'hover'
			textCursor.className = ''
			pointerCursor.className = 'show'
		}, 600)

		// Redirect to npmjs.com
		if (!debugMode) {
			setTimeout(function clickSearchButton() {
				var targetUrl = 'https://npmjs.com/search?' + qs.stringify({ q: text })
				window.location.assign(targetUrl)
			}, 1100)
		}
	}
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

function rand100() {
	return Math.floor(Math.random() * 100)
}
