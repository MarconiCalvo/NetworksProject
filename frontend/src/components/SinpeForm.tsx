import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Account {
  id: string;
  number: string;
  currency: string;
  balance: number;
}

const SinpeTransferForm: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccount, setFromAccount] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CRC");
  const [comment, setComment] = useState("");
  const [receiverName, setReceiverName] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    fetch(`${API_URL}/sinpe/user-link/${user.name}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.linked) {
          alert("Ninguna de tus cuentas está vinculada a SINPE Móvil.");
        } else {
          localStorage.setItem("senderInfo", data.phone);
        }
      })
      .catch(() => {
        alert("Error al verificar si tu cuenta está vinculada a SINPE.");
      });
  }, [API_URL]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const username = user?.name || "";

    fetch(`${API_URL}/accounts?user=${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((data: Account[]) => {
        setAccounts(data);
        if (data.length > 0) {
          setFromAccount(data[0].number);
          setCurrency(data[0].currency);
        }
      })
      .catch(() => {
        alert("Error al cargar cuentas");
      });
  }, [API_URL]);

  useEffect(() => {
    if (fromAccount) {
      const bankCode = fromAccount.slice(5, 8);
      localStorage.setItem("senderAccount", bankCode);
    }
  }, [fromAccount]);

  useEffect(() => {
    const buscarNombre = async () => {
      if (!phone.match(/^[0-9]{8}$/)) {
        setReceiverName(null);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/validate/${phone}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        localStorage.setItem("receiverInfo", JSON.stringify(data));
        console.log(data);
        setReceiverName(data.name);
      } catch {
        setReceiverName(null);
      }
    };

    buscarNombre();
  }, [phone, API_URL]);

  const selectedAccount = accounts.find((acc) => acc.number === fromAccount);
  const amountNumber = Number(amount);
  const isValidAmount = amountNumber > 0 && amountNumber <= (selectedAccount?.balance ?? 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.match(/^[0-9]{8}$/)) {
      alert("Ingrese un número de teléfono válido.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("El monto debe ser mayor a 0.");
      return;
    }

    if (!isValidAmount) {
      alert("Monto insuficiente o inválido.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const sender_phone = localStorage.getItem("senderInfo") || "";
      const bank_Sender = localStorage.getItem("senderAccount") || "119";
      const receiverInfo = JSON.parse(localStorage.getItem("receiverInfo") || "{}");
      const timestamp = new Date().toISOString();
      const transactionId = uuidv4();

      const payload = {
        version: "1.0",
        timestamp,
        transaction_id: transactionId,
        sender: {
          phone_number: sender_phone,
          bank_code: bank_Sender,
          name: user.name || "Desconocido",
        },
        receiver: {
          phone_number: phone,
          bank_code: receiverInfo.bank_code || "000",
          name: receiverInfo.name || "",
        },
        amount: {
          value: Number(amount),
          currency,
        },
        description: comment || "Transferencia SINPE desde app demo",
      };

      const hmacRes = await fetch(`${API_URL}/transactions/hmac`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const { hmac_md5 } = await hmacRes.json();

      const finalPayload = { ...payload, hmac_md5 };

      console.log(finalPayload)

      const res = await fetch(`${API_URL}/sinpe-movil`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Error del backend:", res.status, errText);
        alert("Error al enviar la transferencia: " + errText);
        return;
      }

      const result = await res.json();
      console.log("✅ Transferencia realizada:", result);
      alert("Transferencia completada con éxito.");

      // Reset form
      setPhone("");
      setAmount("");
      setComment("");
    } catch (err) {
      console.error("❌ Error en el envío de transferencia SINPE:", err);
      alert("No se pudo completar la transferencia.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-bold text-blue-800 text-center">
        Transferencia SINPE
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">Cuenta origen</label>
        <select
          value={fromAccount}
          onChange={(e) => {
            const acc = accounts.find((a) => a.number === e.target.value);
            setFromAccount(e.target.value);
            if (acc) setCurrency(acc.currency);
          }}
          className="w-full rounded-md px-4 py-3 border-gray-300 shadow-sm"
          required
        >
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.number}>
              {acc.number} ({acc.currency})
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

      <div>
        <label className="block text-sm font-medium mb-1">Número de teléfono</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej: 88888888"
          className="w-full rounded-md px-4 py-3 border-gray-300 shadow-sm"
          required
        />
        {receiverName && (
          <p className="text-sm text-green-600 mt-1">
            Destinatario: {receiverName}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Monto</label>
        <div className="flex gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-md px-3 py-2 border-gray-300 shadow-sm"
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
            className="flex-1 rounded-md px-4 py-3 border-gray-300 shadow-sm"
            required
            min={0.01}
            step="0.01"
          />
        </div>
        {!isValidAmount && (
          <p className="text-sm text-red-600 mt-1">
            El monto excede el saldo disponible.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Comentario (opcional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Motivo de la transferencia"
          className="w-full rounded-md px-4 py-3 border-gray-300 shadow-sm resize-none"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
      >
        Continuar
      </button>
    </form>
  );
};

export default SinpeTransferForm;
