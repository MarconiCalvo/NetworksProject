"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, CreditCard, UserPlus, LogIn, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"

type FormMode = "login" | "register"

const Login: React.FC = () => {
  const [mode, setMode] = useState<FormMode>("login")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Login form state
  const [loginForm, setLoginForm] = useState({
    name: "",
    password: "",
  })

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsLoading(true)
    setIsError(false)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: loginForm.name,
          password: loginForm.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setIsError(true)
        setMessage(data.message || "Credenciales incorrectas")
        return
      }

      login(data.user)
      setIsError(false)
      setMessage("Inicio de sesión exitoso")

      setTimeout(() => {
        navigate("/dashboard", { replace: true })
      }, 1000)
    } catch {
      setIsError(true)
      setMessage("Error de conexión con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsLoading(true)
    setIsError(false)

    // Validate passwords match
    if (registerForm.password !== registerForm.confirmPassword) {
      setIsError(true)
      setMessage("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          phone: registerForm.phone,
          password: registerForm.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setIsError(true)
        setMessage(data.message || "Error al crear la cuenta")
        return
      }

      setIsError(false)
      setMessage("Cuenta creada exitosamente. Ahora puedes iniciar sesión.")

      // Reset form and switch to login mode after successful registration
      setRegisterForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      })

      // Switch to login mode after a short delay
      setTimeout(() => {
        setMode("login")
        setMessage("")
      }, 2000)
    } catch {
      setIsError(true)
      setMessage("Error de conexión con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Crypto Bank</h1>
          <p className="text-gray-600 mt-2">{mode === "login" ? "Accede a tu cuenta" : "Crea una nueva cuenta"}</p>
        </div>

        {/* Toggle between login and register */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            onClick={() => {
              setMode("login")
              setMessage("")
              setIsError(false)
            }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              mode === "login" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión</span>
          </button>
          <button
            onClick={() => {
              setMode("register")
              setMessage("")
              setIsError(false)
            }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              mode === "register" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrarse</span>
          </button>
        </div>

        {/* Message display */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm mb-6 flex items-center space-x-2 ${
              isError
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {isError ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de usuario</label>
              <input
                type="text"
                required
                value={loginForm.name}
                onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ingresa tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                "Iniciando sesión..."
              ) : (
                <>
                  <span>Iniciar sesión</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de usuario</label>
              <input
                type="text"
                required
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Elige un nombre de usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                required
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="8888-8888"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Crea una contraseña segura"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Repite tu contraseña"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                "Creando cuenta..."
              ) : (
                <>
                  <span>Crear cuenta</span>
                  <UserPlus className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <p>
              ¿No tienes una cuenta?{" "}
              <button
                onClick={() => {
                  setMode("register")
                  setMessage("")
                  setIsError(false)
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Regístrate aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes una cuenta?{" "}
              <button
                onClick={() => {
                  setMode("login")
                  setMessage("")
                  setIsError(false)
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Inicia sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
