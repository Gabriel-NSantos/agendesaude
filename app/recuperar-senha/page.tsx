"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, ArrowLeft, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    setError("")
  }

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email é obrigatório")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email inválido")
      return false
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Aqui seria implementada a lógica de recuperação de senha
      console.log("Email para recuperação:", email)

      // Simular envio bem-sucedido
      setTimeout(() => {
        setSubmitted(true)
      }, 1000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar para login
              </Link>
              <div className="flex items-center gap-2 text-blue-600">
                <Calendar className="h-5 w-5" />
                <span className="font-bold">AgendeSaúde</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Recuperar senha</CardTitle>
            <CardDescription>
              {!submitted
                ? "Digite seu email para receber instruções de recuperação de senha"
                : "Verifique seu email para redefinir sua senha"}
            </CardDescription>
          </CardHeader>
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={handleChange} />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Enviar instruções
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-center">
                  Enviamos um email para <strong>{email}</strong> com instruções para redefinir sua senha.
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Se você não receber o email em alguns minutos, verifique sua pasta de spam.
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
