// Adicionando tipos e funções para gerenciar perfil de usuário, verificação em duas etapas e avaliações

// Tipos atualizados
export interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
  tipo: "paciente" | "clinica"
  dataCadastro: string
  fotoPerfil?: string
  verificacaoDuasEtapas?: boolean
  telefoneVerificacao?: string
  ultimoAcesso?: string
  ativo: boolean // Novo campo para controlar se a conta está ativa
  localizacao?: {
    latitude: number
    longitude: number
    ultimaAtualizacao: string
  }
}

export interface Clinica {
  id: string
  nome: string
  email: string
  especialidades: string[]
  endereco: string
  bairro: string
  telefone: string
  whatsapp: string
  horario: string
  descricao: string
  avaliacao: number
  imagem: string
  ativo: boolean // Novo campo para controlar se a clínica está ativa
  localizacao?: {
    latitude: number
    longitude: number
  }
}

export interface Paciente {
  id: string
  nome: string
  email: string
  telefone: string
  dataNascimento: string
  genero?: string
  endereco?: string
  bairro?: string
  convenioMedico?: string
  numeroConvenio?: string
  ativo: boolean // Novo campo para controlar se o paciente está ativo
}

export interface Avaliacao {
  id: string
  clinicaId: string
  usuarioId: string
  usuarioNome: string
  nota: number
  comentario: string
  data: string
  resposta?: {
    texto: string
    data: string
  }
}

// Funções auxiliares
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Função para salvar dados no localStorage de forma persistente
const saveToStorage = (key: string, data: any) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(data))

    // Também salvar um backup com timestamp para recuperação
    const backup = {
      data,
      timestamp: new Date().toISOString(),
      version: "1.0",
    }
    localStorage.setItem(`${key}_backup`, JSON.stringify(backup))
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error)
  }
}

// Função para carregar dados do localStorage
const loadFromStorage = (key: string, defaultValue: any = []) => {
  if (typeof window === "undefined") return defaultValue

  try {
    const data = localStorage.getItem(key)
    if (data) {
      return JSON.parse(data)
    }

    // Tentar carregar do backup se o principal falhar
    const backup = localStorage.getItem(`${key}_backup`)
    if (backup) {
      const backupData = JSON.parse(backup)
      return backupData.data || defaultValue
    }

    return defaultValue
  } catch (error) {
    console.error(`Erro ao carregar ${key}:`, error)
    return defaultValue
  }
}

// Inicialização do "banco de dados"
const initializeStorage = () => {
  if (typeof window === "undefined") return

  // Verificar se já existe dados, se não, criar dados iniciais
  const usuarios = loadFromStorage("usuarios", [])
  const clinicas = loadFromStorage("clinicas", [])
  const pacientes = loadFromStorage("pacientes", [])
  const mensagens = loadFromStorage("mensagens", [])
  const codigosVerificacao = loadFromStorage("codigosVerificacao", {})
  const avaliacoes = loadFromStorage("avaliacoes", [])

  // Se não há clínicas, criar dados de exemplo com foco em Águas Claras
  if (clinicas.length === 0) {
    const clinicasIniciais = [
      {
        id: "1",
        nome: "Clínica Águas Claras Saúde",
        email: "contato@aguasclarassaude.com",
        especialidades: ["Clínico Geral", "Cardiologia", "Pediatria"],
        endereco: "Rua 25 Norte, Lote 2/4 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 99808-0577",
        whatsapp: "(61) 99808-0577",
        horario: "Seg-Sex: 7h às 19h, Sáb: 8h às 14h",
        descricao:
          "Clínica moderna em Águas Claras com atendimento médico de qualidade. Contamos com profissionais especializados e equipamentos de última geração.",
        avaliacao: 4.8,
        imagem: "/fachada-noite.jpg",
        ativo: true,
        localizacao: {
          latitude: -15.8347,
          longitude: -48.0434,
        },
      },
      {
        id: "2",
        nome: "Centro Médico Águas Claras",
        email: "contato@cmaguasclaras.com",
        especialidades: ["Ortopedia", "Fisioterapia", "Nutrição"],
        endereco: "Avenida das Araucárias, 4.700 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 98484-3332",
        whatsapp: "(61) 98484-3332",
        horario: "Seg-Sáb: 6h às 20h",
        descricao:
          "Centro médico especializado em ortopedia e reabilitação. Nossa equipe multidisciplinar oferece tratamentos completos para sua recuperação.",
        avaliacao: 4.6,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8367,
          longitude: -48.0454,
        },
      },
      {
        id: "3",
        nome: "Dra. Marina Silva - Dermatologia",
        email: "dra.marina@dermaaguasclaras.com",
        especialidades: ["Dermatologia"],
        endereco: "Rua 7 Norte, Lote 5 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1003",
        whatsapp: "(61) 99999-1003",
        horario: "Seg-Sex: 8h às 18h",
        descricao:
          "Dermatologista especializada em tratamentos estéticos e clínicos. Atendimento personalizado em consultório moderno.",
        avaliacao: 4.9,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8327,
          longitude: -48.0414,
        },
      },
      {
        id: "4",
        nome: "Clínica Psicológica Bem Viver",
        email: "contato@bemviver.com",
        especialidades: ["Psicologia", "Psiquiatria"],
        endereco: "Rua 12 Norte, Lote 10 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1004",
        whatsapp: "(61) 99999-1004",
        horario: "Seg-Sex: 7h às 21h, Sáb: 8h às 16h",
        descricao:
          "Clínica especializada em saúde mental com equipe multidisciplinar. Oferecemos terapia individual, familiar e de casal.",
        avaliacao: 4.7,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8357,
          longitude: -48.0444,
        },
      },
      {
        id: "5",
        nome: "Dr. Carlos Mendes - Cardiologia",
        email: "dr.carlos@cardioaguasclaras.com",
        especialidades: ["Cardiologia"],
        endereco: "Avenida Castanheiras, 3.200 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1005",
        whatsapp: "(61) 99999-1005",
        horario: "Seg-Sex: 8h às 17h",
        descricao:
          "Cardiologista com mais de 15 anos de experiência. Especialista em prevenção e tratamento de doenças cardiovasculares.",
        avaliacao: 4.8,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8337,
          longitude: -48.0424,
        },
      },
      {
        id: "6",
        nome: "Clínica Pediátrica Criança Feliz",
        email: "contato@criancafeliz.com",
        especialidades: ["Pediatria"],
        endereco: "Rua 3 Norte, Lote 8 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1006",
        whatsapp: "(61) 99999-1006",
        horario: "Seg-Sex: 7h às 19h, Sáb: 8h às 12h",
        descricao:
          "Clínica pediátrica especializada no cuidado infantil. Ambiente acolhedor e profissionais especializados em pediatria.",
        avaliacao: 4.9,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8317,
          longitude: -48.0404,
        },
      },
      {
        id: "7",
        nome: "Centro de Ginecologia e Obstetrícia",
        email: "contato@ginecologiaac.com",
        especialidades: ["Ginecologia"],
        endereco: "Rua 15 Norte, Lote 12 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1007",
        whatsapp: "(61) 99999-1007",
        horario: "Seg-Sex: 8h às 18h, Sáb: 8h às 14h",
        descricao:
          "Centro especializado em saúde da mulher. Oferecemos consultas, exames e acompanhamento pré-natal completo.",
        avaliacao: 4.7,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8377,
          longitude: -48.0464,
        },
      },
      {
        id: "8",
        nome: "Clínica Odontológica Sorriso Perfeito",
        email: "contato@sorrisoperfeito.com",
        especialidades: ["Odontologia"],
        endereco: "Avenida das Palmeiras, 1.500 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1008",
        whatsapp: "(61) 99999-1008",
        horario: "Seg-Sex: 8h às 20h, Sáb: 8h às 16h",
        descricao:
          "Clínica odontológica completa com tratamentos estéticos e preventivos. Equipamentos modernos e profissionais qualificados.",
        avaliacao: 4.6,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8387,
          longitude: -48.0474,
        },
      },
      {
        id: "9",
        nome: "Dr. Roberto Lima - Neurologia",
        email: "dr.roberto@neuroaguasclaras.com",
        especialidades: ["Neurologia"],
        endereco: "Rua 20 Norte, Lote 15 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1009",
        whatsapp: "(61) 99999-1009",
        horario: "Seg-Qui: 8h às 17h, Sex: 8h às 16h",
        descricao:
          "Neurologista especialista em doenças do sistema nervoso. Atendimento especializado com equipamentos de diagnóstico avançados.",
        avaliacao: 4.8,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8307,
          longitude: -48.0394,
        },
      },
      {
        id: "10",
        nome: "Clínica de Fisioterapia MoviMais",
        email: "contato@movimais.com",
        especialidades: ["Fisioterapia"],
        endereco: "Rua 8 Norte, Lote 20 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1010",
        whatsapp: "(61) 99999-1010",
        horario: "Seg-Sex: 6h às 20h, Sáb: 7h às 15h",
        descricao:
          "Centro de fisioterapia com equipamentos modernos. Especializada em reabilitação ortopédica, neurológica e esportiva.",
        avaliacao: 4.7,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8397,
          longitude: -48.0484,
        },
      },
      {
        id: "11",
        nome: "Dra. Ana Paula - Endocrinologia",
        email: "dra.anapaula@endocrinoac.com",
        especialidades: ["Endocrinologia"],
        endereco: "Avenida Sibipiruna, 2.800 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1011",
        whatsapp: "(61) 99999-1011",
        horario: "Seg-Sex: 8h às 18h",
        descricao:
          "Endocrinologista especializada em diabetes, tireoide e obesidade. Tratamento personalizado e acompanhamento nutricional.",
        avaliacao: 4.9,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8297,
          longitude: -48.0384,
        },
      },
      {
        id: "12",
        nome: "Centro de Oftalmologia Visão Clara",
        email: "contato@visaoclara.com",
        especialidades: ["Oftalmologia"],
        endereco: "Rua 18 Norte, Lote 25 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1012",
        whatsapp: "(61) 99999-1012",
        horario: "Seg-Sex: 7h às 19h, Sáb: 8h às 14h",
        descricao:
          "Centro oftalmológico completo com cirurgias e exames especializados. Equipamentos de última geração para cuidar da sua visão.",
        avaliacao: 4.8,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8407,
          longitude: -48.0494,
        },
      },
      {
        id: "13",
        nome: "Dr. Fernando Santos - Urologia",
        email: "dr.fernando@urologiaac.com",
        especialidades: ["Urologia"],
        endereco: "Rua 22 Norte, Lote 30 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1013",
        whatsapp: "(61) 99999-1013",
        horario: "Seg-Qui: 8h às 17h, Sex: 8h às 15h",
        descricao:
          "Urologista com especialização em cirurgias minimamente invasivas. Atendimento especializado em saúde masculina e feminina.",
        avaliacao: 4.7,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8287,
          longitude: -48.0374,
        },
      },
      {
        id: "14",
        nome: "Clínica de Nutrição Vida Saudável",
        email: "contato@vidasaudavel.com",
        especialidades: ["Nutrição"],
        endereco: "Avenida das Paineiras, 3.500 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1014",
        whatsapp: "(61) 99999-1014",
        horario: "Seg-Sex: 7h às 20h, Sáb: 8h às 16h",
        descricao:
          "Clínica de nutrição especializada em reeducação alimentar. Planos personalizados para emagrecimento e ganho de massa muscular.",
        avaliacao: 4.6,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8417,
          longitude: -48.0504,
        },
      },
      {
        id: "15",
        nome: "Centro Médico Integrado Águas Claras",
        email: "contato@cmiaguasclaras.com",
        especialidades: ["Clínico Geral", "Cardiologia", "Ortopedia", "Pediatria"],
        endereco: "Rua 30 Norte, Lote 35 - Águas Claras, Brasília-DF",
        bairro: "Águas Claras",
        telefone: "(61) 3333-1015",
        whatsapp: "(61) 99999-1015",
        horario: "Seg-Dom: 24h",
        descricao:
          "Centro médico com atendimento 24 horas. Pronto atendimento, consultas especializadas e exames laboratoriais no mesmo local.",
        avaliacao: 4.8,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8277,
          longitude: -48.0364,
        },
      },
      // Clínicas originais em outras regiões para diversidade
      {
        id: "16",
        nome: "Clínica Saúde Total",
        email: "contato@saudetotal.com",
        especialidades: ["Clínico Geral", "Cardiologia", "Pediatria"],
        endereco: "SGAS 915 - Asa Sul, Brasília-DF",
        bairro: "Asa Sul",
        telefone: "(61) 99999-9999",
        whatsapp: "(61) 99999-9999",
        horario: "Seg-Sex: 8h às 19h",
        descricao:
          "A Clínica Saúde Total oferece atendimento médico de qualidade há mais de 15 anos. Contamos com uma equipe de profissionais especializados e equipamentos modernos para cuidar da sua saúde.",
        avaliacao: 4.8,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8132,
          longitude: -47.9121,
        },
      },
      {
        id: "17",
        nome: "Centro Médico Bem Estar",
        email: "contato@bemestar.com",
        especialidades: ["Ortopedia", "Fisioterapia", "Nutrição"],
        endereco: "CLN 208 Bloco D - Asa Norte, Brasília-DF",
        bairro: "Asa Norte",
        telefone: "(61) 88888-8888",
        whatsapp: "(61) 88888-8888",
        horario: "Seg-Sáb: 7h às 20h",
        descricao:
          "O Centro Médico Bem Estar é especializado em tratamentos ortopédicos e reabilitação. Nossa equipe multidisciplinar trabalha para proporcionar o melhor tratamento para sua recuperação.",
        avaliacao: 4.5,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.7732,
          longitude: -47.8821,
        },
      },
      {
        id: "18",
        nome: "Dra. Ana Oliveira",
        email: "dra.ana@gmail.com",
        especialidades: ["Dermatologia"],
        endereco: "SHLS 716 - Asa Sul, Brasília-DF",
        bairro: "Asa Sul",
        telefone: "(61) 77777-7777",
        whatsapp: "(61) 77777-7777",
        horario: "Seg-Sex: 9h às 18h",
        descricao: "Atendimento dermatológico especializado com foco em tratamentos estéticos e clínicos.",
        avaliacao: 4.9,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.8232,
          longitude: -47.9221,
        },
      },
      {
        id: "19",
        nome: "Instituto de Saúde Mental",
        email: "contato@ism.com",
        especialidades: ["Psicologia", "Psiquiatria"],
        endereco: "SCRN 708/709 - Asa Norte, Brasília-DF",
        bairro: "Asa Norte",
        telefone: "(61) 66666-6666",
        whatsapp: "(61) 66666-6666",
        horario: "Seg-Sex: 8h às 20h",
        descricao:
          "Instituto especializado em saúde mental com equipe multidisciplinar para atendimento psicológico e psiquiátrico.",
        avaliacao: 4.7,
        imagem: "/placeholder.svg?height=300&width=600",
        ativo: true,
        localizacao: {
          latitude: -15.7632,
          longitude: -47.8721,
        },
      },
    ]

    saveToStorage("clinicas", clinicasIniciais)
  }

  // Salvar dados iniciais se não existirem
  if (usuarios.length === 0) saveToStorage("usuarios", [])
  if (pacientes.length === 0) saveToStorage("pacientes", [])
  if (mensagens.length === 0) saveToStorage("mensagens", [])
  if (Object.keys(codigosVerificacao).length === 0) saveToStorage("codigosVerificacao", {})
  if (avaliacoes.length === 0) saveToStorage("avaliacoes", [])
}

// Funções de usuários
export const cadastrarUsuario = (usuario: Omit<Usuario, "id" | "dataCadastro" | "ativo">): Usuario => {
  if (typeof window === "undefined") return {} as Usuario

  initializeStorage()

  const usuarios = loadFromStorage("usuarios", [])

  // Verificar se o email já existe
  const emailExiste = usuarios.some((u: Usuario) => u.email === usuario.email && u.ativo)
  if (emailExiste) {
    throw new Error("Email já cadastrado")
  }

  const novoUsuario: Usuario = {
    ...usuario,
    id: generateId(),
    dataCadastro: new Date().toISOString(),
    verificacaoDuasEtapas: false,
    ativo: true,
  }

  usuarios.push(novoUsuario)
  saveToStorage("usuarios", usuarios)

  return novoUsuario
}

export const loginUsuario = (email: string, senha: string): Usuario => {
  if (typeof window === "undefined") return {} as Usuario

  initializeStorage()

  const usuarios = loadFromStorage("usuarios", [])
  const usuario = usuarios.find((u: Usuario) => u.email === email && u.senha === senha && u.ativo)

  if (!usuario) {
    throw new Error("Email ou senha incorretos")
  }

  // Atualizar último acesso
  const usuariosAtualizados = usuarios.map((u: Usuario) => {
    if (u.id === usuario.id) {
      return {
        ...u,
        ultimoAcesso: new Date().toISOString(),
      }
    }
    return u
  })

  saveToStorage("usuarios", usuariosAtualizados)

  return usuario
}

export const getUsuarioById = (id: string): Usuario | null => {
  if (typeof window === "undefined") return null

  initializeStorage()

  const usuarios = loadFromStorage("usuarios", [])
  return usuarios.find((u: Usuario) => u.id === id && u.ativo) || null
}

export const atualizarUsuario = (id: string, dadosAtualizados: Partial<Usuario>): Usuario => {
  if (typeof window === "undefined") return {} as Usuario

  initializeStorage()

  const usuarios = loadFromStorage("usuarios", [])

  // Verificar se o usuário existe
  const usuarioIndex = usuarios.findIndex((u: Usuario) => u.id === id && u.ativo)
  if (usuarioIndex === -1) {
    throw new Error("Usuário não encontrado")
  }

  // Verificar se está tentando mudar o email para um que já existe
  if (dadosAtualizados.email && dadosAtualizados.email !== usuarios[usuarioIndex].email) {
    const emailExiste = usuarios.some(
      (u: Usuario, index: number) => index !== usuarioIndex && u.email === dadosAtualizados.email && u.ativo,
    )
    if (emailExiste) {
      throw new Error("Email já está em uso")
    }
  }

  // Atualizar dados
  const usuarioAtualizado = {
    ...usuarios[usuarioIndex],
    ...dadosAtualizados,
  }

  usuarios[usuarioIndex] = usuarioAtualizado
  saveToStorage("usuarios", usuarios)

  return usuarioAtualizado
}

export const excluirUsuario = (id: string): boolean => {
  if (typeof window === "undefined") return false

  try {
    const usuarios = loadFromStorage("usuarios", [])
    const usuarioIndex = usuarios.findIndex((u: Usuario) => u.id === id)

    if (usuarioIndex === -1) return false

    // Marcar como inativo ao invés de excluir
    usuarios[usuarioIndex].ativo = false
    saveToStorage("usuarios", usuarios)

    // Também desativar dados relacionados
    const pacientes = loadFromStorage("pacientes", [])
    const pacienteIndex = pacientes.findIndex((p: Paciente) => p.email === usuarios[usuarioIndex].email)
    if (pacienteIndex !== -1) {
      pacientes[pacienteIndex].ativo = false
      saveToStorage("pacientes", pacientes)
    }

    return true
  } catch (error) {
    return false
  }
}

export const atualizarLocalizacaoUsuario = (id: string, latitude: number, longitude: number): boolean => {
  if (typeof window === "undefined") return false

  try {
    const usuario = getUsuarioById(id)
    if (!usuario) return false

    atualizarUsuario(id, {
      localizacao: {
        latitude,
        longitude,
        ultimaAtualizacao: new Date().toISOString(),
      },
    })

    return true
  } catch (error) {
    return false
  }
}

// Funções para verificação em duas etapas
export const gerarCodigoVerificacao = (usuarioId: string): string => {
  if (typeof window === "undefined") return ""

  initializeStorage()

  // Gerar código de 6 dígitos
  const codigo = Math.floor(100000 + Math.random() * 900000).toString()

  // Salvar código com timestamp
  const codigos = loadFromStorage("codigosVerificacao", {})
  codigos[usuarioId] = {
    codigo,
    timestamp: Date.now(),
    tentativas: 0,
  }

  saveToStorage("codigosVerificacao", codigos)

  return codigo
}

export const verificarCodigo = (usuarioId: string, codigo: string): boolean => {
  if (typeof window === "undefined") return false

  initializeStorage()

  const codigos = loadFromStorage("codigosVerificacao", {})
  const verificacao = codigos[usuarioId]

  // Verificar se existe código para este usuário
  if (!verificacao) return false

  // Verificar se o código expirou (10 minutos)
  const agora = Date.now()
  if (agora - verificacao.timestamp > 10 * 60 * 1000) {
    delete codigos[usuarioId]
    saveToStorage("codigosVerificacao", codigos)
    return false
  }

  // Incrementar tentativas
  verificacao.tentativas += 1

  // Verificar se excedeu tentativas (máximo 3)
  if (verificacao.tentativas > 3) {
    delete codigos[usuarioId]
    saveToStorage("codigosVerificacao", codigos)
    return false
  }

  // Verificar código
  if (verificacao.codigo === codigo) {
    delete codigos[usuarioId]
    saveToStorage("codigosVerificacao", codigos)
    return true
  }

  // Atualizar tentativas
  codigos[usuarioId] = verificacao
  saveToStorage("codigosVerificacao", codigos)

  return false
}

export const ativarVerificacaoDuasEtapas = (usuarioId: string, telefone: string): boolean => {
  if (typeof window === "undefined") return false

  try {
    const usuario = getUsuarioById(usuarioId)
    if (!usuario) return false

    atualizarUsuario(usuarioId, {
      verificacaoDuasEtapas: true,
      telefoneVerificacao: telefone,
    })

    return true
  } catch (error) {
    return false
  }
}

export const desativarVerificacaoDuasEtapas = (usuarioId: string): boolean => {
  if (typeof window === "undefined") return false

  try {
    const usuario = getUsuarioById(usuarioId)
    if (!usuario) return false

    atualizarUsuario(usuarioId, {
      verificacaoDuasEtapas: false,
      telefoneVerificacao: undefined,
    })

    return true
  } catch (error) {
    return false
  }
}

// Funções de clínicas
export const cadastrarClinica = (clinica: Omit<Clinica, "id" | "avaliacao" | "ativo">): Clinica => {
  if (typeof window === "undefined") return {} as Clinica

  initializeStorage()

  const clinicas = loadFromStorage("clinicas", [])

  const novaClinica: Clinica = {
    ...clinica,
    id: generateId(),
    avaliacao: 0,
    ativo: true,
  }

  clinicas.push(novaClinica)
  saveToStorage("clinicas", clinicas)

  return novaClinica
}

export const getClinicas = (): Clinica[] => {
  if (typeof window === "undefined") return []

  initializeStorage()

  const clinicas = loadFromStorage("clinicas", [])
  return clinicas.filter((c: Clinica) => c.ativo)
}

export const getClinicaById = (id: string): Clinica | null => {
  if (typeof window === "undefined") return null

  initializeStorage()

  const clinicas = loadFromStorage("clinicas", [])
  return clinicas.find((c: Clinica) => c.id === id && c.ativo) || null
}

export const getClinicasByEspecialidade = (especialidade: string): Clinica[] => {
  if (typeof window === "undefined") return []

  initializeStorage()

  const clinicas = loadFromStorage("clinicas", [])
  const clinicasAtivas = clinicas.filter((c: Clinica) => c.ativo)

  if (especialidade === "Todas") {
    return clinicasAtivas
  }

  return clinicasAtivas.filter((c: Clinica) => c.especialidades.includes(especialidade))
}

export const getClinicasByBairro = (bairro: string): Clinica[] => {
  if (typeof window === "undefined") return []

  initializeStorage()

  const clinicas = loadFromStorage("clinicas", [])
  const clinicasAtivas = clinicas.filter((c: Clinica) => c.ativo)

  if (bairro === "Todos") {
    return clinicasAtivas
  }

  return clinicasAtivas.filter((c: Clinica) => c.bairro === bairro)
}

export const getClinicasByLocalizacao = (latitude: number, longitude: number, raioKm = 10): Clinica[] => {
  if (typeof window === "undefined") return []

  initializeStorage()

  const clinicas = loadFromStorage("clinicas", [])
  const clinicasAtivas = clinicas.filter((c: Clinica) => c.ativo)

  // Filtrar clínicas que têm localização definida
  const clinicasComLocalizacao = clinicasAtivas.filter((c: Clinica) => c.localizacao)

  // Calcular distância entre dois pontos usando a fórmula de Haversine
  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c
    return d
  }

  // Filtrar clínicas dentro do raio especificado
  return clinicasComLocalizacao.filter((c: Clinica) => {
    const distancia = calcularDistancia(latitude, longitude, c.localizacao!.latitude, c.localizacao!.longitude)
    return distancia <= raioKm
  })
}

export const atualizarClinica = (id: string, dadosAtualizados: Partial<Clinica>): Clinica => {
  if (typeof window === "undefined") return {} as Clinica

  initializeStorage()

  const clinicas = loadFromStorage("clinicas", [])

  // Verificar se a clínica existe
  const clinicaIndex = clinicas.findIndex((c: Clinica) => c.id === id && c.ativo)
  if (clinicaIndex === -1) {
    throw new Error("Clínica não encontrada")
  }

  // Atualizar dados
  const clinicaAtualizada = {
    ...clinicas[clinicaIndex],
    ...dadosAtualizados,
  }

  clinicas[clinicaIndex] = clinicaAtualizada
  saveToStorage("clinicas", clinicas)

  return clinicaAtualizada
}

export const excluirClinica = (id: string): boolean => {
  if (typeof window === "undefined") return false

  try {
    const clinicas = loadFromStorage("clinicas", [])
    const clinicaIndex = clinicas.findIndex((c: Clinica) => c.id === id)

    if (clinicaIndex === -1) return false

    // Marcar como inativo ao invés de excluir
    clinicas[clinicaIndex].ativo = false
    saveToStorage("clinicas", clinicas)

    return true
  } catch (error) {
    return false
  }
}

// Funções de pacientes
export const cadastrarPaciente = (paciente: Omit<Paciente, "id" | "ativo">): Paciente => {
  if (typeof window === "undefined") return {} as Paciente

  initializeStorage()

  const pacientes = loadFromStorage("pacientes", [])

  const novoPaciente: Paciente = {
    ...paciente,
    id: generateId(),
    ativo: true,
  }

  pacientes.push(novoPaciente)
  saveToStorage("pacientes", pacientes)

  return novoPaciente
}

export const getPacienteByEmail = (email: string): Paciente | null => {
  if (typeof window === "undefined") return null

  initializeStorage()

  const pacientes = loadFromStorage("pacientes", [])
  return pacientes.find((p: Paciente) => p.email === email && p.ativo) || null
}

export const atualizarPaciente = (email: string, dadosAtualizados: Partial<Paciente>): Paciente => {
  if (typeof window === "undefined") return {} as Paciente

  initializeStorage()

  const pacientes = loadFromStorage("pacientes", [])

  // Encontrar o paciente pelo email
  const pacienteIndex = pacientes.findIndex((p: Paciente) => p.email === email && p.ativo)
  if (pacienteIndex === -1) {
    throw new Error("Paciente não encontrado")
  }

  // Atualizar dados
  const pacienteAtualizado = {
    ...pacientes[pacienteIndex],
    ...dadosAtualizados,
  }

  pacientes[pacienteIndex] = pacienteAtualizado
  saveToStorage("pacientes", pacientes)

  return pacienteAtualizado
}

// Funções para avaliações
export const adicionarAvaliacao = (avaliacao: Omit<Avaliacao, "id" | "data">): Avaliacao => {
  if (typeof window === "undefined") return {} as Avaliacao

  initializeStorage()

  const avaliacoes = loadFromStorage("avaliacoes", [])

  // Verificar se o usuário já avaliou esta clínica
  const avaliacaoExistente = avaliacoes.find(
    (a: Avaliacao) => a.clinicaId === avaliacao.clinicaId && a.usuarioId === avaliacao.usuarioId,
  )

  if (avaliacaoExistente) {
    throw new Error("Você já avaliou esta clínica. Edite sua avaliação existente.")
  }

  const novaAvaliacao: Avaliacao = {
    ...avaliacao,
    id: generateId(),
    data: new Date().toISOString(),
  }

  avaliacoes.push(novaAvaliacao)
  saveToStorage("avaliacoes", avaliacoes)

  // Atualizar a média de avaliações da clínica
  atualizarMediaAvaliacaoClinica(avaliacao.clinicaId)

  return novaAvaliacao
}

export const editarAvaliacao = (id: string, dadosAtualizados: Partial<Avaliacao>): Avaliacao => {
  if (typeof window === "undefined") return {} as Avaliacao

  initializeStorage()

  const avaliacoes = loadFromStorage("avaliacoes", [])

  // Verificar se a avaliação existe
  const avaliacaoIndex = avaliacoes.findIndex((a: Avaliacao) => a.id === id)
  if (avaliacaoIndex === -1) {
    throw new Error("Avaliação não encontrada")
  }

  // Atualizar dados
  const avaliacaoAtualizada = {
    ...avaliacoes[avaliacaoIndex],
    ...dadosAtualizados,
    data: new Date().toISOString(), // Atualizar a data da avaliação
  }

  avaliacoes[avaliacaoIndex] = avaliacaoAtualizada
  saveToStorage("avaliacoes", avaliacoes)

  // Atualizar a média de avaliações da clínica
  atualizarMediaAvaliacaoClinica(avaliacaoAtualizada.clinicaId)

  return avaliacaoAtualizada
}

export const excluirAvaliacao = (id: string): boolean => {
  if (typeof window === "undefined") return false

  initializeStorage()

  const avaliacoes = loadFromStorage("avaliacoes", [])

  // Verificar se a avaliação existe
  const avaliacaoIndex = avaliacoes.findIndex((a: Avaliacao) => a.id === id)
  if (avaliacaoIndex === -1) {
    return false
  }

  const clinicaId = avaliacoes[avaliacaoIndex].clinicaId

  // Remover avaliação
  avaliacoes.splice(avaliacaoIndex, 1)
  saveToStorage("avaliacoes", avaliacoes)

  // Atualizar a média de avaliações da clínica
  atualizarMediaAvaliacaoClinica(clinicaId)

  return true
}

export const getAvaliacoesByClinica = (clinicaId: string): Avaliacao[] => {
  if (typeof window === "undefined") return []

  initializeStorage()

  const avaliacoes = loadFromStorage("avaliacoes", [])
  return avaliacoes.filter((a: Avaliacao) => a.clinicaId === clinicaId)
}

export const getAvaliacoesByUsuario = (usuarioId: string): Avaliacao[] => {
  if (typeof window === "undefined") return []

  initializeStorage()

  const avaliacoes = loadFromStorage("avaliacoes", [])
  return avaliacoes.filter((a: Avaliacao) => a.usuarioId === usuarioId)
}

export const getAvaliacaoById = (id: string): Avaliacao | null => {
  if (typeof window === "undefined") return null

  initializeStorage()

  const avaliacoes = loadFromStorage("avaliacoes", [])
  return avaliacoes.find((a: Avaliacao) => a.id === id) || null
}

export const responderAvaliacao = (avaliacaoId: string, texto: string): Avaliacao => {
  if (typeof window === "undefined") return {} as Avaliacao

  initializeStorage()

  const avaliacoes = loadFromStorage("avaliacoes", [])

  // Verificar se a avaliação existe
  const avaliacaoIndex = avaliacoes.findIndex((a: Avaliacao) => a.id === avaliacaoId)
  if (avaliacaoIndex === -1) {
    throw new Error("Avaliação não encontrada")
  }

  // Adicionar resposta
  const avaliacaoAtualizada = {
    ...avaliacoes[avaliacaoIndex],
    resposta: {
      texto,
      data: new Date().toISOString(),
    },
  }

  avaliacoes[avaliacaoIndex] = avaliacaoAtualizada
  saveToStorage("avaliacoes", avaliacoes)

  return avaliacaoAtualizada
}

// Função auxiliar para atualizar a média de avaliações de uma clínica
const atualizarMediaAvaliacaoClinica = (clinicaId: string): void => {
  const avaliacoes = getAvaliacoesByClinica(clinicaId)
  const clinica = getClinicaById(clinicaId)

  if (!clinica) return

  if (avaliacoes.length === 0) {
    atualizarClinica(clinicaId, { avaliacao: 0 })
    return
  }

  // Calcular média das notas
  const somaNotas = avaliacoes.reduce((soma, avaliacao) => soma + avaliacao.nota, 0)
  const media = Number.parseFloat((somaNotas / avaliacoes.length).toFixed(1))

  // Atualizar a média na clínica
  atualizarClinica(clinicaId, { avaliacao: media })
}

// Função para mensagens de contato
export interface Mensagem {
  id: string
  nome: string
  email: string
  assunto: string
  mensagem: string
  data: string
}

export const enviarMensagem = (mensagem: Omit<Mensagem, "id" | "data">): Mensagem => {
  if (typeof window === "undefined") return {} as Mensagem

  initializeStorage()

  const mensagens = loadFromStorage("mensagens", [])

  const novaMensagem: Mensagem = {
    ...mensagem,
    id: generateId(),
    data: new Date().toISOString(),
  }

  mensagens.push(novaMensagem)
  saveToStorage("mensagens", mensagens)

  return novaMensagem
}

// Inicializar o armazenamento
if (typeof window !== "undefined") {
  initializeStorage()
}
