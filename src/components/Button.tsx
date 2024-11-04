export const Button = ({ children, onClick }: { children: any, onClick: (event: Event) => void }) => {
  return (
    <button class='ink-button' onClick={(e) => onClick(e)} type='button'>
      {children}
    </button>
  )
}
