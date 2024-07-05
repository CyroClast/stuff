import { draw_curve } from "./graph_new.js"

const add_equation = document.getElementById("equation-add");
const sidebar = document.getElementById("sidebar")
const equations = Array.from(document.querySelectorAll(".equation"));

let equation_count = equations.length; // how many equations currently exist. important for creating new equations with appropriate ids.    

for (let i = 0; i < equations.length; i++) { // fixes equations that already existed
    let placeholder = document.querySelector(".equation-formula[id=\"" + i + "\"]");
    placeholder.addEventListener("change", draw_curve);

    placeholder = document.querySelector(".equation-delete[id=\"" + i + "\"]");
    placeholder.addEventListener("click", delete_equation);

    placeholder = document.querySelector(".equation-color[id=\"" + i + "\"]");
    placeholder.addEventListener("click", pick_color);
}

draw_curve();

function pick_color() {
    console.log("color picker should've opened");
    // add color picker at mouse
};

/**
 * removes the equation that the caller's part of, and decreases equationCount by 1. if equationCount is 0, the function will raise an error.
 */
function delete_equation() {

};
/**
 * makes a new equation under the parent element.
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
    new_equation_delete.addEventListener("click", delete_equation)

    let new_equation_formula = document.createElement("input");
    new_equation_formula.setAttribute("input", "text");
    new_equation_formula.setAttribute("class", "equation-formula");
    new_equation_formula.setAttribute("id", equation_count);
    new_equation_formula.addEventListener("onkeydown", draw_curve);

    new_equation.appendChild(new_equation_color);
    new_equation.appendChild(new_equation_delete);
    new_equation.appendChild(new_equation_formula);
    sidebar.insertBefore(new_equation, add_equation);

    equations.push(new_equation); // the equation's id is it's index in the "equations" array.
};

add_equation.addEventListener("click", () => {
    create_equation()
    console.log("added equation. " + equation_count + " --> " + ++equation_count);
});