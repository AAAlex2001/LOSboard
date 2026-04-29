interface ChatCheckSentIconProps {
  className?: string;
}

const ChatCheckSentIcon = ({ className }: ChatCheckSentIconProps) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.22656 8.9965L7.40881 12.1788L13.7718 5.815"
      stroke="#808080"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChatCheckSentIcon;
