import React from 'react';

function Footer() {
  return (
    <footer className="mt-12 bg-gradient-to-r from-purple-700 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Sotos Awareness Message */}
        <div className="text-center mb-6">
          <div className="inline-block bg-yellow-400 text-purple-900 px-6 py-3 rounded-full mb-4">
            <p className="font-nunito font-bold text-lg">
              Supporting Families Affected by Sotos Syndrome
            </p>
          </div>
          <p className="text-purple-100 max-w-2xl mx-auto">
            Sotos Syndrome is a rare genetic disorder affecting growth and development. 
            Your participation helps raise awareness and support for affected families.
          </p>
        </div>
        
        {/* Divider */}
        <div className="border-t border-purple-600 my-6"></div>
        
        {/* FAIR-PLAY Branding */}
        <div className="text-center">
          <div className="mb-4">
            <p className="text-2xl font-nunito font-bold mb-2">
              Powered by FAIR-PLAY 🏓
            </p>
            <p className="text-purple-200">
              Revolutionary Tournament Management Platform
            </p>
          </div>
          
          {/* QR Code Section */}
          <div className="bg-white rounded-xl p-4 max-w-sm mx-auto shadow-lg">
            <div className="mb-3">
              {/* QR Code Placeholder */}
              <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center border-2 border-purple-300">
                <div className="text-center">
                  <span className="text-3xl">📱</span>
                  <p className="text-xs text-gray-600 mt-1">QR Code</p>
                </div>
              </div>
            </div>
            
            <p className="text-purple-900 font-semibold text-sm mb-1">
              Interested in FAIR-PLAY for your tournaments?
            </p>
            <p className="text-purple-700 font-bold">
              Text Matt: 801-549-8406
            </p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center mt-6 text-purple-200 text-sm">
          <p>© 2025 FAIR-PLAY Tournament Systems. Made with 💜 for a great cause.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;