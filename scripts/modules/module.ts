import { ModuleMethod, ModuleMethodsMap } from "./types"

export class Module {
    name: string;
    methods: ModuleMethodsMap;

    constructor(name: string, methods: ModuleMethodsMap) {
        this.name = name;
        this.methods = methods;
    }

    get(name: string): null | ModuleMethod {
        let result = this.methods.get(name);
        if (!result) return null;
        else return result;
    }
}