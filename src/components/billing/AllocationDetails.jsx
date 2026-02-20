'use client';

export default function AllocationDetails({ bill }) {
  const allocations = [
    { time: 'Peak Hours (6 PM - 10 PM)', units: 45, rate: 8.5, amount: 382.5 },
    { time: 'Off-Peak Hours', units: 120, rate: 5.0, amount: 600 },
    { time: 'Weekend/Holiday', units: 35, rate: 4.5, amount: 157.5 },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium">Energy Allocation Details</h2>
        <p className="text-sm text-gray-500">
          Time-of-day usage breakdown
        </p>
      </div>

      <div className="px-6 py-5">
        <div className="space-y-4">
          {allocations.map((item) => (
            <div key={item.time} className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  {item.time}
                </span>
                <p className="text-xs text-gray-500">
                  {item.units} kWh @ ₦{item.rate}/kWh
                </p>
              </div>
              <span className="font-medium">₦{item.amount}</span>
            </div>
          ))}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Units: 200 kWh</span>
              <span>Effective Rate: ₦5.70/kWh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
        }
