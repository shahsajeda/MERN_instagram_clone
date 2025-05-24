exports.uploadFile = (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');
    res.json({ path: `/uploads/${req.file.filename}` });
};
