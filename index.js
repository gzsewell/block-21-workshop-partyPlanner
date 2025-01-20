const COHORT = "2412-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
const form = document.querySelector("form");

// --Object--
const state = {
  party: [],
};

//fetch data from API. If the fetch is unsuccessful, The catch will through an error instead of crash.
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log("Fetched events:", json);
    state.parties = json.data;
  } catch (error) {
    console.log(error);
  }
}

//calls the POST endpoint method. POST allows information to be writen to the database.
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
  //DOM into the ul tag id events
  const eventElement = document.querySelector("#events");

  //if the information is unsuccesful, "No Events" will be added instead of crash
  if (!state.parties.length) {
    eventElement.innerHTML = "<li>No Events</li>";
    return;
  }
  //map the data into parties Object
  const eventCard = state.parties.map((event) => {
    //card is the <li> element that will have the data.
    const card = document.createElement("li");
    //innerHTML injects HTML elements and text to the element created.
    card.innerHTML = `
    <h2>${event.name}</h2>
    <time datetime="${event.date}">${event.date}</time>
    <address>${event.location}</address>
    <p>${event.description}</p>
    <button data-id="${event.id}">Delete Button</button> `;

    const deleteButton = card.querySelector("button");
    deleteButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = deleteButton.getAttribute("data-id");
      await deletePost(id);
    });

    return card;
  });

  //eventElement is the parent element, replace children of parent with eventCard.
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

async function deletePost(id) {
  console.log("Deleting event with ID:", id); // Log the ID
  try {
    const response = await fetch(API_URL + "/" + id, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete the event");
    }
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
