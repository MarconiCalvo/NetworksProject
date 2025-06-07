import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Send, AlertCircle, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import { useAuth } from "../context/AuthContext"

interface Account {
  id: number
  number: string
  currency: string
  balance: string
}

const TransferForm: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fromAccountId: "",
    toAccountNumber: "",
    amount: "",
    currency: "CRC",
    description: "",
  })

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      if (!user) throw new Error("Usuario no autenticado")

      const res = await fetch(
        `${API_URL}/accounts?user=${encodeURIComponent(user.name)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      if (!res.ok) throw new Error("Error al obtener cuentas")

      const data = await res.json()
      setAccounts(data)
    } catch (err) {
      console.error("Error al cargar cuentas:", err)
    }
  }

  const extractBankCode = (accountNumber: string): string => {
    return accountNumber.slice(4, 8)
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setMessage("")
  setIsError(false)
  setIsSuccess(false)

  try {
    const fromAccount = accounts.find(
      (acc) => acc.id === Number(formData.fromAccountId)
    )
    if (!fromAccount) throw new Error("Cuenta de origen no válida")

    const timestamp = new Date().toISOString()
    const transactionId = crypto.randomUUID()

    const hmacPayload = {
      sender: {
        account_number: fromAccount.number,
      },
      timestamp,
      transaction_id: transactionId,
      amount: {
        value: Number.parseFloat(formData.amount),
      },
    }

    const hmacRes = await fetch(`${API_URL}/transactions/hmac`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hmacPayload),
    })
    if (!hmacRes.ok) throw new Error("Error generando código de seguridad")
    const hmacData = await hmacRes.json()

    const receiverName = "Desconocido" // ← si siempre es ingreso manual

    const transactionPayload = {
      version: "1.0",
      timestamp,
      transaction_id: transactionId,
      sender: {
        account_number: fromAccount.number,
        bank_code: extractBankCode(fromAccount.number),
        name: user?.name || "Desconocido",
      },
      receiver: {
        account_number: formData.toAccountNumber,
        bank_code: extractBankCode(formData.toAccountNumber),
        name: receiverName,
      },
      amount: {
        value: Number.parseFloat(formData.amount),
        currency: formData.currency,
      },
      description: `Transferencia por ${formData.amount} ${formData.currency}`,
      hmac_md5: hmacData.hmac_md5,
    }

    const txRes = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionPayload),
    })
    if (!txRes.ok) {
      const err = await txRes.json()
      throw new Error(err.error || "Error al procesar transferencia")
    }

    setIsSuccess(true)
    setMessage(`Transferencia enviada a la cuenta ${formData.toAccountNumber}`)
    setFormData({
      fromAccountId: "",
      toAccountNumber: "",
      amount: "",
      currency: "CRC",
      description: "",
    })
    fetchAccounts()
  } catch (err: any) {
    setIsError(true)
    setMessage(err.message || "Error desconocido")
  } finally {
    setLoading(false)
  }
}

  const selectedAccount = accounts.find(
    (acc) => acc.id === Number(formData.fromAccountId)
  )

  return (
  <Layout>
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center p-6 border-b">
          <button
            onClick={() => navigate("/dashboard")}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Nueva Transferencia</h1>
            <p className="text-gray-600 text-sm">Envía dinero a otras cuentas</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-lg flex items-center space-x-3 ${
                isError
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : isSuccess
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              <span className="font-medium">{message}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cuenta de origen</label>
            <select
              required
              value={formData.fromAccountId}
              onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">Selecciona una cuenta</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.currency} - •••• {account.number.slice(-4)} - Saldo:{" "}
                  {new Intl.NumberFormat("es-CR", {
                    style: "currency",
                    currency: account.currency,
                  }).format(Number(account.balance))}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número de cuenta destino</label>
            <input
              type="text"
              required
              value={formData.toAccountNumber}
              onChange={(e) => setFormData({ ...formData, toAccountNumber: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monto</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="0.00"
            />
            {selectedAccount && formData.amount && (
              <p className="text-sm text-gray-600 mt-1">
                Saldo disponible:{" "}
                {new Intl.NumberFormat("es-CR", {
                  style: "currency",
                  currency: selectedAccount.currency,
                }).format(Number(selectedAccount.balance))}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="CRC">Colones (CRC)</option>
              <option value="USD">Dólares (USD)</option>
              <option value="EUR">Euros (EUR)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción (opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>{loading ? "Procesando..." : "Transferir"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
)

}

export default TransferForm