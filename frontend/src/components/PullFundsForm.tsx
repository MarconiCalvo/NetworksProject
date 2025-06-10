import { useState } from "react";

const PullFundsForm = () => {
  const [formData, setFormData] = useState({
    account_number: "",
    cedula: "",
    monto: 0,
    bancoDestino: { ip: "", puerto: "" },
    localAccountNumber: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "ip" || name === "puerto") {
      setFormData((prev) => ({
        ...prev,
        bancoDestino: { ...prev.bancoDestino, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("Enviando...");

    try {
      const res = await fetch("/enviar-pull-funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, monto: Number(formData.monto) }),
      });

      const data = await res.json();
      setMensaje(res.ok ? "✅ Solicitud enviada correctamente" : `❌ Error: ${data.error || "Falló la operación"}`);
    } catch (err) {
      setMensaje("❌ Error de red o del servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-center">Enviar Pull Funds</h2>

      <input name="account_number" value={formData.account_number} onChange={handleChange} placeholder="Cuenta destino" required className="input" />
      <input name="cedula" value={formData.cedula} onChange={handleChange} placeholder="Cédula" required className="input" />
      <input name="monto" type="number" value={formData.monto} onChange={handleChange} placeholder="Monto" required className="input" />
      <input name="ip" value={formData.bancoDestino.ip} onChange={handleChange} placeholder="IP del banco destino" required className="input" />
      <input name="puerto" value={formData.bancoDestino.puerto} onChange={handleChange} placeholder="Puerto" required className="input" />
      <input name="localAccountNumber" value={formData.localAccountNumber} onChange={handleChange} placeholder="Cuenta local" required className="input" />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Enviar</button>

      {mensaje && <p className="text-center mt-2 text-sm">{mensaje}</p>}
    </form>
  );
};

export default PullFundsForm;
