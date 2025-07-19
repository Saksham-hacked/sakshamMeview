import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiErrors} from "../utils/apiErrors.js";
import {ApiResponse} from "../utils/apiResponse.js";
import Review from "../model/review.model.js";







const addReview =asyncHandler(async (req, res) => { 
    const {movieId,reviewText,movieTitle,moviePoster,rating,spoiler,userId} = req.body;
    console.log("movieId",movieId);
    console.log("reviewText",reviewText);
    console.log("rating",rating);
    console.log("spoiler",spoiler);
    console.log("userId",userId);
   
    if (
        typeof movieId !== "number" || movieId <= 0 ||
        typeof reviewText !== "string" || reviewText.trim() === "" ||
        rating === null
      ) {
        throw new ApiErrors(400, "All fields are required");
      }
    if(rating<0 || rating>10){
        throw new ApiErrors(400,"Rating should be between 0 and 10");
    }
    const review = await Review.create({movieId,reviewText,movieTitle,moviePoster,rating,spoiler,userId});
    if(!review){
        throw new ApiErrors(400,"Error creating review");
    }
    res.status(200).json(
        new ApiResponse(200,"Review created successfully",review)
    ) 

})



const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find().populate("userId", "-password -refreshToken");
    if(!reviews){
        throw new ApiErrors(400,"Error fetching reviews");
    }
    res.status(200).json(
        new ApiResponse(200,"Reviews fetched successfully",reviews)
    ) 
})

const getReviewByUserId = asyncHandler(async (req, res) => {
    // console.log("req.user",req.user);
    
    const  {userId}  = req.params;
    console.log("userId",userId);

    console.log("userId",userId);
    const review = await Review.find({userId:userId})
    console.log("review",review);
    if(!review){
        throw new ApiErrors(400,"Error fetching review");
    }
    res.status(200).json(
        new ApiResponse(200,"Review fetched successfully",review)
    ) 
})

const getReviewByMovieId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const review = await Review.find({movieId:id}).populate("userId", "-password -refreshToken");
    console.log("review",review);
    if(!review){
        throw new ApiErrors(400,"Error fetching review");
    }
    res.status(200).json(
        new ApiResponse(200,"Review fetched successfully",review)
    ) 
})

const getTopReviewers = asyncHandler(async (req, res) => {
  const topReviewers = await Review.aggregate([
    {
      $group: {
        _id: "$userId",
        totalReviews: { $sum: 1 },
        totalLikes: { $sum: "$likes" },
        totalComments: { $sum: { $size: "$comments" } }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        user: "$user",             // 👈 full user object
        userId: "$_id",
        totalReviews: 1,
        totalLikes: 1,
        totalComments: 1
      }
    },
    {
      $sort: {
        totalReviews: -1,
        totalLikes: -1,
        totalComments: -1
      }
    },
    { $limit: 10 }
  ]);

  if (!topReviewers) {
    throw new ApiErrors(400, "Error fetching top reviewers");
  }
    console.log("Top Reviewers:", topReviewers);

  res.status(200).json({
    success: true,
    message: "Top reviewers fetched successfully",
    data: topReviewers
  });
});


const addLikeToReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiErrors(400, "Review not found");
  }
  review.likes += 1;
  await review.save();
  res.status(200).json({
    success: true,
    message: "Like added to review successfully",
    data: review
  });
});

const addCommentToReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { commentText } = req.body;
    const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiErrors(400, "Review not found");
  }
    review.comments.push({
        text: commentText,
        userId: req.user._id, // Assuming req.user is populated with the authenticated user's info
        createdAt: new Date()
    });
  await review.save();
  res.status(200).json({
    success: true,
    message: "Comment added to review successfully",
    data: review
  });
});

const deleteCommentFromReview = asyncHandler(async (req, res) => {
  const { reviewId, commentId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiErrors(400, "Review not found");
  }
  const commentIndex = review.comments.findIndex(comment => comment._id.toString() === commentId);
  if (commentIndex === -1) {
    throw new ApiErrors(400, "Comment not found");
  }
  review.comments.splice(commentIndex, 1);
  await review.save();
  res.status(200).json({
    success: true,
    message: "Comment deleted from review successfully",
    data: review
  });
});

const addDislikeToReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiErrors(400, "Review not found");
  }
  review.dislikes += 1;
  await review.save();
  res.status(200).json({
    success: true,
    message: "Dislike added to review successfully",
    data: review
  });
});
    

export {
    addReview,
    getAllReviews,
    getReviewByUserId,
    getReviewByMovieId,
    getTopReviewers,
    addLikeToReview,
    addCommentToReview,
    deleteCommentFromReview,
    addDislikeToReview

}