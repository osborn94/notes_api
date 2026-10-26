const express = require('express');

const testRouter = express.Router();


testRouter.get('/api/health', (req, res) => {
    res.send('Test route is working!');
})

module.exports = testRouter;