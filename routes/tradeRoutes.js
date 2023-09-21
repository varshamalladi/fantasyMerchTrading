const express = require('express');
const controller = require('../controllers/tradeController');
const {isLoggedIn, isOwner, isTraded} = require('../middlewares/auth');
const {validateId, validateItem, validateResult} = require('../middlewares/validator');

const router = express.Router();

//GET /trades: send all trade categories to the user

router.get('/', controller.trades);

//GET /trades/new: send a html form for creating a new trade item

router.get('/new', isLoggedIn, controller.new);

//POST /trades: create a new trade item

router.post('/', isLoggedIn, validateItem, validateResult, controller.create);

//GET /trades/:id: send details of trade items in each category
router.get('/:id', validateId, controller.show);

//GET /trades/:id/edit: send the update for,
router.get('/:id/edit', validateId, isLoggedIn, isOwner, isTraded, controller.edit);

//PUT /trades/:id: update the edited trades
router.put('/:id', validateId, isLoggedIn, isOwner, isTraded, validateItem, validateResult, controller.update);

//DELETE /trades/:id delete the trade item with id
router.delete('/:id', validateId, isLoggedIn, isOwner, isTraded, controller.delete);

module.exports = router;