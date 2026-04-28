import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      // 시니어 친화 기본 폰트 사이즈 (base 18px)
      fontSize: {
        base: ['1.125rem', { lineHeight: '1.75rem' }],
        lg: ['1.25rem', { lineHeight: '1.875rem' }],
        xl: ['1.5rem', { lineHeight: '2rem' }],
        '2xl': ['1.875rem', { lineHeight: '2.375rem' }],
        '3xl': ['2.25rem', { lineHeight: '2.75rem' }],
        '4xl': ['2.75rem', { lineHeight: '3rem' }],
      },
      colors: {
        senior: {
          bg: '#FFF8F0',
          card: '#FFFFFF',
          accent: '#D97706',
          ink: '#1F2937',
          muted: '#6B7280',
          line: '#FDE9CA',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
