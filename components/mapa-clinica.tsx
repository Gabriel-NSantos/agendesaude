"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface MapaClinicaProps {
  endereco: string
  nome: string
  latitude?: number
  longitude?: number
}

interface LocationIQResponse {
  lat: string
  lon: string
  display_name: string
  address?: {
    road?: string
    suburb?: string
    city?: string
    state?: string
    postcode?: string
  }
}

export function MapaClinica({ endereco, nome, latitude, longitude }: MapaClinicaProps) {
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lon: number } | null>(null)
  const [enderecoCompleto, setEnderecoCompleto] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [erro, setErro] = useState<string>("")

  // API Key do LocationIQ
  const LOCATIONIQ_API_KEY = "pk.2c9f6afd5ab0f7a602ff9b368df2b430"

  useEffect(() => {
    // Se já temos coordenadas, usar elas
    if (latitude && longitude) {
      setCoordenadas({ lat: latitude, lon: longitude })
      setEnderecoCompleto(endereco)
      return
    }

    // Caso contrário, buscar coordenadas pelo endereço
    buscarCoordenadas()
  }, [endereco, latitude, longitude])

  const buscarCoordenadas = async () => {
    if (!endereco) return

    setIsLoading(true)
    setErro("")

    try {
      // Limpar e formatar o endereço para a busca
      const enderecoFormatado = endereco.replace(/\s+/g, "+").replace(/,/g, "").trim()

      const url = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${enderecoFormatado}&format=json&limit=1&countrycodes=br`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data: LocationIQResponse[] = await response.json()

      if (data && data.length > 0) {
        const resultado = data[0]
        setCoordenadas({
          lat: Number.parseFloat(resultado.lat),
          lon: Number.parseFloat(resultado.lon),
        })
        setEnderecoCompleto(resultado.display_name || endereco)
      } else {
        setErro("Localização não encontrada")
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error)
      setErro("Erro ao carregar localização")
      toast({
        title: "Erro",
        description: "Não foi possível carregar a localização da clínica.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const abrirNoGoogleMaps = () => {
    if (!coordenadas) return

    const url = `https://www.google.com/maps/search/?api=1&query=${coordenadas.lat},${coordenadas.lon}`
    window.open(url, "_blank")
  }

  const abrirDirecoes = () => {
    if (!coordenadas) return

    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordenadas.lat},${coordenadas.lon}`
    window.open(url, "_blank")
  }

  const obterMinhaLocalizacao = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Erro",
        description: "Geolocalização não é suportada pelo seu navegador.",
        variant: "destructive",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: userLat, longitude: userLon } = position.coords

        if (coordenadas) {
          const url = `https://www.google.com/maps/dir/${userLat},${userLon}/${coordenadas.lat},${coordenadas.lon}`
          window.open(url, "_blank")
        }
      },
      (error) => {
        console.error("Erro ao obter localização:", error)
        toast({
          title: "Erro",
          description: "Não foi possível obter sua localização.",
          variant: "destructive",
        })
      },
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando localização...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (erro && !coordenadas) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Localização indisponível</h3>
              <p className="text-muted-foreground mb-4">{erro}</p>
              <Button onClick={buscarCoordenadas} variant="outline">
                Tentar novamente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Informações do endereço */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Localização</h3>
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{nome}</p>
                <p className="text-muted-foreground text-sm">{enderecoCompleto || endereco}</p>
                {coordenadas && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Coordenadas: {coordenadas.lat.toFixed(6)}, {coordenadas.lon.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mapa estático usando LocationIQ */}
          {coordenadas && (
            <div className="relative">
              <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={`https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=${coordenadas.lat},${coordenadas.lon}&zoom=15&size=600x300&format=png&markers=icon:large-red-cutout|${coordenadas.lat},${coordenadas.lon}`}
                  alt={`Mapa da localização de ${nome}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={abrirNoGoogleMaps}
                  onError={(e) => {
                    // Fallback para mapa básico se a imagem falhar
                    const target = e.target as HTMLImageElement
                    target.src = `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=${coordenadas.lat},${coordenadas.lon}&zoom=13&size=600x300&format=png`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                    <p className="text-sm font-medium text-gray-800">Clique para abrir no Google Maps</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          {coordenadas && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={abrirNoGoogleMaps} className="flex-1" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir no Google Maps
              </Button>
              <Button onClick={obterMinhaLocalizacao} className="flex-1" variant="outline">
                <Navigation className="h-4 w-4 mr-2" />
                Como chegar
              </Button>
            </div>
          )}

          {/* Informações adicionais */}
          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>• Clique no mapa para abrir no Google Maps</p>
            <p>• Use "Como chegar" para obter direções da sua localização</p>
            <p>• Mapa fornecido por LocationIQ</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
