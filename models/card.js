const Joi = require('joi');
const _ = require('lodash');
const mongo = require('mongoose');

const cardSchema = new mongo.Schema ({
bizName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255
},
bizDescription: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 500
},
bizPhone: {
    type: String,
    required: true,
    minLength: 7,
    maxLength: 17
},
bizImage: {
    type: String,
    required: true,
    minLength: 11,
    maxLength: 500
},
bizNumber: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 1000000,
    unique: true
},
bizAddress: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 400
  },
  user_id: { type: mongo.Schema.Types.ObjectId, ref: "User" }

});

const Card = mongo.model('Card', cardSchema);

function validateCard (card) {
    const schema = Joi.object ({
        bizName: Joi.string().min(2).max(255).required(),
        bizDescription: Joi.string().min(2).max(500).required(),
        bizAddress: Joi.string().min(2).max(400).required(),
        bizPhone: Joi.string().min(7).max(17).required().regex(/^0[2-9]\d{7,8}$/),
        bizImage: Joi.string().min(11).max(500)
    });

    return schema.validate(card);
}

async function generateBizNumber(Card){

    while (true) {
        let randomNumber = _.random(1000, 99999);
        let card = await Card.findOne ({ bizNumber: randomNumber });
        if (!card) return String(randomNumber);
    }
}

exports.Card = Card;
exports.validateCard = validateCard;
exports.generateBizNumber = generateBizNumber;