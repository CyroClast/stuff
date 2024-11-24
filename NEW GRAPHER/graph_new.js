import { evaluate } from "./parser.js";

// default range for graph
// todo: add logarithmic view and other views (squared view?)
let minX = -10;
let maxX = 10;
let minY = -10
let maxY = 10;

// number of lines used for the graph
const lines = 1000; // DO NOT SET EQUAL TO ZERO

// variables for x and y
let x = 0;
let y = 0;

// the plot is the size of the document, so (hopefully) there wont be any size complications
const plot = document.getElementById("plot");
const plot_CTX = plot.getContext("2d"); // 2d for now..

// fixes the plot's area so that it doesn't have odd resolutions when scaling in css
plot.width = screen.availWidth;
plot.height = screen.availHeight;

/**
 * draws the function's curve onto the plot depending on func.
 * @param {string} func the expression of the function.
 * 
 * @returns {graph} 
 */
export function draw_curve(func, vars) {
    plot_CTX.beginPath();

    let mathX;
    let mathY;
    let prevMathY = maxY;
    let percentX;
    let percentY;

    for (let i = 0; i <= lines; i++) {
        percentX = i/lines;
        mathX = (maxX - minX)*percentX + minX;

        // idea: instead of draw_curve calling evaluate every time, equation_handler "stores" equations, reducing computation time
        // only problem is i dont know how to store an equation, and calling evaluator() wont do much to fix it.
        mathY = evaluate(func, { ...{x: mathX}, ...vars}, false, false, true, false);
        // prevent drawing vertical asymptotes (if the change in mathY is wayy too high)
        if (Math.abs(mathY - prevMathY) > Math.abs(minX) + Math.abs(maxX) || mathY == NaN) {
            prevMathY = mathY;
            plot_CTX.stroke();
            plot_CTX.beginPath(); // helps prevent artifacts when drawing curves with vertical asymptotes
            continue;
        }

        percentY = (mathY - minY) / (maxY - minY);
        percentY = 1 - percentY

        x = plot.width * percentX;
        y = plot.height * percentY;
        prevMathY = mathY;

        plot_CTX.lineTo(x, y);
    }
    plot_CTX.stroke();
}

/**
 * clears the canvas. use this when you draw on the canvas to avoid screen persistence
 */
export function clear_canvas() {
    plot_CTX.clearRect(0, 0, plot.width, plot.height);
    console.log("canvas cleared")
}

/**
 * zooms in on the canvas.
 * @param {int} zoom whether you're zooming in (1) or out (-1). i haven't tested putting in other numbers.
 */
export function zoom_canvas(zoom) { // todo: make it zoom towards the CURSOR.
    let zoom_level = 2**(1/5*(zoom));

    minX = minX / zoom_level;
    maxX = maxX / zoom_level;
    minY = minY / zoom_level;
    maxY = maxY / zoom_level;
}

/**
 * moves the canvas by x and y.
 * @param {*} x how much the canvas moves in the x direction (moving right is positive)
 * @param {*} y how much the canvas moves in the y direction (moves down is positive)
 */
export function move_canvas(x, y) {
    // convert x and y so the plot moves the correct amount
    let dx = x * (Math.abs(maxX - minX))/window.innerWidth
    let dy = y * (Math.abs(maxY - minY))/window.innerHeight

    minX -= dx // you have to subtract x because otherwise it'll drag the canvas the wrong way
    maxX -= dx
    minY += dy
    maxY += dy
}