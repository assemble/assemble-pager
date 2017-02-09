# assemble-pager [![NPM version](https://img.shields.io/npm/v/assemble-pager.svg?style=flat)](https://www.npmjs.com/package/assemble-pager) [![NPM monthly downloads](https://img.shields.io/npm/dm/assemble-pager.svg?style=flat)](https://npmjs.org/package/assemble-pager)  [![NPM total downloads](https://img.shields.io/npm/dt/assemble-pager.svg?style=flat)](https://npmjs.org/package/assemble-pager) [![Linux Build Status](https://img.shields.io/travis/assemble/assemble-pager.svg?style=flat&label=Travis)](https://travis-ci.org/assemble/assemble-pager)

> Assemble plugin that adds prev/next pager information to the context.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save assemble-pager
```

Adds data to the context to enable creating pagers that work like this:

![image](https://cloud.githubusercontent.com/assets/383994/22801836/730eacdc-eedc-11e6-9dbb-3919875ef9a7.png)

## Usage

```js
var assemble = require('assemble');
var pager = require('assemble-pager');
var app = assemble();

// register the plugin
app.use(pager());

app.task('site', function() {
  return app.src('src/*.md')
    .pipe(app.pager()) // then add "app.pager()" before "app.renderFile()"
    .pipe(app.renderFile())
    .pipe(app.dest('blog'));
});
```

When `app.pager()` is called, it adds the `pager` variable to the context so that it's available to all views in the collection being rendered.

## Specify a collection

```js
// only add paging to the "posts" collection
.pipe(app.pager({collection: 'posts'}))
```

## Excluding files

If you don't [specify a collection](#specify-a-collection), all files in the stream will be buffered and included. However, you can selectively exclude files by setting `file.data.pager` to `false`, either in another plugin, middleware, or by defining it on yaml front-matter.

**Examples**

```js
// plugin, defined before `app.pager()`
.pipe(through.obj(function(file, enc, next) {
  file.data.pager = false;
  next(null, file);
}))

// middleware
app.onLoad(/\.foo$/, function(file, next) {
  file.data.pager = false;
  next();
});
```

Or yaml front-matter

```handlebars
---
pager: false
---

This is a page that should be skipped by `app.pager()`
```

## Template usage

The `pager` variable is an object with the following properties:

* `pager.prev` **{Object}** - the previous view that was rendered. This is an actual view, so you can get any data you need from it (like `pager.prev.path` or `pager.prev.data.title`, etc)
* `pager.next` **{Object}** - the next view to be rendered. This is an actual view, so you can get any data you need from it (like `pager.next.path` or `pager.next.data.title`, etc)
* `pager.current` **{Object}** - the view that is currently being rendered
* `pager.first` **{Object}** - Returns the first file in the list
* `pager.last` **{Object}** - Returns the last file in the list
* `pager.isFirst` **{Boolean}** - returns true if the "current" file is the first to be rendered
* `pager.isLast` **{Boolean}** - returns true if the "current" file is the last to be rendered
* `pager.index` **{Number}** - the list index of the current file being rendered

### Helpers

Some helpers are included with this plugin. To use them, do the following:

```js
var pager = require('assemble-pager');
app.helpers(pager.helpers);
```

Which adds the following helpers:

* `relative`- calculates the relative path from file `A` to file `B` (e.g. "current" file to next or previous file)
* `ifFirst`- returns true if the current file being rendered is the first file
* `ifLast`- returns true if the current file being rendered is the last file
* `next`- used in `href=""`, returns either the relative path to the "next" file, or `#` if the current file being rendered is the last file
* `prev`- used in `href=""`, returns either the relative path to the "previous" file, or `#` if the current file being rendered is the first file
* `attr`- stringify the options hash arguments to HTML attributes. For example, you can use this to conditionally add a class for a disabled next/prev link: `{{ifFirst (attr class="disabled")}}`, or `{{ifLast (attr class="disabled")}}` etc.

**Overriding helpers**

Helpers are exposed as an object so that you can choose to register them if you want, and/or override them if necessary:

For example, this is how the included "relative" helper works:

```js
var relative = require('relative');

app.helper('relative', function(from, to) {
  return relative(from.data.path, to.data.path);
});
```

### Example usage

Since `pager` is just another variable on the context, you can do anything you normally would with a variable in your handlebars templates.

```handlebars
<!-- generate relative paths using the relative helper
   from the "usage" section above --> 
<a href="{{#if pager.prev}}{{relative pager.current pager.prev}}{{/if}}">Prev</a>
```

Or you can create a block:

```handlebars
{{#pager}}
<!-- generate relative paths using "link-to" --> 
<a href="{{#if prev}}{{relative current prev}}{{/if}}">Prev</a>
{{/pager}}
```

**Partials**

To simplify paging even more, you can define partials like the following:

```js
app.partial('prev', '<a href="{{prev pager}}"{{ifFirst pager (attr class="disabled")}}>Prev</a>');
app.partial('next', '\n<a href="{{next pager}}"{{ifLast pager (attr class="disabled")}}>Next</a>');
app.partial('pager', '{{> prev }}\n{{> next }}');
```

### Troubleshooting

The easiest way to see how this works is to log out the `pager` variables, to see what's on the context. You can use the built-in `log` helper to do this:

```handlebars
{{log pager}}
```

## About

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for advice on opening issues, pull requests, and coding standards.

### Building docs

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
MIT

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.4.2, on February 09, 2017._