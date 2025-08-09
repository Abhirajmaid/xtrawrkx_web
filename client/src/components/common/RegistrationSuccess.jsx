import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const RegistrationSuccess = ({
  registrationData,
  onRedirect,
  redirectDelay = 5000,
}) => {
  const [countdown, setCountdown] = useState(Math.ceil(redirectDelay / 1000));

  useEffect(() => {
    // Start countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-redirect after specified delay
    const redirectTimer = setTimeout(() => {
      if (onRedirect) {
        onRedirect();
      } else {
        window.location.href = "/events";
      }
    }, redirectDelay);

    // Cleanup timers on unmount
    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimer);
    };
  }, [redirectDelay, onRedirect]);

  const handleManualRedirect = () => {
    if (onRedirect) {
      onRedirect();
    } else {
      window.location.href = "/events";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation Container */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center">
            {/* Animated Success Circle */}
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <Icon
                  icon="mdi:check-bold"
                  className="text-white text-4xl"
                  width={48}
                />
              </div>
            </div>

            {/* Confetti Effect */}
            <div className="absolute -top-4 -left-4 text-yellow-400 animate-bounce">
              <Icon icon="mdi:star-four-points" width={24} />
            </div>
            <div
              className="absolute -top-4 -right-4 text-blue-400 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            >
              <Icon icon="mdi:star-four-points" width={20} />
            </div>
            <div
              className="absolute -bottom-4 -left-4 text-pink-400 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            >
              <Icon icon="mdi:star-four-points" width={18} />
            </div>
            <div
              className="absolute -bottom-4 -right-4 text-purple-400 animate-bounce"
              style={{ animationDelay: "0.6s" }}
            >
              <Icon icon="mdi:star-four-points" width={22} />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Registration Successful!
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            Thank you for registering with XtraWrkx Events. Your registration
            has been confirmed!
          </p>

          {/* Registration Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <Icon icon="mdi:clipboard-check" className="mr-2" width={20} />
              Registration Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Registration ID:</span>
                <span className="font-mono bg-white px-3 py-1 rounded border font-medium">
                  {registrationData?.registrationId || "REG-XXXX"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Company:</span>
                <span className="font-medium text-gray-900">
                  {registrationData?.companyName || "Your Company"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Event:</span>
                <span className="font-medium text-gray-900">
                  {registrationData?.eventTitle || registrationData?.season
                    ? `Season ${registrationData.season}`
                    : "Event Registration"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ticket Type:</span>
                <span className="font-medium text-gray-900">
                  {registrationData?.ticketType === "asp" ? "ASP" : "GNP"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Cost:</span>
                <span className="font-bold text-green-600">
                  {registrationData?.totalCost === 0
                    ? "FREE"
                    : `₹${(registrationData?.totalCost || 0).toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center justify-center">
              <Icon icon="mdi:information" className="mr-2" width={20} />
              What's Next?
            </h3>

            <div className="text-sm text-blue-800 space-y-2">
              <p>✅ Confirmation email will be sent shortly</p>
              <p>✅ Event details and instructions will follow</p>
              <p>✅ Join our community for updates and networking</p>
              {registrationData?.totalCost > 0 && (
                <p>✅ Payment confirmation and receipt emailed</p>
              )}
            </div>
          </div>

          {/* Auto Redirect Notice */}
          <div className="flex items-center justify-center mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Icon
              icon="mdi:timer"
              className="text-yellow-600 mr-2"
              width={20}
            />
            <span className="text-yellow-800 font-medium">
              Redirecting to events page in {countdown} second
              {countdown !== 1 ? "s" : ""}...
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleManualRedirect}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Icon icon="mdi:arrow-right" className="mr-2" width={20} />
              Continue to Events
            </button>

            <a
              href="/"
              className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Icon icon="mdi:home" className="mr-2" width={20} />
              Back to Home
            </a>
          </div>
        </div>

        {/* Support Information */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm mb-2">
            Need help? Contact our support team
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a
              href="mailto:support@xtrawrkx.com"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Icon icon="mdi:email" className="mr-1" width={16} />
              support@xtrawrkx.com
            </a>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">
              Registration ID: {registrationData?.registrationId || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
