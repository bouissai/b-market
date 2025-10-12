export function SectionSeparator({ variant = "default" }: { variant?: "default" | "wave" | "diagonal" }) {
    if (variant === "wave") {
      return (
        <div className="relative h-24 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,0 C300,80 600,80 900,40 C1050,20 1150,0 1200,0 L1200,120 L0,120 Z" className="fill-muted/20" />
            <path
              d="M0,20 C300,100 600,100 900,60 C1050,40 1150,20 1200,20 L1200,120 L0,120 Z"
              className="fill-muted/10"
              opacity="0.5"
            />
          </svg>
        </div>
      )
    }
  
    if (variant === "diagonal") {
      return (
        <div className="relative h-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/5 to-muted/20 transform -skew-y-2" />
        </div>
      )
    }
  
    return (
      <div className="relative h-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-muted/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted/5 via-transparent to-transparent" />
      </div>
    )
  }
  