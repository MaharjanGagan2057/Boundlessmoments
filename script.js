function fetchUsers() {
fetch('http://localhost:3000')
.then(res => res.json())
.then(res => console.log(res))
}

fetchUsers()