"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Phone, Clock, ArrowLeft, User, ThumbsUp, MessageSquare, Edit, Trash2 } from "lucide-react"
import {
  getClinicaById,
  getAvaliacoesByClinica,
  adicionarAvaliacao,
  editarAvaliacao,
  excluirAvaliacao,
} from "@/lib/storage"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Textarea } from "@/components/ui/textarea"
import { MapaClinica } from "@/components/mapa-clinica"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export default function ClinicaPage({ params }) {
  const { id } = params
  const { usuario } = useAuth()
  const [clinica, setClinica] = useState(null)
  const [avaliacoes, setAvaliacoes] = useState([])
  const [activeTab, setActiveTab] = useState("sobre")
  const [novaAvaliacao, setNovaAvaliacao] = useState({
    nota: 5,
    comentario: "",
  })
  const [avaliacaoEmEdicao, setAvaliacaoEmEdicao] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showAvaliacaoDialog, setShowAvaliacaoDialog] = useState(false)

  useEffect(() => {
    // Carregar dados da clínica
    const clinicaData = getClinicaById(id)
    if (clinicaData) {
      setClinica(clinicaData)
    }

    // Carregar avaliações
    const avaliacoesData = getAvaliacoesByClinica(id)
    setAvaliacoes(avaliacoesData)
  }, [id])

  const handleAvaliacaoChange = (e) => {
    const { name, value } = e.target
    setNovaAvaliacao((prev) => ({
      ...prev,
      [name]: name === "nota" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmitAvaliacao = () => {
    if (!usuario) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para avaliar uma clínica.",
        variant: "destructive",
      })
      return
    }

    if (!novaAvaliacao.comentario.trim()) {
      toast({
        title: "Erro",
        description: "O comentário não pode estar vazio.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Adicionar avaliação
      adicionarAvaliacao({
        clinicaId: id,
        usuarioId: usuario.id,
        usuarioNome: usuario.nome,
        nota: novaAvaliacao.nota,
        comentario: novaAvaliacao.comentario,
      })

      // Recarregar avaliações
      const avaliacoesAtualizadas = getAvaliacoesByClinica(id)
      setAvaliacoes(avaliacoesAtualizadas)

      // Recarregar clínica para atualizar a média
      const clinicaAtualizada = getClinicaById(id)
      setClinica(clinicaAtualizada)

      // Limpar formulário
      setNovaAvaliacao({
        nota: 5,
        comentario: "",
      })

      setShowAvaliacaoDialog(false)

      toast({
        title: "Avaliação enviada",
        description: "Sua avaliação foi enviada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao enviar sua avaliação.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditarAvaliacao = (avaliacao) => {
    setAvaliacaoEmEdicao({
      id: avaliacao.id,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
    })
    setShowAvaliacaoDialog(true)
  }

  const handleSalvarEdicao = () => {
    if (!avaliacaoEmEdicao.comentario.trim()) {
      toast({
        title: "Erro",
        description: "O comentário não pode estar vazio.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Editar avaliação
      editarAvaliacao(avaliacaoEmEdicao.id, {
        nota: avaliacaoEmEdicao.nota,
        comentario: avaliacaoEmEdicao.comentario,
      })

      // Recarregar avaliações
      const avaliacoesAtualizadas = getAvaliacoesByClinica(id)
      setAvaliacoes(avaliacoesAtualizadas)

      // Recarregar clínica para atualizar a média
      const clinicaAtualizada = getClinicaById(id)
      setClinica(clinicaAtualizada)

      // Limpar formulário
      setAvaliacaoEmEdicao(null)
      setShowAvaliacaoDialog(false)

      toast({
        title: "Avaliação atualizada",
        description: "Sua avaliação foi atualizada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao atualizar sua avaliação.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExcluirAvaliacao = (avaliacaoId) => {
    try {
      // Excluir avaliação
      excluirAvaliacao(avaliacaoId)

      // Recarregar avaliações
      const avaliacoesAtualizadas = getAvaliacoesByClinica(id)
      setAvaliacoes(avaliacoesAtualizadas)

      // Recarregar clínica para atualizar a média
      const clinicaAtualizada = getClinicaById(id)
      setClinica(clinicaAtualizada)

      toast({
        title: "Avaliação excluída",
        description: "Sua avaliação foi excluída com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir sua avaliação.",
        variant: "destructive",
      })
    }
  }

  if (!clinica) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  const usuarioJaAvaliou = usuario && avaliacoes.some((a) => a.usuarioId === usuario.id)
  const avaliacaoDoUsuario = usuario && avaliacoes.find((a) => a.usuarioId === usuario.id)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-6">
            <Link
              href="/busca"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar para resultados
            </Link>
          </div>

          <div className="space-y-8">
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
              <Image src={clinica.imagem || "/placeholder.svg"} alt={clinica.nome} fill className="object-cover" />
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold">{clinica.nome}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {clinica.especialidades.map((esp) => (
                    <span
                      key={esp}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {esp}
                    </span>
                  ))}
                </div>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{clinica.endereco}</span>
                </div>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{clinica.horario}</span>
                </div>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">
                    {clinica.avaliacao} ({avaliacoes.length} avaliações)
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link href={`https://wa.me/${clinica.telefone.replace(/\D/g, "")}`} target="_blank">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Phone className="mr-2 h-4 w-4" />
                    Agendar via WhatsApp
                  </Button>
                </Link>
                <a href={`tel:${clinica.telefone.replace(/\D/g, "")}`}>
                  <Button variant="outline" className="w-full border-blue-200 hover:border-blue-300 hover:bg-blue-50">
                    <Phone className="mr-2 h-4 w-4" />
                    Ligar agora
                  </Button>
                </a>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{clinica.telefone}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="sobre" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sobre">Sobre</TabsTrigger>
                <TabsTrigger value="localizacao">Localização</TabsTrigger>
                <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
              </TabsList>

              <TabsContent value="sobre" className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Sobre a clínica</h2>
                    <p className="text-muted-foreground">{clinica.descricao}</p>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Horário de funcionamento</h2>
                    <p className="text-muted-foreground">{clinica.horario}</p>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Especialidades</h2>
                    <div className="flex flex-wrap gap-2">
                      {clinica.especialidades.map((esp) => (
                        <span
                          key={esp}
                          className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {esp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="localizacao" className="pt-6">
                <MapaClinica
                  endereco={clinica.endereco}
                  nome={clinica.nome}
                  latitude={clinica.localizacao?.latitude}
                  longitude={clinica.localizacao?.longitude}
                />
              </TabsContent>

              <TabsContent value="avaliacoes" className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Avaliações</h2>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="font-medium">{clinica.avaliacao}</span>
                    <span className="text-muted-foreground ml-1">({avaliacoes.length})</span>
                  </div>
                </div>

                {usuario && !usuarioJaAvaliou && (
                  <div className="mb-6">
                    <Dialog open={showAvaliacaoDialog} onOpenChange={setShowAvaliacaoDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Avaliar esta clínica
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Avaliar {clinica.nome}</DialogTitle>
                          <DialogDescription>
                            Compartilhe sua experiência com esta clínica para ajudar outros pacientes.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Sua avaliação</label>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((nota) => (
                                <button
                                  key={nota}
                                  type="button"
                                  className="p-1"
                                  onClick={() => setNovaAvaliacao((prev) => ({ ...prev, nota }))}
                                >
                                  <Star
                                    className={`h-6 w-6 ${
                                      nota <= novaAvaliacao.nota ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                              <span className="ml-2 text-sm font-medium">
                                {novaAvaliacao.nota} {novaAvaliacao.nota === 1 ? "estrela" : "estrelas"}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="comentario" className="text-sm font-medium">
                              Seu comentário
                            </label>
                            <Textarea
                              id="comentario"
                              name="comentario"
                              placeholder="Conte sua experiência com esta clínica..."
                              rows={4}
                              value={novaAvaliacao.comentario}
                              onChange={handleAvaliacaoChange}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAvaliacaoDialog(false)
                              setNovaAvaliacao({ nota: 5, comentario: "" })
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={handleSubmitAvaliacao}
                            disabled={isLoading}
                          >
                            {isLoading ? "Enviando..." : "Enviar avaliação"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {usuario && usuarioJaAvaliou && (
                  <div className="mb-6">
                    <Dialog open={showAvaliacaoDialog} onOpenChange={setShowAvaliacaoDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-blue-200 hover:border-blue-300">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar minha avaliação
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar avaliação</DialogTitle>
                          <DialogDescription>Atualize sua avaliação sobre {clinica.nome}.</DialogDescription>
                        </DialogHeader>
                        {avaliacaoEmEdicao && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Sua avaliação</label>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((nota) => (
                                  <button
                                    key={nota}
                                    type="button"
                                    className="p-1"
                                    onClick={() => setAvaliacaoEmEdicao((prev) => ({ ...prev, nota }))}
                                  >
                                    <Star
                                      className={`h-6 w-6 ${
                                        nota <= avaliacaoEmEdicao.nota
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  </button>
                                ))}
                                <span className="ml-2 text-sm font-medium">
                                  {avaliacaoEmEdicao.nota} {avaliacaoEmEdicao.nota === 1 ? "estrela" : "estrelas"}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="comentario-edicao" className="text-sm font-medium">
                                Seu comentário
                              </label>
                              <Textarea
                                id="comentario-edicao"
                                placeholder="Conte sua experiência com esta clínica..."
                                rows={4}
                                value={avaliacaoEmEdicao.comentario}
                                onChange={(e) =>
                                  setAvaliacaoEmEdicao((prev) => ({ ...prev, comentario: e.target.value }))
                                }
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAvaliacaoDialog(false)
                              setAvaliacaoEmEdicao(null)
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={handleSalvarEdicao}
                            disabled={isLoading}
                          >
                            {isLoading ? "Salvando..." : "Salvar alterações"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="ml-2 border-red-200 hover:border-red-300 text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir avaliação
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir avaliação</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir sua avaliação? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleExcluirAvaliacao(avaliacaoDoUsuario.id)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}

                <div className="space-y-4">
                  {avaliacoes.length > 0 ? (
                    avaliacoes.map((avaliacao) => (
                      <div key={avaliacao.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted mr-2">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium flex items-center">
                                {avaliacao.usuarioNome}
                                {usuario && avaliacao.usuarioId === usuario.id && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    Você
                                  </span>
                                )}
                              </div>
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
                        <p className="text-sm text-muted-foreground">{avaliacao.comentario}</p>

                        {usuario && avaliacao.usuarioId === usuario.id ? (
                          <div className="flex items-center mt-2 space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-blue-600"
                              onClick={() => handleEditarAvaliacao(avaliacao)}
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">Editar</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600">
                                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                                  <span className="text-xs">Excluir</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir avaliação</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir sua avaliação? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleExcluirAvaliacao(avaliacao.id)}
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ) : (
                          <div className="flex items-center mt-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span className="text-xs">Útil</span>
                            </Button>
                          </div>
                        )}

                        {avaliacao.resposta && (
                          <div className="mt-3 pl-4 border-l-2 border-blue-200">
                            <div className="text-xs font-medium text-blue-700 mb-1">Resposta da clínica</div>
                            <p className="text-sm text-muted-foreground">{avaliacao.resposta.texto}</p>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(avaliacao.resposta.data).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 border rounded-lg">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Nenhuma avaliação ainda</h3>
                      <p className="text-muted-foreground mt-2">Seja o primeiro a avaliar esta clínica!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
