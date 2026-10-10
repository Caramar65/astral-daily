module.exports = async function handler(req, res) {
  return res.status(503).json({ error: 'Refresh route requires server configuration.' });
};
