//noinspection ThisExpressionReferencesGlobalObjectJS
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([
			'airhooks/forEach',
			'airhooks/addClass',
			'airhooks/removeClass',
			'airhooks/addEventListener',
			'airhooks/removeEventListener'
		], factory);
	} else {
		root.expendible = factory(
			airhooks.forEach,
			airhooks.addClass,
			airhooks.removeClass,
			airhooks.addEventListener,
			airhooks.removeEventListener
		);
	}
}(this, function (forEach, addClass, removeClass, addEventListener, removeEventListener) {
	return function Expandible(element) {
		addClass(element, 'bg-info');
	};
}));