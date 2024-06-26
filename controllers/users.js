const UsersModel = require('../models/users');

const createControllers = (io) => {
    const controllers = {};

    controllers.add = async (req, res) => {
        try {
            const { name, email, age } = req.body;
            const emailExists = await UsersModel.findOne({ email }).lean();
            if (emailExists) {
                return res.status(400).jsonp({ status: 400, message: 'Email already exists' });
            }
            const user = await UsersModel.create({ name, email, age });
            io.emit('userCreated', user);
            return res.status(200).jsonp({ status: 200, message: 'User created successfully!', data: user });
        } catch (error) {
            console.log('Error creating user', error);
            return res.status(500).jsonp({ status: 500, message: 'Something went wrong' });
        }
    };

    controllers.list = async (req, res) => {
        try {
            const [users, total] = await Promise.all([
                UsersModel.find().lean(),
                UsersModel.countDocuments()
            ]);
            return res.status(200).jsonp({ status: 200, message: 'Users fetched successfully!', data: { total, users } });
        } catch (error) {
            return res.status(500).jsonp({ status: 500, message: 'Something went wrong' });
        }
    };

    controllers.update = async (req, res) => {
        try {
            const { id } = req.params;
            const { email } = req.body;
            const emailExists = await UsersModel.findOne({ _id: { $ne: id }, email }).lean();
            if (emailExists) {
                return res.status(400).jsonp({ status: 400, message: 'Email already exists' });
            }
            const user = await UsersModel.findOneAndUpdate({ _id: id }, { ...req.body }, { runValidators: true, new: true });
            if (!user) {
                return res.status(404).jsonp({ status: 404, message: 'User not found' });
            }
            io.emit('userUpdated', user);
            return res.status(200).jsonp({ status: 200, message: 'User updated successfully!', data: user });
        } catch (error) {
            console.log(error);
            return res.status(500).jsonp({ status: 500, message: 'Something went wrong' });
        }
    };

    controllers.delete = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await UsersModel.findOneAndDelete({ _id: id });
            if (!user) {
                return res.status(404).jsonp({ status: 404, message: 'User not found' });
            }
            io.emit('userDeleted', user);
            return res.status(200).jsonp({ status: 200, message: 'User deleted successfully!', data: user });
        } catch (error) {
            console.log('errodel-', error);
            return res.status(500).jsonp({ status: 500, message: 'Something went wrong' });
        }
    };

    controllers.fetchDetails = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await UsersModel.findById(id).lean();
            if (!user) {
                return res.status(404).jsonp({ status: 404, message: 'User not found' });
            }
            return res.status(200).jsonp({ status: 200, message: 'User details fetched successfully!', data: user });
        } catch (error) {
            return res.status(500).jsonp({ status: 500, message: 'Something went wrong' });
        }
    };

    return controllers;
};

module.exports = createControllers;
