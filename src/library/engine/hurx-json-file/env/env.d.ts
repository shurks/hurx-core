import { HurxEnv } from '../hurx-json-file'

declare namespace NodeJS {
    interface ProcessEnv extends HurxEnv {}
}