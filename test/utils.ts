import { exec } from "child_process"
import path from "path"

export function cli (args: string[],cwd: string):
Promise<{code: number, error: unknown, stdout: unknown, stderr: unknown}> {
    return new Promise( resolve => {
        const execPath = `node "${path.resolve('./dist/index.js')}" ${args.join(' ')}`
        exec(execPath),
        {cwd},
        (error: { code: number },stdout: unknown,stderr: unknown) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            resolve({
                code: error && error.code ? error.code : 0,
                error,
                stdout,
                stderr
            })
        }
    })
}