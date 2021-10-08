import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    ci: true
}

export default config
