const express = require('express');
const router = express.Router();

const demoModel = require('../models/demo-model');

router.use(function(req, res, next) {
    console.log("route middleware");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

router.route('/create')
	.post((req, res) => {
		let newGoal = new demoModel();
		newGoal.name = req.body.name;
		newGoal.startDate = req.body.startDate;
        newGoal.endDate = req.body.endDate;
        newGoal.user = req.body.userId;
        newGoal
        	.save()
        	.then((savedGoal) => {
        		res.status(200).json({
        			message: 'Goal saved successfully',
        			data: savedGoal
        		})
        	})
        	.catch(() => {
        		res.status(500).json({
        			message: 'Goal was no saved'
        		});
        	});
	});

router.route('/all/:userId')
    .get((req, res) => {
        console.log("under all/userid")
        demoModel.find({ user: req.params.userId })
            .then((goals) => {
                res.status(200).json({
                    message: 'Here are your goals',
                    data: goals
                })
            })
            .catch(() => {
                res.status(500).json({
                    message: 'No goals found'
                });
            });
    });

router.route('/getbyid/:id')
    .get((req, res) => {
        demoModel.findById(req.params.id)
            .then((goals) => {
                res.status(200).json({
                    message: 'Here is your goal',
                    data: goals
                })
            })
            .catch(() => {
                res.status(500).json({
                    message: 'No goals found'
                });
            });
    });

router.route('/getbyname/:name')
    .get((req, res) => {
        demoModel.find({ name: new RegExp(req.params.name, "i") })
            .then((goals) => {
                res.status(200).json({
                    message: 'Here is your goal',
                    data: goals
                });
            })
            .catch(() => {
                res.status(500).json({
                    message: 'No goals found'
                });
            });
    })

router.route('/remove/:id')
    .delete((req, res) => {
        demoModel.findByIdAndRemove(req.params.id)
            .then((goals) => {
                res.status(200).json({
                    message: 'Your goal was deleted',
                    data: goals
                });
            })
            .catch(() => {
                res.status(500).json({
                    message: 'No goals found'
                });
            });
    })

router.route('/update/:id')
    .put((req, res) => {
        demoModel
            .findByIdAndUpdate(req.params.id, {
                id: req.params.id,
                name: req.body.name,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                actions: push.req.body.actions
            })
            .then((updateGoal) => {
                res.status(200).json({
                    message: 'Goal updated successfully',
                    data: updateGoal
                })
            })
            .catch(() => {
                res.status(500).json({
                    message: 'Goal was not updated'
                });
            });

    })

router.route('/addaction/:id')
    .put((req, res) => {
        demoModel
            .findByIdAndUpdate(req.params.id, { $push: { actions: req.body.action } })

            .then((updateGoal) => {
                res.status(200).json({
                    message: 'Action added successfully',
                    data: updateGoal
                })
            })
            .catch(() => {
                res.status(500).json({
                    message: 'Action was not added'
                });
            });

    })


module.exports = router;