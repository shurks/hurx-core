import CLI from "../cli"

export default new CLI('hurx-log-levels-plugin', 'Adds levels of logging to your cli')
    .option('--verbose', 'Enables logging at the "trace" | "debug" | "verbose" levels')
    .option('--debug', 'Enables logging at the "trace" | "debug" levels')
    .option('--trace', 'Enables logging at the "trace" level')