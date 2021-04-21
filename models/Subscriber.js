const mongoose = require('mongoose')


const subscriberSchema = new mongoose.Schema({
		subscriberid: String,
        type: String,
        email: String,
        username: String,
        token: String,
        isVerified: Boolean,
        isActive: Boolean,
        preferences: Object,
        device: String,
        timestamp: Date,
        updatedOn: Date,
        cell: String,
        countrycode: String,
        gender: String,
        title: String,
        firstName: String,
        middleInitial: String,
        lasName: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
	})

module.exports = subscriberSchema
