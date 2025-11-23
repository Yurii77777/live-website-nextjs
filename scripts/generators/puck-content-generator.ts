import * as fs from "fs";
import * as path from "path";
import type { Locale } from "@/i18n/routing";

type PuckContent = {
  type: string;
  props: Record<string, any>;
};

type PuckData = {
  content: PuckContent[];
  root: Record<string, any>;
};

// Translations for UI Kit content
const translations = {
  uk: {
    pageTitle: "Бібліотека UI компонентів",
    pageDescription: "Повна демонстрація всіх UI компонентів, взятих безпосередньо з директорії components/ui. Ця сторінка автоматично згенерована на основі фактичних визначень компонентів.",
    source: "Джерело",
    button: {
      text: "Натисніть мене",
    },
    heading: {
      example: "Приклад заголовка",
    },
    paragraph: {
      example: (variant: string) => `Це приклад параграфа ${variant}. Він демонструє, як виглядає текст з цим варіантом.`,
    },
    link: {
      text: "Приклад посилання",
    },
    hero: {
      leftColumn: "Ліва колонка",
      rightColumn: "Права колонка",
      leftTop: "Ліва верхня",
      leftBottom: "Ліва нижня",
      rightTop: "Права верхня",
      rightBottom: "Права нижня",
      leftContent: "Це контент лівої колонки Hero компонента.",
      rightContent: "Це контент правої колонки Hero компонента.",
      firstRowLeft: "Перший рядок лівої колонки.",
      secondRowLeft: "Другий рядок лівої колонки.",
      firstRowRight: "Перший рядок правої колонки.",
      secondRowRight: "Другий рядок правої колонки.",
    },
  },
  en: {
    pageTitle: "UI Component Library",
    pageDescription: "A comprehensive showcase of all UI components extracted directly from the components/ui directory. This page is auto-generated based on actual component definitions.",
    source: "Source",
    button: {
      text: "Click Me",
    },
    heading: {
      example: "Heading Example",
    },
    paragraph: {
      example: (variant: string) => `This is an example of a ${variant} paragraph. It demonstrates how text appears with this variant.`,
    },
    link: {
      text: "Example Link",
    },
    hero: {
      leftColumn: "Left Column",
      rightColumn: "Right Column",
      leftTop: "Left Top",
      leftBottom: "Left Bottom",
      rightTop: "Right Top",
      rightBottom: "Right Bottom",
      leftContent: "This is the left column content of the Hero component.",
      rightContent: "This is the right column content of the Hero component.",
      firstRowLeft: "First row of the left column.",
      secondRowLeft: "Second row of the left column.",
      firstRowRight: "First row of the right column.",
      secondRowRight: "Second row of the right column.",
    },
  },
};

type ComponentVariant = {
  name: string;
  options: string[];
};

type ComponentMetadata = {
  name: string;
  fileName: string;
  variants: ComponentVariant[];
  defaultVariants: Record<string, any>;
  specialProps?: Record<string, any>;
};

/**
 * Parse CVA variants from component file content
 */
function parseVariantsFromFile(content: string): ComponentVariant[] {
  const variants: ComponentVariant[] = [];

  // Find the cva() call and extract variants object
  const cvaMatch = content.match(/cva\s*\([^,]*,\s*{[\s\S]*?variants:\s*{([\s\S]*?)}/);

  if (!cvaMatch) return variants;

  const variantsBlock = cvaMatch[1];

  // Extract each variant property (e.g., variant: { ... }, size: { ... })
  const variantRegex = /(\w+):\s*{([^}]+)}/g;
  let match;

  while ((match = variantRegex.exec(variantsBlock)) !== null) {
    const variantName = match[1];
    const variantOptions = match[2];

    // Extract option names (keys before the colon)
    const optionMatches = variantOptions.matchAll(/(\w+):\s*(?:\[|")/g);
    const options = Array.from(optionMatches, (m) => m[1]);

    if (options.length > 0) {
      variants.push({
        name: variantName,
        options,
      });
    }
  }

  return variants;
}

/**
 * Parse default variants from component file content
 */
function parseDefaultVariants(content: string): Record<string, any> {
  const defaultVariants: Record<string, any> = {};

  // Find defaultVariants object
  const defaultMatch = content.match(/defaultVariants:\s*{([^}]+)}/);

  if (!defaultMatch) return defaultVariants;

  const defaultsBlock = defaultMatch[1];

  // Extract key-value pairs (strings, numbers, booleans)
  const pairRegex = /(\w+):\s*(?:"([^"]+)"|(\d+)|(true|false))/g;
  let match;

  while ((match = pairRegex.exec(defaultsBlock)) !== null) {
    const key = match[1];
    const stringValue = match[2];
    const numberValue = match[3];
    const boolValue = match[4];

    if (stringValue !== undefined) {
      defaultVariants[key] = stringValue;
    } else if (numberValue !== undefined) {
      defaultVariants[key] = parseInt(numberValue, 10);
    } else if (boolValue !== undefined) {
      defaultVariants[key] = boolValue === "true";
    }
  }

  return defaultVariants;
}

/**
 * Parse icon names from icon.tsx file
 */
function parseIconNames(content: string): string[] {
  const iconNames: string[] = [];

  // Find iconMap object
  const iconMapMatch = content.match(/iconMap\s*=\s*{([^}]+)}/s);

  if (!iconMapMatch) return iconNames;

  const iconMapBlock = iconMapMatch[1];

  // Extract icon names (keys in the iconMap)
  const nameMatches = iconMapBlock.matchAll(/(\w+Icon):/g);

  for (const match of nameMatches) {
    iconNames.push(match[1]);
  }

  return iconNames;
}

/**
 * Scan components/ui directory and extract component metadata
 */
export function scanUIComponents(uiDir: string): ComponentMetadata[] {
  const components: ComponentMetadata[] = [];

  const files = fs.readdirSync(uiDir).filter((file) => file.endsWith(".tsx"));

  for (const file of files) {
    const filePath = path.join(uiDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const componentName = path.basename(file, ".tsx");
    const capitalizedName =
      componentName.charAt(0).toUpperCase() + componentName.slice(1);

    const variants = parseVariantsFromFile(content);
    const defaultVariants = parseDefaultVariants(content);

    const metadata: ComponentMetadata = {
      name: capitalizedName,
      fileName: file,
      variants,
      defaultVariants,
    };

    // Special handling for Icon component
    if (componentName === "icon") {
      const iconNames = parseIconNames(content);
      metadata.specialProps = {
        iconNames,
      };
    }

    components.push(metadata);
  }

  return components;
}

/**
 * Generate unique ID for component
 */
let idCounter = 0;
function generateId(): string {
  idCounter++;
  return `component-${idCounter}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate example content for a single component variant
 */
function generateComponentExample(
  componentName: string,
  props: Record<string, any>
): PuckContent {
  return {
    type: componentName,
    props: {
      id: generateId(),
      ...props,
    },
  };
}

/**
 * Generate descriptive text content for a component variant
 */
function getExampleText(componentName: string, locale: Locale, variantValue?: string): string {
  const t = translations[locale];

  const componentExamples: Record<string, string> = {
    Button: t.button.text,
    Heading: t.heading.example,
    Paragraph: t.paragraph.example(variantValue || "default"),
    Link: t.link.text,
  };

  return componentExamples[componentName] || `${componentName} Example`;
}

/**
 * Generate single example for a component with default props
 */
function generateComponentVariants(
  metadata: ComponentMetadata,
  locale: Locale
): PuckContent[] {
  const { name, defaultVariants, specialProps } = metadata;
  const t = translations[locale];

  // Start with defaultVariants or empty object
  const props: Record<string, any> = { ...defaultVariants };

  // Special handling for Icon component
  if (name === "Icon") {
    if (specialProps?.iconNames && specialProps.iconNames.length > 0) {
      props.name = specialProps.iconNames[0]; // First icon
    }
    if (!props.size) {
      props.size = 24; // Fallback size
    }
    if (!props.variant) {
      props.variant = "inline"; // Fallback variant
    }
  }

  // Special handling for HeroTwoColumn component (with slots)
  if (name === "Hero-two-column" || name === "HeroTwoColumn") {
    props.leftColumn = [
      {
        type: "Heading",
        props: {
          id: generateId(),
          text: t.hero.leftColumn,
          variant: "h2",
          align: "left",
          className: "",
        },
      },
      {
        type: "Paragraph",
        props: {
          id: generateId(),
          text: t.hero.leftContent,
          variant: "default",
          align: "left",
          className: "",
        },
      },
    ];
    props.rightColumn = [
      {
        type: "Heading",
        props: {
          id: generateId(),
          text: t.hero.rightColumn,
          variant: "h2",
          align: "left",
          className: "",
        },
      },
      {
        type: "Paragraph",
        props: {
          id: generateId(),
          text: t.hero.rightContent,
          variant: "default",
          align: "left",
          className: "",
        },
      },
    ];
    if (!props.spacing) props.spacing = "lg";
    if (!props.padding) props.padding = "md";
    if (!props.columns) props.columns = "1-1";
  }

  // Special handling for HeroFlexibleGrid component (with 4 slots)
  if (name === "Hero-flexible-grid" || name === "HeroFlexibleGrid") {
    props.leftColumnRows = "2";
    props.rightColumnRows = "2";

    props.leftColumnTop = [
      {
        type: "Heading",
        props: {
          id: generateId(),
          text: t.hero.leftTop,
          variant: "h3",
          align: "left",
          className: "",
        },
      },
      {
        type: "Paragraph",
        props: {
          id: generateId(),
          text: t.hero.firstRowLeft,
          variant: "default",
          align: "left",
          className: "",
        },
      },
    ];

    props.leftColumnBottom = [
      {
        type: "Heading",
        props: {
          id: generateId(),
          text: t.hero.leftBottom,
          variant: "h3",
          align: "left",
          className: "",
        },
      },
      {
        type: "Paragraph",
        props: {
          id: generateId(),
          text: t.hero.secondRowLeft,
          variant: "default",
          align: "left",
          className: "",
        },
      },
    ];

    props.rightColumnTop = [
      {
        type: "Heading",
        props: {
          id: generateId(),
          text: t.hero.rightTop,
          variant: "h3",
          align: "left",
          className: "",
        },
      },
      {
        type: "Paragraph",
        props: {
          id: generateId(),
          text: t.hero.firstRowRight,
          variant: "default",
          align: "left",
          className: "",
        },
      },
    ];

    props.rightColumnBottom = [
      {
        type: "Heading",
        props: {
          id: generateId(),
          text: t.hero.rightBottom,
          variant: "h3",
          align: "left",
          className: "",
        },
      },
      {
        type: "Paragraph",
        props: {
          id: generateId(),
          text: t.hero.secondRowRight,
          variant: "default",
          align: "left",
          className: "",
        },
      },
    ];

    if (!props.spacing) props.spacing = "lg";
    if (!props.rowSpacing) props.rowSpacing = "md";
    if (!props.padding) props.padding = "md";
    if (!props.columns) props.columns = "1-1";
  }

  // Add text/content for text-based components
  if (["Button", "Heading", "Paragraph", "Link"].includes(name)) {
    props.text = getExampleText(name, locale);
  }

  if (name === "Link") {
    props.href = "#";
  }

  // Ensure Button has required props
  if (name === "Button") {
    if (!props.variant) props.variant = "default";
    if (!props.size) props.size = "md";
  }

  // Ensure Heading has required props
  if (name === "Heading") {
    if (!props.variant) props.variant = "h1";
    if (!props.align) props.align = "left";
  }

  // Ensure Paragraph has required props
  if (name === "Paragraph") {
    if (!props.variant) props.variant = "default";
    if (!props.align) props.align = "left";
  }

  // Ensure Link has required props
  if (name === "Link") {
    if (!props.variant) props.variant = "inline";
  }

  return [generateComponentExample(name, props)];
}

/**
 * Generate complete UI Kit page content from scanned components
 */
export function generateUIKitContent(uiDir: string, locale: Locale = "uk"): PuckData {
  // Reset counter for consistent IDs
  idCounter = 0;

  const t = translations[locale];
  const content: PuckContent[] = [];

  // Page header
  content.push(generateComponentExample("Heading", {
    text: t.pageTitle,
    variant: "h1",
    align: "center",
  }));

  content.push(generateComponentExample("Paragraph", {
    text: t.pageDescription,
    variant: "lead",
    align: "center",
  }));

  // Scan components
  const components = scanUIComponents(uiDir);

  // Filter out Input and Dropdown-menu (not suitable for static display)
  const displayableComponents = components.filter(
    (c) => !["Input", "Dropdown-menu"].includes(c.name)
  );

  // Generate sections for each component
  for (const component of displayableComponents) {
    // Component section header
    content.push(generateComponentExample("Heading", {
      text: component.name,
      variant: "h2",
    }));

    content.push(generateComponentExample("Paragraph", {
      text: `${t.source}: components/ui/${component.fileName}`,
      variant: "small",
    }));

    // Generate single example for this component
    const examples = generateComponentVariants(component, locale);

    // Add the example (should be only one)
    examples.forEach(example => content.push(example));
  }

  return {
    content,
    root: {},
  };
}
