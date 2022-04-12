// Crear un evento que al hacer click en "Mostrar Grafico", nos rescate la informacion de la API
$("#btn-show").submit(async (event) => {
  event.preventDefault();
  const submt = getData();
  toggleHide("btn-hide");
  //   console.log("click en fommulario");
});

// Obtenemos la info de la API
const getData = async () => {
  fetch("http://localhost:3000/api/total")
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log(json);
    });
};

//Chart js
const ctx = document.getElementById("myChart");
const grafica = (data) => {
  filtro = data.filter((elements) => elements.deaths > 10000);
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
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
    },
  });
};
