import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"; // to generate hash for passwords

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String,//cloudinary url
        required: true
    },
    coverImage: {
        type: String // cloudinary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }
},{
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10) // (kya hash krna hai, rounds)
    next();
}) // this is a middleware isliye next hoga

// custom method to check if password is correct or not
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)// (string do , jis se compare krna h)
}

//jwt is a bearer token means ye token jiske bhi paas hai mai usko data bhejunga yaani ki jwt token aek key ki tarah hai
userSchema.methods.generateAccessToken = function(){
    jwt.sign( // (payload, access token, expiry)
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    jwt.sign( // (payload, access token, expiry)
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)