import { launch } from 'puppeteer';

export async function fetchRedditStories() {
    const browser = await launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36');
    await page.goto('https://www.reddit.com/r/UnresolvedMysteries/new/', { waitUntil: 'networkidle2', timeout: 100000 });

    await page.waitForSelector('.main-container', { timeout: 100000 });
    
    const stories = await page.evaluate(() => {
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 10 * 60 * 60 * 1000); // Thời gian cách 2 giờ từ hiện tại
        const result = [];
        console.log(2);
        
        nowDate = (new Date()).toISOString().replace('T', ' ').split('.')[0]
        // Duyệt qua các bài viết
        for (let item of document.querySelectorAll("main shreddit-feed article")) {
            const datetime = item.querySelector('shreddit-post').querySelector('time').getAttribute('datetime');
            const date = new Date(datetime);
            const userHref = item.querySelector('shreddit-post').querySelector('span[slot="credit-bar"] faceplate-tracker a').getAttribute('href')
            // Nếu bài viết có thời gian trong vòng 2 giờ từ hiện tại
            if (date >= twoHoursAgo && date <= now) {
                const formattedDate = date.toISOString().replace('T', ' ').split('.')[0];
                result.push({
                post_id: item.querySelector('shreddit-post').getAttribute('id'),
                title: item.getAttribute('aria-label'),
                url: item.querySelector('shreddit-post').getAttribute('content-href'),
                datetime: formattedDate,
                created_at: nowDate,
                user: userHref.split('/')[2],
                });
            } else {
                // Khi gặp bài viết có thời gian ngoài 2 giờ, dừng lại
                break;
            }
        }
        return result;
    });
    
    await browser.close();
    return stories;
}