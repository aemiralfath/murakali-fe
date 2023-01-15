import { Chip } from '@/components'
import { HiX } from 'react-icons/hi'

const VariantChip: React.FC<{
  content: string
  onClose: (s: string) => void
}> = ({ content, onClose }) => {
  return (
    <Chip className="flex items-center gap-1 normal-case" type="gray">
      {content}
      <button
        className="aspect-square rounded-full bg-black bg-opacity-10 p-[0.1rem] transition-all hover:bg-opacity-20"
        onClick={() => {
          onClose(content)
        }}
      >
        <HiX />
      </button>
    </Chip>
  )
}

export default VariantChip
