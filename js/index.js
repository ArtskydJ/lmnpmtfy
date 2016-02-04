var troll = require('./troll.js')
var qs = require('querystring')
var killEvent = require('./kill-event.js')
var selectAll = require('./select-all.js')

var siteSearchText = document.getElementById('site-search')
var npmSearchForm = document.getElementById('npm-search')

var hashExists = /#/.test(window.location.href)
var query = window.location.search.slice(1)

var searchText = qs.parse(query).q
if (!hashExists && searchText) {
	siteSearchText.value = ''
	troll(searchText)
} else {
	siteSearchText.value = searchText || ''

	npmSearchForm.onsubmit = function onsubmit(ev) {
		killEvent(ev)

		var path = window.location.origin + window.location.pathname
		if (siteSearchText.value.indexOf('/?q=') === -1) {
			siteSearchText.value = path.replace(/\/?$/, '/?') + qs.stringify({ q: siteSearchText.value })
		}
		selectAll(siteSearchText)
	}
}
