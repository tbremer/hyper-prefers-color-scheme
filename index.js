const electron = require('electron');

const hasCalled = {
  getDefinedThemes: false,
  isDarkMode: null,
};

function getThemeObj(themePath, config) {
  const themeModule = require(themePath);
  const theme = themeModule.decorateConfig(config);

  return theme;
}

const getDefinedThemes = (() => {
  let themes = null;
  return (pluginsWithPaths, config) => {
    if (themes) return themes;
    const { hyperPreferColorScheme } = config;
    const pathMap = pluginsWithPaths.plugins.reduce(
      (map, cur) => {
        if (cur.endsWith(hyperPreferColorScheme.light)) {
          map.light = cur;
        }
        if (cur.endsWith(hyperPreferColorScheme.dark)) {
          map.dark = cur;
        }

        return map;
      },
      { light: null, dark: null }
    );

    const lightTheme = getThemeObj(pathMap.light, config);
    const darkTheme = getThemeObj(pathMap.dark, config);

    themes = { darkTheme, lightTheme };

    hasCalled.getDefinedThemes = true;

    return themes;
  };
})();

module.exports = {
  middleware: (store) => (next) => (action) => {
    if (window.themes && window.hasSetTheme === false) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      window.hasSetTheme = true;

      mql.addEventListener('change', (evt) => {
        store.dispatch({
          type: 'PREFERS_COLOR_SCHEME_CHANGE',
          isDarkMode: evt.matches,
        });
      });

      store.dispatch({
        type: 'PREFERS_COLOR_SCHEME_CHANGE',
        isDarkMode: mql.matches,
      });
    }

    return next(action);
  },

  onWindow(window) {
    const themes = getDefinedThemes(electron.app.plugins.getPaths(), electron.app.config.getConfig());

    window.webContents.executeJavaScript(`window.themes=${JSON.stringify(themes)};window.hasSetTheme=false`);
  },

  reduceUI(state, action) {
    if (action.type === 'PREFERS_COLOR_SCHEME_CHANGE') {
      const theme = window.themes[action.isDarkMode ? 'darkTheme' : 'lightTheme'];

      return (
        state
          //colors
          .set('foregroundColor', theme?.foregroundColor ?? config.foregroundColor)
          .set('backgroundColor', theme?.backgroundColor ?? config.backgroundColor)
          .set('borderColor', theme?.borderColor ?? config.borderColor)
          .set('colors', theme?.colors ?? config.colors)
          .set('cursorColor', theme?.cursorColor ?? config.cursorColor)
          .set('selectionColor', theme?.selectionColor ?? config.selectionColor)
          //fonts
          .set('fontSize', theme?.fontSize ?? config.fontSize)
          .set('fontFamily', theme?.fontFamily ?? config.fontFamily)
          //misc
          .set('css', theme?.css ?? config.css)
          .set('termCSS', theme?.termCSS ?? config.termCSS)
          .set('cursorShape', theme?.cursorShape ?? config.cursorShape)
      );
    }
    return state;
  },
};
