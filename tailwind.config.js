module.exports = {
  important: true,
  purge: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.js', './src/**/*.tsx', './src/**/*.ts'],
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};
