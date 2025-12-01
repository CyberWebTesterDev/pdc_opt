exports.processLogsData = (elkPayload) => {
  if (elkPayload) {
    //console.log(JSON.parse(elkPayload).hits['total']+'\n');
    let total = JSON.parse(elkPayload).hits['total'];

    //console.log(`processLogsData: total: `+'\n');
    //console.log(total);

    if (total && total.value > 0) {
      let hits = JSON.parse(elkPayload).hits['hits'];

      let sources = [];
      let trimmedSource;

      hits.forEach((source) => {
        for (let key in source._source) {
          if (
            key == 'app_name' ||
            key == 'app_instance' ||
            key == 'level' ||
            key == 'logger_name' ||
            key == 'message' ||
            key == 'thread_name' ||
            key == '@timestamp' ||
            key == 'stack_trace' ||
            key == 'message_size'
          ) {
            trimmedSource = { ...trimmedSource, ...{ [key]: source._source[key] } };
          }
        }

        for (let key in source) {
          if (key == '_id' || key == '_index') {
            trimmedSource = { ...trimmedSource, ...{ [key]: source[key] } };
          }
        }

        sources.push(trimmedSource);
      });

      // console.log(`First source: `);
      // console.log(sources[0]);

      return sources;
    } else {return [];}
  } else {return [];}
};

exports.processLogsDataOpt = (elkPayload) => {
  const ALLOWED_SOURCE_KEYS = new Set([
    'app_name',
    'app_instance',
    'level',
    'logger_name',
    'message',
    'thread_name',
    '@timestamp',
    'stack_trace',
    'message_size',
  ]);

  const ALLOWED_HIT_KEYS = new Set(['_id', '_index']);

  if (!elkPayload) {return [];}

  try {
    const parsedData = JSON.parse(elkPayload);
    const total = parsedData.hits.total;

    if (total.value > 0) {
      const hits = parsedData.hits.hits;
      const sources = [];

      hits.forEach((hit) => {
        const trimmedSource = {};

        // Фильтрация полей из _source
        Object.entries(hit._source).forEach(([key, value]) => {
          if (ALLOWED_SOURCE_KEYS.has(key)) {
            trimmedSource[key] = value;
          }
        });

        // Добавление обязательных полей
        Object.entries(hit).forEach(([key, value]) => {
          if (ALLOWED_HIT_KEYS.has(key)) {
            trimmedSource[key] = value;
          }
        });

        sources.push(trimmedSource);
      });

      return sources;
    }

    return [];
  } catch (error) {
    console.error('Ошибка при обработке логов:', error);
    return [];
  }
};
