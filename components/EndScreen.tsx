export default function EndScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="end-screen">
      <img src="/logo.png" className="logo" />
      <img src="/gracias.png" className="thanks" />

      <img
        src="/inicio.png"
        className="restart-button"
        onClick={onRestart}
      />
    </div>
  );
}