'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import BillBreakdown from '@/components/billing/BillBreakdown';
import AllocationDetails from '@/components/billing/AllocationDetails';

export default function BillingPage({ params }) {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch('/api/billing');
      const data = await res.json();
      if (res.ok) {
        setBills(data.bills);
        if (data.bills.length > 0) {
          setSelectedBill(data.bills[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Billing</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bills List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium">Your Bills</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {bills.map((bill) => (
                <button
                  key={bill.id}
                  onClick={() => setSelectedBill(bill)}
                  className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedBill?.id === bill.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">
                    {bill.period}
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: ₹{bill.amount}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Status: <span className={`capitalize ${
                      bill.status === 'paid' ? 'text-green-600' : 
                      bill.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'
                    }`}>{bill.status}</span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bill Details */}
        <div className="lg:col-span-2">
          {selectedBill ? (
            <div className="space-y-6">
              <BillBreakdown bill={selectedBill} />
              <AllocationDetails bill={selectedBill} />
              
              {/* Pay Button */}
              <div className="bg-white shadow rounded-lg p-6">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
                  Pay This Bill
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <p className="text-gray-500">No bill selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
        }
