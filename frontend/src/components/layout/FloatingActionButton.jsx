export default function FloatingActionButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-lg transition-all hover:scale-110 active:scale-95"
    >
      <span className="material-symbols-outlined" data-icon="add">
        add
      </span>
    </button>
  );
}
