import React, { useEffect, useState } from "react";

interface Account {
  id: string;
  number: string;
  currency: string;
  balance: number;
}

interface SubscribedAccount {
  number: string;
  name: string;
}

interface TransferData {
  fromAccount: string;
  toAccount: string;
  toName: string;
  amount: number;
  currency: string;
}

interface Props {
  userId: string;
  subscribedAccounts: SubscribedAccount[];
  onSubmit: (data: TransferData) => void;
}

const TransferForm: React.FC<Props> = ({ subscribedAccounts, onSubmit }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccount, setFromAccount] = useState("");
  const [useSubscribed, setUseSubscribed] = useState(true);
  const [toAccount, setToAccount] = useState(
    subscribedAccounts[0]?.number || ""
  );
  const [manualAccount, setManualAccount] = useState("");
  const [manualName, setManualName] = useState(""); // NUEVO
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CRC");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const username = user?.name || "";
    const fetchAccounts = async () => {
      try {
        const res = await fetch(
          `${API_URL}/accounts?user=${encodeURIComponent(username)}`
        );
        const data: Account[] = await res.json();
        setAccounts(data);
        if (data.length > 0) {
          setFromAccount(data[0].number);
          setCurrency(data[0].currency);
        }
      } catch (error) {
        console.error("Error al cargar cuentas:", error);
      }
    };

    fetchAccounts();
  }, [API_URL]);

  // 🔍 Buscar nombre del titular si es cuenta interna
  useEffect(() => {
    const buscarNombre = async () => {
      if (!manualAccount.startsWith("NB")) {
        setManualName("");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/accounts/owner/${manualAccount}`);
        if (!res.ok) throw new Error("No encontrada");
        const data = await res.json();
        setManualName(data.name || "Desconocido");
      } catch {
        setManualName("Desconocido");
      }
    };

    if (!useSubscribed && manualAccount.trim()) {
      buscarNombre();
    }
  }, [manualAccount, useSubscribed, API_URL]);

  const selectedAccount = accounts.find((acc) => acc.number === fromAccount);
  const isValidAmount = Number(amount) <= (selectedAccount?.balance ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidAmount) {
      alert("El monto excede el saldo disponible.");
      return;
    }

    const finalToAccount = useSubscribed ? toAccount : manualAccount;
    const finalToName = useSubscribed
      ? subscribedAccounts.find((s) => s.number === toAccount)?.name || ""
      : manualName || "N/A";

    const transferData: TransferData = {
      fromAccount,
      toAccount: finalToAccount,
      toName: finalToName,
      amount: Number(amount),
      currency,
    };

    localStorage.setItem("pendingTransfer", JSON.stringify(transferData));
    onSubmit(transferData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-blue-800 text-center">
        Realizar Transferencia
      </h2>

      {/* Cuenta origen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cuenta origen
        </label>
        <select
          value={fromAccount}
          onChange={(e) => {
            const acc = accounts.find((a) => a.number === e.target.value);
            setFromAccount(e.target.value);
            if (acc) setCurrency(acc.currency);
          }}
          className="w-full rounded-md border-gray-300 px-4 py-3 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.number}>
              {acc.number}
            </option>
          ))}
        </select>
        {selectedAccount && (
          <p className="text-sm text-gray-500 mt-1">
            Saldo disponible:{" "}
            {selectedAccount.balance.toLocaleString("es-CR", {
              style: "currency",
              currency: selectedAccount.currency,
            })}
          </p>
        )}
      </div>

      {/* Destino */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destino
        </label>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="destino"
              checked={useSubscribed}
              onChange={() => setUseSubscribed(true)}
            />
            Suscrita
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="destino"
              checked={!useSubscribed}
              onChange={() => setUseSubscribed(false)}
            />
            Manual
          </label>
        </div>

        {useSubscribed ? (
          <div className="mt-2">
            <select
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              className="w-full mt-1 rounded-md border-gray-300 px-4 py-3 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {subscribedAccounts.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number} – {s.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Número de cuenta"
              value={manualAccount}
              onChange={(e) => setManualAccount(e.target.value)}
              className="w-full rounded-md border-gray-300 px-4 py-3 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {manualAccount.startsWith("NB") && manualName && (
              <p className="text-sm text-gray-500 mt-1">
                Titular: <span className="font-semibold">{manualName}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Monto y moneda */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Monto
        </label>
        <div className="flex gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="CRC">₡</option>
            <option value="USD">$</option>
            <option value="EUR">€</option>
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monto"
            className="flex-1 rounded-md border-gray-300 px-4 py-3 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {!isValidAmount && (
          <p className="text-sm text-red-600 mt-1">
            El monto excede el saldo disponible.
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition text-base"
      >
        Realizar Transferencia
      </button>
    </form>
  );
};

export default TransferForm;
