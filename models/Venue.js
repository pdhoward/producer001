const mongoose = require('mongoose')


const venueSchema = new mongoose.Schema({
		marketid: String,
        type: String,
        monitors: Array,
        location: Object,
        address: Object,
        emterprise: Array,
        market: Array,
        geography: Array,
        lifemode: Array,
        isActive: Boolean,
        label: String,
        name: String,
        slug: String,
        overview: String,
        stage: String,
        propertyType: String,
        condition: String,
        website: String,
        phone: String,
        termsAndCondition: String,
        attributes: Array,
        images: Object,
        image: String,
        gallery: Array,
        categories: Array,
        adRates: Array,
        isNegotiable: Boolean,
        traffic: Number,
        timestamp: Date,
        updatedOn: Date,
        apitoken: String


	})

module.exports = venueSchema
