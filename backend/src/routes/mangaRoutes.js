const express = require('express');
const {
  listManga,
  createManga,
  updateManga,
  deleteManga,
  getStats,
  searchJikan,
} = require('../controllers/mangaController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', listManga);
router.get('/stats', getStats);
router.get('/jikan/search', searchJikan);
router.post('/', createManga);
router.put('/:id', updateManga);
router.delete('/:id', deleteManga);

module.exports = router;
