import mongoose, {Schema} from "mongoose";


const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    Videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        REF: "User"
    }
}, {timestamps: true})


export const Playlist = mongoose.model("Playlist", playlistSchema)