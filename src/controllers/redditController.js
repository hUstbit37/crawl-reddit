import { fetchRedditStories } from '../services/puppeteerService.js';
import { firebaseService } from '../services/firebaseService.js';

export async function fetchStories(req, res) {
    try {
        const stories = await fetchRedditStories();
        if (stories.length > 0) {
            await firebaseService.saveStoriesToFirebase(stories);
            res.send(stories.length + ' Bài viết đã được lưu vào Firebase!');
        } else {
            res.send('Không tìm thấy bài viết mới.');
        }
    } catch (error) {
        res.status(500).send('Lỗi khi lấy bài viết từ Reddit - '+ error);
    }
}

export async function fetchStoriesJs(req, res) {
    try {
        const stories = await fetchRedditStories();
        if (stories.length == 0) {
            return res.json({message: "Không tìm thấy bài viết mới", success: false})
        }
        await firebaseService.saveStoriesToFirebase(stories);
        return res.json({message: stories.length + ' Bài viết đã được lưu!', success: true})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi khi lấy bài viết từ Reddit - '+ error.message, success: false});
    }
}

export async function getPostDetails(req, res) {
    try {
        const posts = await firebaseService.getPostDetails();
        res.render('reddit/list', { posts });
    } catch (error) {
        res.status(500).send('Lỗi khi lấy chi tiết bài viết - '+error);
    }
}