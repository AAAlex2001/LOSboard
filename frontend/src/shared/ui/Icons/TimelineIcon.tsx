interface TimelineIconProps {
  className?: string;
}

const TimelineIcon = ({ className }: TimelineIconProps) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.5 2.5V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H17.5"
      stroke="#1129BD"
      strokeWidth="2"
      strokeMiterlimit="5.759"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83398 11.6667L9.16732 8.33333L12.5007 11.6667L17.5007 6.66666"
      stroke="#1129BD"
      strokeWidth="2"
      strokeMiterlimit="5.759"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 6.66666H17.5V9.16666"
      stroke="#1129BD"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default TimelineIcon;
