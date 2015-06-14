'use strict';

require('chai').should();
var project = require('../');

describe('initialization', function() {
  it('loads', function(done) {
    project.foo.should.equal('bar');
    done();
  });
});
