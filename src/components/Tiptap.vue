<template>
  <editor-content class="content" :editor="editor" />
  <div>{{ exportedText }}</div>
  <div class="slider-container">
    <Slider
      @update-weight="updateWeight"
      v-if="!editor?.state?.selection.empty"
      :initialValue="Number(editor?.commands?.getFontWeight()) / 10"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { FontWeight } from './FontWeight'
import Slider from './Slider.vue'

const exportedText = ref<string | undefined>('')

const editor = useEditor({
  content: '<p>Start type here</p>',
  extensions: [StarterKit, FontWeight, TextStyle],
})

onBeforeUnmount(() => {
  editor?.value?.destroy()
})

const updateWeight = (weight: number) => {
  editor?.value?.commands.setFontWeight(weight)
  exportedText.value = editor?.value?.commands.exportTextWithFontWeight()
}
</script>

<style scoped>
.content {
  box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
  border: 1px solid #dbdbdb;
  display: block;
  width: 19rem;
  max-height: 20rem;
  min-height: 4rem;
  overflow: auto;
  padding: 10px;
  resize: vertical;
  background-color: #dbdbdb;
  border-radius: 4px;
}

.slider-container {
  height: 85px;
  width: 20rem;
}
</style>
