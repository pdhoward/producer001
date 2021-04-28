const mongoose = require('mongoose')


const brandSchema = new mongoose.Schema({
		brandid: String,
        type: String,  
        address: Object,
        location: Object,
        industry: String,
        symbol: String,        
        name: String,
        label: String,
        isActive: Boolean,
        isVerified: Object,
        overview: String,
        image: String,
        slug: String,
        website: String,
        phone: String,        
        timestamp: Date,
        updatedOn: Date
       
	})

module.exports = brandSchema
