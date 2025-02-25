import React from "react";

const USE_CASES = [
  {
    icon: "✂️",
    title: "Real Estate Sales Agent",
    description: "Availability, bookings, inquiries",
  },
  {
    icon: "😊",
    title: "Dentist Office",
    description: "Schedule appointments, patient FAQs",
  },
  {
    icon: "🍽️",
    title: "Restaurant",
    description: "Reservations, menu inquiries",
  },
  {
    icon: "🔧",
    title: "SaaS Website",
    description: "Support, product information, troubleshooting",
  },
  {
    icon: "🏠",
    title: "Realtor Office",
    description: "Property inquiries, viewings",
  },
  {
    icon: "📋",
    title: "Insurance Companies",
    description: "Claims, policy help, support",
  },
];

const Info = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="flex flex-col m-12">
          <div className="inline-block mb-6">
            <span className="px-4 py-1.5 text-sm rounded-full bg-purple-900/30 text-purple-300 border border-purple-700/50">
              Real World Use cases
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 inline-block text-transparent bg-clip-text">
            Voice Automation Suite
          </h1>

          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Versatile voice AI for your industry needs: Elevate customer support, automate sales,
            streamline healthcare, and transform operations - the possibilities are limitless.
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {USE_CASES.map((useCase, index) => (
          <div
            key={index}
            className="relative p-6 rounded-2xl bg-gradient-to-b from-purple-900/10 to-transparent border border-purple-800/20"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-8">
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-purple-800/20"></div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="relative">
              <div className="w-10 h-10 mb-4 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400">
                {useCase.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{useCase.title}</h3>
              <p className="text-gray-400">{useCase.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Info;
