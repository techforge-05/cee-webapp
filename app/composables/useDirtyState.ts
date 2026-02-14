import { isEqual } from 'lodash-es'

/**
 * Composable for tracking form dirty state (unsaved changes)
 * Uses deep comparison to detect changes between original and current state
 */
export const useDirtyState = () => {
  const isDirty = ref(false)
  const originalState = ref<any>(null)
  const currentState = ref<any>(null)

  /**
   * Initialize with original data
   * @param data - The initial/original data state
   */
  function init(data: any) {
    // Deep clone to avoid reference issues
    originalState.value = JSON.parse(JSON.stringify(data))
    currentState.value = JSON.parse(JSON.stringify(data))
    isDirty.value = false
  }

  /**
   * Update current state and check if dirty
   * @param data - The current data state
   */
  function update(data: any) {
    currentState.value = JSON.parse(JSON.stringify(data))
    isDirty.value = !isEqual(originalState.value, currentState.value)
  }

  /**
   * Reset to original state (cancel changes)
   * @returns The original state for restoring form values
   */
  function reset() {
    currentState.value = JSON.parse(JSON.stringify(originalState.value))
    isDirty.value = false
    return currentState.value
  }

  /**
   * Mark as clean (after successful save)
   * Updates original state to match current state
   */
  function markClean() {
    originalState.value = JSON.parse(JSON.stringify(currentState.value))
    isDirty.value = false
  }

  return {
    isDirty: readonly(isDirty),
    init,
    update,
    reset,
    markClean,
  }
}
