document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".wrapper"),
      searchInput = wrapper.querySelector("input"),
      loader = wrapper.querySelector(".loader"),
      wordElement = wrapper.querySelector(".word"),
      wordText = wordElement.querySelector("p"),
      phoneticsText = wordElement.querySelector("span"),
      volumeIcon = wordElement.querySelector("i"),
      meaningsContainer = wrapper.querySelector(".meanings"),
      synonymsElement = wrapper.querySelector(".synonyms"),
      synonymsList = synonymsElement.querySelector(".list"),
      clearBtn = wrapper.querySelector(".search span");
  
    let audio;
  
    function updateUI(result, word) {
      loader.style.display = "none";
  
      if (result.title) {
        wrapper.querySelector(".info-text").innerHTML =
          `Can't find the meaning of <span>"${word}"</span>. Try searching for another word.`;
        wordElement.classList.add("hidden");
        meaningsContainer.innerHTML = "";
        synonymsElement.classList.add("hidden");
      } else {
        const { meanings, phonetics } = result[0];
        const phoneticText = phonetics[0]?.text || "";
        const audioSrc = phonetics[0]?.audio || null;
  
        wordElement.classList.remove("hidden");
        wordText.textContent = result[0].word;
        phoneticsText.textContent = phoneticText;
  
        if (audioSrc) {
          audio = new Audio(audioSrc);
          volumeIcon.style.display = "inline-block";
        } else {
          audio = null;
          volumeIcon.style.display = "none";
        }
  
        // Display all meanings
        meaningsContainer.innerHTML = "<h3 class='text-lg font-semibold'>Meanings:</h3>";
        meanings.forEach((meaning, index) => {
          const partOfSpeech = meaning.partOfSpeech || "Unknown";
          const definitions = meaning.definitions.map(
            (def) => `<li class="text-gray-800">${def.definition}</li>`
          ).join("");
          meaningsContainer.innerHTML += `
            <div class="mt-3">
              <p class="font-medium text-blue-600">${index + 1}. (${partOfSpeech})</p>
              <ul class="list-disc ml-5">${definitions}</ul>
            </div>`;
        });
  
        // Display synonyms
        const synonyms = meanings.flatMap((meaning) => meaning.definitions.flatMap((def) => def.synonyms));
        if (synonyms.length > 0) {
          synonymsElement.classList.remove("hidden");
          synonymsList.innerHTML = "";
          [...new Set(synonyms)].slice(0, 10).forEach((synonym) => {
            const tag = `<span class="bg-blue-200 text-blue-800 rounded px-2 py-1 cursor-pointer hover:bg-blue-300">${synonym}</span>`;
            synonymsList.insertAdjacentHTML("beforeend", tag);
          });
        } else {
          synonymsElement.classList.add("hidden");
        }
      }
    }
  
    function fetchApi(word) {
      loader.style.display = "block";
      wrapper.querySelector(".info-text").innerHTML = `Searching for <span>"${word}"</span>...`;
  
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then((response) => response.json())
        .then((result) => updateUI(result, word))
        .catch(() => {
          loader.style.display = "none";
          wrapper.querySelector(".info-text").innerHTML = `Error finding <span>"${word}"</span>.`;
        });
    }
  
    searchInput.addEventListener("keyup", (e) => {
      const word = e.target.value.trim();
      if (e.key === "Enter" && word) {
        fetchApi(word);
      }
    });
  
    volumeIcon.addEventListener("click", () => {
      if (audio) {
        audio.play();
      }
    });
  
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      wrapper.querySelector(".info-text").innerHTML =
        "Type any existing word and press enter to get meaning, example, synonyms, etc.";
      wordElement.classList.add("hidden");
      meaningsContainer.innerHTML = "";
      synonymsElement.classList.add("hidden");
    });
  });
  