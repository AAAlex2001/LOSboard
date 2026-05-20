interface ArrowRightIconProps {
  className?: string;
}

const ArrowRightIcon = ({ className }: ArrowRightIconProps) => (
  <svg
    className={className}
    width="11"
    height="22"
    viewBox="0 0 11 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.5 5L8 11L2.5 17"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArrowRightIcon;
