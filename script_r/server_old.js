const express = require('express')
var dateTime = require('./datetime')
var rp = require('./RequestProcessor')
const request = require('request-promise')
var http = require('http')
const {Pool, Client} = require('pg')
var fs = require('fs')
const app = express()
const port = 8440

var isConnectionMade = false;


Date.prototype.addHours = function(h) {        
    this.setTime(this.getTime() + (h*60*60*1000));
    return this; 
    }



app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.set('trust proxy', true); 

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'pgtestdb',
    password: 'root',
    port: 5432,
  })






 function DataCollector(input){
        
    dateTime.getCurrentDateTime()
    console.log(`External request has been received for ${input}`+'\n')
    //sqlext.values[0] = input
    sqltest.values[0] = input
    return new Promise ((resolve, reject) => {
        client.query(sqltest, (err, res) => { if (err) {throw err;}
     
        let arrstr2 = new Array();
        let extjsonarr = new Array();  
        res.rows.forEach( (el, i, array) => 
          {
          arrstr2[i] = JSON.stringify(array[i])
          extjsonarr[i] = JSON.parse(arrstr2[i])
          console.log(arrstr2[i]+'\n')  
          
          
          return arrstr2
         
        
          }); 
          //console.log(extjsonarr[0].scheme_name);
          resolve(arrstr2) 
      });

      })
    }

app.set('view engine', 'ejs');





var server = http.createServer();

app.get('/', (req, res) => {
    dateTime.getCurrentDateTime()
    console.log(`: Request event on start page`+'\n')
    res.send('Start page')
}) 


app.get('/admin/getconnect', (req, res) => {
    dateTime.getCurrentDateTime()
    console.log(`Server: service task to establish connection to DB...`+'\n')

    rp.connectionExec();
    res.send('Server: Connection established')
}) 


app.get('/admin/closeconnect', (req, res) => {
    dateTime.getCurrentDateTime()
    console.log(`Server: Request to close conntction`+'\n')
    rp.connectionClose();
    res.send('Connection to DB was closed')
}) 



app.get('/public/js/jquery-3.4.1.min.js', (req, res) => {
    dateTime.getCurrentDateTime()
    console.log(`: Request event on start page`+'\n')
    res.sendFile(__dirname + '/public/jquery-3.4.1.min.js')
}) 

app.get('/stop', (req, res) => {
    process.exit(0) 
}) 

app.get('/process/:scheme/:id', (req, res) => {
    dateTime.getCurrentDateTime()
    console.log(`: Recieved request with parameters: ${req.params.scheme}, ${req.params.id}`+'\n')
    res.send(`Target page with parameters`)
})

app.get('/info/:appnum', (req, res) => {
    
    
    var ip = req.headers['x-forwarded-for']
    dateTime.getCurrentDateTime()
    console.log(`Server: Request info for data collection of application has been received:`+'\n')
    console.log(req.headers);

    res.send(`<h2>Сервис переехал на новый адрес: http://d6355:8440/support/${req.params.appnum}`)
    console.log(`Server: Continue to litening on port: ${port}...`+'\n')
})

//расширенный сбор данных

app.get('/getfullinfo/:appnum', (req, res) => {


    var ip = req.headers['x-forwarded-for']
    dateTime.getCurrentDateTime()
    console.log(`Server: Request getfullinfo for data collection of application has been received:`+'\n')
    console.log(req.headers);
     res.send(`<h2>Сервис переехал на новый адрес: http://d6355:8440/support/${req.params.appnum}`)
     console.log(`Server: Continue to litening on port: ${port}...`+'\n')
})



//МОНИТОРИНГ


app.get('/monitor/statistics', (req, res) => {

/*
    dateTime.getCurrentDateTime()
    console.log(`Server: Checking need to connection to DB:`+'\n')

    if (isConnectionMade == false) 
        
    { 
        console.log(`Server: Connection is needed`+'\n');
        rp.connectionExec(); 
        isConnectionMade = true; 
    }

    else if (isConnectionMade == true)   {
    
    console.log(`Server: Connection is NOT needed`+'\n');

    }

*/
    var ip1 = req.connection.remoteAddress;
    var ip2 = req.header('x-forwarded-for') 
   
       
    dateTime.getCurrentDateTime()
    console.log(`Server: Request monitor ALL has been received:`+'\n')
    console.log(req.headers);
    dateTime.getCurrentDateTime()
    console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}`+'\n')

    // rp.getMonitoringData('integration').then((montarr) => {  //1st
        
    //     rp.getMonitoringData('CC_fails').then((montarr2) => {  //2nd

    //         rp.getMonitoringData('topErrors').then((montarr3) => {  //3rd

    //             rp.getMonitoringData('topHangings').then((montarr4) => {  //4rd



    //     dateTime.getCurrentDateTime()
    //     console.log(`Server: All Responses from getMonitoringData has been received. Checking data...`+'\n')

    //     if (montarr.length == 0) {console.log(`Server: 1st data pool is empty...`+'\n')} else {console.log(`Server: 1st data pool is NOT empty...`+'\n')}

    //     if (montarr2.length == 0) {console.log(`Server: 2nd data pool is empty...`+'\n')} else {console.log(`Server: 2nd data pool is NOT empty...`+'\n')}

    //     if (montarr3.length == 0) {console.log(`Server: 3rd data pool is empty...`+'\n')} else {console.log(`Server: 3rd data pool is NOT empty...`+'\n')}

    //     var mont = []
    //     var mont2 = []
    //     var mont3 = []
    //     var mont4 = []

    //     montarr.forEach( (el, i, array) => {
    
    //         mont[i] = JSON.parse(array[i]); 
    //         return mont
    
    //             })


    //         mont.forEach( (el, i, array) => {

    //             array[i].interaction_ts = new Date (array[i].interaction_ts)
    //             array[i].interaction_ts.addHours(3);
    //             array[i].interaction_ts = array[i].interaction_ts.toISOString().replace('T', ' ').replace('Z', '');

    //         })

    //             montarr2.forEach( (el, i, array) => {
    
    //                 mont2[i] = JSON.parse(array[i]); 
    //                 return mont2
            
    //                     })

    //                 mont2.forEach( (el, i, array) => {

    //                     array[i].start_time_ = new Date (array[i].start_time_)
    //                     array[i].start_time_.addHours(3);
    //                     array[i].start_time_ = array[i].start_time_.toISOString().replace('T', ' ').replace('Z', '');
            
    //                     })



    //             montarr3.forEach( (el, i, array) => {
    
    //                 mont3[i] = JSON.parse(array[i]); 
    //                 return mont3
                    
    //                 })


    //             mont3.forEach( (el, i, array) => {

    //                 array[i].start_time_ = new Date (array[i].start_time_)
    //                 array[i].start_time_.addHours(3);
    //                 array[i].start_time_ = array[i].start_time_.toISOString().replace('T', ' ').replace('Z', '');
            
    //                 })


    //                 montarr4.forEach( (el, i, array) => {
    
    //                     mont4[i] = JSON.parse(array[i]); 
    //                     return mont4
                        
    //                     })

    //             mont4.forEach( (el, i, array) => {

    //                 array[i].start_time_ = new Date (array[i].start_time_)
    //                 array[i].start_time_.addHours(3);
    //                 array[i].start_time_ = array[i].start_time_.toISOString().replace('T', ' ').replace('Z', '');
                    
    //                 })

                

         

    //             res.render('Monitor_dashboard', {data: mont, data2: mont2, data3: mont3, data4: mont4})


    //             }).catch((err) => {throw err;}) //конец 4rd

    //         }).catch((err) => {throw err;})  //конец 3rd


    //     }).catch((err) => {throw err;}) //getMonitoringData('CC_fails') конец 2nd

    // }).catch((err) => {throw err;}) //rp.getMonitoringData('integration') конец 1st


    res.send(`<h2>Внимание! Страница полного мониторинга временно недоступна. Пользуйтесь ссылками:
    http://d6355:8440/monitor/integration - для отображения интеграционных проблем
    http://d6355:8440/monitor/cards - топ проблем по картам
    http://d6355:8440/monitor/errors - топ ошибок по заявкам
    http://d6355:8440/monitor/hang - топ зависаний
    </h2>`)
        dateTime.getCurrentDateTime()
        // console.log(`Server: Monitoring data has been send:`+'\n')
        console.log(`Server: Listening on ${port}:`+'\n')


})


app.get('/monitor/integration', (req, res) => {


    const ip1 = req.connection.remoteAddress;
    const ip2 = req.header('x-forwarded-for') 

    dateTime.getCurrentDateTime()
    console.log(`Server: Request monitor integration has been received:`+'\n')
    console.log(req.headers);
    dateTime.getCurrentDateTime()
    console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}`+'\n')


    rp.getMonitoringData('integration').then((montarr) => { 





                var montl = []
  


                montarr.forEach( (el, i, array) => {
    
                    montl[i] = JSON.parse(array[i]); 
                    return montl
            
                        })
        
        
                        montl.forEach( (el, i, array) => {

                            array[i].interaction_ts = new Date (array[i].interaction_ts)
                            array[i].interaction_ts.addHours(3);
                            array[i].interaction_ts = array[i].interaction_ts.toISOString().replace('T', ' ').replace('Z', '');
                
                            })


                res.render('Monitor_dashboard', {data: montl, data2: [], data3: [], data4: []});

                dateTime.getCurrentDateTime()
                console.log(`Server: Data collection is done:`+'\n')

                dateTime.getCurrentDateTime()
                console.log(`Server: Listening:`+'\n')

    }).catch((err) => {throw err;})





})



app.get('/monitor/cards', (req, res) => {


    const ip1 = req.connection.remoteAddress;
    const ip2 = req.header('x-forwarded-for') 

    dateTime.getCurrentDateTime()
    console.log(`Server: Request monitor cards has been received:`+'\n')
    console.log(req.headers);
    dateTime.getCurrentDateTime()
    console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}`+'\n')


    rp.getMonitoringData('CC_fails').then((montarr2) => {  //1st





                var montl2 = []
  


                montarr2.forEach( (el, i, array) => {
    
                    montl2[i] = JSON.parse(array[i]); 
                    return montl2
            
                        })
        
        
                        montl2.forEach( (el, i, array) => {

                            array[i].start_time_ = new Date (array[i].start_time_)
                            array[i].start_time_.addHours(3);
                            array[i].start_time_ = array[i].start_time_.toISOString().replace('T', ' ').replace('Z', '');
                
                            })


                res.render('Monitor_dashboard', {data2: montl2, data: [], data3: [], data4: []});


                dateTime.getCurrentDateTime()
                console.log(`Server: Data collection is done:`+'\n')

                dateTime.getCurrentDateTime()
                console.log(`Server: Listening:`+'\n')


    }).catch((err) => {throw err;})





})


app.get('/monitor/errors', (req, res) => {


    const ip1 = req.connection.remoteAddress;
    const ip2 = req.header('x-forwarded-for') 

    dateTime.getCurrentDateTime()
    console.log(`Server: Request monitor errors has been received:`+'\n')
    console.log(req.headers);
    dateTime.getCurrentDateTime()
    console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}`+'\n')


    rp.getMonitoringData('topErrors').then((montarr3) => {  





                var montl3 = []
  


                montarr3.forEach( (el, i, array) => {
    
                    montl3[i] = JSON.parse(array[i]); 
                    return montl3
            
                        })
        
        
                        montl3.forEach( (el, i, array) => {

                            array[i].start_time_ = new Date (array[i].start_time_)
                            array[i].start_time_.addHours(3);
                            array[i].start_time_ = array[i].start_time_.toISOString().replace('T', ' ').replace('Z', '');
                
                            })


                res.render('Monitor_dashboard', {data3: montl3, data2: [], data: [], data4: []});


                dateTime.getCurrentDateTime()
                console.log(`Server: Data collection is done:`+'\n')

                dateTime.getCurrentDateTime()
                console.log(`Server: Listening:`+'\n')

    }).catch((err) => {throw err;})





})



app.get('/monitor/errors/do', (req, res) => {


    const ip1 = req.connection.remoteAddress;
    const ip2 = req.header('x-forwarded-for') 

    dateTime.getCurrentDateTime()
    console.log(`Server: Request monitor errors for DO has been received:`+'\n')
    console.log(req.headers);
    dateTime.getCurrentDateTime()
    console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}`+'\n')


    rp.getMonitoringData('topErrorsDO').then((montarr3) => {  





                var montl3 = []
  


                montarr3.forEach( (el, i, array) => {
    
                    montl3[i] = JSON.parse(array[i]); 
                    return montl3
            
                        })
        
        
                        montl3.forEach( (el, i, array) => {

                            array[i].start_time_ = new Date (array[i].start_time_)
                            array[i].start_time_.addHours(3);
                            array[i].start_time_ = array[i].start_time_.toISOString().replace('T', ' ').replace('Z', '');
                
                            })


                res.render('Monitor_dashboard', {data3: montl3, data2: [], data: [], data4: []});


                dateTime.getCurrentDateTime()
                console.log(`Server: Data collection is done:`+'\n')

                dateTime.getCurrentDateTime()
                console.log(`Server: Listening:`+'\n')

    }).catch((err) => {throw err;})





})



app.get('/monitor/hang', (req, res) => {


    const ip1 = req.connection.remoteAddress;
    const ip2 = req.header('x-forwarded-for') 

    dateTime.getCurrentDateTime()
    console.log(`Server: Request monitor hang has been received:`+'\n')
    console.log(req.headers);
    dateTime.getCurrentDateTime()
    console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}`+'\n')


    rp.getMonitoringData('topHangings').then((montarr4) => {





                var montl4 = [];
  


                montarr4.forEach( (el, i, array) => {
    
                    montl4[i] = JSON.parse(array[i]); 
                    return montl4
            
                        })
        
        
                        montl4.forEach( (el, i, array) => {

                            array[i].start_time_ = new Date (array[i].start_time_)
                            array[i].start_time_.addHours(3);
                            array[i].start_time_ = array[i].start_time_.toISOString().replace('T', ' ').replace('Z', '');
                
                            })


                
                res.render('Monitor_dashboard', {data3: [], data2: [], data: [], data4: montl4});



                dateTime.getCurrentDateTime()
                console.log(`Server: Data collection is done:`+'\n')

                dateTime.getCurrentDateTime()
                console.log(`Server: Listening:`+'\n')

    }).catch((err) => {throw err;})





})



    

 
  
//OLD RESERVE

/*
    var ip1 = req.headers['x-forwarded-for']
    var ip2 = req.header('x-forwarded-for') || req.connection.remoteAddress

    dateTime.getCurrentDateTime()
    console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}`+'\n')
    console.log(`Server2: Remote host's IP address is: ${req.ip}, ${req.ips}`+'\n')
    dateTime.getCurrentDateTime()
    console.log(`Server: Request for data collection of application has been received:`+'\n')
    console.log(req.headers);
    console.log(+'\n'+`Server: application number is: ${req.params.appnum}`)


   //вызываем промис из подключенного модуля

    rp.externalQueryExecutorP(req.params.appnum).then((arrstr2) => { 

            dateTime.getCurrentDateTime()
            console.log(`Server: Request Processor returned response from externalQueryExecutorP`+'\n')

        rp.getDataApp(req.params.appnum).then((apparr) => {

            dateTime.getCurrentDateTime()
            console.log(`Server: Request Processor returned response from getDataApp`+'\n')
        
        
        dateTime.getCurrentDateTime()
        console.log(`Server: Response of externalQueryExecutorP is ${arrstr2} `+'\n')
        dateTime.getCurrentDateTime()
        console.log(`Server: Response of getDataApp is ${apparr} `+'\n')
        let jarr = [];
        let jarr2 = [];

        arrstr2.forEach( (el, i, array) => {

        jarr[i] = JSON.parse(arrstr2[i]); 
        return jarr

            })

        apparr.forEach( (el, i, array) => {

        jarr2[i] = JSON.parse(array[i]); 
        return jarr2
        
        })

    //если нет записей по заявке в БД Camunda_db

    if (jarr.length == 0) {

        res.render('Application_data_without_process', {appnum: req.params.appnum, appid: jarr2[jarr2.length-1].application_id, channel: jarr2[jarr2.length-1].sale_channel_name, status: jarr2[jarr2.length-1].appstatus_name, appcreationdate: jarr2[jarr2.length-1].creation_date, method: jarr2[jarr2.length-1].method, credittype: jarr2[jarr2.length-1].credit_type_name}) 
        dateTime.getCurrentDateTime()
        console.log(`Server: Warning! Asked process is completed`+'\n')
        console.log(`Server: listening...`+'\n')

        }

        //если процесс по заявке есть, но нет записей в searchstoreservice
       else if (jarr2.length == 0 && jarr.length !== 0) {

            let urifull = `https://bpm.prod.ttl.tnt.fakeorg.ru/app/cockpit/default/#/process-instance/${jarr[jarr.length-1].proc_inst_id_}`
            let errortext = jarr[jarr.length-1].Error + ' ' + jarr[jarr.length-1].bError + ' ' + jarr[jarr.length-1].mError
            //res.render('Application_data_without_search', {link: urifull, appnum: req.params.appnum, scheme_name: jarr[jarr.length-1].proc_def_key_, version: jarr[jarr.length-1].ver, task_name: jarr[jarr.length-1].act_name_, task_type: jarr[jarr.length-1].act_type_, create_date: jarr[jarr.length-1].start_time_, task_state: jarr[jarr.length-1].act_inst_state_, execID: jarr[jarr.length-1].execution_id_, state_time: jarr[jarr.length-1].start_time_, error: errortext})
            res.render('Application_data_without_search', {link: urifull, obj: jarr})
            dateTime.getCurrentDateTime()
            console.log(`Server: Warning! Asked app data is empty`+'\n')
            console.log(`Server: listening...`+'\n')
    
            }

    else {

        //let jarrjs = JSON.parse(jarr);
        //let jsonres = JSON.parse(arrstr2);

        let k1 = [];
        k1 = Object.keys(jarr[0])
        let k2 = [];
        k2 = Object.keys(jarr2[0])

        console.log(`Server: Keys 1 is ${k1}`+'\n')
        console.log(`Server: Keys 2 is ${k2}`+'\n')

        let errortext = jarr[jarr.length-1].Error + ' ' + jarr[jarr.length-1].bError + ' ' + jarr[jarr.length-1].mError
        console.log(`Server: Errortext is ${errortext}`+'\n')
        let urifull = `https://bpm.prod.ttl.tnt.fakeorg.ru/app/cockpit/default/#/process-instance/${jarr[jarr.length-1].proc_inst_id_}`
    
        //console.log(`keys is ${keysobj}`+'\n')
        
        console.log(`Server: Scheme_name is ${jarr[jarr.length-1].proc_def_key_}`+'\n')
        console.log(`Server: Actual state is ${jarr[jarr.length-1].act_inst_state_}`+'\n')
        console.log(`Server: Actual task is ${jarr[jarr.length-1].act_name_}`+'\n')
        res.render('Application_data_full', {link: urifull, appnum: req.params.appnum, scheme_name: jarr[jarr.length-1].proc_def_key_, version: jarr[jarr.length-1].ver, task_name: jarr[jarr.length-1].act_name_, task_type: jarr[jarr.length-1].act_type_, create_date: jarr[jarr.length-1].start_time_, task_state: jarr[jarr.length-1].act_inst_state_, execID: jarr[jarr.length-1].execution_id_, state_time: jarr[jarr.length-1].start_time_, error: errortext, appid: jarr2[jarr2.length-1].application_id, channel: jarr2[jarr2.length-1].sale_channel_name, status: jarr2[jarr2.length-1].appstatus_name, appcreationdate: jarr2[jarr2.length-1].creation_date, method: jarr2[jarr2.length-1].method, credittype: jarr2[jarr2.length-1].credit_type_name})
        dateTime.getCurrentDateTime()
        console.log(`Server: Request getfullinfo for application ${req.params.appnum} and for remote host ${req.ips}, ${ip2}successfully processed`+'\n')
        console.log(`Server: Continue to litening...`+'\n')
    }
        
       }).catch((err) => {throw err;})


    }).catch((err) => {throw err;})
    
    })
*/

//SUPPORT//////////////////


    app.get('/support/:appnum', (req, res) => {


        if (req.params.appnum.length !== 10 || req.params.appnum===undefined || req.params.appnum===null || isNaN(req.params.appnum)) {

        var ip = req.headers['x-forwarded-for']
        dateTime.getCurrentDateTime()
        console.log(`Server: Request for wrong application name:`+'\n')
        console.log(`Checking first length condition: ${req.params.appnum.length !== 10}`)
        console.log(`Checking second undefined condition: ${req.params.appnum===undefined}`)
        console.log(`Checking third null condition: ${req.params.appnum===null}`)
        console.log(`Checking fourth isNaN condition: ${isNaN(req.params.appnum)}`)
        console.log(req.headers);
        res.send(`<h2>Ошибка в номере заявки ${req.params.appnum}! Введите корректный номер!</h2>`)
        console.log(`Server: Continue to litening on port: ${port}...`+'\n')

        }

        else { 

        dateTime.getCurrentDateTime()
        console.log(`Checking first length condition: ${req.params.appnum.length !== 10}`)
        console.log(`Checking second undefined condition: ${req.params.appnum===undefined}`)
        console.log(`Checking third null condition: ${req.params.appnum===null}`)
        console.log(`Checking fourth isNaN condition: ${isNaN(req.params.appnum)}`)

        //проверка необходимости подключения к БД
/*
        if (isConnectionMade == false) 
        
        { 
            console.log(`Server: Connection is needed`+'\n');
            rp.connectionExec(); 
            isConnectionMade = true; 
        }

        else if (isConnectionMade == true)   {
        
        console.log(`Server: Connection is NOT needed`+'\n');

        }
*/
        var ip1 = req.connection.remoteAddress;
        var ip2 = req.header('x-forwarded-for') || req.connection.remoteAddress
        if (req.params.appnum == 'bootstrap.css') { res.sendFile(__dirname + '/public/bootstrap.css');}
        dateTime.getCurrentDateTime()
        console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}`+'\n')
        console.log(`Server: Remote host's IP address is: ${req.ip}, ${req.ips}`+'\n')
        dateTime.getCurrentDateTime()
        console.log(`Server: Request for data collection of application has been received:`+'\n')
        console.log(req.headers + '\n');
        console.log(`Server: application number is: ${req.params.appnum}`+'\n')
        console.log(`Server: Sending request to the Request Processor: ${req.params.appnum}`+'\n')

       //вызываем промис из подключенного модуля
    
        rp.externalQueryExecutorP(req.params.appnum, 'processid').then((prArr) => { 
    
                dateTime.getCurrentDateTime()
                console.log(`Server: Request Processor returned response from externalQueryExecutorP for processid and data is ${prArr}`+'\n')

                let jarrt =[]
                let processid = ''

                prArr.forEach( (el, i, array) => {
    
                    jarrt[i] = JSON.parse(array[i]); 

                    if (i == array.length-1) {
                    return jarrt
                    }
                        })




                if (jarrt.length == 0) {

                    dateTime.getCurrentDateTime()
                    console.log(`Server: Warning! Active process instance is empty!`+'\n')
                    processid = null

                } else if (jarrt.length > 1) {

                    dateTime.getCurrentDateTime()
                    console.log(`Server: Warning! PROCESS FOR APPLICATION IS DUPLICATED!`+'\n')
                    return res.send(`<div class="alert alert-danger" role="alert" id=processoff>
                    <font size="5">По заявке ${req.params.appnum} процесс задублирован!</font></div>
                    <h1>${prArr}</h1>`)

                }
                
                else {

                    dateTime.getCurrentDateTime()
                    console.log(`Server: Active process instance id ${jarrt[0].proc_inst_id_}`+'\n')
                    processid = jarrt[0].proc_inst_id_

                }
                

                //arrstr2 old
         rp.externalQueryExecutorP(processid, 'tasks').then((tskArr) => { 
    
            dateTime.getCurrentDateTime()
            console.log(`Server: Request Processor returned response from externalQueryExecutorP for tasks`+'\n')

    
            rp.getDataApp(req.params.appnum, 'search').then((apparr) => {

                if (apparr.length == 0) {

                    dateTime.getCurrentDateTime()
                    console.log(`Server: WARNING! There is no Data is searchstoreservice for application ${req.params.appnum}`+'\n')
                    return res.send(`<h1>Нет данных по заявке ${req.params.appnum} в сервисе поиска просьба повторить операцию для другой заявки</h1>`)

                }
    
                dateTime.getCurrentDateTime()
                console.log(`Server: Request Processor returned response from getDataApp`+'\n')

                dateTime.getCurrentDateTime()
                console.log(`Server: Starting to detect the route for application for collection parameters`+'\n')

               //парсинг данных для разбора маршрута

                var test = []
                apparr.forEach( (el, i, array) => {
    
                    test[i] = JSON.parse(array[i]); 
                    if (i == array.length-1) {
                        return test
                        }
                    
                    })
                    

           //определение маршрута сбора данных в зависимости от типа заявки


                var route = '';
                var route2= '';
                var route3= '';


                if (test[0].credit_type_name == 'Потребительское кредитование') {
                    dateTime.getCurrentDateTime()
                    console.log(`Server: Route detected as for ${test[0].credit_type_name}`+'\n')
                    route = 'potreb'  //out
                    route2 = 'potrebakk'  //out2
                    route3 = 'potrebrefin' //out3
                }
                    
                 else if (test[0].credit_type_name == 'Кредитование с использованием банковских карт') {
                    dateTime.getCurrentDateTime()
                    console.log(`Server: Route detected as for ${test[0].credit_type_name}`+'\n')
                    route = 'cc'
                    route2 = 'kard_akk'  //out2
                    route3 = 'Ignore'
                
                }

                    
                    else if (test[0].credit_type_name == 'Ипотечное кредитование') {
                        dateTime.getCurrentDateTime()
                        console.log(`Server: Route detected as for ${test[0].credit_type_name}`+'\n')
                        route = 'ipoteka'  //out
                        route2 = 'ipoteka_participant' //out2
                        route3 = 'ipoteka_akk' //out3
                    }

                    else if (test[0].credit_type_name == 'Автокредитование') {

                        dateTime.getCurrentDateTime()
                        console.log(`Server: Route detected as for ${test[0].credit_type_name}`+'\n')
                        route = 'auto'  //out
                        route2 = 'autoakk' //out2
                        route3 = 'vehicle' //out3
                        //console.log(`Server: Warning! credit_type_name is ${test[0].credit_type_name}`+'\n')
                        //res.send(`<h2>Внимание! Маршрут по заявке ${req.params.appnum} определен для направления ${test[0].credit_type_name}. Маршрут по данному направлению находится в стадии разработки</h2>`)
                    }

                
                    else if (test[0].credit_type_name === undefined || test[0].credit_type_name === null) {

                        res.send(`Ошибка! Не определен маршрут для сбора данных по заявке ${req.params.appnum}. Попробуйте позднее или по другому номеру заявки`)
                    }
                
//////////////////////////////
        
  if (route !== '' && route !== undefined && route !== null) {


    dateTime.getCurrentDateTime()
    console.log(`Server: Calling for getParemetersData for the ${route}`+'\n')

                rp.getParemetersData(req.params.appnum, route).then((out) => {

                    rp.getParemetersData(req.params.appnum,route2).then((out2) => {

                        rp.getParemetersData(req.params.appnum,route3).then((out3) => {
                    

                    dateTime.getCurrentDateTime()
                    console.log(`Server: Request Processor returned response from getParemetersData for ${route}`+'\n')

//Интеграционные логи

                    dateTime.getCurrentDateTime()
                    console.log(`Server: Starting to collect integration data for application ${req.params.appnum}`+'\n')
                   

                
                        rp.getIntegrationsLog(req.params.appnum).then ( function (intarr) {

                            rp.getDataApp(req.params.appnum, 'statusview').then((appstatusarr) => {

                                rp.getDataApp(req.params.appnum, 'event').then((eventarr) => {


                                   // rp.getParemetersData(req.params.appnum, 'potrebakk').then((outakk) => {

                                    //    rp.getParemetersData(req.params.appnum, 'potrebrefin').then((outrefin) => {
            
            dateTime.getCurrentDateTime()
            console.log(`Server: All requests have been processed`+'\n')                                
            dateTime.getCurrentDateTime()
            console.log(`Server: Response of externalQueryExecutorP for argument tasks is` +'\n'+`${tskArr}`+'\n')
            dateTime.getCurrentDateTime()
            console.log(`Server: Response of getDataApp has been received`+'\n')
            dateTime.getCurrentDateTime()
            console.log(`Server: Response of getParemetersData is` +'\n'+`${out}`+'\n')
            dateTime.getCurrentDateTime()
            console.log(`Server: Response of clientIntegrationLog has been received`+'\n')
            dateTime.getCurrentDateTime()
            console.log(`Server: Response for ${route2} data has been received and is: ${out2}`+'\n')
            dateTime.getCurrentDateTime()
            console.log(`Server: Response for ${route3} data has been received and is: ${out3}`+'\n')

            let jarr = [];
            let jarr2 = [];
            let jarr3 = [];
            let integrationarrayStr = [];
            let integrationarrayjson = [];
            let statarr = [];
            let evarr = [];
            let out2arr = []
            let out3arr = []
            let out3arrv = []
                //парсинг данных из searchstoreservice
                apparr.forEach( (el, i, array) => {
    
                    jarr2[i] = JSON.parse(array[i]); 
                    if (i == array.length-1) {
                        return jarr2
                        }
            
                        })

            //potreball kard_akk
            if (out2.length !== 0) { 

                dateTime.getCurrentDateTime()
                console.log(`Server: ${route2} data is NOT empty`+'\n')
                out2.forEach( (el, i, array) => {
        
                    out2arr[i] = JSON.parse(array[i]); 
                    if (i == array.length-1) {
                        return out2arr
                        }
                        })
                        if (out3.length !== 0 && out3[0] !== 'Ignore' && route3 !== 'vehicle') { 

                            dateTime.getCurrentDateTime()
                            console.log(`Server:  ${route3} data is NOT empty`+'\n')

                            out3.forEach( (el, i, array) => {
                    
                                out3arr[i] = JSON.parse(array[i]); 
                                if (i == array.length-1) {
                                    return out3arr
                                    }  
                                    })
                                }

                                if (out3.length !== 0 && route3 === 'vehicle') { 

                                    dateTime.getCurrentDateTime()
                                    console.log(`Server:  ${route3} data is NOT empty`+'\n')
        
                                    out3.forEach( (el, i, array) => {
                            
                                        out3arrv[i] = JSON.parse(array[i]); 
                                        if (i == array.length-1) {
                                            return out3arrv
                                            }  
                                            })
                                        }


             //ipoteka_akk

            if (out3.length !== 0 && route3 !== 'potrebrefin') {

                out3arr.forEach( (el, i, array) => {

                    if (array[i].card_expiration_date !== null) {

                        //console.log(`Server: array[${i}].card_expiration_date is ${array[i].card_expiration_date}`+'\n')
                        // array[i].card_expiration_date = new Date (array[i].card_expiration_date)
                        // array[i].card_expiration_date = array[i].card_expiration_date.split('T')
                        // array[i].card_expiration_date = array[i].card_expiration_date[0]
                        // array[i].card_expiration_date.setDate(array[i].card_expiration_date.getDate()+1)
                        // array[i].card_expiration_date = array[i].card_expiration_date.toISOString().replace('T', ' ').replace('Z', '').split(' ');
                        // array[i].card_expiration_date = array[i].card_expiration_date[0]
                        array[i].card_expiration_date = new Date (array[i].card_expiration_date)
                        array[i].card_expiration_date.addHours(3);
                        array[i].card_expiration_date = array[i].card_expiration_date.toISOString().replace('T', ' ').replace('Z', '');

                    }
                })
            }
                    }
                        else {

                            dateTime.getCurrentDateTime()
                            console.log(`Server: ${route3} Ignore event`+'\n')
                        }

        if (intarr.length !== 0) { 

            dateTime.getCurrentDateTime()
            console.log(`Server: Integration log is NOT empty`+'\n')
            //преобразование времени для интеграционных логов
            var int_local_time = []
            var stat_local_time = []
            var stat_end_local_time = []

            intarr.forEach( (el, i, array) => {
    
                integrationarrayjson[i] = JSON.parse(array[i]); 
                if (i == array.length-1) {
                    return integrationarrayjson
                    } 
                    })

                    integrationarrayjson.forEach( (el, i, array) => {

                        int_local_time[i] = new Date (array[i].interaction_ts)
                        int_local_time[i].addHours(3);
                        array[i].interaction_ts = int_local_time[i].toISOString().replace('T', ' ').replace('Z', '');
                       // array[i].interaction_ts = array[i].interaction_ts.toString().replace('T', ' ').replace('Z', '');
                    })
                }

                if (appstatusarr.length !== 0) { 

                    dateTime.getCurrentDateTime()
                    console.log(`Server: Integration log is NOT empty`+'\n')
        
                    appstatusarr.forEach( (el, i, array) => {
            
                        statarr[i] = JSON.parse(array[i]); 
                        if (i == array.length-1) {
                            return statarr
                            }
                
                            })
        
                         //преобразование формата даты и времени

                            statarr.forEach( (el, i, array) => {

                                array[i].start_date = new Date (array[i].start_date)
                                array[i].start_date.addHours(3);

                                array[i].start_date = array[i].start_date.toISOString().replace('T', ' ').replace('Z', '');


                                if (array[i].end_date !== null) {

                                array[i].end_date = new Date (array[i].end_date)
                                array[i].end_date.addHours(3);
                                array[i].end_date = array[i].end_date.toISOString().replace('T', ' ').replace('Z', '');
                                }

                            })
                        }

                        if (eventarr.length !== 0) { 

                            dateTime.getCurrentDateTime()
                            console.log(`Server: Events log is NOT empty`+'\n')
                
                            eventarr.forEach( (el, i, array) => {
                    
                                evarr[i] = JSON.parse(array[i]); 
                                if (i == array.length-1) {
                                    return evarr
                                    }                  
                                    })
                                    evarr.forEach( (el, i, array) => {

                                        array[i].event_time = new Date (array[i].event_time)
                                        array[i].event_time.addHours(3);
                                        array[i].event_time = array[i].event_time.toISOString().replace('T', ' ').replace('Z', '');

                                    })

                                }
            

       else { dateTime.getCurrentDateTime()
        console.log(`Server: Integration log is EMPTY`+'\n')}

            //парсинг данных из BPM arrstr2=>tskArr

            if (tskArr.length > 0)  {

            dateTime.getCurrentDateTime()
            console.log(`Server: Starting to parse BPM tasks data`+'\n')

            tskArr.forEach( (el, i, array) => {
    
            jarr[i] = JSON.parse(array[i]); 
            if (i == array.length-1) {
                return jarr
                }
    
                })


                jarr.forEach( (el, i, array) => {

                    array[i].start_time_ = new Date (array[i].start_time_)
                    array[i].start_time_.addHours(3);
                    array[i].start_time_ = array[i].start_time_.toISOString().replace('T', ' ').replace('Z', '');

                    if (array[i].end_time_ !== null) {

                    array[i].end_time_ = new Date (array[i].end_time_)
                    array[i].end_time_.addHours(3);    
                    array[i].end_time_ = array[i].end_time_.toISOString().replace('T', ' ').replace('Z', '');
                    }


                })

            }
                        jarr2.forEach( (el, i, array) => {
                            // array[i].create_date = new Date (array[i].create_date)
                            // array[i].create_date.addHours(3);
                            // array[i].date_status = new Date (array[i].date_status)
                            // array[i].date_status.addHours(3);
                            // array[i].create_date.toISOString().replace('T', ' ').replace('Z', '')
                            // array[i].date_status.toISOString().replace('T', ' ').replace('Z', '')
                            // array[i].create_date = array[i].create_date
                            // array[i].date_status = array[i].date_status
                            array[i].creation_date = new Date (array[i].creation_date)
                            array[i].creation_date.addHours(3);
                            array[i].creation_date = array[i].creation_date.toISOString().replace('T', ' ').replace('Z', '');

                            array[i].date_status = new Date (array[i].date_status)
                            array[i].date_status.addHours(3);   
                            array[i].date_status = array[i].date_status.toISOString().replace('T', ' ').replace('Z', '');
                        })
                        if (jarr2[jarr2.length-1].credit_type_name == 'Потребительское кредитование' || jarr2[jarr2.length-1].credit_type_name == 'Автокредитование') {
                            out2arr.forEach( (el, i, array) => {
                                array[i].acc_open_date = new Date (array[i].acc_open_date)
                                array[i].acc_open_date.addHours(3);
                                array[i].acc_open_date = array[i].acc_open_date.toISOString().replace('T', ' ').replace('Z', '');
                            })
                        }
                        if (jarr2[jarr2.length-1].credit_type_name == 'Кредитование с использованием банковских карт') {
                            out2arr.forEach( (el, i, array) => {
                                array[i].card_expiration_date = new Date (array[i].card_expiration_date)
                                array[i].card_expiration_date.addHours(3);
                                array[i].card_expiration_date = array[i].card_expiration_date.toISOString().replace('T', ' ').replace('Z', '');
                            })
            
                        }

        var isParametersEmpty = true;

         if (out !== undefined || out !== null)

         var params_lt = []
         
         {
             isParametersEmpty = false  
             //парсинг данных параметров заявки           
            out.forEach( (el, i, array) => {
    
                jarr3[i] = JSON.parse(array[i]); 
                if (i == array.length-1) {
                    return jarr3
                    }
                
                })


                jarr3.forEach( (el, i, array) => {

                    if (array[i].date_sign !== null) {


                    //params_lt[i] = new Date (array[i].date_sign)
                    //params_lt[i].split('T')
                    //params_lt[i][0].setDate(params_lt[i][0].getDate()+1)

                    array[i].date_sign = new Date (array[i].date_sign)
                    array[i].date_sign.addHours(3);

                    array[i].date_sign = array[i].date_sign.toISOString().replace('T', ' ').replace('Z', ''); 


                    }


                })




        }

    
        //если нет записей по заявке в БД Camunda_db
    
        if (jarr.length == 0) {

            var linkwp

            if (jarr2[jarr2.length-1].credit_type_name == 'Кредитование с использованием банковских карт')
            {
            linkwp = `https://ui-cc.prod.ttl.tnt.fakeorg.ru/error-processing/${req.params.appnum}/status-journal`
            }
            else if (jarr2[jarr2.length-1].credit_type_name == 'Потребительское кредитование')

            {
                linkwp = `https://ui.prod.ttl.tnt.fakeorg.ru/error-processing/${req.params.appnum}/status-journal`
                }

                else if (jarr2[jarr2.length-1].credit_type_name == 'Автокредитование')

                {
                    linkwp = `https://ui-auto.prod.ttl.tnt.fakeorg.ru/error-processing/${req.params.appnum}/status-journal`
                    }

                else if (jarr2[jarr2.length-1].credit_type_name == 'Ипотечное кредитование')

                {
                    linkwp = `https://ui-mortgage.prod.ttl.tnt.fakeorg.ru/error-processing/${req.params.appnum}/status-journal`
                    }

            if (jarr2[jarr2.length-1].credit_type_name == 'Ипотечное кредитование')      {

        
            let akkflagcard2 = []
            let refinflag = []
            res.render('Application_data_without_process', {appnum: req.params.appnum, appid: jarr2[jarr2.length-1].application_id, channel: jarr2[jarr2.length-1].sale_channel_name, status: jarr2[jarr2.length-1].appstatus_name, appcreationdate: jarr2[jarr2.length-1].creation_date, method: jarr2[jarr2.length-1].method, credittype: jarr2[jarr2.length-1].credit_type_name, obj: jarr, obj2: jarr2, params: jarr3, int: integrationarrayjson, stat: statarr, event: evarr, link: linkwp, akkPIP: out3arr, participant: out2arr, akkcard: akkflagcard2, refin: refinflag})
            dateTime.getCurrentDateTime()
            console.log(`Server: Warning! Asked process for ${req.params.appnum} is completed`+'\n')
            dateTime.getCurrentDateTime()
            console.log(`Server: listening...`+'\n')

            }

            else if (jarr2[jarr2.length-1].credit_type_name == 'Кредитование с использованием банковских карт') {

                let akkPIPflag = []
                let refinflag = []
                res.render('Application_data_without_process', {appnum: req.params.appnum, appid: jarr2[jarr2.length-1].application_id, channel: jarr2[jarr2.length-1].sale_channel_name, status: jarr2[jarr2.length-1].appstatus_name, appcreationdate: jarr2[jarr2.length-1].creation_date, method: jarr2[jarr2.length-1].method, credittype: jarr2[jarr2.length-1].credit_type_name, obj: jarr, obj2: jarr2, params: jarr3, int: integrationarrayjson, stat: statarr, event: evarr, link: linkwp, akkcard: out2arr, akkPIP: akkPIPflag, refin: refinflag})
                dateTime.getCurrentDateTime()
                console.log(`Server: Warning! Asked process for ${req.params.appnum} is completed`+'\n')
                dateTime.getCurrentDateTime()
                console.log(`Server: listening...`+'\n')

            }

            else if (jarr2[jarr2.length-1].credit_type_name == 'Потребительское кредитование') {

                let akkflagcard = []
                res.render('Application_data_without_process', {appnum: req.params.appnum, appid: jarr2[jarr2.length-1].application_id, channel: jarr2[jarr2.length-1].sale_channel_name, status: jarr2[jarr2.length-1].appstatus_name, appcreationdate: jarr2[jarr2.length-1].creation_date, method: jarr2[jarr2.length-1].method, credittype: jarr2[jarr2.length-1].credit_type_name, obj: jarr, obj2: jarr2, params: jarr3, int: integrationarrayjson, stat: statarr, event: evarr, link: linkwp, akkPIP: out2arr, refin: out3arr, akkcard: akkflagcard})
                dateTime.getCurrentDateTime()
                console.log(`Server: Warning! Asked process for ${req.params.appnum} is completed`+'\n')
                dateTime.getCurrentDateTime()
                console.log(`Server: listening...`+'\n')

            }

            else if (jarr2[jarr2.length-1].credit_type_name == 'Автокредитование') {

                let akkflagcard = []
                res.render('Application_data_without_process', {appnum: req.params.appnum, appid: jarr2[jarr2.length-1].application_id, channel: jarr2[jarr2.length-1].sale_channel_name, status: jarr2[jarr2.length-1].appstatus_name, appcreationdate: jarr2[jarr2.length-1].creation_date, method: jarr2[jarr2.length-1].method, credittype: jarr2[jarr2.length-1].credit_type_name, obj: jarr, obj2: jarr2, params: jarr3, int: integrationarrayjson, stat: statarr, event: evarr, link: linkwp, akkPIP: out2arr, refin: out3arr, akkcard: akkflagcard, vehicle: out3arrv})
                dateTime.getCurrentDateTime()
                console.log(`Server: Warning! Asked process for ${req.params.appnum} is completed`+'\n')
                dateTime.getCurrentDateTime()
                console.log(`Server: listening...`+'\n')

            }
    
            }
    
            //если процесс по заявке есть, но нет записей в searchstoreservice
           else if (jarr2.length == 0 && jarr.length !== 0) {
    
                let urifull = `https://bpm.prod.ttl.tnt.fakeorg.ru/app/cockpit/default/#/process-instance/${jarr[jarr.length-1].proc_inst_id_}`
                let errortext = jarr[jarr.length-1].Error + ' ' + jarr[jarr.length-1].bError + ' ' + jarr[jarr.length-1].mError
                res.render('Application_data_without_search', {link: urifull, appnum: req.params.appnum, scheme_name: jarr[jarr.length-1].proc_def_key_, version: jarr[jarr.length-1].ver, task_name: jarr[jarr.length-1].act_name_, task_type: jarr[jarr.length-1].act_type_, create_date: jarr[jarr.length-1].start_time_, task_state: jarr[jarr.length-1].act_inst_state_, execID: jarr[jarr.length-1].execution_id_, state_time: jarr[jarr.length-1].start_time_, error: errortext})
                //res.render('Application_data_without_search', {link: urifull, obj: jarr})
                dateTime.getCurrentDateTime()
                console.log(`Server: Warning! Asked app data is empty`+'\n')
                dateTime.getCurrentDateTime()
                console.log(`Server: Request for ${req.params.appnum} successfully processed but empty`+'\n')
                console.log(`Server: listening...`+'\n')
        
                }
    
        else {
    
            //let jarrjs = JSON.parse(jarr);
            //let jsonres = JSON.parse(arrstr2);
            let k1 = [];
            k1 = Object.keys(jarr[0])
            let k2 = [];
            k2 = Object.keys(jarr2[0])
            //let k3 = [];
            //k3 = Object.keys(jarr3[0])

            console.log(`Server: Keys 1 is ${k1}`+'\n')
            console.log(`Server: Keys 2 is ${k2}`+'\n')
            //console.log(`Server: Keys 3 is ${k3}`+'\n')




            let errortext = jarr[jarr.length-1].Error + ' ' + jarr[jarr.length-1].bError + ' ' + jarr[jarr.length-1].mError
            console.log(`Server: Errortext is ${errortext}`+'\n')
            let urifull = `https://bpm.prod.ttl.tnt.fakeorg.ru/app/cockpit/default/#/process-instance/${jarr[jarr.length-1].proc_inst_id_}`

            //console.log(`keys is ${keysobj}`+'\n')
            
            console.log(`Server: Scheme_name is ${jarr[0].proc_def_key_}`+'\n')
            console.log(`Server: Actual state is ${jarr[0].act_inst_state_}`+'\n')
            console.log(`Server: Actual task is ${jarr[0].act_name_}`+'\n')

            

            if (route == 'potreb') {      

                let linkp = `https://ui.prod.ttl.tnt.fakeorg.ru/credit-request/${req.params.appnum}/photo-album`
                let linterr = `https://ui.prod.ttl.tnt.fakeorg.ru/error-processing/${req.params.appnum}/status-journal`
                res.render('Support_potreb', {link: urifull, link2: linkp, linkerr: linterr, appnum: req.params.appnum, error: errortext, obj: jarr, obj2: jarr2, params: jarr3, int: integrationarrayjson, stat: statarr, event: evarr, akk: out2arr, refin: out3arr})

            }

            if (route == 'cc') {     

                let linkcc = `https://ui-cc.prod.ttl.tnt.fakeorg.ru/credit-request/${req.params.appnum}/photo-album`
                let linterrcc = `https://ui-cc.prod.ttl.tnt.fakeorg.ru/error-processing/${req.params.appnum}/status-journal`
                res.render('Support_card', {link: urifull, link2: linkcc, linkerr: linterrcc, appnum: req.params.appnum, error: errortext, obj: jarr, obj2: jarr2, params: jarr3, int: integrationarrayjson, stat: statarr, event: evarr, akk: out2arr})

            }

            if (route == 'ipoteka') {    
               
                let linkalbum = `https://ui-mortgage.prod.ttl.tnt.fakeorg.ru/credit-request/${req.params.appnum}/photo-album`
                let linkstat = `https://ui-mortgage.prod.ttl.tnt.fakeorg.ru/error-processing/${req.params.appnum}/status-journal`
                res.render('Support', {linkCam: urifull,link: linkalbum, link2: linkstat, appnum: req.params.appnum, error: errortext, obj: jarr, obj2: jarr2, params: jarr3, int: integrationarrayjson, stat: statarr, event: evarr, akk: out3arr, participant: out2arr})

            }

            if (route == 'auto') {      

                let linkp = `https://ui-auto.prod.ttl.tnt.fakeorg.ru/credit-request/${req.params.appnum}/photo-album`
                let linterr = `https://ui-auto.prod.ttl.tnt.fakeorg.ru/error-processing/${req.params.appnum}/status-journal`
                res.render('Support_auto', {link: urifull, link2: linkp, linkerr: linterr, appnum: req.params.appnum, error: errortext, obj: jarr, obj2: jarr2, params: jarr3, int: integrationarrayjson, stat: statarr, event: evarr, akk: out2arr, refin: out3arr, vehicle: out3arrv})

            }

            dateTime.getCurrentDateTime()
            console.log(`Server: Request for Support for application ${req.params.appnum} successfully processed for remote host: ${req.ips}, ${ip2}`+'\n')
            console.log(`Server: Continue to listening on: ${port}`+'\n')
        }










   // }).catch((err) => {throw err;}) //refins end


  //  }).catch((err) => {throw err;}) potrebak

    }).catch((err) => {throw err;})

    }).catch((err) => {throw err;})

    }).catch((err) => {throw err;})   //конец resolve getIntegrationsLog
    
     }).catch((err) => {throw err;}) //ipoteka_akk

    }).catch((err) => {throw err;})   //Ipoteka_participant
            
            }).catch((err) => {throw err;})   }           // конец обработки getParemetersData
            


            dateTime.getCurrentDateTime()
            console.log(`Server: Request for Support for application ${req.params.appnum} successfully processed for remote host: ${req.ips}, ${ip2}`+'\n')
            console.log(`Server: Continue to listening on: ${port}`+'\n')



           }).catch((err) => {throw err;})  //конец getDataApp


          }).catch((err) => {throw err;}) //tasks
    

        }).catch((err) => {throw err;}) //processid
        


   
  

        }
    })

  
        


    







//reserve SUPPORT



/*

        app.get('/support1/:appnum', (req, res) => {
    

            var ip1 = req.connection.remoteAddress;
            var ip2 = req.header('x-forwarded-for') || req.connection.remoteAddress
            if (req.params.appnum == 'bootstrap.css') { res.sendFile(__dirname + '/public/bootstrap.css');}
            dateTime.getCurrentDateTime()
            console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}`+'\n')
            console.log(`Server2: Remote host's IP address is: ${req.ip}, ${req.ips}`+'\n')
            dateTime.getCurrentDateTime()
            console.log(`Server: Request for data collection of application has been received:`+'\n')
            console.log(req.headers);
            console.log(+'\n'+`Server: application number is: ${req.params.appnum}`)
        
        
           //вызываем промис из подключенного модуля
        
            rp.externalQueryExecutorP(req.params.appnum).then((arrstr2) => { 
        
                    dateTime.getCurrentDateTime()
                    console.log(`Server: Request Processor returned response from externalQueryExecutorP`+'\n')
        
                rp.getDataApp(req.params.appnum).then((apparr) => {
        
                    dateTime.getCurrentDateTime()
                    console.log(`Server: Request Processor returned response from getDataApp`+'\n')
    
                    dateTime.getCurrentDateTime()
                    console.log(`Server: Starting to detect the route for application for collection parameters`+'\n')
    
                    apparr.forEach( (el, i, array) => {
        
                        jarr2[i] = JSON.parse(array[i]); 
                        return jarr2
                        
                        })
    
               //определение маршрута сбора данных в зависимости от типа заявки
                    var route = '';
    
                    if (jarr2[0].credit_type_name == 'Потребительское кредитование') {
                        dateTime.getCurrentDateTime()
                        console.log(`Server: Route detected as potreb`+'\n')
                        route = 'potreb'}
                        
                    if (jarr2[0].credit_type_name == 'Кредитование с использованием банковских карт') {
                        dateTime.getCurrentDateTime()
                        console.log(`Server: Route detected as credit card`+'\n')
                        route = 'cc'}
    
                        /*
                        if (jarr2[0].credit_type_name == 'Ипотечное кредитование') {
                            dateTime.getCurrentDateTime()
                            console.log(`Server: Route detected as Ipoteka`+'\n')
                            route = 'ipoteka'}
                            */
    /*
                    if (route === null || route == '') {
    
    
    
                    } 
    
                   
                    
    //////////////////////////////
            
    
                    rp.getParemetersData(req.params.appnum, route).then((out) => {
    
                        dateTime.getCurrentDateTime()
                        console.log(`Server: Request Processor returned response from getParemetersData`+'\n')
                
                
                dateTime.getCurrentDateTime()
                console.log(`Server: Response of externalQueryExecutorP is ${arrstr2} `+'\n')
                dateTime.getCurrentDateTime()
                //console.log(`Server: Response of getDataApp is ${apparr} `+'\n')
                dateTime.getCurrentDateTime()
                console.log(`Server: Response of getParemetersData is ${out} `+'\n')
                let jarr = [];
                let jarr2 = [];
                let jarr3 = [];
        
                arrstr2.forEach( (el, i, array) => {
        
                jarr[i] = JSON.parse(arrstr2[i]); 
                return jarr
        
                    })
        
            
    
                out.forEach( (el, i, array) => {
        
                    jarr3[i] = JSON.parse(array[i]); 
                    return jarr2
                    
                    })
        
            //если нет записей по заявке в БД Camunda_db
        
            if (jarr.length == 0) {
        
                res.render('Application_data_without_process', {appnum: req.params.appnum, appid: jarr2[jarr2.length-1].application_id, channel: jarr2[jarr2.length-1].sale_channel_name, status: jarr2[jarr2.length-1].appstatus_name, appcreationdate: jarr2[jarr2.length-1].creation_date, method: jarr2[jarr2.length-1].method, credittype: jarr2[jarr2.length-1].credit_type_name}) 
                dateTime.getCurrentDateTime()
                console.log(`Server: Warning! Asked process for ${req.params.appnum} is completed`+'\n')
                dateTime.getCurrentDateTime()
                console.log(`Server: listening...`+'\n')
        
                }
        
                //если процесс по заявке есть, но нет записей в searchstoreservice
               else if (jarr2.length == 0 && jarr.length !== 0) {
        
                    let urifull = `https://bpm.prod.ttl.tnt.fakeorg.ru/app/cockpit/default/#/process-instance/${jarr[jarr.length-1].proc_inst_id_}`
                    let errortext = jarr[jarr.length-1].Error + ' ' + jarr[jarr.length-1].bError + ' ' + jarr[jarr.length-1].mError
                    res.render('Application_data_without_search', {link: urifull, appnum: req.params.appnum, scheme_name: jarr[jarr.length-1].proc_def_key_, version: jarr[jarr.length-1].ver, task_name: jarr[jarr.length-1].act_name_, task_type: jarr[jarr.length-1].act_type_, create_date: jarr[jarr.length-1].start_time_, task_state: jarr[jarr.length-1].act_inst_state_, execID: jarr[jarr.length-1].execution_id_, state_time: jarr[jarr.length-1].start_time_, error: errortext})
                    //res.render('Application_data_without_search', {link: urifull, obj: jarr})
                    dateTime.getCurrentDateTime()
                    console.log(`Server: Warning! Asked app data is empty`+'\n')
                    dateTime.getCurrentDateTime()
                    console.log(`Server: Request for ${req.params.appnum} successfully processed but empty`+'\n')
                    console.log(`Server: listening...`+'\n')
            
                    }
        
            else {
        
                //let jarrjs = JSON.parse(jarr);
                //let jsonres = JSON.parse(arrstr2);
                let k1 = [];
                k1 = Object.keys(jarr[0])
                let k2 = [];
                k2 = Object.keys(jarr2[0])
                let k3 = [];
                k3 = Object.keys(jarr3[0])
    
                console.log(`Server: Keys 1 is ${k1}`+'\n')
                console.log(`Server: Keys 2 is ${k2}`+'\n')
                console.log(`Server: Keys 3 is ${k3}`+'\n')
    
    
    
    
                let errortext = jarr[jarr.length-1].Error + ' ' + jarr[jarr.length-1].bError + ' ' + jarr[jarr.length-1].mError
                console.log(`Server: Errortext is ${errortext}`+'\n')
                let urifull = `https://bpm.prod.ttl.tnt.fakeorg.ru/app/cockpit/default/#/process-instance/${jarr[jarr.length-1].proc_inst_id_}`
    
                //console.log(`keys is ${keysobj}`+'\n')
                
                console.log(`Server: Scheme_name is ${jarr[jarr.length-1].proc_def_key_}`+'\n')
                console.log(`Server: Actual state is ${jarr[jarr.length-1].act_inst_state_}`+'\n')
                console.log(`Server: Actual task is ${jarr[jarr.length-1].act_name_}`+'\n')
                res.render('Support', {link: urifull, appnum: req.params.appnum, error: errortext, obj: jarr, obj2: jarr2, params: jarr3})
                dateTime.getCurrentDateTime()
                console.log(`Server: Request for Support for application ${req.params.appnum} successfully processed for remote host: ${req.ips}, ${ip2}`+'\n')
                console.log(`Server: Continue to litening...`+'\n')
            }
                
                }).catch((err) => {throw err;})
    
    
               }).catch((err) => {throw err;})
        
        
            }).catch((err) => {throw err;})
            
            })


*/

/*
    async function getData() { 
    var output = await rp.externalQueryExecutor(req.params.appnum);
      return output
    }

    (async function() {
        try {
            var resp = await getData();
            dateTime.getCurrentDateTime()
            console.log(`Server: Response is ${resp}`+'\n')
        }
        catch (err) {
    
            console.log(err);
        }
    })();
   */

    /*
    var output = rp.externalQueryExecutor(req.params.appnum)
    dateTime.getCurrentDateTime()
    console.log(`Server: Response is ${arrstr2}`+'\n')
    res.json(output)
    */
    //var jout = JSON.parse(output);
    //res.render('Application_data', {appnum: req.params.appnum, scheme_name: jout[0].scheme_name})



server.on('request', (req, res) => {
    dateTime.getCurrentDateTime()
    console.log(`: Request method: ${req.method}`+'\n')
    console.log(req.headers);
    console.log(req.url);
    
})


app.listen(port, (err) => {
    if (err) {
        return console.log('Error', err)        
    }    
    
    console.log(`server is listening on ${port}`)
})


