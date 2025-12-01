class ELKLogsTableControllerOpt {
  constructor() {
    this.logsTableState = {
      bodyRowsArray: [],
      trsToRender: [],
      isRenderFiltered: false,
      renderOption: null,
    };
    this.isInitialized = false;
  }

  getTableNodeFromDOM() {
    return document.getElementById('elkData');
  }

  getThsFromDOM() {
    const tableNode = this.getTableNodeFromDOM();
    return tableNode?.children[0]?.children[0]?.children || [];
  }

  getArrayOfTheadNames() {
    return Array.from(this.getThsFromDOM()).map(th => th.innerText);
  }

  getTbodyRowsChildrenFromDOM() {
    const tableNode = this.getTableNodeFromDOM();
    return tableNode?.children[1]?.children || [];
  }

  getTbodyRowsCounter() {
    return this.getTbodyRowsChildrenFromDOM().length;
  }

  initializeState() {
    if (!this.isInitialized) {
      this.updateStateFromDOM();
      this.isInitialized = true;
    }
  }

  updateStateFromDOM() {
    const tableNode = this.getTableNodeFromDOM();
    this.logsTableState = {
      tableNode,
      ths: this.getThsFromDOM(),
      tbodyTrChildren: this.getTbodyRowsChildrenFromDOM(),
      tableBodyRowsCounter: this.getTbodyRowsCounter(),
      theadNamesArray: this.getArrayOfTheadNames(),
    };
    this._fillWithDataBodyRowsArrayFromELKLogsTable();
    this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValue();
    this.collapseShowTrDOMByFilteredArray();
  }

  _fillWithDataBodyRowsArrayFromELKLogsTable() {
    const { tbodyTrChildren, theadNamesArray } = this.logsTableState;
    this.logsTableState.bodyRowsArray = [];

    for (let tr of tbodyTrChildren) {
      for (let td of tr.children) {
        for (let tdContent of td.children) {
          if (this._isContentRelevant(tdContent)) {
            this.logsTableState.bodyRowsArray.push({
              rowIndex: tr.rowIndex,
              cellIndex: td.cellIndex,
              parameterName: theadNamesArray[td.cellIndex],
              parameterValue: tdContent.innerText,
              childNodeContainer: tdContent,
            });
          }
        }
      }
    }
  }

  _isContentRelevant(tdContent) {
    const classes = tdContent.classList;
    return (
      classes.contains('app') ||
       classes.contains('logger') ||
       classes.contains('longtext2') ||
       classes.contains('commontd') ||
       classes.contains('thread-p') ||
       classes.contains('level') ||
       tdContent.tagName === 'A'
    );
  }

  getSpecificRowsArrayByParameterValue(parameterValue) {
    return parameterValue
      ? this.logsTableState.bodyRowsArray.filter(
        cell => cell.parameterValue === parameterValue,
      )
      : this.logsTableState.bodyRowsArray;
  }

  getSpecificRowsArrayByParameterValueAndName(
    parameterValue = null,
    parameterName,
  ) {
    return this.logsTableState.bodyRowsArray.filter(
      cell =>
        cell.parameterValue === parameterValue &&
          cell.parameterName === parameterName,
    );
  }

  collapseShowTrDOMByFilteredArray() {
    const { isRenderFiltered, trsToRender, tbodyTrChildren } = this.logsTableState;
    const excludeFlag = document.getElementById('excludeFlgELKFilter').checked;

    if (isRenderFiltered) {
      for (let tr of tbodyTrChildren) {
        const index = trsToRender.findIndex(
          render => render.rowIndex === tr.rowIndex,
        );
        if ((excludeFlag && index !== -1) || (!excludeFlag && index === -1)) {
          tr.classList.toggle('collapsed-filter');
        }
      }
    } else {
      tbodyTrChildren .forEach(tr => tr.classList.remove('collapsed-filter'));
    }
  }

  getTargetsToRenderByParameterValue(parameterValue, parameterName) {
    if (parameterValue && !parameterName) {
      if (this.logsTableState.renderOption !== parameterValue) {
        this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValue(parameterValue);
        this._updateRenderState();
      } else {
        this._resetFilter();
      }
    } else if (parameterValue && parameterName) {
      if (this.logsTableState.renderOption !== parameterValue) {
        if (this.logsTableState.isRenderFiltered) {
          this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValue();
        }
        this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValueAndName(parameterValue, parameterName);
        this._updateRenderState();
      } else {
        this._resetFilter();
      }
    } else {
      this._resetFilter();
    }
  }

  _updateRenderState() {
    const { bodyRowsArray, trsToRender } = this.logsTableState;
    this.logsTableState.isRenderFiltered = bodyRowsArray.length !== trsToRender.length;
    this.logsTableState.renderOption = this.logsTableState.isRenderFiltered ? this.logsTableState.renderOption : null;
    this.collapseShowTrDOMByFilteredArray();
  }

  _resetFilter() {
    this.logsTableState.isRenderFiltered = false;
    this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValue();
    this.collapseShowTrDOMByFilteredArray();
    this.logsTableState.renderOption = null;
  }

  makeFilterOptions(key) {
    const targetSelect = document.getElementById('filter-kibana-logs');
    if (key === 'clean') {
      targetSelect.innerHTML = '<option value=""></option>';
    }

    const uniqueApps = new Set();
    this.logsTableState.bodyRowsArray
      .filter(row => row.parameterName === 'app_name')
      .forEach(row => uniqueApps.add(row.parameterValue));

    uniqueApps.forEach((app) => {
      targetSelect.innerHTML += `<option value="${app}">${app}</option>`;
    });
  }
}

const elkController = new ELKLogsTableController();
elkController.initializeState();
elkController.makeFilterOptions();

const handleInstanceController = (isCheckBox = false, key, parameterName) => {
  if (isCheckBox) {
    elkController.getTargetsToRenderByParameterValue(key, parameterName);
  } else {
    elkController.getTargetsToRenderByParameterValue();
  }
};