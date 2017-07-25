
exports.config = { 
  getPageTimeout: 5000,
  allScriptsTimeout: 50000,
  capabilities: {
    'browserName': 'chrome'
  },

  // Spec patterns are relative to this directory.
  specs: [
    'features/*.feature'
  ],
  directConnect: true,

  cucumberOpts: {
  require:    [ 'steps/**/*.ts' ],
  format:     ['pretty', 'json:report.json'],
  compiler:   'ts:ts-node/register',
  formatOptions: {"colorsEnabled": false}
  },
    
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  onPrepare: function() {
    //browser.waitForAngularEnabled(false);
  }
};