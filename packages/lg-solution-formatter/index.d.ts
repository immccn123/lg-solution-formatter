export default formatSolution;
export type Config = {
    clang?: {
        enabled?: boolean;
        config?: string;
    };
};
/**
 * @typedef {{
 *   clang?: {
 *     enabled?: boolean,
 *     config?: string
 *   }
 *  }} Config
 */
/**
 * @param {string} sourceStr
 * @param {Config} config
 */
export function formatSolution(sourceStr: string, config?: Config): Promise<string>;
/**
 * clang-format is not supported.
 *
 * @param {string} sourceStr
 */
export function formatSolutionSync(sourceStr: string): string;
