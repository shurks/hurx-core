import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'

module.exports = {
	entry: './src/frontend/index.tsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.min.js',
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx'],
	},
	optimization: {
		minimizer: [new TerserPlugin()],
	},
}