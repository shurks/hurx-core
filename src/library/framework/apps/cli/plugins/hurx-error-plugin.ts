import CLI from "../cli"

export default new CLI('hurx-error-plugin', 'Adds the default error handler to your CLI.')
    .event('error', async({error, cli}) => {
        cli.logger.error(error)
    })