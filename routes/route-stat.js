const { Router } = require('express');
const router = Router();
const dateTime = require('../datetime');
const { currentHostName } = require('../environment/host-helper');

module.exports = router;

routeStat = router.get('/', (req, res) => {
   const ip1 = req.connection.remoteAddress;
   const ip2 = req.header('x-forwarded-for');

   dateTime.getCurrentDateTime();
   console.log(`Server: Request monitor ALL has been received:` + '\n');
   console.log(req.headers);
   dateTime.getCurrentDateTime();
   console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}` + '\n');

   res.send(`<h2>Внимание! Страница полного мониторинга временно недоступна. Пользуйтесь ссылками:<br>
    http://${currentHostName}:8440/monitor/integration - для отображения интеграционных проблем<br>
    http://${currentHostName}:8440/monitor/cards - топ проблем по картам<br>
    http://${currentHostName}:8440/monitor/errors - топ ошибок по заявкам<br>
    http://${currentHostName}:8440/monitor/hang - топ зависаний
    </h2>`);

   dateTime.getCurrentDateTime();
   console.log(`Server: Listening...` + '\n');
});
