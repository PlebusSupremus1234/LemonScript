import { ModuleObj } from "../types"

import { MathModule } from "./math"
import { RandomModule } from "./random"

export let Modules: ModuleObj = {
    "math": MathModule,
    "random": RandomModule
};