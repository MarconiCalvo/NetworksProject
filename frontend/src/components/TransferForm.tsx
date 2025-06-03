
import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Send, AlertCircle, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"

interface Account {
  id: number
  number: string
  currency: string
  balance: string
}

const TransferForm: React.FC = () => {
  const navigate = useNavigate()
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

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/accounts`)
      if (response.ok) {
        const data = await response.json()
        setAccounts(data)
      }
    } catch (error) {
      console.error("Error fetching accounts:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setIsError(false)
    setIsSuccess(false)

    try {
      // First, get account owner name to verify the destination account
      const ownerResponse = await fetch(`${import.meta.env.VITE_API_URL}/accounts/owner/${formData.toAccountNumber}`)

      if (!ownerResponse.ok) {
        throw new Error("Cuenta de destino no encontrada")
      }

      const ownerData = await ownerResponse.json()

      // Generate HMAC for the transaction
      const hmacResponse = await fetch(`${import.meta.env.VITE_API_URL}/transactions/hmac`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccountId: Number.parseInt(formData.fromAccountId),
          toAccountNumber: formData.toAccountNumber,
          amount: Number.parseFloat(formData.amount),
          currency: formData.currency,
        }),
      })

      if (!hmacResponse.ok) {
        throw new Error("Error generando código de seguridad")
      }

      const hmacData = await hmacResponse.json()

      // Create the transaction
      const transactionResponse = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccountId: Number.parseInt(formData.fromAccountId),
          toAccountNumber: formData.toAccountNumber,
          amount: Number.parseFloat(formData.amount),
          currency: formData.currency,
          description: formData.description,
          hmac: hmacData.hmac,
        }),
      })

      if (!transactionResponse.ok) {
        const errorData = await transactionResponse.json()
        throw new Error(errorData.message || "Error procesando la transferencia")
      }

      setIsSuccess(true)
      setMessage(`Transferencia exitosa a ${ownerData.ownerName}`)

      // Reset form
      setFormData({
        fromAccountId: "",
        toAccountNumber: "",
        amount: "",
        currency: "CRC",
        description: "",
      })

      // Refresh accounts to update balances
      fetchAccounts()
    } catch (error) {
      setIsError(true)
      setMessage(error instanceof Error ? error.message : "Error procesando la transferencia")
    } finally {
      setLoading(false)
    }
  }

  const selectedAccount = accounts.find((acc) => acc.id === Number.parseInt(formData.fromAccountId))

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Message */}
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
                {isError ? (
                  <AlertCircle className="w-5 h-5" />
                ) : isSuccess ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-medium">{message}</span>
              </div>
            )}

            {/* From Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cuenta de origen</label>
              <select
                required
                value={formData.fromAccountId}
                onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una cuenta</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.currency} - •••• {account.number.slice(-4)} - Balance:{" "}
                    {new Intl.NumberFormat("es-CR", {
                      style: "currency",
                      currency: "CRC",
                    }).format(Number.parseFloat(account.balance))}
                  </option>
                ))}
              </select>
            </div>

            {/* To Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de cuenta destino</label>
              <input
                type="text"
                required
                value={formData.toAccountNumber}
                onChange={(e) => setFormData({ ...formData, toAccountNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa el número de cuenta"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto a transferir</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {formData.currency}
                </div>
              </div>
              {selectedAccount && formData.amount && (
                <p className="text-sm text-gray-600 mt-1">
                  Balance disponible:{" "}
                  {new Intl.NumberFormat("es-CR", {
                    style: "currency",
                    currency: "CRC",
                  }).format(Number.parseFloat(selectedAccount.balance))}
                </p>
              )}
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CRC">Colones (CRC)</option>
                <option value="USD">Dólares (USD)</option>
                <option value="EUR">Euros (EUR)</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción (opcional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Motivo de la transferencia..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
