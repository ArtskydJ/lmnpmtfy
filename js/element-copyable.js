module.exports = function copyableElement() {
	var copyable = document.getElementById('copyable')
	if (!copyable) {
		var div = document.createElement('div')
		div.id = 'copyable-div'
		div.innerHTML = 'Press Ctrl + C to copy: '

		copyable = document.createElement('input')
		copyable.id = 'copyable'

		document.getElementById('site-search').appendChild(div)
		div.appendChild(copyable)
	}
	return copyable
}
