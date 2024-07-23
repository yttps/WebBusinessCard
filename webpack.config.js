import { resolve as _resolve, join } from 'path';
const __dirname = _resolve();

// eslint-disable-next-line no-undef
export const entry = './src/index.tsx';
export const output = {
    path: _resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/', // เพิ่ม publicPath เพื่อให้ dev server รู้ว่าจะโหลดไฟล์จากไหน
};
export const resolve = {
    extensions: ['.ts', '.tsx', '.js', '.json'],
};
export const module = {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/,
        },
    ],
};
export const devServer = {
    historyApiFallback: true, // เพิ่มการตั้งค่านี้เพื่อใช้ HTML5 History API
    contentBase: join(__dirname, 'dist'), // ชี้ไปที่โฟลเดอร์ที่ build ไฟล์ไว้
    compress: true,
    port: 5174,
};
