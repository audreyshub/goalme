'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const should = chai.should();

const { Goal } = require('../models/goals-model.js');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

describe('Get landing page', function() {
  
  it('should return 200 status code with html', function() {
    return chai.request(app)
      .get('/index.html')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
        
      });
  });
});