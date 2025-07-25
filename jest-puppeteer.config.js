module.exports = {
    launch: {
        dumpio: true,
        headless: "new",
        args: [
            `--disable-extensions-except=${process.env.PWD}`,
            `--load-extension=${process.env.PWD}`,
            
        ],
    },
    browserContext: "default",
};