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
  const styles: any[] = [];
  let onPress: (() => void) | undefined;
  let className = "";

  for (const mark of span.marks ?? []) {
    if (mark === "strong") className += " font-bold";
    else if (mark === "em") className += " italic";
    else {
      const def = markDefs?.find((d) => d._key === mark);
      if (def?._type === "link" && def.href) {
        className += " underline";
        styles.push({ color: theme.accent.peach });
        const href = def.href;
        onPress = () => Linking.openURL(href);
      }
    }
  }

  return (
    <Text key={index} className={className} style={StyleSheet.flatten(styles)} onPress={onPress}>
      {span.text}
    </Text>
  );
}

function renderBlock(block: PortableTextBlock, index: number, theme: any) {
  let blockClassName = "text-base leading-6 opacity-80";
  const blockStyles: any[] = [{ color: theme.ink }];

  if (block.style === "h1") {
    blockClassName = "text-[28px] font-black";
  } else if (block.style === "h2") {
    blockClassName = "text-[22px] font-black";
  } else if (block.style === "h3") {
    blockClassName = "text-[18px] font-extrabold";
  } else if (block.style === "blockquote") {
    blockClassName = "text-base leading-6 italic border-l-[3px] pl-3";
    blockStyles.push({ color: theme.muted, borderLeftColor: theme.accent.peach });
  }

  const content = (
    <Text key={block._key ?? index} className={blockClassName} style={StyleSheet.flatten(blockStyles)}>
      {block.children?.map((child, i) =>
        renderSpan(child, block.markDefs, i, theme),
      )}
    </Text>
  );

  if (block.listItem === "bullet") {
    return (
      <View key={block._key ?? index} className="flex-row gap-2 pl-1">
        <Text className="text-base opacity-50" style={{ color: theme.ink }}>•</Text>
        {content}
      </View>
    );
  }

  return content;
}

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  const theme = useAppTheme();
  if (!value?.length) return null;
  return <View className="gap-2">{value.map((block, i) => renderBlock(block, i, theme))}</View>;
}
