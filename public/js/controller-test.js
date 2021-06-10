class TestInputController {
  state = {
    textFromTargetInput: "de",
    textToTargetDisplay: "gg",
    displayElement: document.getElementById("targetForDataTest"),
      rootDOMElement: document.getElementById('root')
  };
  setChangeListener = () => {
    document.getElementById("root").addEventListener("change", event => {
      console.log(`Catched event change, event data: `);
      console.log(event);
      if (event.target.id == "bundleInpTest") {
        this.setStateParameter(event.target.value, "textFromTargetInput");
        this.setStateParameter(event.target.value, "textToTargetDisplay");
        this.synchronizeStateWithDOM();
        this.renderHTML();
      }
    });

    document.getElementById("root").addEventListener("input", event => {
      console.log(`Catched event input, event data: `);
      console.log(event);
      if (event.target.id == "bundleInpTest") {
        this.setStateParameter(event.target.value, "textFromTargetInput");
        this.setStateParameter(event.target.value, "textToTargetDisplay");
        this.synchronizeStateWithDOM();
        this.renderHTML();
      }
    });
    console.log(`Change listener on element with id root has been attached`);
  };

  synchronizeStateWithDOM = () => {
    this.state.displayElement.innerText = this.state.textToTargetDisplay;
  };

  getState = () => {
    return this.state;
  };

  startListen = () => {
    this.setChangeListener();
  };

  getStateParameterValueByName = parameterName => {
    for (let key in this.state) {
      if (key == parameterName) {
        return this.state[parameterName];
      }
    }
  };
  setStateParameter = (value, parameterName) => {
    for (let key in this.state) {
      if (key == parameterName) {
        if (this.state[key] != value) this.state[key] = value;
      }
    }
  };
  renderHTML() {
      const currentStateHTML =  !document.getElementById('elk_tempCont_2') ? `<div id="elkDataPanelContainer" class="buttons-block-data-panel position-b43-r442px">
  <span class="span-info-header">Данные по сервисам: </span>
  <div class="params-block">
    <span class="kibana-checkbox-label">${this.state.textToTargetDisplay}: </span
    ><span class="attribute-value">10 логов</span>
  </div>
  <div class="params-block">
    <span class="kibana-checkbox-label">${this.state.textToTargetDisplay}: </span
    ><span class="attribute-value">25 логов</span>
  </div>
  <div class="params-block">
    <span class="kibana-checkbox-label">${this.state.textToTargetDisplay}: </span
    ><span class="attribute-value">12 логов</span>
  </div>
  <div class="params-block">
    <span class="kibana-checkbox-label">${this.state.textToTargetDisplay}: </span><span class="attribute-value">5 логов</span>
  </div>
</div>
<input id="bundleInpTest" type="text">` : `<div id="elkDataPanelContainer" class="buttons-block-data-panel position-b43-r442px">
  <span class="span-info-header">Данные по сервисам: </span>
  <div class="params-block">
    <span class="kibana-checkbox-label">${this.state.textToTargetDisplay}: </span
    ><span class="attribute-value">10 логов</span>
  </div>
  <div class="params-block">
    <span class="kibana-checkbox-label">${this.state.textToTargetDisplay}: </span
    ><span class="attribute-value">25 логов</span>
  </div>
  <div class="params-block">
    <span class="kibana-checkbox-label">${this.state.textToTargetDisplay}: </span
    ><span class="attribute-value">12 логов</span>
  </div>
  <div class="params-block">
    <span class="kibana-checkbox-label">${this.state.textToTargetDisplay}: </span><span class="attribute-value">5 логов</span>
  </div>
</div>`;
      if (!document.getElementById('elk_tempCont_2')) {
          const newDivContainer = document.createElement('div');
          newDivContainer.id = 'elk_tempCont_2';
          newDivContainer.style.position = 'fixed';
          newDivContainer.style.zIndex = '1050';
          newDivContainer.innerHTML = currentStateHTML;
          newDivContainer.classList.add('position-b43-r442px');
          this.state.rootDOMElement.appendChild(newDivContainer);
          console.log(`parsed document: `);
          console.log(newDivContainer);
      } else {
          document.getElementById('elkDataPanelContainer').innerHTML = currentStateHTML;
      }

  }

}
// const testController = new TestInputController();
// testController.renderHTML();
// testController.startListen();

