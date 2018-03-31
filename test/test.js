require('dotenv').config();

const assert   = require('assert');
const chai     = require('chai');
const sinon    = require('sinon');
const model    = require('../db/model');

require('sinon-mongoose');

const expect = chai.expect;
const Test   = model.Test;
const Label  = model.Label;
const Image  = model.Image;

module.exports = {
    sinon,
    assert,
    expect, 
    Test,
    Label,
    Image
}