const symbols = [
    "PLUS", "MINUS", "MUL", "DIV", "MOD", "CARET",
    "LPAREN", "RPAREN", "LBRACE", "RBRACE", "LBRACKET", "RBRACKET", "COLON", "SEMICOLON", "DOT", "COMMA",
    "BANG", "BANGEQUAL", "EQUAL", "EQUALEQUAL", "LESS", "LESSEQUAL", "GREATER", "GREATEREQUAL",
];
const types = ["NUMBER", "STRING"];
const other = ["INDENTIFIER", "TYPE", "EOF"];
const keywords = ["AND", "CLASS", "CONST", "ELSE", "FALSE", "FOR", "FUNC", "IF", "NULL", "OR", "OVERRIDE", "PRINT", "RETURN", "SELF", "SUPER", "TRUE", "VAR", "WHILE"];
const tokentypes = [...symbols, ...types, ...other, ...keywords] as const

export type TokenType = typeof tokentypes[number];
export let Keywords = keywords;

export let LSTypesArray = ["Any", "Number", "String", "Boolean", "Null"];
export type LSTypes = typeof LSTypesArray[number];