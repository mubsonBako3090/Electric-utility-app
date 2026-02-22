'use client';

import { useAuthModal } from '@/context/AuthModalContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AuthModals() {
  const {
    isLoginOpen,
    isRegisterOpen,
    isForgotPasswordOpen,
    closeModals,
    switchToLogin,
    switchToRegister,
    switchToForgotPassword,
    modalData,
  } = useAuthModal();

  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: modalData?.email || '',
    password: '',
  });

  // Register Form State
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    customerCategory: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  // Forgot Password State
  const [forgotData, setForgotData] = useState({
    email: '',
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setRegisterData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      closeModals();
      setLoginData({ email: '', password: '' });
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await register(registerData);
    if (result.success) {
      closeModals();
      setRegisterData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        customerCategory: '',
        address: { street: '', city: '', state: '', pincode: '' },
      });
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forgotData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset link sent to your email');
        closeModals();
      } else {
        toast.error(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  const customerCategories = [
    { value: 'R1', label: 'Residential - R1 (0-100 kWh)' },
    { value: 'R2', label: 'Residential - R2 (101-200 kWh)' },
    { value: 'R3', label: 'Residential - R3 (201-300 kWh)' },
    { value: 'R4', label: 'Residential - R4 (301-500 kWh)' },
    { value: 'R5', label: 'Residential - R5 (500+ kWh)' },
    { value: 'C1', label: 'Commercial - C1 (Small)' },
    { value: 'C2', label: 'Commercial - C2 (Large)' },
  ];

  return (
    <>
      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={closeModals} title="Sign In" size="md">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            icon={EnvelopeIcon}
            required
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            icon={LockClosedIcon}
            required
            placeholder="Enter your password"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => switchToForgotPassword()}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot Password?
            </button>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              Sign In
            </Button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => switchToRegister()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Register here
            </button>
          </p>
        </form>
      </Modal>

      {/* Register Modal */}
      <Modal isOpen={isRegisterOpen} onClose={closeModals} title="Create Account" size="lg">
        <form onSubmit={handleRegister} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={registerData.name}
            onChange={handleRegisterChange}
            icon={UserIcon}
            required
            placeholder="Enter your full name"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            icon={EnvelopeIcon}
            required
            placeholder="Enter your email"
          />
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={registerData.phone}
            onChange={handleRegisterChange}
            icon={PhoneIcon}
            required
            placeholder="Enter your phone number"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Category <span className="text-red-500">*</span>
            </label>
            <select
              name="customerCategory"
              value={registerData.customerCategory}
              onChange={handleRegisterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select a category</option>
              {customerCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Street Address"
            type="text"
            name="address.street"
            value={registerData.address.street}
            onChange={handleRegisterChange}
            icon={MapPinIcon}
            required
            placeholder="Enter street address"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              type="text"
              name="address.city"
              value={registerData.address.city}
              onChange={handleRegisterChange}
              required
            />
            <Input
              label="State"
              type="text"
              name="address.state"
              value={registerData.address.state}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <Input
            label="Pincode"
            type="text"
            name="address.pincode"
            value={registerData.address.pincode}
            onChange={handleRegisterChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleRegisterChange}
            icon={LockClosedIcon}
            required
            placeholder="Create a password"
            helpText="Minimum 6 characters"
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            icon={LockClosedIcon}
            required
            placeholder="Confirm your password"
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              Register
            </Button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => switchToLogin()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in here
            </button>
          </p>
        </form>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal isOpen={isForgotPasswordOpen} onClose={closeModals} title="Reset Password" size="md">
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <Input
            label="Email"
            type="email"
            name="email"
            value={forgotData.email}
            onChange={handleForgotChange}
            icon={EnvelopeIcon}
            required
            placeholder="Enter your registered email"
          />
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              Send Reset Link
            </Button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => switchToLogin()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </button>
          </p>
        </form>
      </Modal>
    </>
  );
    }
