/*
 * main.js
 */
require.config({
	paths: {
		jquery: 'js/jquery',
		backbone: 'js/backbone'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		}
	}
});