import chalk from "chalk"
import Theme from "../../../../utils/theme/theme"
import CLI from "../cli"

export default new CLI('hurx-help-plugin', 'Adds help functionality to your cli')
    .option('--help -h', 'Shows a help message about the current command or option')
    .middleware('Make -h break the program to show the user helpful instructions', async({options, next, cli}) => {
        if (options.help) {
            const command = cli.history[cli.history.length - 1] || cli
            const global = {
                commands: command.allCommands.filter((v) => !command.commands.includes(v) || v === cli as any).map((v) => v.name).filter((v, i, a) => a.indexOf(v) === i).map((v) => command.allCommands.find((vv) => vv.name === v)!),
                options: command.allOptions.filter((v) => !command.options.includes(v))
            }
            const commands = command.commands.filter((v) => v !== cli as any && v !== cli.history[cli.history.length - 1]).map((v) => v.name).filter((v, i, a) => a.indexOf(v) === i).map((v) => command.commands.find((vv) => vv.name === v)!)
            const options = command.options
            const format = (option: string, description: string) => {
                const suffix = new Array(Math.max(0, 30 - option.length)).fill('').map(v => ' ').join('')
                return `${option}${suffix}${description}\n`
            }
            const _chalk = chalk.bgHex(Theme.current.colors.light).hex('#222222').bold
            console.log([
                `${chalk.bgHex(Theme.current.colors.light).hex('#222222').bold(' Instructions ')}\n`
                + `Here you see an overview of commands and options to use.\n`
                + `Each command can be called using ${_chalk(" [command] ")}. If you want to\n`
                + `add an option you can use ${_chalk(" [command] --option1 --option2 ")}.\n\n`
                + `You can also use short variants of options like this ${_chalk(" [command] -o ")},\n`
                + `or combine them by putting them together: ${_chalk(" [command] -ob ")}\n`
                + `or use an option without a command ${_chalk(" --option ")}`,

                global.commands.length
                ? `${_chalk(` Global commands `)}\n${global.commands.sort((x, y) => x.name > y.name ? 1 : y.name > x.name ? -1 : 0).map((v) => format(v.name, v.description)).join('')}`
                : ``,

                global.options.length
                ? `${_chalk(` Global options `)}\n${global.options.sort((x, y) => x.long > y.long ? 1 : y.long > x.long ? -1 : 0).map((v) => format(`--${v.long}${v.short ? `  or  -${v.short}` : ''}`, v.description).replace(/(?<=\S)\s\sor\s\s(?=\-\S)/, ` ${_chalk(` or `)} `)).join('')}`
                : '',

                commands.length
                ? `${_chalk(` Commands `)}\n${commands.sort((x, y) => x.name > y.name ? 1 : y.name > x.name ? -1 : 0).map((v) => format(v.name, v.description)).join('')}`
                : ``,

                options.length
                ? `${_chalk(` Options `)}\n${options.sort((x, y) => x.long > y.long ? 1 : y.long > x.long ? -1 : 0).map((v) => format(`--${v.long}${v.short ? `  or  -${v.short}` : ''}`, v.description).replace(/(?<=\S)\s\sor\s\s(?=\-\S)/, ` ${_chalk(` or `)} `)).join('')}`
                : ``
            ].filter(Boolean).join('\n\n').replace(/\n{3,}/g, '\n\n').trimEnd())
        }
        else {
            cli.logger.verbose(`-h or --help option not present, going to the next middleware`)
            await next()
        }
    })