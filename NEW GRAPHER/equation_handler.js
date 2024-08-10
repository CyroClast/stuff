import { draw_curve } from "./graph_new.js"

const add_equation = document.getElementById("equation-add");
const sidebar = document.getElementById("sidebar");
const sidebar_reveal = document.getElementById("sidebar-reveal");
const equations = Array.from(document.querySelectorAll(".equation"));

let equation_count = equations.length; // how many equations currently exist. important for creating new equations with appropriate ids.    

for (let i = 0; i < equations.length; i++) { // fixes equations that already existed
    let placeholder = document.querySelector(".equation-formula[id=\"" + i + "\"]");
    placeholder.addEventListener("input", draw_curve);

    placeholder = document.querySelector(".equation-delete[id=\"" + i + "\"]");
    placeholder.addEventListener("click", delete_equation);

    placeholder = document.querySelector(".equation-color[id=\"" + i + "\"]");
    placeholder.addEventListener("click", pick_color);
}

console.log(evaluate("2 + 2"))
draw_curve();

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

    draw_curve()

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
    new_equation_formula.addEventListener("input", draw_curve);

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

sidebar_reveal.addEventListener("click", () => {
    console.log();
    if (sidebar.className.includes("on")) { // apparently sidebar.className by itself doesn't work, you have to use sidebar.className.includes
        sidebar.classList.replace('on', 'off')
    } else {
        sidebar.classList.replace('off', 'on')
    }
});