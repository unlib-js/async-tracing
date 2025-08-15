import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import markdown from '@eslint/markdown'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
  { ignores: ['./node_modules/**/*', '**/dist/**/*'] },
  {
    name: 'javascript/typescript',
    files: ['./packages/**/*.ts', '*.ts'],
    plugins: { '@stylistic': stylistic },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      stylistic.configs.customize({
        indent: 2,
        quotes: 'single',
        semi: false,
        braceStyle: 'allman',
        quoteProps: 'as-needed',
      }),
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      curly: ['error', 'multi-line', 'consistent'],
      '@stylistic/max-len': ['warn', {
        code: 100,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: ' from \'',
      }],
    },
  },
  {
    name: 'markdown',
    files: ['./packages/**/*.md', '*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: markdown.configs.recommended,
  },
)
