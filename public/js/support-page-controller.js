class SupportController {
  constructor() {
    this.currentHostName = window.location.href.split('//')[1].split(':')[1];
    this.modalContainer = document.getElementById('modalContainer');
  }

  getCurrentLocalHostName() {
    return this.currentHostName;
  }

  showModal(modalHTML) {
    this.modalContainer.innerHTML = modalHTML;
  }

  closeModal() {
    this.modalContainer.innerHTML = '';
    document.body.style.overflow = 'auto';
  }

  makeLargeModal(label, text) {
    return `<div class="modal-parent dimmer-modal" id="modalElement">
 <div class="modal-large-wide" style="word-wrap: break-word;">
 <span class="modal-label">${label}</span><br>
 <p style="color: white; font-size: 25px;">${text}</p>
 <button class="modal-btn-large" id="btnModal" onclick="SupportController.closeModal()">Закрыть</button>
 </div>
 </div>`;
  }

  makeLargeModalForLogs(label, text) {
    return `<div class="modal-parent dimmer-modal" id="modalElement">
 <div class="modal-xlarge-wide" style="word-wrap: break-word;">
 <span onclick="SupportController.closeModal()" class="close-modal">&#10005;</span>
 <span class="modal-label">${label}</span><br>
 <p style="color: white; font-size: 30px; font-family: courier;">${text}</p>
 </div>
 </div>`;
  }

  callModal(label, text, isTechnical = false) {
    const modalHTML = isTechnical
      ? this.makeLargeModalForLogs(label, text)
      : this.makeLargeModal(label, text);
    this.showModal(modalHTML);
    document.body.style.overflow = 'hidden';
  }

  // Другие методы...
}

class SupportActions {
  prettyXMLText(text) {
    if (!text) {return;}

    const replacements = {
      '&amp': '',
      'gt': '>',
      'lt': '<',
      '#39': '"',
      '#13': '\n',
      '#34': '"',
    };

    return text.split(';').map(part => replacementspart || part).join('');
  }

  putTextInTargetElementId(text, elementId) {
    const idx = elementId.split('_')[0];
    const targetElement = document.getElementById(`${idx}_long`);

    if (targetElement.style.display !== 'none' && targetElement.innerText) {
      //удаляем кнопку форматирования
      const btn = document.getElementById(`${idx}_btn_pretty`);
      btn.parentNode.removeChild(btn);
      targetElement.innerText = this.prettyXMLText(text);
      callPopUp(
        'Процесс выполнения',
        'Форматирование текста завершено',
        3000,
      );
    } else {
      callPopUp(
        'Ошибка',
        'Для форматирования раскройте лог!',
        5000,
        '#511919',
      );
    }
  }

  // Другие методы...
}
// Оптимизированный вариант copyTextToClipboard
const copyTextToClipboard = (eventEmitterNode) => {
  const targetId = SupportActions.searchChildElementsWithContentByInitialElement(eventEmitterNode);
  if (!targetId) {return;}

  const tempContainer = document.createElement('textarea');
  tempContainer.value = document.getElementById(targetId).innerText;
  document.body.appendChild(tempContainer);

  try {
    tempContainer.select();
    const isSuccess = document.execCommand('copy');
    if (isSuccess) {
      SupportController.callPopUp(
        'Текст скопирован в буфер',
        '',
        3000,
        'cyan',
      );
    } else {
      callPopUp(
        'Текст НЕ был скопирован в буфер',
        '',
        3000,
        'cyan',
      );
    }
    document.body.removeChild(tempContainer);
  } catch (e) {
    callPopUp(
      'Возникла ошибка при копировании текста',
      '',
      3000,
      '#511919',
    );
    throw e;
  }
};

// Оптимизированный вариант searchChildElementsWithContent
const searchChildElementsWithContent = (eventEmitterNode) => {
  let elementWithContentId;
  const childNodes = eventEmitterNode.parentNode.childNodes;

  for (const child of childNodes) {
    if (child.tagName === 'P' && child.id) {
      elementWithContentId = child.id;
      break;
    }
  }

  return elementWithContentId;
};

// Оптимизированный вариант showLoaderFlex
const showLoaderFlex = (headText = '', bodyText) => {
  if (bodyText) {
    const spinner = SupportController.makeSpinner(headText, bodyText);
    let tempContainer = document.getElementById('div-temp-spinner');

    if (!tempContainer) {
      tempContainer = document.body.appendChild(document.createElement('div'));
      tempContainer.id = 'div-temp-spinner';
    }

    tempContainer.innerHTML = spinner;
  }
};

// Оптимизированный вариант dateTimeInputValidator
const dateTimeInputValidator = async (
  isFromMain = false,
  isAnalyze = false,
  { fieldNames = [], fieldValues = [], operators = [] } = {},
) => {
  if (document.querySelector('#start').value && document.querySelector('#end').value) {
    try {
      await getELKlogs(
        document.querySelector('#start').value,
        document.querySelector('#end').value,
        document.querySelector('#additional').value,
        document.querySelector('#additional2').value,
        document.querySelector('#additional3').value,
        fieldNames,
        fieldValues,
        operators,
        isFromMain,
        isAnalyze,
      );
    } catch (e) {
      throw e;
    }
  } else {
    SupportController.callPopUp(
      'Ошибка',
      'Необходимо задать период поиска логов!',
      5000,
      '#511919',
    );
  }
};

// Оптимизированный вариант dateTimeInputBlocker
const dateTimeInputBlocker = () => {
  document.querySelector('#getELKlogsWithRange').disabled =
     !document.querySelector('#start').value ||
     !document.querySelector('#end').value;
};

// Оптимизированный вариант markBorderByElementIdWithInterval
const markBorderByElementIdWithInterval = (elementId, color) => {
  const markElement = () => {
    const element = document.getElementById(elementId);
    element.style.borderStyle = 'solid';
    element.style.borderWidth = '5px';
    element.style.borderColor = color;

    setTimeout(() => {
      element.style.borderStyle = 'none';
      element.style.borderWidth = '5px';
    }, 2000);
  };

  const intervalId = setInterval(markElement, 1000);

  setTimeout(() => {
    clearInterval(intervalId);
    document.getElementById(elementId).style.borderStyle = 'none';
    document.getElementById(elementId).style.borderWidth = '5px';
  }, 5000);
};

// Оптимизированный вариант getELKlogsOpt
const getELKlogsOpt = async (
  requestObj = {},
  isAnalyze = false,
  additionalFlag = false,
) => {
  if (!additionalFlag) {
    showLoaderFlex(
      'Запрос в ELK',
      'Получение данных из хранилища логов',
    );
  }

  requestObj = { ...requestObj, isOpt: true, isAdditional: additionalFlag };

  try {
    const response = await fetch(`http://${this.currentHostName}:8440/elksearch`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(requestObj),
    });

    if (response.ok) {
      const result = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(result, 'text/html');

      document.getElementById('elk-block-container').innerHTML =
         doc.getElementById('part-container').innerHTML;

      if (!additionalFlag) {
        SupportController.closeLoaderFlex();
        const counter = document.querySelector('#elkData').rows.length;

        if (!window.location.href.includes('#elkContainer')) {
          window.location.href = window.location + '#elkContainer';
        }

        callPopUp(
          'Загрузка завершена',
           `Всего загружено ${counter > 1 ? counter - 1 : counter} логов`,
           3000,
        );

        await SupportController.loadELKControllerJS();
        synchronizeStateWithDOM();
        aggregateDataCallsCounter = 0;

        if (isAnalyze) {
          setTimeout(() => {
            //SupportController.reloadMainJS();
          }, 1000);
        }
      } else {
        return await response.json();
      }
    } else {
      closeLoaderFlex();
      callPopUp(
        'Ошибка',
         `Сетевая ошибка при получении логов, статус ответа: ${response.status}`,
         10000,
         '#511919',
      );
      aggregateDataCallsCounter = 0;
    }
  } catch (e) {
    closeLoaderFlex();
    callPopUp(
      'Ошибка',
       `Произошла ошибка при получении логов: ${e.message}`,
       10000,
       '#511919',
    );
    aggregateDataCallsCounter = 0;
  }
};

// Оптимизированный вариант getELKlogs
const getELKlogs = async (
  start = 0,
  end = 0,
  additional = null,
  additional2 = null,
  additional3 = null,
  fieldNames = [],
  fieldValues = [],
  operators = [],
  isFromMain = false,
  isAnalyze = false,
) => {
  if (document.getElementById('getELKlogs')) {
    document.getElementById('getELKlogs').removeEventListener('click', getELKlogs);
    document.getElementById('getELKlogs').style.display = 'none';
  }

  showLoaderFlex(
    'Запрос в ELK',
    'Получение данных из хранилища логов',
  );

  let params = document.getElementById('elk-search-params').innerHTML.split(',');

  if (start && end) {
    try {
      start = new Date(start).toISOString();
      end = new Date(end).toISOString();
      params[2] = start;
      params[3] = end;
    } catch (e) {
      closeLoaderFlex();
      callPopUp(
        'Ошибка',
         `При преобразовании даты произошла ошибка: ${e.message}`,
         7000,
         '#511919',
      );
      throw new Error(e);
    }
  }

  if (isFromMain) {
    params[0] = additional || additional2 || additional3;
    params[1] = additional2 || additional || additional3;
    params[4] = additional3 || additional2 || additional;
  } else {
    let removed = [];
    let paramsCopy = params;
    let idx = 0;

    params.forEach((param, i) => {
      if (i > 3) {
        if (params[0] === param) {
          idx === 0 ? (idx = i) : idx;
          removed.push(paramsCopy.splice(i, 1));

          if (idx !== 0) {
            if (params[0] === params[idx]) {
              removed.push(paramsCopy.splice(idx, 1));
            }
          }
        } else {
          idx !== 0 ? (idx = i + 1) : idx;
        }
      }
    });

    params = paramsCopy;

    if (additional) {
      params.push(additional);
    }
    if (additional2) {
      params.push(additional2);
    }
    if (additional3) {
      params.push(additional3);
    }
  }

  const parameters = params.reduce((acc, curr, i) => {
    acc[`parameter${i}`] = curr;
    return acc;
  }, {});

  parameters.fieldNames = fieldNames;
  parameters.fieldValues = fieldValues;
  parameters.operators = operators;
  parameters.isOpt = false;

  try {
    const response = await fetch(`http://${this.currentHostName}:8440/elksearch`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(parameters),
    });

    if (response.ok) {
      const result = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(result, 'text/html');

      document.getElementById('elk-block-container').innerHTML =
         doc.getElementById('part-container').innerHTML;

      closeLoaderFlex();
      const counter = document.querySelector('#elkData').rows.length;

      callPopUp(
        'Загрузка завершена',
         `Всего загружено ${counter > 1 ? counter - 1 : counter} логов`,
         3000,
      );

      await loadELKControllerJS();
      aggregateDataCallsCounter = 0;

      if (!window.location.href.includes('#elkContainer')) {
        window.location.href = window.location + '#elkContainer';
      }

      setTimeout(() => {
        markBorderByElementIdWithInterval(
          'btnMarkSingleThreadLogs',
          'rgb(0, 255, 28)',
        );
      }, 4000);

      if (!isAnalyze) {
        setTimeout(() => {
          //SupportController.reloadMainJS();
        }, 1000);
      }
    } else {
      closeLoaderFlex();
      callPopUp(
        'Ошибка',
         `Сетевая ошибка при получении логов, статус ответа: ${response.status}`,
         7000,
         '#511919',
      );
      aggregateDataCallsCounter = 0;
    }
  } catch (e) {
    closeLoaderFlex();
    callPopUp(
      'Ошибка',
       `Произошла ошибка при получении логов: ${e.message}`,
       7000,
       '#511919',
    );
    aggregateDataCallsCounter = 0;
  }
};

// Оптимизированный вариант retryTaskBPM
const retryTaskBPM = async () => {
  const processInstanceId = 'cec62f6c-dd48-11ea-ae1e-0242ac110002';
  const requestBody = {
    id: processInstanceId,
    modifications: {
      retryTask: { value: true, type: 'Boolean' },
    },
  };

  try {
    const response = await fetch(
      'https://bpm.prod.ttl.tnt.fakeorg.ru/camunda/api/engine/engine/default/execution/${processInstanceId}/localVariables',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json;charset=utf-8',
          Authorization: 'Basic ZGVtbzpnZmxpYnEhMXhmcXlicg==',
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (response.ok) {
      alert('Ретрай заявки выполнен');
    } else {
      alert(`Ответ с ошибкой, статус ответа: ${response.status}`);
    }
  } catch (e) {
    alert(`Произошла ошибка: ${e.message}`);
    console.error(e);
  }
};

// Оптимизированный вариант fillTimeRangeFields
const fillTimeRangeFields = () => {
  const hangStartTime = document.querySelector(
    '#processData > tbody > tr:nth-child(2) > td:nth-child(8)',
  ).innerHTML;

  const startTime = timeOffsetMinutes(
    hangStartTime.split('.')[0].replace(' ', 'T'),
    'decrement',
  ).split('.')[0];

  const endTime = timeOffsetMinutes(
    hangStartTime.split('.')[0].replace(' ', 'T'),
    2,
    'increment',
  ).split('.')[0];

  document.querySelector('#start').value = startTime;
  document.querySelector('#end').value = endTime;

  checkDateFields('start');
  checkDateFields('end');

  document.getElementById('getELKlogsWithRange').disabled = false;
  document.getElementById('getELKlogsWithRange').style.cursor = 'pointer';
};

// Оптимизированный вариант timeOffsetMinutes
const timeOffsetMinutes = (dateTime, minutes, key) => {
  let date = new Date(dateTime);
  date = key === 'increment'
    ? date.setMinutes(date.getMinutes() + minutes)
    : date.setMinutes(date.getMinutes() - minutes);

  console.log(
     `timeOffsetMinutes: ${key} result date: ${new Date(date).toISOString()}`,
  );
  return new Date(date).addHours(3).toISOString();
};

// Оптимизированный вариант timeOffsetMSAuto
const timeOffsetMSAuto = (dateTime, key, ms = '10') => {
  const msParsed = parseInt(ms, 10);
  let date = new Date(dateTime);
  date = key === 'increment'
    ? date.setMilliseconds(date.getMilliseconds() + msParsed)
    : date.setMilliseconds(date.getMilliseconds() - msParsed);

  console.log(
     `timeOffsetMSAuto: ${key} result date: ${new Date(date).toISOString()}`,
  );
  return new Date(date).toISOString();
};

// Оптимизированный вариант modifyDateTimeByLocal
const modifyDateTimeByLocal = (dateTimeStr, key = null) => {
  const date = new Date(dateTimeStr);

  if (key === 'increment') {
    date.setMilliseconds(date.getMilliseconds() + 1);
  } else {
    date.setMilliseconds(date.getMilliseconds() - 1);
  }

  return date.toISOString();
};

// Оптимизированный вариант showInfoPanel
const showInfoPanel = (emitter) => {};

// Оптимизированный вариант handlePopUpPermanent
const handlePopUpPermanent = (
  eventName = null,
  nodeInitiator = null,
  event = null,
  title = '',
  text = '',
) => {
  if (eventName === 'show') {
    const coordX = event.clientX;
    const coordY = event.clientY;
    const targetX = coordX - 350 < 0 ? 0 : coordX - 350;
    const targetY = coordY - 250 < 0 ? 0 : coordY - 250;

    const popUpHTML = makePopUpPermanent(title, text);
    showPopUpPermanent(popUpHTML, targetY, targetX);
  } else {
    closePermanentPopup();
  }
};

// Оптимизированный вариант showPopUpPermanent
const showPopUpPermanent = (popUpHTML, coordY, coordX) => {
  let tempContainer = document.getElementById('div-temp-perm');

  if (!tempContainer) {
    tempContainer = document.body.appendChild(document.createElement('div'));
    tempContainer.id = 'div-temp-perm';
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = `${coordY}px`;
    tempContainer.style.left = `${coordX}px`;
  }

  tempContainer.innerHTML = popUpHTML;
};

// Оптимизированный вариант closePermanentPopup
const closePermanentPopup = () => {
  const tempContainer = document.getElementById('div-temp-perm');
  if (tempContainer) {
    tempContainer.innerHTML = '';
  }
};

// Оптимизированный вариант makePopUpPermanent
const makePopUpPermanent = (title, text) => {
  return `<div class='container-popup-perm' style="background-color: #0c5460;">
    <div class='popup'>
      <p>${title}</p><br>
      <p>${text}</p>
    </div>
  </div>`;
};

// Оптимизированный вариант showLoaderBPM
const showLoaderBPM = (id) => {
  if (id) {
    const loaderHolder = document.getElementById(id);
    loaderHolder.innerHTML = spinnerBPM;
  }
};

// Оптимизированный вариант makeSpinner
const makeSpinner = (text1, text2) => {
  return `<div class="dimmer-bpm-loader">
    <div class='container'>
      <div class='loader-bpm'>
        <font size="5px">Ожидание выполнения: ${text1}...</font><br>
        <font size="3px">${text2}</font>
        <div class='spinner-simple'>
        </div>
      </div>
    </div>
  </div>`;
};
// Оптимизированный вариант closeLoaderFlex
const closeLoaderFlex = () => {
  const tempContainer = document.getElementById('div-temp-spinner');
  if (tempContainer) {
    tempContainer.innerHTML = '';
  }
};

// Оптимизированный вариант showLoader
const showLoader = (placeId, spinnerHTML) => {
  if (placeId && spinnerHTML) {
    const loaderHolder = document.getElementById(placeId);
    loaderHolder.innerHTML = spinnerHTML;
  }
};

// Оптимизированный вариант closeLoader
const closeLoader = (targetId) => {
  if (targetId) {
    const loaderHolder = document.getElementById(targetId);
    loaderHolder.innerHTML = '';
  }
};

// Оптимизированный вариант callPopUp
const callPopUp = (title, text, ms, color = null) => {
  const popUpHTML = SupportController.makePopUp(title, text, color);
  showPopUp(popUpHTML, ms);
};

// Оптимизированный вариант makePopUp
const makePopUp = (title, text, color = null) => {
  return color
    ? `<div class='container-popup' style="background-color: ${color}">
 <div class='popup'>
 <p>${title}</p><br>
 <p>${text}</p>
 </div>
 </div>`
    : `<div class='container-popup'>
 <div class='popup'>
 <p>${title}</p><br>
 <p>${text}</p>
 </div>
 </div>`;
};

// Оптимизированный вариант showPopUp
const showPopUp = (popUpHTML, ms) => {
  let tempContainer = document.getElementById('div-temp');

  if (!tempContainer) {
    tempContainer = document.body.appendChild(document.createElement('div'));
    tempContainer.id = 'div-temp';
    tempContainer.innerHTML = popUpHTML;
    setTimeout(() => {
      tempContainer.innerHTML = '';
    }, ms);
  } else {
    tempContainer.innerHTML = popUpHTML;
    setTimeout(() => {
      tempContainer.innerHTML = '';
    }, ms);
  }
};

// Оптимизированный вариант helpText
const helpText = `<p style="color: white; font-size: 30px;">Если вы пользуетесь браузером Mozilla Firefox, то для ввода дат можно просто использовать формат<br>
 <span style="color: green;">YYYY-MM-DD HH:MM</span><br>
 например: <span style="color: green;">2020-08-10 16:17</span> либо <span style="color: green;">10/08/2020 16:15</span> 
 Не подходит: <span style="color: red;">10.08.2020 16:15</span><br>
 Время указывается по местному часовому поясу</p><br>
 <span style="color: white; font-size: 30px;">В нижнем поле исключений допустимо писать исключения через запятую без пробелов</span><br>
 <span style="color: white; font-size: 30px;">В Полях условий (1 и 2 сверху) допустимо указывать только одно значение</span>`;

// Оптимизированный вариант adminkeyInfo
const adminkeyInfo = `<p style="color: white; font-size: 30px;">Интерфейс (толстый клиент) администратора для оперативного технического сопровождения АС РКК 2.0<br></p>
 <span style="color: white; font-size: 30px;">email для контактов:<span style="color: #0fa5b6;"> Test.Testov@fakeorg.ru</span></span>`;

// Оптимизированный вариант loadAnalyzeJS
const loadAnalyzeJS = (caller = false) => {
  if (caller) {
    caller.parentNode.removeChild(caller);
  }

  console.log('loadAnalyzeJS: loading analyze script');

  if (document.getElementById('analyzeScript')) {
    const oldSrc = document.getElementById('analyzeScript');

    if (oldSrc.parentNode) {
      const parent = oldSrc.parentNode;
      parent.removeChild(oldSrc);
      const newScript = document.createElement('script');
      newScript.id = 'analyzeScript';
      newScript.src = '/public/js/8441_support-analyze.js';
      document.body.appendChild(newScript);
    }
  } else {
    const src = document.createElement('script');
    src.id = 'analyzeScript';
    src.src = '/public/js/8441_support-analyze.js';
    document.body.appendChild(src);
  }
};

// Оптимизированный вариант loadKibanaValidatorScript
const loadKibanaValidatorScript = (callerId = false) => {
  if (callerId) {
    document.getElementById('control-panel').style.display = 'block';
    document.getElementById(callerId).parentNode.removeChild(document.getElementById(callerId));
  }

  console.log('loadKibanaValidatorScript: loading ELK page search scripts');

  const src = document.createElement('script');
  src.id = 'kibana-script';
  src.src = '/public/js/8441_support-kibana-validators.js';
  document.body.appendChild(src);
  // Оптимизированный вариант loadKibanaValidatorScript
  const loadKibanaValidatorScript = (callerId = false) => {
    if (callerId) {
      document.getElementById('control-panel').style.display = 'block';
      document.getElementById(callerId).parentNode.removeChild(document.getElementById(callerId));
    }

    console.log('loadKibanaValidatorScript: loading ELK page search scripts');

    const src = document.createElement('script');
    src.id = 'kibana-script';
    src.src = '/public/js/8441_support-kibana-validators.js';
    document.body.appendChild(src);
  };
};

// Оптимизированный вариант preProcessELKRequest
const preProcessELKRequest = (
  isFromMain = false,
  isAnalyze = false,
  {
    mainParameters = [],
    fieldNames = [],
    fieldValues = [],
    operators = [],
    excludeFieldNames,
    excludes,
  } = {},
) => {
  const requestObject = {
    mainParameters,
    fieldNames,
    fieldValues,
    operators,
    excludeFieldNames,
    excludes,
  };
};
const hideElement = (elementID) => {
  const elem = document.getElementById(elementID);
  elem.style.display === 'block'
    ? (elem.style.display = 'none')
    : (elem.style.display = 'block');
};

// Оптимизированный вариант showLongtext
const showLongtext = (className) => {
  const elem = document.getElementsByClassName(className);
  for (let i = 0; i < elem.length; i++) {
    elem[i].style.display === 'block'
      ? (elem[i].style.display = 'none')
      : (elem[i].style.display = 'block');
  }
};

// Оптимизированный вариант showHideLongtextMessageByClassName
const showHideLongtextMessageByClassName = (className) => {
  const ps = document.getElementsByClassName(className);
  for (let i = 0; i < ps.length; i++) {
    if (ps[i].style.overflow === 'hidden') {
      ps[i].style.overflow = 'visible';
      ps[i].style.wordWrap = 'break-word';
      ps[i].style.whiteSpace = 'revert';
      ps[i].style.wordBreak = 'break-word';
    } else {
      ps[i].style.overflow = 'hidden';
      ps[i].style.wordWrap = 'unset';
      ps[i].style.whiteSpace = 'nowrap';
      ps[i].style.wordBreak = 'unset';
    }
  }
};

// Оптимизированный вариант hideReqResp
const hideReqResp = (e) => {
  const idTarget = e.target.id.split('_')[0] + '_long';
  console.log(`idTarget: ${idTarget}`);
  const elem = document.getElementById(idTarget);
  elem.style.display === 'block'
    ? (elem.style.display = 'none')
    : (elem.style.display = 'block');
};

// Оптимизированный вариант hideReqResp2
const hideReqResp2 = (e) => {
  const idTarget = e.target.id.split('_')[0] + '_long_2';
  console.log(`idTarget: ${idTarget}, e_target_id: ${e.target.id}`);
  const elem = document.getElementById(idTarget);
  elem.style.display === 'block'
    ? (elem.style.display = 'none')
    : (elem.style.display = 'block');
};

// Оптимизированный вариант hideReqResp2_1
const hideReqResp2_1 = (e) => {
  const idTarget = e.target.id.split('_')[0] + '_long_2_1';
  console.log(`idTarget: ${idTarget}, e_target_id: ${e.target.id}`);
  const elem = document.getElementById(idTarget);
  elem.style.display === 'block'
    ? (elem.style.display = 'none')
    : (elem.style.display = 'block');
};

// Оптимизированный вариант hideReqResp3
const hideReqResp3 = (e) => {
  const idTarget = e.target.id.split('_')[0] + '_long_3';
  console.log(`idTarget: ${idTarget}`);
  const elem = document.getElementById(idTarget);
  elem.style.display === 'block'
    ? (elem.style.display = 'none')
    : (elem.style.display = 'block');
};

// Оптимизированный вариант hideReqResp3_1
const hideReqResp3_1 = (e) => {
  const idTarget = e.target.id.split('_')[0] + '_long_3_1';
  console.log(`idTarget: ${idTarget}, e_target_id: ${e.target.id}`);
  const elem = document.getElementById(idTarget);
  elem.style.display === 'block'
    ? (elem.style.display = 'none')
    : (elem.style.display = 'block');
};

// Оптимизированный вариант prettyXMLText
const prettyXMLText = (text) => {
  if (text) {
    const arrayTextSeparated = text.split(';');
    arrayTextSeparated.forEach((textPart, idx) => {
      if (textPart === '&amp') {
        arrayTextSeparated[idx] = '';
      }
      if (textPart === 'gt' || textPart === '&gt') {
        arrayTextSeparated[idx] = '>';
      }
      if (textPart === 'lt' || textPart === '&lt') {
        arrayTextSeparated[idx] = '<';
      }
      if (textPart === '#39') {
        arrayTextSeparated[idx] = '"';
      }
      if (textPart === '#13') {
        arrayTextSeparated[idx] = '\n';
      }
      if (textPart === '#34') {
        arrayTextSeparated[idx] = '"';
      }
    });
    return arrayTextSeparated
      .join('')
      .split('&amp')
      .join('');
  }
};

// Оптимизированный вариант putTextInTargetElementId
const putTextInTargetElementId = (text, elementId) => {
  const idx = elementId.split('_')[0];
  if (
    document.getElementById(`${idx}_long`).style.display !== 'none' &&
     document.getElementById(`${idx}_long`).innerText
  ) {
    // удаляем кнопку форматирования
    document
      .getElementById(`${idx}_btn_pretty`)
      .parentNode.removeChild(document.getElementById(`${idx}_btn_pretty`));
    document.getElementById(`${idx}_long`).innerText = prettyXMLText(text);
    SupportController.callPopUp(
      'Процесс выполнения',
      'Форматирование текста завершено',
      3000,
    );
  } else {
    SupportController.callPopUp(
      'Ошибка',
      'Для форматирования раскройте лог!',
      5000,
      '#511919',
    );
  }
};

// Оптимизированный вариант searchChildElementsWithContentByInitialElement
const searchChildElementsWithContentByInitialElement = (eventEmitterNode) => {
  let elementWithContentId;
  const childNodes = eventEmitterNode.parentNode.childNodes;
  childNodes.forEach((child) => {
    if (child.tagName === 'P' && child.id) {
      elementWithContentId = child.id;
    }
  });
  return elementWithContentId;
};

// Оптимизированный вариант copyTextToClipBoardFromElementById
const copyTextToClipBoardFromElementById = (eventEmitterNode) => {
  const targetId = searchChildElementsWithContentByInitialElement(
    eventEmitterNode,
  );
  if (targetId) {
    const tempContainer = document.createElement('textarea');
    tempContainer.value = document.getElementById(targetId).innerText;
    document.body.appendChild(tempContainer);
    try {
      tempContainer.select();
      const isSuccess = document.execCommand('copy');
      if (isSuccess) {
        SupportController.callPopUp(
          'Текст скопирован в буфер',
          '',
          3000,
          'cyan',
        );
        document.body.removeChild(tempContainer);
      } else {
        SupportController.callPopUp(
          'Текст НЕ был скопирован в буфер',
          '',
          3000,
          'cyan',
        );
        document.body.removeChild(tempContainer);
      }
    } catch (e) {
      SupportController.callPopUp(
        'Возникла ошибка при копировании текста',
        '',
        3000,
        '#511919',
      );
      throw e;
    }
  }
};

// Оптимизированный вариант htmlModal
const htmlModal = `<div class="modal-parent dimmer-modal" id="modalElement">
 <div class="modal-large">
 <span class="modal-label">Adminkey</span>
 <p>Adminkey приложение для агрегации данных из БД микросервисов РКК 2.0 для целей оперативного технического сопровождения. </p>
 <button class="modal-btn" id="btnModal" onclick="SupportController.closeModal()">Закрыть</button>
 </div>
</div>`;

// Оптимизированный вариант makeLargeModal
const makeLargeModal = (label, text) => {
  return `<div class="modal-parent dimmer-modal" id="modalElement">
 <div class="modal-large-wide" style="word-wrap: break-word;">
 <span class="modal-label">${label}</span><br>
 <p style="color: white; font-size: 25px;">${text}</p>
 <button class="modal-btn-large" id="btnModal" onclick="SupportController.closeModal()">Закрыть</button>
 </div>
 </div>`;
};

// Оптимизированный вариант makeLargeModalForLogs
const makeLargeModalForLogs = (label, text) => {
  return `<div class="modal-parent dimmer-modal" id="modalElement">
 <div class="modal-xlarge-wide" style="word-wrap: break-word;">
 <span onclick="SupportController.closeModal()" class="close-modal">&#10005;</span>
 <span class="modal-label">${label}</span><br>
 <p style="color: white; font-size: 30px; font-family: courier;">${text}</p>
 </div>
 </div>`;
};

// Оптимизированный вариант hideElementByKey
const hideElementByKey = (nodeInit, key = null) => {
  if (key === 'elk_single_hide') {
    nodeInit.parentNode.lastElementChild.style.display === 'block'
      ? (nodeInit.parentNode.lastElementChild.style.display = 'none')
      : (nodeInit.parentNode.lastElementChild.style.display = 'block');
  }
};

// Оптимизированный вариант makeLargeModalFullLog
const makeLargeModalFullLog = (fieldNames, fieldValues) => {
  let innerSpan = '';
  fieldNames.forEach((fieldName, i) => {
    if (fieldName === 'stackTrace' || fieldName === 'Текст ошибки') {
      innerSpan += `<span class="modal-field">${fieldName}: <span class="stack-trace-text">${fieldValuesi}</span></span><br>`;
    } else if (fieldValuesi) {
      innerSpan += `<span class="modal-field">${fieldName}: <span class="modal-field-value">${fieldValuesi}</span></span><br>`;
    }
  });

  return `<div class="modal-parent dimmer-modal" id="modalElement">
 <div class="modal-xlarge-wide-full" style="word-wrap: break-word;">
 <span onclick="SupportController.closeModal()" class="close-modal">&#10005;</span>
 <span class="modal-label">Log Information</span><br><br>
 ${innerSpan}
 </div>
 </div>`;
};

// Оптимизированный вариант showModal
const showModal = (modalHTML) => {
  const divTarget = document.getElementById('modalContainer');
  divTarget.innerHTML = modalHTML;
};

// Оптимизированный вариант closeModal
const closeModal = () => {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = '';
  document.body.style.overflow = 'auto';
};

// Оптимизированный вариант callModal
const callModal = (label, text, isTechnical = false) => {
  let modalHTML = '';
  if (isTechnical) {
    document.body.style.overflow = 'hidden';
    modalHTML = makeLargeModalForLogs(label, text);
    showModal(modalHTML);
  } else {
    document.body.style.overflow = 'hidden';
    modalHTML = makeLargeModal(label, text);
    showModal(modalHTML);
  }
};

// Оптимизированный вариант callModalTable
const callModalTable = (elementId) => {
  if (elementId.split('_')[1] === 'textRead') {
    const targetContentId = `${elementId.split('_')[0]}_long_${elementId.split('_')[2]}`;
    callModal('log info', document.getElementById(targetContentId).innerHTML, true);
  }

  if (elementId.split('_')[1] === 'IntTextRead') {
    const targetContentId = `${elementId.split('_')[0]}_long`;
    callModal('log info', document.getElementById(targetContentId).innerHTML, true);
  }
};

// Оптимизированный вариант callModalTableFullInfo
const callModalTableFullInfo = (elementNode) => {
  // row index
  const idx = elementNode.parentNode.parentNode.rowIndex;
  const elementId = elementNode.id;

  if (elementNode.id.split('_')[1] === 'fullTextRead') {
    let fieldNames = [];
    let fieldValues = [];

    const ths = document.querySelector(
      '#elkData > thead:nth-child(1) > tr:nth-child(1)',
    ).children;
    const trs = document.querySelector('#elkData > tbody:nth-child(2)').children;
    const tds = document.querySelector('#elkData > tbody:nth-child(2)')
      .children[idx - 1].children;

    for (let th of ths) {
      if (th) {
        fieldNames.push(th.innerText);
      }
    }

    for (let td of tds) {
      if (td.children.length <= 3) {
        td.childNodes.forEach((child) => {
          if (child.tagName === 'P') {
            fieldValues.push(child.innerText);
          }
        });
      } else {
        td.childNodes.forEach((child) => {
          if (child.tagName === 'P' && child.id) {
            fieldValues.push(child.innerText);
          }
        });
      }
    }

    const modalHTML = makeLargeModalFullLog(fieldNames, fieldValues);
    document.body.style.overflow = 'hidden';
    showModal(modalHTML);
  } else if (elementId.split('_')[1] === 'fullIntTextRead') {
    let thChilds = document.querySelector(
      '#integrationLogData > tbody > tr:nth-child(1)',
    ).childNodes;
    let tdChilds = document.querySelector('#integrationLogData > tbody')
      .children[idx].children;

    let fieldNames = [];
    let fieldValues = [];

    thChilds.forEach((child, i) => {
      if (i > 1 && child.localName === 'th') {
        fieldNames.push(child.innerText);
      }
    });

    for (let td of tdChilds) {
      if (td.cellIndex === 8) {
        fieldValues.push(td.lastElementChild.innerHTML);
      } else if (td.cellIndex > 0) {
        fieldValues.push(td.innerText);
      }
    }

    const modalHTML = makeLargeModalFullLog(fieldNames, fieldValues);
    document.body.style.overflow = 'hidden';
    showModal(modalHTML);
  }
};

// Оптимизированный вариант BPMRequest
const BPMRequest = async (isAnalyze = false) => {
  console.log(`BPMRequest: isAnalyze: ${isAnalyze}\n`);
  let appnum;
  if (window.location.href.split('/')[4].length > 10) {
    appnum = window.location.href.split('/')[4].split('#')[0];
  } else {
    appnum = window.location.href.split('/')[4];
  }
  document.removeEventListener('mousemove', this.BPMRequest);
  showLoaderBPM('mainBPMdataContainer');
  let appStatus = !isAnalyze
    ? document.getElementById('appStatusSearch').innerText === 'Ошибка'
      ? 'ERR'
      : 'notERR'
    : 'notERR';
  console.log(`BPMRequest: appStatus: ${appStatus}\n`);
  let hostName = await getCurrentLocalHostName();
  const urlBPM = `http://${hostName}:8440/frontrequest/bpmdata/${appnum}/${appStatus}`;

  try {
    const result = await fetch(urlBPM, {
      method: 'GET',
      credentials: 'include',
    });
    await result;
    if (result.redirected) {
      window.location.href = result.url;
    } else {
      const html = await result.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const headerBlock = doc.getElementById('headerBlock').innerHTML;
      const bpmDataContainer = doc.getElementById('bpmDataContainer').innerHTML;
      const errorContainer = doc.getElementById('errorContainer').innerHTML;
      document.getElementById('errorContainer').innerHTML = errorContainer;
      document.getElementById('headWithBPMdata').innerHTML = headerBlock;
      document.getElementById('mainBPMdataContainer').innerHTML = bpmDataContainer;
      SupportController.callPopUp('Данные из BPM получены', '', 2000);

      setTimeout(() => {
        SupportController.callPopUp(
          'Загрузка завершена',
          'Для дополнительного поиска логов можно воспользоваться панелью поиска логов в ELK (Kibana)',
          5000,
          'rgb(44,82,46)',
        );
      }, 3000);

      setTimeout(() => {
        SupportController.markBorderByElementIdWithInterval(
          'searchElkLogsPanel',
          'rgb(0, 255, 28)',
        );
      }, 7000);

      if (!isAnalyze) {
        loadAnalyzeJS();
      }
      document.getElementById('getBPMBtn').style.display = 'none';
      if (document.getElementById('analyze')) {
        document.getElementById('analyze').id = 'analyze-true';
      }
    }
  } catch (e) {
    console.error('Ошибка при получении данных BPM:', e);
    SupportController.callPopUp(
      'Ошибка',
      'Не удалось получить данные из BPM',
      3000,
      '#511919',
    );
  }
};

// Оптимизированный вариант getIntegrationLogs
const getIntegrationLogs = async (applicationNumber = null) => {
  showLoaderFlex(
    'Запрос на сервер',
    'Получение данных интеграционных логов',
  );

  if (!applicationNumber) {
    closeLoaderFlex();
    SupportController.callPopUp(
      'Ошибка',
      'В запросе не передан номер заявки',
      3000,
      '#511919',
    );
    return;
  }

  const url = `http://${getCurrentLocalHostName()}:8440/api/integrationlogs/${applicationNumber}`;
  try {
    const result = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    await result;
    if (result.redirected) {
      window.location.href = result.url;
    } else {
      const html = await result.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const integrationTableHTML = doc.getElementById('intLogsRoot').innerHTML;
      document.getElementById('integratonLogsContainer').innerHTML = integrationTableHTML;
      closeLoaderFlex();
      SupportController.callPopUp(
        'Данные интеграционных логов получены',
        '',
        2500,
      );
    }
  } catch (e) {
    closeLoaderFlex();
    SupportController.callPopUp(
      'Ошибка при получении интеграционных логов',
       `При выполнении запроса произошла ошибка ${e}`,
       3000,
       '#511919',
    );
  }
};

// Оптимизированный вариант reloadMainJS
const reloadMainJS = () => {
  console.log('reloadMainJS: reloading main script\n');

  if (document.getElementById('mainScript')) {
    const oldSrc = document.getElementById('mainScript');
    if (oldSrc.parentNode) {
      const parent = oldSrc.parentNode;
      parent.removeChild(oldSrc);
      const newScript = document.createElement('script');
      newScript.id = 'mainScript';
      newScript.src = '/public/js/8441_support-script-object.js';
      document.body.appendChild(newScript);
    }
  } else {
    const src = document.createElement('script');
    src.id = 'mainScript';
    src.src = '/public/js/8441_support-script-object.js';
    document.body.appendChild(src);
  }
};

// Оптимизированный вариант reloadUtilsJS
const reloadUtilsJS = () => {
  console.log('reloadUtilsJS: reloading utils script\n');

  if (document.getElementById('mainScriptUtils2')) {
    const oldSrc = document.getElementById('mainScriptUtils2');
    if (oldSrc.parentNode) {
      const parent = oldSrc.parentNode;
      parent.removeChild(oldSrc);
      const newScript = document.createElement('script');
      newScript.id = 'mainScriptUtils2';
      newScript.src = '/public/js/8441_support-log-formatter-utils.js';
      document.body.appendChild(newScript);
    }
  } else {
    const src = document.createElement('script');
    src.id = 'mainScriptUtils2';
    src.src = '/public/js/8441_support-log-formatter-utils.js';
    document.body.appendChild(src);
  }
};

// Оптимизированный вариант loadELKControllerJS
const loadELKControllerJS = () => {
  if (!document.getElementById('mainScriptUtils3')) {
    const src = document.createElement('script');
    src.id = 'mainScriptUtils3';
    src.src = '/public/js/ELKLogsTableController.js';
    document.body.appendChild(src);
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
};
