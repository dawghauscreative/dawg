(function () {
	'use strict';

	var toggle = document.getElementById( 'nav-toggle' );
	var nav = document.getElementById( 'site-nav' );

	if ( ! toggle || ! nav ) {
		return;
	}

	toggle.addEventListener( 'click', function () {
		var isOpen = nav.classList.toggle( 'is-open' );
		toggle.classList.toggle( 'is-open', isOpen );
		toggle.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );
	} );

	document.addEventListener( 'click', function ( event ) {
		if ( ! nav.classList.contains( 'is-open' ) ) {
			return;
		}
		if ( nav.contains( event.target ) || toggle.contains( event.target ) ) {
			return;
		}
		nav.classList.remove( 'is-open' );
		toggle.classList.remove( 'is-open' );
		toggle.setAttribute( 'aria-expanded', 'false' );
	} );

	window.addEventListener( 'resize', function () {
		if ( window.innerWidth >= 900 ) {
			nav.classList.remove( 'is-open' );
			toggle.classList.remove( 'is-open' );
			toggle.setAttribute( 'aria-expanded', 'false' );
		}
	} );
}());
