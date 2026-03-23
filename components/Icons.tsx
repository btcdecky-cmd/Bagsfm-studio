export function IconDashboard({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
    </svg>
  )
}

export function IconDeployments({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 1V15M2 4.5L8 8L14 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

export function IconEvents({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="2.5" fill="currentColor" />
      <path d="M8 1.5V4M8 12V14.5M1.5 8H4M12 8H14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconPrograms({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="2" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 6L3 8L5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 6L13 8L11 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 5L7 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconTokens({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 4V12M5.5 5.5H9.25C10.2 5.5 11 6.2 11 7C11 7.8 10.2 8.5 9.25 8.5H5.5H9.5C10.5 8.5 11.2 9.2 11.2 10C11.2 10.8 10.5 11.5 9.5 11.5H5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function IconWallet({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="4" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 9C10.5 9.55 10.95 10 11.5 10C12.05 10 12.5 9.55 12.5 9C12.5 8.45 12.05 8 11.5 8C10.95 8 10.5 8.45 10.5 9Z" fill="currentColor" />
      <path d="M1 7H15M4 4V3C4 2.45 4.45 2 5 2H11C11.55 2 12 2.45 12 3V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconBuilder({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 14L6 10M6 10L10 6M6 10L4 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 2L14 6L11 9L7 5L10 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M13 13L11 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconShowcase({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1L10 5.5H15L11 8.5L12.5 13.5L8 10.5L3.5 13.5L5 8.5L1 5.5H6L8 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

export function IconAssistant({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V10C14 10.55 13.55 11 13 11H9L6 14V11H3C2.45 11 2 10.55 2 10V3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5 6H11M5 8H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
