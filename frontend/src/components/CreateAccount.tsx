
import type React from "react"
import { useState } from "react"
import { ArrowLeft, Plus, AlertCircle, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"

const CreateAccount: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    currency: "CRC",
    initialBalance: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setIsError(false)
    setIsSuccess(false)

    try {
      // First get a new IBAN
      const ibanResponse = await fetch(`${import.meta.env.VITE_API_URL}/accounts/iban`)
      if (!ibanResponse.ok) {
        throw new Error("Error generando número de cuenta")
      }
      const ibanData = await ibanResponse.json()

      // Create the account
      const response = await fetch(`${import.meta.env.VITE_API_URL}/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: ibanData.iban,
          currency: formData.currency,
          balance: Number.parseFloat(formData.initialBalance) || 0,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error creando la cuenta")
      }

      const accountData = await response.json()
      setIsSuccess(true)
      setMessage(`Cuenta creada exitosamente: ${accountData.number}`)

      // Reset form
      setFormData({
        currency: "CRC",
        initialBalance: "",
      })
    } catch (error) {
      setIsError(true)
      setMessage(error instanceof Error ? error.message : "Error creando la cuenta")
    } finally {
      setLoading(false)
    }
  }

  const currencies = [
    { code: "CRC", name: "Colones Costarricenses", symbol: "₡" },
    { code: "USD", name: "Dólares Estadounidenses", symbol: "$" },
    { code: "EUR", name: "Euros", symbol: "€" },
  ]

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
              <h1 className="text-xl font-semibold text-gray-900">Nueva Cuenta</h1>
              <p className="text-gray-600 text-sm">Crea una nueva cuenta bancaria</p>
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

            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de moneda</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currencies.map((currency) => (
                  <label
                    key={currency.code}
                    className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                      formData.currency === currency.code ? "border-blue-600 ring-2 ring-blue-600" : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="currency"
                      value={currency.code}
                      checked={formData.currency === currency.code}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <div className="text-lg font-bold text-gray-900">{currency.symbol}</div>
                        <div className="ml-2">
                          <div className="font-medium text-gray-900">{currency.code}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{currency.name}</div>
                    </div>
                    {formData.currency === currency.code && (
                      <div className="absolute -inset-px rounded-lg border-2 border-blue-600 pointer-events-none" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Initial Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Balance inicial (opcional)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.initialBalance}
                  onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currencies.find((c) => c.code === formData.currency)?.symbol}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Puedes dejar este campo vacío para crear una cuenta con balance cero
              </p>
            </div>

            {/* Account Features */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Características de la cuenta</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Número de cuenta generado automáticamente</li>
                <li>• Transferencias nacionales e internacionales</li>
                <li>• Historial completo de transacciones</li>
                <li>• Acceso 24/7 desde la aplicación</li>
              </ul>
            </div>

            {/* Submit Buttons */}
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
                <Plus className="w-5 h-5" />
                <span>{loading ? "Creando..." : "Crear Cuenta"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default CreateAccount
