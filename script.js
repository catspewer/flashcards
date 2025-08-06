let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [
    {
        front: "hello", back: "hallo"
    }
];
let currentIndex = 0;
let isFlipped = false;
const frontEl = document.getElementById("front-card");
const backEl = document.getElementById("back-card");
const cardInner = document.getElementById("card-inner");

function updateCard() {
    if (flashcards.length === 0) {
        frontEl.textContent = "No Cards!";
        backEl.textContent = "Please Add One!";
        cardInner.classList.remove("flipped");
        isFlipped = false;
        return;
    }

    frontEl.textContent = flashcards[currentIndex].front;
    backEl.textContent = flashcards[currentIndex].back;
    cardInner.classList.remove("flipped");
    isFlipped = false;
}
function flip() {
    isFlipped = !isFlipped;
    cardInner.classList.toggle("flipped", isFlipped);
}
function next() {
    if (flashcards.length === 0) return;
    currentIndex = (currentIndex + 1) % flashcards.length;
    updateCard();
    renderCardList();
}

function saveCards() {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

document.getElementById("add-card-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const front = document.getElementById("new-front").value.trim();
    const back = document.getElementById("new-back").value.trim();
    
    if (front && back) {
        flashcards.push({front, back});
        saveCards();
        currentIndex = flashcards.length - 1;

        updateCard();
        renderCardList();

        this.reset();
    }
});

document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowRight") {
    next();
  } else if (e.key === " ") {
    flip();
  }
});

document.getElementById("delete-button").addEventListener("click", deleteCard);
function deleteCard() {
    if (flashcards.length === 0) return;

    const deleteConfirm = confirm("Are you sure you want to delete this card?");
    if (!deleteConfirm) return;

    flashcards.splice(currentIndex, 1);

    if (currentIndex >= flashcards.length) {
        currentIndex = flashcards.length - 1;
    }
saveCards();
updateCard();
renderCardList();
}

flashcards = flashcards.sort(() => Math.random() - 0.5);

function renderCardList() {
    const listContainer = document.getElementById("card-list-container");
    listContainer.innerHTML = "";

    if (flashcards.length === 0) {
        listContainer.innerHTML = "<li>No Cards Yet!</li>"; return;
    }
        flashcards.forEach((card, index) => {
        const li = document.createElement("li");
        
        const frontText = document.createElement("span");
        frontText.textContent = `Front: "${card.front}"`;

        const backText = document.createElement("span");
        backText.textContent = ` | Back: "${card.back}"`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteCardFromList(index));

        li.innerHTML = `<strong>${index + 1}.</strong> `;
        li.appendChild(frontText);
        li.appendChild(backText);
        li.appendChild(deleteBtn);

        listContainer.appendChild(li);
    })

   
} 

function deleteCardFromList(index) {
    const confirmDelete = confirm("Delete this card?");
    if (!confirmDelete) return;

    flashcards.splice(index, 1);
    saveCards();
    if (currentIndex >= flashcards.length) {
        currentIndex = flashcards.length - 1;
    }
    updateCard();
    renderCardList();
}

updateCard();
renderCardList();