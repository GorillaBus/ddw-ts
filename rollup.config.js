import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/tu-libreria.js',
        format: 'umd', // Universal Module Definition
        name: 'DDW2'
    },
    plugins: [typescript({ sourceMap: true }), terser()]
};
