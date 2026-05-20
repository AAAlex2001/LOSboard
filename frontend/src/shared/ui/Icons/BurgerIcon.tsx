interface BurgerIconProps {
  className?: string;
}

const BurgerIcon = ({ className }: BurgerIconProps) => (
  <svg
    className={className}
    width="37"
    height="37"
    viewBox="0 0 37 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 13h18M10 19h18M10 25h18"
      stroke="#1129BD"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default BurgerIcon;
