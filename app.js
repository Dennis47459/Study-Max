
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  // Mostrar mensagem inicial do StudyMax
  if (app) {
    app.innerHTML = `
      <section class="welcome">
        <h1>📚 StudyMax</h1>
        <p>O teu futuro começa com o conhecimento!</p>
        <p>Estuda, aprende e alcança os teus objetivos.</p>
      </section>

      <section class="study-menu">
        <h2>Área de estudos</h2>

        <button type="button" data-subject="Matemática">
          ➗ Matemática
        </button>

        <button type="button" data-subject="Português">
          📖 Português
        </button>

        <button type="button" data-subject="Ciências">
          🔬 Ciências
        </button>

        <button type="button" data-subject="Inglês">
          🌍 Inglês
        </button>

        <div id="study-message" aria-live="polite">
          Escolhe uma disciplina para começar.
        </div>
      </section>
    `;
  }

  // Responder quando o utilizador escolhe uma disciplina
  document.querySelectorAll("[data-subject]").forEach((button) => {
    button.addEventListener("click", () => {
      const subject = button.dataset.subject;
      const message = document.getElementById("study-message");

      if (message) {
        message.textContent =
          "Selecionaste " + subject + ". Está na hora de aprender!";
      }
    });
  });

  // Registar o Service Worker para permitir recursos PWA
  if ("serviceWorker" in navigator && window.location.protocol === "https:") {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => console.log("StudyMax: Service Worker ativo."))
      .catch((error) =>
        console.error("Erro ao registar o Service Worker:", error)
      );
  }
});
