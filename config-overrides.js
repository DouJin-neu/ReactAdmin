const {override, fixBabelImports} = require('customize-cra');
/**针对antd实现按需打包，根据import打包 */
module.exports = override(
    fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
    }),
);