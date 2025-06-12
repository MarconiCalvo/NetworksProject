import React, { useState } from "react";

interface PullFundsData {
  account_number: string;
  cedula: string;
  monto: string;
  localAccountNumber: string;
  bancoDestino: {
    ip: string;
    puerto: number;
  };
}

const PullFundsForm: React.FC = () => {
  const [form, setForm] = useState<PullFundsData>({
    account_number: "",
    cedula: "",
    monto: "",
    localAccountNumber: "",
    bancoDestino: {
      ip: "",
      puerto: 3443,
    },
  });

  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "ip" || name === "puerto") {
      setForm((prev) => ({
        ...prev,
        bancoDestino: {
          ...prev.bancoDestino,
          [name]: name === "puerto" ? parseInt(value) : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Usar la URL completa del backend
      const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:3001';
      console.log('Enviando solicitud a:', `${API_URL}/pull-funds`);
      
      const res = await fetch(`${API_URL}/pull-funds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(form),
        credentials: 'include'
      });

      // Verificar el tipo de contenido de la respuesta
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La respuesta del servidor no es JSON válido");
      }

      const data = await res.json();

      if (res.ok) {
        setResponse({ status: "ACK", message: data.message });
      } else {
        setResponse({ 
          status: "ERROR", 
          message: data.error || data.message || "Error desconocido" 
        });
        console.error('Error en la respuesta:', data);
      }
    } catch (err: any) {
      console.error('Error de conexión:', err);
      setError(err.message || "Error al conectar con el servidor. Verifica que el servidor esté corriendo y la URL sea correcta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 20 }}>
      <h2>🔁 Solicitud de Pull Funds</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            name="account_number"
            value={form.account_number}
            onChange={handleChange}
            placeholder="Cuenta origen (otro banco)"
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <input
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
            placeholder="Cédula"
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <input
            name="monto"
            value={form.monto}
            onChange={handleChange}
            placeholder="Monto"
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <input
            name="localAccountNumber"
            value={form.localAccountNumber}
            onChange={handleChange}
            placeholder="Cuenta local (acreditada)"
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <input
            name="ip"
            value={form.bancoDestino.ip}
            onChange={handleChange}
            placeholder="IP Banco destino"
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <input
            name="puerto"
            type="number"
            value={form.bancoDestino.puerto}
            onChange={handleChange}
            placeholder="Puerto"
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {response && (
        <div style={{ 
          marginTop: "1rem", 
          padding: "1rem",
          borderRadius: "4px",
          backgroundColor: response.status === "ACK" ? "#d4edda" : "#f8d7da",
          color: response.status === "ACK" ? "#155724" : "#721c24"
        }}>
          <strong>{response.status}:</strong> {response.message}
        </div>
      )}
      {error && (
        <div style={{ 
          marginTop: "1rem", 
          padding: "1rem",
          borderRadius: "4px",
          backgroundColor: "#f8d7da",
          color: "#721c24"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default PullFundsForm;
