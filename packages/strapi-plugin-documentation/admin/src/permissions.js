const pluginPermissions = {
  // This permission regards the main component (App) and is used to tell
  // If the plugin link should be displayed in the menu
  // And also if the plugin is accessible. This use case is found when a user types the url of the
  // plugin directly in the browser
  main: [
    { action: 'plugins::documentation.read', subject: null },
    { action: 'plugins::documentation.settings.regenerate', subject: null },
    { action: 'plugins::documentation.settings.update', subject: null },
  ],
  open: [
    { action: 'plugins::documentation.read', subject: null },
    { action: 'plugins::documentation.settings.regenerate', subject: null },
  ],
  regenerate: [{ action: 'plugins::documentation.settings.regenerate', subject: null }],
  update: [{ action: 'plugins::documentation.settings.update', subject: null }],
};

export default pluginPermissions;
