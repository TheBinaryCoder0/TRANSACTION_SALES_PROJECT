
const axios = require('axios');
const Transaction = require('../models/Transaction');


const initializeDb = async (req, res) => {
  const { month } = req.body;

  if (!month) {
    return res.status(400).json({ error: 'Month is required' });
  }

  try {
    await fetchAndInitializeData(month);
    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ error: 'Error initializing database' });
  }
};


const fetchAndInitializeData = async (month) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    const filteredTransactions = transactions.filter(transaction => {
      const dateOfSale = new Date(transaction.dateOfSale);
      return dateOfSale.toLocaleString('default', { month: 'long' }).toLowerCase() === month.toLowerCase();
    });

    await Transaction.deleteMany({});
    await Transaction.insertMany(filteredTransactions);
    console.log('Data successfully initialized in the database.');
  } catch (error) {
    console.error('Error fetching or initializing data:', error);
    throw new Error('Data initialization failed');
  }
};


const getTransactions = async (req, res) => {
  const { search = '', page = 1, perPage = 10 } = req.query;

  try {
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } }
      ];
    }

    const totalTransactions = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.status(200).json({
      data: transactions,
      totalPages: Math.ceil(totalTransactions / perPage),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};


const getStatistics = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month is required' });
  }

  try {
    const monthNumber = new Date(`${month} 01, 2021`).getMonth() + 1;

    const stats = await Transaction.aggregate([
      {
        $addFields: { month: { $month: "$dateOfSale" } }
      },
      {
        $facet: {
          totalSales: [
            { $match: { month: monthNumber } },
            { $group: { _id: null, totalAmount: { $sum: "$price" } } }
          ],
          totalSold: [
            { $match: { month: monthNumber, sold: true } },
            { $count: "totalSold" }
          ],
          totalNotSold: [
            { $match: { month: monthNumber, sold: false } },
            { $count: "totalNotSold" }
          ]
        }
      }
    ]);

    res.json({
      totalSales: stats[0].totalSales[0]?.totalAmount || 0,
      totalSold: stats[0].totalSold[0]?.totalSold || 0,
      totalNotSold: stats[0].totalNotSold[0]?.totalNotSold || 0,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
};


const getPriceRangeData = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month is required' });
  }

  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity },
  ];

  try {
    const monthNumber = new Date(`${month} 01, 2021`).getMonth() + 1;

    const result = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          $expr: {
            $and: [
              { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
              { $gte: ["$price", min] },
              { $lte: ["$price", max] },
            ]
          }
        });
        return { range, count };
      })
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching price range data:', error);
    res.status(500).json({ error: 'Error fetching price range data' });
  }
};


const getCategoryData = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month is required' });
  }

  try {
    const monthNumber = new Date(`${month} 01, 2021`).getMonth() + 1;

    const categories = await Transaction.aggregate([
      { $addFields: { month: { $month: "$dateOfSale" } } },
      { $match: { month: monthNumber } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching category data:', error);
    res.status(500).json({ error: 'Error fetching category data' });
  }
};

// CREATED THIS FOR GIVING THE JSON OF THE COMBINED DATA:-

const getCombinedData = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month is required' });
  }

  try {
    const statisticsResponse = await new Promise((resolve, reject) => {
      getStatistics(req, {
        json: (data) => resolve(data), // resolve when statistics data is available
        status: (code) => reject({ statusCode: code }), // handle errors
      });
    });

    const priceRangeResponse = await new Promise((resolve, reject) => {
      getPriceRangeData(req, {
        json: (data) => resolve(data),
        status: (code) => reject({ statusCode: code }),
      });
    });

    const categoryResponse = await new Promise((resolve, reject) => {
      getCategoryData(req, {
        json: (data) => resolve(data),
        status: (code) => reject({ statusCode: code }),
      });
    });

    res.json({
      statistics: statisticsResponse,
      priceRangeData: priceRangeResponse,
      categoryData: categoryResponse,
    });
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ error: 'Error fetching combined data' });
  }
};

module.exports = {
  initializeDb,
  getTransactions,
  getStatistics,
  getPriceRangeData,
  getCategoryData,
  getCombinedData,
};
