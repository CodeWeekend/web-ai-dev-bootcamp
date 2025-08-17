async function getJoke() {
    const display = document.getElementById("jokeDisplay");
    display.innerText = "Loading...";

    try {
        let response = await fetch("https://v2.jokeapi.dev/joke/Any?safe-mode&type=single")
        let data = await response.json();
        display.innerText = data.joke;
    } catch (error) {
        display.innerText = "Opps! something went wrong!"
        console.error("Error fetching joke:", error);
    }
}

document.getElementById("getJokeBtn").addEventListener("click", getJoke);

document.getElementById("saveJokeBtn").addEventListener("click", () => {
  let currentJoke = document.getElementById("jokeDisplay").innerText;

  // Don't save empty text
  if (!currentJoke || currentJoke === "Loading...") return;

  // Get existing jokes or create empty list
  let jokes = JSON.parse(localStorage.getItem("jokes")) || [];

  // ✅ Avoid duplicates
  if (!jokes.includes(currentJoke)) {
    jokes.push(currentJoke);
    localStorage.setItem("jokes", JSON.stringify(jokes));
    alert("✅ Joke saved!");
  } else {
    alert("⚠️ Joke already saved!");
  }
});

document.getElementById("showSavedBtn").addEventListener("click", () => {
  let jokes = JSON.parse(localStorage.getItem("jokes")) || [];
  let list = document.getElementById("savedJokes");
  list.innerHTML = ""; // Clear previous list

  jokes.forEach(joke => {
    let li = document.createElement("li");
    li.textContent = joke;
    list.appendChild(li);
  });
});
