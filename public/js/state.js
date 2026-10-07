// Shared in-memory app state (student data or teacher data, whichever is logged in).

export const app = {
  user: null,          // { role, id, name }
  student: null,       // student record (student mode) — null in teacher preview
  settings: null,      // class settings (taught skills, taught words, thresholds)
  assignments: [],
  progress: [],
  responses: [],
  notes: [],
  teacher: null,       // full teacher state (teacher mode)
  preview: null,       // { moduleId, level } when the teacher previews an activity
  onToolboxOpen: null, // set by the exercise runner to record toolbox use per item
};

export const isPreview = () => !!app.preview;
