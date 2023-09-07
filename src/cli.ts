import CLI from './library/framework/apps/cli/cli'
import Command from './library/framework/apps/cli/command'
import hurxCorePlugin from './library/framework/apps/cli/plugins/hurx-core-plugin'
import hurxErrorPlugin from './library/framework/apps/cli/plugins/hurx-error-plugin'
import hurxHelpPlugin from './library/framework/apps/cli/plugins/hurx-help-plugin'
import hurxLogLevelsPlugin from './library/framework/apps/cli/plugins/hurx-log-levels-plugin'
import hurxRespawnPlugin from './library/framework/apps/cli/plugins/hurx-respawn-plugin'

export default CLI
export * from './library/framework/apps/cli/cli'
export * from './library/framework/apps/cli/types'
export * from './library/framework/apps/cli/command'
export {
    Command,
    hurxCorePlugin,
    hurxErrorPlugin,
    hurxHelpPlugin,
    hurxLogLevelsPlugin,
    hurxRespawnPlugin
}