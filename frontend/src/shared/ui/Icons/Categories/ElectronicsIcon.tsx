interface IconProps {
  className?: string;
}

const ElectronicsIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M37.38 33.01 35.02 24.69V6.56c0-.69-.56-1.25-1.25-1.25H6.27c-.69 0-1.25.56-1.25 1.25v18.13L2.65 33.01c-.29.82.31 1.68 1.18 1.68h32.37c.87 0 1.47-.86 1.18-1.68zM7.83 8.13H32.2v15.43H7.83V8.13zm8.92 23.75.32-1.45h5.87l.32 1.45h-6.5zm8.75 0-.75-3.39c-.03-.14-.16-.25-.31-.25h-8.89c-.15 0-.27.1-.31.25l-.75 3.39H5.9l1.65-5.82h24.93l1.65 5.82h-8.64z"
      fill="#1129BD"
    />
  </svg>
);

export default ElectronicsIcon;
