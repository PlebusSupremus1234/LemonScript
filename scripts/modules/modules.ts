import { ModuleObj } from "./types"

import { RandomModule } from "./modules/random"
import { MathModule } from "./modules/math"

export let Modules: ModuleObj = {
    "random": RandomModule,
    "math": MathModule
};