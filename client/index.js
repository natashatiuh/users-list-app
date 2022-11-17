let photos = {}

let users = []

const domain = 'https://my-users-list-app.herokuapp.com'

const initUsers = async () => {
    const url = `${domain}/users/`
    const response = await fetch(url, { method: "GET" })
    users = await response.json()

    const container = document.getElementById("users-container")
    container.innerHTML = ''

    users.forEach(user => {
        const randomNumber = Math.floor(Math.random() * 99)
        const randomPhoto = `https://randomuser.me/api/portraits/men/${randomNumber}.jpg`
        if (!photos[user.userId]) photos[user.userId] = randomPhoto

        container.insertAdjacentHTML('beforeend', `
            <article class="leaderboard__profile">
                <img src="${photos[user.userId]}" alt="Mark Zuckerberg" class="leaderboard__picture">
                <span class="leaderboard__name">${user.userName}</span>
                <div class="user-btns">
                    <button onclick="createEditModal('${user.userId}', '${user.userName}')" class="btn"><i class="fa fa-edit"></i></button>
                    <button onclick="deleteUser('${user.userId}')" class="btn"><i class="fa fa-trash"></i></button>
                    <button onclick="createReorderModal('${user.userId}')" class="btn"><i class="fa fa-bars"></i></button>
                </div>
            </article>
        `)
    })
}

const deleteUser = async (userId) => {
    const url = `${domain}/users`
    await fetch(url, { 
        method: "DELETE", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId }) 
    })

    initUsers()
}

const createReorderModal = (userId) => {
    const options = users
        .filter(user => user.userId != userId)
        .map(user => `<option value="${user.userId}">${user.userName}</option>`)

    document.body.insertAdjacentHTML('beforeend', `
        <div id="reorderModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h1>Move user to be after:</h1>
                <select id="users-select" class="text-field">
                    ${options.join('\n')}
                </select>
                <button onclick="reorderUser('${userId}')" id="save-button" class="save-btn">Save</button>
            </div>
        </div>
    `)

    var modal = document.getElementById("reorderModal");
    var span = document.getElementsByClassName("close")[0];
    span.onclick = () => modal.remove();
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.remove()
        }
    }
}

const reorderUser = async (userIdToMove) => {
    const afterUserId = document.getElementById('users-select').value
    const url = `${domain}/users/reorder`
    await fetch(url, { 
        method: "PATCH", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ afterUserId, userIdToMove }) 
    })

    const modal = document.getElementById("reorderModal");
    modal.remove()

    initUsers()
}

const editUser = async (userId) => {
    const input = document.getElementById('edit-name')
    const newName = input.value

    const url = `${domain}/users`
    await fetch(url, { 
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, userName: newName }) 
    })

    const modal = document.getElementById("editModal");
    modal.remove()

    initUsers()
}

const addUser = async () => {
    const input = document.getElementById('add-name')
    const newName = input.value

    const url = `${domain}/users`
    await fetch(url, { 
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: newName }) 
    })

    const modal = document.getElementById("addModal");
    modal.remove()

    initUsers()
}

const createAddModal = () => {
    document.body.insertAdjacentHTML('beforeend', `
        <div id="addModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h1>Add user</h1>
                <input id="add-name" class="text-field" type="text">
                <button onclick="addUser()" id="save-button" class="save-btn">Save</button>
            </div>
        </div>
    `)

    var modal = document.getElementById("addModal");
    var span = document.getElementsByClassName("close")[0];
    span.onclick = () => modal.remove();
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.remove();
        }
    }
}

const createEditModal = (userId, currentName) => {
    document.body.insertAdjacentHTML('beforeend', `
        <div id="editModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h1>Edit user</h1>
                <input id="edit-name" class="text-field" type="text">
                <button onclick="editUser('${userId}')" id="save-button" class="save-btn">Save</button>
            </div>
        </div>
    `)

    let modal = document.getElementById("editModal");
    let span = document.getElementsByClassName("close")[0];
    span.onclick = () => modal.remove();
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.remove()
        }
    }

    const input = document.getElementById('edit-name')
    input.value = currentName
}

initUsers()
