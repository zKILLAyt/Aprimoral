firebase.auth().onAuthStateChanged(user => {
  if (window.location.pathname.endsWith("index.html") && user) {
    window.location.href = "dashboard.html";
  }
  if (window.location.pathname.endsWith("dashboard.html") && !user) {
    window.location.href = "index.html";
  }
});

function login() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  firebase.auth().signInWithEmailAndPassword(email, senha)
    .catch(err => {
      document.getElementById('erroLogin').textContent = "Erro: " + err.message;
    });
}

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}
