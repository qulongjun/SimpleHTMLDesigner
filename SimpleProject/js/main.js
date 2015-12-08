/*
 * main.js
 */

(function() {
	require.config({
		paths: {
			jquery: 'js/jquery',
			bootstrap: 'js/bootstrap.min'
		},
		shim: {
			bootstrap: {
				deps: ['jquery'],
				exports: 'bootstrap'
			}
		}
	});
})(this);