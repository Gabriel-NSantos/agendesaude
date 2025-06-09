"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Phone, MessageCircle, Clock } from "lucide-react"
import Link from "next/link"
import {
  getClinicas,
  getClinicasByEspecialidade,
  getClinicasByBairro,
  getClinicasByLocalizacao,
  atualizarLocalizacaoUsuario,
} from "@/lib/storage"
import type { Clinica } from "@/lib/storage"

// API Key do Google Maps
const GOOGLE_MAPS_API_KEY = "AIzaSyB4FDi6bVZoMghHLfBQoyZXhjYWBpFcZdk"

export default function BuscaPage() {
  const { user } = useAuth()
  const [clinicas, setClinicas] = useState<Clinica[]>([])
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("Todas")
  const [filtroBairro, setFiltroBairro] = useState("Todos")
  const [loading, setLoading] = useState(false)
  const [localizacaoAtual, setLocalizacaoAtual] = useState<{ latitude: number; longitude: number } | null>(null)

  // Carregar clínicas iniciais
  useEffect(() => {
    const clinicasIniciais = getClinicas()
    setClinicas(clinicasIniciais)
  }, [])

  // Aplicar filtros
  useEffect(() => {
    let clinicasFiltradas = getClinicas()

    if (filtroEspecialidade !== "Todas") {
      clinicasFiltradas = getClinicasByEspecialidade(filtroEspecialidade)
    }

    if (filtroBairro !== "Todos") {
      clinicasFiltradas = getClinicasByBairro(filtroBairro)
    }

    setClinicas(clinicasFiltradas)
  }, [filtroEspecialidade, filtroBairro])

  const buscarPorLocalizacao = async () => {
    setLoading(true)

    try {
      if (!navigator.geolocation) {
        alert("Geolocalização não é suportada pelo seu navegador")
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setLocalizacaoAtual({ latitude, longitude })

          // Salvar localização do usuário se estiver logado
          if (user?.id) {
            atualizarLocalizacaoUsuario(user.id, latitude, longitude)
          }

          try {
            // Buscar endereço usando Google Maps API
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
            )

            if (response.ok) {
              const data = await response.json()
              if (data.results && data.results.length > 0) {
                const endereco = data.results[0].formatted_address
                console.log("Localização atual:", endereco)
              }
            }
          } catch (error) {
            console.error("Erro ao buscar endereço:", error)
          }

          // Buscar clínicas próximas (raio de 10km)
          const clinicasProximas = getClinicasByLocalizacao(latitude, longitude, 10)
          setClinicas(clinicasProximas)

          setLoading(false)
        },
        (error) => {
          console.error("Erro ao obter localização:", error)
          alert("Erro ao obter sua localização. Verifique as permissões do navegador.")
          setLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutos
        },
      )
    } catch (error) {
      console.error("Erro na busca por localização:", error)
      setLoading(false)
    }
  }

  const especialidades = [
    "Todas",
    "Clínico Geral",
    "Cardiologia",
    "Pediatria",
    "Dermatologia",
    "Ortopedia",
    "Ginecologia",
    "Psicologia",
    "Psiquiatria",
    "Fisioterapia",
    "Nutrição",
    "Neurologia",
    "Endocrinologia",
    "Oftalmologia",
    "Urologia",
    "Odontologia",
  ]

  const bairros = [
    "Todos",
    "Águas Claras",
    "Asa Norte",
    "Asa Sul",
    "Lago Norte",
    "Lago Sul",
    "Taguatinga",
    "Ceilândia",
    "Samambaia",
    "Planaltina",
    "Sobradinho",
    "Gama",
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscar Profissionais e Clínicas</h1>
        <p className="text-gray-600">Encontre os melhores profissionais de saúde na sua região</p>
      </div>

      {/* Filtros */}
      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Especialidade</label>
            <Select value={filtroEspecialidade} onValueChange={setFiltroEspecialidade}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma especialidade" />
              </SelectTrigger>
              <SelectContent>
                {especialidades.map((especialidade) => (
                  <SelectItem key={especialidade} value={especialidade}>
                    {especialidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
            <Select value={filtroBairro} onValueChange={setFiltroBairro}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um bairro" />
              </SelectTrigger>
              <SelectContent>
                {bairros.map((bairro) => (
                  <SelectItem key={bairro} value={bairro}>
                    {bairro}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={buscarPorLocalizacao} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Buscando...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Buscar clínicas próximo a mim
                </>
              )}
            </Button>
          </div>
        </div>

        {localizacaoAtual && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <MapPin className="h-4 w-4 inline mr-1" />
              Mostrando clínicas próximas à sua localização atual
            </p>
          </div>
        )}
      </div>

      {/* Resultados */}
      <div className="space-y-6">
        {clinicas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma clínica encontrada com os filtros selecionados.</p>
            <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros ou buscar por localização.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {clinicas.length} {clinicas.length === 1 ? "resultado encontrado" : "resultados encontrados"}
              </h2>
            </div>

            <div className="grid gap-6">
              {clinicas.map((clinica) => (
                <Card key={clinica.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-blue-900">{clinica.nome}</CardTitle>
                        <CardDescription className="flex items-center mt-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {clinica.endereco}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="font-semibold">{clinica.avaliacao.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Especialidades:</h4>
                        <div className="flex flex-wrap gap-2">
                          {clinica.especialidades.map((especialidade) => (
                            <Badge key={especialidade} variant="secondary">
                              {especialidade}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{clinica.horario}</span>
                      </div>

                      <p className="text-gray-600">{clinica.descricao}</p>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Link href={`/clinica/${clinica.id}`} className="flex-1">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Detalhes</Button>
                        </Link>

                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(`https://wa.me/${clinica.whatsapp.replace(/\D/g, "")}`, "_blank")}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>

                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(`tel:${clinica.telefone}`, "_self")}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Ligar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
