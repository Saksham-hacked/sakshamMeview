import { Router } from "express";

import { registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUSer,userSearch,getUserByUserName,followUser,unfollowUser,updateProfilePicture } from "../controllers/user.controler.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiErrors } from "../utils/apiErrors.js";

const router = Router();


router.route("/register").post(
    upload.single("profilePic"),
    registerUser);
    

router.route("/login").post(loginUser);

router.route("/checkLogin").get(verifyJWT, (req, res) => {
    
    res.status(200).json(
        new ApiResponse(200, "User is logged in", req.user)
    );

});



//secured routes
router.route("/").get(verifyJWT,getCurrentUSer);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/follow").post(verifyJWT,followUser);
router.route("/unfollow").post(verifyJWT,unfollowUser);
router.route("/uploadProfilePicture").post(
    verifyJWT,
    upload.single("profilePic"),
    updateProfilePicture);




router.route("/search").get(userSearch);
router.route("/:username").get(getUserByUserName);







export default router;