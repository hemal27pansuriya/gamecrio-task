document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    // Listen for userCreated event
    socket.on('userCreated', (user) => {
        console.log('User created:', user);
        displayMessage('User created successfully!');
        addUserToList(user);
    });

    // Listen for userUpdated event
    socket.on('userUpdated', (user) => {
        console.log('User updated:', user);
        displayMessage('User updated successfully!');
        updateUserInList(user);
    });

    // Listen for userDeleted event
    socket.on('userDeleted', (userId) => {
        console.log('User deleted:', userId);
        displayMessage('User deleted successfully!');
        removeUserFromList(userId);
    });

    // Fetch all users when the page loads
    fetchUsers();

    // Handle form submission for creating or updating a user
    document.getElementById('userForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const age = document.getElementById('age').value;
        const userId = document.getElementById('userId').value;

        if (userId) {
            // Update user
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, age })
            });

            if (response.ok) {
                const { data: user } = await response.json();
                console.log('User updated:', user);
                // Update the user in the UI
                updateUserInList(user);
            } else {
                console.log('23e-0', response);
                alert('d');
            }
        } else {
            // Create user
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, age })
            });

            if (response.ok) {
                const { data: user } = await response.json();
                console.log('User created:', user);
                // Add the new user to the UI
                addUserToList(user);
            } else {
                alert('Error creating user');
            }
        }

        // Clear form
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';
    });

    // Fetch all users
    async function fetchUsers() {
        const response = await fetch('/api/users/list');
        const users = await response.json();
        if (users.data.users.length) users.data.users.forEach(user => addUserToList(user));
    }

    // Function to add user to list in the UI
    function addUserToList(user) {
        const userList = document.getElementById('userList');
        const listItem = document.createElement('li');
        listItem.id = `user-${user._id}`;
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
        <span>
          <strong>${user.name}</strong> (Email: ${user.email}, Age: ${user.age})
        </span>
        <span>
          <button class="btn btn-info btn-sm" onclick="editUser('${user._id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
        </span>
      `;
        userList.appendChild(listItem);
    }

    // Function to update user in the list in the UI
    function updateUserInList(user) {
        const listItem = document.getElementById(`user-${user._id}`);
        if (listItem) {
            listItem.innerHTML = `
          <span>
            <strong>${user.name}</strong> (Email: ${user.email}, Age: ${user.age})
          </span>
          <span>
            <button class="btn btn-info btn-sm" onclick="editUser('${user._id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
          </span>
        `;
        }
    }

    // Function to remove user from the list in the UI
    function removeUserFromList(userId) {
        const listItem = document.getElementById(`user-${userId}`);
        if (listItem) {
            listItem.remove();
        }
    }

    // Function to edit user
    window.editUser = async (userId) => {
        const response = await fetch(`/api/users/${userId}`);
        const { data: user } = await response.json();
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('age').value = user.age;
        document.getElementById('userId').value = user._id;
    };

    // Function to delete user
    window.deleteUser = async (userId) => {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('User deleted:', userId);
            // Remove the user from the UI
            removeUserFromList(userId);
        } else {
            alert('Error deleting user');
        }
    };

    function displayMessage(message) {
        const messageBox = document.getElementById('messageBox');
        messageBox.textContent = message;
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    }
});
