import cjs from '@rollup/plugin-commonjs'
import path from 'path'
import cleanup from 'rollup-plugin-cleanup'
import resolve from 'rollup-plugin-node-resolve'
import ts from 'rollup-plugin-typescript2'
import packageJSON from './package.json'
const getPath = _path => path.resolve(__dirname, _path)

const extensions = ['.ts']

const tsPlugin = ts({
    tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
    extensions,
    useTsconfigDeclarationDir: true

})

const commonConf = {
    input: getPath('./src/index.ts'),
    plugins: [
        resolve(extensions),
        tsPlugin,
        cjs(),
        cleanup()
    ],
    external: ['axios'],

}
const outputMap = [
    {
        file: packageJSON.main,
        format: "umd",
        globals: {
            'axios': 'axios'
        }
    },
    {
        file: packageJSON.module, // es6模块
        format: 'es'
    },
    {
        file: packageJSON.cjs, // cmd模块
        format: 'cjs',
    }
]

const buildConf = options => Object.assign({}, commonConf, options)

const rollupConfig = outputMap.map(output => buildConf({
    output: { name: packageJSON.name, ...output }
}));

export default rollupConfig;