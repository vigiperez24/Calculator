const display = document.querySelector(".display-container h1");
const buttons = document.querySelectorAll(".btn");
let clickAudio = new Audio("audio/clickEffect.mp3");
let currentInput = "";
let operator = "";
let previousInput = "";

// Function  mag-format ng number na may comma (e.g., 1,000)
function formatNumber(num) {
    return new Intl.NumberFormat("en-US").format(num);
}


// Live clock
function updateClock() {
    const clockElement = document.querySelector(".clock");
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Formatting ng oras (AM/PM format)
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    clockElement.textContent = `${hours}:${minutes} ${ampm}`;
}


updateClock();
// Mag-update kada 1 segundo
setInterval(updateClock, 1000);

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.value;
        console.log(`Button clicked: ${value}`);

        clickAudio.play(); // I-play ang tunog
        
        // CLEAR (C) BUTTON
        if (value === "C") {
            currentInput = "";
            operator = "";
            previousInput = "";
            display.textContent = "0";
          
            console.log("Cleared all values");
        } 
        
        // NUMBER or DECIMAL POINT
        else if (!isNaN(value) || value === ".") {
            currentInput += value;
            display.textContent = formatNumber(currentInput);
          
            console.log(`Current Input: ${currentInput}`);
        } 
        
        // OPERATOR (+, -, x, ÷, %)
        else if (["+", "-", "x", "÷", "%"].includes(value)) {
            if (currentInput === "") return;
            
            // Percentage Fix: Convert currentInput to percentage
            if (value === "%") {
                currentInput = (parseFloat(currentInput) / 100).toString();
                display.textContent = formatNumber(currentInput);
              
                console.log(`Percentage Calculated: ${currentInput}`);
                return;
            }
            
            operator = value;
            previousInput = currentInput;
            currentInput = "";
            console.log(`Operator selected: ${operator}`);
            console.log(`Previous Input: ${previousInput}`);
        } 
        
        // NEGATIVE/POSITIVE TOGGLE (+/-)
        else if (value === "+/-") {
            if (currentInput !== "") {
                currentInput = (parseFloat(currentInput) * -1).toString(); 
                display.textContent = formatNumber(currentInput);
              
                console.log(`Negate: ${currentInput}`);
            }
        }

        // EQUALS (=)
        else if (value === "=") {
            console.log("Computing result...");
            console.log(`Previous: ${previousInput}, Current: ${currentInput}, Operator: ${operator}`);

            if (previousInput !== "" && currentInput !== "" && operator !== "") {
                let num1 = parseFloat(previousInput.replace(/,/g, ""));
                let num2 = parseFloat(currentInput.replace(/,/g, ""));
                let result = 0;

                switch (operator) {
                    case "+":
                        result = num1 + num2;
                        break;
                    case "-":
                        result = num1 - num2;
                        break;
                    case "x":
                        result = num1 * num2;
                        break;
                    case "÷":
                        result = num2 !== 0 ? num1 / num2 : "Error";
                        
                        break;
                }

                display.textContent = formatNumber(result);
              
                currentInput = result.toString();
                previousInput = "";
                operator = "";
                console.log(`Result: ${formatNumber(result)}`);
            } else {
                console.log("Error: Incomplete operation");
            }
        }
    });
});
