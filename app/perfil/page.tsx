"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, AlertTriangle, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import {
  atualizarUsuario,
  getPacienteByEmail,
  atualizarPaciente,
  ativarVerificacaoDuasEtapas,
  desativarVerificacaoDuasEtapas,
  gerarCodigoVerificacao,
  verificarCodigo,
  excluirUsuario,
} from "@/lib/storage"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PerfilPage() {
  const router = useRouter()
  const { usuario, updateUserData, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("perfil")
  const [paciente, setPaciente] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showVerificacaoDialog, setShowVerificacaoDialog] = useState(false)
  const [telefoneVerificacao, setTelefoneVerificacao] = useState("")
  const [codigoVerificacao, setCodigoVerificacao] = useState("")
  const [codigoEnviado, setCodigoEnviado] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    genero: "",
    endereco: "",
    bairro: "",
    convenioMedico: "",
    numeroConvenio: "",
  })

  const [senhaData, setSenhaData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Verificar se o usuário está logado
    if (!usuario) {
      router.push("/login")
      return
    }

    // Buscar dados do paciente
    if (usuario.tipo === "paciente") {
      const pacienteData = getPacienteByEmail(usuario.email)
      if (pacienteData) {
        setPaciente(pacienteData)
        setFormData({
          nome: usuario.nome || "",
          email: usuario.email || "",
          telefone: pacienteData.telefone || "",
          dataNascimento: pacienteData.dataNascimento || "",
          genero: pacienteData.genero || "",
          endereco: pacienteData.endereco || "",
          bairro: pacienteData.bairro || "",
          convenioMedico: pacienteData.convenioMedico || "",
          numeroConvenio: pacienteData.numeroConvenio || "",
        })
        setTelefoneVerificacao(usuario.telefoneVerificacao || pacienteData.telefone || "")
      }
    }
  }, [router, usuario])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSenhaChange = (e) => {
    const { name, value } = e.target
    setSenhaData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validatePerfilForm = () => {
    const newErrors = {}

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório"
    if (!formData.telefone.trim()) newErrors.telefone = "Telefone é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSenhaForm = () => {
    const newErrors = {}

    if (!senhaData.senhaAtual) newErrors.senhaAtual = "Senha atual é obrigatória"

    if (!senhaData.novaSenha) {
      newErrors.novaSenha = "Nova senha é obrigatória"
    } else if (senhaData.novaSenha.length < 6) {
      newErrors.novaSenha = "A senha deve ter pelo menos 6 caracteres"
    }

    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem"
    }

    // Verificar se a senha atual está correta
    if (senhaData.senhaAtual && usuario && senhaData.senhaAtual !== usuario.senha) {
      newErrors.senhaAtual = "Senha atual incorreta"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSalvarPerfil = async () => {
    if (!validatePerfilForm()) return

    setIsLoading(true)

    try {
      // Atualizar usuário
      if (usuario) {
        const usuarioAtualizado = atualizarUsuario(usuario.id, {
          nome: formData.nome,
        })

        // Atualizar o contexto de autenticação
        updateUserData({
          nome: formData.nome,
        })
      }

      // Atualizar paciente
      if (paciente) {
        atualizarPaciente(paciente.email, {
          nome: formData.nome,
          telefone: formData.telefone,
          dataNascimento: formData.dataNascimento,
          genero: formData.genero,
          endereco: formData.endereco,
          bairro: formData.bairro,
          convenioMedico: formData.convenioMedico,
          numeroConvenio: formData.numeroConvenio,
        })
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro ao atualizar suas informações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAlterarSenha = async () => {
    if (!validateSenhaForm()) return

    setIsLoading(true)

    try {
      // Atualizar senha do usuário
      if (usuario) {
        atualizarUsuario(usuario.id, {
          senha: senhaData.novaSenha,
        })
      }

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      })

      // Limpar formulário
      setSenhaData({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      })
    } catch (error) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Ocorreu um erro ao alterar sua senha.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleVerificacaoDuasEtapas = async (checked) => {
    if (checked) {
      // Abrir diálogo para configurar verificação em duas etapas
      setShowVerificacaoDialog(true)
    } else {
      // Desativar verificação em duas etapas
      if (usuario) {
        const sucesso = desativarVerificacaoDuasEtapas(usuario.id)
        if (sucesso) {
          updateUserData({
            verificacaoDuasEtapas: false,
            telefoneVerificacao: undefined,
          })

          toast({
            title: "Verificação em duas etapas desativada",
            description: "A verificação em duas etapas foi desativada com sucesso.",
          })
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível desativar a verificação em duas etapas.",
            variant: "destructive",
          })
        }
      }
    }
  }

  const handleEnviarCodigoVerificacao = () => {
    if (!telefoneVerificacao) {
      toast({
        title: "Erro",
        description: "Informe um número de telefone válido.",
        variant: "destructive",
      })
      return
    }

    // Simular envio de código de verificação
    if (usuario) {
      const codigo = gerarCodigoVerificacao(usuario.id)

      // Em um ambiente real, o código seria enviado por SMS
      // Aqui apenas mostramos na tela para fins de demonstração
      toast({
        title: "Código enviado",
        description: `Código de verificação: ${codigo}`,
      })

      setCodigoEnviado(true)
    }
  }

  const handleVerificarCodigo = () => {
    if (!codigoVerificacao) {
      toast({
        title: "Erro",
        description: "Informe o código de verificação.",
        variant: "destructive",
      })
      return
    }

    if (usuario) {
      const sucesso = verificarCodigo(usuario.id, codigoVerificacao)

      if (sucesso) {
        // Ativar verificação em duas etapas
        ativarVerificacaoDuasEtapas(usuario.id, telefoneVerificacao)

        updateUserData({
          verificacaoDuasEtapas: true,
          telefoneVerificacao,
        })

        toast({
          title: "Verificação em duas etapas ativada",
          description: "A verificação em duas etapas foi ativada com sucesso.",
        })

        setShowVerificacaoDialog(false)
        setCodigoEnviado(false)
        setCodigoVerificacao("")
      } else {
        toast({
          title: "Código inválido",
          description: "O código de verificação é inválido ou expirou.",
          variant: "destructive",
        })
      }
    }
  }

  const handleExcluirConta = async () => {
    if (!usuario) return

    try {
      const sucesso = excluirUsuario(usuario.id)

      if (sucesso) {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Diálogo de verificação em duas etapas */}
      <Dialog open={showVerificacaoDialog} onOpenChange={setShowVerificacaoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verificação em duas etapas</DialogTitle>
            <DialogDescription>
              Configure a verificação em duas etapas para aumentar a segurança da sua conta.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="telefoneVerificacao">Número de telefone</Label>
              <Input
                id="telefoneVerificacao"
                placeholder="(61) 99999-9999"
                value={telefoneVerificacao}
                onChange={(e) => setTelefoneVerificacao(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Você receberá um código de verificação neste número.</p>
            </div>

            {!codigoEnviado ? (
              <Button onClick={handleEnviarCodigoVerificacao} className="w-full bg-blue-600 hover:bg-blue-700">
                Enviar código de verificação
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="codigoVerificacao">Código de verificação</Label>
                  <Input
                    id="codigoVerificacao"
                    placeholder="Digite o código de 6 dígitos"
                    value={codigoVerificacao}
                    onChange={(e) => setCodigoVerificacao(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Digite o código de verificação enviado para o seu telefone.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleVerificarCodigo} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Verificar código
                  </Button>
                  <Button variant="outline" onClick={handleEnviarCodigoVerificacao} className="flex-1">
                    Reenviar código
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerificacaoDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Minha Conta</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="perfil" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Atualize suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome completo</Label>
                      <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} />
                      {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" value={formData.email} disabled />
                      <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
                      {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de nascimento</Label>
                      <Input
                        id="dataNascimento"
                        name="dataNascimento"
                        type="date"
                        value={formData.dataNascimento}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="genero">Gênero</Label>
                      <Select value={formData.genero} onValueChange={(value) => handleSelectChange("genero", value)}>
                        <SelectTrigger id="genero">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                          <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSalvarPerfil} className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Salvando...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        Salvar alterações
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações Complementares</CardTitle>
                  <CardDescription>Informações adicionais para melhor atendimento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        name="endereco"
                        placeholder="Ex: SGAS 915 - Asa Sul, Brasília-DF"
                        value={formData.endereco}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Select value={formData.bairro} onValueChange={(value) => handleSelectChange("bairro", value)}>
                        <SelectTrigger id="bairro">
                          <SelectValue placeholder="Selecione o bairro" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Asa Sul",
                            "Asa Norte",
                            "Lago Sul",
                            "Lago Norte",
                            "Sudoeste",
                            "Noroeste",
                            "Guará",
                            "Águas Claras",
                            "Taguatinga",
                            "Ceilândia",
                          ].map((bairro) => (
                            <SelectItem key={bairro} value={bairro}>
                              {bairro}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="convenioMedico">Convênio médico</Label>
                      <Input
                        id="convenioMedico"
                        name="convenioMedico"
                        placeholder="Nome do convênio"
                        value={formData.convenioMedico}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroConvenio">Número do convênio</Label>
                      <Input
                        id="numeroConvenio"
                        name="numeroConvenio"
                        placeholder="Número da carteirinha"
                        value={formData.numeroConvenio}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSalvarPerfil} className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="seguranca" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>Altere sua senha para manter sua conta segura</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senhaAtual">Senha atual</Label>
                    <Input
                      id="senhaAtual"
                      name="senhaAtual"
                      type="password"
                      value={senhaData.senhaAtual}
                      onChange={handleSenhaChange}
                    />
                    {errors.senhaAtual && <p className="text-sm text-red-500">{errors.senhaAtual}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="novaSenha">Nova senha</Label>
                    <Input
                      id="novaSenha"
                      name="novaSenha"
                      type="password"
                      value={senhaData.novaSenha}
                      onChange={handleSenhaChange}
                    />
                    {errors.novaSenha && <p className="text-sm text-red-500">{errors.novaSenha}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
                    <Input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type="password"
                      value={senhaData.confirmarSenha}
                      onChange={handleSenhaChange}
                    />
                    {errors.confirmarSenha && <p className="text-sm text-red-500">{errors.confirmarSenha}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleAlterarSenha} className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Alterando..." : "Alterar senha"}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Verificação em duas etapas</CardTitle>
                  <CardDescription>
                    Adicione uma camada extra de segurança à sua conta exigindo um código de verificação ao fazer login
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Verificação em duas etapas</div>
                      <div className="text-sm text-muted-foreground">
                        {usuario.verificacaoDuasEtapas
                          ? "Ativada - Um código será enviado para seu telefone ao fazer login"
                          : "Desativada - Ative para aumentar a segurança da sua conta"}
                      </div>
                    </div>
                    <Switch
                      checked={usuario.verificacaoDuasEtapas}
                      onCheckedChange={handleToggleVerificacaoDuasEtapas}
                    />
                  </div>

                  {usuario.verificacaoDuasEtapas && (
                    <div className="flex items-start space-x-2 rounded-md border p-4 bg-muted/50">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Telefone de verificação</p>
                        <p className="text-sm text-muted-foreground">
                          {usuario.telefoneVerificacao || "Não configurado"}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setShowVerificacaoDialog(true)}
                        >
                          Alterar telefone
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Excluir Conta</CardTitle>
                  <CardDescription>Exclua permanentemente sua conta e todos os dados associados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-2 rounded-md border p-4 bg-red-50 border-red-200">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-red-800">Atenção</p>
                      <p className="text-sm text-red-700">
                        Esta ação não pode ser desfeita. Todos os seus dados, incluindo avaliações e informações de
                        perfil, serão permanentemente excluídos.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Conta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir conta</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá todos os
                          dados associados, incluindo avaliações e informações de perfil.
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
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
