const display = document.querySelector('.display');
const displayAll = document.querySelector('.display-all');
const calculator = document.querySelector('.calculator');
let data = {
  isBackOperator:false,
  isCalculated: true,
  lastTypedKey:'',
};
const getKeyType = (key) => {
  const { action } = key.dataset;
  if (!action) return 'number';
  if (
    action === 'add' ||
    action === 'subtract' ||
    action === 'multiply' ||
    action === 'divide'
  ) return 'operator';
  return action;
};
const resizeText = () => {
  for (var i = 30; i < 56; i++) {
    display.style.fontSize = i + 'px';
    if (display.scrollWidth > calculator.clientWidth) {
        display.style.fontSize = (i-4) + 'px';
        break;
    }
  }
};
const addComma = (isAdd) => {
  if (isAdd) {
    let parts = display.textContent.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    display.textContent = parts.join('.');
  }else {
    display.textContent = display.textContent.replace(/,/g, '');
  }
};

document.querySelector('.num-pad').addEventListener('click',function(e){
  const key = e.target;
  if (key.classList[0] === 'num') {
    addComma(false);
    let keyType = getKeyType(key);
    let keyContent = key.textContent;
    if (keyType === 'number') {
      if (keyContent.includes('0')) {
        if (data.lastTypedKey === 'operator' || display.textContent === '0'){
            display.textContent = '0';
            if(displayAll.textContent.endsWith('0')){
                displayAll.textContent += '';
            } else {
                displayAll.textContent += '0';
            }
        } else {
            display.textContent += keyContent;
            displayAll.textContent += keyContent;
        }
      }else if(display.textContent === '0' || data.lastTypedKey === 'operator'){
        if (display.textContent === '-') {
          display.textContent += keyContent;
        }else {
          display.textContent = keyContent;
        }
        if(displayAll.textContent.endsWith('0')){
            displayAll.textContent = displayAll.textContent.slice(0, -1) + keyContent;
        } else {
            displayAll.textContent += keyContent;
        }
      } else {
          display.textContent += keyContent;
          displayAll.textContent += keyContent;
      }
    }
    if (keyType === 'decimal') {
      if (data.lastTypedKey === 'operator') {
        display.textContent = '0.';
        displayAll.textContent += '0.';
      }else if (!display.textContent.includes('.')) {
        display.textContent += '.';
        displayAll.textContent += '.';
      }
    }
    if (keyType === 'operator') {
      if (data.lastTypedKey === 'decimal') {
        display.textContent = display.textContent.slice(0, -1);
        displayAll.textContent = displayAll.textContent.slice(0, -1);
      }
      if (data.lastTypedKey === 'operator') {
        displayAll.textContent = displayAll.textContent.slice(0, -3);
      }
      if (key.dataset.action === 'add') {
        displayAll.textContent += ' + ';
      }
      if (key.dataset.action === 'subtract') {
        displayAll.textContent += ' - ';
        if (display.textContent === '0') {
          display.textContent = '-';
        }
      }
      if (key.dataset.action === 'multiply') {
        displayAll.textContent += ' × ';
      }
      if (key.dataset.action === 'divide') {
        displayAll.textContent += ' ÷ ';
      }
    }
    if (keyType === 'clear') {
      displayAll.textContent = '';
      display.textContent = '0';
    }
    if (keyType === 'back') {
      data.isBackOperator = false;
      if (data.lastTypedKey === 'calculate' || display.textContent === '0' && displayAll.textContent === '' || display.textContent.length === 1) {
        displayAll.textContent = '';
        display.textContent = '0';
      } else if (displayAll.textContent.endsWith(' ')) {  // 如果以空格結尾，表示是 operator
        displayAll.textContent = displayAll.textContent.slice(0, -3);
        data.isBackOperator = true;
      } else {
        displayAll.textContent = displayAll.textContent.slice(0, -1);
        display.textContent = display.textContent.slice(0, -1);
      }
    }
    if (keyType === 'calculate') {
      let ev = eval;
      if (data.lastTypedKey === 'number' && displayAll.textContent.length >= 5 && !displayAll.textContent.endsWith(' ')) {
        display.textContent = ev(displayAll.textContent.replace(/×/g, '*').replace(/÷/g, '/').replace(/ /g, ''));
      }else {
        keyType = data.lastTypedKey;
      }
    }
    data.lastTypedKey = data.isBackOperator ? 'number' : keyType;
    resizeText();
    addComma(true);
  }
});