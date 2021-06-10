const { Router } = require('express');
const router = Router();
const { loggerServer } = require('../helper/logger');

module.exports = router;

router.get('/', (req, res) => {
   loggerServer(
      `Error processing in RKK button redirect detected: ${req.connection.remoteAddress}`,
   );
   console.log(req.session);
   console.log(req.sessionID);

   req.session.ErrorProcessInRKKBtnCounter
      ? req.session.ErrorProcessInRKKBtnCounter++
      : (req.session.ErrorProcessInRKKBtnCounter = 1);
});
