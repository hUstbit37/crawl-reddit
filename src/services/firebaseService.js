import firebaseAdmin from 'firebase-admin'

//var serviceAccount = require("./public/js/firebase/config.json");
//import serviceAccount from "../../config/firebase-config.json" assert {type: 'json'}
import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": "firebase-adminsdk-cifj2@crawl-reddit.iam.gserviceaccount.com",
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
    "universe_domain": "googleapis.com"
  };
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