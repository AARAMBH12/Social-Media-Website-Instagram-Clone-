import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register=async(req,res)=>{
    try {
        const {username,email,password}=req.body ?? {};
        if(!username || !email || !password){
            return res.status(400).json({
                message:"Something is missing,please check!",
                success:false,
            });
        }
        const user=await User.findOne({$or:[{email},{username}]});
        if(user){
            return res.status(409).json({
                message:"Try a different email or username",
                success:false,

            });
            
        };
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
            username,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            message:"Account created successfully",
            success:true,
        })
    } catch (error) {
        console.error("Registration failed:", error);
        return res.status(500).json({
            message: "Failed to register user",
            success: false,
        });
    }
}
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body ?? {};
        if(!email || !password){
            return res.status(400).json({
                message:"Something is missing,please check!",
                success:false,
            });
        }
        let user=await User.findOne({email}).select("+password");
       
          if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password);
       if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };
           const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
         user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
            bookmarks: user.bookmarks
        }
     
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });
    }catch(error){
        console.error("Login failed:", error);
        return res.status(500).json({
            message: "Failed to log in",
            success: false,
        });
    }
}
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId)
            .populate({ path: 'posts', options: { sort: { createdAt: -1 } } })
            .populate({ path: 'bookmarks', options: { sort: { createdAt: -1 } } });
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
export const editProfile=async(req,res)=>{
    try {
        const userId=req.id;
        const {bio,gender}=req.body ?? {};
        const profilePicture=req.file;
        const hasGender=gender && gender !== "undefined";

        if(hasGender && !["male","female"].includes(gender)){
            return res.status(400).json({
                message:"Gender must be male or female",
                success:false,
            });
        }
        if(profilePicture && !profilePicture.mimetype?.startsWith("image/")){
            return res.status(400).json({
                message:"Please upload a valid image file",
                success:false,
            });
        }

          let cloudResponse;
          if(profilePicture){
            const fileUri=getDataUri(profilePicture);
           cloudResponse= await cloudinary.uploader.upload(fileUri);


          }
          const user=await User.findById(userId).select('-password');
          if(!user){
            return res.status(404).json({
                message:'User not found',
                succes:'false'

            })
          };
          if(bio !== undefined) user.bio=bio;
          if(hasGender) user.gender=gender;
          if(profilePicture) user.profilePicture=cloudResponse.secure_url;

          await user.save();
          return res.status(200).json({
            message:'Profile updated',
            success:true,
            user
          })
          
        
    } catch (error) {
        console.error(error);
        const isInvalidImage=error?.http_code === 400;
        return res.status(isInvalidImage ? 400 : 500).json({
            message:isInvalidImage
                ? "Unable to upload profile picture. Please choose a valid image."
                : "Unable to update profile. Please try again.",
            success:false,
        });
    }

}
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};
export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; 
        const jiskoFollowKrunga = req.params.id; 
        if (String(followKrneWala) === String(jiskoFollowKrunga)) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.some(
            followedUserId => String(followedUserId) === String(jiskoFollowKrunga)
        );
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({
                message: 'Unfollowed successfully',
                success: true,
                isFollowing: false
            });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({
                message: 'Followed successfully',
                success: true,
                isFollowing: true
            });
        }
    } catch (error) {
        console.log(error);
    }
}
