const auth = firebase.auth();

// Verifica se está na página de login ou dashboard
const estaNoLogin = window.location.pathname.includes("login.html");
const estaNoDashboard = window.location.pathname.includes("dashboard.html");

// Login
async function fazerLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    await auth.signInWithEmailAndPassword(email, senha);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Erro ao entrar: " + error.message);
  }
}

// Logout
function fazerLogout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

// Protege as rotas (não deixa entrar sem login)
auth.onAuthStateChanged((user) => {
  if (estaNoDashboard && !user) {
    window.location.href = "login.html";
  } else if (estaNoLogin && user) {
    window.location.href = "dashboard.html";
  }
});
