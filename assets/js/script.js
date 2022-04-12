// Obtenemos la info de la API
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
// crea la tabla a partir de getData
const createTable = async () => {
  const table = document.getElementById("covidTable");
  const data = await getData();
  data.forEach((country) => {
    let row = document.createElement("tr");
    row.innerHTML = `<th scope="row">${
      country.location
    }</th><td>${country.confirmed.toLocaleString()}</td><td>${country.deaths.toLocaleString()}</td><td>${
      country.recovered
    }</td><td>${
      country.active
    }</td><td><button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#countryModal" data-bs-country="${
      country.location
    }">Ver detalles</button></td>`;
    table.appendChild(row);
  });
  table.classList.remove("d-none");
};
createTable();
