const mongoose = require("mongoose");
const modelList = require('./model-list');
const camelCase = require('camelcase');

module.exports = {
    getModel: (collection, options) => {
        return modelList[camelCase(collection)]({ collection, ...options, collection });
    }
};