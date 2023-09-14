import { default as ESMLogger } from './logger.esm'

/**
 * A logger that works for both ESM and node, which is based
 * on the ESM logger.
 */
export default class Logger extends ESMLogger {}