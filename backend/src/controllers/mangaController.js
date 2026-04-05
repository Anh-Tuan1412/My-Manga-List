const axios = require('axios');
const mongoose = require('mongoose');
const Manga = require('../models/Manga');

const parseCommaList = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizePayload = (payload) => {
  const data = { ...payload };

  data.authors = parseCommaList(data.authors);
  data.genres = parseCommaList(data.genres);

  data.totalChapters = Number(data.totalChapters || 0);
  data.ownedChapters = Number(data.ownedChapters || 0);
  data.rating = Number(data.rating || 0);
  data.priceEstimate = Number(data.priceEstimate || 0);

  if (data.jikanId === '' || data.jikanId === undefined) {
    data.jikanId = null;
  }

  return data;
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toPositiveInt = (value, fallback, max) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  if (max) {
    return Math.min(Math.floor(parsed), max);
  }

  return Math.floor(parsed);
};

const buildOwnedFilter = ({ req, status, genre, search, forAggregation }) => {
  const ownerField = forAggregation ? new mongoose.Types.ObjectId(req.user.id) : req.user.id;
  const filter = {
    owner: ownerField,
  };

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (genre && genre !== 'all') {
    filter.genres = {
      $elemMatch: {
        $regex: `^${escapeRegExp(genre)}$`,
        $options: 'i',
      },
    };
  }

  if (search) {
    filter.title = {
      $regex: escapeRegExp(search),
      $options: 'i',
    };
  }

  return filter;
};

const listManga = async (req, res, next) => {
  try {
    const {
      status,
      genre,
      sortBy = 'createdAt',
      order = 'desc',
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const currentPage = toPositiveInt(page, 1);
    const pageSize = toPositiveInt(limit, 12, 60);
    const skip = (currentPage - 1) * pageSize;
    const sortOrder = order === 'asc' ? 1 : -1;

    if (sortBy === 'progress') {
      const match = buildOwnedFilter({
        req,
        status,
        genre,
        search,
        forAggregation: true,
      });

      const result = await Manga.aggregate([
        { $match: match },
        {
          $addFields: {
            progress: {
              $cond: [
                { $gt: ['$totalChapters', 0] },
                { $divide: ['$ownedChapters', '$totalChapters'] },
                0,
              ],
            },
          },
        },
        { $sort: { progress: sortOrder, createdAt: -1 } },
        {
          $facet: {
            items: [{ $skip: skip }, { $limit: pageSize }],
            totalCount: [{ $count: 'count' }],
          },
        },
      ]);

      const items = result[0]?.items || [];
      const total = result[0]?.totalCount?.[0]?.count || 0;
      const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

      res.json({
        items,
        page: currentPage,
        limit: pageSize,
        total,
        totalPages,
        hasMore: currentPage < totalPages,
      });
      return;
    }

    const filter = buildOwnedFilter({
      req,
      status,
      genre,
      search,
      forAggregation: false,
    });

    const allowedSort = ['createdAt', 'rating', 'title', 'updatedAt'];
    const resolvedSort = allowedSort.includes(sortBy) ? sortBy : 'createdAt';

    const [items, total] = await Promise.all([
      Manga.find(filter)
        .sort({
          [resolvedSort]: sortOrder,
          createdAt: -1,
        })
        .skip(skip)
        .limit(pageSize),
      Manga.countDocuments(filter),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

    res.json({
      items,
      page: currentPage,
      limit: pageSize,
      total,
      totalPages,
      hasMore: currentPage < totalPages,
    });
  } catch (error) {
    next(error);
  }
};

const createManga = async (req, res, next) => {
  try {
    const data = normalizePayload(req.body);
    const created = await Manga.create({
      ...data,
      owner: req.user.id,
    });

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

const updateManga = async (req, res, next) => {
  try {
    const data = normalizePayload(req.body);
    const updated = await Manga.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      res.status(404).json({ message: 'Manga not found' });
      return;
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteManga = async (req, res, next) => {
  try {
    const deleted = await Manga.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!deleted) {
      res.status(404).json({ message: 'Manga not found' });
      return;
    }

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.id);
    const baseMatch = { owner: ownerId };

    const [genreStats, statusStats, wishlistStats] = await Promise.all([
      Manga.aggregate([
        { $match: baseMatch },
        { $unwind: { path: '$genres', preserveNullAndEmptyArrays: false } },
        {
          $group: {
            _id: '$genres',
            value: { $sum: 1 },
          },
        },
        { $sort: { value: -1 } },
      ]),
      Manga.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: '$status',
            value: { $sum: 1 },
          },
        },
        { $sort: { value: -1 } },
      ]),
      Manga.aggregate([
        { $match: { ...baseMatch, status: 'wishlist' } },
        {
          $group: {
            _id: null,
            total: { $sum: '$priceEstimate' },
          },
        },
      ]),
    ]);

    res.json({
      genreDistribution: genreStats.map((item) => ({
        name: item._id || 'Unknown',
        value: item.value,
      })),
      statusDistribution: statusStats.map((item) => ({
        name: item._id || 'unknown',
        value: item.value,
      })),
      wishlistTotalCost: wishlistStats[0]?.total || 0,
    });
  } catch (error) {
    next(error);
  }
};

const searchJikan = async (req, res, next) => {
  try {
    const query = String(req.query.query || '').trim();

    if (query.length < 2) {
      res.status(400).json({ message: 'Query must be at least 2 characters' });
      return;
    }

    const response = await axios.get('https://api.jikan.moe/v4/manga', {
      params: {
        q: query,
        limit: 8,
        sfw: true,
      },
      timeout: 10000,
    });

    const mapped = (response.data?.data || []).map((item) => ({
      jikanId: item.mal_id,
      title: item.title || '',
      synopsis: item.synopsis || '',
      coverImage: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || '',
      totalChapters: item.chapters || 0,
      genres: (item.genres || []).map((g) => g.name),
      authors: (item.authors || []).map((a) => a.name),
    }));

    res.json(mapped);
  } catch (error) {
    if (error.response?.status === 429) {
      res.status(429).json({ message: 'Jikan API rate limit reached. Please retry shortly.' });
      return;
    }

    next(error);
  }
};

module.exports = {
  listManga,
  createManga,
  updateManga,
  deleteManga,
  getStats,
  searchJikan,
};
