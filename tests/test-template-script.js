

let testParams = ['2004671484', '645b1785-a181-4dca-9b71-5e47dcce3ee8', 'e9e89dd3-a909-4fc1-a2e7-cf386110aeb6'];

let testParamsTime = ['2004671484', '645b1785-a181-4dca-9b71-5e47dcce3ee8', '2020-08-12T09:22:15.718Z', '2020-08-12T10:22:16.718Z', 'e9e89dd3-a909-4fc1-a2e7-cf386110aeb6'];

let testFieldNames = ['app_name', 'thread_name']

let testFieldValues = ['cc_contractservice', 'pool-84542-thread-1']

let operators = ['AND', 'OR']

//makeELKrequestFlexExtended(testParamsTime2, testFieldNames, testFieldValues, ['OR', 'AND'])
//JSON.parse(makeELKrequestFlexExtended(testParamsTime, testFieldNames, testFieldValues, ['OR', 'AND']))


const makeELKrequestFlexExtended = (params, fieldNames = [], fieldValues = [], operators = []) => {


  console.log(`makeELKrequestFlexExtended: received request for ELK template request generation`+'\n');



  let generateParamsTemplate = () => {

    let base = ``;

    if (params.length > 0) {

      let paramCondition = ``;

      let hasNotDateParams = false;

      const checkTypeOfParams = () => {

        params.forEach((param, i) => {

          if (param) {

            if (!Date.parse(param)) {

              hasNotDateParams = true;

            } else if (param.split('T')[0].length < 10) {
              hasNotDateParams = true;
            }

            if (i == params.length - 1) {
              hasNotDateParams = hasNotDateParams ? true : false;
            }

          } else if (i == params.length - 1) {
            hasNotDateParams = hasNotDateParams ? true : false;
          }

        });
      }
  
      
          
  
      params.forEach((param, i) => {
  
        if (param) {

          console.log(`makeELKrequestFlexExtended: 1st condition param ? = true, param: ${param}, index: ${i}`+'\n');
  
            if (!Date.parse(param)) {

              console.log(`makeELKrequestFlexExtended: 2st condition !Date.parse(param) ? = true, param: ${param}, index: ${i}`+'\n');

              if (i == params.length - 1) {

                console.log(`makeELKrequestFlexExtended: 3rd condition i == params.length - 1 ? = true, param: ${param}, index: ${i}`+'\n');

                paramCondition +=`{
                  "match_phrase": {
                  "message": "${param}"}
                }`;
        
                } else {
                  console.log(`makeELKrequestFlexExtended: 3rd condition i == params.length - 1 ? = false, param: ${param}, index: ${i}`+'\n');
                  paramCondition +=`{
                  "match_phrase": {
                  "message": "${param}"}
                },`
                }
            } else {
                  if (param.split('T')[0].length < 10) {
                    if (i == params.length - 1) {

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

                   } 
                }
            }  else if (i == params.length - 1) { 

            console.log(`makeELKrequestFlexExtended: 1st condition param ? = false, param: ${param}, index: ${i}`+'\n');

              checkTypeOfParams();

              if (hasNotDateParams) {

                console.log(`makeELKrequestFlexExtended: condition hasNotDateParams ? = true, param: ${param}, index: ${i}`+'\n');
      
              paramCondition +=`{
                "match_phrase": {
                "message": "${params[i-1] ? params[i-1] : params[i-2] ? params[i-2] : params[i-3] ? params[i-3] : 'null'}"}
              }`;
            }

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

      }
  
    }

    return base;

  };

  let generateTimeRangeTemplate = () => {

    if (params[2] && params[3]) {

      if (Date.parse(params[2]) && Date.parse(params[3])) {
        return `{
          "range": {
            "@timestamp": {
              "gte": "${params[2]}",
              "lte": "${params[3]}",
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

      console.log(`makeELKrequestFlexExtended: condition (fieldNames.length > 0 && fieldNames.length == fieldValues.length)
       = true`+'\n');

      if (operators.length == 0) {
              console.log(`makeELKrequestFlexExtended: condition (operators.length ${operators.length} == 0) = true`+'\n');

        fieldNames.forEach((fieldName, i) => {


          if (fieldName) {

            console.log(`makeELKrequestFlexExtended: condition (fieldName ${fieldName}) = true`+'\n');
  
            if (i == fieldNames.length - 1) {

              console.log(`makeELKrequestFlexExtended: condition (i${i} == fieldNames.length${fieldNames.length} - 1) = true`+'\n');
    
              fieldsConditionTemplate +=`{
                "match_phrase": {
                "${fieldName}": "${fieldValues[i]}"}
              }`;
       
              } else {

                console.log(`makeELKrequestFlexExtended: condition (i${i} == fieldNames.length${fieldNames.length} - 1) = false`+'\n');
                fieldsConditionTemplate +=`{
                "match_phrase": {
                "${fieldName}": "${fieldValues[i]}"}
              },`
              }
          }
  
        });

      } else {

        console.log(`makeELKrequestFlexExtended: condition (operators.length ${operators.length} == 0) = false`+'\n');
        operators.forEach((operator, i) => {

          if (operator == 'AND') {

            console.log(`makeELKrequestFlexExtended: condition (operator ${operator} == 'AND') = true`+'\n');

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

          } else {
            console.log(`makeELKrequestFlexExtended: condition (operator ${operator} == 'AND') = false`+'\n');

                if (i == fieldNames.length - 1) {

                  console.log(`makeELKrequestFlexExtended: condition (i ${i} == fieldNames.length ${fieldNames.length} - 1) = true`+'\n');
        
                  fieldsConditionTemplate +=`{
                    "match_phrase": {
                    "${fieldNames[i]}": "${fieldValues[i]}"}
                  }`;
           
                  } else if (operators[i+1] == 'AND'){
                    console.log(`makeELKrequestFlexExtended: condition (operators[i+1] == 'AND') = true`+'\n');
                    fieldsConditionTemplate +=`{
                    "match_phrase": {
                    "${fieldNames[i]}": "${fieldValues[i]}"}
                  }`;
                  } else {
                    console.log(`makeELKrequestFlexExtended: condition (operators[i+1] == 'AND') = false`+'\n');
                    fieldsConditionTemplate +=`{
                    "match_phrase": {
                    "${fieldNames[i]}": "${fieldValues[i]}"}
                  },`;
                  }             
          }

        });



      }

    }

    if (!isBoolAndOperator) {
      console.log(`makeELKrequestFlexExtended: condition (!isBoolAndOperator) = true isBoolAndOperator: ${isBoolAndOperator}`+'\n');
      return base = `{
        "bool": {
          "should": [
            ${fieldsConditionTemplate}
          ],
          "minimum_should_match": 1
        }
      },`;
    } else {

      console.log(`makeELKrequestFlexExtended: condition (!isBoolAndOperator) = false isBoolAndOperator: ${isBoolAndOperator}`+'\n');

      return base = `{
        "bool": {
          "should": [
            ${fieldsConditionTemplate}
          ],
          "minimum_should_match": 1
        }
      },
      ${fieldsAndConditionTemplate}`;
    }



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


    return `],
    "should": [],
    "must_not": [
      {
        "match_phrase": {
          "app_name": "notificationservice"
        }
      },
      {
        "match_phrase": {
          "app_name": "statusviewservice"
        }
      },
      {
        "match_phrase": {
          "app_name": "testservice"
        }
      },
      {
        "match_phrase": {
          "app_name": "autoassignservice"
        }
      }
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
