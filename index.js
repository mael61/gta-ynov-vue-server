"use strict";
const express = require('express');
const DB = require('./db');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors')

const db = new DB("sqlitedb")
const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

app.use(cors())

router.post('/register', function(req, res) {
    db.insert([
        req.body.name,
        req.body.email,
        bcrypt.hashSync(req.body.password, 8),
        req.body.role
    ],
    function (err) {
        if (err) return res.status(500).send("There was a problem registering the user.")
        db.selectByEmail(req.body.email, (err,user) => {
            if (err) return res.status(500).send("There was a problem getting user")
            let token = jwt.sign({ id: user.id }, config.secret, {expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token, user: user });
        });
    });
});


router.post('/agenda_event', function(req, res) {
    db.insertEvent([
            req.body.userId,
            req.body.dateBegin,
            req.body.dateEnd,
            req.body.category,
            req.body.reason,
        ]);
        res.status(200).send();
});



router.post('/login', (req, res) => {
    db.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 // expires in 24 hours
        });
        console.log('Requete connexion :'+user)
        res.status(200).send({ auth: true, token: token, user: user });
    });
})
router.post('/profile', (req, res) => {
    console.log('debut de requete')
    db.selectProfileById(req.body.userId, (err, userProfile) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!userProfile) return res.status(404).send('No Profile user.');
        console.log('Requete profile :'+userProfile)
        res.status(200).send({ auth: true, userProfile: userProfile });

    });
})

app.use(router)

let port = process.env.PORT || 3000;

let server = app.listen(port, function() {
    console.log('Express server listening on port ' + port)
});


