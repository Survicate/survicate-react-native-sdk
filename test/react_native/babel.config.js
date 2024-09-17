module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blocklist: null, // or use "blacklist"
        allowlist: null, // or use "whitelist"
        safe: false,
        allowUndefined: true,
      },
    ],
    // Include other plugins if necessary
  ],
};
