import { draw_curve } from "./graph_new.js";
import { clear_canvas} from "./graph_new.js";
import { zoom_canvas } from "./graph_new.js";
import { move_canvas} from "./graph_new.js";
import { Lexer } from "./parser.js";
import { Parser } from "./parser.js";
import { ToFunction } from "./parser.js";
import { evaluate } from "./parser.js";
import { Node } from "./node_class.js";

const add_equation = document.getElementById("equation-add");
const sidebar = document.getElementById("sidebar");
const sidebar_reveal = document.getElementById("sidebar-reveal");
const equations = Array.from(document.querySelectorAll(".equation"));
const canvas = document.getElementById("plot");
const node_maker = new Node()
const temp_lexer = new Lexer() // not very temporary if it's a constant

let temp_parser = new Parser() // remove later
let temp_toFunction = new ToFunction()

let nodes = new Map()
let variables = {}
let equation_count = equations.length; // how many equations currently exist. important for creating new equations with appropriate ids.    
for (let i = 0; i < equations.length; i++) { // fixes equations that already existed
    let pl_formula = document.querySelector(`.equation-formula[id='${i}']`)
    pl_formula.addEventListener("input", () => {
        draw_all()
    });

    let pl_delete = document.querySelector(".equation-delete[id=\"" + i + "\"]");
    pl_delete.addEventListener("click", delete_equation);

    let pl_color = document.querySelector(".equation-color[id=\"" + i + "\"]");
    pl_color.addEventListener("click", pick_color);
}

/**
 * draws every equation active right now.
 */
function draw_all() {
    clear_canvas();

    equations.forEach(equation => {
        let id = equation.id
        let pl_formula = document.querySelector(`.equation-formula[id='${id}']`)
        // check if its a variable equation
        let result = temp_lexer.tokenize(pl_formula.value, ['x']) 
        if (result[0].type == "undef" && result[1].type == "=") {
            // equation is a variable definition.
            console.log("in");
            let var_value = evaluate((pl_formula.value).substring(pl_formula.value.indexOf("=") + 1), variables, false, false, true, false)[0] // what a mess.
            console.log(var_value);
            let key = result[0].value
            variables[key] = var_value;
        } else {draw_curve(pl_formula.value, variables)}

    });
}

function pick_color() {
    console.log("color picker should've opened");
    // add color picker at mouse
};

/**
 * removes a equation depending on what the HTMLElement's id is.
 */
function delete_equation(event) {
    let delete_id = event.target.id;
    let delete_equation = equations[delete_id];
    delete_equation.remove();
    equations.splice(delete_id, 1);
    equation_count--

    // make sure other equation id's are moved accordingly
    for (let i = delete_id; i < equation_count; i++) {
        let fix_equation = equations[i];
        fix_equation.id -= 1
        // fix children
        let children = fix_equation.children;
        for (let j = 0; j < children.length; j++) {
            children[j].id -= 1
        }
    }
    
    draw_all();

    console.log("removed equation. " + (equation_count+1) + " --> " + equation_count);
};

/**
 * makes a new equation.
 */
function create_equation() {
    let new_equation = document.createElement("div");
    new_equation.setAttribute("class", "equation");
    new_equation.setAttribute("id", equation_count);

    let new_equation_color = document.createElement("div");
    new_equation_color.setAttribute("class", "equation-color")
    new_equation_color.setAttribute("id", equation_count);
    new_equation_color.addEventListener("click", pick_color);

    let new_equation_delete = document.createElement("button");
    new_equation_delete.setAttribute("class", "equation-delete");
    new_equation_delete.setAttribute("id", equation_count);
    new_equation_delete.addEventListener("click", delete_equation);

    let new_equation_formula = document.createElement("input");
    new_equation_formula.setAttribute("input", "text");
    new_equation_formula.setAttribute("class", "equation-formula");
    new_equation_formula.setAttribute("id", equation_count);
    new_equation_formula.addEventListener("input", () => {update_tree(new_equation_formula.value); draw_all()});

    new_equation.appendChild(new_equation_color);
    new_equation.appendChild(new_equation_delete);
    new_equation.appendChild(new_equation_formula);
    sidebar.insertBefore(new_equation, add_equation);

    // equations.push(new_equation); // the equation's id is it's index in the "equations" array.
};

function update_tree(equation) {
    let tokens = temp_lexer.tokenize(equation)
    let dependencies = []
    tokens.forEach(element => {
        // yknow, if i have to put tokens_types.UNDEFINED's value manually, why have that thing anyways?
        if (element.type == "undef") {dependencies.push(element.value)}
    });
    if (tokens[0].type == "undef" && tokens[1].type == "=") {
        let dependent_entries = [...nodes].filter(([key, node]) => 
            node.dependencies.includes(tokens[0].value)
        );
        // man.. is my code really that good?
        let tree = temp_parser.parse(temp_lexer.tokenize(equation.substring(equation.indexOf("=") + 1) + "+0"))
        nodes.set(tokens[0].value, {type: "variable",
                                    name: tokens[0].value,
                                    value: temp_toFunction.convert(tree),
                                    dependencies: [dependencies.slice(1)], // get rid of the first entry because it's the variable itself
                                    dependents: dependent_entries})
    }
    // ugh..

}

/**
 * handles zooming.
 */
canvas.addEventListener("wheel", (event) => {
    if (event.deltaY > 0) { // zoom out
        console.log("zoomed out")
        zoom_canvas(-1)
    } else { // zoom in
        console.log("zoomed in")
        zoom_canvas(1)
    }
    draw_all()
})

let previousX = 0;
let previousY = 0;
let isDragging = false;

// all of these handle moving the canvas around.

canvas.addEventListener("mousedown", (event) => {
    isDragging = true;
    previousX = event.clientX;
    previousY = event.clientY;
});

canvas.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - previousX;
    const deltaY = event.clientY - previousY;
    move_canvas(deltaX, deltaY);
    draw_all();

    // update values for next event
    previousX = event.clientX;
    previousY = event.clientY;
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});

add_equation.addEventListener("click", () => {
    create_equation()
    console.log("added equation. " + equation_count + " --> " + ++equation_count);
});

sidebar_reveal.addEventListener("click", () => {
    if (sidebar.className.includes("on")) { // apparently sidebar.className by itself doesn't work, you have to use sidebar.className.includes
        sidebar.classList.replace('on', 'off')
    } else {
        sidebar.classList.replace('off', 'on')
    }
});

update_tree("a = 3")