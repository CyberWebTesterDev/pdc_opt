const { Router } = require('express');
const { DataCollector } = require('../helper/dataCollector');
const router = Router();
const { loggerServer } = require('../helper/logger');

module.exports = router;

router.get('/:appNum', async (req, res) => {
   loggerServer(`Received integraion logs request from: ${req.connection.remoteAddress}`);
   req.session.integrationLogsRequestCounter
      ? req.session.integrationLogsRequestCounter++
      : (req.session.integrationLogsRequestCounter = 1);
   const { appNum } = req.params;
   try {
      let dc = new DataCollector();
      let integrationLogData = await dc.collectDataLight(appNum, false, true);
      loggerServer(`Successfully collected integration logs data`);
      res.render('partitions/integration-logs-table.ejs', { integrationLogData });
   } catch (e) {
      throw Error(
         `Возникла ошибка при получении данных интеграционных логов заявки ${appNum}: ${e}`,
      );
   }
});
