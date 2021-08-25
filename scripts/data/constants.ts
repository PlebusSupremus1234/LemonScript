const symbols = [
    "PLUS", "MINUS", "MUL", "DIV", "MOD", "CARET",
    "PLUSEQUAL", "MINUSEQUAL", "MULEQUAL", "DIVEQUAL", "MODEQUAL", "CARETEQUAL",
    "LPAREN", "RPAREN", "LBRACE", "RBRACE", "LBRACKET", "RBRACKET",
    "COLON", "SEMICOLON", "DOT", "COMMA", "PIPE", "EROTEME",
    "BANG", "BANGEQUAL", "EQUAL", "EQUALEQUAL", "LESS", "LESSEQUAL", "GREATER", "GREATEREQUAL",
] as const;
const types = ["NUMBER", "STRING", "BOOLEAN", "NULL", "ARRAY"] as const;
const other = ["INDENTIFIER", "NATIVEFUNC", "TYPE", "EOF"] as const;
const keywords = [
    "AND", "OR",
    "CLASS", "EXTENDS", "FUNC",
    "OVERRIDE", "RETURN", "SELF", "SUPER",
    "CONST", "VAR", "IDENTIFIER",
    "IF", "ELIF", "ELSE", "FOR", "WHILE",
    "IMPORT", "AS"
] as const;

const tokentypes = [...symbols, ...types, ...other, ...keywords] as const;

export type TokenType = typeof tokentypes[number];
export let Keywords = keywords;

export let LSTypesArray = ["Any", "Number", "String", "Boolean", "Null", "Array"] as const;
export type LSTypes = typeof LSTypesArray[number] | LSTypes[];