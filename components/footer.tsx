import Link from "next/link"
import { Calendar } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-24">
        <div className="flex items-center gap-2 text-lg font-semibold text-blue-600">
          <Calendar className="h-5 w-5" />
          <span>AgendeSaúde</span>
        </div>
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 AgendeSaúde. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/termos" className="text-sm text-muted-foreground hover:underline">
            Termos de Uso
          </Link>
          <Link href="/privacidade" className="text-sm text-muted-foreground hover:underline">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  )
}
