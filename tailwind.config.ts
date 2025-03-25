
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['Georgia', 'serif'],
				mono: ['monospace'],
				cute: ['Indie Flower', 'cursive'],
				pacifico: ['Pacifico', 'cursive'],
				caveat: ['Caveat', 'cursive'],
				amatic: ['Amatic SC', 'cursive'],
				dancing: ['Dancing Script', 'cursive'],
				shadows: ['Shadows Into Light', 'cursive'],
				patrick: ['Patrick Hand', 'cursive'],
				sacramento: ['Sacramento', 'cursive'],
				architects: ['Architects Daughter', 'cursive'],
				kalam: ['Kalam', 'cursive'],
				handlee: ['Handlee', 'cursive'],
				neucha: ['Neucha', 'cursive'],
				gloria: ['Gloria Hallelujah', 'cursive'],
				annie: ['Annie Use Your Telescope', 'cursive'],
				gochi: ['Gochi Hand', 'cursive'],
				schoolbell: ['Schoolbell', 'cursive'],
				poppins: ['Poppins', 'sans-serif'],
				nunito: ['Nunito', 'sans-serif'],
				comic: ['Comic Neue', 'cursive'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				whatsapp: {
					light: '#DCF8C6',
					green: '#25D366',
					dark: '#075E54',
					teal: '#128C7E',
					blue: '#34B7F1',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				themes: {
					default: '#128C7E',
					blue: '#3498db',
					purple: '#9b59b6',
					pink: '#E91E63',
					red: '#e74c3c',
					orange: '#e67e22',
					yellow: '#f1c40f',
					green: '#2ecc71',
					teal: '#1abc9c',
					cyan: '#00BCD4',
					indigo: '#3F51B5',
					deepPurple: '#673AB7',
					amber: '#FFC107',
					deepOrange: '#FF5722',
					brown: '#795548',
					blueGray: '#607D8B',
					lime: '#CDDC39',
					lightBlue: '#03A9F4',
					lightGreen: '#8BC34A',
					deepPink: '#FF1493',
				},
				pastel: {
					pink: '#FFC0CB',
					blue: '#A6E1FA',
					green: '#C7FFDA',
					yellow: '#FFFAC0',
					lavender: '#E0C3FC',
					peach: '#FDCEB9',
					mint: '#DBFFD6',
					lilac: '#D8C2FF',
					coral: '#FFB5A7',
					sky: '#B8E2F2',
				},
				journal: {
					lined: '#F0F4F8',
					grid: '#EFF1F3',
					dotted: '#F5F7FA',
					beige: '#F5F5DC',
					cream: '#FFFDD0',
					tan: '#D2B48C',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				'fade-in-up': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-in-right': {
					from: { transform: 'translateX(100%)' },
					to: { transform: 'translateX(0)' },
				},
				'slide-in-left': {
					from: { transform: 'translateX(-100%)' },
					to: { transform: 'translateX(0)' },
				},
				'slide-up': {
					from: { transform: 'translateY(20px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' },
				},
				'zoom-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' },
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-2deg)' },
					'50%': { transform: 'rotate(2deg)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				'pop': {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'50%': { transform: 'scale(1.05)' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-in-up': 'fade-in-up 0.4s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-in-left': 'slide-in-left 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'zoom-in': 'zoom-in 0.3s ease-out',
				'wiggle': 'wiggle 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'pop': 'pop 0.3s forwards',
			},
			backgroundImage: {
				'chat-pattern': "url('/images/chat-pattern.png')",
				'chat-pattern-light': "url('/images/chat-pattern-light.png')",
				'chat-pattern-dark': "url('/images/chat-pattern-dark.png')",
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'pastel-gradient-pink': 'linear-gradient(135deg, #ffdde1, #ee9ca7)',
				'pastel-gradient-blue': 'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
				'pastel-gradient-green': 'linear-gradient(135deg, #84fab0, #8fd3f4)',
				'pastel-gradient-yellow': 'linear-gradient(135deg, #f6d365, #fda085)',
				'pastel-gradient-purple': 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
				'dots-pattern': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
				'lines-pattern': "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 5v1H5z'/%3E%3Cpath d='M6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E\")",
				'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 17.5c4.142 0 7.5-3.358 7.5-7.5S14.142 2.5 10 2.5 2.5 5.858 2.5 10s3.358 7.5 7.5 7.5z' fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
