import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { validateForPublish } from './quizSchema';

const showErrors = (title, errors) =>
  Alert.alert(title, errors.slice(0, 5).join('\n') + (errors.length > 5 ? `\n…and ${errors.length - 5} more` : ''));

/** Switch a set between "editing" (draft) and published, validating before publishing. */
export function usePublish() {
  const { updateSet } = useApp();
  return useCallback(
    (set, publish) => {
      if (!publish) {
        // back to editing: also take it out of the marketplace until it is published again
        updateSet(set.id, { status: 'draft', visibility: 'private' });
        return { ok: true, firstInvalid: null };
      }
      const { errors, firstInvalid } = validateForPublish(set);
      if (errors.length) {
        showErrors("Can't publish yet", errors);
        return { ok: false, firstInvalid };
      }
      updateSet(set.id, { status: 'published' });
      return { ok: true, firstInvalid: null };
    },
    [updateSet]
  );
}

/**
 * Switch a set between private and public (listed in the marketplace).
 * Only complete, published quizzes can be public, so going public validates and publishes it too.
 */
export function useVisibility() {
  const { updateSet } = useApp();
  return useCallback(
    (set, makePublic) => {
      if (!makePublic) {
        updateSet(set.id, { visibility: 'private' });
        return { ok: true, firstInvalid: null };
      }
      if (set.origin === 'market') {
        Alert.alert("Can't make this public", 'This quiz came from the marketplace, so only its original author can publish it there.');
        return { ok: false, firstInvalid: null };
      }
      const { errors, firstInvalid } = validateForPublish(set);
      if (errors.length) {
        showErrors("Can't make this public yet", errors);
        return { ok: false, firstInvalid };
      }
      updateSet(set.id, { visibility: 'public', status: 'published' });
      return { ok: true, firstInvalid: null };
    },
    [updateSet]
  );
}
