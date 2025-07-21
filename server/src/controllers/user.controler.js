import {asyncHandler} from "../utils/asyncHandler.js";
 import {ApiErrors} from "../utils/apiErrors.js";
 import {ApiResponse} from "../utils/apiResponse.js";
 import User from "../model/user.model.js";
 import { uploadOnCloudinary } from "../utils/cloudinary.js";
 import jwt from "jsonwebtoken";

const generateAccesstokenAndRefreshtoken = async (userId)=>{
    const user = await User.findById(userId);
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false});//we do not wnat to validate anything before saving
    return {accessToken,refreshToken};
}

const getUserByUserName = asyncHandler(async (req,res)=>{
    const {username} = req.params;
    const user = await User.findOne({username},"-password -refreshToken").populate("followers following","-password -refreshToken");
    if(!user){
        throw new ApiErrors(400,"User not found");
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            "User fetched successfully",
            user
        )
    );
})




// const registerUser = asyncHandler(async (req, res) => {
//     //getting user details
//     //validation
//     //check if user already exist
//     //check for images and avatar
//     //upload them to cloudinary
//     //create user obj in db
//     //remove password and refreshtoken from res
//     //check for user creation
//     //return res
//     const {username,email,password,bio}=req.body;
//     if([username,email,password].some((field)=>{
//         field?.trim()===""
//     })){
//         throw new ApiErrors(400,"All fields are required");
//     }
//     if(password.length<=0){
//         throw new ApiErrors(400,"Password should be at least 8 characters long");
//     }
//     if(!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
//         throw new ApiErrors(400,"Invalid email format");
//     }

//     const existeduser = await User.findOne({$or:[{username},{email}]});
//     console.log("existeduser",existeduser);
//     if(existeduser){
//         throw new ApiErrors(400,"Username or email already exists");
//     }
//     const profilePicLocal= req.file?.path;
//     console.log(profilePicLocal);
//     console.log(req.file);
    
//     // if(!profilePicLocal){
//     //     // throw new ApiErrors(400,"Profile picture is required");
//     //     // If no profile picture is provided, use a default image
//     //     console.log("No profile picture provided, using default image");

//     // }

//     const profilePicCloud=await uploadOnCloudinary(profilePicLocal);
   
//     let defaultImage='';
//     if(!profilePicCloud?.url){
//         console.log("No profile picture provided, using default image");
//         defaultImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${
//               user._id || user.username}`;
//     }else{
//         defaultImage = profilePicCloud.url;
//     }
    
//     const user=await User.create({username,email,password,bio,profilePic:profilePicCloud.url? profilePicCloud.url : defaultImage});

//     const createdUser=await User.findById(user._id).select("-password -refreshToken");
//     if(!createdUser){
//         throw new ApiErrors(500,"Error creating user");
//     }


//       const { accessToken, refreshToken } = await generateAccesstokenAndRefreshtoken(user._id);

//     const options = {
//         httpOnly: true,
//         secure: true,
//         sameSite: "none",
//     };

//     // Return the response with the cookies set and the user data
//     return res.status(201).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
//         new ApiResponse(
//             201,
//             "User registered and logged in successfully",
//             {
//                 user: createdUser,
//                 accessToken,
//                 refreshToken,
//             }
//         )
//     );

//     // res.status(201).json(
//     //     new ApiResponse(
//     //         201,
//     //         "User created successfully",
//     //         createdUser
//     //     )
//     // );



// });


const registerUser = asyncHandler(async (req, res) => {
    // Getting user details from request body
    const { username, email, password, bio } = req.body;

    // 1. Validation: Check if required fields are provided and trimmed
    // Ensure the callback for .some() explicitly returns a boolean
    if ([username, email, password].some(field => field?.trim() === "")) {
        throw new ApiErrors(400, "All fields (username, email, password) are required");
    }

    // Corrected password length validation: check if length is less than 8
    if (password.length <=0) {
        throw new ApiErrors(400, "Password should be at least 8 characters long");
    }

    // Email format validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new ApiErrors(400, "Invalid email format");
    }

    // 2. Check if user with given username or email already exists
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    console.log("existedUser", existedUser);
    if (existedUser) {
        // Provide more specific error if possible (e.g., which field exists)
        if (existedUser.username === username) {
            throw new ApiErrors(400, "Username already exists. Please choose a different one.");
        }
        if (existedUser.email === email) {
            throw new ApiErrors(400, "Email already registered. Please use a different email or sign in.");
        }
        // Fallback for unexpected cases
        throw new ApiErrors(400, "Username or email already exists");
    }

    // 3. Handle profile picture upload to Cloudinary or use a default image
    const profilePicLocalPath = req.file?.path;
    let profilePicUrl = ''; // Declare with 'let' to allow reassignment

    if (profilePicLocalPath) {
        const profilePicCloud = await uploadOnCloudinary(profilePicLocalPath);
        if (profilePicCloud?.url) {
            profilePicUrl = profilePicCloud.url;
        } else {
            // Log a warning if Cloudinary upload fails but a file was provided
            console.warn("Cloudinary upload failed for provided profile picture. Using default image.");
        }
    }

    // If no profile picture was provided or Cloudinary upload failed, use a default DiceBear avatar
    if (!profilePicUrl) {
        console.log("No valid profile picture URL, generating default image.");
        // Use the username (which is available from req.body) for the seed
        profilePicUrl = `https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=${username}`;
    }

    // 4. Create user object in the database
    // Ensure 'bio' is included if you intend to save it
    const user = await User.create({
        username,
        email,
        password,
        bio: bio || '', // Provide a default empty string if bio is not provided
        profilePic: profilePicUrl
    });

    // 5. Retrieve the newly created user, excluding sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        // This indicates a database issue after creation, or a problem with findById
        throw new ApiErrors(500, "Error creating user: Failed to retrieve user after registration.");
    }

    // 6. Generate access and refresh tokens for the newly registered user
    const { accessToken, refreshToken } = await generateAccesstokenAndRefreshtoken(user._id);

    // 7. Define cookie options
    const options = {
        httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
        secure: true,   // Ensures the cookie is only sent over HTTPS
        sameSite: "none", // Required for cross-site requests (e.g., frontend on different domain than backend)
    };

    // 8. Return the response with cookies set and user data
    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                201,
                "User registered and logged in successfully",
                {
                    user: createdUser,
                    accessToken,
                    refreshToken,
                }
            )
        );
});


const updateProfilePicture = asyncHandler(async (req, res) => {
  // 1. Get user ID from authenticated request
  // Assumes your authentication middleware populates req.user
  const userId = req.user?._id; 

  if (!userId) {
    throw new ApiErrors(401, "Unauthorized: User not authenticated.");
  }

  // 2. Check if a file was uploaded by Multer
  // Multer stores file info in req.file
  const profilePicLocalPath = req.file?.path;
    console.log("Profile picture local path:", profilePicLocalPath);

  if (!profilePicLocalPath) {
    throw new ApiErrors(400, "No profile picture file provided.");
  }

  // 3. Upload the new profile picture to Cloudinary
  const newProfilePicCloudinary = await uploadOnCloudinary(profilePicLocalPath);

  if (!newProfilePicCloudinary || !newProfilePicCloudinary.url) {
    // If Cloudinary upload failed, throw an error.
    // The uploadOnCloudinary function should handle local file cleanup in its catch block.
    throw new ApiErrors(500, "Failed to upload profile picture to Cloudinary.");
  }

  const newProfilePicUrl = newProfilePicCloudinary.url;

  // 4. Find the user and update their profile picture URL in the database
  const user = await User.findById(userId);

  if (!user) {
    // This case should ideally not happen if authentication is working correctly
    throw new ApiErrors(404, "User not found.");
  }

  // Optional: Delete old profile picture from Cloudinary if it's not a default one
  // This requires you to store the public_id in your User model, not just the URL
  /*
  if (user.profilePic && !user.profilePic.includes("dicebear") && !user.profilePic.includes("default-avatar")) {
    const oldPublicId = user.profilePic.split('/').pop().split('.')[0]; // Extract public_id from URL
    if (oldPublicId) {
      // Assuming you have a Cloudinary delete utility or call cloudinary.uploader.destroy directly
      // await cloudinary.uploader.destroy(oldPublicId);
      // console.log(`Old profile picture ${oldPublicId} deleted from Cloudinary.`);
    }
  }
  */

  // Update the user's profile picture
  user.profilePic = newProfilePicUrl;
  await user.save({ validateBeforeSave: false }); // ValidateBeforeSave: false is okay here as we only change profilePic

  // 5. Send success response with the new profile picture URL
  return res.status(200).json(
    new ApiResponse(
      200,
      "Profile picture updated successfully!",
      {
        profilePicUrl: newProfilePicUrl, // Send the new URL
        // You might send updated user object if your frontend needs it
        user: {
            _id: user._id,
            username: user.username,
            profilePic: user.profilePic,
            // ... other fields you want to return
        }
      }
    )
  );
});





const loginUser = asyncHandler(async (req,res)=>{
    //req.body -> data
    //username or email
    //find useer
    //check password
    //generate tokens
    //send cookies
    //send response

     
    console.log("body",req.body);
    const {email,password} = req.body;
    console.log("email",email);
    if(!email ){
        throw new ApiErrors(400,"Email is required");
    }
    
    const user = await User.findOne({email});
    if(!user){
        throw new ApiErrors(400,"Invalid credentials");
    }

    const isPasswordMatched = await user.comparePassword(password);//here we do not use User as it is instance method of user model and user contains the method
    if(!isPasswordMatched){
        throw new ApiErrors(400,"Invalid password");
    }

   const {accessToken,refreshToken} = await generateAccesstokenAndRefreshtoken(user._id);
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const options={
    httpOnly:true,
    secure:true,
    sameSite:"none",
   }//through these options no one can modify cookie through frontend

   return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
        new ApiResponse(
            200,
            "User logged in successfully",
            {
                user:loggedInUser,
                accessToken,
                refreshToken,
            }
        )
    );
   





})

const logoutUser = asyncHandler(async (req,res)=>{
   User.findByIdAndUpdate(req.user._id,{
    $set:{
        refreshToken:undefined,
    }},
    {
        new:true,
        
    }
   )

    const options={
     httpOnly:true,
     secure:true,
     sameSite:"none"
    
    }//through these options no one can modify cookie through frontend

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
        new ApiResponse(
            200,
            "User logged out successfully",
            {}
        )
    );
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    const imcomingRefreshToken = req.cookies?.refreshToken ||req.body.refreshToken|| req.headers("Authorization")?.split(" ")[1];
    if(!imcomingRefreshToken){
        throw new ApiErrors(401,"unauthorised request")
    }

   try {
     const decodedToken=jwt.verify(imcomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
 
     const user = await User.findById(decodedToken?.id).select("-password")
     if(!user){
         throw new ApiErrors(401,"unauthorised request")
     }
 
     if(user.refreshToken !== imcomingRefreshToken){
         throw new ApiErrors(401,"token expired, please login again")
     }
     const options={
         httpOnly:true,
         secure:true,
     }
     const {accessToken,refreshToken} = await generateAccesstokenAndRefreshtoken(user._id);
     res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
         new ApiResponse(
             200,
             "Acess token refreshed  successfully",
             {
                 user,
                 accessToken,
                 refreshToken,
             }
         )
     );
   } catch (error) {
     throw new ApiErrors(401,error?.message||"unauthorised request")
    
   }
    

    
});

const getCurrentUSer = asyncHandler(async (req,res)=>{
    if(!req.user){
        throw new ApiErrors(401,"unauthorised request");
    }
    const userDetails = await User.findById(req.user._id).select("-password -refreshToken").populate("followers following","-password -refreshToken");
    if(!userDetails){
        throw new ApiErrors(400,"Error fetching user");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "User fetched successfully",
            userDetails
        )
    );
})

const userSearch = asyncHandler(async (req,res)=>{
    console.log("hello from user search");
    console.log("req.query",req.query);
    const {query} = req.query;
    console.log("query",query);
    const users = await User.find({username:{$regex:query,$options:"i"}}).select("-password -refreshToken");
    if(!users){
        throw new ApiErrors(400,"Error fetching users");
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            "Users fetched successfully",
            users
        )
    );
})


const followUser = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id; // Logged-in user

    const { targetUserId } = req.body;  // User to follow
  
    if (currentUserId.toString() === targetUserId) {
      throw new ApiErrors(400, "You cannot follow yourself");
    }
  
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);
  
    if (!targetUser) {
      throw new ApiErrors(404, "User to follow not found");
    }
  
    // Prevent duplicate follows
    if (currentUser.following.includes(targetUserId)) {
      throw new ApiErrors(400, "You are already following this user");
    }
  
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);
  
    await currentUser.save();
    await targetUser.save();
  
    return res.status(200).json(
      new ApiResponse(200, "Followed user successfully", targetUser)
    );
  });

  // Unfollow a user
const unfollowUser = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;
    const { targetUserId } = req.body;
  
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);
  
    if (!targetUser) {
      throw new ApiErrors(404, "User to unfollow not found");
    }
  
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      id => id.toString() !== currentUserId.toString()
    );
  
    await currentUser.save();
    await targetUser.save();
  
    return res.status(200).json(
      new ApiResponse(200, "Unfollowed user successfully")
    );
  });
  






export {
    registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUSer,userSearch,followUser,unfollowUser,getUserByUserName,updateProfilePicture

};