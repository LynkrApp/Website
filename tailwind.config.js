/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}', // Tremor module
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        jetbrains: ['JetBrains Mono', 'Consolas', 'monospace'],
        nunito: ['Nunito', 'system-ui', 'sans-serif'],
        times: ['Times New Roman', 'Times', 'serif'],
        poppins: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        roboto: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        montserrat: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        opensans: ['Open Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        lato: ['Lato', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        comfortaa: ['Comfortaa', 'cursive', 'sans-serif'],
        crimson: ['Crimson Text', 'Georgia', 'serif'],
        oswald: ['Oswald', 'Impact', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
        sourcesans: ['Source Sans Pro', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        librebaskerville: ['Libre Baskerville', 'Georgia', 'serif'],
        outfit: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        merriweather: ['Merriweather', 'Georgia', 'serif'],
        spacegrotesk: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        worksans: ['Work Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        figtree: ['Figtree', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        ebgaramond: ['EB Garamond', 'Georgia', 'serif'],
        bebasneue: ['Bebas Neue', 'Impact', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'Georgia', 'serif'],
        dmsans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
