/**
 * Turns `element` into an expandible component and gives it the `enhancedClass`.
 * The nested element with the `handleSelector` property controls the component.
 * The handle is triggered by click or enter key of focus and toggles the state
 * of the component. When state is expanded the `expandedClass` is added.
 * The component has support for keyboard and assistive technologies using ARIA properties.
 *
 * @constructor
 * @param {HTMLElement}
 * @param {Object} [options]
 * @param {String} [options.handleSelector=[data-expandible-handle]]
 * @param {String} [options.expandedClass=is-expanded]
 * @param {Boolean} [options.openOnFocus] - When true component expands on focus. Defaults to data-expandible-open-on-focus attribute value.
 * @param {Boolean} [options.closeOnBlur] - When true component collapses on blur. Defaults to data-expandible-close-on-blur attribute value.
 */
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

	/**
	 * Modern Element selector support
	 * @type {Boolean}
	 */
	var hasQuerySelectorSupport = ('querySelector' in document && 'querySelectorAll' in document);

	var KEY_CODES = {
		ENTER: 13,
		SPACE: 32
	};

	/**
	 * Shallow extend first array with properties of a second array.
	 * @param {Array} arr1
	 * @param {Array} arr2
	 */
	function extend(arr1, arr2) {
		for (var prop in arr2) {
			if (arr2.hasOwnProperty(prop)) {
				arr1[prop] = arr2[prop];
			}
		}
		return arr1;
	}

	/**
	 * Returns true if child is a descendant of parent.
	 * Borrowed from: http://stackoverflow.com/a/18162093
	 * @param {HTMLElement} child
	 * @param {HTMLElement} parent
	 * @return {Boolean}
	 */
	function childOf(child, parent){
		while((child=child.parentNode) && child !== parent);
		return !!child;
	}

	function Expandible (element, options) {
		var defaults = {
			handleSelector: '[data-expandible-toggle]',
			enhancedClass: 'is-expandible',
			expandedClass: 'is-expanded',
			openOnFocus: element.getAttribute('data-expandible-open-on-focus'),
			closeOnBlur: element.getAttribute('data-expandible-close-on-blur')
		};
		this.settings = extend(defaults, options);
		this.handle = element.querySelector(this.settings.handleSelector);
		this.element = element;
		this.isExpanded = element.classList.contains(this.settings.expandedClass);
		this.element.isExpandible = true;
		this.element.expandible = this;
		this.handle.expandible = this;
		this.init();
	}

	Expandible.instances = [];

	Expandible.prototype.init = function() {
		// register and assign IDs
		var instances = Expandible.instances;
		instances.push(this);
		this.element.id = this.element.id || 'expandible-' + instances.length;
		this.handle.id = this.handle.id || this.element.id + '-handle';
		this.id = this.element.id;
		// bind elements and events
		this.bind();
		// allow for enhanced styling
		addClass(this.element, this.settings.enhancedClass);
	};

	/**
	 * @param {Expandible} [component=this]
	 * @param {Boolean} [isExpanded] - Element expands when true. Defaults to inverse state.
	 * @returns {Boolean} isExpanded - Returns true when element is expanded.
	 */
	Expandible.prototype.toggle = function(isExpanded) {
		var component = this;
		isExpanded = (isExpanded !== undefined) ? isExpanded : !component.isExpanded;
		isExpanded ? addClass(component.element, component.settings.expandedClass)
			: removeClass(component.element, component.settings.expandedClass);
		component.element.setAttribute('aria-expanded', isExpanded);
		component.isExpanded = isExpanded;
		var allNodes = document.querySelectorAll('*');

		function closeIfOutside(event){
			var target = event.target;
			var isInsideElement = (target === component.element || childOf(target, component.element));
			var isHandle = (target === component.handle || childOf(target, component.handle));
			if(!isInsideElement && !isHandle) {
				component.close(component);
				removeEventListener(this, 'mousedown', closeIfOutside);
				forEach(allNodes, function(node){
					removeEventListener(node, 'focus', closeIfOutside);
				});
			}
		}
		if(isExpanded && component.settings.closeOnBlur) {
			addEventListener(document.body, 'mousedown', closeIfOutside);
			forEach(allNodes, function(node){
				// @todo: check if this has performance impact
				addEventListener(node, 'focus', closeIfOutside);
			});
		}

		return isExpanded;
	};

	/**
	 * @param {Expandible} [component=this]
	 * @returns {Boolean} isExpanded - Returns true when element is expanded.
	 */
	Expandible.prototype.open = function (component) {
		component = component || this;
		return component.toggle.call(component, true);
	};

	/**
	 * @param {Expandible} [component=this]
	 * @returns {Boolean} isExpanded - Returns true when element is expanded.
	 */
	Expandible.prototype.close = function (component) {
		component = component || this;
		return component.toggle.call(component, false);
	};

	/**
	 * @returns {Expandible} - Returns this instance for chainability.
	 */
	Expandible.prototype.bind = function() {
		var component = this;
		// make handle focusable
		this.handle.setAttribute('tabindex', 0);
		// link elements
		this.element.setAttribute('role', 'region');
		this.element.setAttribute('aria-labelledby', this.handle.id);
		this.element.setAttribute('aria-expanded', this.isExpanded);
		this.handle.setAttribute('role', 'button');
		this.handle.setAttribute('aria-controls', this.element.id);

		// toggle on mousedown, enter and space key
		addEventListener(this.handle, 'mousedown', function(event){
			component.toggle.call(component);
		});
		addEventListener(this.handle, 'keydown', function(event) {
			if (event.keyCode === KEY_CODES.ENTER || event.keyCode === KEY_CODES.SPACE) {
				component.toggle.call(component);
			}
		});
		// open on focus?
		if(this.settings.openOnFocus) {
			addEventListener(this.handle, 'focus', function(event){
				component.open.call(component);
			});
		}
		return this;
	};

	return Expandible;
}));