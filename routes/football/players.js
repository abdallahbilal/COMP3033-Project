//This is the  players route
const express = require('express');
const router = express.Router();
const Player= require('../../models/Players');

/* GET players page. */
router.get('/', async (req, res, next) => {
  let players =  await Player.find();
  res.status(200).json(players);
});

/* POST players. */
router.post('/', async (req, res, next) => {
    try {
        const { PlayerName, TeamName, Nationality, Age, Position } = req.body;

        // Basic validation
        if (!PlayerName) {
            return res.status(400).json({ ValidationError: 'Player Name is a required field' });
        }
       
        // Create the new player
        const newPlayer = await Player.create({
            PlayerName,
            TeamName,   
            Nationality,
            Age,
            Position
        });                                                                             
        res.status(201).json(newPlayer);
    } catch (error) {
        next(error);
    }
});

module.exports = router;    