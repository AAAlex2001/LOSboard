interface IconProps {
  className?: string;
}

const PersonalIcon = ({ className }: IconProps) => (
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
      d="M25 6.67L35 10v8.33h-5v13.34c0 .44-.18.86-.49 1.17a1.67 1.67 0 0 1-1.18.49H11.67c-.44 0-.86-.18-1.18-.49a1.67 1.67 0 0 1-.49-1.17V18.33H5V10l10-3.33c0 1.32.53 2.6 1.46 3.53A5 5 0 0 0 20 11.67c1.33 0 2.6-.53 3.54-1.47A5 5 0 0 0 25 6.67z"
      fill="#1129BD"
      stroke="#1129BD"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PersonalIcon;
