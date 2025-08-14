'use client';
import React, { useState } from 'react';
import { apiClient } from '@/app/lib/api';
import AuthGuard from '@/components/auth/AuthGuard';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Car, 
  User,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

interface RideData {
  from: string;
  to: string;
  totalPrice: string;
  date: string;
  time: string;
  seats: number;
  price: string;
  vehicleType: string;
  driverName: string;
  phone: string;
  email: string;
  description: string;
}

const CreateRidePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [rideData, setRideData] = useState<RideData>({
    from: '',
    to: '',
    totalPrice: '',
    date: '',
    time: '',
    seats: 1,
    price: '',
    vehicleType: '',
    driverName: '',
    phone: '',
    email: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const vehicleTypes = [
    'Sedan', 'SUV', 'Hatchback', 'Coupe', 'Minivan', 'Pickup Truck'
  ];

  const handleInputChange = (field: keyof RideData, value: string | number) => {
    setRideData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const departureIso = new Date(`${rideData.date}T${rideData.time}:00`).toISOString();
      const response = await apiClient.createRide({
        origin: String(rideData.from),
        destination: String(rideData.to),
        departure_time: departureIso,
        available_seats: Number(rideData.seats),
        price_per_seat: Number(rideData.price || 0),
        description: String(rideData.description || '')
      });
      if (response.error) {
        alert(response.error);
      } else {
        setIsSuccess(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return rideData.from && rideData.to && rideData.totalPrice && rideData.date && rideData.time;
      case 2:
        return rideData.seats > 0 && rideData.price && rideData.vehicleType;
      case 3:
        return rideData.driverName && rideData.phone && rideData.email;
      default:
        return false;
    }
  };

  const steps = [
    { number: 1, title: 'Journey Details', description: 'Where and when' },
    { number: 2, title: 'Ride Details', description: 'Vehicle and pricing' },
    { number: 3, title: 'Contact Info', description: 'Your details' }
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Ride Created Successfully!</h2>
          <p className="text-gray-600 font-light mb-8">
            Your ride has been posted and is now visible to potential passengers.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium transition-all duration-300"
          >
            Create Another Ride
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Create Your <span className="font-medium">Ride</span>
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Share your journey and connect with fellow travelers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex justify-center">
            <div className="flex items-center space-x-8 max-w-2xl">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-medium transition-all duration-300 ${
                      currentStep >= step.number 
                        ? 'border-gray-900 bg-gray-900 text-white' 
                        : 'border-gray-200 text-gray-400'
                    }`}>
                      {step.number}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className={`font-medium transition-colors duration-300 ${
                        currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-sm text-gray-500">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-300 hidden sm:block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
          
          {/* Step 1: Journey Details */}
          {currentStep === 1 && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-2">Journey Details</h2>
                <p className="text-gray-600 font-light">Tell us about your planned trip</p>
              </div>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      From
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={rideData.from}
                        onChange={(e) => handleInputChange('from', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        placeholder="Starting location"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      To
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={rideData.to}
                        onChange={(e) => handleInputChange('to', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        placeholder="Destination"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Total Ride Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={rideData.totalPrice}
                      onChange={(e) => handleInputChange('totalPrice', e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                      placeholder="Total cost for the entire ride"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the total cost for the entire journey (this will be split among passengers)
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={rideData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={rideData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Ride Details */}
          {currentStep === 2 && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-2">Ride Details</h2>
                <p className="text-gray-600 font-light">Configure your vehicle and pricing</p>
              </div>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Seats
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={rideData.seats}
                        onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                          <option key={num} value={num}>{num} seat{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Price per Seat
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={rideData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        placeholder="Cost per passenger"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Amount each passenger will pay</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Vehicle Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {vehicleTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleInputChange('vehicleType', type)}
                        className={`p-4 rounded-xl border transition-all duration-300 text-left hover:border-gray-300 ${
                          rideData.vehicleType === type
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Car className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900">{type}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Additional Information
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={rideData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 resize-none"
                      rows={4}
                      placeholder="Any special instructions or preferences..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-2">Contact Information</h2>
                <p className="text-gray-600 font-light">How can passengers reach you</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Driver Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={rideData.driverName}
                      onChange={(e) => handleInputChange('driverName', e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={rideData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={rideData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-2">Privacy Notice</h3>
                  <p className="text-sm text-gray-600 font-light">
                    Your contact information will only be shared with passengers who book your ride. 
                    We never share your details with third parties.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isStepValid()
                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isStepValid() && !isSubmitting
                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Ride
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need help creating your ride?</h3>
          <p className="text-gray-600 font-light mb-6 max-w-2xl mx-auto">
            Our support team is here to help you get started with ride sharing. 
            Contact us if you have any questions about pricing, safety, or the booking process.
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default CreateRidePage;
