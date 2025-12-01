const getFoundChainsCounterOpt = () => {
  const chains = {};
  const allTrsWithChainAttributes = document.querySelectorAll('[chainid]');

  // Создаем карту всех chainId с их индексами
  const chainMap = new Map();

  allTrsWithChainAttributes.forEach((tr) => {
    const chainId = tr.getAttribute('chainid');
    if (!chainMap.has(chainId)) {
      chainMap.set(chainId, []);
    }
    chainMap.get(chainId).push(tr.rowIndex);
  });

  // Подсчитываем количество цепочек для каждого chainId
  chainMap.forEach((indices, chainId) => {
    const counter = indices.length - 1;
    chains[chainId] = counter;
  });

  // Преобразуем результат в массив объектов
  return Object.entries(chains).map(([chainId, counter]) => ({
    chainId,
    counter,
  }));
};

const aggregateChainLogsDataOpt = () => {
  if (aggregateDataCallsCounter > 0) {
    document.getElementById('chainWrapperContent').innerHTML = '';
  }

  const messageCellIdx = getCellIndexByColumnName('message');
  const appNameCellIdx = getCellIndexByColumnName('app_name');
  const chains = getFoundChainsCounterOpt();

  console.log('detectEqualThreadLogs.aggregateChainLogsData: chains:', chains);

  if (chains.length > 0) {
    let foundChainsCounter = 0;
    const chainWrapper = document.getElementById('chainWrapper');
    chainWrapper.style.width = 'max-content';
    chainWrapper.style.height = 'max-content';
    chainWrapper.style.maxHeight = '700px';

    const chainWrapperContent = document.getElementById('chainWrapperContent');

    const uniqueChains = chains.filter((chain, idx, arr) =>
      arr.findIndex(c => c.chainName === chain.chainName) === idx,
    );

    // Функция для создания объекта параметров
    const createParamsObject = (chainName) => {
      const keys = ['correlation', 'topic', 'partition', 'offset', 'message', 'source', 'chain', 'class'];

      return keys.reduce((acc, key) => {
        acc[key === 'chain' ? 'chainKey' : key] = getParameterByAttributeValue(chainName, key);
        return acc;
      }, {});
    };

    uniqueChains.forEach((chain) => {
      foundChainsCounter++;

      const chainElement = document.querySelector(`[chainid="${chain.chainName}"]`);
      const timeElement = chainElement.children[getCellIndexByColumnName('@timestamp')].lastElementChild;

      // const p2 = () => {
      //   Object.entries(chain).map([value])
      // }

      const params_ = {
        correlation: getParameterByAttributeValue(chain.chainName, 'correlation'),
        topic: getParameterByAttributeValue(chain.chainName, 'topic'),
        partition: getParameterByAttributeValue(chain.chainName, 'partition'),
        offset: getParameterByAttributeValue(chain.chainName, 'offset'),
        message: getParameterByAttributeValue(chain.chainName, 'message'),
        source: getParameterByAttributeValue(chain.chainName, 'source'),
        chainKey: getParameterByAttributeValue(chain.chainName, 'chain'),
        class: getParameterByAttributeValue(chain.chainName, 'class'),
      };

      const params = createParamsObject(chain.chainName);

      const chainInfo = [
        makeHTMLChainInfoPanel('Имя потока', chainElement.children[getCellIndexByColumnName('thread_name')].innerText, true),
        makeHTMLChainInfoPanel('Время записи', timeElement.innerText),
        makeHTMLChainInfoPanel('Поток логов сервиса', chainElement.children[appNameCellIdx].innerText),
        makeHTMLChainInfoPanel('Количество логов в потоке', chain.chainsCounter),
        makeHTMLChainInfoPanel('Ключ цепочечного запроса', params.chainKey || 'Не найден'),
        makeHTMLChainInfoPanel('Ключ межсервисного сообщения', params.message || 'Не найден'),
        makeHTMLChainInfoPanel('Ключ корреляции', params.correlation || 'Не найден'),
        makeHTMLChainInfoPanel('Источник сообщения', params.source || 'Не найден'),
        makeHTMLChainInfoPanel('Название топика', params.topic || 'Не найден'),
        makeHTMLChainInfoPanel('Номер партиции', params.partition || 'Не найден'),
        makeHTMLChainInfoPanel('Значение смещения', params.offset || 'Не найден'),
        makeHTMLChainInfoPanel('Класс сообщения', params.class || 'Не найден', chain.chainName),
      ].join('<br>');

      chainWrapperContent.innerHTML += `
        <span style="margin-left: 15px; font-size: 30px; color: #219fff">Поток #${foundChainsCounter}: </span><br>
        ==============================<br>
        ${chainInfo}
        <button id="${chain.chainName}" onclick="hideTrByAttributeValue(this.id)">Скрыть/Показать</button><br><br>
      `;
    });

    if (aggregateDataCallsCounter === 0) {
      document.getElementById('elkButtonsContainer').innerHTML += '<a href="#chainWrapperContent">Список потоков</a>';
      enrichELKTableWithSurroundThreadLogsButton();
    }

    aggregateDataCallsCounter++;
  }
};

const validateCheckBoxRelatedFieldsOpt = () => {
  let isCheckBoxesValid = true;
  const { checkboxes } = stateForm;

  checkboxes.forEach((checkbox) => {
    if (checkbox.selected) {
      const field = getElement(checkbox.relatedFieldId);

      if (checkbox.relatedFieldId === 'excludeParameters') {
        isCheckBoxesValid = stateForm.excludeParameters.values.length > 0;
      } else {
        isCheckBoxesValid = Boolean(field.value);
      }

      if (!isCheckBoxesValid) {
        setClassRedBorderLight(field);
      } else {
        removeClassRedBorderLight(field);
      }
    }
  });

  return isCheckBoxesValid;
};
