# Expandible

Turn plain markup into an interactive expandible component using just data-attributes or a JS API.

## Browser support

This project aims to support all browsers which support `querySelectorAll`. Since our Expandible component also requires a few methods which are not always natively supported, this component uses [Airhooks](https://github.com/voorhoede/airhooks) to help out with  (`Array.prototype.forEach`, `classList.add`, `classList.remove`, `EventTarget.addEventListener`, `EventTarget.removeEventListener`).

## Dependencies

* [RequireJS](https://github.com/jrburke/requirejs-bower)
* [Airhooks](https://github.com/voorhoede/airhooks)

Instal dependencies using `bower install`.
