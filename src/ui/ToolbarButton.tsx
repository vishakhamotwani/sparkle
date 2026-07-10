type ToolbarButtonProps = {
  label: string;
  icon: string;
  disabled?: boolean;
  onPress: () => void;
};

export function ToolbarButton({
  label,
  icon,
  disabled,
  onPress,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className="toolbar-button"
      disabled={disabled}
      onClick={onPress}
    >
      <span aria-hidden="true">{icon}</span> {label}
    </button>
  );
}
