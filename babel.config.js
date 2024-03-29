module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  plugins: [
    "babel-plugin-macros",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties"
  ]
};
