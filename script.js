const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)"); // returns a node list
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
const clearBtn = document.querySelector(".clear");
const submitBtn = document.querySelector(".submit");
const alert = document.querySelector(".alert");
const screen = document.querySelector(".screen");

let ticketPrice;

populateUI();

ticketPrice = +movieSelect.value; // ensures it returns as a number

// ------- Store Movie Data in LS -------
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}

// Show Alert
function showAlert(message, type) {
  let alert = document.querySelector(".alert");

  if (alert === null) {
    div = document.createElement("div");

    div.className = `alert ${type}`;
    div.textContent = message;

    container.insertBefore(div, screen);

    setTimeout(function () {
      div.remove();
    }, 3000);
  } else {
    alert.remove();

    div = document.createElement("div");

    div.className = `alert ${type}`;
    div.textContent = message;

    container.insertBefore(div, screen);

    setTimeout(function () {
      div.remove();
    }, 3000);
  }
}

// ------- Submit Occupied Seats --------
function submitOccupiedSeats() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  if (selectedSeats.length < 1) {
    showAlert("Please select one or more seats", "error");
  } else {
    selectedSeats.forEach((seat) => {
      seat.classList.remove("selected");
      seat.classList.add("occupied");
    });

    // -
    const occupiedSeats = document.querySelectorAll(".row .seat.occupied");

    // Set occupied seats to LS
    const occupiedSeatIndex = [...occupiedSeats].map((seat) =>
      [...seats].indexOf(seat)
    );

    localStorage.setItem("occupiedSeats", JSON.stringify(occupiedSeatIndex));

    updateSelectedCount();
    showAlert("Seats Booked!", "success");
  }
}

// --------- Update Seat Selection & Price count ----------
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  // SET TO LOCAL STORAGE
  //  Create an array of indices: Map through array, & return a new arr of indices:
  // Uses spread operator
  // const seatIndex = [...selectedSeats].map(function (seat) {
  //   return [...seats].indexOf(seat);
  // });
  const selectedSeatIndex = [...selectedSeats].map((seat) =>
    [...seats].indexOf(seat)
  );

  localStorage.setItem("selectedSeats", JSON.stringify(selectedSeatIndex));

  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  total.innerText = ticketPrice * selectedSeatsCount;
}

// -------------------- POPULATE UI --------------------
function populateUI() {
  // ****** Selected Seats ********
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

  // Tricky Bit... Checks array of all seats, then sees if the index of each one appears in the array of selectedSeats retrieved from LS. If not, value is -1..
  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }

  // const selectedMoviePrice = localStorage.getItem("selectedMoviePrice");

  // if (selectedMoviePrice !== null) {
  //   ticketPrice = selectedMoviePrice;
  // }

  // *********** Occupied Seats ********
  const occupiedSeats = JSON.parse(localStorage.getItem("occupiedSeats"));

  if (occupiedSeats !== null && occupiedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (occupiedSeats.indexOf(index) > -1) {
        seat.classList.add("occupied");
      }
    });
  }
}

//  -------------------- EVENT LISTENERS -------------------------
movieSelect.addEventListener("change", (e) => {
  ticketPrice = +e.target.value;

  setMovieData(e.target.selectedIndex, e.target.value);

  updateSelectedCount();
});

container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    let seat = e.target;
    seat.classList.toggle("selected");

    updateSelectedCount();
  }
});

clearBtn.addEventListener("click", (e) => {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  selectedSeats.forEach(function (selection) {
    selection.classList.remove("selected");
  });

  updateSelectedCount();
});

submitBtn.addEventListener("click", (e) => {
  submitOccupiedSeats();
});

updateSelectedCount();
