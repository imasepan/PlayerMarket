
import * as echarts from "echarts";
import { createCanvas, Image } from "canvas";
import fs from "fs";
import path from "path";

const width = 900;
const height = 900;

export async function controllerSpiderGraph(
  username: string,
  agent: string,
  rounds: string,
  stats: {
    agentKPR: number;
    agentKAST: number;
    agentKDA: number;
    agentFirstDeathsPR: number;
    assistsPR: number;
  },
  seasonName: string
) {
  const canvas = createCanvas(width, height);
  const chart = echarts.init(canvas as any, null, {
    width,
    height,
    renderer: "canvas",
  });

  const indicators = [
    { name: "Kills per Round", max: 1.5 },
    { name: "Assists per Round", max: 1.5 },
    { name: "K/D/A", max: 2 },
    { name: "First Deaths per Round", max: 1 },
    { name: "KAST", max: 100 },
  ];

  const values = [
    stats.agentKPR,
    stats.assistsPR,
    stats.agentKDA,
    1 - stats.agentFirstDeathsPR,
    stats.agentKAST,
  ];

  // This configuration forces the area to be visible
  const option = {
    title: {
      text: `${username}'s ${agent} (${rounds} rounds) - ${seasonName}`,
      left: "center",
      top: 20,
      textStyle: { fontSize: 14, color: '#333' },
    },
    backgroundColor: "#ffffff",
    radar: {
      center: ["50%", "55%"],
      radius: "65%",
      name: {
        formatter: (name: string, indicator: any) => {
          // Get current value for this axis
          const axisIndex = indicators.findIndex((i) => i.name === name);
          const currentValue = axisIndex >= 0 ? values[axisIndex] : 0;
          // const percentage = ((currentValue / indicator.max) * 100).toFixed(0);
          
          let displayValue;
          if (name === "First Deaths per Round") {
          // For First Deaths per Round, show inverted scale (1.0 = best, 0.0 = worst)
          // Convert the actual value to display value
          displayValue = (indicator.max - currentValue).toFixed(2);
          } else {
          displayValue = currentValue.toFixed(2);
          }
          return [
            `{title|${name}}`,
            `{value|${displayValue}}`
          ].join('\n');
        },
        textStyle: { 
          rich: {
            title: {
              fontSize: 11,
              fontWeight: 'bold',
              color: '#333',
              align: 'center'
            },
            value: {
              fontSize: 10,
              color: '#36A2EB',
              fontWeight: 'bold',
              align: 'center'
            },
            percent: {
              fontSize: 9,
              color: '#666',
              align: 'center'
            }
          }
        },
        gap: 18, // Distance from the radar chart
      },
      indicator: indicators,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.1)']
        }
      },
    },
    series: [
      {
        name: "Performance",
        type: "radar",
        symbol: 'circle',
        symbolSize: 6,
        // Try putting areaStyle in multiple places to ensure it works
        areaStyle: {
          normal: {
            color: 'rgba(54, 162, 235, 0.4)'
          }
        },
        lineStyle: {
          normal: {
            color: '#36A2EB',
            width: 3
          }
        },
        itemStyle: {
          normal: {
            color: '#36A2EB'
          }
        },
        data: [
          {
            value: values,
            name: `${username} - ${agent}`,
            areaStyle: {
              color: 'rgba(54, 162, 235, 0.4)'
            },
            lineStyle: {
              color: '#36A2EB',
              width: 3
            },
            itemStyle: {
              color: '#36A2EB'
            }
          }
        ]
      }
    ]
  };

  chart.setOption(option, true); // Force update
  chart.resize();
  
  await new Promise(resolve => setTimeout(resolve, 300));

  const graphDir = path.join(__dirname, "../graphs");
  if (!fs.existsSync(graphDir)) {
    fs.mkdirSync(graphDir, { recursive: true });
  }

  const safeUsername = username.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const safeAgent = agent.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const sanitizedSeason = seasonName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const graphPath = path.join(
    graphDir,
    `${safeUsername}_${safeAgent}_${sanitizedSeason}.png`
  );

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(graphPath, buffer);
  chart.dispose();

  console.log(`Smokes Graph saved at: ${graphPath}`);
}

export async function initiatorSpiderGraph(
  username: string,
  agent: string,
  rounds: string,
  stats: {
    agentKPR: number;
    agentKAST: number;
    agentKDA: number;
    agentFirstDeathsPR: number;
    assistsPR: number;
  },
  seasonName: string
) {
  const canvas = createCanvas(width, height);
  const chart = echarts.init(canvas as any, null, {
    width,
    height,
    renderer: "canvas",
  });

  const indicators = [
    { name: "Kills per Round", max: 1.5 },
    { name: "Assists per Round", max: 1.5 },
    { name: "K/D/A", max: 2 },
    { name: "First Deaths per Round", max: 1 },
    { name: "KAST", max: 100 },
  ];

  const values = [
    stats.agentKPR,
    stats.assistsPR,
    stats.agentKDA,
    1 - stats.agentFirstDeathsPR,
    stats.agentKAST,
  ];

  // This configuration forces the area to be visible
  const option = {
    title: {
      text: `${username}'s ${agent} (${rounds} rounds) - ${seasonName}`,
      left: "center",
      top: 20,
      textStyle: { fontSize: 14, color: '#333' },
    },
    backgroundColor: "#ffffff",
    radar: {
      center: ["50%", "55%"],
      radius: "65%",
      name: {
        formatter: (name: string, indicator: any) => {
          // Get current value for this axis
          const axisIndex = indicators.findIndex((i) => i.name === name);
          const currentValue = axisIndex >= 0 ? values[axisIndex] : 0;
          // const percentage = ((currentValue / indicator.max) * 100).toFixed(0);
          
          let displayValue;
          if (name === "First Deaths per Round") {
          // For First Deaths per Round, show inverted scale (1.0 = best, 0.0 = worst)
          // Convert the actual value to display value
          displayValue = (indicator.max - currentValue).toFixed(2);
          } else {
          displayValue = currentValue.toFixed(2);
          }
          return [
            `{title|${name}}`,
            `{value|${displayValue}}`
          ].join('\n');
        },
        textStyle: { 
          rich: {
            title: {
              fontSize: 11,
              fontWeight: 'bold',
              color: '#333',
              align: 'center'
            },
            value: {
              fontSize: 10,
              color: '#36A2EB',
              fontWeight: 'bold',
              align: 'center'
            },
            percent: {
              fontSize: 9,
              color: '#666',
              align: 'center'
            }
          }
        },
        gap: 18, // Distance from the radar chart
      },
      indicator: indicators,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.1)']
        }
      },
    },
    series: [
      {
        name: "Performance",
        type: "radar",
        symbol: 'circle',
        symbolSize: 6,
        // Try putting areaStyle in multiple places to ensure it works
        areaStyle: {
          normal: {
            color: 'rgba(54, 162, 235, 0.4)'
          }
        },
        lineStyle: {
          normal: {
            color: '#36A2EB',
            width: 3
          }
        },
        itemStyle: {
          normal: {
            color: '#36A2EB'
          }
        },
        data: [
          {
            value: values,
            name: `${username} - ${agent}`,
            areaStyle: {
              color: 'rgba(54, 162, 235, 0.4)'
            },
            lineStyle: {
              color: '#36A2EB',
              width: 3
            },
            itemStyle: {
              color: '#36A2EB'
            }
          }
        ]
      }
    ]
  };

  chart.setOption(option, true); // Force update
  chart.resize();
  
  await new Promise(resolve => setTimeout(resolve, 300));

  const graphDir = path.join(__dirname, "../graphs");
  if (!fs.existsSync(graphDir)) {
    fs.mkdirSync(graphDir, { recursive: true });
  }

  const safeUsername = username.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const safeAgent = agent.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const sanitizedSeason = seasonName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const graphPath = path.join(
    graphDir,
    `${safeUsername}_${safeAgent}_${sanitizedSeason}.png`
  );

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(graphPath, buffer);
  chart.dispose();

  console.log(`Initiator Graph saved at: ${graphPath}`);
}


export async function sentinelSpiderGraph(
  username: string,
  agent: string,
  rounds: string,
  stats: {
    agentKPR: number;
    agentKAST: number;
    agentKDA: number;
    agentFirstDeathsPR: number;
    assistsPR: number;
  },
  seasonName: string
) {
  const canvas = createCanvas(width, height);
  const chart = echarts.init(canvas as any, null, {
    width,
    height,
    renderer: "canvas",
  });

  const indicators = [
    { name: "Kills per Round", max: 1.5 },
    { name: "Assists per Round", max: 1.5 },
    { name: "K/D/A", max: 2 },
    { name: "First Deaths per Round", max: 1 },
    { name: "KAST", max: 100 },
  ];

  const values = [
    stats.agentKPR,
    stats.assistsPR,
    stats.agentKDA,
    1 - stats.agentFirstDeathsPR,
    stats.agentKAST,
  ];

  // This configuration forces the area to be visible
  const option = {
    title: {
      text: `${username}'s ${agent} (${rounds} rounds) - ${seasonName}`,
      left: "center",
      top: 20,
      textStyle: { fontSize: 14, color: '#333' },
    },
    backgroundColor: "#ffffff",
    radar: {
      center: ["50%", "55%"],
      radius: "65%",
      name: {
        formatter: (name: string, indicator: any) => {
          // Get current value for this axis
          const axisIndex = indicators.findIndex((i) => i.name === name);
          const currentValue = axisIndex >= 0 ? values[axisIndex] : 0;
          // const percentage = ((currentValue / indicator.max) * 100).toFixed(0);
          
          let displayValue;
          if (name === "First Deaths per Round") {
          // For First Deaths per Round, show inverted scale (1.0 = best, 0.0 = worst)
          // Convert the actual value to display value
          displayValue = (indicator.max - currentValue).toFixed(2);
          } else {
          displayValue = currentValue.toFixed(2);
          }
          return [
            `{title|${name}}`,
            `{value|${displayValue}}`
          ].join('\n');
        },
        textStyle: { 
          rich: {
            title: {
              fontSize: 11,
              fontWeight: 'bold',
              color: '#333',
              align: 'center'
            },
            value: {
              fontSize: 10,
              color: '#36A2EB',
              fontWeight: 'bold',
              align: 'center'
            },
            percent: {
              fontSize: 9,
              color: '#666',
              align: 'center'
            }
          }
        },
        gap: 18, // Distance from the radar chart
      },
      indicator: indicators,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.1)']
        }
      },
    },
    series: [
      {
        name: "Performance",
        type: "radar",
        symbol: 'circle',
        symbolSize: 6,
        // Try putting areaStyle in multiple places to ensure it works
        areaStyle: {
          normal: {
            color: 'rgba(54, 162, 235, 0.4)'
          }
        },
        lineStyle: {
          normal: {
            color: '#36A2EB',
            width: 3
          }
        },
        itemStyle: {
          normal: {
            color: '#36A2EB'
          }
        },
        data: [
          {
            value: values,
            name: `${username} - ${agent}`,
            areaStyle: {
              color: 'rgba(54, 162, 235, 0.4)'
            },
            lineStyle: {
              color: '#36A2EB',
              width: 3
            },
            itemStyle: {
              color: '#36A2EB'
            }
          }
        ]
      }
    ]
  };

  chart.setOption(option, true); // Force update
  chart.resize();
  
  await new Promise(resolve => setTimeout(resolve, 300));

  const graphDir = path.join(__dirname, "../graphs");
  if (!fs.existsSync(graphDir)) {
    fs.mkdirSync(graphDir, { recursive: true });
  }

  const safeUsername = username.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const safeAgent = agent.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const sanitizedSeason = seasonName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const graphPath = path.join(
    graphDir,
    `${safeUsername}_${safeAgent}_${sanitizedSeason}.png`
  );

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(graphPath, buffer);
  chart.dispose();

  console.log(`Sentinel Graph saved at: ${graphPath}`);
}


export async function duelistSpiderGraph(
  username: string,
  agent: string,
  rounds: string,
  stats: {
    agentKPR: number;
    agentKAST: number;
    agentKDA: number;
    agentEntryRate: number;
    agentDamagePerRound: number;
  },
  seasonName: string
) {
  const canvas = createCanvas(width, height);
  const chart = echarts.init(canvas as any, null, {
    width,
    height,
    renderer: "canvas",
  });

  const indicators = [
    { name: "Kills per Round", max: 1.5 },
    { name: "Damage per Round", max: 200 },
    { name: "KDA", max: 2 },
    { name: "Entry Success Rate (%)", max: 100 },
    { name: "KAST (%)", max: 100 },
  ];

  const values = [
    stats.agentKPR,
    stats.agentDamagePerRound,
    stats.agentKDA,
    stats.agentEntryRate,
    stats.agentKAST,
  ];

  // This configuration forces the area to be visible
  const option = {
    title: {
      text: `${username}'s ${agent} (${rounds} rounds) - ${seasonName}`,
      left: "center",
      top: 20,
      textStyle: { fontSize: 14, color: '#333' },
    },
    backgroundColor: "#ffffff",
    radar: {
      center: ["50%", "55%"],
      radius: "65%",
      name: {
        formatter: (name: string, indicator: any) => {
          // Get current value for this axis
          const axisIndex = indicators.findIndex((i) => i.name === name);
          const currentValue = axisIndex >= 0 ? values[axisIndex] : 0;
          // const percentage = ((currentValue / indicator.max) * 100).toFixed(0);
          
          return [
            `{title|${name}}`,
            `{value|${currentValue.toFixed(2)}}`
          ].join('\n');
        },
        textStyle: { 
          rich: {
            title: {
              fontSize: 11,
              fontWeight: 'bold',
              color: '#333',
              align: 'center'
            },
            value: {
              fontSize: 10,
              color: '#36A2EB',
              fontWeight: 'bold',
              align: 'center'
            },
            percent: {
              fontSize: 9,
              color: '#666',
              align: 'center'
            }
          }
        },
        gap: 18, // Distance from the radar chart
      },
      indicator: indicators,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.1)']
        }
      },
    },
    series: [
      {
        name: "Performance",
        type: "radar",
        symbol: 'circle',
        symbolSize: 6,
        // Try putting areaStyle in multiple places to ensure it works
        areaStyle: {
          normal: {
            color: 'rgba(54, 162, 235, 0.4)'
          }
        },
        lineStyle: {
          normal: {
            color: '#36A2EB',
            width: 3
          }
        },
        itemStyle: {
          normal: {
            color: '#36A2EB'
          }
        },
        data: [
          {
            value: values,
            name: `${username} - ${agent}`,
            areaStyle: {
              color: 'rgba(54, 162, 235, 0.4)'
            },
            lineStyle: {
              color: '#36A2EB',
              width: 3
            },
            itemStyle: {
              color: '#36A2EB'
            }
          }
        ]
      }
    ]
  };

  chart.setOption(option, true); // Force update
  chart.resize();
  
  await new Promise(resolve => setTimeout(resolve, 300));

  const graphDir = path.join(__dirname, "../graphs");
  if (!fs.existsSync(graphDir)) {
    fs.mkdirSync(graphDir, { recursive: true });
  }

  const safeUsername = username.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const safeAgent = agent.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const sanitizedSeason = seasonName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const graphPath = path.join(
    graphDir,
    `${safeUsername}_${safeAgent}_${sanitizedSeason}.png`
  );

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(graphPath, buffer);
  chart.dispose();

  console.log(`Duelist Graph saved at: ${graphPath}`);
}

// Controller Comparison
export async function controllerComparisonSpiderGraph(
  username1: string,
  agent1: string,
  rounds1: string,
  stats1: {
    agentKPR: number;
    agentKAST: number;
    agentKDA: number;
    agentFirstDeathsPR: number;
    assistsPR: number;
  },
  username2: string,
  agent2: string,
  rounds2: string,
  stats2: {
    agentKPR: number;
    agentKAST: number;
    agentKDA: number;
    agentFirstDeathsPR: number;
    assistsPR: number;
  },
  seasonName: string
) {
  const canvas = createCanvas(width, height);
  const chart = echarts.init(canvas as any, null, {
    width,
    height,
    renderer: "canvas",
  });

  const indicators = [
    { name: "Kills per Round", max: 1.5 },
    { name: "Assists per Round", max: 1.5 },
    { name: "K/D/A", max: 2 },
    { name: "First Deaths per Round", max: 1 },
    { name: "KAST", max: 100 },
  ];

  const values1 = [
    stats1.agentKPR,
    stats1.assistsPR,
    stats1.agentKDA,
    1 - stats1.agentFirstDeathsPR,
    stats1.agentKAST,
  ];

  const values2 = [
    stats2.agentKPR,
    stats2.assistsPR,
    stats2.agentKDA,
    1 - stats2.agentFirstDeathsPR,
    stats2.agentKAST,
  ];

  const option = {
    title: {
      text: `Controller Comparison:\n ${username1} (${agent1}) (${rounds1} rounds)\n vs\n ${username2} (${agent2}) (${rounds2} rounds)`,
      subtext: `${seasonName}`,
      left: "center",
      top: 15,
      textStyle: { fontSize: 13, color: "#333" },
      subtextStyle: { fontSize: 11, color: "#666" }
    },
    backgroundColor: "#ffffff",
    legend: {
      data: [`${username1} - ${agent1}`, `${username2} - ${agent2}`],
      bottom: 10,
      itemGap: 20,
      textStyle: { fontSize: 11 }
    },
    radar: {
      center: ["50%", "55%"],
      radius: "60%",
      startAngle: 90,
      splitNumber: 4,
      shape: 'polygon',
      name: {
        formatter: (name: string, indicator: any) => {
          let displayValue1, displayValue2;
          
          if (name === "First Deaths per Round") {
            displayValue1 = stats1.agentFirstDeathsPR.toFixed(2);
            displayValue2 = stats2.agentFirstDeathsPR.toFixed(2);
          } else if (name === "KAST") {
            displayValue1 = stats1.agentKAST.toFixed(1) + "%";
            displayValue2 = stats2.agentKAST.toFixed(1) + "%";
          } else {
            const axisIndex = indicators.findIndex((i) => i.name === name);
            const value1 = axisIndex >= 0 ? values1[axisIndex] : 0;
            const value2 = axisIndex >= 0 ? values2[axisIndex] : 0;
            displayValue1 = value1.toFixed(2);
            displayValue2 = value2.toFixed(2);
          }
          
          return [
            `{title|${name}}`,
            `{player1|${username1}: ${displayValue1}}`,
            `{player2|${username2}: ${displayValue2}}`
          ].join('\n');
        },
        textStyle: { 
          rich: {
            title: { fontSize: 10, fontWeight: 'bold', color: '#333', align: 'center' },
            player1: { fontSize: 9, color: '#36A2EB', fontWeight: 'bold', align: 'center' },
            player2: { fontSize: 9, color: '#FF6384', fontWeight: 'bold', align: 'center' }
          }
        },
        gap: 20,
      },
      indicator: indicators,
      splitArea: { show: true, areaStyle: { color: ['rgba(250,250,250,0.2)', 'rgba(200,200,200,0.1)'] } },
      splitLine: { show: true, lineStyle: { color: 'rgba(200,200,200,0.6)', width: 1 } },
      axisLine: { show: true, lineStyle: { color: 'rgba(200,200,200,0.8)' } },
      axisLabel: { show: true, formatter: (value: number) => value === 0 ? '' : value.toFixed(1), textStyle: { fontSize: 8, color: '#999' } }
    },
    series: [{
      type: "radar",
      tooltip: { trigger: 'item' },
      data: [
        {
          value: values1, name: `${username1} - ${agent1}`,
          areaStyle: { color: "rgba(54, 162, 235, 0.3)", opacity: 0.3 },
          lineStyle: { color: "#36A2EB", width: 3 },
          itemStyle: { color: "#36A2EB", borderColor: "#36A2EB", borderWidth: 2 },
          symbolSize: 6
        },
        {
          value: values2, name: `${username2} - ${agent2}`,
          areaStyle: { color: "rgba(255, 99, 132, 0.3)", opacity: 0.3 },
          lineStyle: { color: "#FF6384", width: 3 },
          itemStyle: { color: "#FF6384", borderColor: "#FF6384", borderWidth: 2 },
          symbolSize: 6
        },
      ],
    }],
  };

  chart.setOption(option, true);
  chart.resize();
  await new Promise((resolve) => setTimeout(resolve, 300));

  const graphDir = path.join(__dirname, "../graphs");
  if (!fs.existsSync(graphDir)) fs.mkdirSync(graphDir, { recursive: true });
  const safeFile = `controller_${username1}_${agent1}_vs_${username2}_${agent2}_${seasonName}`.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const graphPath = path.join(graphDir, `${safeFile}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(graphPath, buffer);
  chart.dispose();
  console.log(`Controller Comparison Graph saved at: ${graphPath}`);
}

// Initiator Comparison (same as controller)
export async function initiatorComparisonSpiderGraph(
  username1: string, 
  agent1: string, 
  rounds1: string,
  stats1: { agentKPR: number; agentKAST: number; agentKDA: number; agentFirstDeathsPR: number; assistsPR: number; },
  username2: string, 
  agent2: string, 
  rounds2: string,
  stats2: { agentKPR: number; agentKAST: number; agentKDA: number; agentFirstDeathsPR: number; assistsPR: number; },
  seasonName: string
) {
  // Same implementation as controller but with "Initiator Comparison" title and "initiator_" filename prefix
  const canvas = createCanvas(width, height);
  const chart = echarts.init(canvas as any, null, { width, height, renderer: "canvas" });

  const indicators = [
    { name: "Kills per Round", max: 1.5 },
    { name: "Assists per Round", max: 1.5 },
    { name: "K/D/A", max: 2 },
    { name: "First Deaths per Round", max: 1 },
    { name: "KAST", max: 100 },
  ];

  const values1 = [stats1.agentKPR, stats1.assistsPR, stats1.agentKDA, 1 - stats1.agentFirstDeathsPR, stats1.agentKAST];
  const values2 = [stats2.agentKPR, stats2.assistsPR, stats2.agentKDA, 1 - stats2.agentFirstDeathsPR, stats2.agentKAST];

  const option = {
    title: { text: `Initiator Comparison:\n ${username1} (${agent1}) (${rounds1} rounds)\n vs\n ${username2} (${agent2}) (${rounds2} rounds)`, subtext: `${seasonName}`, left: "center", top: 15, textStyle: { fontSize: 13, color: "#333" }, subtextStyle: { fontSize: 11, color: "#666" } },
    backgroundColor: "#ffffff",
    legend: { data: [`${username1} - ${agent1}`, `${username2} - ${agent2}`], bottom: 10, itemGap: 20, textStyle: { fontSize: 11 } },
    radar: {
      center: ["50%", "55%"], radius: "60%", startAngle: 90, splitNumber: 4, shape: 'polygon',
      name: {
        formatter: (name: string, indicator: any) => {
          let displayValue1, displayValue2;
          if (name === "First Deaths per Round") { displayValue1 = stats1.agentFirstDeathsPR.toFixed(2); displayValue2 = stats2.agentFirstDeathsPR.toFixed(2); }
          else if (name === "KAST") { displayValue1 = stats1.agentKAST.toFixed(1) + "%"; displayValue2 = stats2.agentKAST.toFixed(1) + "%"; }
          else { const axisIndex = indicators.findIndex((i) => i.name === name); const value1 = axisIndex >= 0 ? values1[axisIndex] : 0; const value2 = axisIndex >= 0 ? values2[axisIndex] : 0; displayValue1 = value1.toFixed(2); displayValue2 = value2.toFixed(2); }
          return [`{title|${name}}`, `{player1|${username1}: ${displayValue1}}`, `{player2|${username2}: ${displayValue2}}`].join('\n');
        },
        textStyle: { rich: { title: { fontSize: 10, fontWeight: 'bold', color: '#333', align: 'center' }, player1: { fontSize: 9, color: '#36A2EB', fontWeight: 'bold', align: 'center' }, player2: { fontSize: 9, color: '#FF6384', fontWeight: 'bold', align: 'center' } } }, gap: 20,
      },
      indicator: indicators,
      splitArea: { show: true, areaStyle: { color: ['rgba(250,250,250,0.2)', 'rgba(200,200,200,0.1)'] } },
      splitLine: { show: true, lineStyle: { color: 'rgba(200,200,200,0.6)', width: 1 } },
      axisLine: { show: true, lineStyle: { color: 'rgba(200,200,200,0.8)' } },
      axisLabel: { show: true, formatter: (value: number) => value === 0 ? '' : value.toFixed(1), textStyle: { fontSize: 8, color: '#999' } }
    },
    series: [{ type: "radar", tooltip: { trigger: 'item' }, data: [
      { value: values1, name: `${username1} - ${agent1}`, areaStyle: { color: "rgba(54, 162, 235, 0.3)", opacity: 0.3 }, lineStyle: { color: "#36A2EB", width: 3 }, itemStyle: { color: "#36A2EB", borderColor: "#36A2EB", borderWidth: 2 }, symbolSize: 6 },
      { value: values2, name: `${username2} - ${agent2}`, areaStyle: { color: "rgba(255, 99, 132, 0.3)", opacity: 0.3 }, lineStyle: { color: "#FF6384", width: 3 }, itemStyle: { color: "#FF6384", borderColor: "#FF6384", borderWidth: 2 }, symbolSize: 6 },
    ]}],
  };

  chart.setOption(option, true); chart.resize(); await new Promise((resolve) => setTimeout(resolve, 300));
  const graphDir = path.join(__dirname, "../graphs"); if (!fs.existsSync(graphDir)) fs.mkdirSync(graphDir, { recursive: true });
  const safeFile = `initiator_${username1}_${agent1}_vs_${username2}_${agent2}_${seasonName}`.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const graphPath = path.join(graphDir, `${safeFile}.png`); const buffer = canvas.toBuffer("image/png"); fs.writeFileSync(graphPath, buffer); chart.dispose();
  console.log(`Initiator Comparison Graph saved at: ${graphPath}`);
}

// Sentinel Comparison (same as controller)
export async function sentinelComparisonSpiderGraph(
  username1: string, agent1: string, rounds1: string, stats1: { agentKPR: number; agentKAST: number; agentKDA: number; agentFirstDeathsPR: number; assistsPR: number; },
  username2: string, agent2: string, rounds2: string, stats2: { agentKPR: number; agentKAST: number; agentKDA: number; agentFirstDeathsPR: number; assistsPR: number; },
  seasonName: string
) {
  const canvas = createCanvas(width, height);
  const chart = echarts.init(canvas as any, null, { width, height, renderer: "canvas" });

  const indicators = [
    { name: "Kills per Round", max: 1.5 },
    { name: "Assists per Round", max: 1.5 },
    { name: "K/D/A", max: 2 },
    { name: "First Deaths per Round", max: 1 },
    { name: "KAST", max: 100 },
  ];

  const values1 = [stats1.agentKPR, stats1.assistsPR, stats1.agentKDA, 1 - stats1.agentFirstDeathsPR, stats1.agentKAST];
  const values2 = [stats2.agentKPR, stats2.assistsPR, stats2.agentKDA, 1 - stats2.agentFirstDeathsPR, stats2.agentKAST];

  const option = {
    title: { text: `Sentinel Comparison:\n ${username1} (${agent1}) (${rounds1} rounds)\n vs\n ${username2} (${agent2}) (${rounds2} rounds)`, subtext: `${seasonName}`, left: "center", top: 15, textStyle: { fontSize: 13, color: "#333" }, subtextStyle: { fontSize: 11, color: "#666" } },
    backgroundColor: "#ffffff",
    legend: { data: [`${username1} - ${agent1}`, `${username2} - ${agent2}`], bottom: 10, itemGap: 20, textStyle: { fontSize: 11 } },
    radar: {
      center: ["50%", "55%"], radius: "60%", startAngle: 90, splitNumber: 4, shape: 'polygon',
      name: {
        formatter: (name: string, indicator: any) => {
          let displayValue1, displayValue2;
          if (name === "First Deaths per Round") { displayValue1 = stats1.agentFirstDeathsPR.toFixed(2); displayValue2 = stats2.agentFirstDeathsPR.toFixed(2); }
          else if (name === "KAST") { displayValue1 = stats1.agentKAST.toFixed(1) + "%"; displayValue2 = stats2.agentKAST.toFixed(1) + "%"; }
          else { const axisIndex = indicators.findIndex((i) => i.name === name); const value1 = axisIndex >= 0 ? values1[axisIndex] : 0; const value2 = axisIndex >= 0 ? values2[axisIndex] : 0; displayValue1 = value1.toFixed(2); displayValue2 = value2.toFixed(2); }
          return [`{title|${name}}`, `{player1|${username1}: ${displayValue1}}`, `{player2|${username2}: ${displayValue2}}`].join('\n');
        },
        textStyle: { rich: { title: { fontSize: 10, fontWeight: 'bold', color: '#333', align: 'center' }, player1: { fontSize: 9, color: '#36A2EB', fontWeight: 'bold', align: 'center' }, player2: { fontSize: 9, color: '#FF6384', fontWeight: 'bold', align: 'center' } } }, gap: 20,
      },
      indicator: indicators,
      splitArea: { show: true, areaStyle: { color: ['rgba(250,250,250,0.2)', 'rgba(200,200,200,0.1)'] } },
      splitLine: { show: true, lineStyle: { color: 'rgba(200,200,200,0.6)', width: 1 } },
      axisLine: { show: true, lineStyle: { color: 'rgba(200,200,200,0.8)' } },
      axisLabel: { show: true, formatter: (value: number) => value === 0 ? '' : value.toFixed(1), textStyle: { fontSize: 8, color: '#999' } }
    },
    series: [{ type: "radar", tooltip: { trigger: 'item' }, data: [
      { value: values1, name: `${username1} - ${agent1}`, areaStyle: { color: "rgba(54, 162, 235, 0.3)", opacity: 0.3 }, lineStyle: { color: "#36A2EB", width: 3 }, itemStyle: { color: "#36A2EB", borderColor: "#36A2EB", borderWidth: 2 }, symbolSize: 6 },
      { value: values2, name: `${username2} - ${agent2}`, areaStyle: { color: "rgba(255, 99, 132, 0.3)", opacity: 0.3 }, lineStyle: { color: "#FF6384", width: 3 }, itemStyle: { color: "#FF6384", borderColor: "#FF6384", borderWidth: 2 }, symbolSize: 6 },
    ]}],
  };

  chart.setOption(option, true); chart.resize(); await new Promise((resolve) => setTimeout(resolve, 300));
  const graphDir = path.join(__dirname, "../graphs"); if (!fs.existsSync(graphDir)) fs.mkdirSync(graphDir, { recursive: true });
  const safeFile = `sentinel_${username1}_${agent1}_vs_${username2}_${agent2}_${seasonName}`.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const graphPath = path.join(graphDir, `${safeFile}.png`); const buffer = canvas.toBuffer("image/png"); fs.writeFileSync(graphPath, buffer); chart.dispose();
  console.log(`Sentinel Comparison Graph saved at: ${graphPath}`);
}

// Duelist Comparison - Different indicators!
export async function duelistComparisonSpiderGraph(
  username1: string,
  agent1: string,
  rounds1: string,
  stats1: {
    agentKPR: number;
    agentKAST: number;
    agentKDA: number;
    agentEntryRate: number;
    agentDamagePerRound: number;
  },
  username2: string,
  agent2: string,
  rounds2: string,
  stats2: {
    agentKPR: number;
    agentKAST: number;
    agentKDA: number;
    agentEntryRate: number;
    agentDamagePerRound: number;
  },
  seasonName: string
) {
  const canvas = createCanvas(width, height);
  const chart = echarts.init(canvas as any, null, {
    width,
    height,
    renderer: "canvas",
  });

  const indicators = [
    { name: "Kills per Round", max: 1.5 },
    { name: "Damage per Round", max: 200 },
    { name: "KDA", max: 2 },
    { name: "Entry Success Rate (%)", max: 100 },
    { name: "KAST (%)", max: 100 },
  ];

  const values1 = [
    stats1.agentKPR,
    stats1.agentDamagePerRound,
    stats1.agentKDA,
    stats1.agentEntryRate,
    stats1.agentKAST,
  ];

  const values2 = [
    stats2.agentKPR,
    stats2.agentDamagePerRound,
    stats2.agentKDA,
    stats2.agentEntryRate,
    stats2.agentKAST,
  ];

  const option = {
    title: {
      text: `Duelist Comparison:\n ${username1} (${agent1}) (${rounds1} rounds)\n vs\n ${username2} (${agent2}) (${rounds2} rounds)`,
      subtext: `${seasonName}`,
      left: "center",
      top: 15,
      textStyle: { fontSize: 13, color: "#333" },
      subtextStyle: { fontSize: 11, color: "#666" }
    },
    backgroundColor: "#ffffff",
    legend: {
      data: [`${username1} - ${agent1}`, `${username2} - ${agent2}`],
      bottom: 10,
      itemGap: 20,
      textStyle: { fontSize: 11 }
    },
    radar: {
      center: ["50%", "55%"],
      radius: "60%",
      startAngle: 90,
      splitNumber: 4,
      shape: 'polygon',
      name: {
        formatter: (name: string, indicator: any) => {
          const axisIndex = indicators.findIndex((i) => i.name === name);
          const value1 = axisIndex >= 0 ? values1[axisIndex] : 0;
          const value2 = axisIndex >= 0 ? values2[axisIndex] : 0;
          
          let displayValue1, displayValue2;
          
          if (name === "Entry Success Rate (%)" || name === "KAST (%)") {
            displayValue1 = value1.toFixed(1) + "%";
            displayValue2 = value2.toFixed(1) + "%";
          } else {
            displayValue1 = value1.toFixed(2);
            displayValue2 = value2.toFixed(2);
          }
          
          return [
            `{title|${name}}`,
            `{player1|${username1}: ${displayValue1}}`,
            `{player2|${username2}: ${displayValue2}}`
          ].join('\n');
        },
        textStyle: { 
          rich: {
            title: { fontSize: 10, fontWeight: 'bold', color: '#333', align: 'center' },
            player1: { fontSize: 9, color: '#36A2EB', fontWeight: 'bold', align: 'center' },
            player2: { fontSize: 9, color: '#FF6384', fontWeight: 'bold', align: 'center' }
          }
        },
        gap: 20,
      },
      indicator: indicators,
      splitArea: { show: true, areaStyle: { color: ['rgba(250,250,250,0.2)', 'rgba(200,200,200,0.1)'] } },
      splitLine: { show: true, lineStyle: { color: 'rgba(200,200,200,0.6)', width: 1 } },
      axisLine: { show: true, lineStyle: { color: 'rgba(200,200,200,0.8)' } },
      axisLabel: { show: true, formatter: (value: number) => value === 0 ? '' : value.toFixed(1), textStyle: { fontSize: 8, color: '#999' } }
    },
    series: [{
      type: "radar",
      tooltip: { trigger: 'item' },
      data: [
        {
          value: values1, name: `${username1} - ${agent1}`,
          areaStyle: { color: "rgba(54, 162, 235, 0.3)", opacity: 0.3 },
          lineStyle: { color: "#36A2EB", width: 3 },
          itemStyle: { color: "#36A2EB", borderColor: "#36A2EB", borderWidth: 2 },
          symbolSize: 6
        },
        {
          value: values2, name: `${username2} - ${agent2}`,
          areaStyle: { color: "rgba(255, 99, 132, 0.3)", opacity: 0.3 },
          lineStyle: { color: "#FF6384", width: 3 },
          itemStyle: { color: "#FF6384", borderColor: "#FF6384", borderWidth: 2 },
          symbolSize: 6
        },
      ],
    }],
  };

  chart.setOption(option, true);
  chart.resize();
  await new Promise((resolve) => setTimeout(resolve, 300));

  const graphDir = path.join(__dirname, "../graphs");
  if (!fs.existsSync(graphDir)) fs.mkdirSync(graphDir, { recursive: true });
  const safeFile = `duelist_${username1}_${agent1}_vs_${username2}_${agent2}_${seasonName}`.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const graphPath = path.join(graphDir, `${safeFile}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(graphPath, buffer);
  chart.dispose();
  console.log(`Duelist Comparison Graph saved at: ${graphPath}`);
}