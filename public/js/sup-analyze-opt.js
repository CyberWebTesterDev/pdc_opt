class AnalyzeSupportOpt {
  constructor() {
    this.applicationState = {
      isIntegrationError: false,
      tasks: {
        taskNameFailure: '',
        startTimeTaskFailed: '',
        currentActivityState: {
          activityType: '',
          startTime: '',
          isIntermediate: false,
          stateDescription: '',
          nullStateCounter: 0,
          nullStateIndexes: [],
          intermediateStateCounter: 0,
        },
        errorActivityState: {
          currentErrorAtivityName: 'Нет',
          errorStateEntryCounter: 0,
          errorActivities: [],
          rowsIndexes: [],
        },
      },
    };
  }

  analyzeTasks() {
    const taskTable = document.getElementById('processData');
    const tableId = taskTable ? 'processData' : 'tasksArchData';
    const tbody = document.querySelector(`${tableId} > tbody`);
    const rows = tbody.children;
    const rowCount = rows.length;
    const tdCount = rows[1].children.length;

    for (let i = 1; i < rowCount; i++) {
      const tds = rows[i].children;

      for (let idx = 0; idx < tdCount; idx++) {
        const value = tds[idx].innerText;

        if (value === '2') {
          this._handleErrorState(tds, i);
        }

        if (value === '0') {
          this._handleNullState(tds, i);
        }

        if (value === '1' && i === 1) {
          this.applicationState.tasks.currentActivityState.stateDescription = 'Нет активных задач';
        }

        if (value === 'intermediateConditional') {
          this.applicationState.tasks.currentActivityState.intermediateStateCounter++;
        }
      }
    }
  }

  _handleErrorState(tds, rowIndex) {
    const limit = rowIndex <= (rowCount > 10 ? 7 : 5);
    const name = this._getActivityName(tds);

    if (limit) {
      this.applicationState.tasks.errorActivityState.currentErrorAtivityName = name;
    }

    this.applicationState.tasks.errorActivityState.errorStateEntryCounter++;
    this.applicationState.tasks.errorActivityState.rowsIndexes.push(rowIndex);
  }

  _handleNullState(tds, rowIndex) {
    const isIntermediate = tds[4].innerText === 'intermediateConditional';
    const description = isIntermediate ? 'Зависание' : `Тип активности ${tds[4].innerText}`;

    this.applicationState.tasks.currentActivityState.isIntermediate = isIntermediate;
    this.applicationState.tasks.currentActivityState.stateDescription = description;
    this.applicationState.tasks.currentActivityState.activityType = tds[4].innerText;
    this.applicationState.tasks.currentActivityState.nullStateCounter++;
    this.applicationState.tasks.currentActivityState.nullStateIndexes.push(rowIndex);
  }

  _getActivityName(tds) {
    return this.tableId === 'processData' ? tds[3].innerText : tds[2].innerText;
  }

  checkIntegrationLogs() {
    const logTable = document.querySelector('#integrationLogData');
    if (!logTable) {return;}

    const rows = logTable.querySelectorAll('tbody tr');
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].children;
      if (cells[6].innerText) {
        this.applicationState.isIntegrationError = true;
        break;
      }
    }
  }

  renderHTML() {
    const container = document.getElementById('process-stat');
    if (container) {
      container.innerHTML = this.createInformationalPanelByApplicationState();
    }
  }

  createInformationalPanelByApplicationState() {
    return `
       <div class="container-flex" id="parentDiv">
       <label>Сводка по BPM процессу заявки</label>
       <div class="row" id="childDiv">
       <div class="col gray-border">Текущее состояние процесса</div>
       <div class="col gray-border light-green">${this.applicationState.tasks.currentActivityState.stateDescription}</div>
        <div class="w-100"></div>
       <div class="col gray-border">Последняя задача в ошибке</div>
       <div class="col gray-border light-green">${this.applicationState.tasks.errorActivityState.currentErrorAtivityName}</div>
       <div class="w-100"></div>
       <div class="col gray-border">Количество зависаний заявки</div>
       <div class="col gray-border light-green">${this.applicationState.tasks.currentActivityState.intermediateStateCounter}</div>
       <div class="w-100"></div>
       <div class="col gray-border">Количество завершенных с ошибкой задач</div>
       <div class="col gray-border light-green">${this.applicationState.tasks.errorActivityState.errorStateEntryCounter}</div>
       <div class="w-100"></div>
       <div class="col gray-border">Имя задач(и), завершенных(ой) с ошибкой в порядке убывания</div>
       <div class="col gray-border light-green">${this.applicationState.tasks.errorActivityState.errorActivities.join(', ')}</div>
       <div class="w-100"></div>
       <div class="col gray-border">Есть ли в интеграционных логах ошибка?</div>
       <div class="col gray-border light-green">${this.applicationState.isIntegrationError ? 'Да' : 'Нет'}</div>
       </div>
       </div>`;
  }

  startAnalyze() {
    this.analyzeTasks();
    this.checkIntegrationLogs();
    this.renderHTML();
  }
}

const supportOpt = new AnalyzeSupportOpt();
supportOpt.startAnalyze();
