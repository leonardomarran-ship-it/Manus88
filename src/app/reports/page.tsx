'use client'

import Link from 'next/link'

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                ← Volver
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Reportes y Análisis
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Centro de Reportes
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Próximamente podrás acceder a reportes detallados de ventas, clientes,
            inventario y análisis predictivos con IA.
          </p>
          <div className="inline-block bg-indigo-50 border border-indigo-200 rounded-lg px-6 py-3 text-indigo-700">
            🚧 En desarrollo
          </div>
        </div>
      </main>
    </div>
  )
}