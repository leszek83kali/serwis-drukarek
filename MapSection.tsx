
import React from 'react';

const MapSection: React.FC = () => {
  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src="https://maps.google.com/maps?width=100%25&height=600&hl=pl&q=Promienista%2016,%20Pniewy+(Print%20Expert%20Pniewy)&t=&z=16&ie=UTF8&iwloc=B&output=embed"
      >
        <a href="https://www.gps.ie/">gps tracker sport</a>
      </iframe>
    </div>
  );
};

export default MapSection;
