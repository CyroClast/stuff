let equations = document.getElementById("equations"),
addExpression = document.getElementById("add"),
removeExpression = document.getElementById("remove"),
addVariable = document.getElementById("create-variable"),
userVariables = document.getElementById("user-variables"),
plot = document.getElementById("plot"),
expressionCount = 0;

let lines = 10000; // accuracy of the grapher (change it for higher accuracy)

// this is the "range" the program will calculate with
let xMin = -10,
    xMax = 10,
    yMin = -10,
    yMax = 10;

let math = mathjs(),
    expr = "",
    scope = { x: 0 },
    tree = math.parse(expr, scope);

function evalMathExpression(mathX) {
    scope.x = mathX;
    return tree.eval();
}

function drawCurve(canvas, ctx) {
    let percentX, percentY, mathX, mathY, x, y
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();

    for (let i = 0; i < lines; i++) {
        percentX = i / (lines-1);
        mathX = (percentX * (xMax - xMin)) + xMin;

        mathY = evalMathExpression(mathX);
        percentY = (mathY - yMin) / (yMax - yMin);
        percentY = 1 - percentY;

        x = canvas.width * percentX;
        y = canvas.height * percentY;
        ctx.lineTo(x, y);
    }

    ctx.stroke();
}

// lets the user add variables
addVariable.addEventListener("click", () => {
    // new variable stuff
    variableInput = document.getElementById("variable-name");
    variableName = variableInput.value;
    console.log(scope[variableName]);

    if (variableName.length === 1 && variableName !== " ") { // error detection
        if (scope[variableName] === undefined) {
            scope[variableName] = 0;

            // element creation
            let variableDiv = document.createElement("div");
            let variableP = document.createElement("p");
            let inputRange = document.createElement("input");
            let removeButton = document.createElement("button");
            
            variableDiv.id = "div-" + variableName;
            variableP.innerText = variableName;
            inputRange.type = "range";
            inputRange.id = "range-" + variableName;
            removeButton.innerText = "remove variable";
            removeButton.id = variableName;

            // appending the paragraph and range to the variable's div.
            variableDiv.appendChild(variableP);
            variableDiv.appendChild(inputRange);
            variableDiv.appendChild(removeButton);
            userVariables.appendChild(variableDiv);

            // detect variable change
            inputRange.addEventListener("input", (event) => {
                let inputRange = event.target
                let inputRangeVariable = inputRange.id;

                // set the scope of the input ranges' variable to its new value
                scope[inputRangeVariable] = parseInt(inputRange.value);

                // update each plot
                for (let i = 1; i <= expressionCount; i++) {
                    let redrawCanvas = plot.querySelector("#canvas-equation-" + i);
                    let redrawCanvasCtx = redrawCanvas.getContext("2d");
                    let redrawExpression = equations.querySelector("#equation-" + i);

                    console.log(scope);
                    console.log(math.parse((redrawExpression.value), scope));
                    drawCurve(redrawCanvas, redrawCanvasCtx);
                }

            });

            // variable removal
            removeButton.addEventListener("click", (event) => {
                let targetVariableName = event.target.id; // works
                let targetVariableDiv = userVariables.querySelector("#div-" + targetVariableName);
                targetVariableDiv.remove();
            });

        } else {
            console.log("error, variable already exists.")
        }

    } else {
        console.log("cannot create variables that are not 1 character in length.")
    }
});

// lets the user create new equations with the "new equation" button.
addExpression.addEventListener("click", () => {
    // add a new input box, then give it an ID and name.
    expressionCount++;
    console.log(expressionCount);
    let newEquation = document.createElement("input");
    newEquation.setAttribute("name", "equation");
    newEquation.setAttribute("id", "equation-" + expressionCount);
    equations.appendChild(newEquation);

    // add a canvas, then give it an ID and name.
    let newCanvas = document.createElement("canvas");
    newCanvas.setAttribute("name", "canvas");
    newCanvas.setAttribute("id", "canvas-equation-" + expressionCount);
    plot.appendChild(newCanvas);

    newEquation.addEventListener("input", (event) => {
        // finds the equation's respective canvas element.
        expr = event.target.value;
        tree = math.parse(expr, scope);
        let targetID = event.target.id;
        let selector = "#canvas-" + targetID;
        let targetCanvas = plot.querySelector(selector);
        let targetCtx = targetCanvas.getContext("2d");
        drawCurve(targetCanvas, targetCtx);
    });
});

removeExpression.addEventListener("click", () => {
    if (expressionCount > 0) {
        let selector = "#equation-" + expressionCount;
        let latestEquation = equations.querySelector(selector);
        latestEquation.remove();
    
        selector = "#canvas-equation-" + expressionCount;
        let latestCanvas = plot.querySelector(selector);
        latestCanvas.remove();
    
        expressionCount--;
    } else {
        console.log("you cannot remove non-existant equations.");
    }
});