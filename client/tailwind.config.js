module.exports = {
  mode: 'jit',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  purge: [
    './public/**/*.html',
    './app/**/*.{js,jsx,ts,tsx,vue}',
  ],
  plugins: [],
};
