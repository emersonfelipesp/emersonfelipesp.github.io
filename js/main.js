// Espera o DOM ser carregado completamente
document.addEventListener("DOMContentLoaded", () => {
  // O carrossel Bootstrap é inicializado automaticamente

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

  // Inicializa o contador de ofertas
  initOfferCountdown()
})

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
  const monthYearDisplay = document.createElement("div")
  monthYearDisplay.className = "month-year-display"
  calendarContainer.insertBefore(monthYearDisplay, calendar)

  // Botões para navegar entre os meses
  const prevMonthBtn = document.createElement("button")
  prevMonthBtn.textContent = "< Mês Anterior"
  prevMonthBtn.className = "btn btn-sm"
  prevMonthBtn.setAttribute("aria-label", "Mês anterior")

  const nextMonthBtn = document.createElement("button")
  nextMonthBtn.textContent = "Próximo Mês >"
  nextMonthBtn.className = "btn btn-sm"
  nextMonthBtn.setAttribute("aria-label", "Próximo mês")

  const monthNavigation = document.createElement("div")
  monthNavigation.className = "month-navigation"
  monthNavigation.appendChild(prevMonthBtn)
  monthNavigation.appendChild(nextMonthBtn)
  calendarContainer.insertBefore(monthNavigation, calendar)

  // Data atual
  const currentDate = new Date()
  let currentMonth = currentDate.getMonth()
  let currentYear = currentDate.getFullYear()

  // Gera o calendário para o mês atual
  generateCalendar(currentMonth, currentYear)

  // Event listeners para os botões de navegação
  prevMonthBtn.addEventListener("click", () => {
    currentMonth--
    if (currentMonth < 0) {
      currentMonth = 11
      currentYear--
    }
    generateCalendar(currentMonth, currentYear)
  })

  nextMonthBtn.addEventListener("click", () => {
    currentMonth++
    if (currentMonth > 11) {
      currentMonth = 0
      currentYear++
    }
    generateCalendar(currentMonth, currentYear)
  })

  // Função para gerar o calendário
  function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Atualiza o display do mês e ano
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`

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
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          if (cellDate < today) {
            cell.classList.add("disabled")
            cell.setAttribute("aria-disabled", "true")
          } else {
            cell.setAttribute("tabindex", "0")
            cell.setAttribute("role", "button")
            cell.setAttribute("aria-label", `${date} de ${monthNames[month]} de ${year}`)

            cell.addEventListener("click", function () {
              selectDate(this, date, month, year)
            })

            // Suporte para navegação por teclado
            cell.addEventListener("keydown", function (e) {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                selectDate(this, date, month, year)
              }
            })
          }

          // Destaca a data atual
          if (
            date === currentDate.getDate() &&
            month === currentDate.getMonth() &&
            year === currentDate.getFullYear()
          ) {
            cell.classList.add("today")
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

  // Função para selecionar uma data
  function selectDate(cell, day, month, year) {
    // Remove a seleção anterior
    const selectedCells = calendar.querySelectorAll(".selected")
    selectedCells.forEach((cell) => cell.classList.remove("selected"))

    // Adiciona a seleção atual
    cell.classList.add("selected")

    // Atualiza o input oculto
    const selectedDate = new Date(year, month, day)
    selectedDateInput.value = selectedDate.toISOString().split("T")[0]

    // Feedback visual
    const feedbackElement = document.getElementById("date-feedback") || document.createElement("div")
    feedbackElement.id = "date-feedback"
    feedbackElement.className = "feedback-message"
    feedbackElement.textContent = `Data selecionada: ${day}/${month + 1}/${year}`

    if (!document.getElementById("date-feedback")) {
      calendarContainer.insertBefore(feedbackElement, timeSlots)
    }

    // Gera os horários disponíveis
    generateTimeSlots()
  }

  // Função para gerar os horários disponíveis
  function generateTimeSlots() {
    // Limpa os horários anteriores
    timeSlots.innerHTML = ""

    // Título para os horários
    const title = document.createElement("h4")
    title.textContent = "Horários Disponíveis"
    timeSlots.appendChild(title)

    // Horários disponíveis (das 8h às 18h, de hora em hora)
    for (let hour = 8; hour <= 18; hour++) {
      const slot = document.createElement("div")
      slot.classList.add("time-slot")
      slot.textContent = `${hour}:00`
      slot.setAttribute("tabindex", "0")
      slot.setAttribute("role", "button")
      slot.setAttribute("aria-label", `Horário ${hour} horas`)

      slot.addEventListener("click", function () {
        selectTimeSlot(this)
      })

      // Suporte para navegação por teclado
      slot.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          selectTimeSlot(this)
        }
      })

      timeSlots.appendChild(slot)
    }
  }

  // Função para selecionar um horário
  function selectTimeSlot(slot) {
    // Remove a seleção anterior
    const selectedSlots = timeSlots.querySelectorAll(".selected")
    selectedSlots.forEach((slot) => slot.classList.remove("selected"))

    // Adiciona a seleção atual
    slot.classList.add("selected")

    // Atualiza o input oculto
    selectedTimeInput.value = slot.textContent

    // Feedback visual
    const feedbackElement = document.getElementById("time-feedback") || document.createElement("div")
    feedbackElement.id = "time-feedback"
    feedbackElement.className = "feedback-message"
    feedbackElement.textContent = `Horário selecionado: ${slot.textContent}`

    if (!document.getElementById("time-feedback")) {
      timeSlots.appendChild(feedbackElement)
    } else {
      timeSlots.appendChild(feedbackElement)
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
    contrastBtn.addEventListener("click", function () {
      document.body.classList.toggle("high-contrast")

      // Atualiza o aria-pressed
      const isHighContrast = document.body.classList.contains("high-contrast")
      this.setAttribute("aria-pressed", isHighContrast)

      // Salva a preferência no localStorage
      localStorage.setItem("high-contrast", isHighContrast)

      // Anuncia a mudança para leitores de tela
      const announcement = document.getElementById("accessibility-announcement") || document.createElement("div")
      announcement.id = "accessibility-announcement"
      announcement.className = "sr-only"
      announcement.setAttribute("aria-live", "polite")
      announcement.textContent = isHighContrast ? "Modo de alto contraste ativado" : "Modo de alto contraste desativado"

      if (!document.getElementById("accessibility-announcement")) {
        document.body.appendChild(announcement)
      }
    })

    // Verifica se o usuário já tinha ativado o alto contraste anteriormente
    const savedContrast = localStorage.getItem("high-contrast")
    if (savedContrast === "true") {
      document.body.classList.add("high-contrast")
      contrastBtn.setAttribute("aria-pressed", "true")
    } else {
      contrastBtn.setAttribute("aria-pressed", "false")
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
        updateFontSize(currentFontSize)
      }
    })

    decreaseFontBtn.addEventListener("click", () => {
      if (currentFontSize > 70) {
        currentFontSize -= 10
        updateFontSize(currentFontSize)
      }
    })

    resetFontBtn.addEventListener("click", () => {
      currentFontSize = 100
      updateFontSize(currentFontSize)
    })

    // Função para atualizar o tamanho da fonte
    function updateFontSize(size) {
      document.body.style.fontSize = `${size}%`
      localStorage.setItem("font-size", size)

      // Anuncia a mudança para leitores de tela
      const announcement = document.getElementById("font-size-announcement") || document.createElement("div")
      announcement.id = "font-size-announcement"
      announcement.className = "sr-only"
      announcement.setAttribute("aria-live", "polite")
      announcement.textContent = `Tamanho da fonte alterado para ${size}%`

      if (!document.getElementById("font-size-announcement")) {
        document.body.appendChild(announcement)
      }
    }
  }

  // Adiciona skip link para navegação rápida
  const skipLink = document.createElement("a")
  skipLink.href = "#main-content"
  skipLink.className = "skip-link"
  skipLink.textContent = "Pular para o conteúdo principal"
  document.body.insertBefore(skipLink, document.body.firstChild)
}

/**
 * Inicializa a validação do formulário
 */
function initFormValidation() {
  const form = document.getElementById("cadastro-form")
  if (!form) return

  // Adiciona validação em tempo real para os campos
  const inputs = form.querySelectorAll("input, select, textarea")
  inputs.forEach((input) => {
    if (input.type !== "radio" && input.type !== "checkbox") {
      input.addEventListener("blur", function () {
        validateInput(this)
      })
    }
  })

  // Adiciona validação para os radio buttons
  const radioGroups = form.querySelectorAll(".radio-group")
  radioGroups.forEach((group) => {
    const radios = group.querySelectorAll('input[type="radio"]')
    radios.forEach((radio) => {
      radio.addEventListener("change", function () {
        validateRadioGroup(this.name)
      })
    })
  })

  form.addEventListener("submit", (event) => {
    // Impede o envio do formulário se houver erros
    if (!validateForm()) {
      event.preventDefault()

      // Foca no primeiro campo com erro
      const firstError = form.querySelector(".error-message")
      if (firstError) {
        const errorInput = firstError.closest(".form-group").querySelector("input, select, textarea")
        if (errorInput) {
          errorInput.focus()
        }
      }

      // Anuncia o erro para leitores de tela
      const announcement = document.getElementById("form-error-announcement") || document.createElement("div")
      announcement.id = "form-error-announcement"
      announcement.className = "sr-only"
      announcement.setAttribute("aria-live", "assertive")
      announcement.textContent = "Há erros no formulário. Por favor, corrija-os antes de enviar."

      if (!document.getElementById("form-error-announcement")) {
        form.appendChild(announcement)
      }
    } else {
      // Exibe uma mensagem de sucesso
      alert("Cadastro realizado com sucesso!")

      // Limpa o formulário
      form.reset()

      // Limpa as mensagens de feedback
      const feedbackMessages = document.querySelectorAll(".feedback-message")
      feedbackMessages.forEach((message) => message.remove())

      // Limpa as seleções do calendário
      const selectedCells = document.querySelectorAll(".calendar .selected, .time-slots .selected")
      selectedCells.forEach((cell) => cell.classList.remove("selected"))

      // Limpa os inputs ocultos
      document.getElementById("selected-date").value = ""
      document.getElementById("selected-time").value = ""
    }
  })

  // Função para validar um input específico
  function validateInput(input) {
    const name = input.name
    const value = input.value.trim()

    switch (name) {
      case "nome":
        if (!value) {
          showError(input, "Por favor, informe seu nome")
          return false
        }
        break

      case "cpf":
        if (!value || !validateCPF(value)) {
          showError(input, "Por favor, informe um CPF válido")
          return false
        }
        break

      case "email":
        if (!value || !validateEmail(value)) {
          showError(input, "Por favor, informe um e-mail válido")
          return false
        }
        break

      case "telefone":
        if (!value || !validatePhone(value)) {
          showError(input, "Por favor, informe um telefone válido")
          return false
        }
        break

      case "endereco":
        if (!value) {
          showError(input, "Por favor, informe seu endereço")
          return false
        }
        break
    }

    // Se chegou até aqui, o campo é válido
    clearError(input)
    return true
  }

  // Função para validar um grupo de radio buttons
  function validateRadioGroup(name) {
    const radios = form.querySelectorAll(`input[name="${name}"]`)
    const radioGroup = radios[0].closest(".radio-group")

    let isChecked = false
    radios.forEach((radio) => {
      if (radio.checked) {
        isChecked = true
      }
    })

    if (!isChecked) {
      showError(radioGroup, `Por favor, selecione uma opção`)
      return false
    }

    clearError(radioGroup)
    return true
  }

  // Função para validar todo o formulário
  function validateForm() {
    let isValid = true

    // Valida todos os inputs
    const inputs = form.querySelectorAll("input, select, textarea")
    inputs.forEach((input) => {
      if (input.type !== "radio" && input.type !== "checkbox" && input.type !== "hidden") {
        if (!validateInput(input)) {
          isValid = false
        }
      }
    })

    // Valida os radio buttons
    const radioGroups = new Set()
    form.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radioGroups.add(radio.name)
    })

    radioGroups.forEach((name) => {
      if (!validateRadioGroup(name)) {
        isValid = false
      }
    })

    // Valida a data e hora
    const selectedDate = document.getElementById("selected-date")
    const selectedTime = document.getElementById("selected-time")
    if (!selectedDate.value || !selectedTime.value) {
      showError(document.querySelector(".calendar-container"), "Por favor, selecione uma data e hora")
      isValid = false
    } else {
      clearError(document.querySelector(".calendar-container"))
    }

    // Valida os termos
    const termos = document.getElementById("termos")
    if (!termos.checked) {
      showError(termos.closest(".checkbox-item"), "Você precisa concordar com os termos e condições")
      isValid = false
    } else {
      clearError(termos.closest(".checkbox-item"))
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
    errorElement.setAttribute("role", "alert")

    if (!formGroup.querySelector(".error-message")) {
      formGroup.appendChild(errorElement)
    }

    if (input.tagName === "INPUT" || input.tagName === "SELECT" || input.tagName === "TEXTAREA") {
      input.style.borderColor = "red"
      input.setAttribute("aria-invalid", "true")
      input.setAttribute("aria-describedby", errorElement.id || `error-${input.name}`)

      if (!errorElement.id) {
        errorElement.id = `error-${input.name}`
      }
    }
  }

  // Função para limpar mensagem de erro
  function clearError(input) {
    const formGroup = input.closest(".form-group") || input
    const errorElement = formGroup.querySelector(".error-message")

    if (errorElement) {
      formGroup.removeChild(errorElement)
    }

    if (input.tagName === "INPUT" || input.tagName === "SELECT" || input.tagName === "TEXTAREA") {
      input.style.borderColor = ""
      input.removeAttribute("aria-invalid")
      input.removeAttribute("aria-describedby")
    }
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
        this.value = value.replace(/(\d{3})(\d{3})/, "$1.$2")
      } else if (value.length > 3) {
        this.value = value.replace(/(\d{3})/, "$1")
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

/**
 * Inicializa o contador regressivo para ofertas
 */
function initOfferCountdown() {
  const countdownElements = document.querySelectorAll(".offer-countdown")

  countdownElements.forEach((element) => {
    // Define um tempo aleatório para cada oferta (entre 1 e 24 horas)
    const hours = Math.floor(Math.random() * 24) + 1
    let totalSeconds = hours * 3600

    // Atualiza o contador a cada segundo
    const countdownInterval = setInterval(() => {
      totalSeconds--

      if (totalSeconds <= 0) {
        clearInterval(countdownInterval)
        element.textContent = "Oferta encerrada!"
        element.classList.add("offer-ended")
        return
      }

      const hoursLeft = Math.floor(totalSeconds / 3600)
      const minutesLeft = Math.floor((totalSeconds % 3600) / 60)
      const secondsLeft = totalSeconds % 60

      element.textContent = `Oferta termina em: ${String(hoursLeft).padStart(2, "0")}:${String(minutesLeft).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`
    }, 1000)
  })
}

