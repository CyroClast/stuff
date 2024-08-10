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
    NUMBER: "num",
    FUNCTION: "fun",
    END_OF_FILE: "eof",
}

class lexer {

    tokenize(input = "") {
        const regex = /\s*(-?\d+\.?\d*|\+|\-|\*|\/|\(|\)|[a-zA-Z]+)\s*/g; // good luck reading this lol (sorry regex was just way more convenient)
        const tokens = []
        let match;

        while (match = regex.exec(input)) {
            const matched_text = match;

            if (/-?\d/.test(matched_text)) { // may get rid of value later if it is unnecessary
                tokens.push({ type: token_types.NUMBER, value: parseFloat(matched_text) })
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
            }

            if (/sin/.test(matched_text)) {
                tokens.push ({ type: token_types.FUNCTION, value: "sin"})
            }
        }

        tokens.push({ type: token_types.END_OF_FILE, value: null}); // this eof token is VERY IMPORTANT. do not remove it; the parser wont work without it.
        return tokens;
    }
}

class parser {
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

    // num & parenthesis
    parse_factor() {
        if (this.at_cursor().type == token_types.NUMBER) {
            let literal = {type: token_types.NUMBER, value: this.at_cursor().value}
            this.eat(token_types.NUMBER);
            return literal
        } else if (this.at_cursor().type == token_types.L_PAR) {
            this.eat(token_types.L_PAR);

            let expr;

            while (this.at_cursor().type !== token_types.R_PAR) {
                expr = this.parse_expression();
            }

            this.eat(token_types.R_PAR);
            return expr;
        } else if (this.at_cursor().type == token_types.FUNCTION) {
            let fun_type = this.at_cursor().type;
            this.eat(token_types.FUNCTION);
            // code expects parenthesis because telling whether "sin x" is acceptable over "sin(x)" is complicated
            this.eat(token_types.L_PAR);
            let expr;

            // i know this is just the parenthesis code but i cant jump to it unfortunately.
            while (this.at_cursor().type !== token_types.R_PAR) {
                expr = this.parse_expression();
            }

            this.eat(token_types.R_PAR);
            return {type: "UnaryOperator", operator: fun_type, inside: expr}
        }

        throw new Error(`Unrecognized token ${this.at_cursor().type} at position ${this.cursor}`);
    }

    parse(lexer_tokens) {
        this.tokens = lexer_tokens;
        return this.parse_expression()
    }
}

/* export */ function evaluate(expression) {


}

const t_exp = "sin(3)";

const test_lexer = new lexer();
const test_parser = new parser();

let lexed = test_lexer.tokenize(t_exp);
// console.log("from lexer: \n");
// console.log(JSON.stringify(lexed, null, 2) + "\n");

let parsed = test_parser.parse(lexed);
console.log("from parser: \n");
console.log(JSON.stringify(parsed, null, 2) + "\n");