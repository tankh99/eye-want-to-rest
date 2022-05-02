// The point of this metro.config.js is to prevent Expo from auto-recognising .db files as assets
const {getDefaultConfig} = require("expo/metro-config")
const defaultConfig = getDefaultConfig(__dirname)

module.exports = {
    resolver: {
        assetExts: [...defaultConfig.resolver.assetExts, "db"]
    }
}