var Reveal = require('reveal.js');
var RevealCSS = require('reveal.js/css/reveal.css');
var RevealCSS = require('reveal.js/css/theme/black.css');

var highlightJs = require('highlight.js');
var highlightJsCss = require('highlight.js/styles/default.css');
highlightJs.initHighlightingOnLoad();

require('../css/index.css');

Reveal.initialize({
	viewDistance: 2
});


var slideCount;
Reveal.addEventListener('ready', (event) => {
	slideCount = document.querySelectorAll('section').length;
	updateFooter(event.indexh);
});


Reveal.addEventListener('slidechanged', (event) => {
	location.hash = `#/${event.indexh}/${event.indexv}`;
	updateFooter(event.indexh);
});

function updateFooter(currentSlide) {
	if (currentSlide === 0 || currentSlide === (slideCount - 1)) {
		document.querySelector('footer').classList.remove('visible');
	} else {
		document.querySelector('footer').classList.add('visible');
	}
}

console.log('❤');