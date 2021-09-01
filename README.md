# hyper-prefers-color-scheme

## Concept

Allow for two color schemes for Light and Dark mode when your OS switches themes Hyper adapts as well.

## Install

Add `hyper-prefers-color-scheme` to the plugins array in your ~/.hyper.js config, or run `hyper -i hyper-prefers-color-scheme`.

## Confgure

In your `.hyper.js` configuration file you will need to add a new field to the `config` object, `hyperPrefersColorScheme` with two keys `light` & `dark`. Those keys will need to be color schemes that you have installed in your `plugins` array.

### Example `.hyper.js`

```javascript
module.exports = {
  config: {
    hyperPrefersColorScheme: {
      light: "hyper-papercolor",
      dark: "hyper-oceans16"
    },
    ...
    // your config setup
  },
  plugins: [
    "hyper-papercolor",
    "hyper-oceans16"
  ]
}
```

