const validators = {}

validators.add = (req, res, next) => {
    const { name, email, age } = req.body;
    console.log('123', name, email, age);

    // Server-side validation
    if (!name || !email || !age) {
        return res.status(400).jsonp({ status: 400, message: 'All fields are required' });
    }

    next()
}

validators.paramId = (req, res, next) => {
    const { id } = req.params;
    if (!id) return res.status(400).jsonp({ status: 400, message: 'Id is required' });
    next()
}

module.exports = validators