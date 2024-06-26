const express = require('express');
const validators = require('../validators/users');
const createUserControllers = require('../controllers/users');

module.exports = function (io) {
    const router = express.Router();
    const controllers = createUserControllers(io); // Create controllers with io

    router.post('/', validators.add, controllers.add);
    router.get('/list', controllers.list);
    router.put('/:id', validators.paramId, validators.add, controllers.update);
    router.delete('/:id', validators.paramId, controllers.delete);
    router.get('/:id', validators.paramId, controllers.fetchDetails);

    return router;
};
