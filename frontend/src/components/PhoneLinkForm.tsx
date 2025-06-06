import React, { useEffect, useState } from "react"
import Layout from "./Layout"
import { useAuth } from "../context/AuthContext"
import { CheckCircle, AlertCircle } from "lucide-react"

interface Account {
  id: string
  number: string
  currency: string
}

const PhoneLinkPage: React.FC = () => {
  const { user } = useAuth()
  const API_URL = import.meta.env.VITE_API_URL
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!user) return
    const username = user.name

    fetch(`${API_URL}/accounts?user=${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((data: Account[]) => {
        setAccounts(data)
        if (data.length > 0) setSelectedAccount(data[0].number)
      })
      .catch(() => {
        setMessage("Error al cargar tus cuentas.")
        setIsError(true)
      })
  }, [API_URL, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsError(false)
    setIsSuccess(false)

    if (!selectedAccount || !phoneNumber.match(/^(\+506)?[0-9]{8}$/)) {
      setMessage("Debes ingresar un número de teléfono válido.")
      setIsError(true)
      return
    }

    try {
      const res = await fetch(`${API_URL}/phone-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_number: selectedAccount,
          phone: phoneNumber,
          user_name: user?.name,
        }),
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.error || "Error desconocido")

      setMessage("Cuenta asociada exitosamente.")
      setIsSuccess(true)
    } catch (err: any) {
      setMessage(err.message || "Error desconocido")
      setIsError(true)
    }
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow space-y-6">
        <h2 className="text-2xl font-bold text-blue-800 text-center">
          Asociar Cuenta a Teléfono
        </h2>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Selecciona una cuenta
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full rounded-md px-4 py-3 border-gray-300 shadow-sm"
              required
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.number}>
                  {acc.number} ({acc.currency})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Número de teléfono (ej: 88888888)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Número sin prefijo internacional"
              className="w-full rounded-md px-4 py-3 border-gray-300 shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
          >
            Asociar Teléfono
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default PhoneLinkPage
