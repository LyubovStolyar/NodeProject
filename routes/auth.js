const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/users');
const express = require('express');
const router = express.Router();
 

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email:req.body.email});

    const validPassword = await bcrypt.compare(req.body.password, user ? user.password ? user.password : "555555" : "555555" );
    if(!validPassword) return res.status(400).send('Invalid email or password');

    res.json({ token: await user.generateAuthToken() });
    // res.send('ok')
});

function validate (req) {

    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required()
    })

    return schema.validate(req);
}

module.exports = router;