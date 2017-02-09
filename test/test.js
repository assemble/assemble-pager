'use strict';

require('mocha');
var utils = require('assemble-fs/utils');
var assemble = require('assemble');
var assert = require('assert');
var pager = require('..');
var app;

var partials = {
  prev: `<a href="{{prev pager}}"{{ifFirst pager (attr class="disabled")}}>Prev</a>`,
  next: `\n<a href="{{next pager}}"{{ifLast pager (attr class="disabled")}}>Next</a>`,
  pager: '{{> prev }}\n{{> next }}'
};

describe('assemble-pager', function() {
  beforeEach(function() {
    app = assemble();
    app.use(pager());
    app.partials(partials);

    app.onLoad(/\.(md|hbs)$/, function(view, next) {
      view.extname = '.html';
      next();
    });
  });

  it('should load helpers', function() {
    app.helpers(pager.helpers);
    assert(app._.helpers.sync.relative);
    assert(app._.helpers.sync.next);
    assert(app._.helpers.sync.prev);
    assert(app._.helpers.sync.ifFirst);
    assert(app._.helpers.sync.ifLast);
  });

  it('should render pager info for each item in a collection', function(cb) {
    app = assemble();
    app.use(pager());
    app.partials(partials);
    app.helpers(pager.helpers);

    utils.prepareDest(app, 'foo', {});

    app.onLoad(/\.(md|hbs)$/, function(view, next) {
      view.extname = '.html';
      next();
    });

    var files = [];

    var stream = app.src('fixtures/*.md', {cwd: __dirname})
      .pipe(app.pager())
      .pipe(app.renderFile())
      .on('data', function(file) {
        assert(file.data.pager);
        assert.equal(typeof file.data.pager.index, 'number');
        files.push(file);
      })
      .on('end', function() {
        files.forEach(function(file, i) {
          assert.equal(file.data.pager.index, i);
          assert.equal(file.data.pager.current, file);
          assert.equal(file.data.pager.prev, files[i - 1]);
          assert.equal(file.data.pager.next, files[i + 1]);
          assert.equal(file.data.pager.first, files[0]);
          assert.equal(file.data.pager.last, files[files.length - 1]);

          switch (i) {
            case 0:

              assert(file.data.pager.isFirst);
              assert(!file.data.pager.isLast);
              break;
            case (files.length - 1):

              assert(file.data.pager.isLast);
              assert(!file.data.pager.isFist);
              break;
            default: {

              assert(!file.data.pager.isLast);
              assert(!file.data.pager.isFist);
              break;
            }
          }
        });

        cb();
      });

  });
});
