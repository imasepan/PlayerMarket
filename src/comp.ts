import readline from "readline";
import { fetchUserData } from "./index"; // import your fetchUserData
import { comparisonSpiderGraph } from "./graph"; // new graph function

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function startComparison() {
  const username1 = await askQuestion("Enter first username: ");
  const username2 = await askQuestion("Enter second username: ");

  if (!username1 || !username2) {
    console.log("Both usernames are required!");
    rl.close();
    return;
  }

  console.log(`Fetching data for ${username1} and ${username2}...`);

  const player1 = await fetchUserData(username1);
  const player2 = await fetchUserData(username2);

  if (!player1 || !player2) {
    console.log("Could not fetch data for one or both players.");
    rl.close();
    return;
  }

  // Prompt for agent selection
  const agent1 = await askQuestion(`Enter agent for ${username1}: `);
  const agent2 = await askQuestion(`Enter agent for ${username2}: `);

  const stats1 = player1.agents[agent1];
  const stats2 = player2.agents[agent2];

  if (!stats1 || !stats2) {
    console.log("One or both selected agents not found for the players.");
    rl.close();
    return;
  }

  await comparisonSpiderGraph(
    username1,
    agent1,
    stats1,
    username2,
    agent2,
    stats2,
    "Latest Season"
  );

  console.log(`✅ Comparison graph saved for ${username1} (${agent1}) vs ${username2} (${agent2})`);
  rl.close();
}

startComparison();

// import readline from "readline";
// import { fetchUserData } from "./index"; // import ONLY fetchUserData, not the interactive functions
// // import { comparisonSpiderGraph } from "./graph"; // uncomment when you have this function

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// function askQuestion(query: string): Promise<string> {
//   return new Promise((resolve) => rl.question(query, resolve));
// }

// async function startComparison() {
//   try {
//     const username1 = await askQuestion("Enter first username: ");
//     const username2 = await askQuestion("Enter second username: ");

//     if (!username1 || !username2) {
//       console.log("Both usernames are required!");
//       rl.close();
//       return;
//     }

//     console.log(`Fetching data for ${username1} and ${username2}...`);

//     // These calls should NOT trigger any prompts now
//     const player1 = await fetchUserData(username1);
//     const player2 = await fetchUserData(username2);

//     if (!player1 || !player2) {
//       console.log("Could not fetch data for one or both players.");
//       console.log("Player 1 data:", !!player1);
//       console.log("Player 2 data:", !!player2);
//       rl.close();
//       return;
//     }

//     console.log("Data fetched successfully!");
//     console.log(`${player1.username} has data for agents:`, Object.keys(player1.agents));
//     console.log(`${player2.username} has data for agents:`, Object.keys(player2.agents));

//     // Prompt for agent selection
//     const agent1 = await askQuestion(`Enter agent for ${username1}: `);
//     const agent2 = await askQuestion(`Enter agent for ${username2}: `);

//     const stats1 = player1.agents[agent1];
//     const stats2 = player2.agents[agent2];

//     if (!stats1 || !stats2) {
//       console.log("One or both selected agents not found for the players.");
//       console.log(`${agent1} found for ${player1.username}:`, !!stats1);
//       console.log(`${agent2} found for ${player2.username}:`, !!stats2);
//       rl.close();
//       return;
//     }

//     console.log(`${player1.username}'s ${agent1} stats:`, stats1);
//     console.log(`${player2.username}'s ${agent2} stats:`, stats2);

//     // Uncomment when you implement comparisonSpiderGraph
//     // await comparisonSpiderGraph(
//     //   username1,
//     //   agent1,
//     //   stats1,
//     //   username2,
//     //   agent2,
//     //   stats2,
//     //   "Latest Season"
//     // );

//     console.log(`Comparison data prepared for ${username1} (${agent1}) vs ${username2} (${agent2})`);
//     rl.close();
//   } catch (error) {
//     console.error("Error in comparison:", error);
//     rl.close();
//   }
// }

// // Run the comparison
// startComparison();