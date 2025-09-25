
import * as echarts from "echarts";
import { createCanvas, Image } from "canvas";
import fs from "fs";
import path from "path";

const width = 600;
const height = 600;

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

export async function comparisonSpiderGraph(
  username1: string,
  agent1: string,
  stats1: {
    agentKPR: number;
    agentKAST: number;
    agentKDA: number;
    agentFirstDeathsPR: number;
    assistsPR: number;
  },
  username2: string,
  agent2: string,
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
    1 - stats1.agentFirstDeathsPR, // Inverted so higher is better
    stats1.agentKAST,
  ];

  const values2 = [
    stats2.agentKPR,
    stats2.assistsPR,
    stats2.agentKDA,
    1 - stats2.agentFirstDeathsPR, // Inverted so higher is better
    stats2.agentKAST,
  ];

  const option = {
    title: {
      text: `${username1} (${agent1}) vs ${username2} (${agent2})`,
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
      radius: "60%", // Slightly smaller to make room for labels
      startAngle: 90,
      splitNumber: 4, // Number of grid circles
      shape: 'polygon',
      name: {
        formatter: (name: string, indicator: any) => {
          // Get current values for both players for this axis
          const axisIndex = indicators.findIndex((i) => i.name === name);
          const value1 = axisIndex >= 0 ? values1[axisIndex] : 0;
          const value2 = axisIndex >= 0 ? values2[axisIndex] : 0;
          let displayValue1;
          let displayValue2;
          if (name === "First Deaths per Round") {
          // For First Deaths per Round, show inverted scale (1.0 = best, 0.0 = worst)
          // Convert the actual value to display value
          displayValue1 = stats1.agentFirstDeathsPR.toFixed(2);
          displayValue2 = stats2.agentFirstDeathsPR.toFixed(2);
          } else {
          displayValue1 = value1.toFixed(2);
          displayValue2 = value2.toFixed(2);
          } 
          if (name === "KAST") {
          displayValue1 = stats1.agentKAST.toFixed(1) + "%";
          displayValue2 = stats2.agentKAST.toFixed(1) + "%";
          }
          return [
            `{title|${name}}`,
            `{player1|${username1}: ${displayValue1}}`,
            `{player2|${username2}: ${displayValue2}}`
          ].join('\n');
        },
        textStyle: { 
          rich: {
            title: {
              fontSize: 10,
              fontWeight: 'bold',
              color: '#333',
              align: 'center'
            },
            player1: {
              fontSize: 9,
              color: '#36A2EB',
              fontWeight: 'bold',
              align: 'center'
            },
            player2: {
              fontSize: 9,
              color: '#FF6384',
              fontWeight: 'bold',
              align: 'center'
            }
          }
        },
        gap: 20, // Distance from radar chart
      },
      indicator: indicators,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0.2)', 'rgba(200,200,200,0.1)']
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(200,200,200,0.6)',
          width: 1
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(200,200,200,0.8)'
        }
      },
      // This is what adds the axis numbers!
      axisLabel: {
        show: true,
        formatter: function(value: number, index: number) {
          // Format the axis labels to show scale values
          if (value === 0) return '';
          return value.toFixed(1);
        },
        textStyle: {
          fontSize: 8,
          color: '#999'
        }
      }
    },
    series: [
      {
        type: "radar",
        tooltip: {
          trigger: 'item'
        },
        data: [
          {
            value: values1,
            name: `${username1} - ${agent1}`,
            areaStyle: { 
              color: "rgba(54, 162, 235, 0.3)",
              opacity: 0.3 
            },
            lineStyle: { 
              color: "#36A2EB", 
              width: 3 
            },
            itemStyle: { 
              color: "#36A2EB",
              borderColor: "#36A2EB",
              borderWidth: 2
            },
            symbolSize: 6
          },
          {
            value: values2,
            name: `${username2} - ${agent2}`,
            areaStyle: { 
              color: "rgba(255, 99, 132, 0.3)",
              opacity: 0.3 
            },
            lineStyle: { 
              color: "#FF6384", 
              width: 3 
            },
            itemStyle: { 
              color: "#FF6384",
              borderColor: "#FF6384", 
              borderWidth: 2
            },
            symbolSize: 6
          },
        ],
      },
    ],
  };

  chart.setOption(option, true);
  chart.resize();
  await new Promise((resolve) => setTimeout(resolve, 300));

  const graphDir = path.join(__dirname, "../graphs");
  if (!fs.existsSync(graphDir)) fs.mkdirSync(graphDir, { recursive: true });

  const safeFile = `${username1}_${agent1}_vs_${username2}_${agent2}_${seasonName}`
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();

  const graphPath = path.join(graphDir, `${safeFile}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(graphPath, buffer);

  chart.dispose();
  console.log(`Comparison Graph saved at: ${graphPath}`);
}

// Alternative version with simpler axis labels (just showing the scale)
export async function comparisonSpiderGraphSimple(
  username1: string,
  agent1: string,
  stats1: {
    agentKPR: number;
    agentKAST: number;
    agentKDA: number;
    agentFirstDeathsPR: number;
    assistsPR: number;
  },
  username2: string,
  agent2: string,
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
      text: `${username1} (${agent1}) vs ${username2} (${agent2}) - ${seasonName}`,
      left: "center",
      top: 15,
      textStyle: { fontSize: 14, color: "#333" },
    },
    backgroundColor: "#ffffff",
    legend: {
      data: [`${username1} - ${agent1}`, `${username2} - ${agent2}`],
      bottom: 10,
      itemGap: 20
    },
    radar: {
      center: ["50%", "55%"],
      radius: "65%",
      name: {
        formatter: (name: string, indicator: any) => {
          return `${name}\n(0-${indicator.max})`;
        },
        textStyle: { 
          fontSize: 10,
          color: '#333',
          align: 'center'
        },
        gap: 15
      },
      indicator: indicators,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0.2)', 'rgba(200,200,200,0.1)']
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(200,200,200,0.6)',
          width: 1
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(200,200,200,0.8)'
        }
      },
      // Simple axis labels showing scale
      axisLabel: {
        show: true,
        formatter: (value: number) => {
          if (value === 0) return '';
          return value % 1 === 0 ? value.toString() : value.toFixed(1);
        },
        textStyle: {
          fontSize: 8,
          color: '#666'
        }
      }
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: values1,
            name: `${username1} - ${agent1}`,
            areaStyle: { color: "rgba(54, 162, 235, 0.3)" },
            lineStyle: { color: "#36A2EB", width: 2 },
            itemStyle: { color: "#36A2EB" },
            symbolSize: 5
          },
          {
            value: values2,
            name: `${username2} - ${agent2}`,
            areaStyle: { color: "rgba(255, 99, 132, 0.3)" },
            lineStyle: { color: "#FF6384", width: 2 },
            itemStyle: { color: "#FF6384" },
            symbolSize: 5
          },
        ],
      },
    ],
  };

  chart.setOption(option, true);
  chart.resize();
  await new Promise((resolve) => setTimeout(resolve, 300));

  const graphDir = path.join(__dirname, "../graphs");
  if (!fs.existsSync(graphDir)) fs.mkdirSync(graphDir, { recursive: true });

  const safeFile = `${username1}_${agent1}_vs_${username2}_${agent2}_${seasonName}`
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();

  const graphPath = path.join(graphDir, `simple_${safeFile}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(graphPath, buffer);

  chart.dispose();
  console.log(`Simple Comparison Graph saved at: ${graphPath}`);
}