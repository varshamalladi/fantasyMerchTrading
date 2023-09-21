const User = require('../models/user');
const Item = require('../models/item');
const Offer = require('../models/offer');

exports.new = (req, res) => {
    let file = "newTrade.css";
    res.render('./user/new', {css: file});
};

exports.create = (req, res, next) => {
    let user = new User(req.body);
    if(user.email)
        user.email = user.email.toLowerCase();
    user.save()
    .then(() => {
        req.flash('success', 'Account created successfully!');
        return res.redirect('/users/login');
    })
    .catch(err => {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/users/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email Address already used');
            return res.redirect('/users/new');
        }
        next(err)});
};

exports.login = (req, res) => {
    let file = "newTrade.css";
    res.render('./user/login', {css: file});
};

exports.authenticateLogin = (req, res, next) => {
    //authenticate user's login request
    let email = req.body.email;
    if(email)
        email = email.toLowerCase();
    let password = req.body.password;

    //get the user that matches the email
    User.findOne({email: email})
    .then(user => {
        if(user){
            //user found
            user.comparePassword(password)
            .then(result => {
                if(result) {
                    req.session.user = user._id; //store user id in session
                    req.flash('success', 'You are successfully logged in');
                    res.redirect('/users/profile');
                } else {
                    req.flash('error', 'Wrong Password!');
                    res.redirect('/users/login');
                }
            });
        } else {
            req.flash('error', 'Wrong Email Address!');
            res.redirect('/users/login');
        }
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let file = "index.css";
    let id = req.session.user;

    Promise.all([User.findById(id), Item.find({tradedBy: id}), Item.find({watchedBy: id}), Offer.find({tradingUser: id}).populate('receivingItem', 'name category condition status') ])
    .then(results => {
        const [user, items, watchedItems, offers] = results;
        res.render('./user/profile', {css: file, user, items: items, watchedItems: watchedItems, offers: offers});
    })
    .catch(err => next(err));
    
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if(err)
            return next(err);
        else
            res.redirect('/');
    });
};