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