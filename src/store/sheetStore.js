import { create } from "zustand";
import sampleData from "../data/sheet.json";

const STORAGE_KEY = "question-sheet-data";

const loadInitialData = () => {
  // 1. Get data from JSON file
  let fileData = [];
  if (Array.isArray(sampleData)) {
    fileData = sampleData;
  } else if (sampleData && sampleData.topics) {
    fileData = sampleData.topics;
  }

  // 2. Check LocalStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      console.log("No storage found. Loading from JSON file.");
      return fileData;
    }
    
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      console.log("Loading from LocalStorage.");
      return parsed;
    }
    
    console.log("Storage was empty/invalid. Loading from JSON file.");
    return fileData;
  } catch (e) {
    return fileData;
  }
};

const useSheetStore = create((set, get) => ({
  /* ======================
     STATE
  ====================== */
  topics: load(),

  /* ======================
     BASIC SET
  ====================== */
  setTopics: (topics) => set({ topics: save(topics) }),

  /* ======================
     TOPIC CRUD
  ====================== */
addTopic: (title) =>
    set((state) => ({
      topics: save([
        ...state.topics,
        {
          id: crypto.randomUUID(),
          title: title,
          subTopics: [], // Start with an empty list of subtopics
        },
      ]),
    })),
  editTopic: (topicId, title) =>
    set((state) => ({
      topics: save(
        state.topics.map((t) =>
          t.id === topicId ? { ...t, title } : t
        )
      ),
    })),

  deleteTopic: (topicId) =>
    set((state) => ({
      topics: save(state.topics.filter((t) => t.id !== topicId)),
    })),

  /* ======================
     SUBTOPIC CRUD
  ====================== */
addSubTopic: (topicId, title) =>
  set((state) => ({
    topics: save(
      state.topics.map((topic) =>
        topic.id !== topicId
          ? topic
          : {
              ...topic,
              subTopics: [
                ...topic.subTopics,
                {
                  id: crypto.randomUUID(),
                  title,
                  questions: [],
                },
              ],
            }
      )
    ),
  })),


  editSubTopic: (topicId, subId, title) =>
    set((state) => ({
      topics: save(
        state.topics.map((topic) =>
          topic.id !== topicId
            ? topic
            : {
                ...topic,
                subTopics: topic.subTopics.map((sub) =>
                  sub.id === subId ? { ...sub, title } : sub
                ),
              }
        )
      ),
    })),

  deleteSubTopic: (topicId, subId) =>
    set((state) => ({
      topics: save(
        state.topics.map((topic) =>
          topic.id !== topicId
            ? topic
            : {
                ...topic,
                subTopics: topic.subTopics.filter(
                  (sub) => sub.id !== subId
                ),
              }
        )
      ),
    })),

  /* ======================
     QUESTION CRUD
  ====================== */
  addQuestion: (topicId, subId, title) =>
    set((state) => ({
      topics: save(
        state.topics.map((topic) =>
          topic.id !== topicId
            ? topic
            : {
                ...topic,
                subTopics: topic.subTopics.map((sub) =>
                  sub.id !== subId
                    ? sub
                    : {
                        ...sub,
                        questions: [
                          ...sub.questions,
                          {
                            id: crypto.randomUUID(),
                            title,
                            solved: false,
                          },
                        ],
                      }
                ),
              }
        )
      ),
    })),

  editQuestion: (topicId, subId, qId, title) =>
    set((state) => ({
      topics: save(
        state.topics.map((topic) =>
          topic.id !== topicId
            ? topic
            : {
                ...topic,
                subTopics: topic.subTopics.map((sub) =>
                  sub.id !== subId
                    ? sub
                    : {
                        ...sub,
                        questions: sub.questions.map((q) =>
                          q.id === qId ? { ...q, title } : q
                        ),
                      }
                ),
              }
        )
      ),
    })),

  deleteQuestion: (topicId, subId, qId) =>
    set((state) => ({
      topics: save(
        state.topics.map((topic) =>
          topic.id !== topicId
            ? topic
            : {
                ...topic,
                subTopics: topic.subTopics.map((sub) =>
                  sub.id !== subId
                    ? sub
                    : {
                        ...sub,
                        questions: sub.questions.filter(
                          (q) => q.id !== qId
                        ),
                      }
                ),
              }
        )
      ),
    })),

  toggleQuestion: (topicId, subId, qId) =>
    set((state) => ({
      topics: save(
        state.topics.map((topic) =>
          topic.id !== topicId
            ? topic
            : {
                ...topic,
                subTopics: topic.subTopics.map((sub) =>
                  sub.id !== subId
                    ? sub
                    : {
                        ...sub,
                        questions: sub.questions.map((q) =>
                          q.id === qId
                            ? { ...q, solved: !q.solved }
                            : q
                        ),
                      }
                ),
              }
        )
      ),
    })),

  /* ======================
     DRAG & DROP
  ====================== */
  reorderSubTopics: (topicId, from, to) =>
    set((state) => ({
      topics: save(
        state.topics.map((topic) => {
          if (topic.id !== topicId) return topic;
          const items = [...topic.subTopics];
          const [moved] = items.splice(from, 1);
          items.splice(to, 0, moved);
          return { ...topic, subTopics: items };
        })
      ),
    })),

  reorderQuestions: (topicId, subId, from, to) =>
    set((state) => ({
      topics: save(
        state.topics.map((topic) =>
          topic.id !== topicId
            ? topic
            : {
                ...topic,
                subTopics: topic.subTopics.map((sub) => {
                  if (sub.id !== subId) return sub;
                  const items = [...sub.questions];
                  const [moved] = items.splice(from, 1);
                  items.splice(to, 0, moved);
                  return { ...sub, questions: items };
                }),
              }
        )
      ),
    })),
}));

export default useSheetStore;
