import { LSString } from "./string"
import { Token, TokenValue } from "../structures/token"
import { ErrorHandler } from "../structures/errorhandler"

export type Primitives = LSString;

export function handlePrimitive(value: TokenValue, property: Token, parent: string, errorhandler: ErrorHandler) {
    let primitive: null | Primitives = null;
    if (typeof value === "string") primitive = new LSString(value);

    if (primitive) {
        let result = primitive.get(property.stringify());
        if (result) return result;

        throw errorhandler.newError(
            "Property Error",
            `Property '${property.stringify()}' does not exist in '${parent}' on line ${property.line}`,
            property.line,
            property.rowpos
        );
    }

    return value;
}