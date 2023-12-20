import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5006;

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Define the CommunityPost schema
const { Schema, model } = mongoose;
const CommunityPostSchema = new Schema({
	caption: String,
	imageUrl: String,
	user_id: String,
	username: String,
});

// Create a model based on the schema
const CommunityPost = model("CommunityPost", CommunityPostSchema);

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.use(cors()); // to allow cross origin resource sharing

// Define routes

// GET request to retrieve all community posts
app.get("/api/community-posts", async (req, res) => {
	try {
		const posts = await CommunityPost.find();
		res.json(posts);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// POST request to add a new community post
app.post("/api/community-posts", async (req, res) => {
	const { caption, imageUrl, user_id, username } = req.body;

	try {
		const newPost = new CommunityPost({ caption, imageUrl, user_id, username });
		const savedPost = await newPost.save();
		res.status(201).json(savedPost);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
