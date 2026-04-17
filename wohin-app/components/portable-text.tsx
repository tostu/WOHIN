import React from "react";
import { Text, View, StyleSheet, Linking } from "react-native";

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
) {
  const style: any[] = [];
  let onPress: (() => void) | undefined;

  for (const mark of span.marks ?? []) {
    if (mark === "strong") style.push(styles.bold);
    else if (mark === "em") style.push(styles.italic);
    else {
      const def = markDefs?.find((d) => d._key === mark);
      if (def?._type === "link" && def.href) {
        style.push(styles.link);
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

function renderBlock(block: PortableTextBlock, index: number) {
  const blockStyle =
    block.style === "h1"
      ? styles.h1
      : block.style === "h2"
        ? styles.h2
        : block.style === "h3"
          ? styles.h3
          : block.style === "blockquote"
            ? styles.blockquote
            : styles.paragraph;

  const content = (
    <Text key={block._key ?? index} style={blockStyle}>
      {block.children?.map((child, i) =>
        renderSpan(child, block.markDefs, i),
      )}
    </Text>
  );

  if (block.listItem === "bullet") {
    return (
      <View key={block._key ?? index} style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        {content}
      </View>
    );
  }

  return content;
}

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return <View style={styles.container}>{value.map(renderBlock)}</View>;
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  paragraph: { fontSize: 16, lineHeight: 24, color: "#2c2b29", opacity: 0.8 },
  h1: { fontSize: 28, fontWeight: "900", color: "#2c2b29" },
  h2: { fontSize: 22, fontWeight: "900", color: "#2c2b29" },
  h3: { fontSize: 18, fontWeight: "800", color: "#2c2b29" },
  blockquote: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8b8a87",
    fontStyle: "italic",
    borderLeftWidth: 3,
    borderLeftColor: "#ffb7b2",
    paddingLeft: 12,
  },
  bold: { fontWeight: "700" },
  italic: { fontStyle: "italic" },
  link: { color: "#ffb7b2", textDecorationLine: "underline" },
  bulletRow: { flexDirection: "row", gap: 8, paddingLeft: 4 },
  bullet: { fontSize: 16, color: "#2c2b29", opacity: 0.5 },
});
