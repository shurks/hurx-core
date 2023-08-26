import Hurx from "../../../hurx"
import CLI from "../cli"
import hurxErrorPlugin from "./hurx-error-plugin"
import hurxHelpPlugin from "./hurx-help-plugin"
import hurxLogLevelsPlugin from "./hurx-log-levels-plugin"
import hurxRespawnPlugin from "./hurx-respawn-plugin"

export default new CLI('hurx-core-plugin', 'Adds common core functionality to your CLI')
    .plugin(hurxHelpPlugin)
    .plugin(hurxLogLevelsPlugin)
    .plugin(hurxRespawnPlugin)
    .plugin(hurxErrorPlugin)
    .initialization('Initialize framework', async({next, cli}) => {
        await Hurx.initialize()
        await next()
    })