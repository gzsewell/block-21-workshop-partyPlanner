const COHORT = "2412-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
const form = document.querySelector("form");

// --Object--
const state = {
  party: [],
};

//fetch data from API
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.log(error);
  }
}

//calls the POST method
async function addEvent(parties) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parties),
    });
    const json = await response.json();
    if (json.error) {
      throw new Error(json.error.message);
    }
  } catch (error) {
    console.error(error);
  }
}

//parses the data that is given to the input boxes
async function renderEvents() {
  const eventElement = document.querySelector("#events");

  if (!state.parties.length) {
    eventElement.innerHTML = "<li>No Events.</li>";
    return;
  }

  const eventCard = state.parties.map((event) => {
    const card = document.createElement("li");
    card.innerHTML = `<h2>${event.name}</h2> <h3>${event.date}</h3> <h3>${event.location}<p>${event.description}</p> <button>Delete Button</button> `;

    return card;
  });
  const button = document.querySelector("#delete-button");
  button.addEventListener("click", async () => {
    await deletePost(response.id);
  });
  eventElement.replaceChildren(...eventCard);
}
//makes sure that getEvents runs before any data is accepted to the POST
async function render() {
  await getEvents();
  renderEvents();
}

render(); //deploys getEvents and renderEvents

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const event = {
    name: form.eventName.value,
    description: form.description.value,
    date: form.date.value,
    location: form.location.value,
  };

  await addEvent(event);
  render();
});

// --DELETE SECECTION--

async function deletePost() {
  try {
    const response = await fetch(API_URL + "/" + id, {
      method: "DELETE",
    });
  } catch (e) {
    console.error(e);
  }
  await getEvents();
  renderEvents();
}

// function remove(id){
//   fetch(API_URL + "/" + id, {
//     method: 'DELETE'
//   }).then(() => {
//      console.log('removed');
//   }).catch(err => {
//     console.error(err)
//   });

// state.party.map((party) => {
//   const liTag = document.createElement("li");
//   liTag.innerHTML = `<h2>${party.name}</h2> <time>${party.date}</time> <address>${party.location}</address> <p>${party.description} </p> <button>Delete Party</button>`;
// });
