"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Star, Calendar, MessageSquare, Edit, CheckCircle, X, Clock, HelpCircle, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import {
  getClinicaById,
  atualizarClinica,
  getAvaliacoesByClinica,
  responderAvaliacao,
  excluirClinica,
  excluirUsuario,
} from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HorarioFuncionamento } from "@/components/horario-funcionamento"

export default function PainelClinicaPage() {
  const router = useRouter()
  const { usuario, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("perfil")
  const [clinica, setClinica] = useState(null)
  const [avaliacoes, setAvaliacoes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    whatsapp: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    horario: "",
    descricao: "",
  })
  const [respostaAvaliacao, setRespostaAvaliacao] = useState("")
  const [avaliacaoParaResponder, setAvaliacaoParaResponder] = useState(null)
  const [showRespostaDialog, setShowRespostaDialog] = useState(false)

  // Dados simulados de agendamentos
  const [agendamentos, setAgendamentos] = useState([
    {
      id: "1",
      pacienteNome: "Maria Silva",
      pacienteEmail: "maria@example.com",
      pacienteTelefone: "(61) 99999-1111",
      data: "2025-05-15",
      horario: "14:30",
      status: "confirmado",
    },
    {
      id: "2",
      pacienteNome: "João Santos",
      pacienteEmail: "joao@example.com",
      pacienteTelefone: "(61) 99999-2222",
      data: "2025-05-16",
      horario: "10:00",
      status: "pendente",
    },
    {
      id: "3",
      pacienteNome: "Ana Oliveira",
      pacienteEmail: "ana@example.com",
      pacienteTelefone: "(61) 99999-3333",
      data: "2025-05-14",
      horario: "16:45",
      status: "realizado",
    },
  ])

  // Função para recarregar avaliações
  const recarregarAvaliacoes = () => {
    if (usuario) {
      const avaliacoesData = getAvaliacoesByClinica(usuario.id)
      setAvaliacoes(avaliacoesData)
    }
  }

  useEffect(() => {
    // Verificar se o usuário está logado e é uma clínica
    if (!usuario) {
      router.push("/login")
      return
    }

    if (usuario.tipo !== "clinica") {
      router.push("/")
      toast({
        title: "Acesso restrito",
        description: "Esta área é exclusiva para clínicas e profissionais.",
        variant: "destructive",
      })
      return
    }

    // Carregar dados da clínica
    const clinicaData = getClinicaById(usuario.id)
    if (clinicaData) {
      setClinica(clinicaData)
      setFormData({
        nome: clinicaData.nome || "",
        email: clinicaData.email || "",
        telefone: clinicaData.telefone || "",
        whatsapp: clinicaData.whatsapp || "",
        cep: clinicaData.cep || "",
        endereco: clinicaData.endereco || "",
        numero: clinicaData.numero || "",
        complemento: clinicaData.complemento || "",
        bairro: clinicaData.bairro || "",
        cidade: clinicaData.cidade || "",
        uf: clinicaData.uf || "",
        horario: clinicaData.horario || "",
        descricao: clinicaData.descricao || "",
      })
    }

    // Carregar avaliações
    recarregarAvaliacoes()

    // Configurar intervalo para recarregar avaliações a cada 30 segundos
    const interval = setInterval(recarregarAvaliacoes, 30000)

    return () => clearInterval(interval)
  }, [router, usuario])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddressChange = (address) => {
    setFormData((prev) => ({
      ...prev,
      endereco: address.logradouro,
      bairro: address.bairro,
      cidade: address.cidade,
      uf: address.uf,
    }))
  }

  const handleSalvarPerfil = async () => {
    if (!clinica) return

    setIsLoading(true)

    try {
      // Atualizar clínica
      const clinicaAtualizada = atualizarClinica(clinica.id, {
        nome: formData.nome,
        telefone: formData.telefone,
        whatsapp: formData.whatsapp,
        cep: formData.cep,
        endereco: formData.endereco,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        uf: formData.uf,
        horario: formData.horario,
        descricao: formData.descricao,
      })

      setClinica(clinicaAtualizada)

      toast({
        title: "Perfil atualizado",
        description: "As informações da clínica foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro ao atualizar as informações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResponderAvaliacao = () => {
    if (!respostaAvaliacao.trim() || !avaliacaoParaResponder) {
      toast({
        title: "Erro",
        description: "A resposta não pode estar vazia.",
        variant: "destructive",
      })
      return
    }

    try {
      // Responder avaliação
      responderAvaliacao(avaliacaoParaResponder.id, respostaAvaliacao)

      // Recarregar avaliações
      recarregarAvaliacoes()

      setRespostaAvaliacao("")
      setAvaliacaoParaResponder(null)
      setShowRespostaDialog(false)

      toast({
        title: "Resposta enviada",
        description: "Sua resposta foi enviada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua resposta.",
        variant: "destructive",
      })
    }
  }

  const handleAtualizarStatusAgendamento = (id, novoStatus) => {
    const novosAgendamentos = agendamentos.map((agendamento) =>
      agendamento.id === id ? { ...agendamento, status: novoStatus } : agendamento,
    )

    setAgendamentos(novosAgendamentos)

    toast({
      title: "Status atualizado",
      description: `O status do agendamento foi atualizado para ${novoStatus}.`,
    })
  }

  const handleExcluirConta = async () => {
    if (!usuario || !clinica) return

    try {
      // Excluir clínica
      const clinicaExcluida = excluirClinica(clinica.id)

      // Excluir usuário
      const usuarioExcluido = excluirUsuario(usuario.id)

      if (clinicaExcluida && usuarioExcluido) {
        toast({
          title: "Conta excluída",
          description: "Sua conta foi excluída com sucesso.",
        })

        // Fazer logout e redirecionar
        logout()
        router.push("/")
      } else {
        throw new Error("Erro ao excluir conta")
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir conta",
        description: "Ocorreu um erro ao excluir sua conta. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  if (!usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (usuario.tipo !== "clinica") {
    router.push("/")
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Acesso Restrito</div>
          <p className="text-muted-foreground">Esta área é exclusiva para clínicas e profissionais.</p>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/")}>
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  if (!clinica) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando dados da clínica...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Diálogo para responder avaliação */}
      <Dialog open={showRespostaDialog} onOpenChange={setShowRespostaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responder Avaliação</DialogTitle>
            <DialogDescription>
              Responda à avaliação do paciente. Sua resposta será exibida publicamente.
            </DialogDescription>
          </DialogHeader>
          {avaliacaoParaResponder && (
            <div className="space-y-4 py-4">
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted mr-2">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{avaliacaoParaResponder.usuarioNome}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(avaliacaoParaResponder.data).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < avaliacaoParaResponder.nota ? "text-yellow-500" : "text-muted"}`}
                      fill={i < avaliacaoParaResponder.nota ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className="text-sm">{avaliacaoParaResponder.comentario}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resposta">Sua resposta</Label>
                <Textarea
                  id="resposta"
                  value={respostaAvaliacao}
                  onChange={(e) => setRespostaAvaliacao(e.target.value)}
                  placeholder="Escreva sua resposta..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRespostaDialog(false)
                setAvaliacaoParaResponder(null)
                setRespostaAvaliacao("")
              }}
            >
              Cancelar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleResponderAvaliacao}>
              Enviar resposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Painel da Clínica</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
              <TabsTrigger value="avaliacoes">
                Avaliações
                {avaliacoes.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {avaliacoes.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="perfil" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Perfil da Clínica</CardTitle>
                  <CardDescription>Gerencie as informações do perfil da sua clínica</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da clínica</Label>
                    <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      name="descricao"
                      rows={4}
                      value={formData.descricao}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          name="cep"
                          placeholder="00000-000"
                          value={formData.cep}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numero">Número</Label>
                        <Input
                          id="numero"
                          name="numero"
                          placeholder="123"
                          value={formData.numero}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        name="endereco"
                        placeholder="Rua, Avenida..."
                        value={formData.endereco}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complemento">Complemento (opcional)</Label>
                      <Input
                        id="complemento"
                        name="complemento"
                        placeholder="Apto, Sala, Bloco..."
                        value={formData.complemento}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input
                          id="bairro"
                          name="bairro"
                          value={formData.bairro}
                          onChange={handleChange}
                          placeholder="Digite o bairro"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleChange}
                          placeholder="Digite a cidade"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="uf">UF</Label>
                        <Input
                          id="uf"
                          name="uf"
                          value={formData.uf}
                          onChange={handleChange}
                          placeholder="Ex: DF"
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </div>
                  <HorarioFuncionamento horario={formData.horario} onChange={handleChange} />
                </CardContent>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 mx-6">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    Visibilidade da clínica
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Sua clínica permanecerá visível para todos os pacientes até que você decida encerrar sua conta. Não
                    removemos clínicas automaticamente, garantindo que você mantenha sua visibilidade e continue
                    recebendo agendamentos enquanto desejar.
                  </p>
                </div>
                <CardFooter className="mt-4 flex justify-between">
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSalvarPerfil} disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar alterações"}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Conta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir conta da clínica</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta da clínica e removerá
                          todos os dados associados, incluindo avaliações e informações de perfil.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleExcluirConta}>
                          Excluir conta
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="atendimentos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Atendimentos</CardTitle>
                  <CardDescription>Visualize e gerencie os agendamentos de pacientes</CardDescription>
                </CardHeader>
                <CardContent>
                  {agendamentos.length > 0 ? (
                    <div className="space-y-6">
                      <div className="rounded-md border">
                        <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b bg-muted/50">
                          <div>Paciente</div>
                          <div>Contato</div>
                          <div>Data</div>
                          <div>Horário</div>
                          <div>Status</div>
                          <div className="text-right">Ações</div>
                        </div>
                        <div className="divide-y">
                          {agendamentos.map((agendamento) => (
                            <div key={agendamento.id} className="grid grid-cols-6 gap-4 p-4 items-center">
                              <div>
                                <div className="font-medium">{agendamento.pacienteNome}</div>
                                <div className="text-xs text-muted-foreground">{agendamento.pacienteEmail}</div>
                              </div>
                              <div className="text-sm">{agendamento.pacienteTelefone}</div>
                              <div className="text-sm">{new Date(agendamento.data).toLocaleDateString("pt-BR")}</div>
                              <div className="text-sm">{agendamento.horario}</div>
                              <div>
                                <Badge
                                  className={
                                    agendamento.status === "confirmado"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : agendamento.status === "pendente"
                                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                        : agendamento.status === "cancelado"
                                          ? "bg-red-100 text-red-800 hover:bg-red-100"
                                          : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  }
                                >
                                  {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex justify-end gap-2">
                                {agendamento.status === "pendente" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                                      onClick={() => handleAtualizarStatusAgendamento(agendamento.id, "confirmado")}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Confirmar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                      onClick={() => handleAtualizarStatusAgendamento(agendamento.id, "cancelado")}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Cancelar
                                    </Button>
                                  </>
                                )}
                                {agendamento.status === "confirmado" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                    onClick={() => handleAtualizarStatusAgendamento(agendamento.id, "realizado")}
                                  >
                                    <Clock className="h-4 w-4 mr-1" />
                                    Concluir
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Nenhum agendamento</h3>
                      <p className="text-muted-foreground mt-2">Você ainda não possui agendamentos de pacientes.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="avaliacoes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Avaliações de Pacientes</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={recarregarAvaliacoes}
                      className="border-blue-200 hover:border-blue-300"
                    >
                      Atualizar
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Visualize e responda às avaliações dos pacientes. As avaliações são atualizadas automaticamente.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {avaliacoes.length > 0 ? (
                    <div className="space-y-4">
                      {avaliacoes.map((avaliacao) => (
                        <div key={avaliacao.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted mr-2">
                                <User className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium">{avaliacao.usuarioNome}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(avaliacao.data).toLocaleDateString("pt-BR")}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < avaliacao.nota ? "text-yellow-500" : "text-muted"}`}
                                  fill={i < avaliacao.nota ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">{avaliacao.comentario}</p>

                          {avaliacao.resposta ? (
                            <div className="mt-3 pl-4 border-l-2 border-blue-200">
                              <div className="text-xs font-medium text-blue-700 mb-1">Sua resposta</div>
                              <p className="text-sm text-muted-foreground">{avaliacao.resposta.texto}</p>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(avaliacao.resposta.data).toLocaleDateString("pt-BR")}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 h-8 text-blue-600"
                                onClick={() => {
                                  setAvaliacaoParaResponder(avaliacao)
                                  setRespostaAvaliacao(avaliacao.resposta.texto)
                                  setShowRespostaDialog(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar resposta
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setAvaliacaoParaResponder(avaliacao)
                                setShowRespostaDialog(true)
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Responder
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Nenhuma avaliação ainda</h3>
                      <p className="text-muted-foreground mt-2">
                        Sua clínica ainda não recebeu avaliações de pacientes.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
