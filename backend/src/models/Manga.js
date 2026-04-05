const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    jikanId: {
      type: Number,
      default: null,
    },
    coverImage: {
      type: String,
      default: '',
      trim: true,
    },
    synopsis: {
      type: String,
      default: '',
      trim: true,
    },
    authors: {
      type: [String],
      default: [],
    },
    genres: {
      type: [String],
      default: [],
    },
    totalChapters: {
      type: Number,
      min: 0,
      default: 0,
    },
    ownedChapters: {
      type: Number,
      min: 0,
      default: 0,
      validate: {
        validator(value) {
          if (!this.totalChapters) {
            return true;
          }

          return value <= this.totalChapters;
        },
        message: 'Owned chapters cannot exceed total chapters',
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    status: {
      type: String,
      enum: ['completed', 'reading', 'wishlist'],
      default: 'reading',
    },
    priceEstimate: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

mangaSchema.index({ owner: 1, createdAt: -1 });

const Manga = mongoose.model('Manga', mangaSchema);

module.exports = Manga;
