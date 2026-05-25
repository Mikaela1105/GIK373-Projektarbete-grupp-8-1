// Ändrar panel namn
function openPanel(panel) {
    if (panel === "#") {
        document.title = "Världens vatten";
    } else if (panel === "about") {
        document.title = "Världens vatten - Om oss";
    } else if (panel === "facts") {
        document.title = "Världens vatten - Fakta";
    } else if (panel === "statistics") {
        document.title = "Världens vatten - Statistik";
    } else if (panel === "resources") {
        document.title = "Världens vatten - Kontakter";
    }
}

// Videorna
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

// Scroll to top 
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

// Charts scatterplot och linjediagram
const urlOWID =
  "https://ourworldindata.org/grapher/improved-water-sources-vs-gdp-per-capita.csv?v=1&csvType=full&useColumnShortNames=true";


fetch(urlOWID)
  .then((response) => response.text())
  .then((data) => printOWIDChart(data));

function printOWIDChart(dataOWID) {

  // dela upp i rader
  const rows = dataOWID.split("\n");

  // dela upp varje rad i kolumner
  const data = rows.map(
    row => row.split(",")
  );
  //ta bort första raden
  const values = data.slice(1
  );

  console.log(values)

//Linjediagram
const eritreaData = values
  .filter(row => row[0] === "Togo" &&
    Number(row[2]) > 0 &&
    Number(row[3]) > 0)
  .map(row => ({
    x: Number(row[2]), // År
    y: Number(row[3]) // Vatten
    
}))

const swedenData = values
  .filter(row => row[0] === "Sweden" &&
    Number(row[2]) > 0 &&
    Number(row[3]) > 0
  )
  .map(row => ({
    x: Number(row[2]), // År
    y: Number(row[3]) // Vatten
    
}))

new Chart(document.getElementById("owid2"), {
    type: "line",
    data: {
      datasets: [
        {
          label: "Togo",
          data: eritreaData,
          borderColor: "rgba(46, 141, 146, 0.72)",
          backgroundColor: "rgba(63, 160, 165, 0.84)",
          borderWidth: 3
        },
        {
          label: "Sverige",
          data:swedenData,
          borderColor: "rgba(165, 127, 45, 0.72)",
          backgroundColor: "rgba(190, 138, 60, 0.84)",
          borderWidth: 3
        }
      ]
    },

    options: {

      plugins: {

        legend:{
          position: "right",
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
                " | Vatten: " + context.raw.y.toFixed(2) + "%" //kanske byta till "Number(context.raw.y).toFixed(2)"
              )
            }
          }
        }  
      },

      scales: {
        x: {
          type: "linear", // ÄNDRA TILL CATEGORY?
          
          ticks: {
            callback: (value) => Number(value)
          }
        },

        y:{
          title: {
            display: true,
            text: "Tillgång till rent vatten (%)",
             padding: 16,
          },
           ticks: {
          callback: (value) => value.toFixed(0) + "%"
          }
        }
      }
    }
})

// SCATTERPLOT
  // välj år
     const year2024 = values.filter(
    row => Number(row[2]) === 2024
  );

  console.log(year2024)


  const scatterData = year2024.filter(row =>
    Number(row[3]) > 0 && // båda rader filtrerar bort värden med 0
    Number(row[4]) > 0  //(större än noll) hindrar felaktiga värden att hamna i grafen
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

console.log(scatterData);

//Skapa chart
new Chart(document.getElementById("owid1"), {
  type: "scatter",
  data: {

    datasets: [

      filterContinent("Europe", "rgba(20, 128, 236, 0.57)"),
      filterContinent("Asia", "rgba(128, 18, 206, 0.5)"),
      filterContinent("Africa", "rgba(255, 162, 12, 0.62)"),
      filterContinent("North America", "rgba(228, 119, 148, 0.69)"),
      filterContinent("South America", "rgba(22, 105, 60, 0.61)"),
      filterContinent("Oceania", "rgba(32, 196, 196, 0.76)"),


    ]
  },

  options: {

    plugins: {
        
      legend:{
          position: "right",
          align: "top",
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
                " | BNP: " +
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
          text: "Tillgång till rent vatten (%)",
          padding: 16
        },
        ticks: {
          callback: (value) => value.toFixed(0) + "%"
        }
      },

      y: {
        type: "logarithmic",
        title: {
          display: true,
          text: "BNP per capita",
          padding: 16
        },
        ticks: {
          maxTicksLimit: 5
        }
      }
    }
  }
}); 

}

// HeatMap
/* if (document.getElementById("owidMap")) {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then((res) => res.json())
      .then((topoData) => {
        const countries = ChartGeo.topojson.feature(topoData, topoData.objects.countries).features;

        fetch(urlOWID)
          .then((response) => response.text())
          .then((csvData) => printWorldMap(countries, csvData));
      });
}

function printWorldMap(countries, csvData) {
  const rows = csvData.split("\n");
  const data = rows.map(row => row.split(","));
  const values = data.slice(1);

  const targetYearData = values.filter(row => Number(row[2]) === 2021);

  const waterAcessMap = {};
  targetYearData.forEach(row => {
    const countryName = row[0];
    const waterAccess = Number(row[3]);
    waterAcessMap[countryName] = waterAccess;
  });
  const mapData = countries.map((feature) => {
    const countryName = feature.properties.name;
    return {
      feature: feature,
      value: waterAcessMap[countryName] || 0
    };
  });

  new Chart(document.getElementById("owidMap"), {
    type: "choropleth",
    data: { 
      labels: mapData.map(d => d.feature.properties.name),
      datasets: [{
        label: "Tillgång till rent vatten (%)",
        data: mapData
      }]
    },
    options: {  
      plugins: {
        title: {
          display: true,
          text: "Världskarta: Global tillgång till rent vatten år 2021(%)",
          font: {
            size: 16
          }
        },
        legend: {
          display: false 

        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              return (
                ctx.chart.data.labels[ctx.dataIndex] +
                ": " +
                ctx.raw.value.toFixed(1) + "%"
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
          quantize: 5,
          legend: {
            position: "bottom-right"
          }
        }
      }
    }
  });
} */