
import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, Send, Plus, History, DollarSign, TrendingUp, Eye, EyeOff, PhoneCall } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import Layout from "./Layout"

interface Account {
    id: number
    number: string
    currency: string
    balance: string
}

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [accounts, setAccounts] = useState<Account[]>([])
    const [loading, setLoading] = useState(true)
    const [showBalances, setShowBalances] = useState(true)
    useEffect(() => {
        if (user?.name) {
            fetchAccounts();
        }
    }, [user]);

    const fetchAccounts = async () => {
        try {
            if (!user) {
                throw new Error("Usuario no autenticado");
            }
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/accounts?user=${encodeURIComponent(user.name)}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
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


    const formatBalance = (balance: string) => {
        return new Intl.NumberFormat("es-CR", {
            style: "currency",
            currency: "CRC",
        }).format(Number.parseFloat(balance))
    }

    const totalBalance = accounts.reduce((sum, account) => sum + Number.parseFloat(account.balance), 0)

    const quickActions = [
        {
            title: "Transferir",
            description: "Envía dinero a otras cuentas",
            icon: Send,
            color: "bg-blue-500",
            path: "/transfer",
        },
        {
            title: "Nueva Cuenta",
            description: "Crea una nueva cuenta",
            icon: Plus,
            color: "bg-green-500",
            path: "/create-account",
        },
        {
            title: "Transacciones",
            description: "Ver historial de movimientos",
            icon: History,
            color: "bg-purple-500",
            path: "/transactions",
        },
        {
            title: "Mis Cuentas",
            description: "Administrar cuentas",
            icon: CreditCard,
            color: "bg-orange-500",
            path: "/accounts",
        },
        {
            title: "Sinpe Móvil",
            description: "Enviar dinero por SINPE",
            icon: Send,
            color: "bg-orange-500",
            path: "/accounts",
        },

         {
            title: "Asociar Teléfono",
            description: "Asociar cuenta a tu número de teléfono",
            icon: PhoneCall,
            color: "bg-orange-500",
            path: "/phone-link",
        },
    ]

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Cargando usuario...
            </div>
        )
    }


    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">¡Hola, {user?.name}!</h1>
                            <p className="text-gray-600 mt-1">Bienvenido a Crypto Bank</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowBalances(!showBalances)}
                                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showBalances ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Balance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Balance Total</p>
                                <p className="text-2xl font-bold">{showBalances ? formatBalance(totalBalance.toString()) : "••••••"}</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-blue-200" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Cuentas Activas</p>
                                <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Transacciones Hoy</p>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(action.path)}
                                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
                            >
                                <div
                                    className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                                >
                                    <action.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-medium text-gray-900 text-sm">{action.title}</h3>
                                <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Accounts */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Mis Cuentas</h2>
                        <button
                            onClick={() => navigate("/accounts")}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Ver todas
                        </button>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    ) : accounts.length > 0 ? (
                        <div className="space-y-3">
                            {accounts.slice(0, 3).map((account) => (
                                <div
                                    key={account.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Cuenta {account.currency}</p>
                                            <p className="text-sm text-gray-600">•••• {account.number.slice(-4)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {showBalances ? formatBalance(account.balance) : "••••••"}
                                        </p>
                                        <p className="text-sm text-gray-600">{account.currency}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">No tienes cuentas registradas</p>
                            <button
                                onClick={() => navigate("/create-account")}
                                className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Crear tu primera cuenta
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
