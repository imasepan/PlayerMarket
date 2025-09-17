
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
    { name: "APR", max: 1.5 },
    { name: "KDA", max: 2 },
    { name: "FD per Round", max: 1 },
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
    { name: "APR", max: 1.5 },
    { name: "KDA", max: 2 },
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
    agentFKFD: number;
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
    { name: "APR", max: 1.5 },
    { name: "KDA", max: 2 },
    { name: "FK/FD", max: 2.5 },
    { name: "KAST", max: 100 },
  ];

  const values = [
    stats.agentKPR,
    stats.assistsPR,
    stats.agentKDA,
    stats.agentFKFD,
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
    agentFKFD: number;
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
    { name: "Kills per Round", max: 2 },
    { name: "Damage per Round", max: 250 },
    { name: "KDA", max: 2 },
    { name: "FK/FD", max: 2.5 },
    { name: "KAST", max: 100 },
  ];

  const values = [
    stats.agentKPR,
    stats.agentDamagePerRound,
    stats.agentKDA,
    stats.agentFKFD,
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