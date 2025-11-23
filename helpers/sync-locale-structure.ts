import { Data } from "@measured/puck";
import type { LocalizedPuckContent } from "@/types/localized-content";
import { Locale } from "@/i18n/routing";

/**
 * Sync structure from source locale to target locale
 * Preserves existing text content in target locale
 */
export function syncLocaleStructure(
  content: LocalizedPuckContent,
  sourceLocale: Locale,
  targetLocale: Locale
): LocalizedPuckContent {
  const source = content[sourceLocale];
  const target = content[targetLocale];

  // If target is empty or has no content, copy entire structure from source
  if (!target || !target.content || target.content.length === 0) {
    return {
      ...content,
      [targetLocale]: {
        content: source.content.map(item => ({
          ...item,
          props: clearTextProps(item.props),
        })),
        root: source.root,
      },
    };
  }

  // Create a map of existing target content by ID for quick lookup
  const targetMap = new Map(
    target.content.map(item => [item.props?.id, item])
  );

  // Sync structure while preserving existing target text content
  const syncedContent = source.content.map(sourceItem => {
    const existingTarget = targetMap.get(sourceItem.props?.id);

    if (existingTarget && existingTarget.type === sourceItem.type) {
      // Component exists in target - preserve text fields, update structure
      return {
        ...sourceItem,
        props: mergeProps(sourceItem.props, existingTarget.props),
      };
    } else {
      // New component - copy structure but clear text fields
      return {
        ...sourceItem,
        props: clearTextProps(sourceItem.props),
      };
    }
  });

  return {
    ...content,
    [targetLocale]: {
      content: syncedContent,
      root: source.root,
    },
  };
}

/**
 * Clear text fields from props but keep structure
 */
function clearTextProps(props: any): any {
  if (!props) return props;

  const cleared = { ...props };
  const textFields = ['text', 'title', 'description', 'label', 'placeholder'];

  // Clear text fields
  textFields.forEach(field => {
    if (field in cleared && typeof cleared[field] === 'string') {
      cleared[field] = '';
    }
  });

  // Handle nested slot content (like in Hero components)
  const slotFields = [
    'leftColumn',
    'rightColumn',
    'leftColumnTop',
    'leftColumnBottom',
    'rightColumnTop',
    'rightColumnBottom',
  ];

  slotFields.forEach(field => {
    if (Array.isArray(cleared[field])) {
      cleared[field] = cleared[field].map((item: any) => ({
        ...item,
        props: clearTextProps(item.props),
      }));
    }
  });

  return cleared;
}

/**
 * Merge props while preserving target text content
 */
function mergeProps(sourceProps: any, targetProps: any): any {
  if (!sourceProps) return targetProps;
  if (!targetProps) return clearTextProps(sourceProps);

  const merged = { ...sourceProps };
  const textFields = ['text', 'title', 'description', 'label', 'placeholder'];

  // Preserve existing text fields from target
  textFields.forEach(field => {
    if (field in targetProps && targetProps[field]) {
      merged[field] = targetProps[field];
    }
  });

  // Handle nested slot content
  const slotFields = [
    'leftColumn',
    'rightColumn',
    'leftColumnTop',
    'leftColumnBottom',
    'rightColumnTop',
    'rightColumnBottom',
  ];

  slotFields.forEach(field => {
    if (Array.isArray(sourceProps[field])) {
      if (Array.isArray(targetProps[field]) && targetProps[field].length > 0) {
        // Merge slot items
        merged[field] = sourceProps[field].map((sourceItem: any, index: number) => {
          const targetItem = targetProps[field][index];
          if (targetItem && targetItem.type === sourceItem.type) {
            return {
              ...sourceItem,
              props: mergeProps(sourceItem.props, targetItem.props),
            };
          }
          return {
            ...sourceItem,
            props: clearTextProps(sourceItem.props),
          };
        });
      } else {
        // No target content - clear text fields
        merged[field] = sourceProps[field].map((item: any) => ({
          ...item,
          props: clearTextProps(item.props),
        }));
      }
    }
  });

  return merged;
}
