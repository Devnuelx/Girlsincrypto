'use client';

import React from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Toaster, toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

export default function FreeclassModal({ isOpen, onClose }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = useState(false);


  if (!isOpen) return null;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
  setIsLoading(true);
  e.preventDefault();
  const newErrors = {};

  if (!name.trim()) newErrors.name = 'Name is required.';
  if (!email.trim()) newErrors.email = 'Email is required.';
  else if (!validateEmail(email)) newErrors.email = 'Enter a valid email.';
  if (!phone) newErrors.phone = 'Phone number is required.';
  else if (!isValidPhoneNumber(phone)) newErrors.phone = 'Invalid phone number.';

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone }),
      });

      if (!response.ok) throw new Error('Submission failed');

      toast.success('🎉Registered successfully! Join discord below to keep updated!');
      setName('');
      setEmail('');
      setPhone('');
      onClose(); // close the modal
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please reload page and try again.');
    }finally {
      setIsLoading(false);
    }
  } else {
    toast.error('Please check your details and try again.');
  }
};

  return (
    <>
      <Toaster position="top-right" />
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 font-space">
        <div className="bg-white rounded-lg w-11/12 md:w-5/12 p-6 md:p-20 relative shadow-lg border border-gray-300">
          <button
            onClick={onClose}
          className="absolute top-[-36] right-2 text-white text-3xl"
          >
            x
          </button>

          <h2 className="text-xl font-bold text-center mb-4">
            Register Your Spot Now
          </h2>
          <p className="text-sm text-center mb-4 text-gray-700">
            Just enter your name, email & phone to secure your spot on this webinar...
          </p>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name Here.."
                className={`w-full border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded px-3 py-2`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address Here.."
                className={`w-full border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded px-3 py-2`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <PhoneInput
                placeholder="Enter phone number"
                value={phone}
                onChange={setPhone}
                defaultCountry="US"
                className="phone-input w-full"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 bg-[#F2419C] text-white font-bold py-2 rounded hover:bg-[#F2419C]/60 disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"
                ></path>
              </svg>
            )}
            {isLoading ? 'Submitting...' : 'Click to Sign Up'}
          </button>

          </form>

          <p className="text-[10px] text-gray-600 mt-4 leading-tight">
            By submitting this form, you agree to our{' '}
            <span className="underline">Privacy Policy</span> and{' '}
            <span className="underline">Terms & Conditions</span>.
          </p>
        </div>
      </div>
    </>
  );
}
