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
