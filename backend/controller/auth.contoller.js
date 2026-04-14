import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import validate from "../utils/validate.js";
import { generateToken } from "../utils/jwt.utils.js";

export const signup = async (req,res) => {
        try {
            const {fullname,mobile,email,password,role} = req.body;

            const {isValid, errors} = validate(fullname,mobile,email,password,role);

            if(!isValid)
            {
                return res.status(400).json({errors});
            }

            let user = await User.findOne({email});
            if(user)
            {
                return res.status(400).json({message: "User Already Exist"});
            }

            // password hash
            const hashedPassword = await bcrypt.hash(password,10);

           user = await User.create({
                fullname,
                mobile,
                email,
                password: hashedPassword,
                role
            });

            res.status(201).json({
                message:"User Created Successfully",
                user:{
                    id:user._id,
                    fullname: user.fullname,
                    email:user.email,
                    role:user.role
                }
            });
        } catch (error) {
            return res.status(500).json({message: "Internal Server Error"})
        }
}

export const login = async (req,res) => {
     try {
            const {email,password,role} = req.body;

            let user = await User.findOne({email});
            if(!user)
            {
                return res.status(400).json({message: "Invalid Email"});
            }

            // password comparison
            const isMatched = await bcrypt.compare(password,user.password);

            if(!isMatched)
            {
                return res.status(400).json({message: "Invalid Password"});
            }

            if(role !== user.role)
            {
                  return res.status(403).json({ message: "Unauthorized Role" });
            }

            const token = generateToken({ id:user._id,role: user.role});

            res.cookie("token",token,{
                httpOnly:true,
                secure:false,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite:"none"
            })

            res.status(201).json({
                message:"Login Successfully",
                user: {                        
                    id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    role: user.role,
                }
            });
        } catch (error) {
            return res.status(500).json({message: "Internal Server Error"})
        }
}

export const logout = async (req,res) => {
    try{
     
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged Out Successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}