import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/index.js',   // 入口文件，以这个入口打包库
  output: {
    format: 'umd',    // 模块化的类型 比如 esModule commonjs umd
    name: 'Vue',      // 全局变量的名字
    file: 'dist/umd/vue.js', // 打包出来的文件
    sourcemap: true,    // 可以将转换前后的代码配置映射表，方便调试转换后的代码
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'    // node_modules 下面的所有文件都不打包
    }),
    serve({
      port: 3000,
      contentBase: '', // 空字符串表示以当前目录为基础
      openPage: '/index.html'   // 打开哪个文件
    })
  ]
}
