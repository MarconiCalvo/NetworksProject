
import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Search, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"

interface Transaction {
  id: number
  from_account_id: number
  to_account_id: number
  amount: string
  currency: string
  status: string
  created_at: string
  fromAccount?: {
    number: string
  }
  toAccount?: {
    number: string
  }
}

interface Account {
  id: number
  number: string
  currency: string
  balance: string
}

const Transactions: React.FC = () => {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAccount, setSelectedAccount] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch accounts first
      const accountsResponse = await fetch(`${import.meta.env.VITE_API_URL}/accounts`)
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json()
        setAccounts(accountsData)

        // Fetch transactions for each account
        const allTransactions: Transaction[] = []
        for (const account of accountsData) {
          try {
            const transactionsResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/accounts/${account.number}/details`,
            )
            if (transactionsResponse.ok) {
              const transactionData = await transactionsResponse.json()
              if (transactionData.transactions) {
                allTransactions.push(...transactionData.transactions)
              }
            }
          } catch (error) {
            console.error(`Error fetching transactions for account ${account.number}:`, error)
          }
        }

        // Remove duplicates and sort by date
        const uniqueTransactions = allTransactions.filter(
          (transaction, index, self) => index === self.findIndex((t) => t.id === transaction.id),
        )

        setTransactions(
          uniqueTransactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        )
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount: string, currency: string) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: currency === "CRC" ? "CRC" : "USD",
    }).format(Number.parseFloat(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTransactionType = (transaction: Transaction) => {
    const userAccountIds = accounts.map((acc) => acc.id)
    const isIncoming = userAccountIds.includes(transaction.to_account_id)
    const isOutgoing = userAccountIds.includes(transaction.from_account_id)

    if (isIncoming && isOutgoing) {
      return "internal" // Transfer between own accounts
    } else if (isIncoming) {
      return "incoming"
    } else {
      return "outgoing"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.fromAccount?.number.includes(searchTerm) ||
      transaction.toAccount?.number.includes(searchTerm) ||
      transaction.amount.includes(searchTerm)

    const matchesAccount =
      selectedAccount === "" ||
      transaction.from_account_id === Number.parseInt(selectedAccount) ||
      transaction.to_account_id === Number.parseInt(selectedAccount)

    const matchesStatus = statusFilter === "" || transaction.status === statusFilter

    return matchesSearch && matchesAccount && matchesStatus
  })

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
                <h1 className="text-xl font-semibold text-gray-900">Transacciones</h1>
                <p className="text-gray-600 text-sm">Historial de movimientos</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">{transactions.length} transacciones</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por número de cuenta o monto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Account Filter */}
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las cuentas</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.currency} - •••• {account.number.slice(-4)}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="completed">Completado</option>
              <option value="pending">Pendiente</option>
              <option value="failed">Fallido</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const transactionType = getTransactionType(transaction)
                const isIncoming = transactionType === "incoming"
                const isInternal = transactionType === "internal"

                return (
                  <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isIncoming ? "bg-green-100" : isInternal ? "bg-blue-100" : "bg-red-100"
                          }`}
                        >
                          {isIncoming ? (
                            <ArrowDownLeft className={`w-6 h-6 ${isIncoming ? "text-green-600" : "text-red-600"}`} />
                          ) : (
                            <ArrowUpRight className={`w-6 h-6 ${isInternal ? "text-blue-600" : "text-red-600"}`} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {isIncoming
                              ? "Transferencia recibida"
                              : isInternal
                                ? "Transferencia interna"
                                : "Transferencia enviada"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {isIncoming
                              ? `De: •••• ${transaction.fromAccount?.number.slice(-4) || "N/A"}`
                              : `Para: •••• ${transaction.toAccount?.number.slice(-4) || "N/A"}`}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(transaction.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${isIncoming ? "text-green-600" : "text-red-600"}`}>
                          {isIncoming ? "+" : "-"}
                          {formatAmount(transaction.amount, transaction.currency)}
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            transaction.status,
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay transacciones</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedAccount || statusFilter
                  ? "No se encontraron transacciones con los filtros aplicados"
                  : "Aún no has realizado ninguna transacción"}
              </p>
              <button
                onClick={() => navigate("/transfer")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Hacer primera transferencia
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Transactions
