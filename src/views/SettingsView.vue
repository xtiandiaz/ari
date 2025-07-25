<script setup lang="ts">
import { onMounted  } from 'vue'
import { useRoute } from 'vue-router'
import scoresStore from '@/stores/records'
import { clearScores, clearRecords } from '@/services/records-management'
import Form from '@vueties/components/form/VuetyForm.vue'
import FormSection from '@vueties/components/form/VuetyFormSection.vue'
import ButtonFormRow from '@vueties/components/form/rows/VuetyButtonFormRow.vue'
import { version } from '@/../package.json'

const route = useRoute()
const scores = scoresStore()

onMounted(() => {
  route.meta.setTitle("Settings", false)
})
</script>

<template>
  <main>
    <Form>
      <FormSection
        :footnote="`Daily scores will be cleared automatically by the end of the day. But, clear them now if you want to start today over.`"
      >
        <ButtonFormRow 
          :label="`Clear today's scores`" 
          :isDestructive="true"
          :class="{ disabled: !scores.hasAnyDailyScore }"
          @click="clearScores()"
        />
      </FormSection>
      <FormSection
        :footnote="`Use the records to assess your daily achievements. Clear them only if you'd like to re-establish your personal records.`"
      >
        <ButtonFormRow 
          :label="`Clear all records`" 
          :isDestructive="true"
          :class="{ disabled: scores.recordLevel === 0 }"
          @click="clearRecords()"
        />
      </FormSection>
    </Form>
    <span class='version'>v{{ version }}</span>
  </main>
</template>

<style scoped lang="scss">
@use '@design-tokens/palette';
@use '@design-tokens/typography';

main {
  text-align: center;
  
  .version {
    @extend .caption;
    @include palette.color-attribute('color', 'tertiary-body');
  }
}
</style>
