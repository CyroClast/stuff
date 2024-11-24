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
    PLUS: "+",
    MINUS: "-",
    MULTIPLY: "*",
    DIVIDE: "/",
    MODULO: "mod",

    L_PAR: "(",
    R_PAR: ")",
    EQUAL: "=",
    NUMBER: "num",
    FUNCTION: "fun",
    
    SINE: "sin",
    COSINE: "cos",
    TANGENT: "tan",
    SECANT: "sec",
    COSECANT: "csc",
    COTANGENT: "cot",
    ARCSINE: "asin",
    ARCCOSINE: "acos",
    ARCTANGENT: "atan",
    ARCSECANT: "asec",
    ARCCOSECANT: "acsc",
    ARCCOTANGENT: "acot",
    FLOOR: "floor",
    CEILING: "ceil",

    VARIABLE: "var",
    UNDEFINED: "undef",
    END_OF_FILE: "eof",
}

export class Lexer {
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

              else {tokens.push({type: token_types.UNDEFINED, value: matched_text[0]})}
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
            left = {type: "Equality", operand: ttype, lhs: left, rhs: right}
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
            return {type: token_types.FUNCTION, operand: fun_type, lhs: expr}
        }

        throw new Error(`Unrecognized token ${this.at_cursor().type} at position ${this.cursor}`);
    }

    /**
     * 
     * @param {array} lexer_tokens the lexer tokens 
     * @returns tree
     */
    parse(lexer_tokens) {
        this.tokens = lexer_tokens;
        return this.parse_expression()
    }
}

// useless
export class Evaluator {
    tree = {};
    vars = [];

    operate(func, input1, input2) { // basically a definition of what to do
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
        if (func === token_types.SINE) {return Math.sin(input1);}
        if (func === token_types.COSINE) {return Math.cos(input1);}
        if (func === token_types.TANGENT) {return Math.tan(input1);}
        if (func === token_types.SECANT) {return 1/Math.cos(input1);}
        if (func === token_types.COSECANT) {return 1/Math.sin(input1);}
        if (func === token_types.COTANGENT) {return 1/Math.tan(input1);}
        if (func === token_types.ARCSINE) {
            if (input1 < -1 || input1 > 1) {return Error("Input out of range for arcsin (-1 < x < 1)")};
            return Math.asin(input1);
        }
        if (func === token_types.ARCCOSINE) {
            if (input1 < -1 || input1 > 1) {return Error("Input out of range for arccos (-1 < x < 1)")};
            return Math.acos(input1);
        }
        if (func === token_types.ARCTANGENT) return Math.atan(input1);
        if (func === token_types.ARCSECANT) {
            if (input1 > -1 || input1 < 1) {return Error("Input out of range for arcsec (-1 > x < 1)")}
            return (Math.asin(1/input1))
        }
        if (func === token_types.ARCCOSECANT) {
            if (input1 > -1 || input1 < 1) {return Error("Input out of range for arccsc (-1 > x < 1)")}
            return (Math.acos(1/input1))
        }
        if (func === token_types.ARCCOTANGENT) {
            if (input1 >= 0) {return Math.atan(1/input1);}
            return (Math.atan(1/input1) + Math.PI);
        }
        if (func === token_types.FLOOR) return Math.floor(input1);
        if (func === token_types.CEILING) return Math.ceil(input1);
        // why did i try improving this function? im literally about to replace it wtf
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
        } else if (parser_tree.type == token_types.FUNCTION) {
            let operator = parser_tree.operand;
            let innards = this.calculate(parser_tree.lhs, variables) // i changed
            return this.operate(operator, innards, null);
        }
    }
}

// you may be wondering why i didnt make it return a function that's already in order
// firstly, that's really difficult.
// secondly, i can let javascript handle that because it's in function form now
// now that i think about it, i could've just converted functions javascript didnt know and then use new Function()
// but it's too late for that now lololol
export class ToFunction {
    expr = ""
    /**
     * @param {object} obj altough it's called obj, you should actually input the tree. it just makes the code easier to understand.
     * @param {array} variables just like with Lexer.tokenize(), only pass in the names. we dont need the values
     * 
     * @returns {string}
     */
    alg_fun_calculator(func) { // if any functions require exceptions, like asin, acsc and !, you can put them here
        if (func == token_types.ARCSECANT) {
            return "1/Math.asin"
        } else if (func == token_types.ARCCOSECANT) {
            return "1/Math.acos"
        } else if (func == token_types.ARCCOTANGENT) {
            return "1/Math.atan"
        } else {
            return `Math.${func}`
        }
    }

    stringify(obj, variables = []) {
        if (obj.type != token_types.FUNCTION) {
            obj.lhs.lhs == undefined ? this.expr = this.expr + obj.lhs.value : this.stringify(obj.lhs)
            this.expr = this.expr + obj.operand
            obj.rhs.lhs == undefined ? this.expr = this.expr + obj.rhs.value : this.stringify(obj.rhs)
            console.log(this.expr)
        }
        else {
            this.expr = this.expr + this.alg_fun_calculator(obj.operand) + "("
            obj.lhs.lhs == undefined ? this.expr = this.expr + obj.lhs.value : this.stringify(obj.lhs)
            this.expr = this.expr + ")"
        }
    }

    convert(obj, variables = []) { // only exists to fix a specific issue. i might tell you what it was..
        this.stringify(obj, variables) // im so creative at naming things, aren't i?
        let expr_function = new Function(...variables, `return ${this.expr}`);
        return expr_function
    }
}

/**
 * i've just realised a major flaw with this function so i recommend not using it.
 * you can import lexer, parser and tofunction instead
 * @param {string} expression the expression to be evaluated
 * @param {array} variables any custom variables you want to be included, e.g {alpha: "3.2", beta: "96.3"}
 * @param {boolean} lexer whether to return the lexer
 * @param {boolean} parser whether to return the parser
 * @param {boolean} evaluator whether to return the evaluator
 * @param {boolean} log whether to log the results to the console
 * @param {boolean} ignore whether to ignore errors. can be useful if test_parser is returning an error and you just want the result in test_lexer.
 * 
 * @returns your results. ordered, so if you asked for the lexer and evaluator, your array would be [(lexer), (evaluator)]
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