import { Router } from 'express';
const router = Router();
import { fetchStories, getPostDetails, fetchStoriesJs } from '../controllers/redditController.js';

router.get('/fetch-stories', fetchStories);  // Fetch bài viết từ Reddit
router.get('/fetch-stories-js', async (req, res) => {
    await fetchStoriesJs(req, res)
}); 
router.get('/', getPostDetails);  // Lấy chi tiết bài viết từ Firebase

export default router;