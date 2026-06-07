interface Props {
  value: number;
  max?: number;
  size?: number;
}

const StarRating = ({ value, max = 5, size = 16 }: Props) => (
  <span style={{ fontSize: size, letterSpacing: 2 }}>
    {Array.from({ length: max }, (_, i) => (
      <span
        key={i}
        style={{ color: i < Math.round(value) ? "#e50914" : "#444" }}
      >
        ★
      </span>
    ))}
  </span>
);

export default StarRating;