import path from 'path'
import fs, { copyFileSync, existsSync, mkdir, mkdirSync, readFileSync, readdir, readdirSync, rmSync, writeFileSync } from 'fs'
import Env from './library/engine/hurx-json-file/env/env'
import { HurxConfig, HurxPaths, HurxPathsPartial } from './library/engine/hurx-json-file/hurx-json-file'
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
if (hurxJSON.package.built) {
    console.error(`Package is already built.`)
    process.exit()
}
const env = Env.parse(Object.assign({}, JSON.parse(readFileSync(project!).toString('utf8')) as HurxConfig), './')

// Create the dist folder
const distPath = path.join(projectRoot!, env.paths.output.base)
if (existsSync(distPath)) {
    rmSync(distPath, {
        force: true,
        recursive: true
    })
}
const projectHurxDistPath = path.join(distPath, '../', '.hurx', 'dist')
const projectHurxSourcePath = path.join(distPath, '../', '.hurx', 'src')
if (existsSync(projectHurxDistPath)) {
    rmSync(projectHurxDistPath, {
        force: true,
        recursive: true
    })
}
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
let tsconfigHurxSrc = {
    ...tsconfigJSON,
    compilerOptions: {
        ...tsconfigJSON.compilerOptions || {},
        rootDir: './',
        rootDirs: undefined,
        outDir: '../dist'
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
const paths = [[
    env.paths.sources, 
    'src'
], [
    env.paths.resources, 
    Paths.relativeWithoutDotSlash(env.paths.output.resources!).replace(dist, '')
], [
    env.paths.logs, 
    Paths.relativeWithoutDotSlash(env.paths.output.logs!).replace(dist, '')
]]
for (const _paths of paths) {
    if (_paths[0] && _paths[1]) {
        const _path = path.join(projectRoot!, _paths[0])
        if (fs.existsSync(_path)) {
            copySourceFiles(readdirSync(_path, {
                withFileTypes: true
            }), _path, path.join(projectRoot!, '.hurx', _paths[1]))
        }
        else {
            if (_paths[0] === env.paths.sources) {
                logger.info(`No sources folder in project`)
            }
            else if (_paths[0] === env.paths.resources) {
                logger.info(`No resources folder in project`)
            }
            else if (_paths[0] === env.paths.logs) {
                logger.info(`No logs folder in project`)
            }
        }
    }
}

function randomAlphanumericCharacter() {
    const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * alphanumeric.length);
    return alphanumeric.charAt(randomIndex);
}
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
writeFileSync(tsconfigHurxSrcPath, JSON.stringify({
    ...tsconfigHurxSrc,
    compilerOptions: {
        ...tsconfigHurxSrc.compilerOptions,
        outDir: `./${tempDistName}`
    }
}, null, 4))

// Copy files
const copyProjectRootFiles = (_path: string) => {
    copyFileSync(packageJSONDistPath, path.join(_path, 'package.json'))
    copyFileSync(path.join(projectRoot!, 'hurx.json'), path.join(_path, 'hurx.json'))
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
logger.info(`Installing temporary node_modules`)
let childProcess = child.execSync(`cd "${projectHurxSourcePath}" && npm i`, {
    stdio: 'inherit'
})

// Compile typescript
logger.info(`Compiling temporary typescript project`)
childProcess = child.execSync(`cd "${projectHurxSourcePath}" && npx tsc`, {
    stdio: 'inherit'
})

// Copy files to dist
logger.info(`Copying files to temporary project root`)
copyProjectRootFiles(path.join(projectHurxSourcePath, tempDistName))

// Copy all other files except ts and hurx from the temp source to temp dist
const copyAllFilesExceptTSAndHurx = (_path: string) => {
    const src = path.join(projectRoot!, env.paths.sources, _path)
    const dist = path.join(projectHurxSourcePath, tempDistName, _path)
    if (!fs.existsSync(dist)) {
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
            if (!entry.name.endsWith('.ts')) {
                copyFileSync(path.join(src, entry.name), path.join(dist, entry.name))
            }
        }
    }
}
copyAllFilesExceptTSAndHurx('./')

// Copies the files to the actual dist
const copyFilesToActualDist = (_path: string) => {
    const src = path.join(projectHurxSourcePath, tempDistName, _path)
    const dist = path.join(projectRoot!, env.paths.output.base, _path)
    if (!fs.existsSync(dist)) {
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
    writeFileSync(path.join(distPath, 'hurx.json'), JSON.stringify(hurxJSON, null, 4))
}
modifyPathsInHurxJSONDist()