const symbols = [
    "PLUS", "MINUS", "MUL", "DIV", "LPAREN", "RPAREN",
    "BANG", "BANGEQUAL", "EQUAL", "EQUAlEQUAL", "LESS", "LESSEQUAL", "GREATER", "GREATEREQUAL",
];
const types = ["INT", "FLOAT", "STRING", "INDENTIFIER"];
const keywords = ["AND", "ELSE", "FALSE", "FOR", "FUNc", "IF", "OR", "PRINT", "RETURN", "TRUE", "VAR", "WHILE"];
const tokentypes = [...symbols, ...types, ...keywords] as const;

export type TokenType = typeof tokentypes[number];
export let Keywords = keywords;