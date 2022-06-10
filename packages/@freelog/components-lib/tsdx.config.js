const postcss = require('rollup-plugin-postcss');
const image = require('rollup-plugin-img');
module.exports = {
    rollup(config, options) {
        config.plugins.push(
            postcss({
                inject: true,
                // extract: !!options.writeMeta,
                modules: true, // 使用css modules
                // namedExport: true, // 类名导出
                camelCase: true, // 支持驼峰
                // sass: true, // 是否使用sass
                // less:true,
                // autoModules:true,
                // namedExports(name) {
                //   // Maybe you simply want to convert dash to underscore
                //   return name.replace(/-/g, '_')
                // }
            })
        );
        config.plugins.push(
            image({
                limit: 10000
            })
        );
        return config;
    },
};