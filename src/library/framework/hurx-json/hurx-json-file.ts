// TODO: generate own json schemas

/**
 * The hurx.json config file format
 */
export type HurxConfig = {
    /**
     * Path to the hurx schema json
     */
    $schema: string

    /**
     * All package configurations
     */
    package: HurxConfigPackage
}

/**
 * A package in the hurx json file
 */
export type HurxConfigPackage = {
    /**
     * Name of the package
     */
    name: string

    /**
     * The version of the package
     */
    version: string

    /**
     * Whether the package is built or not
     */
    built?: boolean

    /**
     * Dependencies for the hurx project
     */
    dependencies?: HurxConfigDependencies

    /**
     * Dev dependencies for the hurx project
     */
    devDependencies?: HurxConfigDependencies

    /**
     * The environments for the project
     */
    env: HurxConfigEnvironments

    /**
     * All distributed apps within the project
     */
    apps: HurxConfigAppsPartial

    /**
     * Configuration of files
     */
    files: HurxConfigFiles
}

/**
 * Configuration of files
 */
export type HurxConfigFiles = {
    /**
     * The amount of indentations at the start of a line.
     * 
     */
    indents?: number

    /**
     * Files to add to gitignore
     */
    ignore: string[]
}

/**
 * A dependency in hurx.json
 */
export type HurxDependency = string

/**
 * The hurx.json package dependencies
 */
export type HurxConfigDependencies = {
    [name: string]: HurxDependency
}

/**
 * The base for an environment
 */
export type HurxConfigEnvironmentBase = {
    /**
     * All other process.env variables
     */
    [variable in string]: string | HurxConfigEnvironmentBase
}

/**
 * The base for an environment
 */
export type HurxConfigEnvironmentBasePartial = {
    /**
     * All other process.env variables
     */
    [variable in string]: undefined | string | HurxConfigEnvironmentBasePartial
}

/**
 * An environment in the hurx config file
 */
export type HurxConfigEnvironment = {
    /**
     * All application paths
     */
    paths: HurxPaths
} & HurxConfigEnvironmentBase

/**
 * An environment in the hurx config file
 */
export type HurxConfigEnvironmentPartial = {
    /**
     * All application paths
     */
    paths?: HurxPathsPartial
} & HurxConfigEnvironmentBasePartial

/**
 * The environments in hurx.json `package.env`
 */
export type HurxConfigEnvironments = Record<string, HurxConfigEnvironmentPartial> & {    
    /**
     * The default environment, of which every property can be overriden by other environments
     */
    default: HurxConfigEnvironment

    /**
     * The NODE_ENV value for npm
     */
    npm: string
    
    /**
     * The NODE_ENV value for git
     */
    git: string
}

/**
 * The base paths
 */
export type HurxPathsBase = {
    /**
     * The base path for the project (root)
     */
    base: string
    /**
     * The sources path
     */
    sources: string
    /**
     * The resources path
     */
    resources?: string
    /**
     * The logs path
     */
    logs?: string
}

/**
 * The base paths
 */
export type HurxPathsBasePartial = {
    /**
     * The base path for the project (root)
     */
    base?: string
    /**
     * The sources path
     */
    sources?: string
    /**
     * The resources path
     */
    resources?: string
    /**
     * The logs path
     */
    logs?: string
}

export type HurxPaths = Record<string, string> & HurxPathsBase & {
    /**
     * The output paths
     */
    output?: HurxPathsBase
}

export type HurxPathsPartial = Record<string, string> & HurxPathsBasePartial & {
    /**
     * The output paths
     */
    output?: HurxPathsBasePartial
}

/**
 * A binary app environment
 */
export type HurxConfigBinAppEnvironment = {
    /**
     * The environments for this application
     */
    [env: string]: HurxConfigBinAppPartial
} & {
    /**
     * The default configuration for the bin app
     */
    default: HurxConfigBinApp
}

/**
 * All binary apps
 */
export type HurxConfigBinApps = Record<string, HurxConfigBinAppEnvironment>

export type HurxConfigBinAppPartial = {
    /**
     * The app arguments
     */
    args?: string[]
    /**
     * Path overrides for the app
    */
    paths?: HurxPathsPartial
    /**
     * The main entry point
     */
    main?: string
} & HurxConfigEnvironmentBasePartial

/**
 * A binary application environment
 */
export type HurxConfigBinApp = {
    /**
     * The app arguments
     */
    args?: string[]
    /**
     * Path overrides for the app
    */
    paths: HurxPathsPartial
    /**
     * The main entry point
     */
    main: string
    /**
     * If this is true then the name of this bin application will be available as a command in `npx [name]`
     */
    npx?: boolean
} & HurxConfigEnvironmentBase

/**
 * All app configurations
 */
export type HurxConfigApp = HurxConfigBinApp

/**
 * All the hurx apps within the project
 */
export type HurxConfigAppsPartial = {
    /**
     * Binary projects
     */
    bin?: HurxConfigBinApps
}

/**
 * All the hurx apps within the project
 */
export type HurxConfigApps = {
    /**
     * Binary projects
     */
    bin: Record<string, HurxConfigBinAppEnvironment & HurxConfigBinApp>
}