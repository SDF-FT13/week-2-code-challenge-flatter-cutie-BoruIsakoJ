// Your code here
const charNamesBar = document.getElementById("character-bar")
const charDisplayer = document.getElementById("detailed-info")

function displayCharacterNames() {
    fetch("http://localhost:3000/characters")
        .then(resp => resp.json())
        .then(characters => {
            characters.forEach(character => {
                const spanEl = document.createElement('span')
                spanEl.innerText = character.name
                spanEl.addEventListener('click', function () {
                    charDisplayer.innerHTML = `
                        <p id="name">${character.name}</p>
                        <img
                        id="image"
                        src="${character.image}"
                        alt="${character.name}"
                        />
                        <h4>Total Votes: <span id="vote-count">${character.votes}</span></h4>
                        <form id="votes-form">
                            <input type="text" placeholder="Enter Votes" id="votes" name="votes"/>
                            <input type="submit" value="Add Votes"/>   
                        </form>
                        <button id="reset-btn">Reset Votes</button>
                `
                    updateVotes(character)
                    resetVotes(character)
                })
                charNamesBar.appendChild(spanEl)
            });
        })
}

function updateVotes(character) {
    const formEl = document.getElementById("votes-form")
    const votesInput = document.getElementById("votes")

    formEl.addEventListener('submit', function (e) {
        e.preventDefault()
        const newVotes = Number(votesInput.value)
        character.votes += newVotes
        fetch(`http://localhost:3000/characters/${character.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ votes: character.votes })
        })
            .then(resp => resp.json())
            .then(updatedCharacter => {
                document.getElementById("vote-count").innerText = updatedCharacter.votes
            })
        votesInput.value = ""
    })
}

function resetVotes(character) {
    const resetBtn = document.getElementById("reset-btn")
    resetBtn.addEventListener('click', function () {
        fetch(`http://localhost:3000/characters/${character.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ votes: 0 })
        })
            .then(resp => resp.json())
            .then(updatedCharacter => {
                document.getElementById("vote-count").innerText = updatedCharacter.votes
                character.votes = updatedCharacter.votes
            })
    })
}
displayCharacterNames()