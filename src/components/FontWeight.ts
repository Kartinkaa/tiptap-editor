import { Node } from '@tiptap/vue-3'
import { CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    FontWeightNodeType: {
      setFontWeight: (sliderValue: number) => ReturnType
      getFontWeight: () => number | null
      exportTextWithFontWeight: () => string
    }
  }
}

export interface FontWeightNodeType {
  types: string[]
}

function clamp(number: number, min: number, max: number): number {
  return Math.max(min, Math.min(number, max))
}

export const FontWeight = Node.create<FontWeightNodeType>({
  name: 'FontWeight',
  addOptions() {
    return {
      types: ['textStyle']
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: (this.options as FontWeightNodeType).types,
        attributes: {
          fontWeight: {
            default: null,
            parseHTML: (element: HTMLElement) =>
              element.style.fontWeight.replace(/['"]+/g, ''),
            renderHTML: (attributes: { fontWeight: string | null }) => {
              if (!attributes.fontWeight) {
                return {}
              }
              return {
                style: `font-weight: ${attributes.fontWeight}`
              }
            }
          }
        }
      }
    ]
  },
  // @ts-ignore: Unreachable code error
  addCommands() {
    return {
      setFontWeight:
        (sliderValue: number) =>
        ({ chain }: CommandProps) => {
          const fontWeight = Math.ceil(sliderValue / 10) * 100
          const roundedFontWeight = clamp(fontWeight, 100, 900)

          return chain()
            .setMark('textStyle', { fontWeight: roundedFontWeight })
            .run()
        },
      getFontWeight:
        () =>
        ({ state }: CommandProps): number | null => {
          const { from, to } = state.selection
          let fontWeight: number | null = null

          state.doc.nodesBetween(from, to, node => {
            if (node.marks) {
              node.marks.forEach(mark => {
                if (mark.attrs.fontWeight) {
                  fontWeight = parseInt(mark.attrs.fontWeight, 10)
                }
              })
            }
          })

          return fontWeight
        },
      exportTextWithFontWeight:
        () =>
        ({ state }: CommandProps): string => {
          let annotatedText = ''

          state.doc.descendants(node => {
            if (node.isText) {
              const text = node.text
              let fontWeight: string | null = null

              node.marks.forEach(mark => {
                if (mark.attrs.fontWeight) {
                  fontWeight = mark.attrs.fontWeight
                }
              })

              if (fontWeight) {
                annotatedText += `${text}:${fontWeight} `
              } else {
                annotatedText += text + ' '
              }
            }
          })

          return annotatedText.trim()
        }
    }
  }
})
