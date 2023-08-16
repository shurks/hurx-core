import path from 'path'
import fs, { copyFileSync, existsSync, mkdirSync, readFileSync, readdir, readdirSync, rmSync, writeFileSync } from 'fs'
import Env from './library/engine/hurx-json-file/env/env'
import { HurxConfig } from './library/engine/hurx-json-file/hurx-json-file'
import Engine from './library/engine/engine'
import Logger from './library/utils/logger'
import Paths from './library/utils/paths'
import child from 'child_process'

const logger = new Logger()

const findHurx = (_path: string): string|null => {
    if (_path === path.parse(process.cwd()).root) {
        return null
    }
    if (fs.existsSync(path.join(_path, "hurx.build.json"))) {
        return path.join(_path, 'hurx.build.json')
    }
    else if (fs.existsSync(path.join(_path, "hurx.json"))) {
        return path.join(_path, 'hurx.json')
    }
    else {
        return findHurx(path.join(_path, '../'))
    }
}

const findProject = (_path: string): string|null => {
    if (_path === path.parse(process.cwd()).root) {
        return null
    }
    if (fs.existsSync(path.join(_path, "hurx.json"))) {
        return path.join(_path, 'hurx.json')
    }
    else if (fs.existsSync(path.join(_path, "package.json"))) {
        const project = findProject(path.join(_path, '../'))
        if (!project) {
            return path.join(_path, 'package.json')
        }
        else {
            return project
        }
    }
    else {
        return findProject(path.join(_path, '../'))
    }
}

const project = findProject(process.cwd())
const projectRoot = project ? path.join(project, '../') : null
const projectType = project ? project.endsWith('hurx.json') ? 'hurx.json' : project.endsWith('package.json') ? 'package.json' : null : null
if (!projectType || projectType === 'package.json') {
    console.error(`No hurx.json found in "${process.cwd()}" or its parent directories.`)
    process.exit()
}

const hurxJSON = JSON.parse(readFileSync(project!).toString('utf8')) as HurxConfig
const env = Env.parse(hurxJSON, './')

// Create the dist folder
const distPath = path.join(projectRoot!, env.paths.output.base)
const projectHurxDistPath = path.join(distPath, '../', '.hurx', 'dist')
const projectHurxSourcePath = path.join(distPath, '../', '.hurx', 'src')
if (existsSync(projectHurxDistPath)) {
    rmSync(projectHurxDistPath, {
        force: true
    })
}
if (existsSync(projectHurxSourcePath)) {
    rmSync(projectHurxSourcePath, {
        force: true
    })
}
if (!existsSync(distPath)) {
    mkdirSync(distPath, {
        recursive: true
    })
    logger.verbose(`Made dist directory "${distPath}"`)
}
if (!existsSync(projectHurxDistPath)) {
    mkdirSync(projectHurxDistPath, {
        recursive: true
    })
    logger.verbose(`Made .hurx/dist directory "${projectHurxDistPath}"`)
}
if (!existsSync(projectHurxSourcePath)) {
    mkdirSync(projectHurxSourcePath, {
        recursive: true
    })
    logger.verbose(`Made .hurx/src directory "${projectHurxSourcePath}"`)
}

if (!existsSync(path.join(projectRoot!, env.paths.base, 'tsconfig.json'))) {
    writeFileSync(path.join(projectRoot!, env.paths.base, 'tsconfig.json'), JSON.stringify({
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
const tsconfigJSON = JSON.parse(readFileSync(path.join(projectRoot!, env.paths.base, 'tsconfig.json')).toString('utf8'))
// TODO: validating package.json for npm production
if (!existsSync(path.join(projectRoot!, 'package.json'))) {
    writeFileSync(path.join(projectRoot!, 'package.json'), JSON.stringify({
        "name": hurxJSON.package.name,
        "version": hurxJSON.package.version
    }))
}

// Package.json
const packageJSONPath = path.join(projectRoot!, env.paths.base, 'package.json')
const packageJSON = JSON.parse(readFileSync(packageJSONPath).toString('utf8'))
const commands = Engine.parseCommands()

// Creating the package.json dist
let packageJSONDist = {
    ...packageJSON
}
let packageJSONDistPath = path.join(projectRoot!, env.paths.output.base, 'package.json')
writeFileSync(packageJSONDistPath, JSON.stringify(packageJSON, null, 4))
logger.verbose(`Created "${packageJSONDistPath}"`)

packageJSONDist = JSON.parse(readFileSync(packageJSONDistPath).toString('utf8'))
let dist = Paths.relativeWithoutDotSlash(env.paths.output.base)

if (packageJSONDist.main?.length) {
    let main = Paths.relativeWithoutDotSlash(packageJSONDist.main || './')
    main = Paths.relative(main.replace(dist, '').replace(/\.(ts|hurx)$/, '.js'))
    packageJSONDist.main = main
    writeFileSync(packageJSONDistPath, JSON.stringify(packageJSONDist, null, 4))
    logger.verbose(`Modified "${packageJSONDistPath}" main`)
}

if (packageJSONDist.bin) {
    let update = false
    for (const binName of Object.keys(packageJSONDist.bin)) {
        const bin: string = packageJSONDist.bin[binName]
        try {
            packageJSONDist.bin[binName] = Paths.relative(Paths.relativeWithoutDotSlash(bin).replace(dist, '').replace(/\.(ts|hurx)$/, '.js'))
            update = true
        }
        catch (err) {
            logger.error(err)
        }
    }
    if (update) {
        writeFileSync(packageJSONDistPath, JSON.stringify(packageJSONDist, null, 4))
        logger.verbose(`Modified "${packageJSONDistPath}" bin`)
    }
}

if (env.apps.bin) {
    for (const binName of Object.keys(env.apps.bin)) {
        const appEnv = env.apps.bin[binName]
        // Install the app
        if (appEnv.npx) {
            logger.verbose(`Added binary app "${binName}" to package.json "bin"`)
            packageJSONDist.bin = {
                ...packageJSONDist.bin,
                [binName]: Paths.relative(path.join(appEnv.paths.output!.sources!, appEnv.main.replace(/#.+$/g, ''))).replace(/\.(ts|hurx)$/, '.js')
            }
            writeFileSync(packageJSONDistPath, JSON.stringify(packageJSONDist, null, 4))
            // TODO: left off here.
        }
    }
}

const tsconfigHurxSrcPath = path.join(projectHurxSourcePath, 'tsconfig.json')
let tsconfigDist = {
    ...tsconfigJSON,
    compilerOptions: {
        ...tsconfigJSON.compilerOptions || {},
        rootDir: './',
        rootDirs: undefined,
        outDir: '../.hurx/dist'
    },
    include: [
        './**/*.ts',
        './**/*.d.ts'
    ],
    exclude: [
        'node_modules'
    ]
}
writeFileSync(tsconfigHurxSrcPath, JSON.stringify(tsconfigDist, null, 4))
logger.verbose(`Added tsconfig at "${tsconfigHurxSrcPath}"`)

const copySourceFiles = (entries: fs.Dirent[], _path: string, destination: string) => {
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
            copySourceFiles(fs.readdirSync(path.join(_path, entry.name), { withFileTypes: true }), path.join(_path, entry.name), path.join(destination, entry.name))
        }
        else if (entry.isFile()) {
            copyFileSync(path.join(_path, entry.name), path.join(destination, entry.name))
        }
    }
}
// const sourcePath = path.join(projectRoot!, env.paths.sources)
// copySourceFiles(readdirSync(sourcePath, {
//     withFileTypes: true
// }), sourcePath, path.join(projectHurxSourcePath))
const paths = [[env.paths.sources, env.paths.output.sources], [env.paths.resources, env.paths.output.resources], [env.paths.logs, env.paths.output.logs]]
for (const _paths of paths) {
    if (_paths[0] && _paths[1]) {
        const _path = path.join(projectRoot!, _paths[0])
        copySourceFiles(readdirSync(_path, {
            withFileTypes: true
        }), _path, path.join(projectRoot!, '.hurx', _paths[1]))
    }
}
// const childProcess = child.execSync(`cd "${path.join(projectHurxSourcePath, '../')}" && npx tsc`, {
//     stdio: 'inherit'
// })
// writeFileSync(path.join())