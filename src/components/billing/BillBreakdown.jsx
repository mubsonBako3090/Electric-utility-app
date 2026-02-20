'use client';

export default function BillBreakdown({ bill }) {
  const breakdown = [
    { label: 'Energy Charges', amount: bill.energyCharges || 850 },
    { label: 'Fixed Charges', amount: bill.fixedCharges || 100 },
    { label: 'Taxes', amount: bill.taxes || 85 },
    { label: 'Meter Rent', amount: 20 },
    { label: 'Fuel Surcharge', amount: bill.fuelSurcharge || 45 },
  ];

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium">Bill Breakdown</h2>
        <p className="text-sm text-gray-500">
          Billing Period: {bill.period}
        </p>
      </div>
      <div className="px-6 py-5">
        <div className="space-y-4">
          {breakdown.map((item) => (
            <div key={item.label} className="flex justify-between">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium">₹{item.amount}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-semibold text-blue-600">₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
      }
