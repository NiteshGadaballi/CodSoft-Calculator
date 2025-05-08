const input = document.getElementById('inputbox');
const buttons = document.querySelectorAll('button');

let expression = "";
const operators = ['+', '-', '*', '/', '×', '÷'];

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        handleInput(e.target.innerText);
    });
});

document.addEventListener('keydown', (e) => {
    let key = e.key;

    if ((key >= '0' && key <= '9') || ['+', '-', '*', '/', '%'].includes(key)) {
        handleInput(key);
    } else if (key === 'Enter') {
        handleInput('=');
    } else if (key === 'Backspace') {
        handleInput('←');
    } else if (key === 'Escape') {
        handleInput('AC');
    }
});

function handleInput(value) {
    if (value === "AC") {
        expression = "";
        input.value = "";
    } else if (value === "←") {
        expression = expression.slice(0, -1);
        input.value = expression;
    } else if (value === "=") {
        try {
            expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
            expression = processPercentage(expression);
            const result = eval(expression);
            input.value = result;
            expression = result.toString();
            if (expression.trim() !== "") {
                const historyItem = `${expression} = ${result}`;
                addToHistory(historyItem);
            }     
        } catch {
            input.value = "Error";
            expression = "";
        }   
    } else if (operators.includes(value) || value === '%') {
        if (expression === "") return;
        const lastChar = expression.slice(-1);
        if (operators.includes(lastChar) || lastChar === '%') return;
        expression += value;
        input.value = expression;
    } else {
        expression += value;
        input.value = expression;
    }
}

function processPercentage(expr) {
    const relativePercentagePattern = /(\d+)([+\-*/])(\d+)%/g;
    const standalonePercentagePattern = /(\d+)%/g;
    
    expr = expr.replace(relativePercentagePattern, (match, num1, op, num2) => {
        return `${num1}${op}(${num1}*${num2}/100)`;
    });
    
    expr = expr.replace(standalonePercentagePattern, (match, num) => {
        return `(${num}/100)`;
    });
    
    return expr;
}
function addToHistory(item) {
    const historyList = document.getElementById("historyList");
    const li = document.createElement("li");
    li.textContent = item;
    historyList.prepend(li);
}

document.getElementById("toggleHistoryBtn").addEventListener("click", () => {
    const historyDiv = document.getElementById("historySection");
    const btn = document.getElementById("toggleHistoryBtn");

    if (historyDiv.style.display === "none") {
        historyDiv.style.display = "block";
        btn.textContent = "Hide History";
    } else {
        historyDiv.style.display = "none";
        btn.textContent = "Show History";
    }
});
