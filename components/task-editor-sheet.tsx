import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppTheme, Colors, Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Task } from "@/types";

type TaskEditorSheetProps = {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isNewTask?: boolean;
};

export function TaskEditorSheet({
  visible,
  task,
  onClose,
  onSave,
  onDelete,
  isNewTask = false,
}: TaskEditorSheetProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [isCurrent, setIsCurrent] = useState(false);

  useEffect(() => {
    if (!task) {
      return;
    }

    setTitle(task.title);
    setNotes(task.notes);
    setEstimatedPomodoros(task.estimatedPomodoros);
    setIsCurrent(task.isCurrent);
  }, [task]);

  const canSave = useMemo(() => title.trim().length > 0, [title]);

  if (!task) {
    return null;
  }

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    onSave({
      ...task,
      title: title.trim(),
      notes: notes.trim(),
      estimatedPomodoros,
      isCurrent,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <KeyboardAvoidingView
          style={styles.sheetHost}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={[
              styles.sheet,
              { backgroundColor: palette.card, borderColor: palette.border },
            ]}
          >
            <View
              style={[styles.grabber, { backgroundColor: palette.border }]}
            />
            <ScrollView
              contentContainerStyle={[
                styles.sheetContent,
                { paddingBottom: Math.max(insets.bottom, AppTheme.spacing.xl) },
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <Text style={[styles.eyebrow, { color: palette.textMuted }]}>
                  Task Details
                </Text>
                <Text style={[styles.titleLabel, { color: palette.text }]}>
                  {isNewTask ? "New task" : "Edit task"}
                </Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: palette.textMuted }]}>
                  Title
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Task title"
                  placeholderTextColor={palette.textMuted}
                  style={[
                    styles.input,
                    {
                      color: palette.text,
                      borderColor: palette.border,
                      backgroundColor: palette.surface,
                    },
                  ]}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: palette.textMuted }]}>
                  Notes
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Optional notes"
                  placeholderTextColor={palette.textMuted}
                  multiline
                  textAlignVertical="top"
                  style={[
                    styles.notesInput,
                    {
                      color: palette.text,
                      borderColor: palette.border,
                      backgroundColor: palette.surface,
                    },
                  ]}
                />
              </View>

              <View style={[styles.fieldGroup, styles.stepperGroup]}>
                <Text style={[styles.fieldLabel, { color: palette.textMuted }]}>
                  Estimated pomodoros
                </Text>
                <View
                  style={[
                    styles.stepper,
                    {
                      borderColor: palette.border,
                      backgroundColor: palette.surface,
                    },
                  ]}
                >
                  <Pressable
                    onPress={() =>
                      setEstimatedPomodoros((value) => Math.max(1, value - 1))
                    }
                    style={({ pressed }) => [
                      styles.stepperButton,
                      pressed && { backgroundColor: palette.surfaceMuted },
                    ]}
                  >
                    <Text
                      style={[styles.stepperSymbol, { color: palette.text }]}
                    >
                      -
                    </Text>
                  </Pressable>
                  <Text style={[styles.stepperValue, { color: palette.text }]}>
                    {estimatedPomodoros}
                  </Text>
                  <Pressable
                    onPress={() => setEstimatedPomodoros((value) => value + 1)}
                    style={({ pressed }) => [
                      styles.stepperButton,
                      pressed && { backgroundColor: palette.surfaceMuted },
                    ]}
                  >
                    <Text
                      style={[styles.stepperSymbol, { color: palette.text }]}
                    >
                      +
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View
                style={[
                  styles.currentRow,
                  {
                    borderColor: palette.border,
                    backgroundColor: palette.surface,
                  },
                ]}
              >
                <View style={styles.currentCopy}>
                  <Text style={[styles.currentTitle, { color: palette.text }]}>
                    Set as current task
                  </Text>
                  <Text
                    style={[styles.currentDetail, { color: palette.textMuted }]}
                  >
                    Show this task in the current focus card.
                  </Text>
                </View>
                <Switch
                  value={isCurrent}
                  onValueChange={setIsCurrent}
                  trackColor={{
                    false: palette.surfaceMuted,
                    true: palette.accent,
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.actions}>
                {!isNewTask ? (
                  <Pressable
                    onPress={() => onDelete(task.id)}
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      {
                        borderColor: palette.border,
                        backgroundColor: pressed
                          ? palette.surface
                          : palette.card,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.secondaryButtonText, { color: "#FF3B30" }]}
                    >
                      Delete
                    </Text>
                  </Pressable>
                ) : null}
                <Pressable
                  onPress={handleSave}
                  disabled={!canSave}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    {
                      backgroundColor: !canSave
                        ? palette.surfaceMuted
                        : pressed
                          ? palette.tintStrong
                          : palette.tint,
                      flex: isNewTask ? 1 : 1.4,
                    },
                  ]}
                >
                  <Text style={styles.primaryButtonText}>Add Task</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  sheetHost: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  sheet: {
    borderTopLeftRadius: AppTheme.radius.lg,
    borderTopRightRadius: AppTheme.radius.lg,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: "82%",
  },
  grabber: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: AppTheme.radius.pill,
    marginTop: AppTheme.spacing.sm,
  },
  sheetContent: {
    paddingHorizontal: AppTheme.spacing.lg,
    paddingTop: AppTheme.spacing.md,
    paddingBottom: AppTheme.spacing.xl,
    gap: AppTheme.spacing.md,
  },
  header: {
    gap: 4,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  titleLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 24,
    fontWeight: "800",
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: AppTheme.radius.md,
    paddingHorizontal: AppTheme.spacing.md,
    fontSize: 16,
    fontWeight: "600",
  },
  notesInput: {
    minHeight: 116,
    borderWidth: 1,
    borderRadius: AppTheme.radius.md,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    fontSize: 15,
    lineHeight: 22,
  },
  stepperGroup: {
    alignItems: "flex-start",
  },
  stepper: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: AppTheme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  stepperButton: {
    width: 52,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperSymbol: {
    fontSize: 24,
    fontWeight: "600",
  },
  stepperValue: {
    minWidth: 54,
    textAlign: "center",
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: "700",
  },
  currentRow: {
    borderWidth: 1,
    borderRadius: AppTheme.radius.md,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: AppTheme.spacing.md,
  },
  currentCopy: {
    flex: 1,
    gap: 4,
  },
  currentTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: "700",
  },
  currentDetail: {
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: AppTheme.spacing.sm,
    paddingTop: AppTheme.spacing.xs,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  primaryButton: {
    flex: 1.4,
    minHeight: 52,
    borderRadius: AppTheme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
