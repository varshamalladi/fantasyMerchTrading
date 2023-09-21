const Offer = require('../models/offer');
const Item = require('../models/item');

//GET /offers/new/:receivingItemId - send a html form to select item to make an offer
exports.offer = (req, res, next) => {
    let file = "index.css";
    let userid = req.session.user;
    let receivingItem = req.params.id;
    
    Item.find({tradedBy: userid})
    .then(items => {
        availableItems = items.filter(item => item.status === "Available");
        res.render('./offers/newOffer', {css: file, items: availableItems, rId: receivingItem});
    })
    .catch(err => next(err));
    
};

//POST /offers/:receivingItemId - make a new offer
exports.makeOffer = (req, res, next) => {
    const tradingItem = req.body.tId;
    const receivingItem = req.params.id;
    const tradingUser = req.session.user;
    
    Item.findById(receivingItem)
    .then(item => {
        let offer = new Offer({
            tradingItem: tradingItem,
            receivingItem: receivingItem,
            tradingUser: tradingUser,
            receivingUser: item.tradedBy._id
        });
        return offer.save();
    })
    .then(() => {
        return Item.updateMany({ $or: [{_id: tradingItem}, {_id: receivingItem}] }, {status: "Trade Pending"});
       
    })
    .then((results)=> {
        if(results.nModified === 2){
            req.flash('success','Offer made successfully');
            return res.redirect('/users/profile');
        } else {
            let err = new Error('Couldnt update status');
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
};

//DELETE /offers/:offerId/:action? - remove an offer by cancelling, accepting or rejecting
exports.deleteOffer = (req, res, next) => {
    const id = req.params.id;
    let action = req.params.action || 'cancell';
    let status = "Available";
    if(action === 'accept') 
        status = "Traded";

    Offer.findByIdAndDelete(id, {useFindAndModify: false})
    .then(offer => {
        if(offer) {
            return Item.updateMany({ $or: [{_id: offer.tradingItem}, {_id: offer.receivingItem}] }, {status: status});
            
        } else {
            let err = new Error('Cannot find an item with id '+ id);
            err.status = 404;
           return  next(err);
        }
    })
    .then((result) => {
        if(result.nModified === 2){
            req.flash('success','Offer '+ action+'ed successfully');
            return res.redirect('/users/profile');
        } else {
            let err = new Error('Couldnt update status');
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err)); 
};

//GET /offers/manageOffer/:itemId - get manage offer page
exports.manageOffer = (req, res, next) => {
    let file = "index.css";
    let itemId = req.params.id;
    let tradeFlag = "";

    Offer.findOne({$or: [{tradingItem: itemId}, {receivingItem: itemId}] }).populate('tradingItem receivingItem', 'name imageurl')
    .then(offer => {
        if(offer.tradingItem.id === itemId)
            tradeFlag = "offerer";
        else 
            tradeFlag = "receiver";
        return res.render('./offers/manageOffer', {css: file, tradeFlag: tradeFlag, offer: offer});
    })
    .catch(err => next(err));
    
    
};

//add item to watch list
exports.watch = (req, res, next) => {
    let id = req.params.id;
    let userId = req.session.user;
    let update = {};
    let path = '/users/profile';
    let msg ='';

    if(req.body.watchedBy === 'true'){
        update = { $addToSet: { watchedBy: userId } };
        msg = 'Item added to watch list successfully';
    } else if(req.body.watchedBy === 'false'){
        update = { $pull: { watchedBy: { $in: [userId] }} };
        path = 'back';
        msg = 'Item removed from watch list successfully';
    }

    Item.findByIdAndUpdate(id, update, {useFindAndModify: false, runValidators: true})
    .then(item=>{
        if(item) {
            req.flash('success', msg);
            return res.redirect(path);
        } else {
            let err = new Error('Cannot find an item with id '+ id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));

};