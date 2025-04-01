/**
 * Script dedicado a recursos de acessibilidade
 */
document.addEventListener("DOMContentLoaded", () => {
  // Adiciona o leitor de tela simplificado
  initScreenReader()

  // Adiciona navegação por teclado
  initKeyboardNavigation()
})

/**
 * Inicializa um leitor de tela simplificado
 */
function initScreenReader() {
  // Verifica se a API de síntese de voz está disponível
  if ("speechSynthesis" in window) {
    // Adiciona botão de leitura a cada elemento importante
    const readableElements = document.querySelectorAll("h1, h2, h3, p, article")

    readableElements.forEach((element) => {
      const readButton = document.createElement("button")
      readButton.className = "read-aloud-btn"
      readButton.setAttribute("aria-label", "Ler em voz alta")
      readButton.innerHTML = '<span class="sr-only">Ler em voz alta</span>📢'
      readButton.style.fontSize = "0.8rem"
      readButton.style.padding = "0.25rem"
      readButton.style.marginLeft = "0.5rem"
      readButton.style.backgroundColor = "#4caf50"
      readButton.style.color = "white"
      readButton.style.border = "none"
      readButton.style.borderRadius = "4px"
      readButton.style.cursor = "pointer"

      readButton.addEventListener("click", () => {
        const text = element.textContent
        speak(text)
      })

      // Só adiciona o botão se o elemento for visível
      if (element.offsetParent !== null) {
        element.appendChild(readButton)
      }
    })

    // Função para ler o texto em voz alta
    function speak(text) {
      // Cancela qualquer fala anterior
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "pt-BR"
      window.speechSynthesis.speak(utterance)
    }
  }
}

/**
 * Inicializa a navegação por teclado
 */
function initKeyboardNavigation() {
  // Adiciona foco visível para todos os elementos interativos
  const interactiveElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )

  interactiveElements.forEach((element) => {
    element.addEventListener("focus", function () {
      this.style.outline = "3px solid #4caf50"
      this.style.outlineOffset = "2px"
    })

    element.addEventListener("blur", function () {
      this.style.outline = ""
      this.style.outlineOffset = ""
    })
  })

  // Adiciona atalhos de teclado
  document.addEventListener("keydown", (event) => {
    // Alt + 1-5 para navegar para as seções principais
    if (event.altKey && event.key >= "1" && event.key <= "5") {
      event.preventDefault()

      const sectionIndex = Number.parseInt(event.key) - 1
      const sections = [
        document.getElementById("frutas-e-verduras"),
        document.getElementById("produtos-alimenticios"),
        document.getElementById("produtos-de-higiene"),
        document.getElementById("servicos"),
        document.getElementById("contato"),
      ]

      if (sections[sectionIndex]) {
        sections[sectionIndex].scrollIntoView({ behavior: "smooth" })
        sections[sectionIndex].focus()
      }
    }

    // Alt + H para voltar ao topo (Home)
    if (event.altKey && event.key === "h") {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
      document.querySelector("header h1").focus()
    }
  })
}

