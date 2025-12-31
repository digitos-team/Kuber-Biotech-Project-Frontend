import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { getContent } from "../utils/content";
import { MapPin, Phone, Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import { createContact } from "../api/contactApi";

const Contact = () => {
  const { lang } = useLanguage();
  const content = getContent(lang);
  const { contact } = content;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: "", // 'success' or 'error'
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      await createContact(formData);
      setSubmitStatus({
        type: "success",
        message: lang === "mr"
          ? "आपला संदेश यशस्वीरित्या पाठवला गेला आहे! आम्ही लवकरच तुमच्याशी संपर्क साधू."
          : "Your message has been sent successfully! We'll get back to you soon."
      });
      // Reset form
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus({
        type: "error",
        message: lang === "mr"
          ? "संदेश पाठवताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा."
          : "Failed to send message. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 py-12 md:py-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {contact.title}
          </h1>
          <p className="text-base md:text-xl">
            {lang === "mr"
              ? "आम्ही तुमची मदत करण्यासाठी येथे आहोत. आमच्याशी संपर्क साधा!"
              : "We're here to help you. Get in touch with us!"}
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Address */}
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <MapPin className="w-7 h-7 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">
                {lang === "mr" ? "पत्ता" : "Address"}
              </h3>
              <p className="text-gray-600 text-sm">{contact.address}</p>
            </div>

            {/* Phone */}
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <Phone className="w-7 h-7 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">
                {lang === "mr" ? "फोन" : "Phone"}
              </h3>
              <a
                href={`tel:${contact.phone}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                {contact.phone}
              </a>
            </div>

            {/* Email */}
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
              <Mail className="w-7 h-7 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">
                {lang === "mr" ? "ईमेल" : "Email"}
              </h3>
              <a
                href={`mailto:${contact.email}`}
                className="text-purple-600 font-semibold break-all hover:underline"
              >
                {contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
                {lang === "mr" ? "संपर्कात रहा" : "Get In Touch"}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                {lang === "mr"
                  ? "तुमचा संदेश आम्हाला पाठवा आणि आम्ही लवकरच तुमच्याशी संपर्क साधू"
                  : "Send us a message and we'll get back to you as soon as possible"}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              {/* Status Messages */}
              {submitStatus.message && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${submitStatus.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{submitStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {lang === "mr" ? "नाव" : "Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder={lang === "mr" ? "तुमचे नाव" : "Your name"}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {lang === "mr" ? "ईमेल" : "Email"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder={lang === "mr" ? "तुमचा ईमेल" : "your.email@example.com"}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {lang === "mr" ? "संदेश" : "Message"} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder={lang === "mr" ? "तुमचा संदेश येथे लिहा..." : "Write your message here..."}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg ${loading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {lang === "mr" ? "पाठवत आहे..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {lang === "mr" ? "संदेश पाठवा" : "Send Message"}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
