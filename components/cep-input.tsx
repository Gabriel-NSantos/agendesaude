"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface CepInputProps {
  value: string
  onChange: (value: string) => void
  onAddressChange: (address: {
    endereco: string
    bairro: string
    cidade: string
    uf: string
  }) => void
  disabled?: boolean
}

export function CepInput({ value, onChange, onAddressChange, disabled }: CepInputProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const formatCep = (cep: string) => {
    const numbers = cep.replace(/\D/g, "")
    if (numbers.length <= 5) {
      return numbers
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCep(e.target.value)
    onChange(formattedCep)
    setError("")

    // Se o CEP estiver completo (8 dígitos), buscar endereço
    const numbersOnly = formattedCep.replace(/\D/g, "")
    if (numbersOnly.length === 8) {
      setLoading(true)
      try {
        const response = await fetch(`https://viacep.com.br/ws/${numbersOnly}/json/`)
        const data = await response.json()

        if (data.erro) {
          setError("CEP não encontrado")
        } else {
          onAddressChange({
            endereco: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            uf: data.uf || "",
          })
        }
      } catch (error) {
        setError("Erro ao buscar CEP")
        console.error("Erro ao buscar CEP:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="cep">CEP</Label>
      <div className="relative">
        <Input
          id="cep"
          name="cep"
          placeholder="00000-000"
          value={value}
          onChange={handleCepChange}
          maxLength={9}
          disabled={disabled || loading}
          className={error ? "border-red-500" : ""}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Digite o CEP para preenchimento automático ou preencha manualmente os campos abaixo
      </p>
    </div>
  )
}
