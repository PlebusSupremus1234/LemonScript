export let Constants = {
    LSint: "INT",
    LSfloat: "FLOAT",
    LSplus: "PLUS",
    LSminus: "MINUS",
    LSmul: "MUL",
    LSdiv: "DIV",
    LSlparen: "LPAREN",
    LSrparen: "RPAREN",
} as const;

export type TokenType = typeof Constants[keyof typeof Constants];