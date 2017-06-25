var originWidth = 360
var originFontSize = 20
var scale

function getScale() {
	return window.innerWidth / originWidth
}

function adapter() {
	document.querySelector('html').style.fontSize = originFontSize * getScale() + 'px'
}

window.onresize = adapter
adapter()
