"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface HorarioFuncionamentoProps {
  value: string
  onChange: (value: string) => void
}

interface DiaHorario {
  dia: string
  ativo: boolean
  abertura: string
  fechamento: string
}

const diasSemana = [
  { key: "segunda", label: "Segunda-feira" },
  { key: "terca", label: "Terça-feira" },
  { key: "quarta", label: "Quarta-feira" },
  { key: "quinta", label: "Quinta-feira" },
  { key: "sexta", label: "Sexta-feira" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
]

const horarios = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return [`${hour}:00`, `${hour}:30`]
}).flat()

export function HorarioFuncionamento({ value, onChange }: HorarioFuncionamentoProps) {
  const [horarios24h, setHorarios24h] = useState(false)
  const [diasHorarios, setDiasHorarios] = useState<DiaHorario[]>(
    diasSemana.map((dia) => ({
      dia: dia.key,
      ativo: false,
      abertura: "08:00",
      fechamento: "18:00",
    })),
  )

  // Função para gerar string de horário
  const gerarStringHorario = () => {
    if (horarios24h) {
      onChange("24 horas")
      return
    }

    const diasAtivos = diasHorarios.filter((d) => d.ativo)
    if (diasAtivos.length === 0) {
      onChange("")
      return
    }

    // Agrupar dias consecutivos com mesmo horário
    const grupos: { dias: string[]; horario: string }[] = []

    diasAtivos.forEach((dia) => {
      const horario = `${dia.abertura} - ${dia.fechamento}`
      const grupoExistente = grupos.find((g) => g.horario === horario)

      if (grupoExistente) {
        grupoExistente.dias.push(dia.dia)
      } else {
        grupos.push({ dias: [dia.dia], horario })
      }
    })

    // Formatar string final
    const stringHorario = grupos
      .map((grupo) => {
        const diasFormatados = grupo.dias.map((dia) => {
          const diaObj = diasSemana.find((d) => d.key === dia)
          return diaObj ? diaObj.label : dia
        })

        let diasTexto = ""
        if (diasFormatados.length === 1) {
          diasTexto = diasFormatados[0]
        } else if (diasFormatados.length === 2) {
          diasTexto = diasFormatados.join(" e ")
        } else {
          // Verificar se são dias consecutivos
          const diasConsecutivos = verificarDiasConsecutivos(grupo.dias)
          if (diasConsecutivos) {
            diasTexto = `${diasFormatados[0]} a ${diasFormatados[diasFormatados.length - 1]}`
          } else {
            diasTexto = diasFormatados.join(", ")
          }
        }

        return `${diasTexto}: ${grupo.horario}`
      })
      .join(", ")

    onChange(stringHorario)
  }

  const verificarDiasConsecutivos = (dias: string[]): boolean => {
    const indices = dias.map((dia) => diasSemana.findIndex((d) => d.key === dia)).sort((a, b) => a - b)

    for (let i = 1; i < indices.length; i++) {
      if (indices[i] - indices[i - 1] !== 1) {
        return false
      }
    }
    return true
  }

  useEffect(() => {
    gerarStringHorario()
  }, [diasHorarios, horarios24h])

  const handleDiaChange = (dia: string, checked: boolean) => {
    setDiasHorarios((prev) => prev.map((d) => (d.dia === dia ? { ...d, ativo: checked } : d)))
  }

  const handleHorarioChange = (dia: string, tipo: "abertura" | "fechamento", valor: string) => {
    setDiasHorarios((prev) => prev.map((d) => (d.dia === dia ? { ...d, [tipo]: valor } : d)))
  }

  return (
    <div className="space-y-4">
      <Label>Horário de Funcionamento *</Label>

      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Opção 24 horas */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="24h"
              checked={horarios24h}
              onCheckedChange={(checked) => {
                setHorarios24h(checked as boolean)
                if (checked) {
                  setDiasHorarios((prev) => prev.map((d) => ({ ...d, ativo: false })))
                }
              }}
            />
            <Label htmlFor="24h" className="font-medium">
              Funcionamento 24 horas
            </Label>
          </div>

          {!horarios24h && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Selecione os dias e horários:</Label>

              {diasSemana.map((dia) => (
                <div key={dia.key} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 min-w-[140px]">
                    <Checkbox
                      id={dia.key}
                      checked={diasHorarios.find((d) => d.dia === dia.key)?.ativo || false}
                      onCheckedChange={(checked) => handleDiaChange(dia.key, checked as boolean)}
                    />
                    <Label htmlFor={dia.key} className="text-sm">
                      {dia.label}
                    </Label>
                  </div>

                  {diasHorarios.find((d) => d.dia === dia.key)?.ativo && (
                    <div className="flex items-center space-x-2">
                      <Select
                        value={diasHorarios.find((d) => d.dia === dia.key)?.abertura || "08:00"}
                        onValueChange={(valor) => handleHorarioChange(dia.key, "abertura", valor)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {horarios.map((horario) => (
                            <SelectItem key={horario} value={horario}>
                              {horario}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span className="text-sm text-muted-foreground">às</span>

                      <Select
                        value={diasHorarios.find((d) => d.dia === dia.key)?.fechamento || "18:00"}
                        onValueChange={(valor) => handleHorarioChange(dia.key, "fechamento", valor)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {horarios.map((horario) => (
                            <SelectItem key={horario} value={horario}>
                              {horario}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Preview do horário */}
          {value && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <Label className="text-sm font-medium">Preview:</Label>
              <p className="text-sm text-muted-foreground mt-1">{value}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
