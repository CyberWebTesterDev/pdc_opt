// Оптимизированный вариант cleanLogRegEx
const cleanLogRegEx = (targetElementId, logStr, logType = null, correlationId = null) => {
  const regex = {
    lt: /(\&|)lt\;/g,
    gt: /(\&|)gt\;/g,
    amp: /(\&|)amp\;/g,
    quot: /\&quot\;/g,
    num: /\#\d{2}\;/g,
    xmlStart: /<\?xml\s/g,
    returnStart: /<\?.*<return>/g,
    returnEnd: /<\/return.*>/g,
  };

  let newStr = logStr
    .replace(regex.lt, '<')
    .replace(regex.gt, '>')
    .replace(regex.amp, '')
    .replace(regex.quot, '\'')
    .replace(regex.num, '\'');

  if (logType === 'Икар') {
    newStr = newStr.replace(regex.returnStart, '').replace(regex.returnEnd, '');
  }
  if (correlationId && logType === 'СПР') {
    newStr = newStr.replace(regex.xmlStart, '<?xxml_nested_ ');
  }

  SupportPageController.callPopUp('', 'Форматирование текста завершено', 3000);
  document.getElementById(targetElementId).style.whiteSpace = 'pre-wrap';
  document.getElementById(targetElementId).innerText =
     !correlationId && logType === 'СПР' ? prettifyXml(newStr) : newStr;
  document.getElementById(targetElementId).style.color = 'rgb(228, 235, 244)';
  document.getElementById(targetElementId).style.backgroundColor = '#0a454f';
};

// Оптимизированный вариант cleanLog
const cleanLog = (targetElementId, logStr, logType = null) => {
  const logCharArray = logStr.split('');
  let logCharArrayCopy = [...logCharArray];

  const replacements = {
    Икар: {
      '&gt': '>',
      '&lt': '<',
      '&amp;': '',
      'quot;': '\'',
    },
    СПР: {
      'gt;': '>',
      'lt;': '<',
      '#39': '"',
      '#34': '"',
    },
  };

  for (let i = 0; i < logCharArray.length; i++) {
    const key = logType === 'Икар' ? logCharArray.slice(i-2, i+1).join('') :
      logType === 'СПР' ? logCharArray.slice(i-2, i+1).join('') : '';

    if (replacements[logType] && replacements[logType][key]) {
      logCharArrayCopy.splice(i-2, 3, replacements[logType][key]);
    }
  }

  if (logType === 'СПР') {
    cleanLogAmp(logCharArrayCopy);
  }

  // Удаление лишних символов
  logCharArrayCopy.forEach((char, idx) => {
    if (char === ';') {
      logCharArrayCopy[idx] = '';
    }
  });

  if (logType === 'Икар') {
    cleanXMLLogSpaces(logCharArrayCopy);
    logCharArrayCopy = cleanToXmlParseLog(logCharArrayCopy);
    cleanXMLLogEmptyStrings(logCharArrayCopy);
  }

  document.getElementById(targetElementId).innerText = logCharArrayCopy.join('');
  SupportPageController.callPopUp('', 'Форматирование текста завершено', 3000);
  document.getElementById(targetElementId).style.color = 'rgb(228, 235, 244)';
  document.getElementById(targetElementId).style.backgroundColor = '#0a454f';
  document.getElementById(targetElementId).style.transition = '50000';
};

// Оптимизированный вариант cleanXMLLogEmptyStrings
const cleanXMLLogEmptyStrings = (array) => {
  array = array.filter(char => char !== '');
};

// Оптимизированный вариант cleanXMLLogSpaces
const cleanXMLLogSpaces = (array) => {
  for (let i = 3; i < array.length; i++) {
    if (array[i-1] === '>' && array[i+1] === '<' && array[i] === ' ') {
      array[i] = '';
    }
  }
};

// Оптимизированный вариант cleanLogAmp
const cleanLogAmp = (arr) => {
  arr = arr.filter((char, idx) => {
    if (idx > 4) {
      const amp = arr.slice(idx-4, idx+1).join('');
      return amp !== '&amp;';
    }
    return true;
  });
};

// Оптимизированный вариант cleanToXmlParseLog
const cleanToXmlParseLog = (array) => {
  let xmlEntryCounter = 0;
  let isReturnPresent = false;

  for (let i = 0; i < array.length; i++) {
    const xmlStart = array.slice(i-4, i+1).join('');
    const returnStart = array.slice(i-6, i+1).join('');
    const returnEnd = array.slice(i-7, i+1).join('');

    if (xmlStart === '<?xml' || xmlStart === '?xml') {
      xmlEntryCounter++;
      if (xmlEntryCounter > 1) {
        array = array.slice(i-4);
      }
    }

    if (returnStart === 'return') {
      isReturnPresent = true;
    }

    if (isReturnPresent && returnEnd === '/return') {
      array = array.slice(0, i-7);
    }
  }

  return array;
};

// Оптимизированный вариант prettifyXml
const prettifyXml = (sourceXml) => {
  const xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
  const xsltDoc = new DOMParser().parseFromString(
     `<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
       <xsl:strip-space elements="*"/>
       <xsl:template match="node()|@*">
       <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>
       </xsl:template>
       <xsl:output indent="yes"/>
       </xsl:stylesheet>`,
     'application/xml',
  );

  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsltDoc);
  const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
  return new XMLSerializer().serializeToString(resultDoc);
};

// Оптимизированный вариант getThreadBackGroundColorByAttributeValue
const getThreadBackGroundColorByAttributeValue = (attributeValue) => {
  const element = document.querySelector(`[chainid="${attributeValue}"]`);
  return element?.children[getCellIndexByColumnName('thread_name')].style.backgroundColor || '';
};

// Оптимизированный вариант makeHTMLChainInfoPanel
const makeHTMLChainInfoPanel = (attributeName, value, isThreadName = false) => {
  return `<span class="chain-info">
 <span class="attribute-name" style="font-weight: bold;">${attributeName}: </span>${value} </span>`;
};

// Оптимизированный вариант chainInfoWrapper
const chainInfoWrapper = (HTMLtoWrap, chainName) => {
  const color = getThreadBackGroundColorByAttributeValue(chainName);
  return `<div id="${chainName}_group" class="thread-log-block" style="border-style: solid; border-color: ${color}">${HTMLtoWrap}</div>`;
};

// Оптимизированный вариант getCellIndexByColumnName
const getCellIndexByColumnName = (columnName) => {
  const ths = document.getElementById('elkData').children0.children0.children;
  return Array.from(ths).findIndex(th => th.innerText === columnName);
};
