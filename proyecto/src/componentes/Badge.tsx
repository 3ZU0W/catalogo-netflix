interface Props {
  label: string;
}

const Badge = ({ label }: Props) => (
  <span
    style={{
      background: "rgba(229,9,20,0.15)",
      color: "#e50914",
      border: "1px solid rgba(229,9,20,0.3)",
      borderRadius: 4,
      padding: "2px 8px",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 1,
      textTransform: "uppercase",
    }}
  >
    {label}
  </span>
);

export default Badge;