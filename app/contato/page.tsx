"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Send, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { enviarMensagem } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório"

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.assunto.trim()) newErrors.assunto = "Assunto é obrigatório"

    if (!formData.mensagem.trim()) newErrors.mensagem = "Mensagem é obrigatória"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)

      try {
        // Enviar mensagem
        await enviarMensagem({
          nome: formData.nome,
          email: formData.email,
          assunto: formData.assunto,
          mensagem: formData.mensagem,
        })

        toast({
          title: "Mensagem enviada com sucesso!",
          description: "Entraremos em contato em breve.",
        })

        // Simular tempo de processamento
        setTimeout(() => {
          setIsLoading(false)
          setEnviado(true)
        }, 1500)
      } catch (error) {
        setIsLoading(false)
        toast({
          title: "Erro ao enviar mensagem",
          description: error.message || "Ocorreu um erro ao enviar sua mensagem.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">Entre em Contato</h1>
            <p className="text-muted-foreground">Estamos aqui para ajudar. Envie-nos uma mensagem!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm">contato@agendesaude.com.br</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">Telefone</h3>
                  <p className="text-muted-foreground text-sm">(61) 3333-3333</p>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envie uma mensagem</CardTitle>
                  <CardDescription>Preencha o formulário abaixo para entrar em contato conosco</CardDescription>
                </CardHeader>

                {!enviado ? (
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome</Label>
                          <Input
                            id="nome"
                            name="nome"
                            placeholder="Seu nome completo"
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
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                          />
                          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assunto">Assunto</Label>
                        <Input
                          id="assunto"
                          name="assunto"
                          placeholder="Assunto da mensagem"
                          value={formData.assunto}
                          onChange={handleChange}
                        />
                        {errors.assunto && <p className="text-sm text-red-500">{errors.assunto}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mensagem">Mensagem</Label>
                        <Textarea
                          id="mensagem"
                          name="mensagem"
                          placeholder="Digite sua mensagem"
                          rows={5}
                          value={formData.mensagem}
                          onChange={handleChange}
                        />
                        {errors.mensagem && <p className="text-sm text-red-500">{errors.mensagem}</p>}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-all hover:shadow-md"
                        disabled={isLoading}
                      >
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
                            Enviando...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Send className="mr-2 h-4 w-4" />
                            Enviar mensagem
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                ) : (
                  <CardContent className="py-10">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-medium">Mensagem enviada com sucesso!</h3>
                      <p className="text-muted-foreground">
                        Obrigado por entrar em contato conosco. Responderemos sua mensagem o mais breve possível.
                      </p>
                      <Button
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          setEnviado(false)
                          setFormData({
                            nome: "",
                            email: "",
                            assunto: "",
                            mensagem: "",
                          })
                        }}
                      >
                        Enviar nova mensagem
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
