/* Navbar buttons */
const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButtoon = document.querySelector("#menu-open-button");
const menuCloseButtoon = document.querySelector("#menu-close-button");

if (menuOpenButtoon) {
    menuOpenButtoon.addEventListener("click", () => {
        document.body.classList.toggle("show-mobile-menu");
    });
}

if (menuCloseButtoon) {
    menuCloseButtoon.addEventListener("click", () => menuOpenButtoon.click());
}

if (navLinks && menuOpenButtoon) {
    navLinks.forEach(link => {
        link.addEventListener("click", () => menuOpenButtoon.click());
    });
}
/* ------------------------------------------------------------------------- */

/* Round video buttons */
const btns = document.querySelectorAll(".nav-btn");
const slides = document.querySelectorAll(".video-slide");
const contents = document.querySelectorAll(".content");

var sliderNav = function(manual) {
    btns.forEach((btn) => { btn.classList.remove("active") });
    slides.forEach((slide) => { slide.classList.remove("active") });
    contents.forEach((content) => { content.classList.remove("active") });

    if (btns[manual]) btns[manual].classList.add("active");
    if (slides[manual]) slides[manual].classList.add("active");
    if (contents[manual]) contents[manual].classList.add("active");
}

btns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        sliderNav(i);
    });
});
/* --------------------------------------------------------------------- */

/* Showing navbar > 50 */
window.addEventListener("scroll", function () {
    const header = this.document.querySelector("header");
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }
});
/* --------------------------------------------------------------------- */

/* Scroll to top button */
let calcScrollValue = () => {
  let scrollProgress = document.getElementById("progress");
  let progressValue = document.getElementById("progress-value");
  let pos = document.documentElement.scrollTop;
  let calcHeight =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let scrollValue = Math.round((pos * 100)/calcHeight);
  
  if (pos > 100) {
    scrollProgress.style.display = "grid";
  } else {
    scrollProgress.style.display = "none";
  }

  scrollProgress.addEventListener("click", () => {
    document.documentElement.scrollTop = 0;
  });

  scrollProgress.style.background = `conic-gradient(#124059 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;
/* --------------------------------------------------------------------- */

/* Pop-up modal */
const highIncome = document.getElementById("high-income");
const lowIncome = document.getElementById("low-income");
const middleIncome = document.getElementById("middle-income");
const bnp = document.getElementById("bnp");

if (highIncome) {
  highIncome.addEventListener("click", () => {
    document
      .getElementById("high-income-modal")
      .classList.add("modal-open");
  });
}

if (lowIncome) {
  lowIncome.addEventListener("click", () => {
    document
      .getElementById("low-income-modal")
      .classList.add("modal-open");
  });
}

if (bnp) {
  bnp.addEventListener("click", () => {
    document
      .getElementById("bnp-modal")
      .classList.add("modal-open");
  });
}

document.querySelectorAll(".icon-close").forEach(button => {
  button.addEventListener("click", () => {
    button.closest(".modal").classList.remove("modal-open");
  });
});
/* --------------------------------------------------------------------- */

/* OWID grafer */
const urlOWID =
  "https://ourworldindata.org/grapher/improved-water-sources-vs-gdp-per-capita.csv?v=1&csvType=full&useColumnShortNames=true";

const hasOWID =
    document.getElementById("owid1") ||
    document.getElementById("owid2") ||
    document.getElementById("owid3") ||
    document.getElementById("owidMap");

if (hasOWID) {
   fetch(urlOWID)
    .then((response) => response.text())
    .then((data) => printOWIDChart(data));
}    

function printOWIDChart(dataOWID) {
  const rows = dataOWID.split("\n");
  const data = rows.map(
    row => row.split(","));
  const values = data.slice(1);

/* Values scatterplot */
  const year2024 = values.filter(
    row => Number(row[2]) === 2024
  );
  const scatterData = year2024.filter(row =>
    Number(row[3]) > 0 && 
    Number(row[4]) > 0 
  )
  .map(row => ({
    x: Number(row[3]),
    y: Number(row[4]),
    country: row[0],
    continent: row[5]
  })) 

  function filterContinent(name, color) {
      return{
        label:name,
        data: scatterData.filter(d => d.continent === name),
        backgroundColor: color,
        pointRadius: 5
      }
  }

/* Values Togo vs Sweden */
  const togoData = values
  .filter(row => row[0] === "Togo" &&
    Number(row[2]) > 0 &&
    Number(row[3]) > 0
  )
  .map(row => ({
    x: Number(row[2]), 
    y: Number(row[3])  
  }))

  const swedenData = values
  .filter(row => row[0] === "Sweden" &&
    Number(row[2]) > 0 &&
    Number(row[3]) > 0
  )
  .map(row => ({
    x: Number(row[2]), 
    y: Number(row[3])   
  }))

/* Values Togo BNP vs water */
  const togoWater = values
  .filter(row => row[0] === "Togo" &&
    Number(row[2]) > 0 &&
    Number(row[3]) > 0
  )
  .map(row => ({
    x: Number(row[2]), 
    y: Number(row[3])    
  }))

  const togoGDP = values
  .filter(row => row[0] === "Togo" &&
    Number(row[2]) > 1999 &&
    Number(row[4]) > 0
  )
  .map(row => ({
    x: Number(row[2]),
    y: Number(row[4])
  }))
/* -------------------------------------------------------------------------- */

/* Heatmap */
  if (document.getElementById("owidMap")) {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then((res) => res.json())
      .then((topoData) => {
        const countries = ChartGeo.topojson.feature(topoData, topoData.objects.countries).features;
  
        fetch(urlOWID)
          .then((response) => response.text())
          .then((csvData) => printWorldMap(countries, csvData));
      }
    );
  }
  
  function printWorldMap(countries, csvData) {
    const rows = csvData.split("\n");
    const data = rows.map(row => row.split(","));
    const values = data.slice(1);
    const targetYearData = values.filter(row => Number(row[2]) === 2024);
    const waterAcessMap = {};
    targetYearData.forEach(row => {
      const countryName = row[0]. trim();
      const waterAccess = Number(row[3]);
      
      if (!isNaN(waterAccess)) {
        waterAcessMap[countryName] = waterAccess;
      }
    });
  
    const nameFix= {
      "United States of America": "United States Virgin Islands",
      "Congo": "Democratic Republic of Congo",
      "Dem. Rep. Congo": "Democratic Republic of Congo",
      "Domincan Rep.": "Dominican Republic",
      "Central African Rep.": "Central African Republic",
      "Eq. Guinea": "Equatorial Guinea",
      "eSwatini": "Eswatini",
      "S. Sudan": "South Sudan",
      "Bosnia and Herz.": "Bosnia and Herzegovina",
      "Macedonia": "North Macedonia",
      "Timor-Leste": "East Timor",
      "Solomon Is.": "Solomon Islands",
      "Côte d'Ivoire": "Cote d'Ivoire",
      "N. Cyprus": "Northern Cyprus",
      "North Korea": "North Korea",
      "Taiwan": "Taiwan (Province of China)",
      "kosovo": "Kosovo",
      "Eritrea": "Eritrea",
      "Argentina": "Argentina",
      "W. Sahara": "Western Sahara",
    }
  console.log(Object.keys(waterAcessMap).filter(n => n.includes("United States")))
  console.log(Object.keys(waterAcessMap).filter(n => n.includes("Congo")))
  console.log(Object.keys(waterAcessMap).filter(n => n.includes("Dem. Rep. Congo")))
  
  const mapData = countries.map((feature) => {
      const originalName = feature.properties.name;
      const countryName = nameFix[originalName] || originalName;
      return {
        feature, value: waterAcessMap[countryName] ?? null
      };
  });
  
  const missingCountries = [];
  mapData.forEach(d => {
    if (d.value === null) {
      missingCountries.push(d.feature.properties.name);
    }
  });
  
  new Chart(document.getElementById("owidMap"), {
      type: "choropleth",
      data: { 
        labels: mapData.map(d => d.feature.properties.name),
        datasets: [{
          label: "Tillgång till förbättrade vattenkällor (%)",
          data: mapData
        }]
      },
      options: {  
        plugins: {
          legend: {
            display: false 
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                if (ctx.raw.value === null) {
                  return ctx.chart.data.labels[ctx.dataIndex] + ": Data saknas";
                }
                return (
                  ctx.chart.data.labels[ctx.dataIndex] + ": " + ctx.raw.value.toFixed(1) + "%"
                );
              }
            }
          }
        },
        scales: {
          projection: {
            axis: "x",
            projection: "equalEarth"
          },
          color: {
            axis: "x",
            min: 0,
            max: 100,
            interpolate: (v) => {
              const value = v * 100;
              return `hsl(200, 70%, ${95 - value * 0.8}%)`
            },
            ticks: {
              stepSize: 25,
              callback: (value) => value + "%"
            },
            legend: {
              position: "top-right"
            }
          }
        }
      }
    });
  }
/* -------------------------------------------------------------------------- */
 
/* Scatterplot */
if (document.getElementById("owid1")) {
  new Chart(document.getElementById("owid1"), {
    type: "scatter",
    data: {
      datasets: [
        filterContinent("Europe", "rgba(34, 112, 189, 0.6)"),
        filterContinent("Asia", "rgba(128, 18, 206, 0.6)"),
        filterContinent("Africa", "rgba(255, 141, 1, 0.6)"),
        filterContinent("North America", "rgba(255, 0, 0, 0.6)"),
        filterContinent("South America", "rgba(13, 108, 27, 0.6)"),
        filterContinent("Oceania", "rgba(19, 199, 249, 0.6)"),
      ]
    },
    options: {
      plugins: {   
        legend:{
            position: "right",
            align: "start",
            labels: {
              boxWidth: 12,
              padding: 15
            }
          },
        tooltip: {
            callbacks: {
              label: function(context) {
                return (
                  context.raw.country +
                  " | Vatten: " +
                  Math.round(context.raw.x) + "%" +
                  " | BNP per capita: " + "$" +
                  Math.round(context.raw.y).toLocaleString("sv-SE")
                );
              }
            }
          } 
        },
      scales: {
        x: {
          title: {
            display: true,
            text: "Tillgång till förbättrade vattenkällor (%)",
            padding: 10
          },
          ticks: {
            callback: (value) => value.toFixed(0) + "%"
          }
        },
        y: {
          type: "logarithmic",
          title: {
            display: true,
            text: "BNP per capita ($)",
            padding: 10
          },
          ticks: {
            maxTicksLimit: 5
          }
        }
      }
    }
  });
  }
/* -------------------------------------------------------------------------- */

/* Linechart Sweden vs Togo */
if (document.getElementById("owid2")) {
  new Chart(document.getElementById("owid2"), {
    type: "line",
    data: {
      datasets: [
        {
          label: "Sverige",
          data:swedenData,
          borderColor: "rgb(163, 102, 36)",
          backgroundColor: "rgb(176, 129, 78)", 
          borderWidth: 3
        },
        {
          label: "Togo",
          data: togoData,
          borderColor: "rgb(18, 64, 89)",
          backgroundColor: "rgb(56, 100, 123)",
          borderWidth: 3
        }
      ]
    },
    options: {
      plugins: {
        legend:{
          position: "top",
          labels: {
            boxWidth: 12,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            title: function(context) {
              return "År: " + context[0].raw.x
            },
            label: function(context) {
              return( 
                " Vatten: " + context.raw.y.toFixed(2) + "%"
              )
            }
          }
        }  
      },
      scales: {
        x: {
          type: "linear",
          ticks: {
            callback: (value) => Number(value)
          }
        },
        y:{
          title: {
            display: true,
            text: "Tillgång till förbättrade vattenkällor (%)",
             padding: 10,
          },
           ticks: {
          callback: (value) => value.toFixed(0) + "%"
          }
        }
      }
    }
  })
}
/* -------------------------------------------------------------------------- */

/* Linechart Togo BNP vs water */
if (document.getElementById("owid3")) {
  new Chart(document.getElementById("owid3"), {
    type: "line",
    data: {
      datasets: [
        {
          label: "Vattentillgång (%)",
          data: togoWater,
          borderColor: "rgb(18, 64, 89)",
          backgroundColor: "rgb(56, 100, 123)",
          borderWidth: 3
        },
        {
          label: "BNP per capita ($)",
          data: togoGDP,
          borderColor: "rgb(163, 102, 36)",
          backgroundColor: "rgb(176, 129, 78)",
          borderWidth: 3,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      plugins: {
        legend:{
          position: "top",
          labels: {
            boxWidth: 12,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            title: function(context) {
              return "År: " + context[0].raw.x
            },
            label: function(context) {
              if (context.dataset.label === "Vattentillgång (%)") {
                return " Vatten: " + context.raw.y.toFixed(1) + "%";
              } else {
                return " BNP per capita: " + Math.round(context.parsed.y).toLocaleString() + "$";
              }
            }
          }
        }  
      },
      scales: {
        x: {
          type: "linear", 
          ticks: {
            callback: (value) => Number(value)
          }
        },
        y:{
          title: {
            display: true,
            text: "Tillgång till förbättrade vattenkällor (%)",
             padding: 10,
          },
           ticks: {
          callback: (value) => value.toFixed(0) + "%"
          }
        },
        y1: {
          type: "logarithmic",
          position: "right",
          title: {
            display: true,
            text: "BNP per capita ($)"
          }, 
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  })
}
}
/* ------------------------------------------------------------------------------- */

/* Barchart Zimbabwe vs Sweden */
const urlOWIDSchool = "https://ourworldindata.org/grapher/schools-access-drinking-water.csv?v=1&csvType=full&useColumnShortNames=true";

if (document.getElementById("owidBar")) {
  fetch(urlOWIDSchool)
    .then(response => response.text())
    .then(data => printSchoolChart(data));
  }

function printSchoolChart(dataOWIDSchool) {
    const rows = dataOWIDSchool.split("\n");
    const data = rows.map(
        row => row.split(",")
    );
    const values = data.slice(1);
    const year2020 = values.filter(
        row => Number(row[2]) === 2020
    );
    const labels = ["Gymnasie", "Högstadie", "Grundskola"];
    const sweden = [];
    const zimbabwe = [];

    year2020.forEach(row => {
        const country = row[0];
        
        if (country === "Sweden") {
            sweden.push(
                Number(row[4]),
                Number(row[3]),
                Number(row[5])
            );
        }
        if (country === "Zimbabwe") {
            zimbabwe.push(
                Number(row[4]),
                Number(row[3]),
                Number(row[5])
            );
        }
    });

    new Chart(document.getElementById("owidBar"), {
        type: "bar",
        data: {
            labels: labels,
        datasets: [
          {
            label: "Sweden",
            data: sweden,
            borderWidth: 1.5,
            barThickness: 25,
            borderColor: "rgb(18, 64, 89)",
            backgroundColor: "rgb(56, 100, 123)"
          },
          {
            label: "Zimbabwe",
            data: zimbabwe,
            borderWidth: 1.5,
            barThickness: 25,
            borderColor: "rgb(163, 102, 36)",
            backgroundColor: "rgb(176, 129, 78)"
          }
        ]},

        options: {
            layout: {
                padding: {
                    right: 50
                }
            },
            indexAxis: "y",
            scales: {
                x: {
                    title: {
                    display: true,
                    text: "Tillgång till rent vatten (%)",
                    padding: 10
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: value => value + "%"
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        },
        
        plugins: [{
            id: "valueLabels",
            afterDatasetsDraw(chart) {
                const { ctx } = chart;
      
                ctx.save();
      
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
      
                    meta.data.forEach((bar, index) => {
                        const value = dataset.data[index];
      
                        ctx.font = "13px sans-serif";
                        ctx.fillStyle = "#555";
                        ctx.textAlign = "left";
                        ctx.textBaseline = "middle";
      
                        ctx.fillText(
                            value + "%",
                            bar.x + 10,
                            bar.y
                        );
                    });
                });
                ctx.restore();
            }
        }]
    });
}