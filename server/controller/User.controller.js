import { User } from "../models/User.models.js";

const signUp=async(req,res)=>{
    try{
        const {username,password}=req.body;
        if(!username || !password){
            return res.status(400).json({success:false,message:"All fields are required"});
        }
        const existingUser=await User.findOne({username});
        if(existingUser){
            return res.status(400).json({success:false,message:"User already exists"});
        }
        const user=await User.create({
            username,
            password
        })
        return res.status(200).json({success:true,message:"User created successfully",user});
    }catch(error){
        return res.status(500).json({success:false,message:"Something went wrong while creating user",error});
    }
}

const generateAccessandRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    }catch(error){
        return res.status(500).json({success:false,message:"Something went wrong while generating tokens",error})
    }
}

const login=async(req,res)=>{
    try{
        const {username,password}=req.body;
        if(!username||!password){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
        const user=await User.findOne({username});
        if(!user){
            return res.status(400).json({success:false,message:"User doesnot exist"})
        }
        const isPasswordValid=await user.isPasswordCorrect(password)
        if(!isPasswordValid){
          return res.status(401).json({success:false,message:"Password is incorrect"})
        }
        const {accessToken,refreshToken}=await generateAccessandRefreshToken(user._id)
        const options = {
           httpOnly: true,
           sameSite: 'none',  // Allows cookies to be sent across different domains
           secure: true,      // Ensures cookies are sent only over HTTPS
         };

        
        res.cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
        return res.status(200).json({success:true,message:"Login successful",tokens: {accessToken,refreshToken},user:{username:user.username}})
    }catch(error){
        return res.status(500).json({success:false,message:"Something went wrong while login",error})
    }
}

const logOut=async(req,res)=>{
    try{
      console.log(req.cookies);
        await User.findByIdAndUpdate(req.user._id,{
            $set:{
                refreshToken:null
            }
        })
        const options = {
           httpOnly: true,
           sameSite: 'none',  // Allows cookies to be sent across different domains
           secure: true,      // Ensures cookies are sent only over HTTPS
         };
        res.clearCookie("accessToken",options).clearCookie("refreshToken",options)
        return res.status(200).json({success:true,message:"User logged out"})

        // return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options)
        // .json({sucess:true,message:"User logged out"})
        
    }catch(error){
        return res.status(500).json({success:false,message:"Something went wrong while logging out",error})
    }
}

// const getAllUser=async(req,res)=>{
//     try{
//         const user=await User.findById(req.user._id).populate('friends','username');
//         const allUsers=await User.find({_id:{$ne:req.user._id}}).select('username');
//         return res.status(200).json({success:true,message:"Users and friends lists fetched",users:allUsers,friends:user.friends})
//     }catch(error){
//         return res.status(500).json({success:false,message:"Something went wrong while fetching all users",error})
//     }
// }

const getAllUser = async (req, res) => {
  try {
    // Fetch the user's friends list
    const user = await User.findById(req.user._id).populate('friends', 'username');
    // Extract all friend IDs
    const friendIds = user.friends.map(friend => friend._id);
    // Fetch all users, excluding the current user and those in the friends list
    const allUsers = await User.find({
      _id: { $ne: req.user._id, $nin: friendIds} // $ne to exclude current user, $nin to exclude friends
    }).select('username');
    return res.status(200).json({success: true,message: "Users and friends lists fetched",users: allUsers,friends: user.friends});
  } catch (error) {
    return res.status(500).json({success: false,message: "Something went wrong while fetching all users",error});
  }
};


const addUser = async (req, res) => {
    try {
      const { friendId } = req.body;
      if (req.user._id.toString() === friendId) {
        return res.status(400).json({ success: false, message: "You can't add yourself as a friend" });
      }
      const friend = await User.findById(friendId);
      if (!friend) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      // const user = await User.findById(req.user._id);
      if (!friend.friendRequests.includes(req.user._id)) {
        // user.friends.push(friendId);
        friend.friendRequests.push(req.user._id);
        await friend.save();
      }
      return res.status(200).json({
        success: true,
        message: 'User added successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while adding a user',
        error,
      });
    }
  };
  

  const removeUser = async (req, res) => {
    try {
      const { friendId } = req.body;
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (!user.friends.includes(friendId)) {
        return res.status(400).json({ success: false, message: 'Friend not found in your list' });
      }
      user.friends = user.friends.filter((id) => id.toString() !== friendId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'User removed successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while removing a user',
        error,
      });
    }
  };

  const sendRequests=async(req,res)=>{
    try{
        const {friendId}=req.body;
        const user=await User.findById(friendId)
        if(!user){
            return res.status(400).json({success:false,message:"User not found"})
        }
        if(user.friendRequests.includes(req.user._id)){
            return res.status(400).json({ success: false, message: 'Friend request already sent' });
        }
        user.friendRequests.push(req.user._id);
        await user.save();
        return res.status(200).json({ success: true, message: 'Friend request sent' });
    }catch(error){
        return res.status(500).json({success:false,message:"Something went wrong while sending a request",error})
    }
  }

  const getFriendRequests = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Exclude friends from the friend requests
      const friendRequests = await User.find({
        _id: { 
          $in: user.friendRequests,  // Only check friend requests
          $nin: user.friends  // Exclude users already in the friends list
        }
      }).select('username _id');
  
      return res.status(200).json({
        success: true,
        message: 'Friend requests fetched successfully',
        friendRequests,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while fetching friend requests',
        error,
      });
    }
  };
  
  
  const acceptRequests = async (req, res) => {
    try {
      const { friendId } = req.body;
  
      // Find the logged-in user
      const user = await User.findById(req.user._id);
  
      // Check if the friend request exists
      if (!user.friendRequests.includes(friendId)) {
        return res.status(400).json({ success: false, message: "Friend request not found" });
      }
  
      // Remove the request from friendRequests & add to friends
      user.friendRequests = user.friendRequests.filter((id) => id.toString() !== friendId);
      user.friends.push(friendId);
  
      // Find the friend and add the logged-in user to their friends list
      const friend = await User.findById(friendId);
      if (!friend) {
        return res.status(404).json({ success: false, message: "Friend not found" });
      }
      friend.friends.push(req.user._id);
  
      // Save both users
      await user.save();
      await friend.save();
  
      // Respond success
      return res.status(200).json({ success: true, message: "Friend request accepted successfully",newFriend:{_id:friend._id,username:friend.username} });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while accepting a request",
        error: error.message,
      });
    }
  };

  const declineRequests = async (req, res) => {
    try {
      const { friendId } = req.body;
  
      // Find the logged-in user
      const user = await User.findById(req.user._id);
  
      // Check if the friend request exists
      if (!user.friendRequests.includes(friendId)) {
        return res.status(400).json({ success: false, message: "Friend request not found" });
      }
  
      // Remove the friend request from the list
      user.friendRequests = user.friendRequests.filter((id) => id.toString() !== friendId);
      
      // Save the updated user
      await user.save();
  
      // Respond with success
      return res.status(200).json({ success: true, message: "Friend request declined successfully" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while declining a request",
        error: error.message,
      });
    }
  };
  
  const getFriendRecommendations = async (req, res) => {
    try {
      // Get the logged-in user
      const user = await User.findById(req.user._id).populate('friends', 'username');
  
      // Get the user's friends
      const userFriends = user.friends.map((friend) => friend._id.toString());
  
      // Find friends of friends (FoF) excluding the user and their existing friends
      const friendsOfFriends = await User.find({
        _id: { $nin: [req.user._id, ...userFriends] },
        friends: { $in: userFriends },
      }).select('username friends');
  
      // Count mutual connections
      const recommendations = friendsOfFriends.map((fof) => {
        const mutualFriends = fof.friends.filter((friendId) =>
          userFriends.includes(friendId.toString())
        ).length;
  
        return {
          _id: fof._id,
          username: fof.username,
          mutualConnections: mutualFriends,
        };
      });
        const sortedRecommendations = recommendations.sort(
        (a, b) => b.mutualConnections - a.mutualConnections
      );
  
      return res.status(200).json({
        success: true,
        message: 'Friend recommendations fetched successfully',
        recommendations: sortedRecommendations,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while fetching friend recommendations',
        error: error.message,
      });
    }
  }  

export {signUp,login,generateAccessandRefreshToken,logOut,getAllUser,addUser,removeUser,sendRequests,acceptRequests,declineRequests,getFriendRecommendations,getFriendRequests}
