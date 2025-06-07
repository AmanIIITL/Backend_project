import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { response } from "express";
import path from "path";


const  generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken
        const refreshToken = user.generateRefreshToken

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // steps to register:-
    // get user detials from frontend
    // validation liek not empty
    // check if user already exists: username and email
    // check fro images , check for avatar
    // upload them to cloudinary, avatar and check if they are uplaoded or not
    // create user object  - create entry in database
    // remove password and refresh token from response
    // check for user creation
    // return response

    // 1
    const {username, fullname, email, password} = req.body
    // console.log("email: ", email);

    // 2
    // one way is to do seperately for each value
    // if(fullname === ""){
    //     throw new ApiError(400, "Full name is required")
    // }
    if(
        [fullname, email, username,  password].some((field) => field.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    // 3
    const existedUser = await User.findOne({
        $or: [{ username } , { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with username or email already exists")
    }

    // 4
    // const avatarLocalPath = path.resolve(req.files?.avatar[0]?.path);
    // const coverImageLocalPath = path.resolve(req.files?.coverImage[0]?.path);
    // above methods se if avatar aur coverimage nahi di toh error function me aaega ki cannot access 0th element, naki 
    // avatar is required
    // console.log("Absolute avatar path:", avatarLocalPath);

    let avatarLocalPath;
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
        avatarLocalPath = path.resolve(req.files.avatar[0].path)
    }

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = path.resolve(req.files.coverImage[0].path)
    }
    
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    // 5
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    console.log("req.files:", req.files);
    console.log("req.body:", req.body);

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    // 6
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // 7

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // ye dono fields user ke response me nhi aaengi
    )

    // 8

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    // 9
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // req body se data
    // username or email based login
    // find the user
    // password check if user exists
    // access and refresh token generate and send them to user and save refresh token to db
    // send cookie

    // 1
    const {email, username, password} = req.body

    // 2
    if(!username || !email){
        throw new ApiError(400," username or email is required")
    }

    // 3
    const user = User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "user does not exists")
    }

    // 4
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    // 5
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(_id).select("-password -refreshToken")

    // 6
    const options = {
        httpOnly: true,
        secure: true //dono krne se cookie bas server se hi modify ho paegi naki frontend se
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200,{
            user: loggedInUser, accessToken, refreshToken
        }, "User logged in successfully")
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    // find user
    // clear cookies
    // clear refreshToken
    await User.findByIdAndUpdate(req,user._id,
        {
        $set: {
            refreshToken: undefined
        }
        },{
        new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true //dono krne se cookie bas server se hi modify ho paegi naki frontend se
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken").json(
        new ApiResponse(200, {}, "User logged out successfully")
    )
})

export {registerUser, loginUser, logoutUser}