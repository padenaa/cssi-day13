let googleUser;
window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      const googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
};

const renderData = (data) => {
    const destination = document.querySelector('#app');
    destination.innerHTML = "";
    for (let key in data) {
        const note = data[key];
        destination.innerHTML += createCard(note, key);
    }
};

const createCard = (note, key) => {
    return `<div class="column is-one-quarter">
                <div class="card"> 
                    <header class="card-header"> 
                        <p class="card-header-title"> 
                            ${note.title} 
                        </p> 
                    </header> 
                    <div class="card-content"> 
                        <div class="content">
                            ${note.text} 
                        </div>
                    </div>
                    <footer class="card footer">
                        <a href="#" class="card-footer-item" onclick = "deleteNote('${key}')">
                            Delete
                        </a>
                        <a href="#" class="card-footer-item" onclick = "editNote('${key}')">
                            Edit
                        </a>
                    </footer>
                </div>
            </div>`;
};

const deleteNote = (key) => {
    console.log("delete");
    const noteToDelete = firebase.database().ref(`users/${googleUser.uid}/${key}`);
    noteToDelete.remove();
}

const editNote = (noteId) =>{
    console.log("edit");
    const noteToEditRef = firebase.database().ref(`users/${googleUser.uid}/${noteId}`);
    noteToEditRef.on('value', (snapshot) =>{
        const note = snapshot.val();
        const EditNoteModal = document.querySelector("#EditNoteModal");
        const titleModal = document.querySelector("#title");
        const textModal = document.querySelector("#text");
        titleModal.value = note.title;
        textModal.value = note.text;
        

        EditNoteModal.classList.add("is-active");
    });
}

const closeModal = () =>{
    const editNoteModal = document.querySelector("#EditNoteModal");
    editNoteModal.classList.remove("is-active");
}


const saveEdit = () =>{
    
}