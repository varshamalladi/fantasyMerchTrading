const Item = require('../models/item');

//check if user is a Guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user){
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user){
        return next();
    } else {
        req.flash('error', 'You need to login first');
        return res.redirect('/users/login');
    }
};

//check if user is owner of item
exports.isOwner = (req, res, next) => {
    let id = req.params.id;

    Item.findById(id)
    .then(item => {
        if(item) {
            if(item.tradedBy == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }
    })
    .catch(err => next(err));
};

//check if user is not owner of item
exports.isNotOwner = (req, res, next) => {
    let id = req.params.id;

    Item.findById(id)
    .then(item => {
        if(item) {
            if(item.tradedBy != req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }
    })
    .catch(err => next(err));
};

exports.isTraded = (req, res, next) => {
    let id = req.params.id;

    Item.findById(id)
    .then(item => {
        if(item) {
            if(item.status !== "Traded") {
                return next();
            } else {
                let err = new Error('Item already traded, cannot perform any further actions');
                err.status = 401;
                return next(err);
            }
        }
    })
    .catch(err => next(err));
};