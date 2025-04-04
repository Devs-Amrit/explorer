import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user_model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponce.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user detail from frontend.

  const { email, fullname, username, password } = req.body;
  console.log("Request body:-", req.body);

  // validation -not empty.

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required..");
  }

  // check if user alredy exist: username,email..

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User Already Exist");
  }

  // check for image,check for avatar

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage > 0
  ) {
    coverImageLocalPath = req.files.coverImageLocalPath[0].path;
  }

  console.log("Request file:-", req.files);

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is required..");
  }

  // upload them to cloudinary,avatar.

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar is required..");
  }

  // create user object - create entry in db.

  const user = await User.create({
    fullname,
    email,
    username,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // remove password and refresh token field from response.

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation.

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user.."
    );
  }

  // return response.

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Created Successfully.."));
});
export { registerUser };
