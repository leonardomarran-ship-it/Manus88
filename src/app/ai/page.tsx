'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de IA para MANUS88. Puedo ayudarte a consultar información sobre tus clientes, productos y generar insights de tu negocio. ¿En qué puedo ayudarte?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputMessage.trim()) return

    // Agregar mensaje del usuario
    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    // Simular respuesta de IA (más adelante conectar con el backend)
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: 'Esta es una respuesta simulada. Próximamente me conectaré con el endpoint /api/v1/ai/chat del backend para procesar tu consulta con IA real y acceso a la base de datos del ERP.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setLoading(false)
    }, 1500)
  }

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
                🤖 Asistente IA
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Conectado</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="text-2xl">
                        {message.role === 'user' ? '👤' : '🤖'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">🤖</div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe tu consulta aquí..."
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  Enviar
                </button>
              </form>

              {/* Sugerencias */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setInputMessage('¿Cuántos clientes tengo registrados?')}
                  className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
                >
                  💡 ¿Cuántos clientes tengo?
                </button>
                <button
                  onClick={() => setInputMessage('Muéstrame las ventas del último mes')}
                  className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
                >
                  💡 Ventas del mes
                </button>
                <button
                  onClick={() => setInputMessage('¿Qué productos están bajos en stock?')}
                  className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
                >
                  💡 Stock bajo
                </button>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <p className="text-sm text-indigo-700">
              <strong>🚧 Nota:</strong> El asistente de IA está en modo demo. 
              Próximamente se conectará con el endpoint real del backend para consultas inteligentes sobre tu ERP.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}