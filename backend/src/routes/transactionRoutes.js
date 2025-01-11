const express = require('express');
const {
  initializeDb,
  getTransactions,
  getStatistics,
  getPriceRangeData,
  getCategoryData,
  getCombinedData
} = require('../controllers/transactionController');

const router = express.Router();

// ROUTES:-

router.post('/initialize-db', initializeDb);


router.get('/transactions', getTransactions);


router.get('/transactions/statistics', getStatistics);


router.get('/transactions/bar-chart', getPriceRangeData);


router.get('/transactions/pie-chart', getCategoryData);


router.get('/transactions/combined', getCombinedData);

module.exports = router;
