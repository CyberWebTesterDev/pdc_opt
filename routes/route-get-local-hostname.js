const { Router } = require('express');
const router = Router();
const { loggerServer } = require('../helper/logger');
const {currentHostName} = require('../environment/host-helper');

module.exports = router;

router.get('/', (req, res) => {
   loggerServer(`Request for hostname ${currentHostName} received: ${req.connection.remoteAddress}`);
   res.send(JSON.stringify({ currentHostName }));
});
