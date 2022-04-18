// Le agrega funcionalidad a boton Enviar en inicio de sesión
$("#js-login").submit(async (event) => {
  event.preventDefault();
  const email = document.getElementById("correoElectronico").value;
  const password = document.getElementById("contrasena").value;
  const JWT = await postData(email, password);
  toggle();
  window.location.reload();
});

let paginaActual = 1;

// Obtener token
const postData = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      body: JSON.stringify({ email: email, password, password }),
    });
    const { token } = await response.json();
    // guarda el token en localStorage
    localStorage.setItem("jwt-token", token);
    return token;
  } catch (error) {
    localStorage.clear();
    console.error(`Error: ${error}`);
  }
};

document.getElementById("logout").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

// Oculta el formulario inicial, y muestra el feed
const toggle = () => {
  $(`#navbarNavDropdown ul li:nth-child(2)`).toggle();
  $(`#chart-wrapper`).toggle();
  $(`#table-wrapper`).toggle();
  document.getElementById(`situacion-chile`).classList.remove("d-none");
  document.getElementById(`logout`).classList.remove("d-none");
};

//Chart js
const getData = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/total`);
    const { data } = await response.json();
    if (data) {
      return data;
    }
  } catch (error) {
    localStorage.clear();
    console.error(`Error: ${error}`);
  }
};

const graficoBarras = async () => {
  const ctx = document.getElementById("myChart");
  const data = await getData();
  const filtro = data.filter((element) => element.deaths > 100000);
  const paises = filtro.map((elemento) => elemento.location);
  const casos = filtro.map((elemento) => elemento.confirmed);
  const muertos = filtro.map((elemento) => elemento.deaths);
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: paises,
      datasets: [
        {
          label: "Confirmados",
          data: casos,
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
        {
          label: "muertos",
          data: muertos,
          backgroundColor: ["rgba(75, 192, 192, 0.2)"],
          borderColor: ["rgb(75, 192, 192)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Situacion mundial - COVID19",
          font: {
            size: 36,
          },
        },
        subtitle: {
          display: true,
          text: "Paises con mas de 100,000 muertes",
          font: {
            size: 24,
          },
        },
      },
    },
  });
};
graficoBarras();
// Obtenemos la info de la API

// crea la tabla a partir de getData
const createTable = async () => {
  const table = document.getElementById("covidTable");
  table.innerHTML = "";
  const data = await paginacion(paginaActual);
  if (data) {
    data.forEach((country) => {
      let row = document.createElement("tr");
      row.innerHTML = `<th scope="row">${
        country.location
      }</th><td>${country.confirmed.toLocaleString()}</td><td>${country.deaths.toLocaleString()}</td><td>${
        country.recovered
      }</td><td>${
        country.active
      }</td><td><button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#countryModal" data-country="${
        country.location
      }">Ver detalles</button></td>`;
      table.appendChild(row);
    });
    table.classList.remove("d-none");
  }
};
createTable();

// obtiene la informacion del endpoint /countries/$country
const getDataCountry = async (country) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/countries/${country}`
    );
    const { data } = await response.json();
    if (data) {
      return data;
    }
  } catch (error) {
    localStorage.clear();
    console.error(`Error: ${error}`);
  }
};

// Muestra el modal detallando la info de cada pais y lo actualiza con la info de getDataCountry
$("#countryModal").on("show.bs.modal", (event) => {
  const button = event.relatedTarget;
  const country = button.getAttribute("data-country");
  const countryModal = document.getElementById("countryModal");
  const countryData = async () => {
    const modalTitle = countryModal.querySelector(".modal-title");
    const modalBody = countryModal.querySelector(".modal-body");
    const data = await getDataCountry(country);
    modalTitle.textContent = "Situacion COVID en " + data.location;
    modalBody.innerHTML = `<ul>
    <li>Casos confirmados: ${data.confirmed.toLocaleString()}</li>
    <li>Muertes: ${data.deaths.toLocaleString()}</li>
    <li>Casos activos: ${data.active.toLocaleString()}</li>
    <li>Recuperados: ${data.recovered.toLocaleString()}</li>
    </ul>`;
  };
  countryData();
});

async function paginacion(pagina) {
  const dataPaginacion = await getData();
  let dataPaginaActual;
  if (pagina === 1) {
    dataPaginaActual = dataPaginacion.slice(pagina - 1, pagina * 10);
  } else {
    dataPaginaActual = dataPaginacion.slice((pagina - 1) * 10, pagina * 10);
  }
  return dataPaginaActual;
}

function paginasTotales() {
  return getData().then((data) => Math.ceil(data.length / 10));
}

$(document).ready(() => {
  paginasTotales().then((res) => {
    $("#paginasTotales").text(res);
  });
});

$("#prevPage").on("click", (e) => {
  e.preventDefault();
  if (paginaActual > 1) {
    paginaActual--;
    createTable();
    $("#contadorPagina").text(paginaActual);
  }
});
$("#nextPage").on("click", (e) => {
  e.preventDefault();
  paginaActual++;
  createTable();
  $("#contadorPagina").text(paginaActual);
});

const getDataEndpoint = async (endpoint) => {
  try {
    const jwt = localStorage.getItem("jwt-token");
    const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const { data } = await response.json();
    if (data) {
      return data;
    }
  } catch (error) {
    localStorage.clear();
    console.error(`Error: ${error}`);
  }
};

(() => {
  const token = localStorage.getItem("jwt-token");
  if (token) {
    toggle();
  }
})();

// Agregar función a botón Situación Chile
$("#myChartL").hide();
$("#situacion-chile").click(() => {
  $("#myChartL").show();
});

const graficoLinea = async () => {
  const ctx = document.getElementById("myChartL");
  const data = await getData();
  const filtro = data.filter((element) => element.deaths > 100000);
  const paises = filtro.map((elemento) => elemento.location);
  const casos = filtro.map((elemento) => elemento.confirmed);
  const muertos = filtro.map((elemento) => elemento.deaths);
  const myChartL = new Chart(ctx, {
    type: "bar",
    data: {
      labels: paises,
      datasets: [
        {
          label: "Confirmados",
          data: casos,
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
        {
          label: "muertos",
          data: muertos,
          backgroundColor: ["rgba(75, 192, 192, 0.2)"],
          borderColor: ["rgb(75, 192, 192)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Situacion mundial - COVID19",
          font: {
            size: 36,
          },
        },
        subtitle: {
          display: true,
          text: "Paises con mas de 100,000 muertes",
          font: {
            size: 24,
          },
        },
      },
    },
  });
};
graficoLinea();
