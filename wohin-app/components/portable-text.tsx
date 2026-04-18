import React from "react";
import { Text, View, StyleSheet, Linking } from "react-native";
import { useAppTheme } from "@/hooks/use-app-theme";

interface PortableTextSpan {
  _type: "span";
  text: string;
  marks?: string[];
}

interface PortableTextBlock {
  _key?: string;
  _type: "block";
  style?: string;
  children?: PortableTextSpan[];
  listItem?: "bullet";
  markDefs?: { _key: string; _type: string; href?: string }[];
}

function renderSpan(
  span: PortableTextSpan,
  markDefs: PortableTextBlock["markDefs"],
  index: number,
  theme: any,
) {
  const style: any[] = [];
  let onPress: (() => void) | undefined;

  for (const mark of span.marks ?? []) {
    if (mark === "strong") style.push(styles.bold);
    else if (mark === "em") style.push(styles.italic);
    else {
      const def = markDefs?.find((d) => d._key === mark);
      if (def?._type === "link" && def.href) {
        style.push([styles.link, { color: theme.accent.peach }]);
        const href = def.href;
        onPress = () => Linking.openURL(href);
      }
    }
  }

  return (
    <Text key={index} style={style} onPress={onPress}>
      {span.text}
    </Text>
  );
}

function renderBlock(block: PortableTextBlock, index: number, theme: any) {
  const blockStyle =
    block.style === "h1"
      ? [styles.h1, { color: theme.ink }]
      : block.style === "h2"
        ? [styles.h2, { color: theme.ink }]
        : block.style === "h3"
          ? [styles.h3, { color: theme.ink }]
          : block.style === "blockquote"
            ? [styles.blockquote, { color: theme.muted, borderLeftColor: theme.accent.peach }]
            : [styles.paragraph, { color: theme.ink }];

  const content = (
    <Text key={block._key ?? index} style={blockStyle}>
      {block.children?.map((child, i) =>
        renderSpan(child, block.markDefs, i, theme),
      )}
    </Text>
  );

  if (block.listItem === "bullet") {
    return (
      <View key={block._key ?? index} style={styles.bulletRow}>
        <Text style={[styles.bullet, { color: theme.ink }]}>•</Text>
        {content}
      </View>
    );
  }

  return content;
}

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  const theme = useAppTheme();
  if (!value?.length) return null;
  return <View style={styles.container}>{value.map((block, i) => renderBlock(block, i, theme))}</View>;
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  paragraph: { fontSize: 16, lineHeight: 24, opacity: 0.8 },
  h1: { fontSize: 28, fontWeight: "900" },
  h2: { fontSize: 22, fontWeight: "900" },
  h3: { fontSize: 18, fontWeight: "800" },
  blockquote: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
    borderLeftWidth: 3,
    paddingLeft: 12,
  },
  bold: { fontWeight: "700" },
  italic: { fontStyle: "italic" },
  link: { textDecorationLine: "underline" },
  bulletRow: { flexDirection: "row", gap: 8, paddingLeft: 4 },
  bullet: { fontSize: 16, opacity: 0.5 },
});
