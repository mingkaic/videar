import { VidearPage } from './app.po';

describe('videar App', () => {
	let page: VidearPage;

	beforeEach(() => {
		page = new VidearPage();
	});

	it('should display message saying app works', () => {
		page.navigateTo();
		expect(page.getParagraphText()).toEqual('app works!');
	});
});
