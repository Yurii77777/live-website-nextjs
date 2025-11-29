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
  // Keep text from source so user can translate it
  if (!target || !target.content || target.content.length === 0) {
    return {
      ...content,
      [targetLocale]: {
        content: source.content.map(item => ({
          ...item,
          props: copyTextProps(item.props),
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
      // New component - copy structure WITH text from source
      // User can translate it manually
      return {
        ...sourceItem,
        props: copyTextProps(sourceItem.props),
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
 * Copy text fields from source props (don't clear them)
 * User can then translate the text manually
 */
function copyTextProps(props: any): any {
  if (!props) return props;

  const copied = { ...props };

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
    if (Array.isArray(copied[field])) {
      copied[field] = copied[field].map((item: any) => ({
        ...item,
        props: copyTextProps(item.props),
      }));
    }
  });

  return copied;
}

/**
 * Merge props while preserving target text content
 */
function mergeProps(sourceProps: any, targetProps: any): any {
  if (!sourceProps) return targetProps;
  if (!targetProps) return copyTextProps(sourceProps);

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
            props: copyTextProps(sourceItem.props),
          };
        });
      } else {
        // No target content - copy text from source
        merged[field] = sourceProps[field].map((item: any) => ({
          ...item,
          props: copyTextProps(item.props),
        }));
      }
    }
  });

  return merged;
}
