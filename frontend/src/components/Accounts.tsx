
import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Plus, CreditCard, Eye, EyeOff, MoreVertical, Copy } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import { useAuth } from "../context/AuthContext";


interface Account {
  id: number
  number: string
  currency: string
  balance: string
  created_at: string
}

const Accounts: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [showBalances, setShowBalances] = useState(true)
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

 useEffect(() => {
  if (user?.name) {
    fetchAccounts();
  }
}, [user]);

const fetchAccounts = async () => {
  if (!user || !user.name) {
    setAccounts([]);
    setLoading(false);
    return;
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/accounts?user=${encodeURIComponent(user.name)}`
    );
    if (response.ok) {
      const data = await response.json();
      setAccounts(data);
    } else {
      console.error("Error al obtener cuentas: respuesta no OK");
    }
  } catch (error) {
    console.error("Error al obtener cuentas:", error);
  } finally {
    setLoading(false);
  }
};


  const formatBalance = (balance: string, currency: string) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: currency === "CRC" ? "CRC" : "USD",
    }).format(Number.parseFloat(balance))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const copyAccountNumber = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber)
      setCopiedAccount(accountNumber)
      setTimeout(() => setCopiedAccount(null), 2000)
    } catch (error) {
      console.error("Error copying account number:", error)
    }
  }

  const getCurrencyInfo = (currency: string) => {
    switch (currency) {
      case "CRC":
        return { name: "Colones Costarricenses", symbol: "₡", color: "bg-green-100 text-green-800" }
      case "USD":
        return { name: "Dólares Estadounidenses", symbol: "$", color: "bg-blue-100 text-blue-800" }
      case "EUR":
        return { name: "Euros", symbol: "€", color: "bg-purple-100 text-purple-800" }
      default:
        return { name: currency, symbol: currency, color: "bg-gray-100 text-gray-800" }
    }
  }

  const totalBalance = accounts.reduce((sum, account) => {
    if (account.currency === "CRC") {
      return sum + Number.parseFloat(account.balance)
    }
    return sum
  }, 0)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Mis Cuentas</h1>
                <p className="text-gray-600 text-sm">Administra tus cuentas bancarias</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title={showBalances ? "Ocultar balances" : "Mostrar balances"}
              >
                {showBalances ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button
                onClick={() => navigate("/create-account")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Cuenta</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Balance Total (CRC)</p>
                <p className="text-2xl font-bold">
                  {showBalances ? formatBalance(totalBalance.toString(), "CRC") : "••••••"}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Cuentas</p>
                <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold">{accounts.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Monedas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(accounts.map((acc) => acc.currency)).size}</p>
              </div>
              <div className="flex space-x-1">
                {Array.from(new Set(accounts.map((acc) => acc.currency)))
                  .slice(0, 3)
                  .map((currency) => (
                    <span
                      key={currency}
                      className={`px-2 py-1 text-xs font-medium rounded ${getCurrencyInfo(currency).color}`}
                    >
                      {currency}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accounts List */}
        <div className="bg-white rounded-xl shadow-sm">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : accounts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {accounts.map((account) => {
                const currencyInfo = getCurrencyInfo(account.currency)
                return (
                  <div key={account.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <CreditCard className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">Cuenta {account.currency}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${currencyInfo.color}`}>
                              {account.currency}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-600 font-mono">{account.number}</p>
                            <button
                              onClick={() => copyAccountNumber(account.number)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copiar número de cuenta"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {copiedAccount === account.number && (
                              <span className="text-xs text-green-600 font-medium">¡Copiado!</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">Creada el {formatDate(account.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {showBalances ? formatBalance(account.balance, account.currency) : "••••••"}
                        </p>
                        <p className="text-sm text-gray-600">{currencyInfo.name}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => navigate("/transfer")}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                          >
                            Transferir
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes cuentas registradas</h3>
              <p className="text-gray-600 mb-6">
                Crea tu primera cuenta para comenzar a usar nuestros servicios bancarios
              </p>
              <button
                onClick={() => navigate("/create-account")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Crear Primera Cuenta</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Accounts
