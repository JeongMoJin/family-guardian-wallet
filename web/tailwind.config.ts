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
          bg: '#FBE4E9',
          bgDeep: '#EFD8EC',
          card: '#FFFFFF',
          accent: '#9C7FCC',
          accentDeep: '#7E5DB0',
          accentSoft: '#D8A8C8',
          ink: '#3A2C4F',
          inkSoft: '#5C4A75',
          muted: '#8A7B9A',
          line: '#EAD7E2',
          good: '#5BA988',
          goodSoft: '#E5F3EC',
          warn: '#C97B95',
          warnSoft: '#FCE4EC',
          bad: '#D8556B',
        },
      },
      boxShadow: {
        soft: '0 12px 32px rgba(124, 90, 160, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;
