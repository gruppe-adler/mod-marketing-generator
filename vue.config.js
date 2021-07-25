module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'Mod Marketing Generator - Gruppe Adler';
                args[0].description = 'Online generator for standardized mod marketing material. This includes: logos, pictures and mod.cpp';
                return args;
            });
    }
};
