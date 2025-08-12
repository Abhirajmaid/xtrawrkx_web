"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useAuth } from "@/src/contexts/AuthContext";
import { commonToasts, toastUtils } from "@/src/utils/toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signIn, user, isFirebaseAvailable } = useAuth();

  useEffect(() => {
    if (user?.isAdmin) {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFirebaseAvailable) {
      const errorMessage =
        "Firebase is not available. Please check your configuration and try again.";
      setError(errorMessage);
      toastUtils.error(errorMessage);
      return;
    }

    if (!email || !password) {
      const errorMessage = "Please enter both email and password";
      setError(errorMessage);
      toastUtils.validationError(errorMessage);
      return;
    }

    setIsLoading(true);
    setError("");
    const loadingToast = toastUtils.loading("Signing in...");

    try {
      await signIn(email, password);
      toastUtils.update(
        loadingToast,
        "success",
        "Successfully logged in! Welcome back."
      );
      router.push("/admin/dashboard");
    } catch (error) {
      const errorMessage = error.message || "Login failed. Please try again.";
      setError(errorMessage);
      toastUtils.update(loadingToast, "error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-secondary/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-brand-primary rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-brand-secondary rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-primary/20 animate-float">
            <Icon
              icon="solar:shield-keyhole-bold"
              className="h-8 w-8 text-white"
            />
          </div>
          <h1 className="text-heading text-brand-dark mb-2">Admin Portal</h1>
          <p className="text-body text-brand-gray">
            Secure access to dashboard and management tools
          </p>
        </div>

        {/* Firebase Status Warning */}
        {!isFirebaseAvailable && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icon
                  icon="solar:danger-circle-bold"
                  className="h-6 w-6 text-yellow-600"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Configuration Required
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Firebase configuration is missing. Please verify your
                  environment setup.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="card shadow-xl shadow-brand-primary/5 border-2 border-brand-gray-light/20 backdrop-blur-sm">
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-brand-dark mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon
                      icon="solar:letter-bold"
                      className="h-5 w-5 text-brand-gray"
                    />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-12 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                    placeholder="Enter your email address"
                    disabled={isLoading || !isFirebaseAvailable}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-brand-dark mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon
                      icon="solar:lock-keyhole-bold"
                      className="h-5 w-5 text-brand-gray"
                    />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-12 pr-12 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                    placeholder="Enter your password"
                    disabled={isLoading || !isFirebaseAvailable}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200 hover:text-brand-primary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || !isFirebaseAvailable}
                  >
                    <Icon
                      icon={
                        showPassword
                          ? "solar:eye-closed-bold"
                          : "solar:eye-bold"
                      }
                      className="h-5 w-5 text-brand-gray hover:text-brand-primary transition-colors"
                    />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <Icon
                      icon="solar:danger-circle-bold"
                      className="h-5 w-5 text-red-600 mr-3 flex-shrink-0"
                    />
                    <span className="text-sm text-red-700 font-medium">
                      {error}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isFirebaseAvailable}
                className="w-full flex justify-center items-center py-4 px-6 border-0 rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-brand-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Icon icon="solar:login-3-bold" className="h-5 w-5 mr-3" />
                    Access Dashboard
                  </>
                )}
              </button>

              {/* Additional Security Info */}
              <div className="text-center pt-2">
                <p className="text-xs text-brand-gray flex items-center justify-center">
                  <Icon
                    icon="solar:shield-check-bold"
                    className="h-4 w-4 mr-1 text-green-500"
                  />
                  Secured with enterprise-grade encryption
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Development Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Icon
                icon="solar:code-circle-bold"
                className="h-4 w-4 text-gray-600 mr-2"
              />
              <span className="text-xs font-medium text-gray-700">
                Development Mode
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Firebase Status:{" "}
              <span
                className={`font-medium ${
                  isFirebaseAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {isFirebaseAvailable ? "Connected" : "Disconnected"}
              </span>
            </p>
            {!isFirebaseAvailable && (
              <p className="text-xs text-gray-600 mt-1">
                Verify your .env.local configuration
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-brand-gray/70 flex items-center justify-center">
            <Icon icon="solar:copyright-bold" className="h-3 w-3 mr-1" />
            2025 Xtrawrkx. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
