'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { customersApi, productsApi } from '@/lib/api'

// Datos de ejemplo para el gráfico (más adelante vendrán del backend)
const chartData = [
  { mes: 'Ene', ventas: 4000, clientes: 20 },
  { mes: 'Feb', ventas: 3000, clientes: 25 },
  { mes: 'Mar', ventas: 5000, clientes: 30 },
  { mes: 'Abr', ventas: 4500, clientes: 35 },
  { mes: 'May', ventas: 6000, clientes: 40 },
  { mes: 'Jun', ventas: 5500, clientes: 45 },
]

export default function DashboardPage() {
  const [customersCount, setCustomersCount] = useState<number>(0)
  const [productsCount, setProductsCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [customers, products] = await Promise.all([
        customersApi.getAll(),
        productsApi.getAll()
      ])
      setCustomersCount(customers.length)
      setProductsCount(products.length)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header con navegación */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                ← Inicio
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MANUS88 Dashboard
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Tenant: <span className="font-semibold text-indigo-600">tenant-demo</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Menú de navegación rápida */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link
            href="/customers"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-2 border-transparent hover:border-indigo-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">👥</div>
              <div className="text-2xl font-bold text-indigo-600">
                {loading ? '...' : customersCount}
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">Clientes</h3>
            <p className="text-sm text-gray-500 mt-1">Gestiona tus clientes</p>
          </Link>

          <Link
            href="/products"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-2 border-transparent hover:border-purple-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📦</div>
              <div className="text-2xl font-bold text-purple-600">
                {loading ? '...' : productsCount}
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">Productos</h3>
            <p className="text-sm text-gray-500 mt-1">Administra inventario</p>
          </Link>

          <Link
            href="/reports"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-2 border-transparent hover:border-indigo-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📊</div>
              <div className="text-2xl font-bold text-indigo-600">12</div>
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">Reportes</h3>
            <p className="text-sm text-gray-500 mt-1">Análisis y métricas</p>
          </Link>

          <Link
            href="/ai"
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">🤖</div>
              <div className="text-2xl font-bold">IA</div>
            </div>
            <h3 className="font-semibold text-lg">Asistente IA</h3>
            <p className="text-sm text-indigo-100 mt-1">Consultas inteligentes</p>
          </Link>
        </div>

        {/* Gráfico de métricas */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Métricas del Último Semestre
          </h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="mes" 
                  stroke="#6b7280"
                  style={{ fontSize: '14px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '14px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  name="Ventas ($)"
                  dot={{ fill: '#6366f1', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clientes" 
                  stroke="#a855f7" 
                  strokeWidth={3}
                  name="Nuevos Clientes"
                  dot={{ fill: '#a855f7', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-sm text-gray-500 mt-4 text-center">
            * Datos de ejemplo - Próximamente se conectarán métricas reales
          </p>
        </div>

        {/* Actividad reciente */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Últimos clientes */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center">
              <span className="mr-2">👥</span> Clientes Recientes
            </h3>
            <div className="space-y-3">
              {loading ? (
                <p className="text-gray-500 text-sm">Cargando...</p>
              ) : customersCount === 0 ? (
                <p className="text-gray-500 text-sm">No hay clientes aún</p>
              ) : (
                <p className="text-gray-600 text-sm">
                  Total de clientes registrados: <span className="font-semibold text-indigo-600">{customersCount}</span>
                </p>
              )}
              <Link
                href="/customers"
                className="inline-block text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2"
              >
                Ver todos los clientes →
              </Link>
            </div>
          </div>

          {/* Productos destacados */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center">
              <span className="mr-2">📦</span> Estado de Inventario
            </h3>
            <div className="space-y-3">
              {loading ? (
                <p className="text-gray-500 text-sm">Cargando...</p>
              ) : productsCount === 0 ? (
                <p className="text-gray-500 text-sm">No hay productos aún</p>
              ) : (
                <p className="text-gray-600 text-sm">
                  Total de productos en inventario: <span className="font-semibold text-purple-600">{productsCount}</span>
                </p>
              )}
              <Link
                href="/products"
                className="inline-block text-purple-600 hover:text-purple-700 text-sm font-medium mt-2"
              >
                Ver todos los productos →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}