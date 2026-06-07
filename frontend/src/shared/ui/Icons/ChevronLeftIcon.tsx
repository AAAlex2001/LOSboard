interface ChevronLeftIconProps {
  className?: string;
  color?: string;
}

const ChevronLeftIcon = ({ className, color = "currentColor" }: ChevronLeftIconProps) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 18l-6-6 6-6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChevronLeftIcon;
