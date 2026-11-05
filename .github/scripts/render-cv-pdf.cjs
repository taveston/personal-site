// Renders index.html to download/tom-aveston-cv.pdf using the print stylesheet.
// Run from the repository root after installing Playwright and Chromium.
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..', '..');
const input = pathToFileURL(path.join(root, 'index.html')).href;
const output = path.join(root, 'download', 'tom-aveston-cv.pdf');
fs.mkdirSync(path.dirname(output), { recursive: true });

(async () => {
	const browser = await chromium.launch();
	try {
		const page = await browser.newPage();
		await page.goto(input, { waitUntil: 'networkidle' });
		await page.evaluate(() => document.fonts.ready);
		await page.pdf({
			path: output,
			format: 'A4',
			printBackground: false,
			margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' },
		});
		console.log(`Wrote ${output}`);
	} finally {
		await browser.close();
	}
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
