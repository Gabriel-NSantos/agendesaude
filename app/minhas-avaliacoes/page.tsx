"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Edit, Trash2, MessageSquare } from "lucide-react"
import { getAvaliacoesByUsuario, getClinicaById, excluirAvaliacao, editarAvaliacao } from "@/lib/storage"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Textarea } from "@/components/ui/textarea"
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

export default function MinhasAvaliacoesPage() {
  const { usuario } = useAuth()
  const [avaliacoes, setAvaliacoes] = useState([])
  const [clinicas, setClinicas] = useState({})
  const [avaliacaoEmEdicao, setAvaliacaoEmEdicao] = useState(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!usuario) return

    // Carregar avaliações do usuário
    const avaliacoesUsuario = getAvaliacoesByUsuario(usuario.id)
    setAvaliacoes(avaliacoesUsuario)

    // Carregar dados das clínicas
    const clinicasData = {}
    avaliacoesUsuario.forEach((avaliacao) => {
      const clinica = getClinicaById(avaliacao.clinicaId)
      if (clinica) {
        clinicasData[avaliacao.clinicaId] = clinica
      }
    })
    setClinicas(clinicasData)
  }, [usuario])

  const handleEditarAvaliacao = (avaliacao) => {
    setAvaliacaoEmEdicao({
      id: avaliacao.id,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      clinicaId: avaliacao.clinicaId,
    })
    setShowEditDialog(true)
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
      const avaliacoesAtualizadas = getAvaliacoesByUsuario(usuario.id)
      setAvaliacoes(avaliacoesAtualizadas)

      // Limpar formulário
      setAvaliacaoEmEdicao(null)
      setShowEditDialog(false)

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
      const avaliacoesAtualizadas = getAvaliacoesByUsuario(usuario.id)
      setAvaliacoes(avaliacoesAtualizadas)

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

  if (!usuario) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Minhas Avaliações</h1>
            <p className="text-muted-foreground mb-8">Você precisa estar logado para ver suas avaliações.</p>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">Fazer login</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Minhas Avaliações</h1>
          <p className="text-muted-foreground mb-8">
            Gerencie as avaliações que você fez para clínicas e profissionais
          </p>

          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar avaliação</DialogTitle>
                <DialogDescription>
                  {avaliacaoEmEdicao && clinicas[avaliacaoEmEdicao.clinicaId] && (
                    <>Atualize sua avaliação sobre {clinicas[avaliacaoEmEdicao.clinicaId].nome}.</>
                  )}
                </DialogDescription>
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
                              nota <= avaliacaoEmEdicao.nota ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
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
                      onChange={(e) => setAvaliacaoEmEdicao((prev) => ({ ...prev, comentario: e.target.value }))}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false)
                    setAvaliacaoEmEdicao(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSalvarEdicao} disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar alterações"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {avaliacoes.length > 0 ? (
            <div className="space-y-6">
              {avaliacoes.map((avaliacao) => {
                const clinica = clinicas[avaliacao.clinicaId]
                if (!clinica) return null

                return (
                  <Card key={avaliacao.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{clinica.nome}</CardTitle>
                          <CardDescription>
                            Avaliado em {new Date(avaliacao.data).toLocaleDateString("pt-BR")}
                          </CardDescription>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${i < avaliacao.nota ? "text-yellow-500" : "text-muted"}`}
                              fill={i < avaliacao.nota ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{avaliacao.comentario}</p>

                      {avaliacao.resposta && (
                        <div className="mt-3 pl-4 border-l-2 border-blue-200">
                          <div className="text-xs font-medium text-blue-700 mb-1">Resposta da clínica</div>
                          <p className="text-sm text-muted-foreground">{avaliacao.resposta.texto}</p>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(avaliacao.resposta.data).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-4">
                        <Link href={`/clinica/${avaliacao.clinicaId}`}>
                          <Button variant="outline" size="sm" className="border-blue-200 hover:border-blue-300">
                            Ver clínica
                          </Button>
                        </Link>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600"
                            onClick={() => handleEditarAvaliacao(avaliacao)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir avaliação</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir sua avaliação para {clinica.nome}? Esta ação não pode
                                  ser desfeita.
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
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Nenhuma avaliação ainda</h3>
              <p className="text-muted-foreground mt-2 mb-6">Você ainda não avaliou nenhuma clínica ou profissional.</p>
              <Link href="/busca">
                <Button className="bg-blue-600 hover:bg-blue-700">Buscar clínicas para avaliar</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
