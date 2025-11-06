import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para manejo de errores global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Tipos para Customer
export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  tenant_id: string;
  created_at?: string;
  updated_at?: string;
}

// Tipos para Product
export interface Product {
  id?: string;
  name: string;
  description?: string;
  sku: string;
  category?: string;
  price: number;
  cost?: number;
  stock_min?: number;
  stock_max?: number;
  current_stock?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// API de Clientes
export const customersApi = {
  // Obtener todos los clientes
  getAll: async (tenantId: string = 'tenant-demo'): Promise<Customer[]> => {
    const response = await apiClient.get('/api/v1/customers/', {
      params: { tenant_id: tenantId }
    });
    return response.data;
  },

  // Obtener un cliente por ID
  getById: async (id: number, tenantId: string = 'tenant-demo'): Promise<Customer> => {
    const response = await apiClient.get(`/api/v1/customers/${id}`, {
      params: { tenant_id: tenantId }
    });
    return response.data;
  },

  // Crear nuevo cliente
  create: async (customer: Customer): Promise<Customer> => {
    const response = await apiClient.post('/api/v1/customers/', customer);
    return response.data;
  },

  // Actualizar cliente
  update: async (id: number, customer: Customer): Promise<Customer> => {
    const response = await apiClient.put(`/api/v1/customers/${id}`, customer);
    return response.data;
  },

  // Eliminar cliente
  delete: async (id: number, tenantId: string = 'tenant-demo'): Promise<void> => {
    await apiClient.delete(`/api/v1/customers/${id}`, {
      params: { tenant_id: tenantId }
    });
  }
};

// API de Productos
export const productsApi = {
  // Obtener todos los productos
  getAll: async (category?: string): Promise<Product[]> => {
    const params = category ? { category } : {};
    const response = await apiClient.get('/api/v1/products/', { params });
    return response.data;
  },

  // Obtener un producto por ID
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/api/v1/products/${id}`);
    return response.data;
  },

  // Crear nuevo producto
  create: async (product: Product): Promise<Product> => {
    const response = await apiClient.post('/api/v1/products/', product);
    return response.data;
  },

  // Actualizar producto
  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put(`/api/v1/products/${id}`, product);
    return response.data;
  },

  // Eliminar producto
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/products/${id}`);
  }
};

// API de IA (placeholder para futuro endpoint)
export const aiApi = {
  chat: async (message: string, tenantId: string = 'tenant-demo'): Promise<string> => {
    const response = await apiClient.post('/api/v1/ai/chat', {
      message,
      tenant_id: tenantId
    });
    return response.data.response;
  }
};
// Tipos para Machinery
export enum MachineryType {
  EXCAVADORA = "excavadora",
  CARGADOR = "cargador",
  RETROEXCAVADORA = "retroexcavadora",
  BULLDOZER = "bulldozer",
  GRUA = "grua",
  CAMION_VOLQUETA = "camion_volqueta",
  MOTONIVELADORA = "motoniveladora",
  COMPACTADORA = "compactadora",
  PERFORADORA = "perforadora",
  OTROS = "otros"
}

export enum MachineryStatus {
  OPERATIVO = "operativo",
  EN_MANTENIMIENTO = "en_mantenimiento",
  FUERA_DE_SERVICIO = "fuera_de_servicio",
  EN_REPARACION = "en_reparacion"
}

export interface Machinery {
  id?: string;
  name: string;
  code: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  year?: number;
  machinery_type: MachineryType;
  status?: MachineryStatus;
  current_location?: string;
  current_project?: string;
  horometer?: number;
  odometer?: number;
  operator_name?: string;
  operator_id?: string;
  maintenance_interval_hours?: number;
  next_maintenance_hours?: number;
  next_maintenance_date?: string;
  last_maintenance_date?: string;
  last_horometer_update?: string;
  acquisition_cost?: number;
  hourly_rate?: number;
  fuel_consumption_rate?: number;
  plate_number?: string;
  insurance_policy?: string;
  insurance_expiry?: string;
  capacity?: string;
  engine_power?: string;
  weight?: number;
  is_available?: boolean;
  is_active?: boolean;
  notes?: string;
  tenant_id: string;
  created_at?: string;
  updated_at?: string;
  needs_maintenance?: boolean;
  hours_until_maintenance?: number;
}

export interface MachineryStats {
  total_machinery: number;
  operational: number;
  in_maintenance: number;
  out_of_service: number;
  needs_maintenance: number;
  total_hours: number;
  avg_hourly_rate: number;
}

// API de Maquinaria
export const machineryApi = {
  // Obtener toda la maquinaria
  getAll: async (
    tenantId: string = 'tenant-demo',
    machineryType?: MachineryType,
    status?: MachineryStatus,
    needsMaintenance?: boolean
  ): Promise<Machinery[]> => {
    const params: any = { tenant_id: tenantId };
    if (machineryType) params.machinery_type = machineryType;
    if (status) params.status = status;
    if (needsMaintenance !== undefined) params.needs_maintenance = needsMaintenance;
    
    const response = await apiClient.get('/api/v1/machinery/', { params });
    return response.data;
  },

  // Obtener estadísticas
  getStats: async (tenantId: string = 'tenant-demo'): Promise<MachineryStats> => {
    const response = await apiClient.get('/api/v1/machinery/stats', {
      params: { tenant_id: tenantId }
    });
    return response.data;
  },

  // Obtener alertas de mantenimiento
  getAlerts: async (tenantId: string = 'tenant-demo'): Promise<Machinery[]> => {
    const response = await apiClient.get('/api/v1/machinery/alerts', {
      params: { tenant_id: tenantId }
    });
    return response.data;
  },

  // Obtener una maquinaria por ID
  getById: async (id: string): Promise<Machinery> => {
    const response = await apiClient.get(`/api/v1/machinery/${id}`);
    return response.data;
  },

  // Crear nueva maquinaria
  create: async (machinery: Machinery): Promise<Machinery> => {
    const response = await apiClient.post('/api/v1/machinery/', machinery);
    return response.data;
  },

  // Actualizar maquinaria
  update: async (id: string, machinery: Partial<Machinery>): Promise<Machinery> => {
    const response = await apiClient.put(`/api/v1/machinery/${id}`, machinery);
    return response.data;
  },

  // Actualizar horómetro
  updateHorometer: async (id: string, horometer: number, operatorName?: string): Promise<Machinery> => {
    const response = await apiClient.patch(`/api/v1/machinery/${id}/horometer`, {
      horometer,
      operator_name: operatorName
    });
    return response.data;
  },

  // Eliminar maquinaria
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/machinery/${id}`);
  }
};
export default apiClient;