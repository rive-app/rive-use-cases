import React, { useState } from 'react';
import RiveRow from './RiveRow';
import './DownloadLoader.css';

const DownloadLoader: React.FC = () => {
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  return (
    <div className="loader-rows-container">
      <button
        className="download-all-btn"
        disabled={isDownloadingAll}
        onClick={() => setIsDownloadingAll(true)}
      >
        Download All
      </button>
      {['Serious.pdf', 'Business.pdf', 'Work.pdf'].map((rowLabel) => (
        <RiveRow key={rowLabel} isDownloadingAll={isDownloadingAll}>
          {rowLabel}
        </RiveRow>
      ))}
    </div>
  );
};

export default DownloadLoader;
