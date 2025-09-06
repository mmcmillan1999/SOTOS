import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

function QRCodeDisplay({ currentEnv }) {
  const [showQR, setShowQR] = useState(false);
  const tournamentUrl = 'https://sotos-tournament.netlify.app';
  
  return (
    <>
      {/* QR Code Toggle Button */}
      <button
        onClick={() => setShowQR(!showQR)}
        className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs hover:bg-purple-700 transition-colors font-semibold"
      >
        {showQR ? 'Hide' : 'Show'} QR
      </button>
      
      {/* QR Code Modal */}
      {showQR && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowQR(false)}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-purple-800 mb-2">
                Scan to View Tournament
              </h3>
              <p className="text-xs text-purple-600">
                View live scores and navigate rounds on your phone
              </p>
            </div>
            
            <div className="bg-white p-4 border-2 border-purple-200 rounded">
              <QRCodeSVG 
                value={tournamentUrl}
                size={200}
                level="M"
                includeMargin={true}
                fgColor="#8B5CF6"
              />
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600 mb-2">
                {tournamentUrl}
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QRCodeDisplay;