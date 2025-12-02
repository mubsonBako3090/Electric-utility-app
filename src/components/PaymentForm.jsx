"use client";
import { useState } from "react";
import styles from "@/styles/pages/Bills.module.css";

export default function PaymentForm({ bill, onClose, onSubmit }) {
  // Ensure safe defaults — also handle cases where bill exists but fields are missing
  const safeBill = {
    billNumber: bill?.billNumber ?? "N/A",
    amountDue: Number(bill?.amountDue ?? 0),
    id: bill?.id ?? null,
  };

  const [method, setMethod] = useState("card");

  // Card
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [exp, setExp] = useState("");

  // Bank
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // Opay
  const [opayNumber, setOpayNumber] = useState("");
  const [opayValid, setOpayValid] = useState(true);

  // USSD
  const [ussdCode, setUssdCode] = useState("");

  // Success animation
  const [success, setSuccess] = useState(false);

  // ---------------------- Handlers ----------------------
  const handleCardChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(val);
  };

  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setCvv(val);
  };

  const handleOpayChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setOpayNumber(val);
    setOpayValid(/^\d{10}$/.test(val));
  };

  const handleUssdChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith("*")) val = "*" + val;
    setUssdCode(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const paymentData = {
      billId: safeBill.id,
      amount: safeBill.amountDue,
      method,
      card: { cardNumber, cvv, exp },
      bank: { bankName, accountNumber },
      opay: { opayNumber },
      ussd: { ussdCode },
    };

    onSubmit(paymentData);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1800);
  };

  // ---------------------- UI ----------------------
  return (
    <div className={styles.paymentModalOverlay}>
      <div className={styles.paymentModal}>
        <h3>Pay Bill #{safeBill.billNumber}</h3>

        {/* SAFE FIXED TOFIXED() */}
        <p>
          <strong>Amount Due:</strong> $
          {Number(safeBill.amountDue).toFixed(2)}
        </p>

        {/* Payment Method Cards */}
        <div className={styles.methodGrid}>
          <div
            className={`${styles.methodCard} ${
              method === "card" ? styles.active : ""
            }`}
            onClick={() => setMethod("card")}
          >
            💳 Card
          </div>

          <div
            className={`${styles.methodCard} ${
              method === "bank" ? styles.active : ""
            }`}
            onClick={() => setMethod("bank")}
          >
            🏦 Bank Transfer
          </div>

          <div
            className={`${styles.methodCard} ${
              method === "opay" ? styles.active : ""
            }`}
            onClick={() => setMethod("opay")}
          >
            🟩 Opay
          </div>

          <div
            className={`${styles.methodCard} ${
              method === "ussd" ? styles.active : ""
            }`}
            onClick={() => setMethod("ussd")}
          >
            #️⃣ USSD
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ===== CARD FIELDS ===== */}
          {method === "card" && (
            <>
              <label className="form-label mt-3">Card Number</label>
              <input
                type="text"
                className="form-control"
                value={cardNumber}
                onChange={handleCardChange}
                maxLength={19}
                placeholder="1234 5678 9012 3456"
                required
              />

              <label className="form-label mt-3">CVV</label>
              <input
                type="password"
                className="form-control"
                value={cvv}
                onChange={handleCvvChange}
                maxLength={3}
                placeholder="***"
                required
              />

              <label className="form-label mt-3">Expiry Date</label>
              <input
                type="month"
                className="form-control"
                value={exp}
                onChange={(e) => setExp(e.target.value)}
                required
              />
            </>
          )}

          {/* ===== BANK TRANSFER ===== */}
          {method === "bank" && (
            <>
              <label className="form-label mt-3">Select Bank</label>
              <select
                className="form-select"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              >
                <option value="">Choose Bank</option>
                <option value="GTBank">🏦 GTBank</option>
                <option value="First Bank">🏦 First Bank</option>
                <option value="Access Bank">🏦 Access Bank</option>
                <option value="Zenith Bank">🏦 Zenith Bank</option>
              </select>

              <label className="form-label mt-3">Account Number</label>
              <input
                type="text"
                className="form-control"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </>
          )}

          {/* ===== OPAY ===== */}
          {method === "opay" && (
            <>
              <label className="form-label mt-3">Opay Account Number</label>
              <input
                type="text"
                className={`form-control ${!opayValid ? styles.invalid : ""}`}
                value={opayNumber}
                onChange={handleOpayChange}
                placeholder="10-digit number"
                required
              />
              {!opayValid && (
                <small className="text-danger">Invalid Opay number</small>
              )}
            </>
          )}

          {/* ===== USSD ===== */}
          {method === "ussd" && (
            <>
              <label className="form-label mt-3">Enter USSD Code</label>
              <input
                type="text"
                className="form-control"
                value={ussdCode}
                onChange={handleUssdChange}
                placeholder="*737*2*Amount#"
                required
              />
            </>
          )}

          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Pay Now
            </button>
          </div>
        </form>

        {/* Success Overlay */}
        {success && (
          <div className={styles.successOverlay}>
            <div className={styles.checkmark}>✔</div>
            <p>Payment Successful!</p>
          </div>
        )}
      </div>
    </div>
  );
}
