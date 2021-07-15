const symbols = [
    "PLUS", "MINUS", "MUL", "DIV", "MOD", "MODEQUAL",
    "LPAREN", "RPAREN", "LBRACE", "RBRACE", "LBRACKET", "RBRACKET", "SEMICOLON",
    "BANG", "BANGEQUAL", "EQUAL", "EQUALEQUAL", "LESS", "LESSEQUAL", "GREATER", "GREATEREQUAL",
];
const types = ["INT", "FLOAT", "STRING", "NULL", "INDENTIFIER", "EOF"];
const keywords = ["AND", "ELSE", "FALSE", "FOR", "FUNC", "IF", "OR", "PRINT", "RETURN", "TRUE", "VAR", "WHILE"];
const tokentypes = [...symbols, ...types, ...keywords] as const

export type TokenType = typeof tokentypes[number];
export let Keywords = keywords;