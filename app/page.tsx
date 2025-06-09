import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Star, ArrowRight, Phone } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Agende consultas médicas com facilidade
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Conectamos você aos melhores profissionais de saúde em Brasília-DF. Busque por especialidade, veja
                    avaliações e agende diretamente pelo WhatsApp.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/busca">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transition-all hover:shadow-md">
                      Buscar Especialistas
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/cadastro-clinica">
                    <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                      Sou Profissional de Saúde
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <Image
<<<<<<< HEAD
                  src="/clinica-girona-pmmt_3.jpg"
=======
                  src="/placeholder.svg?height=550&width=550"
>>>>>>> bd434b6a51269099a057bfa875ae8a5af832f162
                  width={550}
                  height={550}
                  alt="Médicos e pacientes"
                  className="rounded-lg object-cover shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Como Funciona</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Agendar uma consulta nunca foi tão simples. Siga os passos abaixo e cuide da sua saúde.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Busque Especialistas</h3>
                <p className="text-center text-muted-foreground">
                  Encontre profissionais de saúde por especialidade e localização em Brasília-DF.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Star className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Compare Avaliações</h3>
                <p className="text-center text-muted-foreground">
                  Veja avaliações de outros pacientes e escolha o profissional ideal para você.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Agende via WhatsApp</h3>
                <p className="text-center text-muted-foreground">
                  Agende sua consulta diretamente pelo WhatsApp com a clínica ou profissional escolhido.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Especialidades</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Encontre profissionais de diversas especialidades médicas para cuidar da sua saúde.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 py-12 md:grid-cols-3 lg:grid-cols-4">
              {[
                "Clínico Geral",
                "Pediatria",
                "Ginecologia",
                "Cardiologia",
                "Dermatologia",
                "Ortopedia",
                "Psicologia",
                "Nutrição",
              ].map((especialidade) => (
                <Link
                  key={especialidade}
                  href={`/busca?especialidade=${especialidade}`}
                  className="flex flex-col items-center space-y-2 rounded-lg border p-4 shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-blue-50 transition-all"
                >
                  <h3 className="text-lg font-medium">{especialidade}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="mx-auto lg:mx-0 relative">
                <Image
<<<<<<< HEAD
                  src="/foto-homem-branco.jpg"
=======
                  src="/placeholder.svg?height=550&width=550"
>>>>>>> bd434b6a51269099a057bfa875ae8a5af832f162
                  width={550}
                  height={550}
                  alt="Clínicas parceiras"
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Para Clínicas e Profissionais
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Aumente sua visibilidade e receba mais pacientes. Cadastre seu perfil ou clínica no AgendeSaúde.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>Perfil institucional completo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>Gerenciamento de atendimentos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>Integração com WhatsApp</span>
                  </li>
                </ul>
                <div>
                  <Link href="/cadastro-clinica">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transition-all hover:shadow-md">
                      Cadastrar Minha Clínica
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function Check(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
