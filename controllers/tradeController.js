const model = require('../models/item');
const Offer = require('../models/offer');

//GET /trades: send all trade categories to the user
exports.trades = (req, res, next)=>{
    let file = "trades.css";
    let categories = [];
    model.find()
    .then(items => {
        items.forEach(item => {
            if(!categories.includes(item.category)){
                categories.push(item.category);
            }
        });
        categories.sort();
        items = items.filter(item => item.status !== "Traded");
        res.render('./trade/trades', {items: items, categories: categories, css: file})
    })
    .catch(err => next(err));
};

//GET /trades/new: send a html form for creating a new trade item
exports.new = (req, res)=>{
    let file = "newTrade.css";
    let conditions = model.schema.path('condition').enumValues;
    res.render('./trade/newTrade',{css: file, conditions: conditions});
};

//POST /trades: create a new trade item
exports.create = (req, res, next)=>{
    let item = new model(req.body); //create new trade item
    item.tradedBy = req.session.user;
    item.status = "Available";
    item.save()
    .then(item => {
        req.flash('success', 'New Item created successfully.');
        return res.redirect('/trades')
    })
    .catch(err => {
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

//GET /trades/:id: send details of trade items in each category
exports.show = (req, res, next)=>{
    let id = req.params.id;
    let file = "trade.css";
    let userid = req.session.user;
    let watch = true;
   
    model.findById(id).populate('tradedBy','firstName lastName')
    .then(item => {
        if(item){
            if(item.watchedBy.includes(userid))
                watch = false;
            res.render('./trade/trade',{item: item, css: file, watch: watch});
        }
        else{
            let err = new Error('Cannot find an item with id '+ id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err =>  next(err));
};

//GET /trades/:id/edit: send the update form,
exports.edit = (req, res, next)=>{
    let id = req.params.id;
    let file = "newTrade.css";
    let conditions = model.schema.path('condition').enumValues;
    
    model.findById(id)
    .then(item => {
        if(item){
            res.render('./trade/editTrade',{item: item, css: file, conditions: conditions});
        }
        else{
            let err = new Error('Cannot find an item with id '+ id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err =>  next(err));
};

//PUT /trades/:id: update the edited trades
exports.update = (req, res, next)=>{
    let item = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators: true})
    .then(item=>{
        if(item) {
            req.flash('success', 'Item updated successfully.');
            return res.redirect('/trades/'+id);
        } else {
            let err = new Error('Cannot find an item with id '+ id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => {
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

//DELETE /trades/:id delete the trade item with id
exports.delete = (req, res, next)=>{
    let id = req.params.id;
    let path = '/trades';

    if(req.get('Referrer') === "http://localhost:3000/users/profile") 
        path = 'back';
    
    Promise.all([ 
        model.findByIdAndDelete(id, {useFindAndModify: false}),
        Offer.findOneAndDelete({$or: [{tradingItem: id}, {receivingItem: id}] }, {useFindAndModify: false})
    ])
    .then(([item, offer]) => {
        if(item) {
            if(offer){
                let updateItemId;
                if(offer.tradingItem == id){
                    updateItemId = offer.receivingItem;
                } else if(offer.receivingItem == id){
                    updateItemId = offer.tradingItem;
                }
                return model.findByIdAndUpdate(updateItemId, {status: "Available"}, {useFindAndModify: false})
                .then(item=>{
                    if(item) {
                        req.flash('success', 'Item deleted successfully.');
                        return res.redirect(path);
                    } else {
                        let err = new Error('Cannot find an item with id '+ updateItemId);
                        err.status = 404;
                        return next(err);
                    }
                })
            } 
            else {
                req.flash('success', 'Item deleted successfully.');
                return res.redirect(path);
            }
        } else {
            let err = new Error('Cannot find an item with id '+ id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
};
