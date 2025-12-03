



//This is the  players route
const express = require('express');
const router = express.Router();
const Player= require('../../models/Players');

/**
 * @openapi
 * tags:
 *   - name: Players
 *     description: API for managing football players
 *
 * paths:
 *   /players:
 *     get:
 *       summary: Get all players
 *       tags: [Players]
 *       responses:
 *         '200':
 *           description: List of all players
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Player'
 *
 *     post:
 *       summary: Create a new player
 *       tags: [Players]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerInput'
 *       responses:
 *         '201':
 *           description: Player created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Player'
 *         '400':
 *           description: Validation error
 *         '500':
 *           description: Server error
 *
 * components:
 *   schemas:
 *     Player:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         PlayerName:
 *           type: string
 *         TeamName:
 *           type: string
 *         Nationality:
 *           type: string
 *         Age:
 *           type: number
 *         Position:
 *           type: string
 *       required:
 *         - PlayerName
 *
 *     PlayerInput:
 *       type: object
 *       properties:
 *         PlayerName:
 *           type: string
 *         TeamName:
 *           type: string
 *         Nationality:
 *           type: string
 *         Age:
 *           type: number
 *         Position:
 *           type: string
 *       required:
 *         - PlayerName
 */


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