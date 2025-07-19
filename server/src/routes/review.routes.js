import { Router } from "express";
import { addReview, getAllReviews, getReviewByUserId, getReviewByMovieId ,getTopReviewers,addLikeToReview,addCommentToReview,deleteCommentFromReview,addDislikeToReview} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";      



const router = Router();


router.route("/add").post(verifyJWT,addReview);
router.route("/").get(getAllReviews);
router.route("/userReview/:userId").get(verifyJWT,getReviewByUserId);
router.route("/topReviewers").get(getTopReviewers);
router.route("/:id").get(getReviewByMovieId);
router.route("/like/:reviewId").post(verifyJWT,addLikeToReview);
router.route("/comment/:reviewId").post(verifyJWT,addCommentToReview);
router.route("/comment/:reviewId/:commentId").delete(verifyJWT,deleteCommentFromReview);
router.route("/dislike/:reviewId").post(verifyJWT,addDislikeToReview);





export default router;