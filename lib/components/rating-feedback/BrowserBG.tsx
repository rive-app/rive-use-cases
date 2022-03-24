import React from 'react';

type Props = {
  className?: string;
};

const BrowserBG: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="772"
      height="519"
      viewBox="0 0 772 519"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="772" height="519" rx="11" fill="#E4E4E4" />
      <rect y="38" width="772" height="481" rx="12" fill="#2B2B2B" />
      <path
        d="M107 17C107 11.4772 111.477 7 117 7H264C269.523 7 274 11.4772 274 17V38H107V17Z"
        fill="#F8F8F8"
      />
      <rect y="38" width="772" height="43" fill="#F8F8F8" />
      <circle cx="20" cy="19" r="7" fill="#DA6D66" />
      <circle cx="44" cy="19" r="7" fill="#F4CC63" />
      <circle cx="68" cy="19" r="7" fill="#72D64F" />
      <rect x="20" y="48" width="730" height="23" rx="11.5" fill="#EDECEC" />
    </svg>
  );
};

export default BrowserBG;
