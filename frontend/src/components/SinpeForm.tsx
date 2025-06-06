import type React from "react"
import { useState, useEffect } from "react"
import { Send, AlertCircle, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import { useAuth } from "../context/AuthContext"

interface Account {
  id: number
  number: string
  currency: string
  balance: string
}

const SinpeMovilTransferForm: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [formData, setFormData] = useState({
    fromAccount: "",
    toPhone: "",
    amount: "",
    currency: "CRC",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL

  const extractBankCode = (accountNumber: string): string => {
    return accountNumber.slice(4, 8)
  }

  useEffect(() => {
    if (!user) return

    fetch(`${API_URL}/sinpe/user-link/${user.name}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.linked) {
          alert("Ninguna de tus cuentas está vinculada a SINPE Móvil.")
        } else {
          localStorage.setItem("senderInfo", data.phone)
        }
      })
      .catch(() => alert("Error al verificar si tu cuenta está vinculada a SINPE."))
  }, [user, API_URL])

  useEffect(() => {
    if (!user) return

    fetch(`${API_URL}/accounts?user=${encodeURIComponent(user.name)}`)
      .then((res) => res.json())
      .then((data: Account[]) => {
        setAccounts(data)
      })
      .catch(() => alert("Error al cargar cuentas"))
  }, [user, API_URL])

  const selectedAccount = accounts.find((a) => a.number === formData.fromAccount)
  const isValidAmount = Number(formData.amount) <= Number(selectedAccount?.balance || 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setIsError(false)
    setIsSuccess(false)

    try {
      if (!selectedAccount) throw new Error("Cuenta de origen no válida")
      if (!formData.toPhone.match(/^[0-9]{8}$/)) throw new Error("Número de teléfono no válido")
      if (!isValidAmount) throw new Error("Monto excede saldo disponible")

      const senderPhone = localStorage.getItem("senderInfo") || ""
      const receiverRes = await fetch(`${API_URL}/validate/${formData.toPhone}`)
      if (!receiverRes.ok) throw new Error("Número de teléfono no registrado en SINPE Móvil")
      const receiverData = await receiverRes.json()

      const timestamp = new Date().toISOString()
      const transactionId = crypto.randomUUID()

      const hmacPayload = {
        sender: {
          phone_number: senderPhone,
        },
        timestamp,
        transaction_id: transactionId,
        amount: {
          value: Number(formData.amount),
        },
      }

      const hmacRes = await fetch(`${API_URL}/transactions/hmac`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hmacPayload),
      })
      if (!hmacRes.ok) throw new Error("Error generando HMAC")
      const hmacData = await hmacRes.json()

      const transactionPayload = {
        version: "1.0",
        timestamp,
        transaction_id: transactionId,
        sender: {
          phone_number: senderPhone,
          bank_code: extractBankCode(selectedAccount.number),
          name: user?.name || "",
        },
        receiver: {
          phone_number: formData.toPhone,
          bank_code: receiverData.bank_code || "0000",
          name: receiverData.name || "",
        },
        amount: {
          value: Number(formData.amount),
          currency: formData.currency,
        },
        description: `Transferencia por ${formData.amount} ${formData.currency}`,
        hmac_md5: hmacData.hmac_md5,
      }

      console.log("JSON enviado a /transactions:", transactionPayload)

      const txRes = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionPayload),
      })
      if (!txRes.ok) throw new Error("Error al procesar la transferencia")

      setIsSuccess(true)
      setMessage(`Transferencia SINPE Móvil exitosa a ${formData.toPhone}`)
      setFormData({
        fromAccount: "",
        toPhone: "",
        amount: "",
        currency: "CRC",
        description: "",
      })
    } catch (err: any) {
      setIsError(true)
      setMessage(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow space-y-6">
          <h2 className="text-xl font-semibold text-blue-800 text-center">Transferencia SINPE Móvil</h2>

          {message && (
            <div
              className={`p-4 rounded-lg flex items-center space-x-3 ${
                isError
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              <span className="font-medium">{message}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Cuenta origen</label>
            <select
              required
              value={formData.fromAccount}
              onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
              className="w-full rounded-md px-4 py-3 border-gray-300 shadow-sm"
            >
              <option value="">Seleccione una cuenta</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.number}>
                  {acc.number} ({acc.currency})
                </option>
              ))}
            </select>
            {selectedAccount && (
              <p className="text-sm text-gray-500 mt-1">
                Saldo disponible:{" "}
                {Number(selectedAccount.balance).toLocaleString("es-CR", {
                  style: "currency",
                  currency: selectedAccount.currency,
                })}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Número de teléfono</label>
            <input
              type="tel"
              required
              value={formData.toPhone}
              onChange={(e) => setFormData({ ...formData, toPhone: e.target.value })}
              className="w-full rounded-md px-4 py-3 border-gray-300 shadow-sm"
              placeholder="Ej: 88888888"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Monto</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full rounded-md px-4 py-3 border-gray-300 shadow-sm"
              placeholder="₡0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Moneda</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full rounded-md px-4 py-3 border-gray-300 shadow-sm"
            >
              <option value="CRC">Colones (CRC)</option>
              <option value="USD">Dólares (USD)</option>
              <option value="EUR">Euros (EUR)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Comentario (opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md px-4 py-3 border-gray-300 shadow-sm resize-none"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>{loading ? "Procesando..." : "Transferir"}</span>
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default SinpeMovilTransferForm
