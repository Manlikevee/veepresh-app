import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import type { QuestionSet } from '../types';
import { validateForPublish } from './quizSchema';

/** Switch a set between "editing" (draft) and published, validating before publishing. */
export function usePublish() {
  const { updateSet } = useApp();
  return useCallback(
    (set: QuestionSet, publish: boolean): { ok: boolean; firstInvalid: number } => {
      if (!publish) {
        updateSet(set.id, { status: 'draft' });
        return { ok: true, firstInvalid: -1 };
      }
      const { errors, firstInvalid } = validateForPublish(set);
      if (errors.length) {
        Alert.alert(
          "Can't publish yet",
          errors.slice(0, 5).join('\n') + (errors.length > 5 ? `\n…and ${errors.length - 5} more` : '')
        );
        return { ok: false, firstInvalid };
      }
      updateSet(set.id, { status: 'published' });
      return { ok: true, firstInvalid: -1 };
    },
    [updateSet]
  );
}
