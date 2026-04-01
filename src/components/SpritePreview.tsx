import { renderSprite } from '@/lib/sprites'
import type { CompanionBones } from '@/lib/types'

type Props = {
  bones: CompanionBones
  large?: boolean
  className?: string
}

export function SpritePreview({ bones, large = false, className = '' }: Props) {
  const lines = renderSprite(bones)
  return (
    <pre
      className={`leading-tight text-sprite select-none ${large ? 'text-base' : 'text-xs'} ${className}`}
      aria-hidden="true"
    >
      {lines.join('\n')}
    </pre>
  )
}
