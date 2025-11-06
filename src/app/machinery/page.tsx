'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { machineryApi, type Machinery, type MachineryStats, MachineryType, MachineryStatus } from '@/lib/api'

export default function MachineryPage() {
  // Estados principales
  const [machinery, setMachinery] = useState<Machinery[]>([])
  const [stats, setStats] = useState<MachineryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMachinery, setEditingMachinery] = useState<Machinery | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showHorometerModal, setShowHorometerModal] = useState(false)
  const [selectedMachinery, setSelectedMachinery] = useState<Machinery | null>(null)

  // Filtros
  const [typeFilter, setTypeFilter] = useState<MachineryType | ''>('')
  const [statusFilter, setStatusFilter] = useState<MachineryStatus | ''>('')
  const [maintenanceFilter, setMaintenanceFilter] = useState<boolean | null>(null)

  // Estado del formulario principal
  const [formData, setFormData] = useState<Machinery>({
    name: '',
    code: '',
    brand: '',
    model: '',
    serial_number: '',
    year: new Date().getFullYear(),
    machinery_type: MachineryType.EXCAVADORA,
    status: MachineryStatus.OPERATIVO,
    current_location: '',
    current_project: '',
    horometer: 0,
    odometer: 0,
    operator_name: '',
    maintenance_interval_hours: 250,
    acquisition_cost: 0,
    hourly_rate: 0,
    fuel_consumption_rate: 0,
    capacity: '',
    engine_power: '',
    weight: 0,
    is_available: true,
    notes: '',
    tenant_id: 'tenant-demo'
  })

  // Estado del modal de horómetro
  const [horometerData, setHorometerData] = useState({
    horometer: 0,
    operator_name: ''
  })

  // Cargar datos al montar
  useEffect(() => {
    loadData()
  }, [typeFilter, statusFilter, maintenanceFilter])

  // Función para cargar todo
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [machineryData, statsData] = await Promise.all([
        machineryApi.getAll(
          'tenant-demo',
          typeFilter || undefined,
          statusFilter || undefined,
          maintenanceFilter ?? undefined
        ),
        machineryApi.getStats('tenant-demo')
      ])
      
      setMachinery(machineryData)
      setStats(statsData)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar datos')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Manejar cambios en formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      brand: '',
      model: '',
      serial_number: '',
      year: new Date().getFullYear(),
      machinery_type: MachineryType.EXCAVADORA,
      status: MachineryStatus.OPERATIVO,
      current_location: '',
      current_project: '',
      horometer: 0,
      odometer: 0,
      operator_name: '',
      maintenance_interval_hours: 250,
      acquisition_cost: 0,
      hourly_rate: 0,
      fuel_consumption_rate: 0,
      capacity: '',
      engine_power: '',
      weight: 0,
      is_available: true,
      notes: '',
      tenant_id: 'tenant-demo'
    })
    setEditingMachinery(null)
    setShowForm(false)
  }

  // Crear o actualizar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setError(null)
      
      if (editingMachinery && editingMachinery.id) {
        await machineryApi.update(editingMachinery.id, formData)
      } else {
        await machineryApi.create(formData)
      }
      
      await loadData()
      resetForm()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar maquinaria')
      console.error('Error saving machinery:', err)
    }
  }

  // Editar
  const handleEdit = (item: Machinery) => {
    setEditingMachinery(item)
    setFormData({
      name: item.name,
      code: item.code,
      brand: item.brand || '',
      model: item.model || '',
      serial_number: item.serial_number || '',
      year: item.year || new Date().getFullYear(),
      machinery_type: item.machinery_type,
      status: item.status || MachineryStatus.OPERATIVO,
      current_location: item.current_location || '',
      current_project: item.current_project || '',
      horometer: item.horometer || 0,
      odometer: item.odometer || 0,
      operator_name: item.operator_name || '',
      maintenance_interval_hours: item.maintenance_interval_hours || 250,
      acquisition_cost: item.acquisition_cost || 0,
      hourly_rate: item.hourly_rate || 0,
      fuel_consumption_rate: item.fuel_consumption_rate || 0,
      capacity: item.capacity || '',
      engine_power: item.engine_power || '',
      weight: item.weight || 0,
      is_available: item.is_available ?? true,
      notes: item.notes || '',
      tenant_id: item.tenant_id
    })
    setShowForm(true)
  }

  // Eliminar
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta maquinaria?')) return
    
    try {
      setError(null)
      await machineryApi.delete(id)
      await loadData()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al eliminar maquinaria')
      console.error('Error deleting machinery:', err)
    }
  }

  // Abrir modal de horómetro
  const openHorometerModal = (item: Machinery) => {
    setSelectedMachinery(item)
    setHorometerData({
      horometer: item.horometer || 0,
      operator_name: item.operator_name || ''
    })
    setShowHorometerModal(true)
  }

  // Actualizar horómetro
  const handleUpdateHorometer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedMachinery?.id) return
    
    try {
      setError(null)
      await machineryApi.updateHorometer(
        selectedMachinery.id,
        horometerData.horometer,
        horometerData.operator_name
      )
      await loadData()
      setShowHorometerModal(false)
      setSelectedMachinery(null)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al actualizar horómetro')
      console.error('Error updating horometer:', err)
    }
  }

  // Obtener color según estado
  const getStatusColor = (status: MachineryStatus) => {
    switch (status) {
      case MachineryStatus.OPERATIVO:
        return 'bg-green-100 text-green-800'
      case MachineryStatus.EN_MANTENIMIENTO:
        return 'bg-yellow-100 text-yellow-800'
      case MachineryStatus.FUERA_DE_SERVICIO:
        return 'bg-red-100 text-red-800'
      case MachineryStatus.EN_REPARACION:
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Traducir tipo de maquinaria
  const translateType = (type: MachineryType) => {
    const translations: Record<MachineryType, string> = {
      [MachineryType.EXCAVADORA]: 'Excavadora',
      [MachineryType.CARGADOR]: 'Cargador',
      [MachineryType.RETROEXCAVADORA]: 'Retroexcavadora',
      [MachineryType.BULLDOZER]: 'Bulldozer',
      [MachineryType.GRUA]: 'Grúa',
      [MachineryType.CAMION_VOLQUETA]: 'Camión Volqueta',
      [MachineryType.MOTONIVELADORA]: 'Motoniveladora',
      [MachineryType.COMPACTADORA]: 'Compactadora',
      [MachineryType.PERFORADORA]: 'Perforadora',
      [MachineryType.OTROS]: 'Otros'
    }
    return translations[type] || type
  }

  // Traducir estado
  const translateStatus = (status: MachineryStatus) => {
    const translations: Record<MachineryStatus, string> = {
      [MachineryStatus.OPERATIVO]: 'Operativo',
      [MachineryStatus.EN_MANTENIMIENTO]: 'En Mantenimiento',
      [MachineryStatus.FUERA_DE_SERVICIO]: 'Fuera de Servicio',
      [MachineryStatus.EN_REPARACION]: 'En Reparación'
    }
    return translations[status] || status
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                ← Volver
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                🚜 Gestión de Maquinaria
              </h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              {showForm ? 'Cancelar' : '+ Nueva Maquinaria'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Mensajes de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-2">🚜</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total_machinery}</div>
              <div className="text-sm text-gray-600">Total Equipos</div>
            </div>

            <div className="bg-green-50 rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-600">{stats.operational}</div>
              <div className="text-sm text-gray-600">Operativos</div>
            </div>

            <div className="bg-yellow-50 rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-2">🔧</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.in_maintenance}</div>
              <div className="text-sm text-gray-600">En Mantenimiento</div>
            </div>

            <div className="bg-red-50 rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-2xl font-bold text-red-600">{stats.needs_maintenance}</div>
              <div className="text-sm text-gray-600">Requieren Mantto.</div>
            </div>

            <div className="bg-indigo-50 rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-indigo-600">{stats.total_hours.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Horas Totales</div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Filtros</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Maquinaria
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as MachineryType | '')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                {Object.values(MachineryType).map(type => (
                  <option key={type} value={type}>{translateType(type)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as MachineryStatus | '')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                {Object.values(MachineryStatus).map(status => (
                  <option key={status} value={status}>{translateStatus(status)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mantenimiento
              </label>
              <select
                value={maintenanceFilter === null ? '' : maintenanceFilter.toString()}
                onChange={(e) => {
                  const val = e.target.value
                  setMaintenanceFilter(val === '' ? null : val === 'true')
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="true">Requiere mantenimiento</option>
                <option value="false">No requiere mantenimiento</option>
              </select>
            </div>
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {editingMachinery ? 'Editar Maquinaria' : 'Nueva Maquinaria'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Básica */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Información Básica</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ej: Excavadora CAT 320"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                      disabled={!!editingMachinery}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="Ej: EXC-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo *
                    </label>
                    <select
                      name="machinery_type"
                      value={formData.machinery_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {Object.values(MachineryType).map(type => (
                        <option key={type} value={type}>{translateType(type)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marca
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ej: Caterpillar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modelo
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ej: 320D"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Serie
                    </label>
                    <input
                      type="text"
                      name="serial_number"
                      value={formData.serial_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Serie del fabricante"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {Object.values(MachineryStatus).map(status => (
                        <option key={status} value={status}>{translateStatus(status)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Ubicación y Operación */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Ubicación y Operación</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación Actual
                    </label>
                    <input
                      type="text"
                      name="current_location"
                      value={formData.current_location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ej: Obra Norte, Bodega Central"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proyecto Actual
                    </label>
                    <input
                      type="text"
                      name="current_project"
                      value={formData.current_project}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ej: Construcción Edificio X"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Operador Asignado
                    </label>
                    <input
                      type="text"
                      name="operator_name"
                      value={formData.operator_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Nombre del operador"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horómetro (horas)
                    </label>
                    <input
                      type="number"
                      name="horometer"
                      value={formData.horometer}
                      onChange={handleInputChange}
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Odómetro (km)
                    </label>
                    <input
                      type="number"
                      name="odometer"
                      value={formData.odometer}
                      onChange={handleInputChange}
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intervalo Mantto. (horas)
                    </label>
                    <input
                      type="number"
                      name="maintenance_interval_hours"
                      value={formData.maintenance_interval_hours}
                      onChange={handleInputChange}
                      step="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="250"
                    />
                  </div>
                </div>
              </div>

              {/* Costos y Rendimiento */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Costos y Rendimiento</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo de Adquisición ($)
                    </label>
                    <input
                      type="number"
                      name="acquisition_cost"
                      value={formData.acquisition_cost}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarifa por Hora ($)
                    </label>
                    <input
                      type="number"
                      name="hourly_rate"
                      value={formData.hourly_rate}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consumo Combustible (L/h)
                    </label>
                    <input
                      type="number"
                      name="fuel_consumption_rate"
                      value={formData.fuel_consumption_rate}
                      onChange={handleInputChange}
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              {/* Especificaciones Técnicas */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Especificaciones Técnicas</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidad
                    </label>
                    <input
                      type="text"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ej: 1.5 m³"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Potencia del Motor
                    </label>
                    <input
                      type="text"
                      name="engine_power"
                      value={formData.engine_power}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ej: 150 HP"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Peso (ton)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas y Observaciones
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Información adicional..."
                />
              </div>

              {/* Disponibilidad */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Disponible para asignación
                </label>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  {editingMachinery ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Maquinaria */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Lista de Maquinaria ({machinery.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Cargando maquinaria...</p>
            </div>
          ) : machinery.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🚜</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay maquinaria registrada</h3>
              <p className="text-gray-500 mb-6">Comienza agregando tu primera maquinaria</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                + Agregar Maquinaria
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horómetro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operador
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {machinery.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          {item.brand} {item.model} • {item.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {translateType(item.machinery_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status!)}`}>
                          {translateStatus(item.status!)}
                        </span>
                        {item.needs_maintenance && (
                          <div className="text-xs text-red-600 font-semibold mt-1">
                            ⚠️ Mantenimiento
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {(item.horometer || 0).toFixed(1)} hrs
                        </div>
                        {item.hours_until_maintenance !== undefined && (
                          <div className="text-xs text-gray-500">
                            {item.hours_until_maintenance > 0 
                              ? `${item.hours_until_maintenance.toFixed(0)} hrs hasta mantto.`
                              : 'Requiere mantenimiento'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {item.current_location || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {item.operator_name || 'Sin asignar'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => openHorometerModal(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Actualizar horómetro"
                        >
                          ⏱️
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => item.id && handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal de actualización de horómetro */}
      {showHorometerModal && selectedMachinery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Actualizar Horómetro
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {selectedMachinery.name} ({selectedMachinery.code})
            </p>

            <form onSubmit={handleUpdateHorometer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo Horómetro (horas) *
                </label>
                <input
                  type="number"
                  value={horometerData.horometer}
                  onChange={(e) => setHorometerData(prev => ({ ...prev, horometer: parseFloat(e.target.value) }))}
                  required
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Actual: {(selectedMachinery.horometer || 0).toFixed(1)} hrs
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operador
                </label>
                <input
                  type="text"
                  value={horometerData.operator_name}
                  onChange={(e) => setHorometerData(prev => ({ ...prev, operator_name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nombre del operador"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowHorometerModal(false)
                    setSelectedMachinery(null)
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}