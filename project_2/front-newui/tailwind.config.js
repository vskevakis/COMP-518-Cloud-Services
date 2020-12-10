module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '93vh',
      'nav': '7vh',
      'screen': '100vh'
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      'dark-dark': '#212121',
      'mid-dark': '#393e46',
      'sm-dark': '#00adb5',
      'light-dark': '#eeeeee',
      'dark': '#112d4e',
      'mid': '#3f72af',
      'sm': 'dbe2ef',
      'light': '#f9f7f7',
    })
  },
  variants: {
    extend: {
      visibility: ['hover', 'focus', 'group-hover'],
      backgroundImage: ['hover', 'group-hover'],
    },
  },
  plugins: [],
}
