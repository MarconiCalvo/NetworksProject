"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Eye,
  EyeOff,
  CreditCard,
  UserPlus,
  LogIn,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"

// COMPONENTES AUXILIARES

type InputFieldProps = {
  label: string
  type?: string
  value: string
  onChange: (val: string) => void
  isLoading?: boolean
}

const InputField: React.FC<InputFieldProps> = ({ label, type = "text", value, onChange, isLoading }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      disabled={isLoading}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      placeholder={label}
    />
  </div>
)

type PasswordFieldProps = {
  label: string
  value: string
  onChange: (val: string) => void
  show: boolean
  toggle: () => void
  isLoading?: boolean
}

const PasswordField: React.FC<PasswordFieldProps> = ({ label, value, onChange, show, toggle, isLoading }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        required
        disabled={isLoading}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
        placeholder={label}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>
)

// COMPONENTE PRINCIPAL

type FormMode = "login" | "register"

const Login: React.FC = () => {
  const [mode, setMode] = useState<FormMode>("login")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loginForm, setLoginForm] = useState({ name: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    cedula: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const navigate = useNavigate()
  const { login } = useAuth()

  const resetForms = () => {
    setLoginForm({ name: "", password: "" })
    setRegisterForm({ name: "", email: "", cedula: "", phone: "", password: "", confirmPassword: "" })
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsLoading(true)
    setIsError(false)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Login error:", data)
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
    } catch (err) {
      console.error("Error de conexión:", err)
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
          cedula: registerForm.cedula,
          phone: registerForm.phone,
          password: registerForm.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Registro error:", data)
        setIsError(true)
        setMessage(data.message || "Error al crear la cuenta")
        return
      }

      setIsError(false)
      setMessage("Cuenta creada exitosamente. Ahora puedes iniciar sesión.")
      resetForms()

      setTimeout(() => {
        setMode("login")
        setMessage("")
      }, 2000)
    } catch (err) {
      console.error("Error de conexión:", err)
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

        {/* Botones de alternancia */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            onClick={() => { setMode("login"); setMessage(""); setIsError(false); resetForms() }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${mode === "login" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión</span>
          </button>
          <button
            onClick={() => { setMode("register"); setMessage(""); setIsError(false); resetForms() }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${mode === "register" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrarse</span>
          </button>
        </div>

        {/* Mensajes */}
        {message && (
          <div className={`p-3 rounded-lg text-sm mb-6 flex items-center space-x-2 ${isError ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
            {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{message}</span>
          </div>
        )}

        {/* Formulario Login */}
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <InputField label="Nombre de usuario" value={loginForm.name} onChange={(val) => setLoginForm({ ...loginForm, name: val })} isLoading={isLoading} />
            <PasswordField label="Contraseña" value={loginForm.password} onChange={(val) => setLoginForm({ ...loginForm, password: val })} show={showPassword} toggle={() => setShowPassword(!showPassword)} isLoading={isLoading} />
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center space-x-2 disabled:opacity-50">
              {isLoading ? "Iniciando sesión..." : (<><span>Iniciar sesión</span><ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <InputField label="Nombre de usuario" value={registerForm.name} onChange={(val) => setRegisterForm({ ...registerForm, name: val })} isLoading={isLoading} />
            <InputField label="Cedula" value={registerForm.cedula} onChange={(val) => setRegisterForm({ ...registerForm, cedula: val })} isLoading={isLoading} />
            <InputField label="Correo electrónico" type="email" value={registerForm.email} onChange={(val) => setRegisterForm({ ...registerForm, email: val })} isLoading={isLoading} />
            <InputField label="Teléfono" type="tel" value={registerForm.phone} onChange={(val) => setRegisterForm({ ...registerForm, phone: val })} isLoading={isLoading} />
            <PasswordField label="Contraseña" value={registerForm.password} onChange={(val) => setRegisterForm({ ...registerForm, password: val })} show={showPassword} toggle={() => setShowPassword(!showPassword)} isLoading={isLoading} />
            <PasswordField label="Confirmar contraseña" value={registerForm.confirmPassword} onChange={(val) => setRegisterForm({ ...registerForm, confirmPassword: val })} show={showConfirmPassword} toggle={() => setShowConfirmPassword(!showConfirmPassword)} isLoading={isLoading} />
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center space-x-2 disabled:opacity-50">
              {isLoading ? "Creando cuenta..." : (<><span>Crear cuenta</span><UserPlus className="w-4 h-4" /></>)}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <p>¿No tienes una cuenta?{" "}
              <button onClick={() => { setMode("register"); resetForms() }} className="text-blue-600 hover:text-blue-800 font-medium">Regístrate aquí</button>
            </p>
          ) : (
            <p>¿Ya tienes una cuenta?{" "}
              <button onClick={() => { setMode("login"); resetForms() }} className="text-blue-600 hover:text-blue-800 font-medium">Inicia sesión</button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
