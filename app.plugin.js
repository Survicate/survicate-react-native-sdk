const packageJson = require('./package.json');

const pkg = {
  name: packageJson.name,
  version: packageJson.version,
};

const plugin = require('./lib/commonjs/expo/withSurvicate');

module.exports = plugin.default(pkg);
