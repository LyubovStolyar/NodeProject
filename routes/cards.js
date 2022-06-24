const express = require('express');
const _ = require("lodash");
const { Card, validateCard, generateBizNumber } = require('../models/card');
const auth = require('../middleware/auth');
const router = express.Router();

router.delete('/:id', auth, async (req, res) => {
    const card = await Card.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    if (!card) return res.status(404).send('The card with given ID not found');
    res.send(card);
})

router.put('/:id', auth, async (req, res) => {

    if (!req.params.id) return res.send('ID is required');

let initialCard = await Card.find({'_id': req.params.id});
if (initialCard.length == 1) initialCard = initialCard[0];

else res.send("ID doesn't mutch");

let card = {};
card.bizName = req.body.bizName ? req.body.bizName : initialCard.bizName;
card.bizDescription = req.body.bizDescription ? req.body.bizDescription : initialCard.bizDescription;
card.bizAddress = req.body.bizAddress ? req.body.bizAddress : initialCard.bizAddress;
card.bizPhone = req.body.bizPhone ? req.body.bizPhone : initialCard.bizPhone;
card.bizImage = req.body.bizImage ? req.body.bizImage : initialCard.bizImage;

    const { error } = validateCard(card);
    if (error) return res.status(400).send(error.details[0].message);

   card = await Card.findOneAndUpdate({ _id: req.params.id, user_id:req.user._id }, card);
    if (!card) return res.status (404).send('The card with given ID not found');
    res.send(card);
});

router.get('/:id', auth, async (req, res) => {
    const card = await Card.findOne({_id: req.params.id, user_id: req.user._id});
    if(!card) return res.status(404).send('The card with given ID not found');
    res.send(card);
})

router.post('/', auth, async (req, res) => {
    // const randomNumber = await generateBizNumber(Card);
    // res.send(randomNumber);

    const { error } = validateCard(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let card = new Card(
        {
            bizName: req.body.bizName,
            bizDescription: req.body.bizDescription,
            bizAddress: req.body.bizAddress,
            bizPhone: req.body.bizPhone,
            bizImage: req.body.bizImage ? req.body.bizImage : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            bizNumber: await generateBizNumber(Card),
            user_id: req.user._id

        }
    );
    post = await card.save();
    res.send(post);
});

module.exports = router;