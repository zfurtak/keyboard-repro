import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { KeyboardAwareScrollView, useKeyboardHandler } from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';

interface ListItem {
  id: string;
  label: string;
  value: string;
}

export default function HomeScreen() {
  const [items] = useState<ListItem[]>(
    Array.from({ length: 50 }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i + 1}`,
      value: '',
    }))
  );
  
  // const screenHeight = Dimensions.get('window').height;
  // const viewRef = useRef<View>(null);
  // const bottomOffset = useRef(0);
  const keyboardHeight = useSharedValue(0);

  const changeKeyboardHeight = ({height}: {height: number}) => {
      'worklet';

      keyboardHeight.set(height);
  };

  useKeyboardHandler({
      onStart: changeKeyboardHeight,
      onMove: changeKeyboardHeight,
      onEnd: changeKeyboardHeight,
  });

//   const scrollToFocusedInput = () => {
//     if (!viewRef.current) {
//         return;
//     }

//     viewRef.current.measureInWindow((_x, _y, _width, height) => {
//             if (keyboardHeight.get() >= 1.0) {
//                 return;
//             }
//             bottomOffset.current =
//                 screenHeight - height;
//     });
// };

  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});
  const listRef = useRef<FlashListRef<ListItem>>(null);

  const handleItemPress = (item: ListItem) => {
    const inputRef = inputRefs.current[item.id];
    if (inputRef) {
      inputRef.focus();
    }
  };

  const handleInputFocus = (item: ListItem) => {
    const itemIndex = items.findIndex((i) => i.id === item.id);
    if (itemIndex !== -1 && listRef.current) {
      listRef.current?.scrollToIndex({
        index: itemIndex,
        viewPosition: 0.5,
      });
    }
    console.log(`Focused item: ${item.label} at index: ${itemIndex}`);
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    return (
      <Pressable
        style={styles.itemContainer}
        onPress={() => handleItemPress(item)}
        android_ripple={{ color: '#ccc' }}
      >
        <View style={styles.itemContent}>
          <Text style={styles.itemLabel}>{item.label}</Text>
          <TextInput
            ref={(ref) => {
              inputRefs.current[item.id] = ref;
            }}
            style={styles.textInput}
            placeholder="Tap to focus"
            placeholderTextColor="#999"
            onFocus={() => handleInputFocus(item)}
            onBlur={() => {
              console.log(`Blurred item: ${item.id}`);
            }}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <View
    // ref={viewRef}
      style={styles.container}
      // onLayout={() => scrollToFocusedInput()}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">FlashList Keyboard Test</ThemedText>
          <ThemedText style={styles.subtitle}>
            Tap any item to focus the input and open the keyboard
          </ThemedText>
        </ThemedView>
        <FlashList
          ref={listRef}
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          maintainVisibleContentPosition={{disabled: true}}
          renderScrollComponent={
            KeyboardAwareScrollView
            
        }
        />
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  itemContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 2,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    flex: 1,
  },
});
