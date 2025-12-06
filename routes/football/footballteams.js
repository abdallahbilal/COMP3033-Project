

//This is the football teams route
const express = require('express');
const router = express.Router();
const FootballTeam = require('../../models/Football-Team');

/**
 * @openapi
 * tags:
 *   - name: FootballTeams
 *     description: API for managing football teams
 *
 * /football-teams:
 *   get:
 *     summary: Get all football teams
 *     tags: [FootballTeams]
 *     responses:
 *       200:
 *         description: Successfully retrieved football teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FootballTeam'
 *
 *   post:
 *     summary: Create a new football team
 *     tags: [FootballTeams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FootballTeamInput'
 *     responses:
 *       201:
 *         description: Football team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FootballTeam'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 *
 * 
 * /{_id}:
 *   put:
 *     summary: Update a football team by ID
 *     tags: [FootballTeams]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: Football team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FootballTeamInput'
 *     responses:
 *       200:
 *         description: Football team updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FootballTeam'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Football team not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a football team by ID
 *     tags: [FootballTeams]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: Football team ID
 *     responses:
 *       200:
 *         description: Football team deleted successfully
 *       404:
 *         description: Football team not found
 *       500:
 *         description: Server error
 *
 *
 * components:
 *   schemas:
 *     FootballTeam:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         TeamName:
 *           type: string
 *         City:
 *           type: string
 *         Players:
 *           type: array
 *           items:
 *             type: string
 *         Coach:
 *           type: string
 *         League:
 *           type: string
 *         Position:
 *           type: string
 *       required:
 *         - TeamName
 *
 *     FootballTeamInput:
 *       type: object
 *       properties:
 *         TeamName:
 *           type: string
 *         City:
 *           type: string
 *         Players:
 *           type: array
 *           items:
 *             type: string
 *         Coach:
 *           type: string
 *         League:
 *           type: string
 *         Position:
 *           type: string
 *       required:
 *         - TeamName
 */



/* GET football teams page. */
router.get('/', async (req, res, next) => {
  let footballTeams =  await FootballTeam.find();
  res.status(200).json(footballTeams);
});



/* POST football teams. */
router.post('/', async (req, res, next) => {
    try {
        const { TeamName, City, Players, Coach, League, Position } = req.body;

        // Basic validation
        if (!TeamName) {
            return res.status(400).json({ ValidationError: 'Team Name is a required field' });
        }
       

        // Create the new football team
        const newFootballTeam = await FootballTeam.create({
            TeamName,
            City,
            Players,
            Coach,
            League,
            Position
        });

        res.status(201).json(newFootballTeam);
    } catch (err) {
        console.error(err);
        res.status(500).json({ ErrorMessage: 'Server threw an exception', Details: err.message });
    }
});

/* GET football team by teamName page. */
router.get("/football-teams/TeamName", async (req, res, next) => {
  try {
    const { TeamName } = req.query;
    let footballTeams;
    if (TeamName) {
      // If TeamName is in the url as a param, filter by it else return all football teams
      footballTeams = await FootballTeam.find({ TeamName });
    } else {
      footballTeams = await FootballTeam.find();
    }
    res.json(footballTeams );
  } catch (error) {
    console.error("Error fetching football teams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* Update football team by ID */
router.put('/:_id', async (req, res, next) => {
    try {
        const {TeamName, City, Players, Coach, League, Position} = req.body;

        // Basic validation
        if (!TeamName) {
            return res.status(400).json({ ValidationError: 'Team Name is a required field' });
        }
       

        const updatedFootballTeam = await FootballTeam.findOneAndUpdate(
            { _id: req.params._id },
            { TeamName, City, Players, Coach, League, Position },
            { new: true, runValidators: true } // return updated doc & validate
        );

        if (!updatedFootballTeam) {
            return res.status(404).json({ Message: `No football team found with ID '${req.params._id}'` });
        }

        res.status(200).json(updatedFootballTeam);
    } catch (err) {
        console.error(err);
        res.status(500).json({ ErrorMessage: 'Server threw an exception', Details: err.message });
    }
});

/* Delete football team by ID */
router.delete('/:_id', async (req, res, next) => {
    try {
        const { _id } = req.params;
        const deletedFootballTeam = await FootballTeam.findOneAndDelete({ _id });
        if (!deletedFootballTeam) {
            return res.status(404).json({ Message: `No football team found with ID '${_id}'` });
        }

        res.status(200).json({ Message: `Football team with ID '${_id}' deleted successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ErrorMessage: 'Server threw an exception', Details: err.message });
    }
});


module.exports = router;