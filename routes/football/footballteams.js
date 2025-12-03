//This is the football teams route
const express = require('express');
const router = express.Router();
const FootballTeam = require('../../models/Football-Team');



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