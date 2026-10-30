import { computed, shallowRef } from 'vue';
import { toView } from './model';

// Reference mvu-variables.md, method B: current message's variables.stat_data.
// No schema.parse: prefault/coercion would invent values for malformed fields.
const raw = shallowRef<unknown>(undefined);
const view = computed(() => toView(raw.value));
export function useStatusStore() { return { view }; }
export function setSnapshot(data: unknown) { raw.value = data; }
