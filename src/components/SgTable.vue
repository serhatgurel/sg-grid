<template>
  <table>
    <caption v-if="!!$slots.caption || caption">
      <slot name="caption">{{ caption }}</slot>
    </caption>
    <colgroup>
      <template v-for="field in displayedFields" :key="field.key">
        <slot :name="`col(${field.key})`">
          <col>
        </slot>
      </template>
    </colgroup>
    <thead>
      <tr>
        <th v-for="field in displayedFields">
          <slot :name="`head(${field.key})`" :field="field">
            {{ field.label }}
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <template v-for="key in displayedFieldKeys">
          <Component :is="cellElement(key as string)">
            <slot
              :name="`cell(${key})`"
              :value="format(item, (key as string))"
              :item="item"
              :format="(k: string) => format(item, k)"
            >
              {{ format(item, (key as string)) }}
            </slot>
          </Component>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

interface TableField {
  key: string
  label: string
  format?: Function
  hidden?: boolean
  header?: boolean
}

interface TableItem {
  id: number
  [key: string]: unknown
}

const props = defineProps({
  fields: { type: Array as PropType<TableField[]>, default: () => [] },
  items: { type: Array as PropType<TableItem[]>, default: () => [] },
  caption: { type: String, default: null }
})

const displayedFields = computed(() => props.fields.filter((i) => !i.hidden))

const displayedFieldKeys = computed(() => {
  return Object.entries(displayedFields.value).map(([_key, value]) => value.key)
})

const cellElement = (key: string) => {
  const field = props.fields.find((f) => f.key === key)
  return field && field.header ? 'th' : 'td'
}

const format = (item: TableItem, key: string) => {
  const field = props.fields.find((f) => f.key === key)
  return field && field.format ? field.format(item[key]) : item[key]
}
</script>


<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}
</style>
