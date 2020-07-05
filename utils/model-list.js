const mongoose = require("mongoose");
require('mongoose-geojson-schema');

const constructModel = (collection, schema, options={}) => {
    if(mongoose.modelNames().includes(collection)) 
        return mongoose.models[collection];
    const schemaObj = new mongoose.Schema(schema, options)
    return mongoose.model(collection, schemaObj);
};

const admins = {
    _id : {type: Number, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, index: true},
    dateOfBirth: {type: Date, required: true},
    region: {type: String, required: true},
    persona: {type: String, required: true},
    gender: {type: String, enum: ['male', 'female', 'other', undefined]},

};

const subFormSchema = {
    label: { type: String, required: true},
    isRequired: { type: Boolean, required: true},
    type: { type: String, required: true},
    data: [{ type: String, required: true}]
};

const adminCampaigns = {
    campaignName: { type: String, required: true },
    description:  { type: String, required: true},
    rules:  { type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    rewards:  { type: Number, required: true },
    locationIds: [mongoose.Types.ObjectId],
    noOfEntries: {type: Number, default: 0},
    createdBy: { type: Number, ref: constructModel('admins', admins)},
    delete: {type: Boolean},
    needForm: {type: Boolean},
    needMedia: {type: Boolean, required: true},
    persona: [{ type: String, required: true }],
    region: { type: String, required: true },
    formFields: [subFormSchema]
};

const locations = {
    locationNm: { type: String, required: true },
    state: {type: String, required: true},
    country: {type: String, required: true},
    createdBy: {type: String, ref: constructModel('admins', admins)},
    location: mongoose.Schema.Types.MultiPolygon,
    region: {type: String}
};

const users = {
    _id : {type: Number, required: true},
    avatar: {type: Number},
    name: {type: String},
    email: {type: String},
    dateOfBirth: {type: Date},
    mobileDeviceEndpoint: {type: String},
    platform: {type: String},
    rewards: {type: Number,  default: 0},
    currentLocation: { type: mongoose.Types.ObjectId, ref: constructModel('locations', locations)},
    defaultLocation: { type: mongoose.Types.ObjectId, ref: constructModel('locations', locations)},
    lastUsedDateTime: { type: Date },
    gender: {type: String, enum: ['male', 'female', 'other', undefined]},
    region: { type: String, required: true},
    password: { type: String}
};

const userTasks = {
    submittedBy : {
        userId: {type: Number, required: true},
        region: {type: String, required: true},
        persona: {type: String, required: true},
    },
    location: mongoose.Schema.Types.Point,
    locationNm: {type: String, required: true},
    campaignId: {type: mongoose.Types.ObjectId, ref: constructModel('admin.campaigns', adminCampaigns)},
    status: {type: String, required: true, enum: ['ACCEPTED', 'REJECTED', 'SUBMITTED', 'OPEN', 'CLOSED']},
    validatedBy: {type: Number, ref: constructModel('admins', admins)},
    comments: {type: String},
    photoId: {type: String},
    rewards: {type: Number},
    userId: {type: Number, required: true},
    formData: {type: Object},
};



module.exports = {
    admins: (options) => constructModel('admins', admins, options),
    adminCampaigns: (options) => constructModel('admin.campaigns', adminCampaigns, options),
    users: (options) => constructModel('users', users, options),
    userTasks: (options) => constructModel('user.tasks', userTasks, options),
    locations: (options) => constructModel('locations', locations, options),
}