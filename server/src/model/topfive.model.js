import mongoose from "mongoose";

const topMoviesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    movies: [
      {
        movieId: { type: String, required: true, unique: true },
        movieTitle: {
          type: String,
          required: true,
        },
        moviePoster: {
          type: String,
          required: true,
        },
      },
    ],
    title: { type: String, required: true },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 5;
}

const TopFive = mongoose.model("TopFive", topMoviesSchema);

export default TopFive;
