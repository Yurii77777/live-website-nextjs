import * as fs from "fs";
import * as path from "path";

type PuckContent = {
  type: string;
  props: Record<string, any>;
};

type PuckData = {
  content: PuckContent[];
  root: Record<string, any>;
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
function getExampleText(componentName: string, variantValue?: string): string {
  const componentExamples: Record<string, string> = {
    Button: "Click Me",
    Heading: `${componentName} Example`,
    Paragraph: `This is an example of a ${variantValue || "default"} paragraph. It demonstrates how text appears with this variant.`,
    Link: "Example Link",
  };

  return componentExamples[componentName] || `${componentName} Example`;
}

/**
 * Generate single example for a component with default props
 */
function generateComponentVariants(
  metadata: ComponentMetadata
): PuckContent[] {
  const { name, defaultVariants, specialProps } = metadata;

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
          text: "Left Column",
          variant: "h2",
          align: "left",
          className: "",
        },
      },
      {
        type: "Paragraph",
        props: {
          id: generateId(),
          text: "This is the left column content of the Hero component.",
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
          text: "Right Column",
          variant: "h2",
          align: "left",
          className: "",
        },
      },
      {
        type: "Paragraph",
        props: {
          id: generateId(),
          text: "This is the right column content of the Hero component.",
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
          text: "Left Top",
          variant: "h3",
          align: "left",
          className: "",
        },
      },
      {
        type: "Paragraph",
        props: {
          id: generateId(),
          text: "First row of the left column.",
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
          text: "Left Bottom",
          variant: "h3",
          align: "left",
          className: "",
        },
      },
      {
        type: "Paragraph",
        props: {
          id: generateId(),
          text: "Second row of the left column.",
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
          text: "Right Top",
          variant: "h3",
          align: "left",
          className: "",
        },
      },
      {
        type: "Paragraph",
        props: {
          id: generateId(),
          text: "First row of the right column.",
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
          text: "Right Bottom",
          variant: "h3",
          align: "left",
          className: "",
        },
      },
      {
        type: "Paragraph",
        props: {
          id: generateId(),
          text: "Second row of the right column.",
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
    props.text = getExampleText(name);
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
export function generateUIKitContent(uiDir: string): PuckData {
  // Reset counter for consistent IDs
  idCounter = 0;

  const content: PuckContent[] = [];

  // Page header
  content.push(generateComponentExample("Heading", {
    text: "UI Component Library",
    variant: "h1",
    align: "center",
  }));

  content.push(generateComponentExample("Paragraph", {
    text: "A comprehensive showcase of all UI components extracted directly from the components/ui directory. This page is auto-generated based on actual component definitions.",
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
      text: `Source: components/ui/${component.fileName}`,
      variant: "small",
    }));

    // Generate single example for this component
    const examples = generateComponentVariants(component);

    // Add the example (should be only one)
    examples.forEach(example => content.push(example));
  }

  return {
    content,
    root: {},
  };
}
