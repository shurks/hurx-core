import { ClassDeclaration, Project } from "ts-morph"
import CLI from "../library/framework/apps/cli/cli"
import hurxCorePlugin from "../library/framework/apps/cli/plugins/hurx-core-plugin"
import { CLICommand, CLIMaster } from "../library/framework/apps/cli/types"
import path from "path"

/**
 * TODO: optimize a custom cli structure for testing, see `CLI` todo
 */
export default class Tests extends CLIMaster {
    public commands = []

    public initialized = false

    public cli = new CLI('tests', 'The tests CLI')
        .middleware('Runs the tests', async({cli, options, next}) => {
            if (this.initialized) {
                await next()
            }
            else {
                this.initialized = true

                const project = new Project({
                    tsConfigFilePath: path.join(__dirname, '../../', 'tsconfig.json')
                })

                function findClassesExtending(baseClass: string): ClassDeclaration[] {
                    const classes: ClassDeclaration[] = []
                    project.getSourceFiles().forEach((sourceFile) => {
                        sourceFile.getClasses().forEach((classDeclaration) => {
                        const baseClassDeclaration = classDeclaration.getBaseClass();
                        if (baseClassDeclaration && classDeclaration.getExtends()?.getText() === baseClass) {
                            classes.push(classDeclaration)
                        }
                        })
                    })
                    return classes
                }

                const commandClasses = findClassesExtending("CLICommand<Tests>")
                for (const classDeclaration of commandClasses) {
                    this.logger.verbose(`Found command class "${classDeclaration.getName()}"`)
                    this.logger.verbose(`Requiring "${classDeclaration.getSourceFile().getFilePath()}"`)
                    const clazz = await import(classDeclaration.getSourceFile().getFilePath())
                    if (!clazz[classDeclaration.getName() as any]) {
                        throw Error(`Class "${classDeclaration.getName()}" at path "${classDeclaration.getSourceFile().getFilePath()}" is not an export.`)
                    }
                    await new clazz[classDeclaration.getName() as any](this).start()
                }

                await next()
            }
        })
        .plugin(hurxCorePlugin)
        .event('start', async({cli, options}) => {
            await cli.executeArgv('-h')
        })
}