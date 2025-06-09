"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cadastrarUsuario, cadastrarPaciente, cadastrarClinica } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Textarea } from "@/components/ui/textarea"
import { CepInput } from "@/components/cep-input"
import { HorarioFuncionamento } from "@/components/horario-funcionamento"

const especialidades = [
  "Clínico Geral",
  "Pediatria",
  "Ginecologia",
  "Cardiologia",
  "Dermatologia",
  "Ortopedia",
  "Psicologia",
  "Nutrição",
]

const bairros = [
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
  "Samambaia",
  "Gama",
  "Sobradinho",
  "Planaltina",
]

export default function CadastroPage() {
  const router = useRouter()
  const [tipoUsuario, setTipoUsuario] = useState("paciente")
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    dataNascimento: "",
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
    especialidadesSelecionadas: [],
    aceiteLgpd: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      aceiteLgpd: checked,
    }))
  }

  const handleEspecialidadeChange = (especialidade, checked) => {
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          especialidadesSelecionadas: [...prev.especialidadesSelecionadas, especialidade],
        }
      } else {
        return {
          ...prev,
          especialidadesSelecionadas: prev.especialidadesSelecionadas.filter((e) => e !== especialidade),
        }
      }
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório"

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória"
    } else if (formData.senha.length < 6) {
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres"
    }

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem"
    }

    if (!formData.telefone) {
      newErrors.telefone = "Telefone é obrigatório"
    }

    if (tipoUsuario === "paciente" && !formData.dataNascimento) {
      newErrors.dataNascimento = "Data de nascimento é obrigatória"
    }

    if (tipoUsuario === "clinica") {
      if (!formData.whatsapp) {
        newErrors.whatsapp = "WhatsApp é obrigatório"
      }

      if (!formData.cep) {
        newErrors.cep = "CEP é obrigatório"
      }

      if (!formData.endereco) {
        newErrors.endereco = "Endereço é obrigatório"
      }

      if (!formData.bairro) {
        newErrors.bairro = "Bairro é obrigatório"
      }

      if (!formData.horario) {
        newErrors.horario = "Horário de funcionamento é obrigatório"
      }

      if (!formData.descricao) {
        newErrors.descricao = "Descrição é obrigatória"
      }

      if (formData.especialidadesSelecionadas.length === 0) {
        newErrors.especialidades = "Selecione pelo menos uma especialidade"
      }
    }

    if (!formData.aceiteLgpd) {
      newErrors.aceiteLgpd = "Você precisa aceitar os termos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)

      try {
        // Cadastrar usuário
        const usuario = await cadastrarUsuario({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          tipo: tipoUsuario,
        })

        if (tipoUsuario === "paciente") {
          // Cadastrar paciente
          await cadastrarPaciente({
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            dataNascimento: formData.dataNascimento,
          })
        } else if (tipoUsuario === "clinica") {
          // Cadastrar clínica
          await cadastrarClinica({
            nome: formData.nome,
            email: formData.email,
            especialidades: formData.especialidadesSelecionadas,
            endereco: formData.endereco,
            bairro: formData.bairro,
            telefone: formData.telefone,
            whatsapp: formData.whatsapp,
            horario: formData.horario,
            descricao: formData.descricao,
          })
        }

        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Você será redirecionado para a página de login.",
        })

        // Simular tempo de processamento
        setTimeout(() => {
          setIsLoading(false)
          router.push("/login")
        }, 1500)
      } catch (error) {
        setIsLoading(false)
        toast({
          title: "Erro ao cadastrar",
          description: error.message || "Ocorreu um erro ao realizar o cadastro.",
          variant: "destructive",
        })
      }
    }
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

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster />
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar
              </Link>
              <div className="flex items-center gap-2 text-blue-600">
                <Calendar className="h-5 w-5" />
                <span className="font-bold">AgendeSaúde</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Criar conta</CardTitle>
            <CardDescription>Preencha os dados abaixo para criar sua conta</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de conta</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tipo-paciente"
                      checked={tipoUsuario === "paciente"}
                      onCheckedChange={() => setTipoUsuario("paciente")}
                    />
                    <label
                      htmlFor="tipo-paciente"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sou paciente
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tipo-clinica"
                      checked={tipoUsuario === "clinica"}
                      onCheckedChange={() => setTipoUsuario("clinica")}
                    />
                    <label
                      htmlFor="tipo-clinica"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sou clínica/profissional
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome">{tipoUsuario === "clinica" ? "Nome da clínica" : "Nome completo"}</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder={tipoUsuario === "clinica" ? "Digite o nome da sua clínica" : "Digite seu nome completo"}
                  value={formData.nome}
                  onChange={handleChange}
                />
                {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={tipoUsuario === "clinica" ? "contato@suaclinica.com" : "seu@email.com"}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    placeholder="(61) 3333-3333"
                    value={formData.telefone}
                    onChange={handleChange}
                  />
                  {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
                </div>
                {tipoUsuario === "paciente" ? (
                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento">Data de nascimento</Label>
                    <Input
                      id="dataNascimento"
                      name="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={handleChange}
                    />
                    {errors.dataNascimento && <p className="text-sm text-red-500">{errors.dataNascimento}</p>}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      placeholder="(61) 99999-9999"
                      value={formData.whatsapp}
                      onChange={handleChange}
                    />
                    {errors.whatsapp && <p className="text-sm text-red-500">{errors.whatsapp}</p>}
                  </div>
                )}
              </div>

              {tipoUsuario === "clinica" && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CepInput
                        value={formData.cep}
                        onChange={(value) => handleSelectChange("cep", value)}
                        onAddressChange={handleAddressChange}
                        error={errors.cep}
                      />
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
<<<<<<< HEAD
=======
                        readOnly
                        className="bg-muted"
>>>>>>> bd434b6a51269099a057bfa875ae8a5af832f162
                      />
                      {errors.endereco && <p className="text-sm text-red-500">{errors.endereco}</p>}
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
<<<<<<< HEAD
                          placeholder="Digite o bairro"
=======
                          readOnly
                          className="bg-muted"
>>>>>>> bd434b6a51269099a057bfa875ae8a5af832f162
                        />
                        {errors.bairro && <p className="text-sm text-red-500">{errors.bairro}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleChange}
<<<<<<< HEAD
                          placeholder="Digite a cidade"
=======
                          readOnly
                          className="bg-muted"
>>>>>>> bd434b6a51269099a057bfa875ae8a5af832f162
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="uf">UF</Label>
                        <Input
                          id="uf"
                          name="uf"
                          value={formData.uf}
                          onChange={handleChange}
<<<<<<< HEAD
                          placeholder="Ex: DF"
=======
                          readOnly
                          className="bg-muted"
>>>>>>> bd434b6a51269099a057bfa875ae8a5af832f162
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </div>

                  <HorarioFuncionamento
                    value={formData.horario}
                    onChange={(value) => handleSelectChange("horario", value)}
                    error={errors.horario}
                  />

                  <div className="space-y-2">
                    <Label>Especialidades</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {especialidades.map((especialidade) => (
                        <div key={especialidade} className="flex items-center space-x-2">
                          <Checkbox
                            id={`especialidade-${especialidade}`}
                            checked={formData.especialidadesSelecionadas.includes(especialidade)}
                            onCheckedChange={(checked) => handleEspecialidadeChange(especialidade, checked)}
                          />
                          <label
                            htmlFor={`especialidade-${especialidade}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {especialidade}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.especialidades && <p className="text-sm text-red-500">{errors.especialidades}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      name="descricao"
                      placeholder="Descreva sua clínica ou consultório"
                      rows={4}
                      value={formData.descricao}
                      onChange={handleChange}
                    />
                    {errors.descricao && <p className="text-sm text-red-500">{errors.descricao}</p>}
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="Crie uma senha"
                    value={formData.senha}
                    onChange={handleChange}
                  />
                  {errors.senha && <p className="text-sm text-red-500">{errors.senha}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                  <Input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                  />
                  {errors.confirmarSenha && <p className="text-sm text-red-500">{errors.confirmarSenha}</p>}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="aceiteLgpd" checked={formData.aceiteLgpd} onCheckedChange={handleCheckboxChange} />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="aceiteLgpd"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aceito os termos de uso e política de privacidade
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Concordo com o tratamento dos meus dados conforme a LGPD.
                  </p>
                  {errors.aceiteLgpd && <p className="text-sm text-red-500">{errors.aceiteLgpd}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Processando..." : "Criar conta"}
              </Button>
              <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <Link href="/login" className="underline text-blue-600">
                  Faça login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
