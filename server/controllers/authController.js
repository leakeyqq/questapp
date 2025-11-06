import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import User from "../models/users/userInfo.js"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d"; // or whatever you want

export const login = async (req, res) => {
  // console.log('User trying to log in ', req.body)
    const { address, names, emailAddress, profilePhoto, aggregateVerifier, loginMethod } = req.body;


  if (!address) {
    // console.log('no address')
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try{
    // let user = await User.findOne({walletAddress: address})

    // Use findOneAndUpdate to either create or update user
    const user = await User.findOneAndUpdate(
      { walletAddress: address }, // filter
      { 
        $set: {
          walletAddress: address,
          // Only update web3auth fields if they are provided in the request
          ...(emailAddress && {
            web3auth: {
              emailAddress,
              names: names || null, // names can be null for email_passwordless
              profilePhoto: profilePhoto || null,
              aggregateVerifier: aggregateVerifier,
              loginMethod: loginMethod
            }
          })
        }
      },
      { 
        upsert: true, // Create if doesn't exist
        new: true, // Return the updated document
      }
    ).exec();

    // console.log('User processed:', user ? 'Updated existing user' : 'Created new user');


    // console.log('user is ', user)

    // if(!user){
    //   console.log('no user found, creating a user now')
    //   user = await User.create({walletAddress: address})
    // }else{
    //   console.log('user was found in db')
    // }
    // console.log('user data is on db')
  }catch(e){
    return res.status(500).json({error: e.message})
  }

  // Optionally validate address format (0x...)
  const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({ success: true, address });
};

export const logout = (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Logged out" });
};

export const getMe = (req, res) => {
  const user = req.user;
  res.json({ success: true, user });
};
