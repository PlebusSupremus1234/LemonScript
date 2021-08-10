const symbols = [
    "PLUS", "MINUS", "MUL", "DIV", "MOD", "CARET",
    "LPAREN", "RPAREN", "LBRACE", "RBRACE", "COLON", "SEMICOLON", "DOT", "COMMA", "PIPE", "EROTEME",
    "BANG", "BANGEQUAL", "EQUAL", "EQUALEQUAL", "LESS", "LESSEQUAL", "GREATER", "GREATEREQUAL",
] as const;
const types = ["NUMBER", "STRING", "BOOLEAN", "NULL"] as const;
const other = ["INDENTIFIER", "NATIVEFUNC", "TYPE", "EOF"] as const;
const keywords = [
    "AND", "OR",
    "CLASS", "EXTENDS", "FUNC",
    "OVERRIDE", "RETURN", "SELF", "SUPER",
    "CONST", "VAR", "IDENTIFIER",
    "IF", "ELSE", "FOR", "WHILE",
    "IMPORT", "AS"
] as const;

const tokentypes = [...symbols, ...types, ...other, ...keywords] as const;

export type TokenType = typeof tokentypes[number];
export let Keywords = keywords;

export let LSTypesArray = ["Any", "Number", "String", "Boolean", "Null"];
export type LSTypes = typeof LSTypesArray[number];