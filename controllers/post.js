// Importing the required model
const postModel = require("../models/post");

// Function to create a new post
const makePost = async (req, res) => {
  try {
    const { ...others } = req.body; // Extract the request body
    const { username } = req.user;
    const newPost = new postModel({ ...others, postCreator: username }); // Create a new post instance

    // Save the new post to the database
    await newPost.save();
    // Send a success response
    res.status(200).json({
      message: `Hey ${username} your Post has been created successfully`,
    });
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message });
  }
};

// Function to get all posts
const getAllPost = async (req, res) => {
  try {
    // Retrieve all posts from the database
    const allPost = await postModel
      .find()
      .select("title desc previewPics detailPics category postCreator");
    // Send a response with all posts
    res.status(200).json(allPost);
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message });
  }
};

// Function to get a single post by ID
const getSinglePost = async (req, res) => {
  try {
    const { id } = req.query; // Extract the post ID from the request query
    // Retrieve a single post by its ID
    const singlePost = await postModel
      .findById(id)
      .select("title desc previewPics detailPics category postCreator");
    // Send a response with the post
    res.status(200).json(singlePost);
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message });
  }
};

// Function to update a post
const updatePost = async (req, res) => {
  try {
    const { ...others } = req.body;
    const { postId } = req.query;
    const { username } = req.user;

    // Retrieve the post to be updated by its ID
    const post = await postModel.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ message: "This post doesn't exist, provide a valid id" });
    }

    if (!(post.postCreator === username)) {
      return res.status(400).json({
        message: `Hey ${username} this post does not belong to you, so you can't edit it `,
      });
    }

    // Update the post with new data
    await postModel.findByIdAndUpdate(postId, others, { new: true });
    // Send a success response
    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message });
  }
};

// Function to delete a post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.query;
    const { username } = req.user;

    // Retrieve the post to be deleted by its ID
    const post = await postModel.findById(postId);

    // Check if the post belongs to the creator making the request
    if (post.postCreator !== username) {
      return res
        .status(400)
        .json({ message: `You can only delete your own post ${username}` });
    }

    // Delete the post from the database
    await postModel.findByIdAndDelete(postId);
    // Send a success response
    res.status(200).json({ message: "Post has been deleted successfully" });
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message });
  }
};

// Function to like or dislike a post
const likePost = async (req, res) => {
  try {
    const { postId } = req.query;
    const { username } = req.user;
    const thePost = await postModel.findById(postId); // Retrieve the post by its ID

    // Check if the post exists
    if (!thePost) {
      return res.status(400).json({ message: "This post does not exist" });
    }

    // Array to hold all likes
    const gottenLikes = thePost.likes;

    // Check if the user has already liked the post
    const checkUserInArray = gottenLikes.includes(username);

    if (!checkUserInArray) {
      // Add the user to the likes array if they haven't liked the post
      gottenLikes.push(username);
      res
        .status(200)
        .json({ message: `Hey ${username} You have liked this post` });
    } else {
      // Remove the user from the likes array if they have already liked the post
      const getIndex = gottenLikes.indexOf(username);
      gottenLikes.splice(getIndex, 1);
      res
        .status(200)
        .json({ message: `You have disliked this post ${username}` });
    }

    // Update the likes in the database

    await postModel.findByIdAndUpdate(
      postId,
      { likes: gottenLikes },
      { new: true }
    );
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message });
  }
};

// Export all functions for use in other parts of the application
module.exports = {
  makePost,
  getAllPost,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
};
