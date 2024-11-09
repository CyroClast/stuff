/*
        expression
          {type: binary_expression,
           operator: (operator),
           right: (num)
           left: (num)}

    10 + 5

        +
    10      5

    10 + (3 * 5)

        +
    10      *
        3       5

*/
const token_types = {
    PLUS: "add",
    MINUS: "sub",
    MULTIPLY: "mul",
    DIVIDE: "div",
    MODULO: "mod",

    L_PAR: "(",
    R_PAR: ")",
    EQUAL: "=",
    NUMBER: "num",
    
    SINE: "sin",
    COSINE: "cos",
    TANGENT: "tan",
    SECANT: "sec",
    COSECANT: "csc",
    COTANGENT: "cot",
    ARCSINE: "arcsin",
    ARCCOSINE: "arccos",
    ARCTANGENT: "arctan",
    ARCSECANT: "arcsec",
    ARCCOSECANT: "arccsc",
    ARCCOTANGENT: "arccot",
    FLOOR: "floor",
    CEILING: "ceil",

    VARIABLE: "var",
    UNDEFINED: "undef",
    END_OF_FILE: "eof",
}

export class Lexer {
    ignore = false // setting to true inserts any unknowns as variables.
    /**
     * 
     * @param {string} input the expression to the tokenized
     * @param {array} variables the variables' names. ONLY the names; not [variable_name: value]
     * @returns 
     */
    tokenize(input = "", variables = []) { // eh
        const tokens = [];
        let match;

        if (variables && !variables.every(p => typeof p === 'string') || !Array.isArray(variables)) {
            throw new Error("the variables argument must be an array containing variables in string format (e.g ['x', 'alpha'])");
        }
        let base_regex = /\d+\.?\d*|[\+\-\*\/\(\)\=]|[^_\W]+/g; // fix this
        let var_regex = ""
        variables.forEach(element => {var_regex = var_regex + "|" + element});
        let combined_regex = base_regex.source + var_regex
        const real_regex = new RegExp(combined_regex, base_regex.flags);
        var_regex = new RegExp(var_regex.substring(1), base_regex.flags);
        if (Object.keys(variables).length == 0) {var_regex = /\b\B/}; // \b\B cannot match anything, because it's a contradiction.

        while (match = real_regex.exec(input)) {
            const matched_text = match;

            if (/-?\d/.test(matched_text)) {
                tokens.push({ type: token_types.NUMBER, value: parseFloat(matched_text) })
            } else if (var_regex.test(matched_text)) {
                tokens.push({ type: token_types.VARIABLE, value: matched_text[0]})
            } else if (/\+/.test(matched_text)) {
                tokens.push({ type: token_types.PLUS, value: "+" })
            } else if (/\-/.test(matched_text)) {
                tokens.push({ type: token_types.MINUS, value: "-" })
            } else if (/\*/.test(matched_text)) {
                tokens.push({ type: token_types.MULTIPLY, value: "*" })
            } else if (/\//.test(matched_text)) {
                tokens.push({ type: token_types.DIVIDE, value: "/" })
            } else if (/\%/.test(matched_text)) {
                tokens.push({ type: token_types.MODULO, value: "%"})
            } else if (/\(/.test(matched_text)) {
                tokens.push({ type: token_types.L_PAR, value: "("})
            } else if (/\)/.test(matched_text)) {
                tokens.push ({ type: token_types.R_PAR, value: ")"})
            } else if (/\=/.test(matched_text)) {
                tokens.push ({ type: token_types.EQUAL, value: "="})
            }

            else if (/sin/.test(matched_text)) {
                tokens.push({ type: token_types.SINE, value: "sin" });
            } else if (/cos/.test(matched_text)) {
                tokens.push({ type: token_types.COSINE, value: "cos" });
            } else if (/tan/.test(matched_text)) {
                tokens.push({ type: token_types.TANGENT, value: "tan" });
            } else if (/sec/.test(matched_text)) {
                tokens.push({ type: token_types.SECANT, value: "sec" });
            } else if (/csc/.test(matched_text)) {
                tokens.push({ type: token_types.COSECANT, value: "csc" });
            } else if (/cot/.test(matched_text)) {
                tokens.push({ type: token_types.COTANGENT, value: "cot" });
            } else if (/arcsin/.test(matched_text)) {
                tokens.push({ type: token_types.ARCSINE, value: "arcsin" });
            } else if (/arccos/.test(matched_text)) {
                tokens.push({ type: token_types.ARCCOSINE, value: "arccos" });
            } else if (/arctan/.test(matched_text)) {
                tokens.push({ type: token_types.ARCTANGENT, value: "arctan" });
            } else if (/arcsec/.test(matched_text)) {
                tokens.push({ type: token_types.ARCSECANT, value: "arcsec" });
            } else if (/arccsc/.test(matched_text)) {
                tokens.push({ type: token_types.ARCCOSECANT, value: "arccsc" });
            } else if (/arccot/.test(matched_text)) {
                tokens.push({ type: token_types.ARCCOTANGENT, value: "arccot" });
            } else if (/floor/.test(matched_text)) {
                tokens.push({ type: token_types.FLOOR, value: "floor" });
            } else if (/ceil/.test(matched_text)) {
                tokens.push({ type: token_types.CEILING, value: "ceil" });
            }

              else {tokens.push({type: token_types.VARIABLE, value: matched_text[0]})}
            // else {throw Error(`unrecognized token "${matched_text}". did you define it?`)}
        }
        
        tokens.push({ type: token_types.END_OF_FILE, value: null}); // this eof token is important. dont remove it.
        return tokens;
    }
}

export class Parser {
    type = "Formula";
    tokens = [];
    cursor = 0;

    at_cursor() {
        return  this.tokens[this.cursor];
    }

    is_bin(type) {
        return expression_tokens.includes(type);
    }

    peek(n = 1) {
        return this.tokens[this.cursor+n];
    }

    eat(token_type) { // token_type is to check nothing went wrong.
        if (token_type == this.at_cursor().type) {
            this.cursor++
        } else {
            throw new Error(`Expected the token at position ${this.cursor} to equal a ${token_type} token. (got ${this.at_cursor().type})`);
        }

    }

    // add & sub
    parse_expression() {
        let left = this.parse_term();

        while (this.at_cursor().type == token_types.PLUS || this.at_cursor().type == token_types.MINUS) { // generalize later
            let op = this.at_cursor().type
            let ttype = this.at_cursor().type
            this.eat(ttype);
            let right = this.parse_expression();
            left = {type: "BinaryOperator", operand: op, lhs: left, rhs: right};
        }

        return left;
    }

    // mul & div
    parse_term() {
        let left = this.parse_factor();

        while (this.at_cursor().type == token_types.MULTIPLY || this.at_cursor().type == token_types.DIVIDE) { // generalize later
            let op = this.at_cursor().type
            let ttype = this.at_cursor().type
            this.eat(ttype);
            let right = this.parse_term();
            left = {type: "BinaryOperator", operand: op, lhs: left, rhs: right};
        }

        return left;
    }

    // nums, parenthesis, equalities & functions
    parse_factor() {
        if (this.at_cursor().type == token_types.NUMBER || this.at_cursor().type == token_types.VARIABLE) {
            let literal = {type: this.at_cursor().type, value: this.at_cursor().value}
            this.eat(this.at_cursor().type);
            return literal
        } else if (this.at_cursor().type == token_types.L_PAR) {
            this.eat(token_types.L_PAR);

            let expr;

            while (this.at_cursor().type !== token_types.R_PAR) {
                expr = this.parse_expression();
            }

            this.eat(token_types.R_PAR);
            return expr;
        } else if (this.at_cursor().type == token_types.EQUAL) {
            if (expr.length > 1) {this.type = "Equality";} else {this.type = "Variable"} // if the length is 0, it'll return an error in the evaluator.
            if (this.type !== "Formula") {return Error("too many equalities in one equation.")} 
            let equality = this.at_cursor().type
            let left = expr
            let ttype = this.at_cursor().type
            this.eat(equality);
            let right = this.parse_term()
            left = {type: "Equality", op: ttype, lhs: left, rhs: right}
        } else { // assume it's a function
            let fun_type = this.at_cursor().type;
            this.eat(fun_type);
            // code expects parenthesis because telling whether "sin x" is acceptable over "sin(x)" is complicated
            this.eat(token_types.L_PAR);
            let expr;

            // i know this is just the parenthesis code but i cant jump to it unfortunately.
            while (this.at_cursor().type !== token_types.R_PAR) {
                expr = this.parse_expression();
            }

            this.eat(token_types.R_PAR);
            return {type: "UnaryOperator", operand: fun_type, inside: expr}
        }

        throw new Error(`Unrecognized token ${this.at_cursor().type} at position ${this.cursor}`);
    }

    parse(lexer_tokens) {
        this.tokens = lexer_tokens;
        return this.parse_expression()
    }
}

export class Evaluator {
    tree = {};
    vars = [];

    operate(func, input1, input2) {
        if (func === token_types.PLUS) {return input1 + input2;}
        if (func === token_types.MINUS) {return input1 - input2;}
        if (func === token_types.MULTIPLY) {return input1 * input2;}
        if (func === token_types.DIVIDE) {
            if (input2 === 0) {return Error("Division by zero is not allowed")};
            return input1 / input2;
        }
        if (func === token_types.MODULO) {
            if (input2 === 0) {return Error("Modulo by zero is not allowed")};
            return input1 % input2;
        }
        if (func === "sin") {return Math.sin(input1);}
        if (func === "cos") {return Math.cos(input1);}
        if (func === "tan") {return Math.tan(input1);}
        if (func === "sec") {return 1/Math.cos(input1);}
        if (func === "csc") {return 1/Math.sin(input1);}
        if (func === "cot") {return 1/Math.tan(input1);}
        if (func === "arcsin") {
            if (input1 < -1 || input1 > 1) {return Error("Input out of range for arcsin (-1 < x < 1)")};
            return Math.asin(input1);
        }
        if (func === "arccos") {
            if (input1 < -1 || input1 > 1) {return Error("Input out of range for arccos (-1 < x < 1)")};
            return Math.acos(input1);
        }
        if (func === "arctan") return Math.atan(input1);
        if (func === "arcsec") {
            if (input1 > -1 || input1 < 1) {return Error("Input out of range for arcsec (-1 > x < 1)")}
            return (Math.asin(1/input1))
        }
        if (func === "arccsc") {
            if (input1 > -1 || input1 < 1) {return Error("Input out of range for arccsc (-1 > x < 1)")}
            return (Math.acos(1/input1))
        }
        if (func === "arccot") {
            if (input1 >= 0) {return Math.atan(1/input1);}
            return (Math.atan(1/input1) + Math.PI);
        }
        if (func === "floor") return Math.floor(input1);
        if (func === "ceil") return Math.ceil(input1);
        return Error("Unknown function type");
    }

    calculate(parser_tree, variables = {}) {
        
        if (parser_tree.type == "var") {
            if (variables[parser_tree.value] == undefined) {throw Error(`the variable ${parser_tree.value} does not exist. maybe try defining it?`)}
            return variables[parser_tree.value]
        };
        if (parser_tree.type == "num") {return parser_tree.value};
        if (parser_tree.type == "BinaryOperator") {
            let operator = parser_tree.operand;
            let leftside = this.calculate(parser_tree.lhs, variables)
            let rightside = this.calculate(parser_tree.rhs, variables)
            return this.operate(operator, leftside, rightside);
        } else if (parser_tree.type == "UnaryOperator") {
            let operator = parser_tree.operand;
            let innards = this.calculate(parser_tree.inside, variables)
            return this.operate(operator, innards, null);
        }
    }
}

/**
 * evaluates a function using variables.
 * @param {string} expression the expression to be evaluated
 * @param {array} variables any custom variables you want to be included, e.g [alpha: "3.2", beta: "96.3"]
 * @param {boolean} lexer whether to return the lexer
 * @param {boolean} parser whether to return the parser
 * @param {boolean} evaluator whether to return the evaluator
 * @param {boolean} log whether to log the results to the console
 * @param {boolean} ignore whether to ignore errors. can be useful if test_parser is returning an error and you just want the result in test_lexer.
 * 
 * @returns {array} your results. ordered, so if you asked for the lexer and evaluator, your array would be [(lexer), (evaluator)]
 */
export function evaluate(expression = "", variables = {}, lexer = false, parser = false, evaluator = false, log = false) {
    let return_list = []
    if (expression == "") {return;}

    if (log == true) {console.log(expression)}

    const test_lexer = new Lexer();
    const test_parser = new Parser();
    const test_evaluator = new Evaluator();

    let variable_names = Object.keys(variables);

    let lexed = test_lexer.tokenize(expression, variable_names);
    let parsed = test_parser.parse(lexed);
    let evaluated = test_evaluator.calculate(parsed, variables);

    if (lexer == true) {
        return_list.push(lexed);
        if (log == true) {
            console.log("from lexer: \n");
            console.log(JSON.stringify(lexed, null, 2) + "\n");
        }
    }
    if (parser == true) {
        return_list.push(parsed);
        if (log == true) {
            console.log("from parser: \n");
            console.log(JSON.stringify(parsed, null, 2) + "\n");
        }
    }
    if (evaluator == true) {
        return_list.push(evaluated)
        if (log == true) {
            console.log("from evaluator: \n");
            console.log(evaluated);
        }
    }

    return return_list
}