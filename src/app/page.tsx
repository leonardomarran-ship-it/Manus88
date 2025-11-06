import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo y título */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              MANUS88
            </h1>
            <p className="text-2xl text-gray-600">ERP + Inteligencia Artificial</p>
          </div>

          {/* Descripción */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <p className="text-lg text-gray-700 mb-6">
              Sistema de gestión empresarial multi-tenant con capacidades de IA integradas.
              Administra clientes, productos, reportes y más desde una sola plataforma.
            </p>
            
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-indigo-50 rounded-xl">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-indigo-900 mb-2">Dashboard</h3>
                <p className="text-sm text-gray-600">Visualiza tus métricas en tiempo real</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="font-semibold text-purple-900 mb-2">Clientes</h3>
                <p className="text-sm text-gray-600">Gestión completa de clientes</p>
              </div>
              
              <div className="p-4 bg-indigo-50 rounded-xl">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold text-indigo-900 mb-2">IA Asistente</h3>
                <p className="text-sm text-gray-600">Consultas inteligentes sobre tu negocio</p>
              </div>
            </div>

            {/* CTA Button */}
            <Link 
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-full hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Ir al Dashboard →
            </Link>
          </div>

          {/* Footer info */}
          <div className="text-sm text-gray-500">
            Versión 1.0 - Multi-tenant ERP System
          </div>
        </div>
      </div>
    </main>
  )
}