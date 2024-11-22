const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'An unexpected error occurred.' });
};

module.exports = errorHandler;
