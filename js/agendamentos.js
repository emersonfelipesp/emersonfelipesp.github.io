/**
 * Sistema de gerenciamento de agendamentos
 * Permite salvar, visualizar, editar e excluir agendamentos
 */
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o sistema de agendamentos
  initAgendamentosSystem()
})

/**
 * Inicializa o sistema de agendamentos
 */
function initAgendamentosSystem() {
  // Verifica se o formulário de cadastro existe
  const cadastroForm = document.getElementById("cadastro-form")
  if (cadastroForm) {
    cadastroForm.addEventListener("submit", function (event) {
      // Se o formulário for válido, salva o agendamento
      if (validateForm()) {
        event.preventDefault()
        saveAgendamento()

        // Limpa o formulário
        this.reset()

        // Limpa as mensagens de feedback
        const feedbackMessages = document.querySelectorAll(".feedback-message")
        feedbackMessages.forEach((message) => message.remove())

        // Limpa as seleções do calendário
        const selectedCells = document.querySelectorAll(".calendar .selected, .time-slots .selected")
        selectedCells.forEach((cell) => cell.classList.remove("selected"))

        // Limpa os inputs ocultos
        document.getElementById("selected-date").value = ""
        document.getElementById("selected-time").value = ""

        // Exibe mensagem de sucesso
        alert("Agendamento realizado com sucesso!")

        // Redireciona para a seção de agendamentos
        window.location.href = "#meus-agendamentos"

        // Atualiza a lista de agendamentos
        loadAgendamentos()
      } else {
        event.preventDefault()
      }
    })
  }

  // Inicializa o modal de edição
  initEditModal()

  // Carrega os agendamentos salvos
  loadAgendamentos()
}

/**
 * Salva um novo agendamento no localStorage
 */
function saveAgendamento() {
  // Obtém os dados do formulário
  const nome = document.getElementById("nome").value
  const cpf = document.getElementById("cpf").value
  const email = document.getElementById("email").value
  const telefone = document.getElementById("telefone").value
  const endereco = document.getElementById("endereco").value
  const sexo = document.querySelector('input[name="sexo"]:checked')?.value || ""

  // Obtém as preferências de contato
  const contatoPrefs = []
  document.querySelectorAll('input[name="contato"]:checked').forEach((checkbox) => {
    contatoPrefs.push(checkbox.value)
  })

  // Obtém o serviço selecionado
  const servico = document.querySelector('input[name="servico"]:checked').value

  // Obtém a data e hora selecionadas
  const selectedDate = document.getElementById("selected-date").value
  const selectedTime = document.getElementById("selected-time").value

  // Obtém as observações
  const observacoes = document.getElementById("observacoes").value

  // Cria o objeto de agendamento
  const agendamento = {
    id: Date.now().toString(), // Usa o timestamp como ID único
    nome,
    cpf,
    email,
    telefone,
    endereco,
    sexo,
    contatoPrefs,
    servico,
    data: selectedDate,
    hora: selectedTime,
    observacoes,
    dataCriacao: new Date().toISOString(),
  }

  // Obtém os agendamentos existentes ou inicializa um array vazio
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos") || "[]")

  // Adiciona o novo agendamento
  agendamentos.push(agendamento)

  // Salva no localStorage
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos))
}

/**
 * Carrega os agendamentos salvos no localStorage
 */
function loadAgendamentos() {
  // Obtém o container de agendamentos
  const agendamentosCards = document.getElementById("agendamentos-cards")
  const agendamentosVazio = document.querySelector(".agendamentos-vazio")

  if (!agendamentosCards) return

  // Limpa o container
  agendamentosCards.innerHTML = ""

  // Obtém os agendamentos do localStorage
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos") || "[]")

  // Verifica se existem agendamentos
  if (agendamentos.length === 0) {
    if (agendamentosVazio) {
      agendamentosVazio.style.display = "block"
    }
    return
  }

  // Esconde a mensagem de vazio
  if (agendamentosVazio) {
    agendamentosVazio.style.display = "none"
  }

  // Ordena os agendamentos por data e hora
  agendamentos.sort((a, b) => {
    const dateA = new Date(`${a.data}T${a.hora}`)
    const dateB = new Date(`${b.data}T${b.hora}`)
    return dateA - dateB
  })

  // Cria um card para cada agendamento
  agendamentos.forEach((agendamento) => {
    const card = createAgendamentoCard(agendamento)
    agendamentosCards.appendChild(card)
  })
}

/**
 * Cria um card para exibir um agendamento
 */
function createAgendamentoCard(agendamento) {
  // Cria o elemento do card
  const card = document.createElement("div")
  card.className = "agendamento-card"
  card.dataset.id = agendamento.id

  // Formata a data para exibição
  const dataFormatada = formatDate(agendamento.data)

  // Define o tipo de serviço
  const tipoServico = agendamento.servico === "retirada" ? "Retirada no Local" : "Tele-Entrega"

  // Cria o conteúdo do card
  card.innerHTML = `
        <div class="agendamento-header">
            <div class="agendamento-title">Agendamento #${agendamento.id.slice(-4)}</div>
            <div class="agendamento-actions">
                <button class="btn-edit btn-sm" aria-label="Editar agendamento">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-delete btn-sm" aria-label="Excluir agendamento">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
        <div class="agendamento-info">
            <p><strong>Nome:</strong> ${agendamento.nome}</p>
            <p><strong>Serviço:</strong> ${tipoServico}</p>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Hora:</strong> ${agendamento.hora}</p>
            ${agendamento.observacoes ? `<p><strong>Observações:</strong> ${agendamento.observacoes}</p>` : ""}
        </div>
    `

  // Adiciona os event listeners para os botões
  const editBtn = card.querySelector(".btn-edit")
  const deleteBtn = card.querySelector(".btn-delete")

  editBtn.addEventListener("click", () => {
    openEditModal(agendamento)
  })

  deleteBtn.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      deleteAgendamento(agendamento.id)
    }
  })

  return card
}

/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
 */
function formatDate(dateString) {
  if (!dateString) return ""

  const parts = dateString.split("-")
  if (parts.length !== 3) return dateString

  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

/**
 * Inicializa o modal de edição
 */
function initEditModal() {
  const modal = document.getElementById("edit-modal")
  const closeBtn = document.querySelector(".close-modal")
  const cancelBtn = document.getElementById("cancel-edit")
  const editForm = document.getElementById("edit-form")

  if (!modal) return

  // Fecha o modal ao clicar no X
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none"
    })
  }

  // Fecha o modal ao clicar no botão Cancelar
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.style.display = "none"
    })
  }

  // Fecha o modal ao clicar fora dele
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  })

  // Processa o formulário de edição
  if (editForm) {
    editForm.addEventListener("submit", (event) => {
      event.preventDefault()
      updateAgendamento()
      modal.style.display = "none"
    })
  }
}

/**
 * Abre o modal de edição com os dados do agendamento
 */
function openEditModal(agendamento) {
  const modal = document.getElementById("edit-modal")
  if (!modal) return

  // Preenche os campos do formulário
  document.getElementById("edit-id").value = agendamento.id
  document.getElementById("edit-nome").value = agendamento.nome
  document.getElementById("edit-servico").value = agendamento.servico
  document.getElementById("edit-date").value = agendamento.data
  document.getElementById("edit-time").value = agendamento.hora
  document.getElementById("edit-observacoes").value = agendamento.observacoes || ""

  // Exibe o modal
  modal.style.display = "block"
}

/**
 * Atualiza um agendamento existente
 */
function updateAgendamento() {
  // Obtém os dados do formulário
  const id = document.getElementById("edit-id").value
  const nome = document.getElementById("edit-nome").value
  const servico = document.getElementById("edit-servico").value
  const data = document.getElementById("edit-date").value
  const hora = document.getElementById("edit-time").value
  const observacoes = document.getElementById("edit-observacoes").value

  // Obtém os agendamentos existentes
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos") || "[]")

  // Encontra o índice do agendamento a ser atualizado
  const index = agendamentos.findIndex((a) => a.id === id)

  if (index !== -1) {
    // Atualiza apenas os campos editáveis
    agendamentos[index].nome = nome
    agendamentos[index].servico = servico
    agendamentos[index].data = data
    agendamentos[index].hora = hora
    agendamentos[index].observacoes = observacoes

    // Salva no localStorage
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos))

    // Atualiza a lista de agendamentos
    loadAgendamentos()

    // Exibe mensagem de sucesso
    alert("Agendamento atualizado com sucesso!")
  }
}

/**
 * Exclui um agendamento
 */
function deleteAgendamento(id) {
  // Obtém os agendamentos existentes
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos") || "[]")

  // Filtra o agendamento a ser excluído
  const updatedAgendamentos = agendamentos.filter((a) => a.id !== id)

  // Salva no localStorage
  localStorage.setItem("agendamentos", JSON.stringify(updatedAgendamentos))

  // Atualiza a lista de agendamentos
  loadAgendamentos()

  // Exibe mensagem de sucesso
  alert("Agendamento excluído com sucesso!")
}

/**
 * Valida o formulário antes de salvar
 */
function validateForm() {
  const form = document.getElementById("cadastro-form")
  if (!form) return false

  let isValid = true

  // Valida os campos obrigatórios
  const requiredFields = form.querySelectorAll("[required]")
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false
      const formGroup = field.closest(".form-group")
      if (formGroup) {
        const errorElement = document.createElement("div")
        errorElement.className = "error-message"
        errorElement.style.color = "red"
        errorElement.textContent = "Este campo é obrigatório"
        formGroup.appendChild(errorElement)
      }
    }
  })

  // Valida a data e hora
  const selectedDate = document.getElementById("selected-date")
  const selectedTime = document.getElementById("selected-time")
  if (!selectedDate.value || !selectedTime.value) {
    isValid = false
    const calendarContainer = document.querySelector(".calendar-container")
    if (calendarContainer) {
      const errorElement = document.createElement("div")
      errorElement.className = "error-message"
      errorElement.style.color = "red"
      errorElement.textContent = "Por favor, selecione uma data e hora"
      calendarContainer.appendChild(errorElement)
    }
  }

  return isValid
}

