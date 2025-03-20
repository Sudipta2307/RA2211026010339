require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock API endpoint (Replace with actual API URL)
const SOCIAL_MEDIA_API = "https://jsonplaceholder.typicode.com";

// 🏆 Route 1: Get Top 5 Users with Most Posts
app.get("/api/top-users", async (req, res) => {
  try {
    const { data: posts } = await axios.get(`${SOCIAL_MEDIA_API}/posts`);
    
    // Count posts per user
    const userPostCount = {};
    posts.forEach(post => {
      userPostCount[post.userId] = (userPostCount[post.userId] || 0) + 1;
    });

    // Sort and get top 5 users
    const topUsers = Object.entries(userPostCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, postCount]) => ({ userId, postCount }));

    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// 🔥 Route 2: Get Most Commented Post
app.get("/api/trending-posts", async (req, res) => {
  try {
    const { data: posts } = await axios.get(`${SOCIAL_MEDIA_API}/posts`);
    const { data: comments } = await axios.get(`${SOCIAL_MEDIA_API}/comments`);

    // Count comments per post
    const commentCount = {};
    comments.forEach(comment => {
      commentCount[comment.postId] = (commentCount[comment.postId] || 0) + 1;
    });

    // Get most commented post(s)
    const maxComments = Math.max(...Object.values(commentCount));
    const trendingPosts = posts
      .filter(post => commentCount[post.id] === maxComments)
      .map(post => ({ ...post, commentCount: maxComments }));

    res.json(trendingPosts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// 🔄 Route 3: Get Real-time Feed (Latest Posts)
app.get("/api/feed", async (req, res) => {
  try {
    const { data: posts } = await axios.get(`${SOCIAL_MEDIA_API}/posts`);
    res.json(posts.reverse().slice(0, 10)); // Get latest 10 posts
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// 🚀 Start the Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
