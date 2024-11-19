//const firebaseAdmin = require('firebase-admin');
import firebaseAdmin from 'firebase-admin'

//var serviceAccount = require("./public/js/firebase/config.json");
import serviceAccount from "../../config/firebase-config.json" assert {type: 'json'}
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://crawl-reddit.firebaseio.com"
});

const db = firebaseAdmin.firestore();

const saveStoriesToFirebase = async (stories) => {
    const batch = db.batch();
    stories.forEach(post => {
        const dateRef = db.collection('reddit2').doc(post.datetime.split(' ')[0]);
        dateRef.set({ date: post.datetime.split(' ')[0] });
        const postRef = dateRef.collection('posts').doc(post.post_id);
        batch.set(postRef, post);
    });
    await batch.commit();
}

const getPostDetails = async () => {
    const redditCollection = db.collection('reddit2');
    const daysSnapshot = await redditCollection.get();
    const allPosts = [];
    for (const dayDoc of daysSnapshot.docs) {
        const postsCollection = redditCollection.doc(dayDoc.id).collection('posts');
        const postsSnapshot = await postsCollection.get();
        postsSnapshot.forEach(postDoc => {
            allPosts.push(postDoc.data());
        });
    }
    return allPosts;
}

export const firebaseService = {
    saveStoriesToFirebase,
    getPostDetails
};