const themeDir = __dirname + '/../../';
const dependencyPaths = [themeDir, themeDir + 'node_modules'].concat(
    (process.env.NODE_PATH || '').split(require('path').delimiter).filter(Boolean)
);

module.exports = {    
    plugins: [        
        require('postcss-import')({
            path: dependencyPaths
            }), 
        require('tailwindcss')(themeDir + 'assets/css/tailwind.config.js'),
        require('autoprefixer')({
            path: [themeDir]
        }),
    ]
}
