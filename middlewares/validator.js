const {body} = require('express-validator');
const {validationResult} = require('express-validator');

//validate the route parameter id
exports.validateId = (req, res, next) => {
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(id.match(/^[0-9a-fA-F]{24}$/)){
        return next();
    } else {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and atmost 64 characters').isLength({min:8, max:64})
];

exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and atmost 64 characters').isLength({min:8, max:64})
];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};

exports.validateItem = [body('name', 'Name cannot be empty').notEmpty().trim().escape(),
body('category', 'Category cannot be empty').notEmpty().trim().escape(),                                    
body('description', 'Description must be at least 10 characters').isLength({min:10}).trim().escape(),   //min Length 10 so notEmpty is not needed
body('imageurl', 'Enter a vaild URL').isURL().trim(),                                                   //not escaped because only takes input in the format of url
body('condition', 'Condition cannot be empty').notEmpty().escape()                                      //not trimmed because enum input
];