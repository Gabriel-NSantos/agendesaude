"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getUsuarioById, type Usuario } from "@/lib/storage"

interface AuthContextType {
  usuario: Usuario | null
  isLoading: boolean
  login: (usuario: Usuario) => void
  logout: () => void
  updateUserData: (userData: Partial<Usuario>) => void
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUserData: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const checkAuth = () => {
      const usuarioLogado = localStorage.getItem("usuarioLogado")

      if (usuarioLogado) {
        try {
          const usuarioObj = JSON.parse(usuarioLogado)
          const usuarioCompleto = getUsuarioById(usuarioObj.id)

          if (usuarioCompleto) {
            setUsuario(usuarioCompleto)
          } else {
            // Usuário não encontrado, limpar localStorage
            localStorage.removeItem("usuarioLogado")
            setUsuario(null)
          }
        } catch (error) {
          // Erro ao processar dados do usuário, limpar localStorage
          localStorage.removeItem("usuarioLogado")
          setUsuario(null)
        }
      } else {
        setUsuario(null)
      }

      setIsLoading(false)
    }

    checkAuth()

    // Adicionar listener para mudanças no localStorage (para sincronização entre abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "usuarioLogado") {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const login = (usuarioData: Usuario) => {
    // Salvar informação de login no localStorage
    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify({
        id: usuarioData.id,
        nome: usuarioData.nome,
        email: usuarioData.email,
        tipo: usuarioData.tipo,
        fotoPerfil: usuarioData.fotoPerfil,
      }),
    )

    setUsuario(usuarioData)
  }

  const logout = () => {
    localStorage.removeItem("usuarioLogado")
    setUsuario(null)

    // Redirecionar para a página inicial se estiver em uma página protegida
    if (pathname.startsWith("/perfil") || pathname.startsWith("/painel-clinica")) {
      router.push("/")
    }
  }

  // Função para atualizar dados do usuário no contexto
  const updateUserData = (userData: Partial<Usuario>) => {
    if (!usuario) return

    const updatedUser = { ...usuario, ...userData }
    setUsuario(updatedUser)

    // Atualizar também no localStorage para manter consistência
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || "{}")
    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify({
        ...usuarioLogado,
        ...userData,
      }),
    )
  }

  return (
    <AuthContext.Provider value={{ usuario, isLoading, login, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  )
}
