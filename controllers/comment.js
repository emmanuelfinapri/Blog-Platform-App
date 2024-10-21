const commentModel = require("../models/comment");
const postModel = require("../models/post");
const { post } = require("../routes/user");

// Function to make a comment
const makeComment = async (req, res) => {
  try {
    const { comment } = req.body; // Get comment text from the request body
    const { username } = req.user; // Get username from the request user object
    const { postId } = req.query; // Get postId from the request query

    // Find the post by ID
    const thePost = await postModel.findById(postId);
    if (!thePost) {
      return res
        .status(400)
        .json({ message: "This Post does not exist, use a different post Id" });
    }

    // Create a new comment
    const newComment = new commentModel({
      comment,
      commentor: username,
      postId, // Include the postId in the comment
    });

    // Save the comment to the database
    const savedComment = await newComment.save();

    thePost.comments.push({
      commentId: savedComment._id,
      commentText: savedComment.comment,
      commentor: username,
    });

    // Save the updated post
    await thePost.save(); // Ensure you save the post after modifying its comments

    // Respond with a success message
    if (thePost.postCreator === username) {
      return res.status(200).json({
        message: `Hey ${username}, you just commented on your post.`,
      });
    } else {
      return res.status(200).json({
        message: `Hey ${username}, you just commented on ${thePost.postCreator}'s post.`,
      });
    }
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message });
  }
};

// Function to edit an existing comment
const editComment = async (req, res) => {
  try {
    const { comment, commentId } = req.body; // Get comment text and ID from the request body
    const { username } = req.user; // Get username from the request user object

    // Find the comment to be edited by its ID
    const commentInfo = await commentModel.findById(commentId);

    // If the comment doesn't exist, send a 404 error response
    if (!commentInfo) {
      return res
        .status(400)
        .json({ message: "Sorry, this comment does not exist" });
    }

    // Ensure the comment belongs to the user making the request (optional)
    if (commentInfo.commentor !== username) {
      return res
        .status(400)
        .json({ message: "You do not have permission to edit this comment" });
    }

    // Find post associated with the comment
    const postInfo = await postModel.findById(commentInfo.postId);
    if (!postInfo) {
      return res
        .status(400)
        .json({ message: "Associated post does not exist" });
    }

    // Update the comment in the comment model
    commentInfo.comment = comment; // Modify the comment text
    await commentInfo.save(); // Save the updated comment

    // Find the index of the comment in the post's comments array
    const commentIndex = postInfo.comments.findIndex(
      (c) => c.commentId.toString() === commentId
    );

    // Update the corresponding commentText in the post's comments array if it exists
    if (commentIndex !== -1) {
      postInfo.comments[commentIndex].commentText = comment; // Update the text
      await postInfo.save(); // Save the updated post
    }

    // Send a success response after updating the comment
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message });
  }
};

// Function to delete an existing comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.query;
    const { username } = req.user; // Get username from the request user object

    // Find the comment to be deleted by its ID
    const commentInfo = await commentModel.findById(id);
    // Find post associated with the comment
    const postInfo = await postModel.findById(commentInfo.postId);

    // Ensure the comment belongs to the user making the request (optional)
    if (
      commentInfo.commentor !== username ||
      username !== postInfo.postCreator
    ) {
      return res.status(400).json({
        message: `Hey ${username}, You do not have permission to DELETE ${commentInfo.commentor}'s comment on ${postInfo.postCreator}'s post`,
      });
    }

    // If the comment doesn't exist, send a 400 error response
    if (!commentInfo) {
      return res
        .status(400)
        .json({ message: `Sorry ${username}, this comment does not exist` });
    }
    // If the post doesn't exist, send a 400 error response
    if (!postInfo) {
      return res
        .status(400)
        .json({ message: "Associated post does not exist" });
    }

    // Update the comment in the comment model
    commentInfo.comment = comment; // Modify the comment text
    await commentInfo.save(); // Save the updated comment

    // Delete the comment from the database
    await commentModel.findByIdAndDelete(id);

    // Find the index of the comment in the post's comments array
    const commentIndex = postInfo.comments.findIndex(
      (c) => c.commentId.toString() === commentId
    );

    // Remove the corresponding comment from the post's comments array if it exists
    if (commentIndex !== -1) {
      postInfo.comments.splice(commentIndex, 1); // Remove the comment at the found index
      await postInfo.save(); // Save the updated post to persist the changes
    }

    // Send a success response after deleting the comment
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message });
  }
};

const viewSingleComment = async (req, res) => {
  try {
    const { commentId } = req.query;
    const oneComment = await commentModel.findById(commentId);
    //   .select("-_id comment commentor");

    res.status(200).json(oneComment);
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message });
  }
};

const viewAllComments = async (req, res) => {
  try {
    const allComments = await commentModel.find();
    res.status(200).json(allComments);
  } catch (error) {
    // Send an error response if there's an exception
    res.status(500).json({ message: error.message });
  }
};

// Delete all users from the database
const deleteAllComments = async (req, res) => {
  try {
    await commentModel.deleteMany({}); // Delete all users
    res.status(200).json({
      message: `You have successfully deleted every comment in this application`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle server error
  }
};
// Export the functions to be used in other parts of the application
module.exports = {
  makeComment,
  editComment,
  deleteComment,
  viewSingleComment,
  viewAllComments,
  deleteAllComments,
};
