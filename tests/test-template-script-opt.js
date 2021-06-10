
let requestTest = {
  excludeFieldNames: [ "app_name" ],
  excludes: [ "statusviewservice", "testservice", "autoassignservice" ],
  fieldNames: [ "app_name", "logger_name" ],
  fieldValues: [ "cc_contractservice", "ru.gpb.rkk2.integration.sp.Abstract5NTCall" ],
  mainParameters: ['Calling stored procedure returned','','2020-08-18T09:24:04.000Z','2020-08-26T12:24:04.000Z',''],
  operators: ['AND']
}

let requestTest2 = {
  excludeFieldNames: [ "app_name" ],
  excludes: [ "statusviewservice", "testservice", "autoassignservice" ],
  fieldNames: [ "app_name", "thread_name" ],
  fieldValues: [ "123", "TEST" ],
  mainParameters: ['2005033569','','"2020-08-19T13:45:01.000Z','2020-08-19T13:45:02.000Z','11111'],
  operators: ['OR']
}

let requestTest3 = {
  excludeFieldNames: [],
  excludes: [],
  fieldNames: [ "app_name", "thread_name" ],
  fieldValues: [ "123", "TEST" ],
  mainParameters: ['2005033569','','"2020-08-19T13:45:01.000Z','2020-08-19T13:45:02.000Z','11111'],
  operators: ['OR']
}

//makeELKrequestFlexExtendedOpt(requestTest);


const makeELKrequestFlexExtendedOpt = (request = {}) => {


   console.log(`makeELKrequestFlexExtendedOpt: received request for ELK template request generation`+'\n');

  const {
    mainParameters,
    fieldNames,
    fieldValues,
    operators,
    excludeFieldNames,
    excludes
  } = request;  



  let generateParamsTemplate = () => {

    let base = ``;

    if (mainParameters.length > 0) {

      let paramCondition = ``;
     
  
      mainParameters.forEach((param, i) => {
  
        if (param) {

          if (i != 2 && i != 3) {

            if (i == mainParameters.length - 1) {
              paramCondition +=`{
                "match_phrase": {
                "message": "${param}"}
              }`;
              } else {
                paramCondition +=`{
                "match_phrase": {
                "message": "${param}"}
              },`
              }
           };

        } else if (i == mainParameters.length - 1) { 

          if (paramCondition.lastIndexOf(',') != -1) {
            const idx = paramCondition.lastIndexOf(',');
            paramCondition = paramCondition.slice(0, idx);
          } else {
            paramCondition +=``;
          }
            
              // `{
              //   "match_phrase": {
              //   "message": "${params[i-1] ? params[i-1] : params[i-2] ? params[i-2] : params[i-3] ? params[i-3] : 'null'}"}
              // }`;
            

          }
        
      });
  
      if (paramCondition) {

        base = `{
          "bool": {
            "should": [
              ${paramCondition}
            ],
            "minimum_should_match": 1
          }
        },`;

      };
  
    }

    return base;

  };

  let generateTimeRangeTemplate = () => {

    if (mainParameters[2] && mainParameters[3]) {

      if (Date.parse(mainParameters[2]) && Date.parse(mainParameters[3])) {
        return `{
          "range": {
            "@timestamp": {
              "gte": "${mainParameters[2]}",
              "lte": "${mainParameters[3]}",
              "format": "strict_date_optional_time"
            }
          }
        }`;
      } else {


        let now = new Date();
        let start = now.setMinutes(now.getMinutes() - 3);
        let end = now.setMinutes(now.getMinutes() + 1);
        start = new Date(start).toISOString();
        end = new Date(end).toISOString();
  
        return `{
          "range": {
            "@timestamp": {
              "gte": "${start}",
              "lte": "${end}",
              "format": "strict_date_optional_time"
            }
          }
        }`;
        
      }

    } else {

      let now = new Date();
      let start = now.setMinutes(now.getMinutes() - 3);
      let end = now.setMinutes(now.getMinutes() + 1);
      start = new Date(start).toISOString();
      end = new Date(end).toISOString();

      return `{
        "range": {
          "@timestamp": {
            "gte": "${start}",
            "lte": "${end}",
            "format": "strict_date_optional_time"
          }
        }
      }`;

    }



  };


  let generateFildsConditionsTemplate = () => {



    let base = ``;
    let fieldsConditionTemplate = ``;
    let fieldsAndConditionTemplate = ``;
    let isBoolAndOperator = false;

    if (fieldNames.length > 0 && fieldNames.length == fieldValues.length) {

      
        fieldNames.forEach((fieldName, i) => {


          if (fieldName) {

            if (operators[0] != 'AND') {
              if (i == fieldNames.length - 1) {
    
                fieldsConditionTemplate +=`{
                  "match_phrase": {
                  "${fieldName}": "${fieldValues[i]}"}
                }`;
         
                } else {
                    fieldsConditionTemplate +=`{
                    "match_phrase": {
                    "${fieldName}": "${fieldValues[i]}"}
                  },`
                }
            } else {
              isBoolAndOperator = true;
              fieldsAndConditionTemplate += `{"bool": {
                "should": [
                  {
                    "match_phrase": {
                    "${fieldNames[i]}": "${fieldValues[i]}"}
                  }
                ],
                "minimum_should_match": 1
                }
              },`;  
            }
          }
  
        });
      };

    

    if (!isBoolAndOperator) {
      return base = `{
        "bool": {
          "should": [
            ${fieldsConditionTemplate}
          ],
          "minimum_should_match": 1
        }
      },`;
    } else {

      return base = fieldsAndConditionTemplate;

    };


  };


  let generateHeadTemplate = () => {
    return `{
      "version": true,
      "size": 500,
      "sort": [
        {
          "@timestamp": {
            "order": "desc",
            "unmapped_type": "boolean"
          }
        }
      ],
      "aggs": {
        "2": {
          "date_histogram": {
            "field": "@timestamp",
            "fixed_interval": "1s",
            "time_zone": "Europe/Moscow",
            "min_doc_count": 1
          }
        }
      },
      "stored_fields": [
        "*"
      ],
      "script_fields": {},
      "docvalue_fields": [
        {
          "field": "@timestamp",
          "format": "date_time"
        },
        {
          "field": "timestamp",
          "format": "date_time"
        }
      ],
      "_source": {
        "excludes": []
      },
      "query": {
        "bool": {
          "must": [],
          `
  };

  let generateTailTemplate = () => {

    let excludesTemplate = ``;

    if (excludeFieldNames[0] && excludes.length > 0) {
      excludes.forEach((exclude, i) => {

        if (i == excludes.length - 1) {
          excludesTemplate +=`{
            "match_phrase": {
              "${excludeFieldNames[0]}": "${exclude}"
            }
          }`
        } else {
          excludesTemplate +=`{
            "match_phrase": {
              "${excludeFieldNames[0]}": "${exclude}"
            }
          },`
        }
      });
    };


    // {
    //   "match_phrase": {
    //     "app_name": "notificationservice"
    //   }
    // },

    return `],
    "should": [],
    "must_not": [
      ${excludesTemplate}
    ]
  }
}
}`;


  };


  let aggregateMainTemplate = () => {

    let baseMainTemplate = ``


      baseMainTemplate = 
      `${generateHeadTemplate()}
      "filter": [
        {
          "match_all": {}
        },
        ${generateParamsTemplate()}
        ${generateFildsConditionsTemplate()}    
        ${generateTimeRangeTemplate()}
        ${generateTailTemplate()}
      `;
    
    console.log(`makeELKrequestFlexExtended.aggregateMainTemplate: template has been generated: `+'\n');
    return baseMainTemplate;

    };
  

  return aggregateMainTemplate();





};
