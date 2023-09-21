const express = require('express');
const controller = require('../controllers/offerController');
const {isLoggedIn, isNotOwner, isTraded} = require('../middlewares/auth');
const {validateId} = require('../middlewares/validator');

const router = express.Router();

//GET /offers/new/:receivingItemId - send a html form to select item to make an offer
router.get('/new/:id', isLoggedIn, isTraded, controller.offer);

//POST /offers/:receivingItemId - make a new offer
router.post('/:id', isLoggedIn, isTraded, controller.makeOffer);

//DELETE /offers/:offerId/:action? - remove an offer by cancelling, accepting or rejecting
router.delete('/:id/:action?', controller.deleteOffer);

//GET /offers/manageOffer/:itemId - get manage offer page
router.get('/manageOffer/:id', controller.manageOffer);

//PUT /offers/:id - watch an item
router.put('/:id', validateId, isLoggedIn, isNotOwner, isTraded, controller.watch);

module.exports = router;