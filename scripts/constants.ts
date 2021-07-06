export let Constants = {
    LSint: "INT",
    LSfloat: "FLOAT",
    LSplus: "PLUS",
    LSminus: "MINUS",
    LSmul: "MUL",
    LSdiv: "DIV",
    LSlparen: "LPAREN",
    LSrparen: "RPAREN",
    LSbang: "BANG",
    LSbangequal: "BANGEQUAL",
    LSequal: "EQUAL",
    LSequalequal: "EQUAlEQUAL",
    LSless: "LESS",
    LSlessequal: "LESSEQUAL",
    LSgreater: "GREATER",
    LSgreaterequal: "GREATEREQUAL"
} as const;

export type TokenType = typeof Constants[keyof typeof Constants];