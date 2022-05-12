const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

let app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1); //will force the Node JS process to exit.
  }
};
initializeDBAndServer();

let convertDBObjToResponseObj = (DBObj) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//GET Players API:
app.get("/players/", async (request, response) => {
  const getPlayersQurey = `SELECT * FROM cricket_team`;
  const playersList = await db.all(getPlayersQurey);
  response.send(playersList);
});

//POST Player API:
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO cricket_team(player_name,jersey_number,role) VALUES("${player_name}",${jersey_number},"${role}");`;
  const dbResponse = await db.run(addPlayerQuery);
  response.send(`Player Added to Team`);
});

//GET Player API:
app.get("players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  console.log(playerId);
  const getPlayerQuery = `
    SELECT * FROM cricket_team WHERE player_id = ${playerId}
    `;
  const player = await db.get(getPlayerQuery);
  response.send(convertDBObjToResponseObj(player));
});

//PUT Player API:
app.put("/players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;
  const updatePlayerQuery = `
  UPDATE cricket_team
  SET 
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE 
   player_id = ${playerId};
  `;
  await db.run(updatePlayerQuery);
  response.send(`Player Details Updated`);
});

//DELETE Player API:
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
  DELETE FROM
    cricket_team
  WHERE
    player_id = ${playerId};`;
  await database.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
