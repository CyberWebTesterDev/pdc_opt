const dateTime = require('./datetime')
const readline = require('readline')
const request = require('request-promise')
const {Pool} = require('pg')
const openurl = require('openurl')
const sql = require('./configs/sql')
const pcon = require('./configs/poolconfigs')
const con = require('./configs/con')


        const poolCamunda = new Pool(pcon.configCamunda)
        const poolSearch = new Pool(pcon.configSearchstore)
        const poolApplication = new Pool(pcon.configApplication)
        const poolCCapplication = new Pool(pcon.configCCapplication)
        const poolAdministration = new Pool(pcon.configAdministration)
        const poolStatusview = new Pool(pcon.configStatusview)
        const poolMapplication = new Pool(pcon.configMapplication)
        const poolMrealestate = new Pool(pcon.configMrealestate)
        const poolAutoApplication = new Pool(pcon.configAutoApplication)

      connectionExec = () => {

        clientCam.connect( (err) => {if (err) throw err;
        dateTime.getCurrentDateTime()
        console.log('Connection to DB Camunda_db established...\n')
        //c1 = true
      })
      clientApp.connect( (err) => {if (err) throw err;
        dateTime.getCurrentDateTime()
        console.log('Connection to DB searchstoreservice established...\n')
      })
      clientPar.connect( (err) => {if (err) throw err;
        dateTime.getCurrentDateTime()
        console.log('Connection to DB application established...\n')
      })
      clientParCard.connect( (err) => {if (err) throw err;
        dateTime.getCurrentDateTime()
        console.log('Connection to DB cctestservice established...\n')
      })
      clientIntegrationLog.connect( (err) => {if (err) throw err;
        dateTime.getCurrentDateTime()
        console.log('Connection to DB testservice established...\n')
      })
    }

/*
    async function externalQueryExecutor(input){  
        dateTime.getCurrentDateTime()
        console.log(`External request has been received for ${input}`+'\n')
        sqlext.values[0] = input
        sqltest.values[0] = input
        var output = client.query(sqltest, (err, res) => { if (err) throw err;
            let arrstr2 = new Array();
            let extjsonarr = new Array();  
            return arrstr2 = res.rows.forEach( (el, i, array) => 
              {
              arrstr2[i] = JSON.stringify(array[i])
              extjsonarr[i] = JSON.parse(arrstr2[i])
              console.log(arrstr2[i]+'\n')  
              return arrstr2
              }); 
              //console.log(extjsonarr[0].scheme_name); 
          });
       return output
      }
      */

//success Promise
      function externalQueryExecutorP(input, p){

        dateTime.getCurrentDateTime()
        console.log(`Request Processor: External request has been received for ${input} with argument ${p}`+'\n')
        
        
        sql.sqltest.values[0] = input
        return new Promise ((resolve, reject) => {

          if (p === 'processid') {

            sql.sqlext_process.values[0] = input
            poolCamunda.query(sql.sqlext_process, (err, res) => { 
                         
              if (err) {throw err;}
           
              let prArr = new Array();
              res.rows.forEach( (el, i, array) => 
                {
                  prArr[i] = JSON.stringify(array[i])
                  if (i == array.length-1) {
                    return prArr
                    }
                //extjsonarr[i] = JSON.parse(arrstr2[i])
                //console.log(arrstr2[i]+'\n')           
                }); 
                //console.log(extjsonarr[0].scheme_name);
                resolve(prArr)
            });
          }

          if (p === 'tasks') {

          sql.sqlext_tasks.values[0] = input
          poolCamunda.query(sql.sqlext_tasks, (err, res) => { 
            
            
            if (err) {throw err;}
         
            let tskArr = new Array();
            res.rows.forEach( (el, i, array) => 
              {
                tskArr[i] = JSON.stringify(array[i])
                if (i == array.length-1) {
                  return tskArr
                  }
              }); 
              //console.log(extjsonarr[0].scheme_name);
           
              resolve(tskArr)
          });
        }     
        })
       //return output
      }

      function getDataApp (p1, p2) {

        dateTime.getCurrentDateTime()
        console.log(`Request Processor: Received request for getDataApp for ${p2}`+'\n')

  
          var apparr = new Array();
          var appstatusarr = new Array(); 
          var eventarr = new Array(); 
          
          return new Promise ((resolve, reject) => {

            if (p2 == 'statusview') {

            sql.sqlstatus.values[0] = p1;

            poolStatusview.query(sql.sqlstatus, (err, res) => { 
    
              if (err) {throw err;}

              res.rows.forEach( (el, i, array) => 
                
             {
              appstatusarr[i] = JSON.stringify(array[i])
              if (i == array.length-1) {
                return appstatusarr
                }
                               
                });    
              dateTime.getCurrentDateTime()
              console.log(`Request Processor: Data has been collected for ${p2}`+'\n')
              resolve (appstatusarr);    
            })

          } 

          if (p2 == 'search') { 

            sql.sqlapp.values[0] = p1;

            poolSearch.query(sql.sqlapp, (err, res) => { 
    
              if (err) {throw err;}
              res.rows.forEach( (el, i, array) => 
                {
                  apparr[i] = JSON.stringify(array[i])
                  if (i == array.length-1) {
                    return apparr
                    }
                  // dateTime.getCurrentDateTime()
                });      
                resolve(apparr);
            })           
          }

          if (p2 == 'event') { 

            sql.sqlevent.values[0] = p1;
            poolStatusview.query(sql.sqlevent, (err, res) => { 
    
              if (err) {throw err;}

              res.rows.forEach( (el, i, array) => 
                {
                  eventarr[i] = JSON.stringify(array[i])
                  // dateTime.getCurrentDateTime()
                  if (i == array.length-1) {
                    return eventarr
                    }               
                });      
                resolve(eventarr);
            })          
          }  
                }) //конец Promise
              } //конец getDataApp


      //сбор параметров для потреба

                function getParemetersData (p1, p2) {

                  dateTime.getCurrentDateTime()
                  console.log(`Request Processor: processing request for getParemetersData, starting to detect the route`+'\n')
      
                  sql.sqlp.values[0] = p1;
                  sql.sqlpcard.values[0] = p1;
                  sql.sqlapp.values[0] = p1;
                  let out = [];
                  let out2 = [];
                  let out3 = [];
                  let outp = [];
                      
                      return new Promise ((resolve, reject) => {

                        if (p2 == 'potreb') {
                        console.log(`Request Processor: Route detected as ${p2}, starting to process...`+'\n')

                        poolApplication.query(sql.sqlp, (err, res) => { 
                
                          if (err) {throw err;}
                        //  let out = new Array();
                        //  let outp = [];
                          res.rows.forEach( (el, i, array) =>                   
                         {
                              out[i] = JSON.stringify(array[i])
                              if (i == array.length-1) {
                                return out
                                }
                              //out[i] = JSON.parse(array[i])
                              //dateTime.getCurrentDateTime()
                              //console.log('Collected application data is:'+'\n')  дополнительное логирование собранных данных
                            //console.log(apparr[i]+'\n')                                  
                            });                 
                          dateTime.getCurrentDateTime()
                          console.log(`Request Processor: Data has been collected for ${p2}`+'\n')             
                          resolve (out); 
                          //return out
                        })

                        //resolve (out);   //первый success

                      } //resolve (out); //конец ветвления потреба

                      //автокредитование
                      if (p2 == 'auto') {

                        sql.sqlpauto.values[0] = p1
                        dateTime.getCurrentDateTime()
                        console.log(`Request Processor: Route detected as ${p2}, starting to process...`+'\n')

                        poolAutoApplication.query(sql.sqlpauto, (err, res) => { 
                
                          if (err) {throw err;}
                          res.rows.forEach( (el, i, array) =>                   
                         {
                              out[i] = JSON.stringify(array[i])
                              if (i == array.length-1) {
                                return out
                                }
                            
                            });                 
                          dateTime.getCurrentDateTime()
                          console.log(`Request Processor: Data has been collected for ${p2}`+'\n')             
                          resolve (out); 
                        })
                      } 

                      if (p2 == 'autoakk') {

                        sql.sqlautoakk.values[0] = p1
                        dateTime.getCurrentDateTime()
                        console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}`+'\n')

                        poolAutoApplication.query(sql.sqlautoakk, (err, res) => { 
                
                          if (err) {throw err;}
                          res.rows.forEach( (el, i, array) => 
                            
                         {
                          out2[i] = JSON.stringify(array[i])
                          if (i == array.length-1) {
                            return out2
                            }                       
                            });           
                          dateTime.getCurrentDateTime()
                          console.log(`Request Processor: Data has been collected for ${p2}`+'\n')
                          resolve (out2); 
                        })
                      } 

                      if (p2 == 'vehicle') {

                        sql.sqlpautovehicle.values[0] = p1
                        dateTime.getCurrentDateTime()
                        console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}`+'\n')

                        poolAutoApplication.query(sql.sqlpautovehicle, (err, res) => { 
                
                          if (err) {throw err;}
                          res.rows.forEach( (el, i, array) => 
                            
                         {
                          out3[i] = JSON.stringify(array[i])
                          if (i == array.length-1) {
                            return out3
                            }                       
                            });           
                          dateTime.getCurrentDateTime()
                          console.log(`Request Processor: Data has been collected for ${p2}`+'\n')
                          resolve (out3); 
                        })
                      } 


                      if (p2 == 'potrebakk') {

                        sql.sqlpotrebakk.values[0] = p1
                        var outakk = []

                        dateTime.getCurrentDateTime()
                        console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}`+'\n')

                        poolApplication.query(sql.sqlpotrebakk, (err, res) => { 
                
                          if (err) {throw err;}
                          res.rows.forEach( (el, i, array) => 
                            
                         {
                          out2[i] = JSON.stringify(array[i])
                          if (i == array.length-1) {
                            return out2
                            }                       
                            }); 
                          
                          dateTime.getCurrentDateTime()
                          console.log(`Request Processor: Data has been collected for ${p2}`+'\n')
    
                          resolve (out2); 

                        })

                      } 

                      if (p2 == 'potrebrefin') {

                        sql.sqlpotrebrefin.values[0] = p1
                        var outrefin = []

                        dateTime.getCurrentDateTime()
                        console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}`+'\n')

                        poolApplication.query(sql.sqlpotrebrefin, (err, res) => { 
                
                          if (err) {throw err;}

                          res.rows.forEach( (el, i, array) =>            
                         {
                          out3[i] = JSON.stringify(array[i])
                          if (i == array.length-1) {
                            return out3
                            }     
                            });                        
                          dateTime.getCurrentDateTime()
                          console.log(`Request Processor: Data has been collected for ${p2}`+'\n')     
                          resolve (out3); 

                        })
                      } 

                        if (p2 == 'cc') {


                          dateTime.getCurrentDateTime()
                          console.log('Request Processor: Checking if need to connect to application while processing getParemetersData...\n')
                          console.log(`Request Processor: Route detected as ${p2}, starting to process...`+'\n')

                          poolCCapplication.query(sql.sqlpcard, (err, res) => { 
                  
                            if (err) {throw err;}
                        //    let out = new Array();
                         //   let outp = [];
                        res.rows.forEach( (el, i, array) =>   
                            {
                                out[i] = JSON.stringify(array[i])
                                if (i == array.length-1) {
                                  return out
                                  }
                              //console.log('Collected application data is:'+'\n')  дополнительное логирование собранных данных
                              //console.log(apparr[i]+'\n')  
                              }); 
                            dateTime.getCurrentDateTime()
                            console.log(`Request Processor: Data collected for credit card`+'\n')  
                            resolve (out);
                          })

                              //второй success

                        } //конец ветвления кредитной карты

                        if (p2 == 'ipoteka') {

                          sql.sqlipotekaparams.values[0] = p1;
                          dateTime.getCurrentDateTime()
                          console.log(`Request Processor: Ipoteka exception`+'\n')
                          console.log(`Request Processor: Route detected as ${p2}, starting to process...`+'\n')

                         poolMapplication.query(sql.sqlipotekaparams, (err, res) => { 
    
                            if (err) {throw err;}
          
                            res.rows.forEach( (el, i, array) => 
                            {
                                out[i] = JSON.stringify(array[i])
                                if (i == array.length-1) {
                                  return out
                                  }
                              }); 
                              dateTime.getCurrentDateTime()
                              console.log(`Request Processor: Data collected for ipoteka`+'\n')
                              resolve(out);
                              }); 


                                //третий success

                          }  //конец ветвления ипотеки


                          if (p2 == 'ipoteka_participant') {

                            sql.sqlipotekaparticipants.values[0] = p1;
                            var ipoteka_participants = [];
                            dateTime.getCurrentDateTime()
                            console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}`+'\n')
  
                           poolMapplication.query(sql.sqlipotekaparticipants, (err, res) => { 
      
                              if (err) {throw err;}
    
                              res.rows.forEach( (el, i, array) => 
         
                              {
                                out2[i] = JSON.stringify(array[i])
                                if (i == array.length-1) {
                                  return out2
                                  }
                                }); 
                                dateTime.getCurrentDateTime()
                                console.log(`Request Processor: Data collected for ipoteka`+'\n')
                                resolve(out2);
                                }); 
      
  
                            }  //конец ветвления ipoteka_participant


                            if (p2 == 'ipoteka_akk') {

                              sql.sqlipotekakks.values[0] = p1;
                              var ipoteka_akks = [];
                              dateTime.getCurrentDateTime()
                              console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}`+'\n')
  
                             poolMapplication.query(sql.sqlipotekakks, (err, res) => { 
        
                                if (err) {throw err;}

                                res.rows.forEach( (el, i, array) =>                              
                                {
      
                                  out3[i] = JSON.stringify(array[i])
                                  if (i == array.length-1) {
                                    return out3
                                    }            
                                  }); 
    
    
                                  dateTime.getCurrentDateTime()
                                  console.log(`Request Processor: Data collected for ipoteka`+'\n')
                          
                                  resolve(out3);
    
                                  }); 
                   
    
                              }  //конец ветвления ipoteka_akk

                              if (p2 == 'kard_akk') {

                                sql.sqlcardakk.values[0] = p1;
                                var kard_akks = [];

                                dateTime.getCurrentDateTime()
                                console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}`+'\n')

                               poolCCapplication.query(sql.sqlcardakk, (err, res) => { 
          
                                  if (err) {throw err;}           
                                  res.rows.forEach( (el, i, array) => 
        
                                  {      
                                    out2[i] = JSON.stringify(array[i])
                                    if (i == array.length-1) {
                                      return out2
                                      }                   
                                    }); 
                                    dateTime.getCurrentDateTime()
                                    console.log(`Request Processor: Data collected for Credit Card`+'\n')                         
                                    resolve(out2);
                                    }); 

                                }  //конец kard_akk


                                if (p2 == 'Ignore') {
                                  out3 = ['Ignore']
                                  dateTime.getCurrentDateTime()
                                  console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}`+'\n')
                                  resolve(out3);
                                }
 
                        }) //конец Promise
      
                      }  //конец getParemetersData
                            

function getIntegrationsLog (p1){

  dateTime.getCurrentDateTime()
  console.log('Request Processor: Checking if need to connect to testservice while processing getIntegrationsLog...\n')

  dateTime.getCurrentDateTime()
  console.log(`Request Processor: request from server for integration data has been received for ${p1}`+'\n')

  sql.sqladmin.values[0] = p1
        var intarr = []
      return new Promise ((resolve, reject) =>

       poolAdministration.query(sql.sqladmin, (err, res) => {

              if (err) {throw err;}

              res.rows.forEach( (el, i, array) => 
                {

                  intarr[i] = JSON.stringify(array[i])
                  if (i == array.length-1) {
                    return intarr
                    }     
      }); 

      dateTime.getCurrentDateTime()
      console.log(`Request Processor: Integration data has been collected`+'\n')
      resolve(intarr);

  })

      )

}  //конец


function getMonitoringData (p){

  dateTime.getCurrentDateTime()
  console.log(`Request Processor: Received request for ${p} pool data for monitoring`+'\n')

  var montarr = []
  var montarr2 = []
  var montarr3 = []
  var montarr4 = []
  return new Promise ((resolve, reject) => {

  if (p == 'integration') {

  poolAdministration.query(sql.sqlmon, (err, res) => {

         if (err) {throw err;}
         res.rows.forEach( (el, i, array) => 
           {
             montarr[i] = JSON.stringify(array[i])
             if (i == array.length-1) {
              return montarr
              }   
 
 }); 
 dateTime.getCurrentDateTime()
 console.log(`Request Processor: Monitoring data has been collected`+'\n')
 resolve(montarr);
})
}

if (p == 'CC_fails') {

poolCamunda.query(sql.sqlmon2, (err, res) => {

  if (err) {throw err;}
  res.rows.forEach( (el, i, array) => 
  {
    montarr2[i] = JSON.stringify(array[i])
    if (i == array.length-1) {
      return montarr2
      }   
}); 

dateTime.getCurrentDateTime()
console.log(`Request Processor: Monitoring data has been collected`+'\n')
resolve(montarr2);
 })

}

if (p == 'topErrors') {

  poolCamunda.query(sql.sqlmon3, (err, res) => {
    if (err) {throw err;}
    res.rows.forEach( (el, i, array) => 
    {
      montarr3[i] = JSON.stringify(array[i])
      if (i == array.length-1) {
        return montarr3
        }   
  
  }); 
  dateTime.getCurrentDateTime()
  console.log(`Request Processor: Monitoring data has been collected`+'\n')
  resolve(montarr3);
   })
  
}


if (p == 'topErrorsDO') {

  poolCamunda.query(sql.sqlmon3_DO_2, (err, res) => {

    if (err) {throw err;}
    res.rows.forEach( (el, i, array) => 
    {
      montarr3[i] = JSON.stringify(array[i])
      if (i == array.length-1) {
        return montarr3
        } 
  
  }); 
  dateTime.getCurrentDateTime()
  console.log(`Request Processor: Monitoring data has been collected`+'\n')
  resolve(montarr3);
   })
}

if (p == 'topHangings') {

  poolCamunda.query(sql.sqlmon4, (err, res) => {

    if (err) {throw err;}
    res.rows.forEach( (el, i, array) => 
    {
      montarr4[i] = JSON.stringify(array[i])
      if (i == array.length-1) {
        return montarr4
        } 
  }); 
  dateTime.getCurrentDateTime()
  console.log(`Request Processor: Monitoring data has been collected`+'\n')
  resolve(montarr4);
   })
}



})
}


      function externalQueryDataCollectorP(input){
        
        dateTime.getCurrentDateTime()
        console.log(`External request has been received for ${input}`+'\n')

        sqlext.values[0] = input
        sqltest.values[0] = input
        return new Promise ((resolve, reject) => {
          clientCam.query(sqlext, (err, res) => { 
            
            if (err) {throw err;}
         
            let arrstr2 = new Array();
            let extjsonarr = new Array();  
            res.rows.forEach( (el, i, array) => 
              {
              arrstr2[i] = JSON.stringify(array[i])
              extjsonarr[i] = JSON.parse(arrstr2[i])
              //console.log(arrstr2[i]+'\n')  
              
              return arrstr2, extjsonarr
              
              }); 

            

                })


              //console.log(extjsonarr[0].scheme_name);
              resolve(arrstr2)
          });

          
        }
       //return output
    

      
      

      connectionClose = () => {


        /*
        clientCam.end( (err) => {if (err) throw err; 
              dateTime.getCurrentDateTime()
              console.log('Connection to Camunda_db closed...\n')

              connection_state.camunda = 0;
              
    
          })

          clientApp.end( (err) => {if (err) throw err; 
            dateTime.getCurrentDateTime()
            console.log('Connection to DB searchstore closed...\n')
            connection_state.searchstoreservice = 0;
  
        })

        clientPar.end( (err) => {if (err) throw err; 
          dateTime.getCurrentDateTime()
          console.log('Connection to DB application closed...\n')
          connection_state.application = 0;

      })


      clientParCard.end( (err) => {if (err) throw err; 
        dateTime.getCurrentDateTime()
        console.log('Connection to DB cctestservice closed...\n')
        connection_state.cctestservice = 0;
        

    })

    clientIntegrationLog.end( (err) => {if (err) throw err; 
      dateTime.getCurrentDateTime()
      console.log('Connection to DB administationservice has been closed...\n')
      connection_state.testservice = 0;

})
*/

poolCamunda.end(() => {
  dateTime.getCurrentDateTime()
  console.log('poolCamunda has ended')

})

poolSearch.end(() => {
  dateTime.getCurrentDateTime()
  console.log('poolSearch has ended')

})

poolApplication.end(() => {
  dateTime.getCurrentDateTime()
  console.log('poolApplication has ended')

})

poolCCapplication.end(() => {
  dateTime.getCurrentDateTime()
  console.log('poolCCapplication has ended')

})

poolAdministration.end(() => {
  dateTime.getCurrentDateTime()
  console.log('poolAdministration has ended')

})

poolStatusview.end(() => {
  dateTime.getCurrentDateTime()
  console.log('poolStatusview has ended')

})

         }


//отслеживание статуса коннектов к БД


        con.clientCam.on('error', err => {

          dateTime.getCurrentDateTime()
          console.error('Connection to Camunda_db was failed', err.stack)
          connection_state.camunda = 0;

          if (err.code == 'ECONNRESET') {
           clientCam.connect( (err) => {if (err) throw err;
            dateTime.getCurrentDateTime()
            console.log('Reconnection to DB Camunda_db established...\n')

           })
        
        }
        
      })
        
      con.clientPar.on('error', err => {
          
          connection_state.application = 0;
          dateTime.getCurrentDateTime()
          console.error('Connection to application DB was failed', err.stack)

          if (err.code == 'ECONNRESET') {
            clientPar.connect( (err) => {if (err) throw err;
             dateTime.getCurrentDateTime()
             console.log('Reconnection to application DB established...\n')
 
            })
         
         }
         
       })
        
       con.clientParCard.on('error', err => {
        
          connection_state.cctestservice = 0;
          dateTime.getCurrentDateTime()
          console.error('Connection to cctestservice DB was failed', err.stack)
        
          if (err.code == 'ECONNRESET') {
            clientPar.connect( (err) => {if (err) throw err;
             dateTime.getCurrentDateTime()
             console.log('Reconnection to cctestservice DB established...\n')
 
            })
         
         }
         
       })
        
        
       con.clientApp.on('error', err => {
        
          connection_state.searchstoreservice = 0;
          dateTime.getCurrentDateTime()
          console.error('Connection to searchstoreservice DB was failed', err.stack)
        
          if (err.code == 'ECONNRESET') {
            clientPar.connect( (err) => {if (err) throw err;
             dateTime.getCurrentDateTime()
             console.log('Reconnection to searchstoreservice DB established...\n')
 
            })
         
         }
         
       })

       con.clientIntegrationLog.on('error', err => {
        
        connection_state.testservice = 0;
        dateTime.getCurrentDateTime()
        console.error('Connection to testservice DB was failed', err.stack)
      
        if (err.code == 'ECONNRESET') {
          clientPar.connect( (err) => {if (err) throw err;
           dateTime.getCurrentDateTime()
           console.log('Reconnection to testservice DB established...\n')

          })
       
       }
       
     })




     con.clientCam.on('notice', msg => {

          dateTime.getCurrentDateTime();
          console.warn('Notice for connection Camunda_db', msg)
        
        })
        
        con.clientPar.on('notice', msg => {

          dateTime.getCurrentDateTime();
          console.warn('Notice for application DB', msg)
        
        })
        
        con.clientParCard.on('notice', msg => {
        
          dateTime.getCurrentDateTime();
          console.error('Notice for cctestservice DB', msg)
        
        })
        
        
        con.clientApp.on('notice', err => {
        
          console.error('Notice for searchstoreservice DB', msg)
        
        })









    exports.connectionClose = connectionClose;
    exports.connectionExec = connectionExec;
    //exports.sqlext = sqltest;
    exports.externalQueryExecutorP = externalQueryExecutorP;
    exports.getDataApp = getDataApp;
    exports.getParemetersData = getParemetersData;
    //exports.clientIntegrationLog = clientIntegrationLog;
    //exports.sqladmin = sqladmin;
    exports.getIntegrationsLog = getIntegrationsLog;
    exports.getMonitoringData = getMonitoringData;
