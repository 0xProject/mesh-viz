import React from 'react';

export interface MeshLogoProps {
  width?: string;
  height?: string;
}

export const MeshLogo: React.FC<MeshLogoProps> = ({ width, height }) => (
  <svg width={width} height={height} viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="-1" y="-1" width="252" height="252">
      <path
        d="M125 247C192.379 247 247 192.379 247 125C247 57.6213 192.379 3 125 3C57.6213 3 3 57.6213 3 125C3 192.379 57.6213 247 125 247Z"
        fill="#00AE99"
        stroke="#C4C4C4"
        strokeWidth="7"
        strokeMiterlimit="10"
      />
    </mask>
    <g mask="url(#mask0)">
      <path
        d="M125 247C192.379 247 247 192.379 247 125C247 57.6213 192.379 3 125 3C57.6213 3 3 57.6213 3 125C3 192.379 57.6213 247 125 247Z"
        stroke="#00AE99"
        strokeWidth="7"
        strokeMiterlimit="10"
      />
      <path d="M188 62L188 186" stroke="#00AE99" strokeWidth="7" strokeMiterlimit="10" />
      <path d="M63 61L63 187" stroke="#00AE99" strokeWidth="7" strokeMiterlimit="10" />
      <path d="M186 186H64" stroke="#00AE99" strokeWidth="7" strokeMiterlimit="10" />
      <path d="M187 61L63 61" stroke="#00AE99" strokeWidth="7" strokeMiterlimit="10" />
      <path d="M187 187L63 63" stroke="#00AE99" strokeWidth="7" strokeMiterlimit="10" />
      <path d="M62 187L187 63" stroke="#00AE99" strokeWidth="7" strokeMiterlimit="10" />
      <rect x="40" y="39" width="46" height="46" fill="#00AE99" />
      <rect x="165" y="40" width="46" height="46" fill="#00AE99" />
      <rect x="165" y="163" width="46" height="46" fill="#00AE99" />
      <rect x="40" y="163" width="46" height="46" fill="#00AE99" />
    </g>
  </svg>
);

MeshLogo.defaultProps = {
  width: '60',
  height: '60',
};
