'use client';

import {
  CurrencyRupeeIcon,
  BoltIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function R1Dashboard({ data }) {
  const stats = [
    {
      name: 'Current Bill',
      value: data?.currentBill ? `₹${data.currentBill}` : '₹1,234',
      icon: CurrencyRupeeIcon,
      change: '+4.75%',
      changeType: 'positive',
      href: '/billing',
    },
    {
      name: 'Units Consumed',
      value: data?.unitsConsumed ? `${data.unitsConsumed} kWh` : '234 kWh',
      icon: BoltIcon,
      change: '-2.3%',
      changeType: 'negative',
      href: '/usage',
    },
    {
      name: 'Average Daily Usage',
      value: data?.avgDaily ? `${data.avgDaily} kWh` : '7.8 kWh',
      icon: ChartBarIcon,
      change: '+1.2%',
      changeType: 'positive',
      href: '/usage',
    },
    {
      name: 'Outages',
      value: data?.outages || '0',
      icon: ExclamationCircleIcon,
      change: 'No outages',
      changeType: 'neutral',
      href: '/outage',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {data?.name || 'Customer'}!
        </h1>
        <p className="text-gray-600">
          Here's your R1 (Residential - Small) electricity summary
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                {stat.changeType === 'positive' && (
                  <span className="text-green-600">{stat.change}</span>
                )}
                {stat.changeType === 'negative' && (
                  <span className="text-red-600">{stat.change}</span>
                )}
                {stat.changeType === 'neutral' && (
                  <span className="text-gray-600">{stat.change}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Bills */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Bills
          </h3>
        </div>
        <div className="px-6 py-5">
          {data?.recentBills?.length > 0 ? (
            <div className="space-y-4">
              {data.recentBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {bill.period}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {bill.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-4">
                      ₹{bill.amount}
                    </span>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bill.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent bills</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Quick Actions
          </h3>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/billing"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Pay Bill
          </Link>
          <Link
            href="/outage"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Report Outage
          </Link>
          <Link
            href="/vacation"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Declare Vacation
          </Link>
        </div>
      </div>
    </div>
  );
      }
