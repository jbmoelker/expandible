# Expandible

Turn plain markup into an interactive expandible component using just data-attributes or a JS API.

## Browser support

This project aims to support all browsers which support `querySelectorAll`. Since our Expandible component also requires a few methods which are not always natively supported, this component uses [Airhooks](https://github.com/voorhoede/airhooks) to help out with  (`Array.prototype.forEach`, `classList.add`, `classList.remove`, `EventTarget.addEventListener`, `EventTarget.removeEventListener`).

## Dependencies

* [RequireJS](https://github.com/jrburke/requirejs-bower)
* [Airhooks](https://github.com/voorhoede/airhooks)

Instal dependencies using `bower install`.

## To do

* Use `data-expandible-content` as content element.
* Use `data-expandible-close` to trigger close.
* Allow multiple `-toggle` and `-close` handles.
* Only supply to classes `is-expandible` and `is-expanded`.
* Make items inside component unfocusable when collapsed or automatically expand.
* Add destroy method.
* Add support for hasAttribute (DOM Level2 method), so we can simply write `data-expandible-open-on-focus` instead of `data-expandible-open-on-focus="true"`?
