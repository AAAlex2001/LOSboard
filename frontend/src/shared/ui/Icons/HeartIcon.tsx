interface HeartIconProps {
  className?: string;
}

const HeartIcon = ({ className }: HeartIconProps) => (
  <svg
    className={className}
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 10.6667C16 10.6667 16.0184 10.6933 14.9867 9.33332C13.8133 7.78666 12.08 6.66666 10 6.66666C6.68 6.66666 4 9.34666 4 12.6667C4 13.9067 4.37333 15.0533 5.01333 16C6.09333 17.6133 16 28 16 28M16 10.6667C16 10.6667 16 11.3333 17.0133 9.33332C18.1867 7.78666 19.92 6.66666 22 6.66666C25.32 6.66666 28 9.34666 28 12.6667C28 13.9067 27.6267 15.0533 26.9867 16C25.9067 17.6133 16 28 16 28"
      stroke="#1E1E1E"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HeartIcon;
