import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import fs from "fs";
import path from "path";

const width = 600;
const height = 600;
const chart = new ChartJSNodeCanvas({ 
    width, 
    height,
    backgroundColour: "white",
 });

export async function spiderGraph(
    username: string,
    agent: string,
    stats: {
        agentKPR: number;
        agentKAST: number;
        agentKDA: number;
        agentFKFD: number;
        assistsPR: number;
    },
    seasonName: string
)
{
    const configuration = {
        type: "radar" as const,
        data: {
          labels: ["Kills per Round", "KAST", "KDA", `FK/FD`, `APR`],
          datasets: [
            {
              label: `${username}'s ${agent} Performance`,
              data: [
                stats.agentKPR,
                stats.agentKAST,
                stats.agentKDA,
                stats.agentFKFD,
                stats.assistsPR,
              ],
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              pointBackgroundColor: "rgba(54, 162, 235, 1)",
            },
          ],
        },
        options: {
          scales: {
            r: {
              angleLines: { display: true },
              suggestedMin: 0,
              suggestedMax: 3, // adjust scale for your stats
              pointLabels: {
                callback: (label: string) => {
                    if (label === "Kills per Round") return `${label} (0–5)`;
                    if (label === "KDA") return `${label} (0–5)`;
                    if (label === "FK/FD") return `${label} (0–5)`;
                    if (label === "APR") return `${label} (0–5)`;
                    if (label === "KAST") return `${label} (0–5)`;
                return label;
                }
              }
            },
          },
        },
      };

      const graphDir = path.join(__dirname, "../graphs");
      if (!fs.existsSync(graphDir)) {
        fs.mkdirSync(graphDir);
      }
    
      // safe file name
      const safeUsername = username.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const safeAgent = agent.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const sanitizedSeason = seasonName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const graphPath = path.join(graphDir, `${safeUsername}_${safeAgent}_${sanitizedSeason}.png`);
    
      const image = await chart.renderToBuffer(configuration);
      fs.writeFileSync(graphPath, image);
    
      console.log(`Graph saved at: ${graphPath}`);
}
