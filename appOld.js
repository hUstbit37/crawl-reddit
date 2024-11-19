const express = require('express');
const puppeteer = require('puppeteer');
const firebaseAdmin = require('firebase-admin')

var serviceAccount = require("./public/js/firebase/config.json");
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://crawl-reddit.firebaseio.com"
});
const db = firebaseAdmin.firestore();

async function fetchStories() {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36');
    await page.goto('https://www.reddit.com/r/UnresolvedMysteries/new/', { waitUntil: 'networkidle2', timeout: 100000 });

    await page.waitForSelector('.main-container', { timeout: 100000 });

    const stories = await page.evaluate(() => {
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 160 * 60 * 60 * 1000); // Thời gian cách 2 giờ từ hiện tại
        const result = [];
        
        nowDate = (new Date()).toISOString().replace('T', ' ').split('.')[0]
        // Duyệt qua các bài viết
        for (let item of document.querySelectorAll("main shreddit-feed article")) {
            const datetime = item.querySelector('shreddit-post').querySelector('time').getAttribute('datetime');
            const date = new Date(datetime);
            
            // Nếu bài viết có thời gian trong vòng 2 giờ từ hiện tại
            if (date >= twoHoursAgo && date <= now) {
                const formattedDate = date.toISOString().replace('T', ' ').split('.')[0];
                result.push({
                post_id: item.querySelector('shreddit-post').getAttribute('id'),
                title: item.getAttribute('aria-label'),
                url: item.querySelector('shreddit-post').getAttribute('content-href'),
                datetime: formattedDate,
                created_at: nowDate
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
// fetchStories().then(stories => {
//     if (stories) {
//       const batch = db.batch();
//       stories.forEach(post => {
//         const dateRef = db.collection('reddit2').doc(post.datetime.split(' ')[0]);
//         dateRef.set({date: post.datetime.split(' ')[0]})
//         const postRef = dateRef.collection('posts').doc(post.post_id)
//         batch.set(postRef, post);
//       });
//       batch.commit()
//       .then(() => {
//         console.log('Batch added successfully!');
//       })
//       .catch((error) => {
//         console.error('Error adding batch:', error);
//       });
//     } else {
//       console.log('Not found');
//     }
// }).catch(error => {
//     console.error(error);
// });


const getPostDetails = async () => {
    try {
        // Truy cập vào collection `reddit`
        const redditCollection = db.collection('reddit2');

        // Lấy danh sách các ngày (document)
        const daysSnapshot = await redditCollection.get();
        const days = daysSnapshot.docs.map(doc => doc.id); // Lấy ID của từng document (các ngày)
        const allPosts = [];
        
        for (const dayDoc of daysSnapshot.docs) {
            const dayId = dayDoc.id;
            
            // Lấy sub-collection `posts` từ từng ngày
            const postsCollection = redditCollection.doc(dayId).collection('posts');
            const postsSnapshot = await postsCollection.get();

            for (const postDoc of postsSnapshot.docs) {
                const postId = postDoc.id;
                
                // Lấy collection chi tiết bài post từ từng post
                const detailsCollection = postsCollection.doc(postId);                
                const detailsSnapshot = await detailsCollection.get();
                const detailData = detailsSnapshot.data();
                allPosts.push({
                    day: dayId,      // Ngày của bài post
                    ...detailData,   // Dữ liệu chi tiết bài post (title, content, date)
                });
            }
        }
        return allPosts
    } catch (error) {
        console.error('Error fetching post details:', error);
    }
};

// Gọi hàm để lấy chi tiết bài posts

const port = 8000

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.send('Hello World');  
});
app.get('/reddit', async (req, res) => {
    const posts = await getPostDetails(); // Lấy danh sách bài viết
    res.render('reddit/list', { posts });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    
})