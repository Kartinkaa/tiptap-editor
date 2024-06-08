import { Node } from '@tiptap/vue-3'

declare module '@tiptap/core' {
  interface Commands {
    FontWeightNodeType: {
      setFontWeight: (number) => void
      getFontWeight: () => number
      exportTextWithFontWeight: () => string
    }
  }
}

export interface FontWeightNodeType {}

function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max))
}

export const FontWeight = Node.create<FontWeightNodeType>({
  name: 'FontWeight',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontWeight: {
            default: null,
            parseHTML: (element) =>
              element.style.fontWeight.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontWeight) {
                return {}
              }
              return {
                style: `font-weight: ${attributes.fontWeight}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontWeight:
        (sliderValue: number) =>
        ({ chain }) => {
          const fontWeight = Math.ceil(sliderValue / 10) * 100
          const roundedFontWeight = clamp(fontWeight, 100, 900)

          return chain()
            .setMark('textStyle', { fontWeight: roundedFontWeight })
            .run()
        },
      getFontWeight:
        () =>
        ({ state }) => {
          const { from, to } = state.selection
          let fontWeight = null

          state.doc.nodesBetween(from, to, (node) => {
            if (node.marks) {
              node.marks.forEach((mark) => {
                if (mark.attrs.fontWeight) {
                  fontWeight = mark.attrs.fontWeight
                }
              })
            }
          })

          return fontWeight
        },
      exportTextWithFontWeight:
        () =>
        ({ state }) => {
          let annotatedText = ''

          state.doc.descendants((node, pos) => {
            if (node.isText) {
              let text = node.text
              let fontWeight = null

              node.marks.forEach((mark) => {
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
        },
    }
  },
})
