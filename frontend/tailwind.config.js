/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                nature: {
                    950: '#051f15', // Deep cyber-nature dark
                    900: '#0b2b1e',
                    800: '#163328',
                    700: '#1c4a3a',
                    600: '#2d7a5d',
                    500: '#10b981', // Emerald primary
                    400: '#34d399', // Bright accent
                    300: '#6ee7b7',
                    200: '#a7f3d0',
                    100: '#ecfdf5',
                    50: '#f0fdf4',
                }
            },
            animation: {
                'scan': 'scan 2s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                scan: {
                    '0%, 100%': { transform: 'translateY(-100%)', opacity: '0' },
                    '10%': { opacity: '1' },
                    '50%': { transform: 'translateY(100%)', opacity: '1' },
                    '90%': { opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
