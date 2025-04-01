// Espera o DOM ser carregado completamente
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o carrossel
  initCarousel()

  // Inicializa o calendário
  initCalendar()

  // Inicializa os recursos de acessibilidade
  initAccessibility()

  // Inicializa a validação do formulário
  initFormValidation()

  // Animação de entrada para os produtos
  animateProducts()

  // Exibe a hora atual
  updateClock()
  setInterval(updateClock, 1000)
})

/**
 * Inicializa o carrossel de promoções
 */
function initCarousel() {
  const carousel = document.querySelector(".carousel")
  if (!carousel) return

  const carouselInner = carousel.querySelector(".carousel-inner")
  const items = carousel.querySelectorAll(".carousel-item")
  const prevBtn = carousel.querySelector(".carousel-control.prev")
  const nextBtn = carousel.querySelector(".carousel-control.next")

  let currentIndex = 0
  const itemCount = items.length

  // Configura o autoplay
  let autoplayInterval = setInterval(nextSlide, 5000)

  // Função para mostrar o slide atual
  function showSlide(index) {
    carouselInner.style.transform = `translateX(-${index * 100}%)`
  }

  // Função para ir para o próximo slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % itemCount
    showSlide(currentIndex)
  }

  // Função para ir para o slide anterior
  function prevSlide() {
    currentIndex = (currentIndex - 1 + itemCount) % itemCount
    showSlide(currentIndex)
  }

  // Adiciona os event listeners para os botões
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      clearInterval(autoplayInterval)
      prevSlide()
      autoplayInterval = setInterval(nextSlide, 5000)
    })

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      clearInterval(autoplayInterval)
      nextSlide()
      autoplayInterval = setInterval(nextSlide, 5000)
    })

  // Pausa o autoplay quando o mouse está sobre o carrossel
  carousel.addEventListener("mouseenter", () => {
    clearInterval(autoplayInterval)
  })

  // Retoma o autoplay quando o mouse sai do carrossel
  carousel.addEventListener("mouseleave", () => {
    autoplayInterval = setInterval(nextSlide, 5000)
  })
}

/**
 * Inicializa o calendário para agendamento
 */
function initCalendar() {
  const calendarContainer = document.querySelector(".calendar-container")
  if (!calendarContainer) return

  const calendar = calendarContainer.querySelector(".calendar")
  const timeSlots = calendarContainer.querySelector(".time-slots")
  const selectedDateInput = document.getElementById("selected-date")
  const selectedTimeInput = document.getElementById("selected-time")

  // Data atual
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Gera o calendário para o mês atual
  generateCalendar(currentMonth, currentYear)

  // Função para gerar o calendário
  function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Limpa o calendário
    calendar.innerHTML = ""

    // Cria o cabeçalho
    const headerRow = document.createElement("tr")
    ;["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].forEach((day) => {
      const th = document.createElement("th")
      th.textContent = day
      headerRow.appendChild(th)
    })
    calendar.appendChild(headerRow)

    // Cria as células do calendário
    let date = 1
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr")

      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("td")

        if (i === 0 && j < firstDay) {
          // Células vazias antes do primeiro dia do mês
          cell.textContent = ""
        } else if (date > daysInMonth) {
          // Células vazias após o último dia do mês
          cell.textContent = ""
        } else {
          // Dias do mês
          cell.textContent = date

          // Verifica se é uma data passada
          const cellDate = new Date(year, month, date)
          if (cellDate < new Date(currentDate.setHours(0, 0, 0, 0))) {
            cell.classList.add("disabled")
          } else {
            cell.addEventListener("click", function () {
              // Remove a seleção anterior
              const selectedCells = calendar.querySelectorAll(".selected")
              selectedCells.forEach((cell) => cell.classList.remove("selected"))

              // Adiciona a seleção atual
              this.classList.add("selected")

              // Atualiza o input oculto
              const selectedDate = new Date(year, month, Number.parseInt(this.textContent))
              selectedDateInput.value = selectedDate.toISOString().split("T")[0]

              // Gera os horários disponíveis
              generateTimeSlots()
            })
          }
        }

        row.appendChild(cell)
        date++
      }

      calendar.appendChild(row)

      // Para se já passou do último dia do mês
      if (date > daysInMonth) break
    }
  }

  // Função para gerar os horários disponíveis
  function generateTimeSlots() {
    // Limpa os horários anteriores
    timeSlots.innerHTML = ""

    // Horários disponíveis (das 8h às 18h, de hora em hora)
    for (let hour = 8; hour <= 18; hour++) {
      const slot = document.createElement("div")
      slot.classList.add("time-slot")
      slot.textContent = `${hour}:00`

      slot.addEventListener("click", function () {
        // Remove a seleção anterior
        const selectedSlots = timeSlots.querySelectorAll(".selected")
        selectedSlots.forEach((slot) => slot.classList.remove("selected"))

        // Adiciona a seleção atual
        this.classList.add("selected")

        // Atualiza o input oculto
        selectedTimeInput.value = this.textContent
      })

      timeSlots.appendChild(slot)
    }
  }
}

/**
 * Inicializa os recursos de acessibilidade
 */
function initAccessibility() {
  // Botão de alto contraste
  const contrastBtn = document.getElementById("contrast-toggle")
  if (contrastBtn) {
    contrastBtn.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast")

      // Salva a preferência no localStorage
      const isHighContrast = document.body.classList.contains("high-contrast")
      localStorage.setItem("high-contrast", isHighContrast)
    })

    // Verifica se o usuário já tinha ativado o alto contraste anteriormente
    const savedContrast = localStorage.getItem("high-contrast")
    if (savedContrast === "true") {
      document.body.classList.add("high-contrast")
    }
  }

  // Controles de tamanho da fonte
  const increaseFontBtn = document.getElementById("increase-font")
  const decreaseFontBtn = document.getElementById("decrease-font")
  const resetFontBtn = document.getElementById("reset-font")

  if (increaseFontBtn && decreaseFontBtn && resetFontBtn) {
    // Tamanho da fonte padrão em porcentagem
    let currentFontSize = 100

    // Verifica se o usuário já tinha ajustado o tamanho da fonte anteriormente
    const savedFontSize = localStorage.getItem("font-size")
    if (savedFontSize) {
      currentFontSize = Number.parseInt(savedFontSize)
      document.body.style.fontSize = `${currentFontSize}%`
    }

    increaseFontBtn.addEventListener("click", () => {
      if (currentFontSize < 150) {
        currentFontSize += 10
        document.body.style.fontSize = `${currentFontSize}%`
        localStorage.setItem("font-size", currentFontSize)
      }
    })

    decreaseFontBtn.addEventListener("click", () => {
      if (currentFontSize > 70) {
        currentFontSize -= 10
        document.body.style.fontSize = `${currentFontSize}%`
        localStorage.setItem("font-size", currentFontSize)
      }
    })

    resetFontBtn.addEventListener("click", () => {
      currentFontSize = 100
      document.body.style.fontSize = `${currentFontSize}%`
      localStorage.setItem("font-size", currentFontSize)
    })
  }
}

/**
 * Inicializa a validação do formulário
 */
function initFormValidation() {
  const form = document.getElementById("cadastro-form")
  if (!form) return

  form.addEventListener("submit", (event) => {
    // Impede o envio do formulário se houver erros
    if (!validateForm()) {
      event.preventDefault()
    } else {
      // Exibe uma mensagem de sucesso
      alert("Cadastro realizado com sucesso!")
    }
  })

  // Função para validar o formulário
  function validateForm() {
    let isValid = true

    // Validação do nome
    const nome = document.getElementById("nome")
    if (!nome.value.trim()) {
      showError(nome, "Por favor, informe seu nome")
      isValid = false
    } else {
      clearError(nome)
    }

    // Validação do CPF
    const cpf = document.getElementById("cpf")
    if (!cpf.value.trim() || !validateCPF(cpf.value)) {
      showError(cpf, "Por favor, informe um CPF válido")
      isValid = false
    } else {
      clearError(cpf)
    }

    // Validação do e-mail
    const email = document.getElementById("email")
    if (!email.value.trim() || !validateEmail(email.value)) {
      showError(email, "Por favor, informe um e-mail válido")
      isValid = false
    } else {
      clearError(email)
    }

    // Validação do telefone
    const telefone = document.getElementById("telefone")
    if (!telefone.value.trim() || !validatePhone(telefone.value)) {
      showError(telefone, "Por favor, informe um telefone válido")
      isValid = false
    } else {
      clearError(telefone)
    }

    // Validação do endereço
    const endereco = document.getElementById("endereco")
    if (!endereco.value.trim()) {
      showError(endereco, "Por favor, informe seu endereço")
      isValid = false
    } else {
      clearError(endereco)
    }

    // Validação do serviço
    const servico = document.querySelector('input[name="servico"]:checked')
    if (!servico) {
      showError(document.querySelector(".radio-group"), "Por favor, selecione um serviço")
      isValid = false
    } else {
      clearError(document.querySelector(".radio-group"))
    }

    // Validação da data e hora
    const selectedDate = document.getElementById("selected-date")
    const selectedTime = document.getElementById("selected-time")
    if (!selectedDate.value || !selectedTime.value) {
      showError(document.querySelector(".calendar-container"), "Por favor, selecione uma data e hora")
      isValid = false
    } else {
      clearError(document.querySelector(".calendar-container"))
    }

    return isValid
  }

  // Função para exibir mensagem de erro
  function showError(input, message) {
    const formGroup = input.closest(".form-group") || input
    const errorElement = formGroup.querySelector(".error-message") || document.createElement("div")

    errorElement.className = "error-message"
    errorElement.style.color = "red"
    errorElement.style.fontSize = "0.875rem"
    errorElement.style.marginTop = "0.25rem"
    errorElement.textContent = message

    if (!formGroup.querySelector(".error-message")) {
      formGroup.appendChild(errorElement)
    }

    input.style.borderColor = "red"
  }

  // Função para limpar mensagem de erro
  function clearError(input) {
    const formGroup = input.closest(".form-group") || input
    const errorElement = formGroup.querySelector(".error-message")

    if (errorElement) {
      formGroup.removeChild(errorElement)
    }

    input.style.borderColor = ""
  }

  // Função para validar CPF
  function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, "")

    if (cpf.length !== 11) return false

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false

    // Validação do primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
    }

    let remainder = sum % 11
    const digit1 = remainder < 2 ? 0 : 11 - remainder

    if (Number.parseInt(cpf.charAt(9)) !== digit1) return false

    // Validação do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
    }

    remainder = sum % 11
    const digit2 = remainder < 2 ? 0 : 11 - remainder

    return Number.parseInt(cpf.charAt(10)) === digit2
  }

  // Função para validar e-mail
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Função para validar telefone
  function validatePhone(phone) {
    phone = phone.replace(/[^\d]/g, "")
    return phone.length >= 10 && phone.length <= 11
  }

  // Máscaras para os campos
  const cpfInput = document.getElementById("cpf")
  if (cpfInput) {
    cpfInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "")
      if (value.length > 11) value = value.slice(0, 11)

      if (value.length > 9) {
        this.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      } else if (value.length > 6) {
        this.value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3")
      } else if (value.length > 3) {
        this.value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2")
      } else {
        this.value = value
      }
    })
  }

  const telefoneInput = document.getElementById("telefone")
  if (telefoneInput) {
    telefoneInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "")
      if (value.length > 11) value = value.slice(0, 11)

      if (value.length > 10) {
        this.value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      } else if (value.length > 6) {
        this.value = value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3")
      } else if (value.length > 2) {
        this.value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
      } else {
        this.value = value
      }
    })
  }
}

/**
 * Anima os produtos com efeito de entrada
 */
function animateProducts() {
  const articles = document.querySelectorAll("article")

  // Adiciona a classe de animação com um atraso progressivo
  articles.forEach((article, index) => {
    setTimeout(() => {
      article.classList.add("slide-in")
    }, index * 100)
  })
}

/**
 * Atualiza o relógio em tempo real
 */
function updateClock() {
  const clockElement = document.getElementById("clock")
  if (!clockElement) return

  const now = new Date()
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")

  clockElement.textContent = `${hours}:${minutes}:${seconds}`
}

