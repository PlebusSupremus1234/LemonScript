const symbols = [
    "PLUS", "MINUS", "MUL", "DIV", "MOD", "CARET",
    "LPAREN", "RPAREN", "LBRACE", "RBRACE", "LBRACKET", "RBRACKET", "SEMICOLON", "DOT", "COMMA",
    "BANG", "BANGEQUAL", "EQUAL", "EQUALEQUAL", "LESS", "LESSEQUAL", "GREATER", "GREATEREQUAL",
];
const types = ["NUMBER", "STRING", "NULL", "INDENTIFIER", "EOF"];
const keywords = ["AND", "CLASS", "CONST", "ELSE", "FALSE", "FOR", "FUNC", "IF", "OR", "OVERRIDE", "PRINT", "RETURN", "SELF", "SUPER", "TRUE", "VAR", "WHILE"];
const tokentypes = [...symbols, ...types, ...keywords] as const

export type TokenType = typeof tokentypes[number];
export let Keywords = keywords;