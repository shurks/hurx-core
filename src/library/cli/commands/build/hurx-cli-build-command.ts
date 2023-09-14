import child from 'child_process'
import { Dirent, copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs"
import Hurx from "../../../framework/node/hurx"
import path from "path"
import { HurxConfig, HurxPathsPartial } from "../../../framework/node/hurx-json/hurx-json-file"
import Paths from "../../../utils/paths"
import { CLICommand } from '../../../framework/apps/cli/types'
import HurxCLI from '../../hurx-cli'
import Command from '../../../framework/apps/cli/command'

/**
 * The build functionality
 * TODO: app names
 * TODO: fix this
 */
export default class Build extends CLICommand<HurxCLI> {
    public command = new Command(this.parent, 'build', 'Builds your Hurx project based on hurx.json')
        .option('--app -a <name>', 'The name of the app(s) to build, split by a comma')
        .event('start', async({options, cli}) => {
            cli.logger.info(`Build started`)
            
            // Paths
            const distPath = path.join(Hurx.project.env.paths.output.base)
            const projectHurxDistPath = path.join(distPath, '../', '.hurx', 'dist')
            const projectHurxSourcePath = path.join(distPath, '../', '.hurx', 'src')

            // The app name to build
            const appName = options.app?.name || null

            // The hurx json config
            const hurxJSON = JSON.parse(readFileSync(path.join(Hurx.project.root, 'hurx.json')).toString('utf8')) as HurxConfig
            
            // Check if package is already built
            if (hurxJSON.package.built) {
                throw new Error(`Package is already built.`)
            }

            // No output paths
            if (!Hurx.project.env.paths.output) {
                throw new Error(`No output paths have been found in hurx.json.`)
            }

            // Create the dist folder
            if (existsSync(distPath)) {
                rmSync(distPath, {
                    force: true,
                    recursive: true
                })
            }

            // Remove dist if it exists
            if (existsSync(projectHurxDistPath)) {
                rmSync(projectHurxDistPath, {
                    force: true,
                    recursive: true
                })
            }

            // Remove .hurx/src if it exists
            if (existsSync(projectHurxSourcePath)) {
                const entries = readdirSync(projectHurxSourcePath, { withFileTypes: true })
                for (const entry of entries) {
                    if (entry.name === 'node_modules' && entry.isDirectory()) {
                        continue
                    }
                    rmSync(path.join(projectHurxSourcePath, entry.name), {
                        force: true,
                        recursive: true
                    })
                }
            }

            // Make the dist folder
            if (!existsSync(distPath)) {
                mkdirSync(distPath, {
                    recursive: true
                })
                cli.logger.verbose(`Made dist directory "${distPath}"`)
            }

            // Make the .hurx/dist folder
            if (!existsSync(projectHurxDistPath)) {
                mkdirSync(projectHurxDistPath, {
                    recursive: true
                })
                cli.logger.verbose(`Made .hurx/dist directory "${projectHurxDistPath}"`)
            }

            // Make the .hurx/src folder
            if (!existsSync(projectHurxSourcePath)) {
                mkdirSync(projectHurxSourcePath, {
                    recursive: true
                })
                cli.logger.verbose(`Made .hurx/src directory "${projectHurxSourcePath}"`)
            }

            // Create a tsconfig.json file
            if (!existsSync(path.join(Hurx.project.env.paths.base, 'tsconfig.json'))) {
                writeFileSync(path.join(Hurx.project.env.paths.base, 'tsconfig.json'), JSON.stringify({
                    "compilerOptions": {
                        "emitDecoratorMetadata": true,
                        "types": [
                            "node"
                        ],
                        "module": "commonjs",
                        "target": "ES2020",
                        "lib": [
                            "ES2020"
                        ],
                        "sourceMap": true,
                        "rootDir": "./src",
                        "resolveJsonModule": true,
                        "esModuleInterop": true,
                        "forceConsistentCasingInFileNames": true,
                        "strict": true,
                        "skipLibCheck": true,
                        "isolatedModules": false,
                        "experimentalDecorators": true,
                        "typeRoots": [
                            "./node_modules/@types",
                            "./src/@types"
                        ],
                        "outDir": "./dist",
                        "declaration": true,
                        "declarationDir": "./dist",
                        "declarationMap": true,
                        "preserveSymlinks": true
                    },
                    "include": [
                        "./src/**/*.ts",
                        "./src/**/*.d.ts"
                    ],
                    "exclude": [
                        "node_modules",
                        "dist"
                    ]
                }))
            }

            const tsconfigJSON = JSON.parse(readFileSync(path.join(Hurx.project.env.paths.base, 'tsconfig.json')).toString('utf8'))
            // TODO: validating package.json for npm production
            if (!existsSync(path.join(Hurx.project.root, 'package.json'))) {
                writeFileSync(path.join(Hurx.project.root, 'package.json'), JSON.stringify({
                    "name": hurxJSON.package.name,
                    "version": hurxJSON.package.version
                }))
            }

            // Package.json
            const packageJSONPath = path.join(Hurx.project.env.paths.base, 'package.json')
            const packageJSON = JSON.parse(readFileSync(packageJSONPath).toString('utf8'))

            // Creating the package.json of the dist folder
            let packageJSONDist = {
                ...packageJSON
            }
            let packageJSONDistPath = path.join(Hurx.project.env.paths.output.base, 'package.json')
            writeFileSync(packageJSONDistPath, JSON.stringify(packageJSON, null, 4))
            cli.logger.verbose(`Created "${packageJSONDistPath}"`)
            packageJSONDist = JSON.parse(readFileSync(packageJSONDistPath).toString('utf8'))
            console.log(Hurx.project.env)
            let dist = Paths.absoluteToRelative(Hurx.project.env.paths.base, Hurx.project.env.paths.output.base)

            // Convert the main property of package.json to dist
            if (packageJSONDist.main?.length) {
                let main = Paths.relativeWithoutDotSlash(packageJSONDist.main || './')
                console.log({main, dist})
                main = Paths.relative(Paths.relativeWithoutDotSlash(main).replace(Paths.relativeWithoutDotSlash(dist), '').replace(/\.(ts|hurx)$/, '.js'))
                packageJSONDist.main = main
                writeFileSync(packageJSONDistPath, JSON.stringify(packageJSONDist, null, 4))
                cli.logger.verbose(`Modified "${packageJSONDistPath}" main`)
            }

            // Check if there are any binary applications in package.json
            if (packageJSONDist.bin) {
                let update = false
                for (const binName of Object.keys(packageJSONDist.bin)) {
                    const bin: string = packageJSONDist.bin[binName]
                    try {
                        packageJSONDist.bin[binName] = Paths.relative(bin.replace(dist, '')).replace(/\.(ts|hurx)$/, '.js')
                        update = true
                    }
                    catch (err) {
                        cli.logger.error(err)
                    }
                }
                if (update) {
                    writeFileSync(packageJSONDistPath, JSON.stringify(packageJSONDist, null, 4))
                    cli.logger.verbose(`Modified "${packageJSONDistPath}" bin`)
                }
            }

            // Check if there are any binary apps in the hurx config
            if (Hurx.project.env.apps.bin) {
                for (const binName of Object.keys(Hurx.project.env.apps.bin)) {
                    const appEnv = Hurx.project.env.apps.bin[binName]
                    // Install the app
                    if (appEnv.npx) {
                        cli.logger.verbose(`Added binary app "${binName}" to package.json "bin"`)

                        packageJSONDist.bin = {
                            ...packageJSONDist.bin,
                            [binName]: Paths.absoluteToRelative(Hurx.project.env.paths.output.base, path.join(appEnv.paths.output!.sources!, appEnv.main.replace(/#.+$/g, ''))).replace(/\.(ts|hurx)$/, '.js')
                        }
                        writeFileSync(packageJSONDistPath, JSON.stringify(packageJSONDist, null, 4))
                    }
                }
            }

            /**
             * Get a random alphanumeric character
             */
            function randomAlphanumericCharacter() {
                const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const randomIndex = Math.floor(Math.random() * alphanumeric.length);
                return alphanumeric.charAt(randomIndex);
            }

            // Create a temporary name for the new dist folder that doesn't exist 
            const entries = readdirSync(projectHurxSourcePath, {
                withFileTypes: true
            })
            let tempDistName: string = 'dist-'
            let i = 0
            do {
                tempDistName += randomAlphanumericCharacter()
                i ++
            }
            while (entries.map((v) => v.name).includes(tempDistName) || i < 6)

            // The tsconfig.json for the .hurx/src path
            const tsconfigHurxSrcPath = path.join(projectHurxSourcePath, 'tsconfig.json')
            let tsconfigHurxSrc = {
                ...tsconfigJSON,
                compilerOptions: {
                    ...tsconfigJSON.compilerOptions || {},
                    rootDir: './',
                    rootDirs: undefined,
                    outDir: `./${tempDistName}`
                },
                include: [
                    './**/*.ts',
                    './**/*.d.ts'
                ],
                exclude: [
                    'node_modules'
                ]
            }
            writeFileSync(tsconfigHurxSrcPath, JSON.stringify(tsconfigHurxSrc, null, 4))
            cli.logger.verbose(`Added tsconfig at "${tsconfigHurxSrcPath}"`)

            /**
             * Copies all files from one directory to another
             * @param entries the entries
             * @param _path the path to start copying from
             * @param destination the path to start copying to
             */
            const copySourceFiles = (entries: Dirent[], _path: string, destination: string) => {
                if (!existsSync(_path)) {
                    mkdirSync(_path, {
                        recursive: true
                    })
                }
                for (const entry of entries) {
                    if (entry.isDirectory()) {
                        mkdirSync(path.join(destination, entry.name), {
                            recursive: true
                        })
                        copySourceFiles(readdirSync(path.join(_path, entry.name), { withFileTypes: true }), path.join(_path, entry.name), path.join(destination, entry.name))
                    }
                    else if (entry.isFile()) {
                        copyFileSync(path.join(_path, entry.name), path.join(destination, entry.name))
                    }
                }
            }

            // Copy src, res, and logs from src to dist
            const paths = [
                [
                    Hurx.project.env.paths.sources, 
                    'src'
                ],
                [
                    ...Hurx.project.env.paths.output.resources && Hurx.project.env.paths.resources ? [
                        Hurx.project.env.paths.resources, 
                        Paths.relativeWithoutDotSlash(Paths.absoluteToRelative(Hurx.project.root, Hurx.project.env.paths.output.resources)).replace(dist, '')
                    ] : []
                ], 
                [
                    ...Hurx.project.env.paths.output.logs && Hurx.project.env.paths.logs ? [
                        Hurx.project.env.paths.logs, 
                        Paths.relativeWithoutDotSlash(Paths.absoluteToRelative(Hurx.project.root, Hurx.project.env.paths.output.logs)).replace(dist, '')
                    ] : []
                ]
            ]
            for (const _paths of paths) {
                if (_paths[0] && _paths[1]) {
                    const _path = path.join(_paths[0])
                    if (existsSync(_path)) {
                        copySourceFiles(readdirSync(_path, {
                            withFileTypes: true
                        }), _path, path.join('.hurx', _paths[1]))
                    }
                    else {
                        if (_paths[0] === Hurx.project.env.paths.sources) {
                            cli.logger.info(`No sources folder in project`)
                        }
                        else if (_paths[0] === Hurx.project.env.paths.resources) {
                            cli.logger.info(`No resources folder in project`)
                        }
                        else if (_paths[0] === Hurx.project.env.paths.logs) {
                            cli.logger.info(`No logs folder in project`)
                        }
                    }
                }
            }

            writeFileSync(tsconfigHurxSrcPath, JSON.stringify({
                ...tsconfigHurxSrc,
                compilerOptions: {
                    ...tsconfigHurxSrc.compilerOptions,
                    outDir: `./${tempDistName}`
                }
            }, null, 4))

            // Copy the project root files
            const copyProjectRootFiles = (_path: string) => {
                copyFileSync(packageJSONDistPath, path.join(_path, 'package.json'))
                copyFileSync(path.join(Hurx.project.root, 'hurx.json'), path.join(_path, 'hurx.json'))
                const hurxJSONDist: HurxConfig = {
                    ...hurxJSON,
                    package: {
                        ...hurxJSON.package,
                        built: true
                    }
                }
                writeFileSync(path.join(_path, 'hurx.json'), JSON.stringify({
                    ...hurxJSONDist,
                    package: {
                        ...hurxJSONDist.package,
                        env: {
                            ...hurxJSONDist.package.env,
                            default: {
                                ...hurxJSONDist.package.env.default,
                                paths: {
                                    ...hurxJSONDist.package.env.default.paths,
                                    base: './',
                                    output: {
                                        ...hurxJSONDist.package.env.default.paths.output,
                                        base: './'
                                    }
                                }
                            }
                        }
                    }
                } as HurxConfig, null, 4))
            }
            copyProjectRootFiles(projectHurxSourcePath)

            // Node modules in .hurx
            cli.logger.info(`Installing temporary node_modules`)
            let childProcess = child.execSync(`cd "${projectHurxSourcePath}" && npm i`, {
                stdio: 'inherit'
            })

            // Compile typescript
            cli.logger.info(`Compiling temporary typescript project`)
            childProcess = child.execSync(`cd "${projectHurxSourcePath}" && npx tsc`, {
                stdio: 'inherit'
            })

            // Copy files to dist
            cli.logger.info(`Copying files to temporary project root`)
            copyProjectRootFiles(path.join(projectHurxSourcePath, tempDistName))
            if (Hurx.project.env.paths.resources && Hurx.project.env.paths.output.resources && existsSync(Hurx.project.env.paths.resources)) {
                copySourceFiles(readdirSync(Hurx.project.env.paths.resources, {
                    withFileTypes: true
                }), Hurx.project.env.paths.resources, path.join(projectHurxSourcePath, tempDistName, Paths.absoluteToRelative(Hurx.project.root, Hurx.project.env.paths.resources)))
            }
            if (Hurx.project.env.paths.logs && Hurx.project.env.paths.output.logs && existsSync(Hurx.project.env.paths.logs)) {
                copySourceFiles(readdirSync(Hurx.project.env.paths.logs, {
                    withFileTypes: true
                }), Hurx.project.env.paths.logs, path.join(projectHurxSourcePath, tempDistName, Paths.absoluteToRelative(Hurx.project.root, Hurx.project.env.paths.logs)))
            }

            // Copy all other files except ts and hurx from the temp source to temp dist
            const copyAllFilesExceptTSAndHurx = (_path: string) => {
                const src = path.join(Hurx.project.env.paths.sources, _path)
                const dist = path.join(projectHurxSourcePath, tempDistName, _path)
                if (!existsSync(dist)) {
                    mkdirSync(dist, {
                        recursive: true
                    })
                }
                const entries = readdirSync(src, {
                    withFileTypes: true
                })
                for (const entry of entries) {
                    if (entry.isDirectory()) {
                        copyAllFilesExceptTSAndHurx(path.join(_path, entry.name))
                    }
                    if (entry.isFile()) {
                        if (!entry.name.endsWith('.ts') && !entry.name.endsWith('.hurx')) {
                            copyFileSync(path.join(src, entry.name), path.join(dist, entry.name))
                        }
                    }
                }
            }
            copyAllFilesExceptTSAndHurx('./')

            // Copies the files to the actual dist
            const copyFilesToActualDist = (_path: string) => {
                const src = path.join(projectHurxSourcePath, tempDistName, _path)
                const dist = path.join(Hurx.project.env.paths.output!.base, _path)
                if (!existsSync(dist)) {
                    mkdirSync(dist, {
                        recursive: true
                    })
                }
                const entries = readdirSync(src, {
                    withFileTypes: true
                })
                for (const entry of entries) {
                    if (entry.isDirectory()) {
                        copyFilesToActualDist(path.join(_path, entry.name))
                    }
                    if (entry.isFile()) {
                        copyFileSync(path.join(src, entry.name), path.join(dist, entry.name))
                    }
                }
            }
            copyFilesToActualDist('./')

            // Modify hurx.json in the dist
            const modifyPathsInHurxJSONDist = () => {
                const modifyPaths = (paths?: HurxPathsPartial) => {
                    if (!paths) {
                        return
                    }
                    paths.base = './'
                    if (paths.output) {
                        paths.logs = paths.output?.logs
                        paths.resources = paths.output?.resources
                        paths.sources = paths.output?.sources
                        paths.output = undefined
                    }
                }
                modifyPaths(hurxJSON.package.env.default.paths)
                for (const packageEnv of Object.keys(hurxJSON.package.env)) {
                    modifyPaths(hurxJSON.package.env[packageEnv].paths)
                }
                for (const binName of Object.keys(hurxJSON.package.apps.bin || {})) {
                    for (const packageEnv of Object.keys(hurxJSON.package.apps.bin![binName])) {
                        modifyPaths(hurxJSON.package.apps.bin![binName][packageEnv].paths)
                    }   
                    modifyPaths(hurxJSON.package.apps.bin![binName].default.paths)
                }
                hurxJSON.$schema = `../${Paths.relativeWithoutDotSlash(hurxJSON.$schema)}`
                writeFileSync(path.join(distPath, 'hurx.json'), JSON.stringify(hurxJSON, null, 4))
            }
            modifyPathsInHurxJSONDist()

            // Complete
            cli.logger.success('Build complete')
        })
}