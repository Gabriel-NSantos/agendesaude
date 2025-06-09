import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Star, Phone, MapPin, CheckCircle, HelpCircle, User, Building, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ComoFuncionaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Sobre o AgendeSaúde</h1>
            <p className="text-xl text-muted-foreground">
              Entenda como nossa plataforma conecta pacientes e profissionais de saúde de forma simples e eficiente
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />O que é o AgendeSaúde?
                </CardTitle>
                <CardDescription>Uma plataforma completa para agendamento de consultas médicas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  O AgendeSaúde é uma plataforma digital que conecta pacientes a clínicas e profissionais de saúde em
                  Brasília-DF. Nossa missão é facilitar o acesso à saúde, tornando o processo de encontrar e agendar
                  consultas médicas mais simples, rápido e eficiente.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-2">Para Pacientes</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Busca de profissionais por especialidade e localização</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Avaliações reais de outros pacientes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Agendamento direto via WhatsApp</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-2">Para Clínicas</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Perfil completo para divulgar seus serviços</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Gerenciamento de profissionais e avaliações</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Controle de agendamentos e atendimentos</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Como funciona para pacientes
                </CardTitle>
                <CardDescription>Encontre o profissional ideal para suas necessidades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <Search className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium">1. Busque especialistas</h3>
                    <p className="text-sm text-muted-foreground">
                      Encontre profissionais por especialidade, localização ou proximidade da sua localização atual.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <Star className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium">2. Compare avaliações</h3>
                    <p className="text-sm text-muted-foreground">
                      Veja avaliações de outros pacientes e escolha o profissional ideal para você.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium">3. Agende via WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">
                      Agende sua consulta diretamente pelo WhatsApp com a clínica ou profissional escolhido.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Cadastro de pacientes
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">Ao se cadastrar no AgendeSaúde, você pode:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Salvar clínicas e profissionais favoritos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Avaliar clínicas e profissionais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Gerenciar seu histórico de consultas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Receber lembretes de consultas</span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Link href="/cadastro">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Criar conta de paciente
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Como funciona para clínicas
                </CardTitle>
                <CardDescription>Aumente sua visibilidade e receba mais pacientes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium">1. Cadastre sua clínica</h3>
                    <p className="text-sm text-muted-foreground">
                      Crie um perfil completo com informações sobre sua clínica, especialidades e profissionais.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium">2. Gerencie profissionais</h3>
                    <p className="text-sm text-muted-foreground">
                      Adicione os profissionais que atendem na sua clínica, com suas especialidades e horários.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium">3. Controle agendamentos</h3>
                    <p className="text-sm text-muted-foreground">
                      Gerencie os agendamentos recebidos e responda às avaliações dos pacientes.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    Painel da Clínica
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">No painel administrativo da clínica, você pode:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Atualizar informações do perfil da clínica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Adicionar, editar e remover profissionais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Gerenciar agendamentos de pacientes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Responder às avaliações dos pacientes</span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Link href="/cadastro">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Cadastrar minha clínica
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    Permanência no AgendeSaúde
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Ao cadastrar sua clínica no AgendeSaúde, ela permanecerá visível para todos os pacientes até que
                    você decida encerrar sua conta. Não removemos clínicas automaticamente, garantindo que você mantenha
                    sua visibilidade e continue recebendo agendamentos enquanto desejar.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  Sistema de avaliações
                </CardTitle>
                <CardDescription>Avaliações reais de pacientes para ajudar na sua escolha</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Todos os profissionais e clínicas cadastrados podem receber avaliações dos pacientes. Isso ajuda você
                  a escolher o melhor profissional com base em experiências reais.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Avaliações com notas de 1 a 5 estrelas</li>
                  <li>Comentários detalhados sobre o atendimento</li>
                  <li>Possibilidade de resposta do profissional</li>
                  <li>Avaliações verificadas de pacientes reais</li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    Como funciona para clínicas
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    As clínicas podem responder às avaliações dos pacientes, oferecendo esclarecimentos ou agradecendo
                    pelo feedback. Isso ajuda a construir uma relação de confiança com os pacientes e demonstra o
                    compromisso com a qualidade do atendimento.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Agendamento simplificado
                </CardTitle>
                <CardDescription>Marque consultas diretamente pelo WhatsApp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Após encontrar o profissional ideal, você pode agendar sua consulta diretamente pelo WhatsApp. Basta
                  clicar no botão "Agendar" e você será direcionado para uma conversa com a clínica ou profissional.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    Por que usamos o WhatsApp?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    O WhatsApp é uma ferramenta familiar e acessível para a maioria das pessoas. Isso facilita a
                    comunicação direta entre pacientes e profissionais, permitindo esclarecimento de dúvidas e
                    negociação de horários de forma mais pessoal e eficiente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Focado em Brasília-DF
            </h2>
            <p className="mb-4">
              O AgendeSaúde é uma plataforma focada em conectar pacientes e profissionais de saúde em Brasília-DF.
              Conhecemos as particularidades da região e trabalhamos para oferecer a melhor experiência para nossos
              usuários locais.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Cobertura completa</h3>
                <p className="text-sm text-muted-foreground">
                  Atendemos todas as regiões administrativas de Brasília-DF, do Plano Piloto às cidades satélites.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Profissionais locais</h3>
                <p className="text-sm text-muted-foreground">
                  Todos os profissionais cadastrados são verificados e atuam na região de Brasília-DF.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Busca por proximidade</h3>
                <p className="text-sm text-muted-foreground">
                  Encontre profissionais próximos à sua localização atual para maior comodidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
