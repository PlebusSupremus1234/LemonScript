import { LSTypes } from "../constants"
import { Callable } from "../functions/callable"

export type Argument = {
    name: string;
    types: LSTypes[];
};

export type ModuleMethod = {
    name: string;
    arguments: Argument[];
} & Callable;

export type ModuleMethodsMap = Map<string, ModuleMethod>;

export type ModuleType = {
    [name: string]: {
        name: string;
        methods: ModuleMethod[];
    };
};