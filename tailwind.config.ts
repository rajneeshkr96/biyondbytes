import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

export default withUt({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['"Playfair Display"', 'serif'],
      display: ['"Playfair Display"', 'serif'],
      body: ['Inter', 'sans-serif'],
    },
    extend: {
      fontSize: {
        14: '14px',
      },
      colors: {
        "bb-ink": "#FAFAFA",
        "bb-surface": "#FFFFFF",
        "bb-surface-2": "#F5F5F5",
        "bb-muted": "#6B7280",
        "bb-accent": "#7c3aed",
        "bb-accent-2": "#ec4899",
        "bb-dark": "#060608",
        "bb-text": "#0A0A0A",
        "bb-border": "#E5E7EB",
        "light-color": '#F5F7F8',
        "main-text-color": '#495E57',
        "dark-color":"#45474B",
      },
      backgroundColor: {
        'main-bg': '#FCF8F3',
        'main-dark-bg': '#45474B',
        'main-color': '#495E57',
        'main-sec-color': '#F4CE14',
        'hover-bg': '#52665A',
      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      width: {
        400: '400px',
        760: '760px',
        780: '780px',
        800: '800px',
        1000: '1000px',
        1200: '1200px',
        1400: '1400px',
      },
      height: {
        80: '80px',
      },
      minHeight: {
        590: '590px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
});
