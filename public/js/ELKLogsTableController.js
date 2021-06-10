class ELKLogsTableController {
  //класс для работы со страницей поиска логов
  logsTableState = {
    bodyRowsArray: [],
    trsToRender: [],
    isRenderFiltered: false,
    renderOption: null,
  };

  getTableNodeFromDOM = () => {
    return document.getElementById('elkData');
  };

  getThsFromDOM = () => {
    return this.logsTableState.tableNode.children[0] !== undefined
      ? this.logsTableState.tableNode.children[0].children[0].children
      : [];
  };

  getArrayOfTheadNames = () => {
    let thsNames = [];
    for (let th of this.getThsFromDOM()) {
      thsNames.push(th.innerText);
    }
    return thsNames;
  };

  getTbodyRowsChildrenFromDOM = () => {
    if (this.getTableNodeFromDOM().children[1]) {
      return this.getTableNodeFromDOM().children[1].children;
    }
    return [];
  };

  getTbodyRowsCounter = () => {
    return this.getTbodyRowsChildrenFromDOM().length;
  };

  reInitializeState = () => {
    if (this.isInitialized) {
      this.logsTableState.bodyRowsArray = [];
      this.logsTableState.tableNode = this.getTableNodeFromDOM();
      this.logsTableState.ths = this.getThsFromDOM();
      this.logsTableState.tbodyTrChildren = this.getTbodyRowsChildrenFromDOM();
      this.logsTableState.tableBodyRowsCounter = this.getTbodyRowsCounter();
      this.logsTableState.theadNamesArray = this.getArrayOfTheadNames();
      this._fillWithDataBodyRowsArrayFromELKLogsTable();
      this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValue();
      this.collapseShowTrDOMByFilteredArray();
      this.makeFilterOptions('clean');
      console.log(`State has been reinitialized`);
    } else {
      console.log(
        `State has NOT been reinitialized because it was not initialized first`,
      );
    }
  };

  _fillWithDataBodyRowsArrayFromELKLogsTable = () => {
    const { tbodyTrChildren, theadNamesArray } = this.logsTableState;
    for (let tr of tbodyTrChildren) {
      for (let td of tr.children) {
        for (let tdContent of td.children) {
          if (
            tdContent.classList.contains('app') ||
            tdContent.classList.contains('logger') ||
            tdContent.classList.contains('app') ||
            tdContent.classList.contains('longtext2') ||
            tdContent.classList.contains('commontd') ||
            tdContent.tagName == 'A' ||
            tdContent.classList.contains('thread-p') ||
            tdContent.classList.contains('level')
          ) {
            let dataObject = {
              rowIndex: tr.rowIndex,
              cellIndex: td.cellIndex,
              parameterName: theadNamesArray[td.cellIndex],
              parameterValue: tdContent.innerText,
              childNodeContainer: tdContent,
            };
            this.logsTableState.bodyRowsArray.push(dataObject);
          }
        }
      }
    }
  };

  isInitialized = false;

  initializeState = () => {
    if (!this.isInitialized) {
      this.logsTableState.tableNode = this.getTableNodeFromDOM();
      this.logsTableState.ths = this.logsTableState.tableNode
        ? this.getThsFromDOM()
        : [];
      this.logsTableState.tbodyTrChildren = this.logsTableState.ths
        ? this.getTbodyRowsChildrenFromDOM()
        : [];
      this.logsTableState.tableBodyRowsCounter = this.logsTableState.tableNode
        ? this.getTbodyRowsCounter()
        : [];
      this.logsTableState.theadNamesArray = this.logsTableState.tableNode
        ? this.getArrayOfTheadNames()
        : [];
      this._fillWithDataBodyRowsArrayFromELKLogsTable();
      this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValue();
      this.collapseShowTrDOMByFilteredArray();
      this._fillWithDataBodyRowsArrayFromELKLogsTable();
      this.isInitialized = true;
      console.log(`ELKLogsTableController: the state has been initialized`);
    } else {
      console.log(`ELKLogsTableController: the initial state already exists`);
    }
  };

  getCurrentState = () => {
    return this.logsTableState;
  };

  collapseShowTrDOMByFilteredArray = () => {
    console.log(`collapseShowTrDOMByFilteredArray: current state: `);
    console.log(this.getCurrentState());
    if (this.getCurrentState().isRenderFiltered) {
      const excludeFlag = document.getElementById('excludeFlgELKFilter')
        .checked;
      for (let tr of this.getCurrentState().tbodyTrChildren) {
        if (excludeFlag) {
          if (
            this.getCurrentState().trsToRender.findIndex(
              render => render.rowIndex == tr.rowIndex,
            ) != -1
          ) {
            tr.classList.toggle('collapsed-filter');
          }
        } else {
          if (
            this.getCurrentState().trsToRender.findIndex(
              render => render.rowIndex == tr.rowIndex,
            ) == -1
          ) {
            tr.classList.toggle('collapsed-filter');
          }
        }
      }
    } else {
      for (let tr of this.getCurrentState().tbodyTrChildren) {
        tr.classList.remove('collapsed-filter');
      }
    }
  };

  getSpecificRowsArrayByParameterValue = (parameterValue = null) => {
    return parameterValue
      ? this.logsTableState.bodyRowsArray.filter(
          cell => cell.parameterValue == parameterValue,
        )
      : this.logsTableState.bodyRowsArray;
  };

  getSpecificRowsArrayByParameterValueAndName = (
    parameterValue = null,
    parameterName,
  ) => {
    return this.logsTableState.bodyRowsArray.filter(cell => {
      if (
        cell.parameterValue == parameterValue &&
        cell.parameterName == parameterName
      ) {
        return true;
      }
    });
  };

  updateStateFromDOM = () => {
    this.reInitializeState();
  };

  getTargetsToRenderByParameterValue = (
    parameterValue = null,
    parameterName = null,
  ) => {
    if (parameterValue && !parameterName) {
      if (this.logsTableState.renderOption !== parameterValue) {
        this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValue(
          parameterValue,
        );
        if (
          this.logsTableState.bodyRowsArray.length ==
          this.logsTableState.trsToRender.length
        ) {
          this.logsTableState.isRenderFiltered = false;
        } else {
          this.logsTableState.isRenderFiltered = true;
          this.logsTableState.renderOption = parameterValue;
          this.collapseShowTrDOMByFilteredArray();
        }
      } else {
        //сброс фильтра
        console.log(
          `getTargetsToRenderByParameterValue: current log set has already been filtered by value: ${parameterValue}`,
        );
        console.log(
          `getTargetsToRenderByParameterValue: starting to delete current render filter`,
        );
        this.logsTableState.isRenderFiltered = false;
        this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValue();
        this.collapseShowTrDOMByFilteredArray();
        this.logsTableState.renderOption = null;
      }
    }
    if (parameterValue && parameterName) {
      if (this.logsTableState.renderOption !== parameterValue) {
        if (this.logsTableState.isRenderFiltered) {
          //если это новый фильтр при том, что предыдущий активен нужна очистка отфильтрованного массива
          this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValue();
        }
        this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValueAndName(
          parameterValue,
          parameterName,
        );
        if (
          this.logsTableState.bodyRowsArray.length ==
          this.logsTableState.trsToRender.length
        ) {
          this.logsTableState.isRenderFiltered = false;
        } else {
          this.logsTableState.isRenderFiltered = true;
          this.logsTableState.renderOption = parameterValue;
          this.collapseShowTrDOMByFilteredArray();
        }
      } else {
        //сброс фильтра
        console.log(
          `getTargetsToRenderByParameterValue: current log set has already been filtered by value: ${parameterValue}`,
        );
        console.log(
          `getTargetsToRenderByParameterValue: starting to delete current render filter`,
        );
        this.logsTableState.isRenderFiltered = false;
        this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValue();
        this.collapseShowTrDOMByFilteredArray();
        this.logsTableState.renderOption = null;
      }
    }
    if (!parameterValue) {
      //если не передано значение параметра выполнить сброс фильтра
      console.log(
        `getTargetsToRenderByParameterValue: starting to clean current render filter`,
      );
      this.logsTableState.isRenderFiltered = false;
      this.logsTableState.trsToRender = this.getSpecificRowsArrayByParameterValue();
      this.collapseShowTrDOMByFilteredArray();
      this.logsTableState.renderOption = null;
    }
  };

  getTargetsToRenderByParameterValueOpt = (
    parameterValue = null,
    parameterName = null,
  ) => {
    let { trsToRender, isRenderFiltered, bodyRowsArray } = this.logsTableState;
    const {
      getSpecificRowsArrayByParameterValueAndName,
      getSpecificRowsArrayByParameterValue,
      collapseShowTrDOMByFilteredArray,
    } = this;
    if (isRenderFiltered) {
      trsToRender = getSpecificRowsArrayByParameterValue();
      collapseShowTrDOMByFilteredArray();
      isRenderFiltered = false;
    }
    if (parameterValue) {
      if (parameterName) {
        trsToRender = getSpecificRowsArrayByParameterValueAndName(
          parameterValue,
          parameterName,
        );
        if (
          bodyRowsArray.length != trsToRender.length &&
          trsToRender.length > 0
        ) {
          this.logsTableState.trsToRender = trsToRender;
          this.logsTableState.isRenderFiltered = true;
          console.log(
            `getTargetsToRenderByParameterValueOpt: filtered array: `,
          );
          console.log(trsToRender);
          collapseShowTrDOMByFilteredArray();
        } else {
          SupportPageController.callPopUp(
            '',
            `По заданным критериям (${parameterValue}, ${parameterName}) не найдено логов`,
            2000,
          );
          console.log(
            `getTargetsToRenderByParameterValueOpt: filter has not been established`,
          );
          this.logsTableState.isRenderFiltered = false;
          collapseShowTrDOMByFilteredArray();
        }
      } else {
        trsToRender = getSpecificRowsArrayByParameterValue(parameterValue);
        if (
          bodyRowsArray.length != trsToRender.length &&
          trsToRender.length > 0
        ) {
          this.logsTableState.trsToRender = trsToRender;
          this.logsTableState.isRenderFiltered = true;
          console.log(
            `getTargetsToRenderByParameterValueOpt: filtered array: `,
          );
          console.log(trsToRender);
          collapseShowTrDOMByFilteredArray();
        } else {
          SupportPageController.callPopUp(
            '',
            `По заданному критерию (${parameterValue}) не найдено логов`,
            2000,
          );
          console.log(
            `getTargetsToRenderByParameterValueOpt: filter has not been established`,
          );
          this.logsTableState.isRenderFiltered = false;
          collapseShowTrDOMByFilteredArray();
        }
      }
    } else {
      this.logsTableState.isRenderFiltered = false;
      this.logsTableState.trsToRender = getSpecificRowsArrayByParameterValue();
      collapseShowTrDOMByFilteredArray();
      console.log(
        `Значение параметра для фильтрации не было задано! Фильтр очищен`,
      );
    }
  };

  makeFilterOptions = (key = null) => {
    const targetSelect = document.getElementById('filter-kibana-logs');

    if (targetSelect) {
      if (key == 'clean') {
        targetSelect.innerHTML = '<option value=""></option>';
      }
      this.logsTableState.bodyRowsArray.forEach((row, idx) => {
        if (row.parameterName == 'app_name') {
          if (
            this.logsTableState.bodyRowsArray
              .slice(idx + 1)
              .findIndex(
                remainRow => remainRow.parameterValue == row.parameterValue,
              ) == -1
          ) {
            targetSelect.innerHTML += `<option value="${row.parameterValue}">${row.parameterValue}</option>`;
          }
        }
      });
    }
  };
}

const elkController = new ELKLogsTableController();
elkController.initializeState();
elkController.makeFilterOptions();

const handleInstanceController = (
  isCheckBox = false,
  key = null,
  parameterName = null,
) => {
  console.log(
    `handleInstanceController: key is: ${key}, parameterName: ${parameterName}`,
  );
  console.log(`ELKLogsTableController: current state: `);
  console.log(elkController.getCurrentState());
  if (isCheckBox) {
    elkController.getTargetsToRenderByParameterValueOpt(key, parameterName);
  } else {
    elkController.getTargetsToRenderByParameterValueOpt();
  }
};

const onChangeListener = checkBoxNode => {
  console.log(`Catched event with parameter: ${checkBoxNode.checked}`);
  if (checkBoxNode.checked) {
    if (document.getElementById('filter-kibana-logs').value) {
      elkController.getTargetsToRenderByParameterValueOpt();
      handleInstanceController(
        true,
        document.getElementById('filter-kibana-logs').value,
        'app_name',
      );
    } else {
      elkController.getTargetsToRenderByParameterValueOpt();
    }
  } else {
    if (document.getElementById('filter-kibana-logs').value) {
      elkController.getTargetsToRenderByParameterValueOpt();
      handleInstanceController(
        true,
        document.getElementById('filter-kibana-logs').value,
        'app_name',
      );
    } else {
      elkController.getTargetsToRenderByParameterValueOpt();
    }
  }
};

const synchronizeStateWithDOM = () => {
  elkController.reInitializeState();
};
