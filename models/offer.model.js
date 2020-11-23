const mongoose = require('mongoose')
const Schema = mongoose.Schema

const offerSchema = new Schema({

    title: { type: String },

    location: { type: String },

    study: { type: String, enum: ['UI/UX', 'Web Development', 'Cyber'] },

    style: { type: String, enum: ['Remoto', 'Presencial'] },

    name: { type: String, default: 'unknown' },

    email: { type: String },

    description: { type: String },

    company: { type: Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true })

module.exports = mongoose.model('Offer', offerSchema)