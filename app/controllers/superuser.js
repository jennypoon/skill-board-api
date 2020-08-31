const mongoose = require('mongoose');
const SuperUser = require("../models/superuser");

exports.getSuperuserById = (req, res) => {
    SuperUser.find({ _id: req.params.id })
        .then(doc => {
            res.status(200).json({
                message: "success",
                docs: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })
}

exports.getAllSuperusers = (req, res) => {
    SuperUser.find()
        .then(docs => {
            res.status(200).json({
                message: "success",
                size: docs.length,
                docs: docs
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })
}

exports.updateSuperuserById = (req, res) => {
    const id = req.params.id;
    const updateOperations = req.body;
    for (const operations in updateOperations) {
        updateOperations[operations.propName] = operations.value;
    }
    SuperUser.update({ _id: id }, { $set: updateOperations })
        .exec()
        .then(doc => {
            res.status(200).json({
                message: "successfully updated",
                docs: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        });
}

exports.deleteSuperuserById = (req, res) => {
    SuperUser.findByIdAndDelete({ _id: req.params.id })
        .then(doc => {
            res.status(200).json({
                message: "successfully deleted",
                doc: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })
}

exports.getSuperUsersByQuery = (req, res) => {
    const pageNumber = req.query.page;
    const docsLimit = req.query.limit
    const skipAmount = pageNumber * docsLimit;
    SuperUser.find()
        .limit(10) //unable to set it dynamically, mongo error is being raised
        .skip(skipAmount)
        .then(docs => {
            res.status(200).json({
                message: "success",
                size: docs.length,
                docs: docs
            })
        }).catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })
}

exports.updatePassword = async(req, res) => {
    const password = req.body.password;
    await bcrypt.hash(password, 10, (err, result) => {
        if (err) {
            res.status(500).json({
                message: "some error occured while storing credentials",
                error: err
            })
        }
        if (result) {
            const id = req.params.id;
            SuperUser.updateOne({ _id: id }, { $set: { password: result } })
                .exec()
                .then(doc => {
                    res.status(200).json({
                        message: "successfully password updated",
                        docs: doc
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message: "internal server error",
                        error: err
                    })
                });
        }
    })
}