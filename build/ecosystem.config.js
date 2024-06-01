module.exports = {
    apps: [
        {
            name: "express-app",
            script: "./build/index.js",
            watch: true,
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
};
//# sourceMappingURL=ecosystem.config.js.map