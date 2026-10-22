const screen = document.getElementById("screen");
const expression = document.getElementById("expression");
const buttons = document.getElementById("buttons");

let current = "0";
let stored = null;
let operator = null;
let waitingForNumber = false;
let finished = false;

function updateDisplay() {
    screen.textContent = current;

    if (stored !== null && operator !== null) {
        expression.textContent =
            ${stored} ${getSymbol(operator)} ${waitingForNumber ? "" : current};
    } else {
        expression.textContent = "";
    }
}

function getSymbol(op) {
    return { "+": "+", "-": "−", "*": "×", "/": "÷" }[op];
}

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(Number(number.toPrecision(10)));
}

function inputDigit(digit) {
    if (current === "Error" || finished) {
        current = digit;
        stored = null;
        operator = null;
        waitingForNumber = false;
        finished = false;
        updateDisplay();
        return;
    }

    if (waitingForNumber) {
        current = digit;
        waitingForNumber = false;
    } else {
        current = current === "0" ? digit : current + digit;
    }

    updateDisplay();
}

function inputDecimal() {
    if (current === "Error" || finished) {
        current = "0.";
        stored = null;
        operator = null;
        waitingForNumber = false;
        finished = false;
    } else if (waitingForNumber) {
        current = "0.";
        waitingForNumber = false;
    } else if (!current.includes(".")) {
        current += ".";
    }

    updateDisplay();
}

function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return b === 0 ? NaN : a / b;
        default:
            return b;
    }
}

function chooseOperator(nextOperator) {
    if (current === "Error") return;

    const input = Number(current);

    if (operator !== null && !waitingForNumber) {
        const result = calculate(stored, input, operator);
        current = formatNumber(result);

        if (current === "Error") {
            stored = null;
            operator = null;
            updateDisplay();
            return;
        }

        stored = Number(current);
    } else {
        stored = input;
    }

    operator = nextOperator;
    waitingForNumber = true;
    finished = false;
    updateDisplay();
}

function showResult() {
    if (operator === null || stored === null ||
        waitingForNumber || current === "Error") {
        return;
    }

    const a = stored;
    const b = Number(current);
    const op = operator;
    const result = calculate(a, b, op);

    expression.textContent =
        ${a} ${getSymbol(op)} ${b} =;

    current = formatNumber(result);
    stored = null;
    operator = null;
    waitingForNumber = false;
    finished = true;

    updateResultDisplay();
}

function updateResultDisplay() {
    screen.textContent = current;
    // Keep the completed calculation visible above the result.
}

function clearCalculator() {
    current = "0";
    stored = null;
    operator = null;
    waitingForNumber = false;
    finished = false;
    updateDisplay();
}

function deleteDigit() {
    if (current === "Error" || finished) {
        clearCalculator();
        return;
    }

    if (waitingForNumber) return;

    current = current.length > 1
        ? current.slice(0, -1)
        : "0";

    if (current === "-") current = "0";

    updateDisplay();
}

function handleAction(action, value) {
    switch (action) {
        case "digit":
            inputDigit(value);
            break;
        case "decimal":
            inputDecimal();
            break;
        case "operator":
            chooseOperator(value);
            break;
        case "equals":
            showResult();
            break;
        case "clear":
            clearCalculator();
            break;
        case "delete":
            deleteDigit();
            break;
    }
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    handleAction(button.dataset.action, button.dataset.value);
});

document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputDigit(key);
    } else if (key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        showResult();
    } else if (key === "Backspace") {
        deleteDigit();
    } else if (key === "Escape" || key === "Delete") {
        clearCalculator();
    }
});
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        append(key);
    } 
    else if (["+", "-", "*", "/"].includes(key)) {
        append(key);
    } 
    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } 
    else if (key === "Backspace") {
        event.preventDefault();
        deleteLast();
    } 
    else if (key === "Escape") {
        const clearButton = [...document.querySelectorAll("button")]
            .find(button => button.textContent.trim() === "AC");

        if (clearButton) clearButton.click();
    }
});
    