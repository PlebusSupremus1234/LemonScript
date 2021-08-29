export enum TokenType {
    // Keywords
    AND, OR,
    CLASS, EXTENDS, FUNC,
    OVERRIDE, RETURN, SELF, SUPER,
    CONST, VAR,
    IF, ELIF, ELSE, FOR, WHILE,
    IMPORT, AS
}

export let Keywords = Object.keys(TokenType);

export enum TokenType {
    // Symbols
    PLUS = 18, MINUS, MUL, DIV, MOD, CARET, // Operators
    PLUSEQUAL, MINUSEQUAL, MULEQUAL, DIVEQUAL, MODEQUAL, CARETEQUAL, // Assignment Operators
    LPAREN, RPAREN, LBRACE, RBRACE, LBRACKET, RBRACKET, // Brackets
    COLON, SEMICOLON, DOT, COMMA, PIPE, EROTEME, BANG, // Punctuation
    BANGEQUAL, EQUAL, EQUALEQUAL, LESS, LESSEQUAL, GREATER, GREATEREQUAL, // Comparison Operators

    // Types
    NUMBER, STRING, BOOLEAN, NULL, ARRAY,

    // Other
    IDENTIFIER, NATIVEFUNC, TYPE, EOF,
}

export let LSTypesArray = ["Any", "Number", "String", "Boolean", "Null", "Array"] as const;
export type LSTypes = typeof LSTypesArray[number] | LSTypes[];

export let singleChars: { [key: string]: TokenType } = {
    "(": TokenType.LPAREN,
    ")": TokenType.RPAREN,
    "{": TokenType.LBRACE,
    "}": TokenType.RBRACE,
    "[": TokenType.LBRACKET,
    "]": TokenType.RBRACKET,
    ":": TokenType.COLON,
    ";": TokenType.SEMICOLON,
    ".": TokenType.DOT,
    ",": TokenType.COMMA,
    "|": TokenType.PIPE,
    "?": TokenType.EROTEME,
};