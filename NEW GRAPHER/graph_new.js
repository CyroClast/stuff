

// default range for graph
const minX = -10;
const maxX = 10;
const minY = -10
const maxY = 10;

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * draws the function's curve onto the plot depending on func.
 * @param {string} func the expression of the function.
 * 
 * @returns {graph} 
 */
export function draw_curve(func) {
    plot_CTX.clearRect(0, 0, plot.width, plot.height);
    plot_CTX.beginPath();

    let mathX;
    let mathY;

    let percentX;
    let percentY;

    for (let i = 0; i < lines; i++) {
        percentX = i/lines;
        // parser.eval(func)
        mathX = (maxX - minX)*percentX + minX;

        mathY = Math.sin(mathX**2);
        percentY = (mathY - minY) / (maxY - minY);
        percentY = 1 - percentY

        x = plot.width * percentX;
        y = plot.height * percentY;

        plot_CTX.lineTo(x, y);
    }
    plot_CTX.stroke();
}