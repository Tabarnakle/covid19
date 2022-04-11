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
