// utility to apply to all clickable spans
export const clickableProps = (onClick: () => void, ariaLabel: string) => ({
  tabIndex: 0,
  role: 'button',
  onClick,
  'aria-label': ariaLabel,
  onKeyDown: (e: React.KeyboardEvent) => e.key === 'Enter' && onClick(),
})
