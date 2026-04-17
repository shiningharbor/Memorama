export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="start-screen">
      <img src="/logo.png" className="logo" />
      <img src="/titulo.png" className="title" />

      <img
        src="/play.png"
        className="play-button"
        onClick={onStart}
      />
    </div>
  );
}